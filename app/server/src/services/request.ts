export class RequestService {
     private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private calculateBackoffDelay(attempt: number): number {
    // Exponential backoff: 1s, 2s, 4s with jitter
    const exponentialDelay = INITIAL_RETRY_DELAY * Math.pow(2, attempt);
    const jitter = Math.random() * 1000; // Add up to 1s random jitter
    return exponentialDelay + jitter;
  }

  private async fetchWithCache<T>(url: string, cacheKey: string): Promise<T> {
    const cached = cacheService.get<T>(cacheKey);
    if (cached) {
      return cached;
    }

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const { statusCode, headers, body } = await request(url, {
          method: 'GET',
          headersTimeout: REQUEST_TIMEOUT,
          bodyTimeout: REQUEST_TIMEOUT,
        });

        if (statusCode === 200) {
          const data = await body.json() as T;
          cacheService.set(cacheKey, data);
          return data;
        }

        // Handle rate limiting (429) with exponential backoff
        if (statusCode === 429) {
          const retryAfter = headers['retry-after'];
          const delay = retryAfter 
            ? parseInt(retryAfter as string, 10) * 1000 
            : this.calculateBackoffDelay(attempt);
          
          console.warn(`Rate limited on ${url}, retrying after ${delay}ms (attempt ${attempt + 1}/${MAX_RETRIES})`);
          
          if (attempt < MAX_RETRIES) {
            await this.sleep(delay);
            continue;
          }
        }

        // Handle server errors (5xx) with exponential backoff
        if (statusCode >= 500 && statusCode < 600) {
          const delay = this.calculateBackoffDelay(attempt);
          console.warn(`Server error ${statusCode} on ${url}, retrying after ${delay}ms (attempt ${attempt + 1}/${MAX_RETRIES})`);
          
          if (attempt < MAX_RETRIES) {
            await this.sleep(delay);
            continue;
          }
        }

        // Client errors (4xx) other than 429 should not be retried
        if (statusCode >= 400 && statusCode < 500) {
          throw new Error(`PokeAPI request failed: ${statusCode}`);
        }

        throw new Error(`Unexpected status code: ${statusCode}`);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        // Check if it's a timeout or network error
        if (
          lastError.message.includes('timeout') ||
          lastError.message.includes('ECONNREFUSED') ||
          lastError.message.includes('ETIMEDOUT') ||
          lastError.message.includes('EAI_AGAIN')
        ) {
          const delay = this.calculateBackoffDelay(attempt);
}
export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout = 800
): Promise<Response> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    if (error) {
      console.log(`Skipping ${url}!`);
    }
    throw error;
  }
}

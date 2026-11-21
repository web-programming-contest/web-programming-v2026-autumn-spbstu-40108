const API_BASE_URL = (
  import.meta.env.VITE_API_URL ?? 'http://localhost:8080'
).replace(/\/$/, '');

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

function extractMessage(body: unknown): string {
  if (typeof body === 'string' && body.trim()) {
    return body;
  }

  if (body && typeof body === 'object' && 'message' in body) {
    const message = (body as { message: unknown }).message;

    if (Array.isArray(message)) {
      const messages = message.filter(
        (item): item is string => typeof item === 'string',
      );

      if (messages.length > 0) {
        return messages.join(' ');
      }
    }

    if (typeof message === 'string' && message.trim()) {
      return message;
    }
  }

  return 'Не удалось выполнить запрос. Попробуйте снова.';
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers);

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (!response.ok) {
    let body: unknown;

    try {
      body = await response.json();
    } catch {
      body = await response.text();
    }

    throw new ApiError(response.status, extractMessage(body));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

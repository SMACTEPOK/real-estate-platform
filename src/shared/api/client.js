/**
 * HTTP-клієнт для спілкування з mock REST API (MSW).
 *
 * Основні задачі:
 *   • єдина точка входу для всіх запитів;
 *   • автоматичне проставляння `Authorization: Bearer <token>`
 *     для захищених endpoints;
 *   • робота з localStorage (навчальне рішення — у production
 *     краще httpOnly cookies);
 *   • однаковий формат помилок через клас ApiError.
 *
 * Модуль не залежить від MSW: якщо завтра MSW замінити на реальний
 * бекенд, достатньо змінити базовий URL або прибрати префікс /api.
 */

const TOKEN_KEY = 'estate.token';
const USER_KEY = 'estate.user';

export class ApiError extends Error {
  constructor(message, status, payload) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
  }
}

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    /* localStorage недоступний — ігноруємо */
  }
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user) {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch {
    /* ignore */
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch {
    /* ignore */
  }
}

/**
 * Виконує HTTP-запит до /api<path>.
 *
 * @param {string} path — шлях без префікса /api, наприклад "/properties"
 * @param {Object} [options]
 * @param {'GET'|'POST'|'PUT'|'PATCH'|'DELETE'} [options.method]
 * @param {Object} [options.body] — буде JSON.stringify-нуто
 * @param {Object} [options.headers]
 * @param {boolean} [options.auth] — додати Bearer-токен
 * @returns {Promise<any>}
 * @throws {ApiError}
 */
export async function apiRequest(path, options = {}) {
  const { method = 'GET', body, headers = {}, auth = false } = options;

  const finalHeaders = { 'Content-Type': 'application/json', ...headers };
  if (auth) {
    const token = getToken();
    if (token) {
      finalHeaders.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(`/api${path}`, {
    method,
    headers: finalHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  const isJson = response.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const message = (data && data.message) || `Помилка ${response.status}`;
    throw new ApiError(message, response.status, data);
  }

  return data;
}

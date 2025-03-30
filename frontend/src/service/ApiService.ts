import AppError from "@src/utils/AppError";

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

export const fetchApi = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const response = await fetch(`${BASE_API_URL}${endpoint}`, {
    headers: {
      ...options.headers,
    },
    ...options,
  });

  if (response.status === 204) {
    return {} as T;
  }

  let jsonResponse;
  try {
    jsonResponse = await response.json();
  } catch (error) {
    throw new AppError(`Invalid JSON response from server`, response.status);
  }

  if (!response.ok) {
    throw new AppError(
      jsonResponse?.message ?? `Error: ${response.status} ${response.statusText}`,
      jsonResponse?.statusCode ?? response.status ?? 500
    );
  }

  return jsonResponse.data !== undefined ? jsonResponse.data as T : jsonResponse as T;
};

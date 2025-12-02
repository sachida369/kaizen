import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

// Get the API base URL from environment or use relative path
function getApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    // Browser environment - use VITE_API_URL if set, otherwise use relative URL
    const viteApiUrl = import.meta.env.VITE_API_URL;
    if (viteApiUrl) {
      return viteApiUrl;
    }
  }
  // Fallback to relative URL (same origin)
  return "";
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const baseUrl = getApiBaseUrl();
  const fullUrl = baseUrl ? `${baseUrl}${url}` : url;
  
  const sessionId = localStorage.getItem("sessionId");
  const headers: Record<string, string> = data ? { "Content-Type": "application/json" } : {};
  
  if (sessionId) {
    headers["Authorization"] = `Bearer ${sessionId}`;
  }

  const res = await fetch(fullUrl, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const baseUrl = getApiBaseUrl();
    const fullUrl = baseUrl
      ? `${baseUrl}${queryKey.join("/")}`
      : (queryKey.join("/") as string);
    
    const sessionId = localStorage.getItem("sessionId");
    const headers: Record<string, string> = {};
    
    if (sessionId) {
      headers["Authorization"] = `Bearer ${sessionId}`;
    }

    const res = await fetch(fullUrl, {
      headers,
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

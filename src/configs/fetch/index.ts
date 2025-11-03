import envConfig from "@configs/env";
import { getSession, signOut } from "next-auth/react";
import { authOptions } from "@lib/authOptions";
import { getServerSession } from "next-auth";
import { ROUTES } from "@routes";
import { toast } from "react-toastify";
type CustomOptions = RequestInit & {
  baseUrl?: string;
  skipAuth?: boolean; // Thêm option để skip auth check
};

const request = async <Response>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  url: string,
  options: CustomOptions = {}
) => {
  let accessToken: string | undefined;

  // Skip auth check nếu được chỉ định (cho Google OAuth, register, etc.)
  if (!options.skipAuth) {
    try {
      let session: any;
      if (typeof window !== "undefined") {
        session = await getSession();
      } else {
        session = await getServerSession(authOptions);
      }

      // Kiểm tra nếu session không tồn tại (token đã bị xóa)
      if (!session || !session.user || !session.accessToken) {
        if (typeof window !== "undefined") {
          // Chỉ chuyển hướng nếu không nằm trong các trang public
          const currentPath = window.location.pathname;
          const publicPaths = ["/", "/introduce", "/contact", "/about"]; // các trang public phía client
          const isPublicPath = publicPaths.some(
            (p) => currentPath === p || (p !== "/" && currentPath.startsWith(p))
          );

          const isAuthPage = currentPath.includes('/auth/') || currentPath.includes('/login') || currentPath.includes('/register');

          if (!isAuthPage && !isPublicPath) {
            await signOut({ callbackUrl: ROUTES.AUTH.LOGIN });
            toast.error("Phiên làm việc hết hạn, vui lòng đăng nhập lại");
          }
        }
        return { error: "Session expired" } as Response;
      }

      accessToken = (session as any)?.accessToken;
    } catch (error) {
      console.error("Error getting session:", error);
    }
  }

  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
    ...options.headers,
  };

  const baseUrl = options.baseUrl === undefined
    ? (options.baseUrl === '/api' ? '' : envConfig?.NEXT_PUBLIC_API_URL)
    : options.baseUrl;

  const fullUrl = `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;

  const res = await fetch(fullUrl, {
    ...options,
    method,
    headers,
    body: isFormData ? options.body : options.body ? JSON.stringify(options.body) : undefined,
  });


  return await res.json() as Response;
};

const http = {
  get: <T>(url: string, options?: Omit<CustomOptions, "body">) => request<T>("GET", url, options),
  post: <T>(url: string, body: any, options?: Omit<CustomOptions, "body">) => request<T>("POST", url, { ...options, body }),
  put: <T>(url: string, body: any, options?: Omit<CustomOptions, "body">) => request<T>("PUT", url, { ...options, body }),
  patch: <T>(url: string, body: any, options?: Omit<CustomOptions, "body">) => request<T>("PATCH", url, { ...options, body }),
  delete: <T>(url: string, body: any, options?: Omit<CustomOptions, "body">) => request<T>("DELETE", url, { ...options, body }),
  // Thêm method không cần auth
  getPublic: <T>(url: string, options?: Omit<CustomOptions, "body">) => request<T>("GET", url, { ...options, skipAuth: true }),
  postPublic: <T>(url: string, body: any, options?: Omit<CustomOptions, "body">) => request<T>("POST", url, { ...options, body, skipAuth: true }),
};

export default http;
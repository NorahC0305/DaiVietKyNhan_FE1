"use server";

import { revalidateTag, revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@lib/authOptions";
import envConfig from "@configs/env";

/**
 * Server Action generic để gọi bất kỳ API nào và tự động revalidate cache
 * 
 * Flow:
 * 1. Client → serverMutation (Server Action)
 * 2. → Gọi NestJS API (POST/PUT/DELETE/PATCH)
 * 3. → Nếu NestJS trả về thành công (status 200, 201, ...)
 * 4. → NextJS tự động gọi revalidateTag('...') và/hoặc revalidatePath('...')
 * 5. → Trả kết quả về lại client
 * 
 * @param endpoint - API endpoint (ví dụ: "/posts", "/letter", "/kynhan")
 * @param method - HTTP method (POST, PUT, DELETE, PATCH)
 * @param data - Data để gửi đến NestJS (có thể là object hoặc FormData)
 * @param options - Options cho revalidation
 * @param options.tag - Tag name để revalidate cache (phải match với tag trong GET request)
 * @param options.path - Path để revalidate (ví dụ: "/posts", "/library")
 * @param options.skipAuth - Bỏ qua authentication (default: false)
 * @returns Response từ NestJS
 */
export async function serverMutation<T = any>(
    endpoint: string,
    method: "POST" | "PUT" | "DELETE" | "PATCH",
    data?: any,
    options?: {
        tag?: string;
        path?: string;
        skipAuth?: boolean;
    }
): Promise<T> {
    try {
        // Lấy session để có access token (tương tự như configs/fetch)
        let accessToken: string | undefined;

        if (!options?.skipAuth) {
            try {
                const session = await getServerSession(authOptions);
                if (session && (session as any)?.accessToken) {
                    accessToken = (session as any).accessToken;
                }
            } catch (error) {
                console.error("Error getting session:", error);
            }
        }

        // Xử lý FormData (tương tự như configs/fetch)
        const isFormData = data instanceof FormData;

        const headers: Record<string, string> = {
            ...(isFormData ? {} : { "Content-Type": "application/json" }),
            ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        };

        // Xây dựng URL (tương tự như configs/fetch)
        const baseUrl = envConfig?.NEXT_PUBLIC_API_URL;
        const fullUrl = `${baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

        // Bước 2: Gọi NestJS backend
        const res = await fetch(fullUrl, {
            method,
            headers,
            body: isFormData ? data : data ? JSON.stringify(data) : undefined,
        });

        // Bước 3: Kiểm tra nếu NestJS trả về thành công (status 200, 201, ...)
        if (!res.ok) {
            const error = await res.json().catch(() => ({
                message: `Failed to ${method.toLowerCase()} ${endpoint}`
            }));
            throw new Error(
                error.message ||
                error.error ||
                `Failed to ${method.toLowerCase()} ${endpoint}: ${res.statusText}`
            );
        }

        const result = await res.json();

        // Bước 4: Nếu thành công → NextJS tự động gọi revalidateTag và/hoặc revalidatePath
        if (options?.tag) {
            revalidateTag(options.tag);
        }
        if (options?.path) {
            revalidatePath(options.path);
        }

        // Bước 5: Trả kết quả về lại client
        return result;
    } catch (error) {
        console.error(`Error in serverMutation (${method} ${endpoint}):`, error);
        throw error;
    }
}

/**
 * Helper function để tạo mới (POST)
 * 
 * @example
 * ```tsx
 * "use client";
 * import { createApi } from "@/app/api/action/serverMutation";
 * 
 * const result = await createApi("/letter", { from: "...", to: "..." }, { tag: "letters" });
 * ```
 */
export async function createApi<T = any>(
    endpoint: string,
    data?: any,
    options?: { tag?: string; path?: string; skipAuth?: boolean }
): Promise<T> {
    return serverMutation<T>(endpoint, "POST", data, options);
}

/**
 * Helper function để cập nhật (PUT)
 * 
 * @example
 * ```tsx
 * "use client";
 * import { updateApi } from "@/app/api/action/serverMutation";
 * 
 * const result = await updateApi("/kynhan/1", formData, { tag: "kynhan" });
 * ```
 */
export async function updateApi<T = any>(
    endpoint: string,
    data?: any,
    options?: { tag?: string; path?: string; skipAuth?: boolean }
): Promise<T> {
    return serverMutation<T>(endpoint, "PUT", data, options);
}

/**
 * Helper function để cập nhật một phần (PATCH)
 */
export async function patchApi<T = any>(
    endpoint: string,
    data?: any,
    options?: { tag?: string; path?: string; skipAuth?: boolean }
): Promise<T> {
    return serverMutation<T>(endpoint, "PATCH", data, options);
}

/**
 * Helper function để xóa (DELETE)
 * 
 * @example
 * ```tsx
 * "use client";
 * import { deleteApi } from "@/app/api/action/serverMutation";
 * 
 * const result = await deleteApi("/posts/1", undefined, { tag: "posts" });
 * ```
 */
export async function deleteApi<T = any>(
    endpoint: string,
    data?: any,
    options?: { tag?: string; path?: string; skipAuth?: boolean }
): Promise<T> {
    return serverMutation<T>(endpoint, "DELETE", data, options);
}

/**
 * Alias cho serverMutation - có thể dùng trực tiếp nếu cần custom method
 */
export { serverMutation as mutateApi };


'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession, signIn } from "next-auth/react";
import { ROUTES } from "@routes";
import { ROLE } from "@constants/common";
import LoadingPage from "@components/Molecules/Loading";

const GoogleCompletePage = () => {
    const router = useRouter();

    useEffect(() => {
        const handleGoogleAuth = async () => {
            try {
                const params = new URLSearchParams(window.location.search);
                const userRaw = params.get("user");
                const accessToken = params.get("accessToken");
                const refreshToken = params.get("refreshToken");
                const error = params.get("error");

                // Handle Google OAuth error
                if (error) {
                    console.error("Google OAuth error:", error);
                    router.push(`${ROUTES.AUTH.LOGIN}?message=${encodeURIComponent("Đăng nhập Google thất bại")}`);
                    return;
                }

                if (!accessToken || !refreshToken || !userRaw) {
                    console.error("Missing Google auth parameters");
                    router.push(`${ROUTES.AUTH.LOGIN}?message=${encodeURIComponent("Thiếu thông tin xác thực từ Google")}`);
                    return;
                }

                const user = await JSON.parse(decodeURIComponent(userRaw));

                const res = await signIn("credentials", {
                    redirect: false,
                    email: user.email,
                    name: user.name,
                    password: "__google__",
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                });

                //#region Handle response
                const status = res?.status;

                //#region Handle success
                if (status === 200) {
                    const session = await getSession() as unknown as UTILS.ISession;

                    switch (session?.user?.role) {
                        case ROLE.CUSTOMER.ID:
                            router.push(ROUTES.PUBLIC.HOME);
                            break;
                        case ROLE.ADMIN.ID:
                            router.push(ROUTES.ADMIN_DASHBOARD.USER.INFO);
                            break;
                        default:
                            break;
                    }
                    router.refresh();
                    return;
                } else {
                    // Handle NextAuth error
                    console.error("NextAuth error:", res?.error);
                    router.push(`${ROUTES.AUTH.LOGIN}?message=${encodeURIComponent(res?.error || "Đăng nhập thất bại")}`);
                }
                //#endregion
            } catch (error) {
                console.error("Google auth error:", error);
                router.push(`${ROUTES.AUTH.LOGIN}?message=${encodeURIComponent("Đã xảy ra lỗi khi xử lý đăng nhập Google")}`);
            }
        };

        handleGoogleAuth();
    }, [router]);

    return (
        <LoadingPage />
    )
};

export default GoogleCompletePage;
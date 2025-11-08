'use client'

import type React from "react"
import Link from "next/link"
import { ROUTES } from "@routes"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import TransitionWrapper from "@components/Atoms/TransitionWrapper"
import { ArrowLeft, Mail } from "lucide-react"
import { useRouter } from "next/navigation"
import authService from "@services/auth"
import { useState } from "react"
import { Button } from "@components/Atoms/ui/button"
import { Input } from "@components/Atoms/ui/input"
import H1 from "@components/Atoms/H1"
import { IBackendResponse } from "@models/backend"
import { toast } from "react-toastify"
import { z } from "zod"

const ForgotPasswordPageClient = () => {
    const router = useRouter();

    //#region Handle form submit
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<{ email: string }>({
        resolver: zodResolver(z.object({ email: z.string().email() })),
    })

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const onSubmit = async (data: { email: string }) => {
        try {
            setIsLoading(true);

            // Call forgot password API directly to avoid session check
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: data.email }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                let errorMessage = "Email không tồn tại trong hệ thống";
                try {
                    const errorData = JSON.parse(errorText);
                    errorMessage = errorData.message || errorData.error || errorMessage;
                } catch {
                    errorMessage = errorText || errorMessage;
                }
                toast.error(errorMessage);
                return;
            }

            const res = await response.json();
            if (res.statusCode === 200 || res.statusCode === 201) {
                localStorage.setItem('email', data.email);
                toast.success("Chúng tôi đã gửi mã OTP đến email của bạn. Vui lòng kiểm tra email để tiếp tục đặt lại mật khẩu.");
                router.push(ROUTES.AUTH.VERIFY_OTP);
            } else {
                toast.error(res.message || "Email không tồn tại trong hệ thống");
            }

        } catch (error: any) {
            console.error("Forgot password error:", error);
            toast.error(error.message || "Đã xảy ra lỗi. Vui lòng thử lại sau.");
        } finally {
            setIsLoading(false);
        }
    };
    //#endregion

    return (
        <>
            {/* Main card container */}
            {/* Forgot - form */}
            <div className="w-full p-8 md:p-12">
                {/* Center logo */}
                <div className="flex justify-center items-center mb-4">
                    <div className="rounded-full flex justify-center items-center w-16 h-16 bg-gray-300">
                        <Mail className="w-8 h-8 text-primary font-bold" />
                    </div>
                </div>

                <div className="flex flex-col items-center">
                    <H1 className="text-2xl font-bold mb-2">Quên mật khẩu</H1>
                    <p className="text-description text-center text-holder  mb-8 whitespace-pre-line">Nhập thông tin liên hệ của bạn và chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className={"flex flex-col space-y-2"}>
                        <Input
                            id="email"
                            placeholder="Email của bạn"
                            {...register("email")}
                            className={errors.email ? 'input-error' : ''}
                        />
                        {/* {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>} */}
                    </div>

                    <Button type="submit" size="full" isLoading={isLoading} disabled={isLoading}>
                        Tiếp tục
                    </Button>
                </form>

                <p className="flex mt-5 justify-center items-center text-holder">
                    <Link href={ROUTES.AUTH.LOGIN} className="flex items-center hover:underline">
                        <ArrowLeft size={20} className="text-dark mr-2" />
                        <p className="font-sm text-dark">
                            Quay lại trang đăng nhập
                        </p>
                    </Link>
                </p>
                {/* --- End --- */}
            </div>
        </>
    )
}

export default ForgotPasswordPageClient
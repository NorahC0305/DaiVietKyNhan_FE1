'use client'

import type React from "react"
import Link from "next/link"
import { ROUTES } from "@routes"
import { useForm } from "react-hook-form"
import { ArrowLeft, KeyRoundIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import authService from "@services/auth"
import { Input } from "@components/Atoms/ui/input"
import { Button } from "@components/Atoms/ui/button"
import H1 from "@components/Atoms/H1"
import { useGetLocalStorage } from "@hooks/useLocalStorage"
import { toast } from "react-toastify"
import { IBackendResponse } from "@models/backend"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { IResetPasswordFormDataRequest, resetPasswordFormDataRequest } from "@models/user/request"

const ResetPassswordPage = () => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState<boolean>(false)

    /**
     * Get email from local storage
     */
    const { value: emailValue, isReady } = useGetLocalStorage('email')
    const { value: tokenValue } = useGetLocalStorage('token')
    //-----------------------------End-----------------------------//

    //#region Handle form submit
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<IResetPasswordFormDataRequest>({
        resolver: zodResolver(resetPasswordFormDataRequest),
        defaultValues: {
            email: emailValue || '',
            newPassword: '',
            confirmNewPassword: '',
        },
    })

    const onSubmit = async (data: IResetPasswordFormDataRequest) => {
        if (isLoading) return;

        try {
            setIsLoading(true);

            // Call reset password API directly to avoid session check
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenValue}`,
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorText = await response.text();
                let errorMessage = "Đặt lại mật khẩu thất bại";
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
                // Clean up localStorage
                localStorage.removeItem('email');
                localStorage.removeItem('token');

                toast.success('Đặt lại mật khẩu thành công');
                router.push(ROUTES.AUTH.LOGIN);
            } else {
                toast.error(res.message || 'Đặt lại mật khẩu thất bại');
            }

        } catch (error: any) {
            console.error("Reset password error:", error);
            toast.error(error.message || "Đã xảy ra lỗi. Vui lòng thử lại sau.");
        } finally {
            setIsLoading(false);
        }
    }
    //#endregion

    //#region check if email and token exist in local storage
    useEffect(() => {
        if (!isReady) return;

        if (!emailValue || !tokenValue) {
            toast.error("Phiên đặt lại mật khẩu đã hết hạn. Vui lòng thử lại.");
            router.push(ROUTES.AUTH.FORGOT_PASSWORD);
        } else {
            setValue('email', emailValue);
        }
    }, [isReady, emailValue, tokenValue, router, setValue])
    //#endregion

    return (
        <>
            {/* Forgot - form */}
            <div className="w-full p-8 md:p-12">
                {/* Center logo */}
                <div className="flex justify-center items-center mb-4" >
                    <div className="rounded-full flex justify-center items-center w-16 h-16 bg-gray-300">
                        <KeyRoundIcon className="w-8 h-8 text-primary font-bold" />
                    </div>
                </div >

                <div className="flex flex-col items-center">
                    <H1 className="text-2xl font-bold mb-2">Đặt lại mật khẩu</H1>
                    <p className="text-holder text-center mb-8 whitespace-pre-line">Nhập và ghi nhớ mật khẩu mới</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Email */}
                    <Input type="hidden" {...register('email')} />

                    {/* New Password */}
                    <div className="flex flex-col space-y-2  mb-2">
                        <label htmlFor="password" className=" text-holder text-sm font-medium">
                            Mật khẩu mới
                        </label>

                        <div className="flex flex-col space-y-2 mb-2">
                            <Input
                                id="password"
                                type="password"
                                togglePassword={true}
                                placeholder="Nhập mật khẩu mới"
                                {...register("newPassword")}
                                className={errors.newPassword ? 'input-error' : ''}
                            />
                            {errors.newPassword && <span className="text-red-500 text-sm">{errors.newPassword.message}</span>}
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="flex flex-col space-y-2 mb-4">
                        <label htmlFor="confirmPassword" className="text-holder text-sm font-medium">
                            Xác nhận mật khẩu
                        </label>

                        <div className="flex flex-col space-y-2 mb-2">
                            <Input
                                id="confirmPassword"
                                type="password"
                                togglePassword={true}
                                placeholder="Xác nhận mật khẩu mới"
                                {...register("confirmNewPassword")}
                                className={errors.confirmNewPassword ? 'input-error' : ''}
                            />
                            {errors.confirmNewPassword && <span className="text-red-500 text-sm">{errors.confirmNewPassword.message}</span>}
                        </div>
                    </div>

                    <Button type="submit" size="full" isLoading={isLoading} disabled={isLoading}>
                        {isLoading ? 'Đang xử lý...' : 'Xác nhận'}
                    </Button>
                </form>

                <p className="flex mt-5 justify-center items-center text-holder">
                    <Link
                        href={ROUTES.AUTH.FORGOT_PASSWORD}
                        className="flex flex-row items-center hover:underline"
                        onClick={() => {
                            localStorage.removeItem('email');
                            localStorage.removeItem('token');
                        }}
                    >
                        <ArrowLeft size={20} className="text-dark mr-2" />
                        <p className="font-sm text-dark">
                            Quay lại
                        </p>
                    </Link>
                </p>
            </div>
            {/* --- End --- */}
        </>
    )
}

export default ResetPassswordPage
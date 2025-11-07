'use client'

import type React from "react"
import Link from "next/link"
import { ROUTES } from "@routes"
import { useForm } from "react-hook-form"
import { Button } from "@components/Atoms/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, KeyRound } from "lucide-react"
import OTPInput from "@components/Atoms/OTPInput"
import { Input } from "@components/Atoms/ui/input"
import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useGetLocalStorage } from "@hooks/useLocalStorage"
import H1 from "@components/Atoms/H1"
import authService from "@services/auth"
import { IBackendResponse } from "@models/backend"
import { toast } from "react-toastify"
import { IVerifyOtpFormDataRequest, verifyOtpFormDataRequest } from "@models/user/request"
// import authService from "@services/auth"

const VerifyOtpPageClient = () => {
    //#region define variables
    const { value, isReady } = useGetLocalStorage('email')
    const router = useRouter()
    //#endregion


    //#region Handle form submit
    const {
        register,
        handleSubmit,
        setValue,
        trigger,
        formState: { errors },
    } = useForm<IVerifyOtpFormDataRequest>({
        resolver: zodResolver(verifyOtpFormDataRequest),
    })
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const onSubmit = async (data: IVerifyOtpFormDataRequest) => {
        try {
            setIsLoading(true)

            // Call verify OTP API directly to avoid session check
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorText = await response.text();
                let errorMessage = "Mã OTP không đúng";
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
            if (res.statusCode === 200) {
                localStorage.setItem('email', data.email)
                localStorage.setItem('token', res.data.accessToken)
                toast.success(res.message || 'Xác thực OTP thành công')
                router.push(ROUTES.AUTH.RESET_PASSWORD)
            } else {
                toast.error(res.message || 'Mã OTP không đúng')
            }

        } catch (error: any) {
            console.error("Verify OTP error:", error);
            toast.error(error.message || 'Đã xảy ra lỗi. Vui lòng thử lại sau.')
        } finally {
            setIsLoading(false)
        }
    }
    //#endregion


    //#region Handle OTP input change
    const handleOTPChange = useCallback((code: string) => {
        setValue('code', code)
        trigger('code')
    }, [setValue, trigger])
    //#endregion


    //#region Check email in localStorage and redirect if not found
    useEffect(() => {
        if (!isReady) return
        if (!value) {
            router.replace(ROUTES.AUTH.FORGOT_PASSWORD)
        } else {
            setValue('email', value || '')
        }
    }, [value, isReady, router, setValue])
    //#endregion


    //#region Countdown timer for OTP resend
    const [countdown, setCountdown] = useState<number>(0)
    useEffect(() => {
        if (countdown <= 0) return
        const interval = setInterval(() => {
            setCountdown((prev) => prev - 1)
        }, 1000)
        return () => clearInterval(interval)
    }, [countdown])

    const handleResendOTP = useCallback(async () => {
        setCountdown(60)
        // const res = await authService.sendOtp(value || '') as IBackendResponse<any>

        // if (res.statusCode !== 201) {
        //     toast.error(res.message || 'Gửi OTP thất bại')
        //     return
        // } else {
        //     toast.success(res.message || 'Gửi OTP thành công')
        // }

    }, [])
    //#endregion

    const handleBack = () => {
        router.back()
    }

    return (
        <div className="w-full p-8 md:p-12">
            {/* Center logo */}
            <div className="flex justify-center items-center mb-4">
                <div className="rounded-full flex justify-center items-center w-16 h-16 bg-grey">
                    <KeyRound className="w-8 h-8 text-primary font-bold" />
                </div>
            </div>

            <div className="flex flex-col items-center">
                <H1 className="text-2xl font-bold mb-2">Xác thực OTP</H1>
                <p className="text-holder text-center whitespace-pre-line">Nhập mã OTP đã được gửi đến email {value}</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Email */}
                <Input type="hidden" defaultValue={value || ''} {...register('email')} />

                {/* OTP */}
                <label htmlFor="otp" className="text-holder text-md mt-3">
                    Mã OTP
                </label>
                <div className="flex flex-col mt-2">
                    <input type="hidden" {...register('code')} />
                    <OTPInput length={6} error={!!errors.code} onChange={handleOTPChange} />
                </div>

                {/* Send OTP again */}
                <div className="flex justify-end">
                    {countdown > 0 ? (
                        <div className="flex justify-between items-center w-full">
                            {
                                errors.code ?
                                    <span className="text-red-500 text-sm">{"'" + errors.code.message + "'"}</span>
                                    : <span className="text-sm text-description"></span>
                            }
                            <span className="text-sm text-primary">Gửi lại mã OTP sau {countdown}s</span>
                        </div>
                    ) : (
                        <div className="flex justify-between items-center w-full">
                            {
                                errors.code ?
                                    <span className="text-red-500 text-sm">{"'" + errors.code.message + "'"}</span>
                                    : <span className="text-sm text-description"></span>
                            }
                            <p
                                onClick={handleResendOTP}
                                className="cursor-pointer text-sm text-primary font-medium hover:underline"
                            >
                                Gửi lại mã OTP
                            </p>
                        </div>

                    )}
                </div>
                <Button type="submit" style={{ width: "100%" }} isLoading={isLoading} disabled={isLoading}>
                    Tiếp tục
                </Button>
            </form>


            <div className="flex mt-5 justify-center items-center text-holder">
                <Link href={''} className="flex items-center font-sm text-dark hover:underline" onClick={handleBack}>
                    <ArrowLeft size={20} className="text-dark mr-2" />
                    <p className="font-sm text-dark">Quay lại</p>
                </Link>
            </div>
        </div>
    )
}

export default VerifyOtpPageClient
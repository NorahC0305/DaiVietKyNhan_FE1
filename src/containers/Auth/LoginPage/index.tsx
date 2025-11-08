"use client";

import Image from "next/image";
import logo from "../../../../public/logo_dvkn.svg";
import H1 from "@components/Atoms/H1";
import { Input } from "@components/Atoms/ui/input";
import { Button } from "@components/Atoms/ui/button";
import { MoveRight } from "lucide-react";
import { ROUTES } from "@routes";
import GoogleIcon from "@components/Atoms/GoogleIcon";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ILoginFormDataRequest,
  loginFormDataRequest,
} from "@models/user/request";
import authService from "@services/auth";
import { useEffect, useState, useRef } from "react";
import { getSession, signIn } from "next-auth/react";
import { ROLE } from "@constants/common";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@components/Atoms/ui/alert";
import { useEmailSelector, useUserSetEmail } from "@stores/user/selectors";
import { IBackendResponse } from "@models/backend";

const LoginPageClient = () => {
  /**
   * Define variables hooks
   */
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams?.get("message");
  //----------------------End----------------------//

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ILoginFormDataRequest>({
    resolver: zodResolver(loginFormDataRequest),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  /**
   * Define variables zustand
   */
  const email = useEmailSelector();
  const setEmail = useUserSetEmail();
  //-----------------------------End-----------------------------//

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const onSubmit = async (data: ILoginFormDataRequest) => {
    try {
      setLoading(true);

      const res = await signIn("credentials", {
        redirect: false,
        ...data,
      });

      //#region Handle response
      const status = res?.status;
      const error = res?.error;

      //#region Handle success
      if (status === 200) {
        const session = (await getSession()) as unknown as UTILS.ISession;

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
      }
      //#endregion

      //#region Handle error
      if (status === 401) {
        setError(error || "Đăng nhập thất bại");
        // const resSendOtp = await authService.sendOtp(data.email) as IBackendResponse<any>;
        // if (resSendOtp.statusCode !== 201) {
        //     toast.error(resSendOtp.message || "Gửi mã OTP thất bại");
        //     return;
        // }

        // setEmailToRedirect(data.email)
        // setCountdown(delay)
        return;
      } else {
        toast.error(res?.error || "Đăng nhập thất bại");
        return;
      }
      //#endregion
      //#endregion
    } catch (err) {
      toast.error("Đã xảy ra lỗi, vui lòng thử lại");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle resent verify account
   * @returns
   */
  const [countdown, setCountdown] = useState<number>(0);
  const handleResentVerifyAccount = async () => {
    const res = (await authService.resendVerifiedEmail(
      email
    )) as IBackendResponse<any>;
    if (res.statusCode !== 201) {
      setError(res.message || "Gửi lại email xác thực thất bại");
      return;
    }
    toast.success(res.message || "Gửi lại email xác thực thành công");
    setCountdown(60);
  };

  useEffect(() => {
    if (countdown <= 0) return;
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [countdown]);
  //--------------------End--------------------//

  /**
   * Handle google login
   */
  const handleGoogleLogin = async () => {
    try {
      const res = (await authService.googleLogin()) as IBackendResponse<any>;
      if (res.statusCode === 200) {
        window.location.href = res.data.url;
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi, vui lòng thử lại");
      console.error(error);
    }
  };
  //-----------------------------End-----------------------------//

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-xl flex flex-col px-8 md:px-16"
    >
      <section className="py-6 flex justify-center">
        <Image src={logo} alt="logo" width={100} height={100} />
      </section>
      {/* <KyNhanResult
        isOpen={true}
        onClose={() => {}}
        title="Bạn đã tìm ra danh tính của 2 vị Kỳ Nhân này. Bạn được cộng 100 điểm."
        content="Nguyễn Phúc Đảm (1791 - 1841), tức vua Minh Mạng..đạhkasbdsbadkjasbdjkasbdkjbasdbjkasbdjkabdjkabdkjabjkdbakjdbaksbdkjabdkjabskjdbaskjdbkjasbdkjasbdkjabkdbask.Nguyễn Phúc Đảm (1791 - 1841), tức vua Minh Mạng..đạhkasbdsbadkjasbdjkasbdkjbasdbjkasbdjkabdjkabdkjabjkdbakjdbaksbdkjabdkjabskjdbaskjdbkjasbdkjasbdkjabkdbask.Nguyễn Phúc Đảm (1791 - 1841), tức vua Minh Mạng..đạhkasbdsbadkjasbdjkasbdkjbasdbjkasbdjkabdjkabdkjabjkdbakjdbaksbdkjabdkjabskjdbaskjdbkjasbdkjasbdkjabkdbask.Nguyễn Phúc Đảm (1791 - 1841), tức vua Minh Mạng..đạhkasbdsbadkjasbdjkasbdkjbasdbjkasbdjkabdjkabdkjabjkdbakjdbaksbdkjabdkjabskjdbaskjdbkjasbdkjasbdkjabkdbask.Nguyễn Phúc Đảm (1791 - 1841), tức vua Minh Mạng..đạhkasbdsbadkjasbdjkasbdkjbasdbjkasbdjkabdjkabdkjabjkdbakjdbaksbdkjabdkjabskjdbaskjdbkjasbdkjasbdkjabkdbask.Nguyễn Phúc Đảm (1791 - 1841), tức vua Minh Mạng..đạhkasbdsbadkjasbdjkasbdkjbasdbjkasbdjkabdjkabdkjabjkdbakjdbaksbdkjabdkjabskjdbaskjdbkjasbdkjasbdkjabkdbask.Nguyễn Phúc Đảm (1791 - 1841), tức vua Minh Mạng..đạhkasbdsbadkjasbdjkasbdkjbasdbjkasbdjkabdjkabdkjabjkdbakjdbaksbdkjabdkjabskjdbaskjdbkjasbdkjasbdkjabkdbask.Nguyễn Phúc Đảm (1791 - 1841), tức vua Minh Mạng..đạhkasbdsbadkjasbdjkasbdkjbasdbjkasbdjkabdjkabdkjabjkdbakjdbaksbdkjabdkjabskjdbaskjdbkjasbdkjasbdkjabkdbask."
        points={100}
        kyNhan={[
          {
            id: 1,
            src: "https://res.cloudinary.com/dznt9yias/image/upload/v1760708027/kynhan/images/file_c8vhiw.png",
            alt: "Character 1",
            name: "THỊNH ĐIỆU",
          },
          {
            id: 2,
            src: "https://res.cloudinary.com/dznt9yias/image/upload/v1760707494/kynhan-summarys/images/file_re65kr.png",
            alt: "Character 2",
            name: "Bùi Thị Xuân",
          },
        ]}
        onContinue={() => console.log("Continue clicked")}
        onGoToLibrary={() => router.push("/library")}
        onFinalContinue={() => console.log("Final continue")}
      /> */}
      <H1 className="pb-6">Đăng nhập</H1>

      {(error || email) && (
        <Alert variant="error" className="mb-6">
          {email && error ? (
            <>
              <AlertDescription>{error}</AlertDescription>
              {countdown > 0 ? (
                <AlertDescription>Gửi lại sau {countdown}s</AlertDescription>
              ) : (
                <AlertDescription
                  onClick={handleResentVerifyAccount}
                  className="cursor-pointer font-bold"
                >
                  Gửi lại
                </AlertDescription>
              )}
            </>
          ) : email ? (
            <AlertDescription>
              Vui lòng kiểm tra mail <span className="font-bold">{email}</span>{" "}
              để xác thực tài khoản{" "}
            </AlertDescription>
          ) : (
            <AlertDescription>{error}</AlertDescription>
          )}
        </Alert>
      )}

      {message && !error && (
        <Alert variant="success" className="mb-6">
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <section className="flex flex-col gap-2 mb-6">
        <label className="text-md text-holder">Email</label>
        <Input
          {...register("email")}
          placeholder="Nhập email"
          type="email"
          className={errors.email ? "input-error" : ""}
        />
        {errors.email && (
          <span className="text-error text-sm">{errors.email.message}</span>
        )}
      </section>

      <section className="flex flex-col gap-2 mb-3">
        <label className="text-md text-holder">Mật khẩu</label>
        <Input
          {...register("password")}
          placeholder="Nhập mật khẩu"
          type="password"
          togglePassword={true}
          className={errors.password ? "input-error" : ""}
        />
        {errors.password && (
          <span className="text-error text-sm">{errors.password.message}</span>
        )}
      </section>

      <section className="flex justify-end mb-3">
        <Link
          href={ROUTES.AUTH.FORGOT_PASSWORD}
          className="text-sm text-primary"
        >
          Quên mật khẩu?
        </Link>
      </section>

      <section>
        <Button type="submit" size="full" isLoading={isSubmitting}>
          {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"} <MoveRight />
        </Button>
      </section>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center"></div>
          <div className="relative flex justify-center items-center text-sm mb-6">
            <div className="line"></div>
            <span className={`px-2 font-bold text-center text-holder`}>
              HOẶC TIẾP TỤC VỚI
            </span>
            <div className="line"></div>
          </div>
        </div>

        <div className="flex justify-center items-center gap-3 w-full">
          <button
            type="button"
            className="cursor-pointer w-full h-12 flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            onClick={handleGoogleLogin}
          >
            <GoogleIcon size="default" />
            Google
          </button>
        </div>
      </div>

      <p className="my-8 text-center text-sm text-holder">
        Bạn chưa có tài khoản?{" "}
        <Link href={ROUTES.AUTH.REGISTER} className="text-primary">
          Đăng ký ngay
        </Link>
      </p>
    </form>
  );
};

export default LoginPageClient;

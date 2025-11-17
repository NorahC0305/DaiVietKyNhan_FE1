"use client";

import Image from 'next/image';
import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import frame from "../../../../../public/frame.svg";
import { years } from '@utils/Date';
import userService from '@services/user';
import { UpdateMeBodySchema, IUpdateMeBodySchema } from '@models/user/request';
import { toast } from 'react-toastify';
import { USER } from '@constants/user';
import { useRouter } from 'next/navigation';
import { IBackendResponse } from '@models/backend';

const DetailInfo = () => {
    const router = useRouter();

    /**
     * Handle form submit
     */
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, handleSubmit, formState: { errors }, watch } = useForm<IUpdateMeBodySchema>({
        resolver: zodResolver(UpdateMeBodySchema),
        defaultValues: {
            gender: USER.GENDER.MALE,
            birthDate: undefined,
        }
    });

    const onSubmit: SubmitHandler<IUpdateMeBodySchema> = async (data) => {
        setIsSubmitting(true);
        try {
            const payload = {
                ...data,
            };

            const res = await userService.updateMe(payload) as IBackendResponse<any>;

            if (res.statusCode === 200) {
                toast.success(res.message || "Cập nhật thông tin thành công!");
                router.refresh();
            } else {
                toast.error(res.message || "Đã có lỗi xảy ra. Vui lòng thử lại.");
                return;
            }
        } catch (error: any) {
            toast.error(error.message || "Đã có lỗi xảy ra. Vui lòng thử lại.");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };
    //-----------------------------End-----------------------------//

    return (
        <div className='w-full flex items-center justify-center'>
            <div className='relative w-full max-w-5xl mx-auto'>
                <Image src='https://res.cloudinary.com/dauhpllo7/image/upload/v1763392813/khung_chi_ti%E1%BA%BFt_3_mhxweg.png' alt="Scroll Paper" className="w-full h-auto max-w-[1000px]" width={1000} height={1000} />

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] md:w-[80%] flex items-center justify-center flex-col"
                >
                    <h1 className='text-center text-6xl font-bd-street-sign text-secondary mb-2'>
                        THÔNG TIN CHI TIẾT
                    </h1>

                    <div className='relative w-full flex justify-center'>
                        <Image src="https://res.cloudinary.com/dauhpllo7/image/upload/v1763390553/khung_m%E1%BA%A1ng_xu_%C4%91i%E1%BB%83m_.._3_ij8bzq.png" alt="Frame" className="w-full h-auto max-w-[550px] md:max-w-[800px]" />

                        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] md:w-[45%] flex items-center justify-start flex-col space-y-2 sm:space-y-4'>
                            <div className='w-full flex items-center justify-start gap-2'>
                                <p className='text-center text-4xl font-bd-street-sign text-third'>
                                    GIỚI TÍNH
                                </p>
                                <div className='flex items-center justify-center gap-x-4 ml-7 text-sm md:text-xl md:justify-self-start'>
                                    <label className='flex items-center cursor-pointer'>
                                        <input
                                            type="radio"
                                            value={USER.GENDER.MALE}
                                            {...register("gender")}
                                            className='appearance-none peer'
                                        />
                                        <span className={`w-4 h-4 border-2 border-gray-700 rounded-full p-0.5 transition ${watch("gender") === USER.GENDER.MALE ? 'border-primary bg-primary' : ''} bg-clip-content`}></span>
                                        <span className='ml-2 font-dfvn-graphit text-third'>Nam</span>
                                    </label>
                                    <label className='flex items-center cursor-pointer'>
                                        <input
                                            type="radio"
                                            value={USER.GENDER.FEMALE}
                                            {...register("gender")}
                                            className='appearance-none peer'
                                        />
                                        <span className={`w-4 h-4 border-2 border-gray-700 rounded-full p-0.5 transition ${watch("gender") === USER.GENDER.FEMALE ? 'border-primary bg-primary' : ''} bg-clip-content`}></span>
                                        <span className='ml-2 font-dfvn-graphit text-third'>Nữ</span>
                                    </label>
                                </div>
                            </div>
                            {errors.gender && <p className='text-red-500 text-sm mt-1'>{errors.gender.message}</p>}


                            <div className='w-full flex items-center justify-start gap-2'>
                                <p className='text-center text-4xl font-bd-street-sign text-third'>
                                    NĂM SINH
                                </p>
                                <div className='relative flex items-center justify-center hover:opacity-95 ml-3 md:justify-self-start'>
                                    <Image src='https://res.cloudinary.com/dznt9yias/image/upload/v1760718877/Button_bb7ywk.svg' alt='Button' className='cursor-pointer w-[100px] h-auto sm:w-[130px]' width={100} height={130} />
                                    <select
                                        {...register("birthDate")}
                                        className='absolute left-1/2 -translate-x-1/2 w-[80%] h-full text-center text-sm font-dfvn-graphit bg-transparent border-none outline-none cursor-pointer'
                                    >
                                        <option value="" disabled>Chọn năm</option>
                                        {years.map((year) => (
                                            <option key={year} value={year}>{year}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            {errors.birthDate && <p className='text-red-500 text-sm mt-1'>{errors.birthDate.message}</p>}

                        </div>
                    </div>

                    <button type="submit" disabled={isSubmitting} className='relative flex justify-center cursor-pointer mt-4'>
                        <Image src='https://res.cloudinary.com/dznt9yias/image/upload/v1760718877/Button_bb7ywk.svg' alt="button" className="w-full h-auto max-w-[130px] md:max-w-[150px]" width={130} height={150} />
                        <div className='absolute w-full h-full flex items-center justify-start flex-col'>
                            <p className='flex items-center justify-center text-center font-dfvn-graphit h-full text-md'>
                                {isSubmitting ? "Đang xử lý..." : "Xác Nhận"}
                            </p>
                        </div>
                    </button>
                </form>
            </div>
        </div>
    )
}

export default DetailInfo;
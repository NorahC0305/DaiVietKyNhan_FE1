"use client";

import { Input } from '@components/Atoms/ui/input'
import { Textarea } from '@components/Atoms/ui/textarea'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SendLetterRequestSchema, ISendLetterRequest } from '@models/letter/request'
import letterService from '@services/letter'
import { toast } from 'react-toastify'
import { IBackendResponse } from '@models/backend'
import { z } from 'zod'
import LetterSentSuccess from '../LetterSentSuccess'

export type VietThuGuiHauTheProps = {
    isOpen: boolean
    onClose: () => void
    onBack?: () => void
}

const VietThuGuiHauThe: React.FC<VietThuGuiHauTheProps> = ({ isOpen, onClose, onBack }) => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
    const [kyNhanName, setKyNhanName] = useState<string>('')

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue
    } = useForm<ISendLetterRequest>({
        resolver: zodResolver(SendLetterRequestSchema),
        defaultValues: {
            from: '',
            to: '',
            content: ''
        }
    })

    const handleBack = () => {
        if (onBack) {
            onBack()
            return
        }
        onClose()
    }

    const handleClose = () => {
        reset()
        onClose()
    }

    const onSubmit: SubmitHandler<ISendLetterRequest> = async (data) => {
        if (isSubmitting) return

        try {
            setIsSubmitting(true)
            const response = await letterService.sendLetter(data) as IBackendResponse<z.ZodTypeAny>

            if (response.statusCode === 200 || response.statusCode === 201) {
                // Lưu tên kỳ nhân
                setKyNhanName(data.to)
                // Reset form trước
                reset()
                // Đóng form gửi thư
                onClose()
                // Hiển thị popup thành công sau một chút delay để animation mượt hơn
                setTimeout(() => {
                    setIsSuccessModalOpen(true)
                }, 300)
            } else {
                toast.error(response.message || 'Gửi thư thất bại. Vui lòng thử lại.')
            }
        } catch (error: any) {
            console.error('Send letter error:', error)
            toast.error(error.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleSuccessModalClose = () => {
        setIsSuccessModalOpen(false)
        setKyNhanName('')
    }

    // Use React Portal to render modal at root level
    if (typeof window === "undefined") return null;

    return (
        <>
            {createPortal(
                <AnimatePresence>
                    {isOpen && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center">
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center"
                                onClick={handleClose}
                            />

                            <div className="absolute inset-0" onClick={handleClose} >
                                <button
                                    className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 cursor-pointer p-2"
                                    onClick={handleClose}
                                    aria-label="Đóng"
                                >
                                    <span className="relative block h-8 w-8 sm:h-10 sm:w-10">
                                        <Image
                                            src="https://res.cloudinary.com/dauhpllo7/image/upload/v1763391063/Tr%E1%BB%9F_l%E1%BA%A1i_trang_tr%C6%B0%E1%BB%9Bc_t1jpaz.png"
                                            alt="Đóng"
                                            fill
                                            sizes="(max-width: 640px) 32px, 40px"
                                            style={{ objectFit: "contain" }}
                                        />
                                    </span>
                                </button>
                            </div>

                            <button
                                type='button'
                                className='absolute bottom-3 right-3 z-10 cursor-pointer p-2 w-[70px] h-[70px]'
                                onClick={handleBack}
                            >
                                <span className='relative block h-full w-full'>
                                    <Image src='https://res.cloudinary.com/dznt9yias/image/upload/v1760726102/Return_1_qwp1kh.svg' alt='Back' fill />
                                </span>
                            </button>

                            {/* Modal Content */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                className='relative mx-3 w-full lg:max-w-5xl max-w-3xl flex items-center justify-center'
                                onClick={(e) => e.stopPropagation()}
                            >
                                <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col items-center justify-center w-full' onClick={(e) => e.stopPropagation()}>
                                    <h2 className='text-white text-xl lg:text-2xl font-extrabold text-center'>Hãy viết một lá thư để bày tỏ đôi lời gửi tới vị Kỳ Nhân yêu thích</h2>

                                    <div className='relative lg:w-[900px] lg:h-[500px] w-[700px] h-[350px]'>
                                        <Image src='https://res.cloudinary.com/dauhpllo7/image/upload/v1763392813/khung_chi_ti%E1%BA%BFt_3_mhxweg.png' alt='Viet Thu Gui Hau The' fill />

                                        <div className='absolute w-full h-[100%] flex items-center justify-center inset-0'>
                                            <div className='absolute lg:w-[70%] w-[60%] lg:h-[70%] h-[60%] flex flex-col justify-center'>
                                                <div className='flex justify-between items-center'>
                                                    <div className='w-full'>
                                                        <div className='flex items-center justify-start mb-4'>
                                                            <div className='lg:w-[10%] w-[15%]'>
                                                                <span className='text-secondary text-lg font-bold'>Từ: </span>
                                                            </div>
                                                            <div className='lg:w-[70%] w-[70%]'>
                                                                <Input
                                                                    {...register('from')}
                                                                    className={`border-4 border-secondary !h-10 rounded-xl !w-full !text-black bg-[#C6BE9F] placeholder:text-gray-600 placeholder:text-sm placeholder:italic focus:outline-none focus:ring-0 ${errors.from ? 'border-red-500' : ''}`}
                                                                    placeholder='Tên của bạn'
                                                                />
                                                                {errors.from && (
                                                                    <p className='text-red-500 text-xs mt-1 ml-1'>{errors.from.message}</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className='flex items-center justify-start mb-4'>
                                                            <div className='lg:w-[10%] w-[15%]'>
                                                                <span className='text-secondary text-lg font-bold'>Đến: </span>
                                                            </div>
                                                            <div className='lg:w-[70%] w-[70%]'>
                                                                <Input
                                                                    {...register('to')}
                                                                    className={`border-4 border-secondary !h-10 rounded-xl !w-full !text-black bg-[#C6BE9F] placeholder:text-gray-600 placeholder:text-sm placeholder:italic focus:outline-none focus:ring-0 ${errors.to ? 'border-red-500' : ''}`}
                                                                    placeholder='Tên của vị Kỳ Nhân bạn muốn gửi'
                                                                />
                                                                {errors.to && (
                                                                    <p className='text-red-500 text-xs mt-1 ml-1'>{errors.to.message}</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <button
                                                        type='submit'
                                                        disabled={isSubmitting}
                                                        className='relative w-[120px] h-[40px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                                                    >
                                                        <Image src='https://res.cloudinary.com/dznt9yias/image/upload/v1760718877/Button_bb7ywk.svg' alt='Gui' fill />
                                                        <span className='absolute inset-0 flex items-center justify-center text-secondary text-lg font-bold'>
                                                            {isSubmitting ? 'Đang gửi...' : 'Gửi'}
                                                        </span>
                                                    </button>
                                                </div>

                                                <div className='flex flex-col items-center justify-center h-full w-full'>
                                                    <div className='bg-[#C6BE9F] rounded-xl h-full w-full'>
                                                        <Textarea
                                                            {...register('content')}
                                                            className={`border-4 border-secondary !h-full rounded-xl p-4 !text-lg placeholder:text-gray-600 placeholder:text-sm placeholder:italic focus:outline-none focus:ring-0 w-full ${errors.content ? 'border-red-500' : ''}`}
                                                            placeholder='Hãy ghi những lời chia sẻ vào đây.....'
                                                        />
                                                    </div>
                                                    {errors.content && (
                                                        <p className='text-red-500 text-xs mt-1 self-start'>{errors.content.message}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>

                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}

            {/* Success Modal */}
            <LetterSentSuccess
                isOpen={isSuccessModalOpen}
                onClose={handleSuccessModalClose}
                kyNhanName={kyNhanName}
            />
        </>
    )
}

export default VietThuGuiHauThe
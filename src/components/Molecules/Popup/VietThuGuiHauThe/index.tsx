import { Input } from '@components/Atoms/ui/input'
import { Textarea } from '@components/Atoms/ui/textarea'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import React from 'react'

type VietThuGuiHauTheProps = {
    isOpen: boolean
    onClose: () => void
}

//TODO: Integrate with API
const VietThuGuiHauThe = ({ isOpen, onClose }: VietThuGuiHauTheProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center"
                        onClick={onClose}
                    />

                    <div className="absolute inset-0" onClick={onClose} >
                        <button
                            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 cursor-pointer p-2"
                            onClick={onClose}
                            aria-label="Đóng"
                        >
                            <span className="relative block h-8 w-8 sm:h-10 sm:w-10">
                                <Image
                                    src="https://res.cloudinary.com/dznt9yias/image/upload/v1760721841/X_lqpgdp.svg"
                                    alt="Đóng"
                                    fill
                                    sizes="(max-width: 640px) 32px, 40px"
                                    style={{ objectFit: "contain" }}
                                />
                            </span>
                        </button>
                    </div>

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className='relative mx-3 w-full lg:max-w-5xl max-w-3xl flex items-center justify-center'
                    >
                        <div className='flex flex-col items-center justify-center'>
                            <h2 className='text-black text-xl lg:text-2xl font-extrabold text-center'>Hãy viết một lá thư để bày tỏ đôi lời gửi tới vị Kỳ Nhân yêu thích</h2>

                            <div className='relative lg:w-[900px] lg:h-[500px] w-[700px] h-[350px]'>
                                <Image src='https://res.cloudinary.com/dznt9yias/image/upload/v1760721989/ScrollPaper_dqmtkl.svg' alt='Viet Thu Gui Hau The' fill />

                                <div className='absolute w-full h-[100%] flex items-center justify-center inset-0'>
                                    <div className='absolute lg:w-[70%] w-[60%] lg:h-[70%] h-[60%] flex flex-col justify-center'>
                                        <div className='flex justify-between items-center'>
                                            <div className='w-full'>
                                                <div className='flex items-center justify-start mb-4'>
                                                    <div className='lg:w-[10%] w-[15%]'>
                                                        <span className='text-secondary text-lg font-bold'>Từ: </span>
                                                    </div>
                                                    <Input className='border-4 border-secondary !h-10 rounded-xl lg:!w-[70%] !w-[70%] !text-black bg-[#C6BE9F] placeholder:text-gray-600 placeholder:text-sm placeholder:italic focus:outline-none focus:ring-0' placeholder='Tên của bạn' />
                                                </div>
                                                <div className='flex items-center justify-start mb-4'>
                                                    <div className='lg:w-[10%] w-[15%]'>
                                                        <span className='text-secondary text-lg font-bold'>Đến: </span>
                                                    </div>
                                                    <Input className='border-4 border-secondary !h-10 rounded-xl lg:!w-[70%] !w-[70%] !text-black bg-[#C6BE9F] placeholder:text-gray-600 placeholder:text-sm placeholder:italic focus:outline-none focus:ring-0' placeholder='Tên của vị Kỳ Nhân bạn muốn gửi' />
                                                </div>
                                            </div>

                                            <div className='relative w-[120px] h-[40px] cursor-pointer'>
                                                <Image src='https://res.cloudinary.com/dznt9yias/image/upload/v1760718877/Button_bb7ywk.svg' alt='Gui' fill />
                                                <div className='absolute inset-0 flex items-center justify-center'>
                                                    <span className='text-secondary text-lg font-bold'>Gửi</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='flex items-center justify-center h-full inset-0 bg-[#C6BE9F] rounded-xl'>
                                            <Textarea className='border-4 border-secondary !h-full rounded-xl p-4 !text-lg placeholder:text-gray-600 placeholder:text-sm placeholder:italic focus:outline-none focus:ring-0' placeholder='Hãy ghi những lời chia sẻ vào đây.....' />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}

export default VietThuGuiHauThe
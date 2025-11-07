import { Input } from '@components/Atoms/ui/input'
import { Textarea } from '@components/Atoms/ui/textarea'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import React from 'react'

type ChiTietThuProps = {
    isOpen: boolean
    onClose: () => void
}

//TODO: Integrate with API
const ChiTietThu = ({ isOpen, onClose }: ChiTietThuProps) => {
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
                            {/* Cuộn giấy */}
                            <div className='relative lg:w-[1300px] lg:h-[700px] w-[700px] h-[400px]'>
                                <Image src='https://res.cloudinary.com/dznt9yias/image/upload/v1760721989/ScrollPaper_dqmtkl.svg' alt='Viet Thu Gui Hau The' fill />

                                <div className='absolute w-full h-[100%] flex items-center justify-center inset-0'>
                                    <div className='absolute lg:w-[60%] w-[60%] lg:h-[70%] h-[60%] flex flex-col justify-center'>
                                        {/* Title */}
                                        <div className='flex justify-center items-center lg:mb-5 mb-2'>
                                            <span className='text-secondary font-bd-street-sign lg:text-5xl text-3xl'>LÁ THƯ GỬI KỲ NHÂN - TÂM SỰ TỪ HẬU THẾ</span>
                                        </div>

                                        {/* Content */}
                                        <div className='relative w-full h-full'>
                                            <button
                                                type='button'
                                                className='absolute left-[-56px] top-1/2 -translate-y-1/2 w-[40px] h-[40px] cursor-pointer flex items-center justify-center'
                                            >
                                                <Image src='https://res.cloudinary.com/dznt9yias/image/upload/v1760721544/Back_cwp7tx.svg' alt='Prev' fill />
                                            </button>

                                            <button
                                                type='button'
                                                className='absolute right-[-56px] top-1/2 -translate-y-1/2 w-[40px] h-[40px] cursor-pointer flex items-center justify-center'
                                            >
                                                <Image src='https://res.cloudinary.com/dznt9yias/image/upload/v1760725883/next_xshxeb.svg' alt='Next' fill />
                                            </button>

                                            <div className='flex justify-between items-center'>
                                                <div className='w-full'>
                                                    <div className='flex items-center justify-start lg:mb-4 mb-1'>
                                                        <div className='lg:w-[10%] w-[15%]'>
                                                            <span className='text-secondary lg:text-lg text-sm font-bold'>Từ: </span>
                                                        </div>
                                                        <span className='text-[#CE7346] lg:text-lg text-sm font-bold italic'>Vũ Tiến Hùng nhí nhảnh</span>
                                                    </div>
                                                    <div className='flex items-center justify-start lg:mb-4 mb-1'>
                                                        <div className='lg:w-[10%] w-[15%]'>
                                                            <span className='text-secondary lg:text-lg text-sm font-bold'>Đến: </span>
                                                        </div>
                                                        <span className='text-[#CE7346] lg:text-lg text-sm font-bold italic'>Trần Hưng Đạo</span>
                                                    </div>
                                                </div>

                                                <div className='relative w-[120px] h-[40px] cursor-pointer flex flex-col items-end justify-end'>
                                                    <p className='text-secondary lg:text-lg text-sm font-bold'>Ngày gửi</p>
                                                    <p className='text-secondary lg:text-base text-sm italic'>01/11/2025</p>
                                                </div>
                                            </div>

                                            <div className='flex items-start justify-start lg:h-[80%] h-[70%] bg-[#F4ECD0] overflow-y-auto border-4 border-secondary rounded-xl px-4 py-2'>
                                                <span className='lg:text-base text-sm leading-relaxed whitespace-pre-line'>
                                                    Kính gửi Danh nhân Nguyễn Trãi – bậc anh hùng khai quốc, nhà văn hóa kiệt xuất của muôn đời,
                                                    Con xin được phép viết đôi dòng, như một lời tri ân gửi về quá khứ, nơi Người – với tấm lòng vì dân vì nước, đã để lại dấu ấn không phai trong lòng hậu thế.
                                                    Trải qua bao thế kỷ, tên tuổi của Người vẫn sáng rọi giữa non sông, như ánh sao dẫn đường cho những thế hệ sau trong hành trình tìm về lẽ nhân nghĩa và lòng trung hiếu. Những áng văn trong Bình Ngô đại cáo vẫn còn vang vọng như tiếng sấm giữa trời Nam, khẳng định tinh thần độc lập tự cường của dân tộc Việt. Những vần thơ trong Quốc âm thi tập vẫn mộc mạc, thấm đượm tình yêu thiên nhiên, thương dân, quý đời – khiến người đời sau đọc lên mà thấy lòng mình lắng lại.
                                                </span>
                                            </div>
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

export default ChiTietThu
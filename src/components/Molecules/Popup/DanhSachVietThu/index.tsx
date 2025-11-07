import { Input } from '@components/Atoms/ui/input'
import { Textarea } from '@components/Atoms/ui/textarea'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import React from 'react'

type DanhSachVietThuProps = {
    isOpen: boolean
    onClose: () => void
}

//TODO: Integrate with API
const DanhSachVietThu = ({ isOpen, onClose }: DanhSachVietThuProps) => {
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
                                    <div className='absolute lg:w-[70%] w-[80%] lg:h-[80%] h-[60%] flex flex-col justify-center'>
                                        {/* Title */}
                                        <div className='flex justify-center items-center mb-5'>
                                            <span className='text-secondary font-bd-street-sign lg:text-5xl text-3xl'>LÁ THƯ GỬI KỲ NHÂN - TÂM SỰ TỪ HẬU THẾ</span>
                                        </div>

                                        {/* List */}
                                        <div className='grid lg:grid-cols-3 grid-cols-2 h-[75%] gap-5 overflow-y-auto px-3'>
                                            <div className='relative lg:w-72 w-60 lg:h-52 h-48 rounded-2xl lg:border-4 border-2 border-secondary bg-[#F4ECD1] shadow-[0_8px_0_0_rgba(131,93,38,0.6)]'>
                                                <div className='p-4 lg:p-5'>
                                                    <div className='flex items-start justify-between'>
                                                        <div>
                                                            <p className='text-[#BB4D00] lg:text-xs text-[12px]'>TỪ</p>
                                                            <p className='text-secondary font-black lg:text-sm text-[12px] leading-none mt-1'>HA</p>
                                                        </div>
                                                        <p className='text-[#E17100] font-bold lg:text-sm text-[13px]'>01/11/2025</p>
                                                    </div>

                                                    <div className='h-[1px] w-full bg-[#E8D389] my-2' />

                                                    <p className='text-[#BB4D00] font-bold tracking-wide lg:text-xs text-[12px]'>GỬI ĐẾN</p>
                                                    <h3 className='text-secondary font-black lg:text-sm text-[12px] mt-1'>Trần Hưng Đạo</h3>

                                                    <p className='italic text-secondary lg:text-sm text-[12px] mt-2 line-clamp-2'>“Tình yêu lặng lẽ của tôi đã kéo dài từ những ngày tháng”</p>

                                                    <div className='mt-3 flex justify-center items-center hover:text-[#E17100] hover:underline'>
                                                        <button className='relative text-[#E17100] font-black lg:text-[12px] text-[10px] text-center cursor-pointer'>
                                                            Bấm để xem chi tiết →
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='relative lg:w-72 w-60 lg:h-52 h-48 rounded-2xl lg:border-4 border-2 border-secondary bg-[#F4ECD1] shadow-[0_8px_0_0_rgba(131,93,38,0.6)]'>
                                                <div className='p-4 lg:p-5'>
                                                    <div className='flex items-start justify-between'>
                                                        <div>
                                                            <p className='text-[#BB4D00] lg:text-xs text-[12px]'>TỪ</p>
                                                            <p className='text-secondary font-black lg:text-sm text-[12px] leading-none mt-1'>HA</p>
                                                        </div>
                                                        <p className='text-[#E17100] font-bold lg:text-sm text-[13px]'>01/11/2025</p>
                                                    </div>

                                                    <div className='h-[1px] w-full bg-[#E8D389] my-2' />

                                                    <p className='text-[#BB4D00] font-bold tracking-wide lg:text-xs text-[12px]'>GỬI ĐẾN</p>
                                                    <h3 className='text-secondary font-black lg:text-sm text-[12px] mt-1'>Trần Hưng Đạo</h3>

                                                    <p className='italic text-secondary lg:text-sm text-[12px] mt-2 line-clamp-2'>“Tình yêu lặng lẽ của tôi đã kéo dài từ những ngày tháng”</p>

                                                    <div className='mt-3 flex justify-center items-center hover:text-[#E17100] hover:underline'>
                                                        <button className='relative text-[#E17100] font-black lg:text-[12px] text-[10px] text-center cursor-pointer'>
                                                            Bấm để xem chi tiết →
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='relative lg:w-72 w-60 lg:h-52 h-48 rounded-2xl lg:border-4 border-2 border-secondary bg-[#F4ECD1] shadow-[0_8px_0_0_rgba(131,93,38,0.6)]'>
                                                <div className='p-4 lg:p-5'>
                                                    <div className='flex items-start justify-between'>
                                                        <div>
                                                            <p className='text-[#BB4D00] lg:text-xs text-[12px]'>TỪ</p>
                                                            <p className='text-secondary font-black lg:text-sm text-[12px] leading-none mt-1'>HA</p>
                                                        </div>
                                                        <p className='text-[#E17100] font-bold lg:text-sm text-[13px]'>01/11/2025</p>
                                                    </div>

                                                    <div className='h-[1px] w-full bg-[#E8D389] my-2' />

                                                    <p className='text-[#BB4D00] font-bold tracking-wide lg:text-xs text-[12px]'>GỬI ĐẾN</p>
                                                    <h3 className='text-secondary font-black lg:text-sm text-[12px] mt-1'>Trần Hưng Đạo</h3>

                                                    <p className='italic text-secondary lg:text-sm text-[12px] mt-2 line-clamp-2'>“Tình yêu lặng lẽ của tôi đã kéo dài từ những ngày tháng”</p>

                                                    <div className='mt-3 flex justify-center items-center hover:text-[#E17100] hover:underline'>
                                                        <button className='relative text-[#E17100] font-black lg:text-[12px] text-[10px] text-center cursor-pointer'>
                                                            Bấm để xem chi tiết →
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='relative lg:w-72 w-60 lg:h-52 h-48 rounded-2xl lg:border-4 border-2 border-secondary bg-[#F4ECD1] shadow-[0_8px_0_0_rgba(131,93,38,0.6)]'>
                                                <div className='p-4 lg:p-5'>
                                                    <div className='flex items-start justify-between'>
                                                        <div>
                                                            <p className='text-[#BB4D00] lg:text-xs text-[12px]'>TỪ</p>
                                                            <p className='text-secondary font-black lg:text-sm text-[12px] leading-none mt-1'>HA</p>
                                                        </div>
                                                        <p className='text-[#E17100] font-bold lg:text-sm text-[13px]'>01/11/2025</p>
                                                    </div>

                                                    <div className='h-[1px] w-full bg-[#E8D389] my-2' />

                                                    <p className='text-[#BB4D00] font-bold tracking-wide lg:text-xs text-[12px]'>GỬI ĐẾN</p>
                                                    <h3 className='text-secondary font-black lg:text-sm text-[12px] mt-1'>Trần Hưng Đạo</h3>

                                                    <p className='italic text-secondary lg:text-sm text-[12px] mt-2 line-clamp-2'>“Tình yêu lặng lẽ của tôi đã kéo dài từ những ngày tháng”</p>

                                                    <div className='mt-3 flex justify-center items-center hover:text-[#E17100] hover:underline'>
                                                        <button className='relative text-[#E17100] font-black lg:text-[12px] text-[10px] text-center cursor-pointer'>
                                                            Bấm để xem chi tiết →
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='relative lg:w-72 w-60 lg:h-52 h-48 rounded-2xl lg:border-4 border-2 border-secondary bg-[#F4ECD1] shadow-[0_8px_0_0_rgba(131,93,38,0.6)]'>
                                                <div className='p-4 lg:p-5'>
                                                    <div className='flex items-start justify-between'>
                                                        <div>
                                                            <p className='text-[#BB4D00] lg:text-xs text-[12px]'>TỪ</p>
                                                            <p className='text-secondary font-black lg:text-sm text-[12px] leading-none mt-1'>HA</p>
                                                        </div>
                                                        <p className='text-[#E17100] font-bold lg:text-sm text-[13px]'>01/11/2025</p>
                                                    </div>

                                                    <div className='h-[1px] w-full bg-[#E8D389] my-2' />

                                                    <p className='text-[#BB4D00] font-bold tracking-wide lg:text-xs text-[12px]'>GỬI ĐẾN</p>
                                                    <h3 className='text-secondary font-black lg:text-sm text-[12px] mt-1'>Trần Hưng Đạo</h3>

                                                    <p className='italic text-secondary lg:text-sm text-[12px] mt-2 line-clamp-2'>“Tình yêu lặng lẽ của tôi đã kéo dài từ những ngày tháng”</p>

                                                    <div className='mt-3 flex justify-center items-center hover:text-[#E17100] hover:underline'>
                                                        <button className='relative text-[#E17100] font-black lg:text-[12px] text-[10px] text-center cursor-pointer'>
                                                            Bấm để xem chi tiết →
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='relative lg:w-72 w-60 lg:h-52 h-48 rounded-2xl lg:border-4 border-2 border-secondary bg-[#F4ECD1] shadow-[0_8px_0_0_rgba(131,93,38,0.6)]'>
                                                <div className='p-4 lg:p-5'>
                                                    <div className='flex items-start justify-between'>
                                                        <div>
                                                            <p className='text-[#BB4D00] lg:text-xs text-[12px]'>TỪ</p>
                                                            <p className='text-secondary font-black lg:text-sm text-[12px] leading-none mt-1'>HA</p>
                                                        </div>
                                                        <p className='text-[#E17100] font-bold lg:text-sm text-[13px]'>01/11/2025</p>
                                                    </div>

                                                    <div className='h-[1px] w-full bg-[#E8D389] my-2' />

                                                    <p className='text-[#BB4D00] font-bold tracking-wide lg:text-xs text-[12px]'>GỬI ĐẾN</p>
                                                    <h3 className='text-secondary font-black lg:text-sm text-[12px] mt-1'>Trần Hưng Đạo</h3>

                                                    <p className='italic text-secondary lg:text-sm text-[12px] mt-2 line-clamp-2'>“Tình yêu lặng lẽ của tôi đã kéo dài từ những ngày tháng”</p>

                                                    <div className='mt-3 flex justify-center items-center hover:text-[#E17100] hover:underline'>
                                                        <button className='relative text-[#E17100] font-black lg:text-[12px] text-[10px] text-center cursor-pointer'>
                                                            Bấm để xem chi tiết →
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='relative lg:w-72 w-60 lg:h-52 h-48 rounded-2xl lg:border-4 border-2 border-secondary bg-[#F4ECD1] shadow-[0_8px_0_0_rgba(131,93,38,0.6)]'>
                                                <div className='p-4 lg:p-5'>
                                                    <div className='flex items-start justify-between'>
                                                        <div>
                                                            <p className='text-[#BB4D00] lg:text-xs text-[12px]'>TỪ</p>
                                                            <p className='text-secondary font-black lg:text-sm text-[12px] leading-none mt-1'>HA</p>
                                                        </div>
                                                        <p className='text-[#E17100] font-bold lg:text-sm text-[13px]'>01/11/2025</p>
                                                    </div>

                                                    <div className='h-[1px] w-full bg-[#E8D389] my-2' />

                                                    <p className='text-[#BB4D00] font-bold tracking-wide lg:text-xs text-[12px]'>GỬI ĐẾN</p>
                                                    <h3 className='text-secondary font-black lg:text-sm text-[12px] mt-1'>Trần Hưng Đạo</h3>

                                                    <p className='italic text-secondary lg:text-sm text-[12px] mt-2 line-clamp-2'>“Tình yêu lặng lẽ của tôi đã kéo dài từ những ngày tháng”</p>

                                                    <div className='mt-3 flex justify-center items-center hover:text-[#E17100] hover:underline'>
                                                        <button className='relative text-[#E17100] font-black lg:text-[12px] text-[10px] text-center cursor-pointer'>
                                                            Bấm để xem chi tiết →
                                                        </button>
                                                    </div>
                                                </div>
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

export default DanhSachVietThu
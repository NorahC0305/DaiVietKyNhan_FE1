import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import React, { useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useQuery } from '@tanstack/react-query'
import { getLetterByIdQueryOptions } from '@hooks/use-letter-queries'
import { DateMonthYear } from '@utils/Date'
import { ILetterEntity } from '@models/letter/entity'

type ChiTietThuProps = {
    isOpen: boolean
    letterId: number | null
    onClose: () => void
    onParticipate?: () => void
    onBack?: () => void
    letters?: ILetterEntity[] // Danh sách thư để điều hướng
    onLetterChange?: (letterId: number) => void // Callback khi chuyển thư
}

const ChiTietThu = ({ isOpen, letterId, onClose, onParticipate, onBack, letters = [], onLetterChange }: ChiTietThuProps) => {
    // Debug log to check letterId
    React.useEffect(() => {
        if (isOpen && letterId) {
            console.log('ChiTietThu - letterId:', letterId, 'isOpen:', isOpen);
        }
    }, [isOpen, letterId]);

    // Fetch letter details by ID - only fetch when modal is open and letterId is valid
    const { data: letter, isLoading, isError } = useQuery({
        ...getLetterByIdQueryOptions(letterId ?? 0),
        enabled: isOpen && !!letterId && letterId > 0,
    })

    // Tính toán vị trí hiện tại và các thư liền kề
    const { currentIndex, hasPrevious, hasNext, previousLetterId, nextLetterId, visibleLetters } = useMemo(() => {
        if (!letters.length || !letterId) {
            return {
                currentIndex: -1,
                hasPrevious: false,
                hasNext: false,
                previousLetterId: null,
                nextLetterId: null,
                visibleLetters: [],
            }
        }

        const index = letters.findIndex((l) => l.id === letterId)

        if (index === -1) {
            return {
                currentIndex: -1,
                hasPrevious: false,
                hasNext: false,
                previousLetterId: null,
                nextLetterId: null,
                visibleLetters: [],
            }
        }

        // Lấy các thư để hiển thị pagination (tối đa 5 thư xung quanh thư hiện tại)
        const start = Math.max(0, index - 2)
        const end = Math.min(letters.length, index + 3)
        const visible = letters.slice(start, end).map((l, i) => ({
            letter: l,
            index: start + i,
            isActive: start + i === index,
        }))

        return {
            currentIndex: index,
            hasPrevious: index > 0,
            hasNext: index < letters.length - 1,
            previousLetterId: index > 0 ? letters[index - 1].id : null,
            nextLetterId: index < letters.length - 1 ? letters[index + 1].id : null,
            visibleLetters: visible,
        }
    }, [letters, letterId])

    const handleParticipate = onParticipate ?? onClose

    const handleBack = () => {
        if (onBack) {
            onBack()
            return
        }
        onClose()
    }

    const handlePrevious = () => {
        if (previousLetterId !== null && onLetterChange) {
            onLetterChange(previousLetterId)
        }
    }

    const handleNext = () => {
        if (nextLetterId !== null && onLetterChange) {
            onLetterChange(nextLetterId)
        }
    }

    const handleLetterClick = (id: number) => {
        if (onLetterChange) {
            onLetterChange(id)
        }
    }

    // Use React Portal to render modal at root level
    if (typeof window === "undefined") return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center">
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
                    >
                        <div className='flex flex-col items-center justify-center'>
                            {/* Cuộn giấy */}
                            <div className='relative lg:w-[1300px] lg:h-[700px] w-[700px] h-[400px]'>
                                <Image src='https://res.cloudinary.com/dauhpllo7/image/upload/v1763392813/khung_chi_ti%E1%BA%BFt_3_mhxweg.png' alt='Viet Thu Gui Hau The' fill />

                                <div className='absolute w-full h-[100%] flex items-center justify-center inset-0'>
                                    <div className='absolute lg:w-[60%] w-[60%] lg:h-[70%] h-[60%] flex flex-col justify-center'>
                                        {/* Title */}
                                        <div className='flex justify-center items-center lg:mb-5 mb-2'>
                                            <span className='text-secondary font-bd-street-sign lg:text-5xl text-3xl'>LÁ THƯ GỬI KỲ NHÂN - TÂM SỰ TỪ HẬU THẾ</span>
                                        </div>

                                        {/* Content */}
                                        <div className='relative w-full h-full'>
                                            {/* Previous Button */}
                                            <button
                                                type='button'
                                                onClick={handlePrevious}
                                                disabled={!hasPrevious}
                                                className={`absolute left-[-56px] top-1/2 -translate-y-1/2 w-[40px] h-[40px] cursor-pointer flex items-center justify-center transition-opacity ${hasPrevious ? 'hover:opacity-80' : 'opacity-50 cursor-not-allowed'
                                                    }`}
                                            >
                                                <Image src='https://res.cloudinary.com/dznt9yias/image/upload/v1760721544/Back_cwp7tx.svg' alt='Prev' fill />
                                            </button>

                                            {/* Next Button */}
                                            <button
                                                type='button'
                                                onClick={handleNext}
                                                disabled={!hasNext}
                                                className={`absolute right-[-56px] top-1/2 -translate-y-1/2 w-[40px] h-[40px] cursor-pointer flex items-center justify-center transition-opacity ${hasNext ? 'hover:opacity-80' : 'opacity-50 cursor-not-allowed'
                                                    }`}
                                            >
                                                <Image src='https://res.cloudinary.com/dznt9yias/image/upload/v1760725883/next_xshxeb.svg' alt='Next' fill />
                                            </button>

                                            {isLoading ? (
                                                <div className='flex justify-center items-center h-full'>
                                                    <p className='text-secondary text-lg'>Đang tải...</p>
                                                </div>
                                            ) : isError || !letter ? (
                                                <div className='flex justify-center items-center h-full'>
                                                    <p className='text-secondary text-lg'>Có lỗi xảy ra khi tải dữ liệu</p>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className='flex justify-between items-center'>
                                                        <div className='w-full'>
                                                            <div className='flex items-center justify-start lg:mb-4 mb-1'>
                                                                <div className='lg:w-[10%] w-[15%]'>
                                                                    <span className='text-secondary lg:text-lg text-sm font-bold'>Từ: </span>
                                                                </div>
                                                                <span className='text-[#CE7346] lg:text-lg text-sm font-bold italic'>
                                                                    {letter.fromUser?.name || letter.from || 'Ẩn danh'}
                                                                </span>
                                                            </div>
                                                            <div className='flex items-center justify-start lg:mb-4 mb-1'>
                                                                <div className='lg:w-[10%] w-[15%]'>
                                                                    <span className='text-secondary lg:text-lg text-sm font-bold'>Đến: </span>
                                                                </div>
                                                                <span className='text-[#CE7346] lg:text-lg text-sm font-bold italic'>
                                                                    {letter.to || 'Kỳ Nhân'}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className='relative w-[120px] h-[40px] cursor-pointer flex flex-col items-end justify-end'>
                                                            <p className='text-secondary lg:text-lg text-sm font-bold'>Ngày gửi</p>
                                                            <p className='text-secondary lg:text-base text-sm italic'>
                                                                {DateMonthYear(letter.createdAt)}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className='flex items-start justify-start lg:h-[80%] h-[70%] bg-[#F4ECD0] overflow-y-auto border-4 border-secondary rounded-xl px-4 py-2'>
                                                        <span className='lg:text-base text-sm leading-relaxed whitespace-pre-line'>
                                                            {letter.content}
                                                        </span>
                                                    </div>
                                                </>
                                            )}

                                            <div className='absolute lg:bottom-[-96px] bottom-[-55px] flex justify-center items-center w-full h-fit'>
                                                <button className='lg:w-[200px] w-[120px] lg:h-[50px] h-[35px] cursor-pointer flex items-center justify-center hover:opacity-80 transition-all duration-300' onClick={handleParticipate}>
                                                    <Image src='https://res.cloudinary.com/dznt9yias/image/upload/v1760718877/Button_bb7ywk.svg' alt='join' fill />
                                                    <div className='absolute inset-0 flex items-center justify-center'>
                                                        <span className='text-secondary lg:text-sm text-[10px] font-bold'>Để tham gia ngay</span>
                                                    </div>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    )
}

export default ChiTietThu
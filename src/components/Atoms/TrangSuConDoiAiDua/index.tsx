import Image from 'next/image'
import React from 'react'

const TrangSuConDoiAiDua = () => {
    return (
        <div className="flex items-center justify-center">
            <div className='relative w-[300px] lg:w-[400px] h-[80px] lg:h-[117px] flex items-center justify-center my-5'>
                <Image src="https://res.cloudinary.com/dznt9yias/image/upload/v1760726766/frame_hfc9ot.svg" alt="frame" fill />
                <div className='absolute inset-0 flex items-center justify-center '>
                    <div className='flex  flex-col items-center justify-center w-[64%]'>
                        <span className='text-center lg:text-2xl text-base font-bd-street-sign text-[#CE7346]'>Trang sử còn đợi ai đưa,</span>
                        <span className='text-center lg:text-2xl text-base font-bd-street-sign text-[#CE7346]'>Khai Nhân Mở Ấn, chuyện xưa hóa gần.</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TrangSuConDoiAiDua
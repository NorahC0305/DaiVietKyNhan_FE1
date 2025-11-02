'use client'

import ModalBackdrop from "@components/Atoms/ModalBackdrop"
import TrangSuConDoiAiDua from "@components/Atoms/TrangSuConDoiAiDua"
import { GameFrame } from "@components/Molecules/GameFrame"
import Guide from "@components/Molecules/Popup/Guide"
import KhaiNhanMoAn from "@components/Molecules/Popup/KhaiNhanMoAn"
import Image from "next/image"
import { useState } from "react"

const TestPageClient = () => {
    const onClose = () => {
        console.log('onClose')
    }
    return (
        <ModalBackdrop isOpen={true} onClose={onClose} className="w-full lg:max-w-5xl max-w-3xl mx-auto overflow-y-hidden">
            <div className="max-h-[73vh] overflow-y-auto ancient-scrollbar">
                <div className="p-4">
                    {/* --- Title --- */}
                    <div className="flex items-center justify-center gap-2">
                        <h1
                            className="font-bd-street-sign text-center lg:text-6xl text-3xl text-secondary"
                        >
                            GIỚI THIỆU CHIẾN DỊCH “KHAI NHÂN MỞ ẤN”
                            <br />
                            22/10 - 05/12
                        </h1>
                    </div>

                    {/* --- Description --- */}
                    <TrangSuConDoiAiDua />

                    {/* Introduction --- */}
                    {/* Bối cảnh và ý tưởng --- */}
                    <div className="flex flex-col">
                        <>
                            <h3 className="text-left lg:text-xl text-lg font-bold text-secondary">1. Bối cảnh và ý tưởng</h3>
                            <p className="text-secondary lg:text-xl text-base text-justify leading-relaxed">
                                Từ trong dòng chảy lịch sử và ký ức dân tộc, có một vùng linh địa mang tên Kỳ Giới – nơi linh khí ngàn năm hội tụ và là nơi các Kỳ Nhân Đại Việt lưu giữ tinh hoa và hồn cốt dân tộc.
                            </p>
                            <br />

                            <p className="text-secondary lg:text-xl text-base text-justify leading-relaxed">
                                Tuy nhiên, một thế lực vô hình đã len lỏi, khiến linh hồn các Kỳ Nhân bị phong ấn và Kỳ Giới phải đối mặt với một mối hiểm họa lớn.
                            </p>
                            <br />

                            <p className="text-secondary lg:text-xl text-base text-justify leading-relaxed">
                                Trước lời kêu gọi của Kỳ Giới, người được chọn – Kỳ Chủ – sẽ là người dấn thân vào hành trình khám phá, đánh thức và giải phong ấn các Kỳ Nhân, mang lại ánh sáng cho vùng đất linh thiêng này.
                            </p>
                            <br />

                            <p className="text-secondary lg:text-xl text-base text-justify leading-relaxed">
                                Từ ý tưởng đó, chiến dịch “Khai Nhân Mở Ấn” được khởi xướng như một hành trình để mỗi người trong thế hệ hôm nay có thể khám phá những con người đằng sau huyền thoại, giúp lịch sử trở nên gần gũi, sinh động và truyền cảm hứng hơn bao giờ hết.
                            </p>
                            <br />
                        </>

                        {/* Mục tiêu và ý nghĩa */}
                        <>
                            <h3 className="text-left lg:text-xl text-lg font-bold text-secondary">2. Mục tiêu và ý nghĩa</h3>
                            <p className="text-secondary lg:text-xl text-base text-justify leading-relaxed">
                                “Khai Nhân Mở Ấn” không chỉ là một hoạt động truyền thông, mà còn là một hành trình kết nối tri thức và cảm xúc, đưa các danh nhân lịch sử đến gần hơn với công chúng thông qua hình thức trải nghiệm hiện đại, trực quan và mang tính tương tác.
                            </p>
                            <br />
                        </>

                        {/* Các hoạt động trọng tâm */}
                        <>
                            <h3 className="text-left lg:text-xl text-lg font-bold text-secondary">3. Các hoạt động trọng tâm</h3>
                            <div className="flex items-center justify-center">
                                <div className='relative w-[300px] lg:w-[400px] h-[80px] lg:h-[117px] flex items-center justify-center my-5'>
                                    <Image src="https://res.cloudinary.com/dznt9yias/image/upload/v1760726766/frame_hfc9ot.svg" alt="frame" fill />
                                    <div className='absolute inset-0 flex items-center justify-center '>
                                        <div className='flex  flex-col items-center justify-center w-[80%]'>
                                            <span className='text-center lg:text-2xl text-lg font-bd-street-sign text-[#AD844A]'>Trải nghiệm website</span>
                                            <span className='text-center lg:text-2xl text-lg font-bd-street-sign text-[#E3A12B]'>22/10 - 05/12</span>
                                        </div>
                                    </div>
                                </div>
                                <div className='relative w-[300px] lg:w-[400px] h-[80px] lg:h-[117px] flex items-center justify-center my-5'>
                                    <Image src="https://res.cloudinary.com/dznt9yias/image/upload/v1760726766/frame_hfc9ot.svg" alt="frame" fill />
                                    <div className='absolute inset-0 flex items-center justify-center '>
                                        <div className='flex  flex-col items-center justify-center w-[80%]'>
                                            <span className='text-center lg:text-[22px] text-[15px] font-bd-street-sign text-[#AD844A]'>Chuỗi hoạt động săn thưởng đổi quà</span>
                                            <span className='text-center lg:text-2xl text-lg font-bd-street-sign text-[#E3A12B]'>22/10 - 30/11</span>
                                        </div>
                                    </div>
                                </div>
                                <div className='relative w-[300px] lg:w-[400px] h-[80px] lg:h-[117px] flex items-center justify-center my-5'>
                                    <Image src="https://res.cloudinary.com/dznt9yias/image/upload/v1760726766/frame_hfc9ot.svg" alt="frame" fill />
                                    <div className='absolute inset-0 flex items-center justify-center '>
                                        <div className='flex  flex-col items-center justify-center w-[80%]'>
                                            <span className='text-center lg:text-2xl text-lg font-bd-street-sign text-[#AD844A]'>Sự kiện tương tác</span>
                                            <span className='text-center lg:text-2xl text-lg font-bd-street-sign text-[#E3A12B]'>28,29,30/11 tại TP.HCM</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    </div>

                    <div className="mt-10 w-full flex items-center">
                        <div className="bg-[#a4a89d29] border border-[#000000] lg:w-[93%] w-[98%] h-full rounded-xl py-7">
                            {/* Title */}
                            <h2 className="text-center lg:text-4xl text-3xl font-bd-street-sign text-[#CE7346] mb-5">
                                MỞ ẤN TÍCH XU, THƯỞNG QUÀ KỲ CHỦ
                                <br />
                                20/10 - 30/11
                            </h2>

                            {/* Mở Ấn Tích Xu, Thưởng Quà KỲ CHỦ */}
                            <div className="flex flex-col items-center justify-center">
                                <div className="relative w-[400px] lg:w-[600px] h-[200px] lg:h-[350px] mx-auto mb-10">
                                    <Image src="https://res.cloudinary.com/dznt9yias/image/upload/v1762076231/mapcl_10_eneafr.png" alt="frame" fill />
                                </div>

                                <ul className="list-disc list-inside mx-10 w-[400px] lg:w-[600px] text-secondary lg:text-lg text-base text-justify leading-relaxed">
                                    <li>Còn gì vui hơn khi vừa được khám phá vô vàn câu chuyện Kỳ Nhân, vừa có cơ hội rinh quà cực chất thông qua chuỗi hoạt động <span className="font-bold text-secondary">MỞ ẤN TÍCH XU – THƯỞNG QUÀ KỲ CHỦ</span>, diễn ra từ ngày <span className="text-secondary" style={{ fontWeight: '900' }}>22/10 đến hết 30/11</span></li>
                                    <li>Tích đủ mốc <span className="font-bold text-secondary">5200 XU</span> để mở khóa phần thưởng độc quyền từ Đại Việt Kỳ Nhân</li>
                                </ul>
                            </div>

                            {/* Có những cơ hội nào để tích xu? */}
                            <div className="flex flex-col items-center justify-center mx-10">
                                <div className="flex flex-col items-center justify-center">
                                    <h3 className="text-center lg:text-2xl text-lg font-bold text-secondary mt-16 mb-8">Có những cơ hội nào để tích xu?</h3>
                                    <div className="flex justify-between items-start">
                                        <div className="relative w-[40px] lg:w-[300px] h-[20px] lg:h-[300px] mb-10">
                                            <Image src="https://res.cloudinary.com/dznt9yias/image/upload/v1762077238/mapcl_11_v7pij0.png" alt="frame" fill className="w-full h-full" />
                                        </div>

                                        <div className="flex flex-col items-start justify-start text-secondary w-[50%] gap-10">
                                            <div>
                                                <h4 className="text-left lg:text-xl text-lg font-bold text-secondary">
                                                    ĐIỂM DANH HẰNG NGÀY
                                                </h4>
                                                <p className="text-secondary text-base text-justify leading-relaxed">
                                                    Không cần cố gắng quá nhiều, chỉ cần mỗi ngày nghía qua Kỳ Giới một lần là đã có thể tích xu. Đặc biệt, khi duy trì chuỗi 7 ngày liên tiếp, ngày thứ 7 số xu của bạn sẽ được nhân đôi!
                                                </p>
                                            </div>

                                            <div>
                                                <h4 className="text-left lg:text-xl text-lg font-bold text-secondary">
                                                    HỆ THỐNG THÀNH TỰU
                                                </h4>
                                                <p className="text-secondary text-base text-justify leading-relaxed">
                                                    Mỗi khi bạn giải ấn thành công một Kỳ Nhân hoặc hoàn thành một vùng đất, hệ thống sẽ tự động cộng thêm xu vào tài khoản.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-left lg:text-xl text-lg font-bold text-secondary">
                                            ĐỔI ĐIỂM TÍCH XU
                                        </h4>
                                        <p className="text-secondary text-base text-justify leading-relaxed">
                                            Bạn hoàn toàn có thể đổi điểm lấy xu ngay trên mục Đổi quà trong bản đồ Kỳ Giới.
                                            <br/>
                                            ‼️Tuy nhiên, hãy sử dụng tính năng này một cách hợp lý, vì chúng ta không chỉ có tích xu thôi đâu! Điểm số cũng quan trọng không kém, vì sẽ có phần quà đặc biệt dành cho những Kỳ Chủ on top điểm số nữa.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ModalBackdrop >
    )
}

export default TestPageClient
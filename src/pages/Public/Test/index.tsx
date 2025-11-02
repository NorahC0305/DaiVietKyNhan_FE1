'use client'

import ModalBackdrop from "@components/Atoms/ModalBackdrop"
import TrangSuConDoiAiDua from "@components/Atoms/TrangSuConDoiAiDua"
import { GameFrame } from "@components/Molecules/GameFrame"
import Guide from "@components/Molecules/Popup/Guide"
import KhaiNhanMoAn from "@components/Molecules/Popup/KhaiNhanMoAn"
import Image from "next/image"
import { useState } from "react"

const SuKienTuongTac = () => {
    return (
        <div className="mt-10 w-full flex items-center">
            <div className="bg-[#a4a89d29] border border-[#000000] lg:w-[93%] w-[98%] h-full rounded-xl py-7">
                <div className="relative">
                    {/* Title */}
                    <h2 className="text-center lg:text-4xl text-3xl font-bd-street-sign text-[#CE7346] mb-5">
                        SỰ KIỆN “KHAI HOA HUYỀN ẤN”
                        <br />
                        28, 29, 30/11
                        <br />
                        tại Parc Mall, TP.HCM
                    </h2>
                    <button
                        className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 cursor-pointer p-2"
                        // onClick={onClose}
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

                <p className="text-center text-secondary text-sm lg:text-base font-black mt-10">THÔNG TIN VỀ HOẠT ĐỘNG NÀY SẼ ĐƯỢC CẬP NHẬT SAU</p>
            </div>
        </div>
    )
}

const TraiNghiemWebsite = () => {
    return (
        <div className="mt-10 w-full flex items-center">
            <div className="bg-[#a4a89d29] border border-[#000000] lg:w-[93%] w-[98%] h-full rounded-xl py-7">
                {/* Title */}
                <div className="relative">  {/* Button Close */}
                    <h2 className="text-center lg:text-4xl text-3xl font-bd-street-sign text-[#CE7346] mb-5">
                        TRẢI NGHIỆM WEBSITE KỲ NHÂN
                        <br />
                        22/10 - 05/12
                    </h2>
                    <button
                        className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 cursor-pointer p-2"
                        // onClick={onClose}
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


                <div className="flex flex-col items-center justify-center mx-10">
                    <div className="flex flex-col items-center justify-center">
                        <div className="flex justify-between items-start">
                            <div className="flex flex-col items-center justify-center mt-5">
                                <div className="flex items-center justify-center">
                                    <h3 className="text-center lg:text-xl text-base font-bold text-secondary mb-4">Khi lịch sử trở thành
                                        <br />
                                        hành trình cá nhân đầy sống động
                                    </h3>
                                </div>
                                <div className="relative w-[250px] lg:w-[300px] h-[180px] lg:h-[200px] mb-5">
                                    <Image src="https://res.cloudinary.com/dznt9yias/image/upload/v1762098794/mapcl_4_po7nzm.png" alt="frame" fill className="w-full h-full" />
                                </div>
                                <div className="relative w-[250px] lg:w-[300px] h-[180px] lg:h-[200px] mb-3">
                                    <Image src="https://res.cloudinary.com/dznt9yias/image/upload/v1762098837/mapcl_5_payi1x.png" alt="frame" fill className="w-full h-full" />
                                </div>
                            </div>

                            <div className="flex flex-col items-start justify-start text-secondary w-[50%] gap-10">
                                <ul className="list-disc list-inside gap-10">
                                    <li className="text-secondary text-sm lg:text-base text-justify leading-relaxed">Website Đại Việt Kỳ Nhân là không gian giáo dục – giải trí tương tác, nơi những câu chuyện về các danh nhân lịch sử được tái hiện bằng ngôn ngữ trải nghiệm hiện đại.</li><br />
                                    <li className="text-secondary text-sm lg:text-base text-justify leading-relaxed">Tại đây, người tham gia có thể khám phá các Kỳ Nhân Đại Việt qua hành trình mở khóa, giải đố và kết nối trực tiếp trong thế giới giả tưởng Kỳ Giới.</li><br />
                                    <li className="text-secondary text-sm lg:text-base text-justify leading-relaxed">Mỗi câu chuyện, mỗi thử thách đều giúp bạn nhìn nhận các danh nhân lịch sử không chỉ qua chiến công, mà qua những khía cạnh rất đời thường – gần gũi, sinh động và đầy cảm hứng.</li><br />
                                    <li className="text-secondary text-sm lg:text-base text-justify leading-relaxed">Chiến dịch Khai Nhân Mở Ấn nằm trong giai đoạn thử nghiệm của nền tảng , hướng đến mục tiêu trở thành một không gian giáo dục – giải trí số giúp người trẻ tiếp cận lịch sử Việt Nam theo cách mới mẻ và sâu sắc hơn.</li><br />
                                </ul>
                            </div>
                        </div>

                        {/* Tìm Thần Bảo Hộ */}
                        <div className="mt-10">
                            <div className="flex items-center justify-center">
                                <h3 className="text-left lg:text-2xl text-xl font-bold text-secondary">
                                    Những hoạt động chính trên Website
                                </h3>
                            </div>
                            <div className="flex justify-between items-center mt-5">
                                <div className="relative w-[250px] lg:w-[300px] h-[150px] lg:h-[180px]">
                                    <Image src="https://res.cloudinary.com/dznt9yias/image/upload/v1762100249/mapcl_6_v28nro.png" alt="frame" fill className="w-full h-full" />
                                </div>

                                <div className="flex flex-col items-start justify-start text-secondary w-[50%]">
                                    <h4 className="text-left lg:text-xl text-lg font-bold text-secondary mb-4">
                                        TÌM THẦN BẢO HỘ
                                    </h4>
                                    <p>Một điểm nhấn đặc biệt của nền tảng là hoạt động Tìm Thần Bảo Hộ, giúp người tham gia khám phá bản thân thông qua một bài kiểm tra được thiết kế để tìm ra nhóm khí chất đặc trưng. Từ kết quả đó có thể biết được vị thần bảo hộ phù hợp trong Tứ Bất Tử – biểu trưng cho những giá trị và phẩm chất mà đồng điệu nhất với khí chất của bản thân.</p>
                                </div>
                            </div>
                        </div>

                        {/* Hệ thống nhiệm vụ */}
                        <div className="mt-10">
                            <div className="flex justify-between items-center mt-5">
                                <div className="flex items-center justify-center w-[40%]">
                                    <div className="relative w-[250px] lg:w-[250px] h-[200px] lg:h-[250px]">
                                        <Image src="https://res.cloudinary.com/dznt9yias/image/upload/v1762100561/mapcl_10_1_ab5ahp.png" alt="frame" fill className="w-full h-full" />
                                    </div>
                                </div>

                                <div className="flex flex-col items-start justify-start text-secondary w-[50%]">
                                    <h4 className="text-left lg:text-xl text-lg font-bold text-secondary mb-4">
                                        HỆ THỐNG NHIỆM VỤ
                                    </h4>
                                    <ul className="list-disc list-inside">
                                        <li>Ở mỗi vùng đất sẽ có những Kỳ Nhân đang bị phong ấn. Bằng cách trả lời những câu hỏi gợi ý, bạn sẽ qua đó tìm được danh tính của họ. </li>
                                        <ul>Các vùng đất sẽ được khai mở theo từng tuần:
                                            <li>- Núi Tản Viên: khai mở <span className="font-bold text-secondary">22/10</span></li>
                                            <li>- Đầm Dạ Trạch: khai mở <span className="font-bold text-secondary">29/10</span></li>
                                            <li>- Làng Phù Đổng: khai mở <span className="font-bold text-secondary">05/11</span></li>
                                            <li>- Phủ Tây Hồ: khai mở <span className="font-bold text-secondary">12/11</span></li>
                                        </ul>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Hoàn thành thư viện Kỳ Nhân */}
                        <div className="mt-10">
                            <div className="flex justify-between items-center mt-5">
                                <div className="flex items-center justify-center w-[40%]">
                                    <div className="relative w-[250px] lg:w-[250px] h-[200px] lg:h-[250px]">
                                        <Image src="https://res.cloudinary.com/dznt9yias/image/upload/v1762100223/mapcl_8_g2ckyf.png" alt="frame" fill className="w-full h-full" />
                                    </div>
                                </div>

                                <div className="flex flex-col items-start justify-start text-secondary w-[50%]">
                                    <h4 className="text-left lg:text-xl text-lg font-bold text-secondary mb-4">
                                        HOÀN THÀNH THƯ VIỆN KỲ NHÂN
                                    </h4>
                                    <p>Với mỗi Kỳ Nhân được giải ấn thành công, bạn sẽ thu thập được một Kỳ Ấn - chính là thẻ bài Kỳ Nhân trong thư viện.</p>
                                </div>
                            </div>
                        </div>

                        {/* Khám phá cốt truyện và khai mở vùng đất cuối cùng */}
                        <div className="mt-10">
                            <div className="flex justify-between items-start mt-5">
                                <div className="flex items-center justify-center w-[40%]">
                                    <div className="relative w-[250px] lg:w-[250px] h-[200px] lg:h-[250px]">
                                        <Image src="https://res.cloudinary.com/dznt9yias/image/upload/v1762101232/mapcl_9_sqmdcn.png" alt="frame" fill className="w-full h-full" />
                                    </div>
                                </div>

                                <div className="flex flex-col items-start justify-start text-secondary w-[50%]">
                                    <h4 className="text-left lg:text-xl text-lg font-bold text-secondary mb-4">
                                        KHÁM PHÁ CỐT TRUYỆN VÀ
                                        <br />
                                        KHAI MỞ VÙNG ĐẤT CUỐI CÙNG
                                    </h4>
                                    <p>Mỗi khi bạn thành công giải ấn các Kỳ Nhân của một vùng đất, bạn sẽ thu thập được Kỳ Văn của vùng đất đó. Mỗi Kỳ Văn sẽ là một mảnh ghép lật mở bí ẩn về sự tồn tại của Kỳ Giới và ý nghĩa của vùng đất thứ năm - vùng đất cuối cùng.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const ChuoiHoatDongSanThuong = () => {
    return (
        <div className="mt-10 w-full flex items-center">
            <div className="bg-[#a4a89d29] border border-[#000000] lg:w-[93%] w-[98%] h-full rounded-xl py-7">
                {/* Title */}
                <div className="relative">
                    <h2 className="text-center lg:text-4xl text-3xl font-bd-street-sign text-[#CE7346] mb-5">
                        MỞ ẤN TÍCH XU, THƯỞNG QUÀ KỲ CHỦ
                        <br />
                        20/10 - 30/11
                    </h2>
                    <button
                        className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 cursor-pointer p-2"
                        // onClick={onClose}
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
                            <div className="relative w-[250px] lg:w-[300px] h-[250px] lg:h-[300px] mb-10">
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
                                <br />
                                ‼️Tuy nhiên, hãy sử dụng tính năng này một cách hợp lý, vì chúng ta không chỉ có tích xu thôi đâu! Điểm số cũng quan trọng không kém, vì sẽ có phần quà đặc biệt dành cho những Kỳ Chủ on top điểm số nữa.
                            </p>
                        </div>
                    </div>
                </div>

                {/* ĐỔI ĐIỂM TÍCH XU */}
                <div className="flex flex-col items-center justify-center mx-10">
                    <div className="flex flex-col items-center justify-center">
                        <h3 className="text-center lg:text-2xl text-lg font-bold text-secondary mt-16 mb-8">Có những cơ hội nào để tích xu?</h3>
                        <div className="flex justify-between items-center">
                            <div className="relative w-[250px] lg:w-[300px] h-[250px] lg:h-[300px] mb-10">
                                <Image src="https://res.cloudinary.com/dznt9yias/image/upload/v1762096793/mapcl_12_g9x1nf.png" alt="frame" fill className="w-full h-full" />
                            </div>

                            <div className="flex flex-col items-start justify-start text-secondary w-[50%] gap-10">
                                <div>
                                    <h4 className="text-left lg:text-xl text-lg font-bold text-secondary">
                                        EVENT SĂN CODE HÀNG TUẦN
                                    </h4>
                                    <ul className="list-disc list-inside">
                                        <li>4 tuần – 4 cơ hội – 4 đợt săn code nảy lửa!</li>
                                        <li><span className="font-bold text-secondary">20h tối Chủ Nhật các ngày 26/10, 02/11, 09/11, 16/11</span>, hãy canh đúng giờ để săn mã code bí mật.</li>
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="text-left lg:text-xl text-lg font-bold text-secondary">
                                        Thể lệ:
                                    </h4>
                                    <ul className="list-inside">
                                        <li>- Tìm mã code xuất hiện trong trong bài đăng vào 20h00 tối các ngày Chủ nhật nêu trên. Mỗi bài đăng săn code sẽ được đánh dấu bằng logo "Khai Nhân Mở Ấn" chuyển màu.</li>
                                        <li>- Sau khi đã tìm thấ mã code, hãy vào Website → vào bản đồ Kỳ Giới → nhấn dấu “+” trên thanh xu để nhập mã. Thành công nhận 500 xu!</li>
                                        ‼️Lưu ý: Mỗi event săn code chỉ dành cho 20 người nhanh tay nhất.
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* LÁ THƯ GỬI KỲ NHÂN */}
                <div className="flex flex-col items-center justify-center mx-10 mt-10">
                    <div className="flex flex-col items-center justify-center">
                        <div className="flex justify-between items-center">
                            <div className="relative w-[250px] lg:w-[300px] h-[250px] lg:h-[300px] mb-10">
                                <Image src="https://res.cloudinary.com/dznt9yias/image/upload/v1762097341/mapcl_13_zuuwvq.png" alt="frame" fill className="w-full h-full" />
                            </div>

                            <div className="flex flex-col items-start justify-start text-secondary w-[50%] gap-10">
                                <div>
                                    <h4 className="text-left lg:text-xl text-lg font-bold text-secondary">
                                        LÁ THƯ GỬI KỲ NHÂN
                                    </h4>
                                    <ul className="list-disc list-inside">
                                        <li>Khai mở vào 08/11</li>
                                        <li>Một cơ hội để vừa bày tỏ cảm xúc của bạn với những Kỳ Nhân đáng kính, vừa tranh thủ tích xu thưởng.</li>
                                        ‼️Lưu ý: Mỗi event săn code chỉ dành cho 20 người nhanh tay nhất.
                                    </ul>

                                    <h4 className="text-left lg:text-xl text-lg font-bold text-secondary">
                                        Thể loại:
                                    </h4>
                                    <ul className="list-inside">
                                        <li>- Đăng nhập tài khoản trên website Đại Việt Kỳ Nhân</li>
                                        <li>- Viết một lá thư gửi đến vị Kỳ Nhân bạn yêu mến – có thể là lời tâm sự, cảm nhận hay tri ân.</li>
                                        <li>- Với mỗi tài khoản, lá thư đầu tiên được xét duyệt và đăng tải sẽ nhận ngay 200 xu.</li>
                                        <li>- Có cơ hội được trưng bày tại sự kiện tương tác (28 - 30/11)</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-center mx-10 mt-10">
                    <div className="relative w-[220px] lg:w-[220px] h-[250px] lg:h-[280px]">
                        <Image src="https://res.cloudinary.com/dznt9yias/image/upload/v1762097672/Gemini_Generated_Image_mnkmapmnkmapmnkm_2_v9zc3l.png" alt="frame" fill className="w-full h-full" />
                    </div>
                </div>
            </div>
        </div>
    )
}

const TestPageClient = ({ children }: { children: React.ReactNode }) => {
    const [selectedActivity, setSelectedActivity] = useState<'trai-nghiem' | 'san-thuong' | 'su-kien' | null>(null);

    const onClose = () => {
        setSelectedActivity(null);
    }

    const handleActivityClick = (activity: 'trai-nghiem' | 'san-thuong' | 'su-kien') => {
        setSelectedActivity(activity);
    }

    return (
        <div>
            <div className="relative bg-primary-light border-4 border-secondary rounded-2xl w-full lg:max-w-5xl max-w-3xl mx-auto my-8 p-6 sm:p-8 md:p-10 max-h-[90vh]">
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
                                    <div
                                        className='relative w-[300px] lg:w-[400px] h-[80px] lg:h-[117px] flex items-center justify-center my-5 cursor-pointer hover:scale-105 transition-transform'
                                        onClick={() => handleActivityClick('trai-nghiem')}
                                    >
                                        <Image src="https://res.cloudinary.com/dznt9yias/image/upload/v1760726766/frame_hfc9ot.svg" alt="frame" fill />
                                        <div className='absolute inset-0 flex items-center justify-center '>
                                            <div className='flex  flex-col items-center justify-center w-[80%]'>
                                                <span className='text-center lg:text-2xl text-lg font-bd-street-sign text-[#AD844A]'>Trải nghiệm website</span>
                                                <span className='text-center lg:text-2xl text-lg font-bd-street-sign text-[#E3A12B]'>22/10 - 05/12</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className='relative w-[300px] lg:w-[400px] h-[80px] lg:h-[117px] flex items-center justify-center my-5 cursor-pointer hover:scale-105 transition-transform'
                                        onClick={() => handleActivityClick('san-thuong')}
                                    >
                                        <Image src="https://res.cloudinary.com/dznt9yias/image/upload/v1760726766/frame_hfc9ot.svg" alt="frame" fill />
                                        <div className='absolute inset-0 flex items-center justify-center '>
                                            <div className='flex  flex-col items-center justify-center w-[80%]'>
                                                <span className='text-center lg:text-[22px] text-[15px] font-bd-street-sign text-[#AD844A]'>Chuỗi hoạt động săn thưởng đổi quà</span>
                                                <span className='text-center lg:text-2xl text-lg font-bd-street-sign text-[#E3A12B]'>22/10 - 30/11</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className='relative w-[300px] lg:w-[400px] h-[80px] lg:h-[117px] flex items-center justify-center my-5 cursor-pointer hover:scale-105 transition-transform'
                                        onClick={() => handleActivityClick('su-kien')}
                                    >
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

                        {/* Hiển thị component tương ứng với activity được chọn */}
                        {selectedActivity === 'trai-nghiem' && <TraiNghiemWebsite />}
                        {selectedActivity === 'san-thuong' && <ChuoiHoatDongSanThuong />}
                        {selectedActivity === 'su-kien' && <SuKienTuongTac />}

                    </div>
                </div>
            </div >
        </div>
    )
}

export default TestPageClient
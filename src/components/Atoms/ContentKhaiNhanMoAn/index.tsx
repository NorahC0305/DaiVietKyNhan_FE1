import Image from 'next/image'
import React from 'react'

const CONTENT_CONFIG: Record<string, { img: string; title: string; color: string }> = {
    'Sơn Tinh': {
        img: 'https://res.cloudinary.com/dznt9yias/image/upload/v1760714093/Logo_ST_w5vzqy.svg',
        title: 'CHƯƠNG 1: KHỞI NGUYÊN KỲ GIỚI',
        color: '#41821E'
    },
    'Chử Đồng Tử': {
        img: 'https://res.cloudinary.com/dznt9yias/image/upload/v1760714057/Logo_C%C4%90T_dvt4yb.svg',
        title: 'CHƯƠNG 2: TÀ ẢNH',
        color: '#2B638F'
    },
    'Thánh Gióng': {
        img: 'https://res.cloudinary.com/dznt9yias/image/upload/v1760714074/Logo_TG_ybvbuo.svg',
        title: 'CHƯƠNG 3: BIẾN CỐ',
        color: '#EF493D'
    },
    'Liễu Hạnh': {
        img: 'https://res.cloudinary.com/dznt9yias/image/upload/v1760714057/Logo_LH_dvt4yb.svg',
        title: 'CHƯƠNG 4: HÀNH TRÌNH',
        color: '#8D3BBB'
    }
}

const ContentChuong4 = () => {
    return (
        <>
            {/* --- Content 1 --- */}
            <div className="px-10 flex items-center justify-between">
                <div className="w-[55%]">
                    <p className="text-secondary lg:text-xl text-base text-justify leading-relaxed">Kỳ Chủ đặt chân vào Kỳ Giới - nơi từng là cõi linh thiêng của ký ức Đại Việt, nay đã bị bao phủ bởi màn sương xám của Tà Ảnh.</p>

                    <br />
                    <p className="text-secondary lg:text-xl text-base text-justify leading-relaxed">Để khôi phục ánh sáng, Kỳ Chủ phải đi qua bốn vùng đất linh thiêng: Núi Tản Viên, Đầm Dạ Trạch, Làng Phù Đổng và Phủ Tây Hồ.</p>
                </div>
                <div className="relative lg:w-[270px] lg:h-[230px] w-[180px] h-[150px]">
                    <Image src='https://res.cloudinary.com/dznt9yias/image/upload/v1760866961/T%C3%A0_%E1%BA%A2nh_1_o8opax.png' alt="talinh" fill />
                </div>
            </div>

            {/* --- Content 2 --- */}
            <div className="px-10 mt-6 mb-6 flex items-center justify-between">
                <div className="relative w-[280px] h-[250px] lg:h-[350px] lg:w-[400px]">
                    <Image src='https://res.cloudinary.com/dauhpllo7/image/upload/v1763392095/l%E1%BB%ADa_t%E1%BA%AFt_1_ezzoka.png' alt="NgonLuaTat" fill />
                </div>
                <div className="w-[60%] ml-10">
                    <span className="text-secondary lg:text-xl text-base text-justify mb-0.5 leading-relaxed">Tại mỗi vùng đất, Kỳ Chủ sẽ thông qua những dấu tích còn sót lại từ những câu chuyện Kỳ Nhân để giải phong ấn cho họ. Mỗi khi thành công giải ấn cho một Kỳ Nhân, cảm xúc và ký ức của họ lại sống dậy, trao cho Kỳ Chủ một Kỳ Ấn - những thông tin và câu chuyện về Kỳ Nhân đó.</span>
                    <br />
                    <br />
                    <span className="text-secondary lg:text-xl text-base text-justify mb-0.5 leading-relaxed">Càng nhiều Kỳ Ấn được thu thập, ánh sáng trong Kỳ Giới càng mạnh mẽ hơn, từng chút đẩy lùi bóng tối của Tà Ảnh. Khi bốn vùng đất được thanh tẩy, bốn dấu ấn của Tứ Bất Tử - bốn Kỳ Văn - trỗi dậy và hợp nhất để triệu hồi vùng đất cuối cùng, Tứ Nguyên Linh Giới: Khai Hoa Huyền Ấn. Nơi đó, Tà Ảnh đang ẩn náu để giữ không cho ngọn Kỳ Linh Việt Hỏa được thắp sáng.</span>
                </div>
            </div>
        </>
    )
}

const ContentChuong3 = () => {
    return (
        <>
            {/* --- Content 1 --- */}
            <div className="px-10 flex items-center justify-between">
                <div className="w-[65%]">
                    <p className="text-secondary lg:text-xl text-base text-justify leading-relaxed">Mỗi khi có người thở dài lười biếng trước những trang sử dài miên man, hoặc ngán ngẩm trước những thông tin khô khan phải ghi nhớ, Tà Ảnh lại âm thầm lớn thêm một phần sức mạnh.</p>
                    <br />
                    <p className="text-secondary lg:text-xl text-base text-justify leading-relaxed">Cứ thế, Tà Ảnh từng chút một lớn lên. Từ những làn sương đen yếu ớt, nó tích tụ năng lượng trong im lặng, lan khắp những kẽ hở của tâm trí con người.</p>
                </div>
                <div className="relative w-[230px] h-[230px]">
                    <Image src='https://res.cloudinary.com/dznt9yias/image/upload/v1760866961/T%C3%A0_%E1%BA%A2nh_1_o8opax.png' alt="talinh" fill />
                </div>
            </div>

            {/* --- Content 2 --- */}
            <div className="px-10 mt-6 mb-6 flex items-center justify-between">
                <div className="relative w-[240px] h-[200px]">
                    <Image src='https://res.cloudinary.com/dauhpllo7/image/upload/v1763392095/l%E1%BB%ADa_t%E1%BA%AFt_1_ezzoka.png' alt="NgonLuaTat" fill />
                </div>
                <div className="w-[60%] ml-10">
                    <span className="text-secondary lg:text-xl text-base text-justify mb-0.5 leading-relaxed">Và rồi, khi sức mạnh đủ lớn, bóng tối ấy bắt đầu len lỏi vào Kỳ Giới – nơi lẽ ra chỉ có ánh sáng của ký ức và niềm tin tồn tại. Biến cố ập đến khi nó thổi tắt Kỳ Linh Việt Hỏa, dập tắt ánh sáng thiêng liêng vốn nuôi dưỡng linh hồn đất Việt. Hậu quả là toàn bộ các Kỳ Nhân – những danh nhân đã góp phần làm nên linh hồn dân tộc – bị phong ấn trong những  cuộn giấy cổ.</span>
                </div>
            </div>

            {/* --- Content 3 --- */}
            <div className="px-10 mt-6 mb-6 flex items-center justify-between">
                <div className="w-[50%] mr-10">
                    <span className="text-secondary lg:text-xl text-base text-justify mb-0.5 leading-relaxed">Và rồi, khi sức mạnh đủ lớn, bóng tối ấy bắt đầu len lỏi vào Kỳ Giới – nơi lẽ ra chỉ có ánh sáng của ký ức và niềm tin tồn tại. Biến cố ập đến khi nó thổi tắt Kỳ Linh Việt Hỏa, dập tắt ánh sáng thiêng liêng vốn nuôi dưỡng linh hồn đất Việt. Hậu quả là toàn bộ các Kỳ Nhân – những danh nhân đã góp phần làm nên linh hồn dân tộc – bị phong ấn trong những  cuộn giấy cổ.</span>
                </div>
                <div className="relative lg:w-[350px] lg:h-[250px] w-[250px] h-[150px]">
                    <Image src='https://res.cloudinary.com/dauhpllo7/image/upload/v1763392050/557595175_1129889679256040_6828254329627511677_n_1_gfdfdn.png' alt="Cackynhanbiphongan" fill />
                </div>
            </div>

            {/* --- Content 4 --- */}
            <div className="px-10 mt-6 mb-6 flex items-center justify-between">
                <div className="relative lg:w-[350px] lg:h-[550px] w-[250px] h-[400px]">
                    <Image src='https://res.cloudinary.com/dauhpllo7/image/upload/v1763392058/s%C3%A1ch_t%C3%A1ch_n%E1%BB%81n_1_i9bhft.png' alt="SachDaiVietKyNhan" fill />
                </div>
                <div className="w-[50%] ml-10">
                    <span className="text-secondary lg:text-xl text-base text-justify mb-0.5 leading-relaxed">Trước biến cố ấy, Tứ Bất Tử không thể khoanh tay đứng nhìn. Họ cảm nhận rõ bóng tối đang len sâu vào linh hồn dân tộc, khiến ánh lửa ký ức dần lụi tàn. Nhưng là những đấng thần linh, họ hiểu hơn ai hết rằng vận mệnh của một dân tộc phải do chính con người của dân tộc ấy quyết định.
                        <br />
                        <br />
                        Vì vậy, họ chọn cách gửi gắm vào hậu thế. Tứ Bất Tử hợp lực, kết tụ ánh sáng còn sót lại của Kỳ Linh Việt Hỏa vào một cuốn sách và gửi nó xuống Nhân Giới, chờ đợi người mở ra. Đó chính là cánh cổng dẫn đến Kỳ Giới dành cho người hữu duyên tìm được. Và người đó không ai khác, chính là bạn - một Kỳ Chủ mang trong mình sứ mệnh KHAI NHÂN MỞ ẤN.</span>
                </div>
            </div>
        </>
    )
}

const ContentChuong2 = () => {
    return (
        <>
            {/* --- Content 1 --- */}
            <div className="px-10 flex items-center justify-between">
                <div className="w-[80%]">
                    <span className="text-secondary lg:text-xl text-base text-justify leading-relaxed">Giống như ánh sáng và bóng tối là hai mặt song hành của tự nhiên, nơi có ngọn lửa, ở đó cũng có tro tàn.</span>
                    <br />
                    <br />
                    <span className="text-secondary lg:text-xl text-base text-justify leading-relaxed">Vào những năm quân Minh xâm lược nước ta, chúng đã đốt phá, thiêu hủy gần như toàn bộ sử sách Đại Việt. Lịch sử bỗng chốc đứt đoạn, ký ức dân tộc rơi vào khoảng trống không thể hàn gắn. Từ trong những tro tàn ấy, Tà Ảnh sinh ra.</span>
                    <br />
                    <br />
                    <span className="text-secondary lg:text-xl text-base text-justify leading-relaxed">Ban đầu, Tà Ảnh chỉ là những bào thai hỗn loạn. Bản thể của nó là những làn sương đen mỏng, yếu ớt, mang hình dạng của những ý niệm sai lệch trước lịch sử.  </span>
                </div>
                <div className="relative w-[270px] lg:w-[300px] h-[270px] lg:h-[330px]">
                    <Image src='https://res.cloudinary.com/dauhpllo7/image/upload/v1763402526/Ta%CC%80_A%CC%89nh_1_oekar0.png' alt="TaAnh" fill />
                </div>
            </div>

            {/* --- Content 2 --- */}
            <div className="px-10 mt-6 mb-6 flex items-center justify-between">
                <span className="text-secondary lg:text-xl text-base text-justify leading-relaxed">Thế nhưng, chúng không thể khuất phục được ý chí quật cường của người Việt – ngọn lửa ấy đã được rèn trong máu và niềm tin của muôn thế hệ. Không thể chiến thắng trực diện, Tà Ảnh rút vào bóng tối, tồn tại dai dẳng, âm thầm len vào tâm trí con người. Không thể chiến thắng, Tà Ảnh rút vào bóng tối, chọn một cách tồn tại khác. Nó không xóa bỏ ký ức, mà lăm le tắt đi những cảm xúc trong ký ức ấy.
                    <br />
                    <br />
                    <span className="text-secondary lg:text-xl text-base text-justify leading-relaxed">
                        Theo thời gian, lịch sử dần mất đi sự sống động. Con người vẫn nhớ đến các vị danh nhân nnhưng chỉ như những cái tên trên giấy mực, những tượng đá trầm lặng. Họ được nhắc đến qua chiến công, mốc thời gian, danh hiệu, chứ không còn là những con người với đầy đủ cảm xúc, nỗi sợ, niềm tin, và cả những góc khuất rất đỗi nhân sinh.
                    </span>
                    <br />
                    <br />
                    <span className="text-secondary lg:text-xl text-base text-justify leading-relaxed">
                        Lịch sử không biến mất, nhưng dưới sự ảnh hưởng của Tà Ảnh dần trở nên một chiều, lạnh lẽo – như ngọn lửa bị bao phủ bởi lớp tro tàn dày đặc, chỉ chờ một ai đủ niềm tin để thắp sáng lại.</span>
                </span>
            </div>
        </>
    )
}

const ContentChuong1 = () => {
    return (
        <>
            {/* --- Content 1 --- */}
            <div className="px-10 flex items-center justify-between">
                <div className="w-[70%]">
                    <span className="text-secondary lg:text-xl text-base text-justify leading-relaxed">Ngàn năm về trước, mỗi dân tộc đều có riêng cho mình một ngọn lửa thiêng – kết tinh của hồn cốt và ký ức dân tộc, là mạch nguồn lưu giữ câu chuyện của muôn ngàn thế hệ. Ngọn lửa của con dân đất Việt mang tên Kỳ Linh Việt Hỏa. Ánh sáng của ngọn lửa trường tồn ấy không chỉ soi tỏ lịch sử, mà còn gắn kết nó với từng con người bằng xương bằng thịt, cùng nỗi buồn, niềm vui, khát vọng của họ. </span>
                </div>
                <div className="relative w-[200px] h-[200px]">
                    <Image src='https://res.cloudinary.com/dauhpllo7/image/upload/v1763391990/K%E1%BB%B3_Linh_Vi%E1%BB%87t_H%E1%BB%8Fa_4_yb7psq.png' alt="KyLinhVietHoa" fill />
                </div>
            </div>

            {/* --- Content 2 --- */}
            <div className="px-10 mt-6 mb-6 flex items-center justify-between">
                <div className="relative w-[300px] h-[280px]">
                    <Image src='https://res.cloudinary.com/dauhpllo7/image/upload/v1763391729/POST_TBT_1_fohths.png' alt="Post TBT 1" fill />
                </div>
                <div className="w-[70%] ml-10">
                    <span className="text-secondary lg:text-xl text-base text-justify mb-0.5 leading-relaxed">Tứ Bất Tử được chọn làm những vị thần canh giữ Kỳ Linh Việt Hỏa. Để bảo vệ ngọn lửa khỏi những thế lực xấu xa, họ đã cùng nhau dựng nên Kỳ Giới - một cõi linh thiêng, huyền ảo với bốn vùng đất được bảo hộ bởi mỗi vị thần tương ứng Những vùng đất ấy lần lượt là:</span>
                    <ul className="list-disc list-inside">
                        <li className="font-bold text-secondary lg:text-xl text-base mt-0.5">Núi Tản Viên (Sơn Tinh)</li>
                        <li className="font-bold text-secondary lg:text-xl text-base mt-0.5">Đầm Dạ Trạch (Chử Đồng Tử)</li>
                        <li className="font-bold text-secondary lg:text-xl text-base mt-0.5">Làng Phù Đổng (Thánh Gióng)</li>
                        <li className="font-bold text-secondary lg:text-xl text-base mt-0.5">Phủ Tây Hồ (Liễu Hạnh Công Chúa)</li>
                    </ul>
                </div>
            </div>

            <div className="mt-10 ml-10 text-secondary lg:text-xl text-base text-justify leading-relaxed">
                <span>Tại mỗi vùng đất tồn tại linh hồn của các Kỳ Nhân. Họ ở đó để duy trì sự cân bằng của Kỳ Giới và gìn giữ những mảnh ký ức dân tộc, dẫn truyền năng lượng từ ngọn lửa thiêng vào đời sống con người. Mỗi Kỳ Nhân đại diện cho một phẩm chất, một giá trị của dân tộc, là mắt xích kết nối giữa lịch sử và con người.</span>
                <br />
                <br />
                <span>Còn Kỳ Linh Việt Hỏa được cất giữ trong vùng đất Thứ năm, cũng là vùng đất quan trọng nhất, nơi hội tụ toàn bộ ký ức và là nơi cung cấp năng lượng cốt lõi cho Kỳ Giới. Vùng đất này mang tên là  Tứ Nguyên Linh Giới: Khai Hoa Huyền Ấn.</span>
            </div>
        </>

    )
}

const ContentKhaiNhanMoAn = ({ isHidden, an }: { isHidden: boolean, an: string }) => {
    const renderContent = () => {
        switch (an) {
            case 'Sơn Tinh':
                return <ContentChuong1 />;
            case 'Chử Đồng Tử':
                return <ContentChuong2 />;
            case 'Thánh Gióng':
                return <ContentChuong3 />;
            case 'Liễu Hạnh':
                return <ContentChuong4 />;
            default:
                return <ContentChuong1 />;
        }
    };

    return (
        <div className={`mt-10 w-full flex items-center justify-center ${isHidden ? 'hidden' : ''}`}>
            <div className="bg-[#a4a89d29] lg:w-[93%] w-[98%] lg:h-full rounded-xl lg:py-10">
                <h1
                    className="font-bd-street-sign text-center lg:text-6xl text-3xl mb-10"
                    style={{
                        color: CONTENT_CONFIG[an]?.color || '#41821E',
                        WebkitTextStrokeWidth: 2,
                        WebkitTextStrokeColor: '#FFDD3D',
                        strokeWidth: 2,
                        stroke: '#FFDD3D',
                        paintOrder: 'stroke fill',
                    }}
                >
                    {CONTENT_CONFIG[an]?.title || 'CHƯƠNG 1: KHỞI NGUYÊN KỲ GIỚI'}
                </h1>

                {/* Render content based on selected chapter */}
                {renderContent()}
            </div>
        </div>
    )
}

export default ContentKhaiNhanMoAn
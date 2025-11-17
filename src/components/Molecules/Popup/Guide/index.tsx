import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import React from 'react'
import { Plus } from 'lucide-react'
import TrangSuConDoiAiDua from '@components/Atoms/TrangSuConDoiAiDua'

const Guide = ({ isOpen, onClose, user }: { isOpen: boolean, onClose: () => void, user: any | null }) => {

    const renderHearts = (heartCount: number) => {
        const hearts = [];

        for (let i = 0; i < 3; i++) {
            hearts.push(
                <div
                    key={i}
                    className="relative lg:w-[25px] lg:h-[28px] w-[18px] h-[18px]"
                >
                    <Image src={i < heartCount ? 'https://res.cloudinary.com/dauhpllo7/image/upload/v1763390706/Heart_mii1b0.png' : 'https://res.cloudinary.com/dauhpllo7/image/upload/v1763392338/Heart_ahlmhm.png'} alt="heart" fill />
                </div>
            );
        }
        return hearts;
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className='relative mx-3 w-full lg:max-w-5xl max-w-3xl'
                    >
                        <div className='relative lg:top-[150px] lg:-left-[230px] top-[130px] -left-[100px] z-10'>
                            <div className='absolute lg:w-[300px] lg:h-[450px] w-[150px] h-[250px]'>
                                <Image src={user?.godProfile?.imgUrl} alt={user?.godProfile?.id} fill />
                            </div>
                        </div>

                        <>
                            <div className='relative bg-primary-light border-4 border-secondary rounded-2xl my-4 sm:my-6 md:my-10 px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8'>
                                <button
                                    className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 cursor-pointer p-1 sm:p-2"
                                    onClick={onClose}
                                    aria-label="Đóng"
                                >
                                    <span className="block relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12">
                                        <Image
                                            src="https://res.cloudinary.com/dauhpllo7/image/upload/v1763391063/Tr%E1%BB%9F_l%E1%BA%A1i_trang_tr%C6%B0%E1%BB%9Bc_t1jpaz.png"
                                            alt="Đóng"
                                            fill
                                            sizes="(max-width: 640px) 32px, (max-width: 768px) 40px, 48px"
                                            style={{ objectFit: "contain" }}
                                        />
                                    </span>
                                </button>

                                <div className="max-h-[80vh] overflow-y-auto custom-scrollbar-elegant">
                                    {/* --- Title --- */}
                                    <h1 className="lg:text-6xl text-4xl pt-3 text-center font-bd-street-sign" style={{ color: user?.godProfile?.text_color }}>CHÀO MỪNG ĐẾN VỚI HÀNH TRÌNH “KHAI NHÂN MỞ ẤN”</h1>
                                    <TrangSuConDoiAiDua />

                                    {/* --- Content --- */}
                                    <div className='flex items-center justify-around pb-2'>
                                        {/* Story */}
                                        <div className='relative w-[230px] lg:w-[400px] h-[240px] lg:h-[370px]'>
                                            <Image src='https://res.cloudinary.com/dznt9yias/image/upload/v1760865503/POST_TBT_1_js9xab.png' alt='POST_TBT_1' fill />
                                        </div>

                                        <div className='w-1/2'>
                                            <span className='lg:text-xl text-sm font-extrabold text-secondary text-justify leading-relaxed'>
                                                Từ thuở xa xưa, tồn tại một vùng đất linh thiêng mang tên Kỳ Giới, nơi những Kỳ Nhân giữ gìn hồn cốt và linh khí của dân tộc.
                                            </span>
                                            <br />
                                            <br />
                                            <span className='lg:text-xl text-sm font-extrabold text-secondary text-justify leading-relaxed'>
                                                Kỳ Giới có bốn miền linh địa, mỗi vùng lại được bảo hộ bởi một vị thần trong Tứ Bất Tử.
                                            </span>
                                            <br />
                                            <br />
                                            <span className='lg:text-xl text-sm font-extrabold text-secondary text-justify leading-relaxed'>
                                                Thế nhưng, một thế lực bí ẩn đã xâm nhập vào Kỳ Giới, khiến linh khí suy yếu và các Kỳ Nhân bị phong ấn trong những cuộn giấy cổ, gọi là Kỳ Ấn.
                                            </span>
                                        </div>
                                    </div>

                                    {/* --- Introduction Figures --- */}
                                    <div className='flex items-center justify-around pb-2'>
                                        <div className='w-1/2'>
                                            <p className='lg:text-xl text-sm font-extrabold text-secondary text-justify leading-relaxed'>Từ đây, bạn sẽ nhập vai một Kỳ Chủ - người được chọn để bước vào hành trình khám phá Kỳ Giới, giải ấn Kỳ Nhân.</p><br />
                                            <p className='lg:text-xl text-sm font-extrabold text-secondary text-justify leading-relaxed'>Đồng thời, bạn sẽ từng bước lật mở bí ẩn về nguồn gốc biến cố đã xảy ra với Kỳ Giới, cũng như thông tin mà vùng đất thứ năm - vùng đất cuối cùng - đang ẩn chứa.</p>
                                        </div>
                                        <div className='flex items-center'>
                                            <div className='relative w-[150px] lg:w-[200px] h-[300px] lg:h-[370px]'>
                                                <Image src='https://res.cloudinary.com/dznt9yias/image/upload/v1760990827/figures/images/file_bgsgvx_6c3e09.png' alt='figures_male' fill />
                                            </div>
                                            <div className='relative w-[150px] lg:w-[200px] h-[300px] lg:h-[370px]'>
                                                <Image src='https://res.cloudinary.com/dznt9yias/image/upload/v1760990779/figures/images/file_reoxf0_deccf3.png' alt='figures_female' fill />
                                            </div>
                                        </div>
                                    </div>


                                    {/* --- Guide Map --- */}
                                    <div className='mt-10 lg:py-6 py-3 mx-4 pb-2 border border-[#aaaaaa] bg-[#a4a89d57] rounded-2xl'>
                                        <h4 className='lg:text-5xl text-3xl font-bd-street-sign text-[#CE7346] text-center'>Bản đồ Kỳ Giới</h4>
                                        <div className='flex items-center justify-around'>
                                            <div className='relative w-[1000px] lg:w-[1000px] h-[300px] lg:h-[370px] ml-4'>
                                                <Image src='https://res.cloudinary.com/dznt9yias/image/upload/v1760992467/Group_106_hbl7no.png' alt='guide_map' fill />
                                            </div>
                                            <ul className='mx-5 list-disc list-inside'>
                                                <li className='text-secondary lg:text-xl text-sm'>Có bốn vùng đất ứng với bảo hộ của bốn vị thần:
                                                    <br />
                                                    <span className='ml-5 lg:ml-7 font-extrabold text-secondary lg:text-xl text-sm'>Núi Tản Viên - Sơn Tinh</span>
                                                    <br />
                                                    <span className='ml-5 lg:ml-7 font-extrabold text-secondary lg:text-xl text-sm'>Đầm Dạ Trạch - Chử Đồng Tử</span>
                                                    <br />
                                                    <span className='ml-5 lg:ml-7 font-extrabold text-secondary lg:text-xl text-sm'>Làng Phù Đổng - Thánh Gióng</span>
                                                    <br />
                                                    <span className='ml-5 lg:ml-7 font-extrabold text-secondary lg:text-xl text-sm'>Phủ Tây Hồ - Công chúa Liễu Hạnh</span>
                                                    <br />
                                                </li>
                                                <li className='text-secondary lg:text-xl text-sm'>Mỗi vùng có 9-14 Kỳ Nhân, đại diện cho tinh thần của vị Tứ Bất Tử tương ứng.</li>
                                                <li className='text-secondary lg:text-xl text-sm'>Mỗi cuộn giấy tương ứng với một Kỳ Nhân đang bị phong ấn.</li>
                                                <li className='text-secondary lg:text-xl text-sm'>Ngoài ra còn có vùng đất thứ năm, chỉ mở khóa sau khi hoàn thành giải phong ấn cho các Kỳ Nhân thuộc bốn vùng đất trước đó.</li>
                                            </ul>
                                        </div>
                                    </div>


                                    {/* --- How to Play --- */}
                                    <div className='mt-10 lg:py-6 mx-4 pb-5 border border-[#aaaaaa] bg-[#a4a89d57] rounded-2xl'>
                                        <h4 className='lg:text-5xl text-3xl font-bd-street-sign text-[#CE7346] text-center'>Cách chơi</h4>

                                        {/* Question and Answer */}
                                        <div className='flex items-center justify-around mt-4 '>
                                            <ul className='list-disc list-inside w-[40%]'>
                                                <li className='text-secondary lg:text-xl text-sm'>Lần lượt giải mã các câu hỏi để tìm ra danh tính các vị Kỳ Nhân bị phong ấn ở mỗi vùng đất</li>
                                            </ul>
                                            <div className='relative w-[80px] lg:w-[80px] h-[50px] lg:h-[50px] ml-4'>
                                                <Image src='https://res.cloudinary.com/dznt9yias/image/upload/v1760993978/cuo%CC%A3%CC%82n_gia%CC%82%CC%81y_cuo%CC%A3%CC%82n_la%CC%A3i_1_1_x3dwbd.png' alt='cuon_giay_cuon_lai' fill />
                                            </div>
                                            <div className='relative w-[140px] lg:w-[160px] h-[100px] lg:h-[100px] ml-4'>
                                                <Image src='https://res.cloudinary.com/dznt9yias/image/upload/v1760994096/Pop-up_ca%CC%82u_ho%CC%89i_1_1_yhz2o9.png' alt='cau_hoi' fill />
                                            </div>
                                        </div>

                                        {/* Right and Wrong Answer */}
                                        <div className='flex items-center justify-around mt-5'>
                                            <div className='w-[40%]'>
                                                <span className='text-right-answer lg:text-xl text-sm'>Trả lời đúng: Thu thập được Kỳ Ấn của Kỳ Nhân đó và +100 điểm</span>
                                            </div>
                                            <div className='w-[40%]'>
                                                <span className='text-wrong-answer lg:text-xl text-sm'>Trả lời sai: Mất một mạng và -20 điểm</span>
                                            </div>
                                        </div>

                                        <div className='flex justify-around'>
                                            {/* ***Collect Kỳ Ấn & Plus Point*** */}
                                            <div className='flex items-center justify-start'>
                                                <div className='relative w-[140px] lg:w-[200px] h-[230px] lg:h-[300px] ml-4'>
                                                    <Image src='https://res.cloudinary.com/dznt9yias/image/upload/v1760994814/An_Tu%CC%9B_Co%CC%82ng_Chu%CC%81a62_1_vihyo0.png' alt='thu_thap_ki_an' fill />
                                                </div>
                                                <div className='relative w-[120px] lg:w-[200px] h-[30px] lg:h-[70px] ml-4'>
                                                    <Image src='https://res.cloudinary.com/dauhpllo7/image/upload/v1763392323/khung_m%E1%BA%A1ng_xu_%C4%91i%E1%BB%83m_.._3_xodyzk.png' alt='thu_thap_ki_an' fill />
                                                    <div className='absolute inset-0 flex items-center justify-center'>
                                                        <span className='text-secondary lg:text-xl text-sm'>+100 điểm</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* ***Heart & Minus Point*** */}
                                            <div className='flex flex-col items-center justify-center'>
                                                <div className="flex items-center">
                                                    <div className="relative top-0 left-0 flex items-center justify-center lg:ml-5 ml-3 drop-shadow-2xl ">
                                                        <div className="relative lg:w-[180px] lg:h-[55px] w-[120px] h-[55px]">
                                                            <Image src='https://res.cloudinary.com/dauhpllo7/image/upload/v1763390553/khung_m%E1%BA%A1ng_xu_%C4%91i%E1%BB%83m_.._3_ij8bzq.png' alt='khung_ma_ng_xu_diem' fill />
                                                        </div>
                                                        <div className="absolute top-0 left-0 flex justify-center items-center h-full w-full gap-2">
                                                            {renderHearts(2)}
                                                        </div>
                                                    </div>
                                                    <Plus
                                                        color="red"
                                                        className="cursor-pointer drop-shadow-2xl hover:opacity-60 transition-all duration-300"
                                                        strokeWidth={3}
                                                        size={20}
                                                    />
                                                </div>

                                                <div className='relative w-[120px] lg:w-[180px] h-[30px] lg:h-[55px]'>
                                                    <Image src='https://res.cloudinary.com/dauhpllo7/image/upload/v1763390553/khung_m%E1%BA%A1ng_xu_%C4%91i%E1%BB%83m_.._3_ij8bzq.png' alt='thu_thap_ki_an' fill />
                                                    <div className='absolute inset-0 flex items-center justify-center'>
                                                        <span className='text-secondary lg:text-xl text-sm'>-20 ĐIỂM</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='flex items-center mt-5 text-secondary lg:text-xl text-sm'>
                                            <div className='list-disc list-inside flex items-center  h-[60px] gap-4 ml-10'>
                                                <li className='text-end'>Mỗi ngày, bạn có 3 mạng chơi</li>
                                                <div className='relative w-[120px] lg:w-[180px] h-[30px] lg:h-[35px]'>
                                                    <div className="relative lg:w-[180px] lg:h-[35px] w-[120px] h-[35px]">
                                                        <Image src='https://res.cloudinary.com/dauhpllo7/image/upload/v1763390553/khung_m%E1%BA%A1ng_xu_%C4%91i%E1%BB%83m_.._3_ij8bzq.png' alt='khung_ma_ng_xu_diem' fill />
                                                    </div>
                                                    <div className="absolute lg:top-0 top-0.5 lg:left-0 flex justify-center items-center h-full w-full gap-2">
                                                        {renderHearts(3)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    </motion.div>

                </div>
            )
            }
        </AnimatePresence >
    )
}

export default Guide
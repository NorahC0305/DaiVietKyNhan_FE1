import React from 'react'
import H3LibDetail from '../H3'
import PLibDetail from '../P'
import RadialGradial from '@components/Atoms/RadialGradient'
import Image from 'next/image'

const KyNhanSummary = ({ moTaKyNhan }: { moTaKyNhan: any }) => {
    return (
        <div className="flex items-center justify-center">
            {/* Main scroll container */}
            <div className="relative w-[1400px] h-[800px] lg:h-[900px]">
                <Image src="https://res.cloudinary.com/dauhpllo7/image/upload/v1763392066/khung_chi_ti%E1%BA%BFt_2_smpo9j.png" alt="Library Detail" className="relative w-full" fill />
                <div className="absolute top-0 left-0 w-full h-full">
                    {/* Content area */}
                    <div className="flex justify-around items-center h-full">

                        {/* Two column layout */}
                        <div className="gap-8 flex justify-between items-center w-[80%]">
                            {/* ------------------- Left Column ------------------- */}
                            <div className="space-y-2.5 w-[36%] z-20">
                                <RadialGradial className="ml-5 text-4xl lg:text-6xl py-3 mb-1">
                                    {moTaKyNhan?.ten}
                                </RadialGradial>
                                {/* Danh hiệu */}
                                <div className="ml-6">
                                    <H3LibDetail className="text-2xl lg:text-4xl">DANH HIỆU</  H3LibDetail>
                                    <PLibDetail>
                                        {moTaKyNhan?.danhHieu}
                                    </PLibDetail>
                                </div>

                                {/* Năm sinh - mất */}
                                <div className="ml-8">
                                    <H3LibDetail className="text-2xl lg:text-4xl">NĂM SINH - MẤT</H3LibDetail>
                                    <PLibDetail>
                                        {moTaKyNhan?.namSinhNamMat}
                                    </PLibDetail>
                                </div>

                                {/* Quê quán */}
                                <div className="ml-12">
                                    <H3LibDetail className="text-2xl lg:text-4xl">QUÊ QUÁN</H3LibDetail>
                                    <PLibDetail>
                                        {moTaKyNhan?.queQuan}
                                    </PLibDetail>
                                </div>

                                {/* Xuất thân */}
                                <div className="ml-20">
                                    <H3LibDetail className="text-2xl lg:text-4xl">XUẤT THÂN</H3LibDetail>
                                    <PLibDetail>
                                        {moTaKyNhan?.xuatThan}
                                    </PLibDetail>
                                </div>

                                {/* Sự nghiệp */}
                                <div className="ml-24">
                                    <H3LibDetail className="text-2xl lg:text-4xl">SỰ NGHIỆP</H3LibDetail>
                                    <PLibDetail>
                                        {moTaKyNhan?.khoiNghia}
                                    </PLibDetail>
                                </div>
                            </div>

                            {/* ------------------- Character illustration in center ------------------- */}
                            <div className="absolute flex justify-center items-center w-[80%] h-[75%] z-10 pointer-events-none">
                                <div className="relative w-[250px] h-[450px] lg:w-[333px] lg:h-[666px]">
                                    <Image
                                        src={moTaKyNhan?.imgUrl}
                                        alt={moTaKyNhan?.ten}
                                        fill
                                        priority
                                    />
                                </div>

                                {/* Decorative background circle */}
                                <div className="absolute -z-10 w-[500px] h-[500px] lg:w-[650px] lg:h-[650px]">
                                    <Image src="https://res.cloudinary.com/dauhpllo7/image/upload/v1763392846/2ef0d20b52ffbab170a2db40d779a5dc_1_w8p39y.png" alt="Detail Circle" fill />
                                </div>
                            </div>

                            {/* -------------------- Right Column -------------------- */}
                            <div className="space-y-6 z-20 flex flex-col justify-end items-center w-[32%]">
                                {/* Người đồng hành */}
                                <div className="text-end w-full mr-10">
                                    <H3LibDetail className="text-2xl lg:text-4xl">NGƯỜI ĐỒNG HÀNH</H3LibDetail>
                                    <PLibDetail>
                                        {moTaKyNhan?.nguoiDongHanh}
                                    </PLibDetail>
                                </div>

                                {/* Phu quân/phu nhân */}
                                <div className="text-end w-full mr-12">
                                    <H3LibDetail className="text-2xl lg:text-4xl">PHU QUÂN/PHU NHÂN</H3LibDetail>
                                    <PLibDetail>
                                        {moTaKyNhan?.phuQuan}
                                    </PLibDetail>
                                </div>

                                {/* Chiến công */}
                                <div className="text-end w-full mr-20">
                                    <H3LibDetail className="text-2xl lg:text-4xl">CHIẾN CÔNG</H3LibDetail>
                                    <PLibDetail>
                                        {moTaKyNhan?.chienCong}
                                    </PLibDetail>
                                </div>

                                {/* Vai trò */}
                                <div className="text-end w-full mr-32">
                                    <H3LibDetail className="text-2xl lg:text-4xl">VAI TRÒ</H3LibDetail>
                                    <PLibDetail>
                                        {moTaKyNhan?.dinhCao}
                                    </PLibDetail>
                                </div>

                                {/* Kết cục */}
                                <div className="text-end w-full mr-44">
                                    <H3LibDetail className="text-2xl lg:text-4xl">KẾT CỤC</H3LibDetail>
                                    <PLibDetail>
                                        {moTaKyNhan?.ketCuc}
                                    </PLibDetail>
                                </div >
                            </div >
                        </div >
                    </div >
                </div >
            </div >
        </div>
    )
}

export default KyNhanSummary
'use client'

import ChiTietThu from "@components/Molecules/Popup/ChiTietThu";
import DanhSachVietThu from "@components/Molecules/Popup/DanhSachVietThu";
import VietThuGuiHauThe from "@components/Molecules/Popup/VietThuGuiHauThe"
import { useState } from "react"

const TestPageClient = () => {
    const [isOpenVietThuGuiHauThe, setIsOpenVietThuGuiHauThe] = useState(false);
    const [isOpenDanhSachVietThu, setIsOpenDanhSachVietThu] = useState(false);
    const [isOpenChiTietThu, setIsOpenChiTietThu] = useState(false);
    return (
        <>
            <VietThuGuiHauThe isOpen={isOpenVietThuGuiHauThe} onClose={() => setIsOpenVietThuGuiHauThe(false)} />
            <button onClick={() => setIsOpenVietThuGuiHauThe(true)} className="bg-blue-500 text-white p-2 rounded-md">Open Viet Thu Gui Hau The</button>

            <DanhSachVietThu isOpen={isOpenDanhSachVietThu} onClose={() => setIsOpenDanhSachVietThu(false)} />
            <button onClick={() => setIsOpenDanhSachVietThu(true)} className="bg-blue-500 text-white p-2 rounded-md">Open Danh Sach Viet Thu</button>

            <ChiTietThu isOpen={isOpenChiTietThu} onClose={() => setIsOpenChiTietThu(false)} />
            <button onClick={() => setIsOpenChiTietThu(true)} className="bg-blue-500 text-white p-2 rounded-md">Open Chi Tiet Thu</button>
        </>
    )
}

export default TestPageClient
'use client'

import ChiTietThu from "@components/Molecules/Popup/ChiTietThu";
import DanhSachVietThu from "@components/Molecules/Popup/DanhSachVietThu";
import VietThuGuiHauThe from "@components/Molecules/Popup/VietThuGuiHauThe"
import { useState } from "react"
import { ILetterEntity } from "@models/letter/entity";

const TestPageClient = () => {
    const [isOpenVietThuGuiHauThe, setIsOpenVietThuGuiHauThe] = useState(false);
    const [isOpenDanhSachVietThu, setIsOpenDanhSachVietThu] = useState(false);
    const [isOpenChiTietThu, setIsOpenChiTietThu] = useState(false);
    const [selectedLetterId, setSelectedLetterId] = useState<number | null>(null);
    const [lettersList, setLettersList] = useState<ILetterEntity[]>([]);

    const handleOpenDetail = (letter: ILetterEntity, letters: ILetterEntity[]) => {
        console.log('Test page - Opening detail for letter:', letter.id);
        setLettersList(letters);
        setSelectedLetterId(letter.id);
        setIsOpenDanhSachVietThu(false);
        setIsOpenChiTietThu(true);
    };

    const handleLetterChange = (letterId: number) => {
        setSelectedLetterId(letterId);
    };

    const handleChiTietBack = () => {
        setIsOpenChiTietThu(false);
        setIsOpenDanhSachVietThu(true);
    };

    return (
        <>
            <VietThuGuiHauThe isOpen={isOpenVietThuGuiHauThe} onClose={() => setIsOpenVietThuGuiHauThe(false)} />
            <button onClick={() => setIsOpenVietThuGuiHauThe(true)} className="bg-blue-500 text-white p-2 rounded-md">Open Viet Thu Gui Hau The</button>

            <DanhSachVietThu 
                isOpen={isOpenDanhSachVietThu} 
                onClose={() => setIsOpenDanhSachVietThu(false)}
                onOpenDetail={handleOpenDetail}
            />
            <button onClick={() => setIsOpenDanhSachVietThu(true)} className="bg-blue-500 text-white p-2 rounded-md">Open Danh Sach Viet Thu</button>

            <ChiTietThu 
                key={selectedLetterId || 'chi-tiet-thu'}
                isOpen={isOpenChiTietThu} 
                letterId={selectedLetterId}
                letters={lettersList}
                onLetterChange={handleLetterChange}
                onClose={() => {
                    setIsOpenChiTietThu(false);
                    setSelectedLetterId(null);
                    setLettersList([]);
                }}
                onBack={handleChiTietBack}
            />
        </>
    )
}

export default TestPageClient
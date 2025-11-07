'use client'

import VietThuGuiHauThe from "@components/Molecules/Popup/VietThuGuiHauThe"
import { useState } from "react"

const TestPageClient = () => {
    const [isOpenVietThuGuiHauThe, setIsOpenVietThuGuiHauThe] = useState(false);

    return (
        <>
            <VietThuGuiHauThe isOpen={isOpenVietThuGuiHauThe} onClose={() => setIsOpenVietThuGuiHauThe(false)} />
            <button onClick={() => setIsOpenVietThuGuiHauThe(true)} className="bg-blue-500 text-white p-2 rounded-md">Open Viet Thu Gui Hau The</button>
        </>
    )
}

export default TestPageClient
"use client";

import { createPortal } from "react-dom";
import ContentKhaiNhanMoAn from "@components/Atoms/ContentKhaiNhanMoAn";
import ModalBackdrop from "@components/Atoms/ModalBackdrop";
import { IUserLandWithLandResponseModel } from "@models/user-land/response";
import { LAND } from "@constants/land";
import Image from "next/image";
import { useCallback, useMemo, useState } from "react";

export type KhaiNhanMoAnProps = {
    isOpen: boolean;
    onClose: () => void;
    onClaim: (achievementId: string) => void;
    userLand?: IUserLandWithLandResponseModel[];
};

export default function KhaiNhanMoAn({
    isOpen,
    onClose,
    onClaim,
    userLand,
}: KhaiNhanMoAnProps) {

    const [an, setAn] = useState<string>('');
    const isHidden = useMemo(() => !an || an === '', [an]);

    // Mapping từ landId đến tên character
    const landIdToCharacterMap: Record<number, string> = {
        1: 'Sơn Tinh',
        2: 'Chử Đồng Tử',
        3: 'Thánh Gióng',
        4: 'Liễu Hạnh'
    };

    // Kiểm tra xem character nào đã completed
    const completedCharacters = useMemo(() => {
        if (!userLand) return [];
        return userLand
            .filter(land => land.status === LAND.LAND_STATUS.COMPLETED)
            .map(land => landIdToCharacterMap[land.landId])
            .filter(Boolean);
    }, [userLand]);

    // Kiểm tra xem character có thể click được không
    const isCharacterClickable = useCallback((characterName: string) => {
        return completedCharacters.includes(characterName);
    }, [completedCharacters]);

    const handleSetAn = useCallback((selectedAn: string) => {
        // Chỉ cho phép click nếu character đã completed
        if (!isCharacterClickable(selectedAn)) {
            return;
        }

        if (an === selectedAn) {
            setAn('');
        } else {
            setAn(selectedAn);
        }
    }, [an, isCharacterClickable]);

    const handleClaim = useCallback(() => {
        if (!an || !isCharacterClickable(an)) {
            return;
        }

        onClaim(an);
    }, [an, isCharacterClickable, onClaim]);

    // Use React Portal to render modal at root level
    if (typeof window === "undefined") return null;

    return createPortal(
        <ModalBackdrop isOpen={isOpen} onClose={onClose} className="w-full lg:max-w-5xl max-w-3xl mx-auto overflow-y-hidden">
            <div className="max-h-[80vh] overflow-y-auto ancient-scrollbar">
                <div className="p-4">
                    {/* --- Title --- */}
                    <div className="flex items-center justify-center gap-2">
                        <div className="relative w-[230px] lg:w-[300px] h-[106px] lg:h-[117px]">
                            <Image src='https://res.cloudinary.com/dznt9yias/image/upload/v1760859516/MayNuiTrai_ffxbum.svg' alt="May Nui Trai" fill />
                        </div>
                        <div className="flex items-center justify-center flex-col">
                            <h1
                                className="font-bd-street-sign text-center lg:text-6xl text-3xl text-[#C93728]"
                                style={{
                                    WebkitTextStrokeWidth: 2,
                                    WebkitTextStrokeColor: '#FBBF24',
                                    strokeWidth: 2,
                                    stroke: '#FBBF24',
                                    paintOrder: 'stroke fill',
                                }}
                            >
                                KHAI NHÂN MỞ ẤN
                            </h1>
                            <h2 className="font-bd-street-sign text-center text-3xl lg:text-4xl text-secondary">CHUYỆN CHƯA KỂ</h2>
                        </div>
                        <div className="relative w-[230px] lg:w-[300px] h-[106px] lg:h-[117px]">
                            <Image src='https://res.cloudinary.com/dznt9yias/image/upload/v1760859543/MayNuiPhai_imfhgx.svg' alt="May Nui Phai" fill />
                        </div>
                    </div>

                    {/* --- Description --- */}
                    <div className="w-full mt-5 flex items-center justify-center">
                        <span className="text-center font-semibold text-xl text-secondary w-xl">Với mỗi vùng đất được chinh phục, mỗi Kỳ Văn được thu thập, bạn sẽ mở khóa được một phần sự thật về biến cố đã xảy ra với Kỳ Giới và khai mở vùng đất thứ năm - vùng đất cuối cùng. Hãy hoàn thành hành trình để mở khóa toàn bộ câu chuyện nhé!</span>
                    </div>

                    {/* --- Khai Nhan Mo An Card --- */}
                    <div className="w-full mt-5 flex items-center justify-center gap-4">
                        <div
                            className={`relative inset-0 flex items-center justify-center lg:w-[200px] lg:h-[250px] w-[150px] h-[200px] transition-all duration-300 ${isCharacterClickable('Sơn Tinh')
                                ? `cursor-pointer ${an === 'Sơn Tinh' ? 'scale-105' : ''}`
                                : 'cursor-not-allowed opacity-50'
                                }`}
                            onClick={() => handleSetAn('Sơn Tinh')}
                        >
                            {an === 'Sơn Tinh' && isCharacterClickable('Sơn Tinh') && (
                                <div className="absolute -inset-1 rounded-2xl border border-transparent bg-gradient-to-r from-green-400 via-lime-500 to-green-400 animate-led-border -z-10" />
                            )}
                            {isCharacterClickable('Sơn Tinh') ? (
                                <Image src='https://res.cloudinary.com/dznt9yias/image/upload/v1760861674/Sơn_Tinh_-_Chương_1_tmi2kx.png' alt="Sơn Tinh - Chương 1" fill className="relative z-10" />
                            ) : (
                                <div className="absolute inset-0.5 bg-[#6E6B63] rounded-xl z-10" />
                            )}
                        </div>

                        <div
                            className={`relative inset-0 flex items-center justify-center lg:w-[200px] lg:h-[248px] w-[150px] h-[200px] transition-all duration-300 ${isCharacterClickable('Chử Đồng Tử')
                                ? `cursor-pointer ${an === 'Chử Đồng Tử' ? 'scale-105' : ''}`
                                : 'cursor-not-allowed opacity-50'
                                }`}
                            onClick={() => handleSetAn('Chử Đồng Tử')}
                        >
                            {an === 'Chử Đồng Tử' && isCharacterClickable('Chử Đồng Tử') && (
                                <div className="absolute -inset-1 rounded-2xl border border-transparent bg-gradient-to-r from-blue-400 via-cyan-500 to-blue-400 animate-led-border -z-10" />
                            )}
                            {isCharacterClickable('Chử Đồng Tử') ? (
                                <Image src='https://res.cloudinary.com/dznt9yias/image/upload/v1760862149/Ch%E1%BB%AD_%C4%90%E1%BB%93ng_T%E1%BB%AD_-_Ch%C6%B0%C6%A1ng_2_sxhcav.png' alt="Chử Đồng Tử - Chương 2" fill className="relative z-10" />
                            ) : (
                                <div className="absolute inset-0.5 bg-[#6E6B63] rounded-xl z-10" />
                            )}
                        </div>
                        <div
                            className={`relative inset-0 flex items-center justify-center lg:w-[200px] lg:h-[248px] w-[150px] h-[200px] transition-all duration-300 ${isCharacterClickable('Thánh Gióng')
                                ? `cursor-pointer ${an === 'Thánh Gióng' ? 'scale-105' : ''}`
                                : 'cursor-not-allowed opacity-50'
                                }`}
                            onClick={() => handleSetAn('Thánh Gióng')}
                        >
                            {an === 'Thánh Gióng' && isCharacterClickable('Thánh Gióng') && (
                                <div className="absolute inset-0 rounded-2xl border border-transparent bg-gradient-to-r from-red-400 via-pink-500 to-red-400 animate-led-border -z-10" />
                            )}
                            {isCharacterClickable('Thánh Gióng') ? (
                                <Image src='https://res.cloudinary.com/dznt9yias/image/upload/v1760862212/Th%C3%A1nh_Gi%C3%B3ng_-_Ch%C6%B0%C6%A1ng_3_wlwpux.png' alt="Thánh Gióng - Chương 3" fill className="relative z-10" />
                            ) : (
                                <div className="absolute inset-0.5 bg-[#6E6B63] rounded-xl z-10" />
                            )}
                        </div>
                        <div
                            className={`relative inset-0 flex items-center justify-center lg:w-[200px] lg:h-[248px] w-[150px] h-[200px] transition-all duration-300 ${isCharacterClickable('Liễu Hạnh')
                                ? `cursor-pointer ${an === 'Liễu Hạnh' ? 'scale-105' : ''}`
                                : 'cursor-not-allowed opacity-50'
                                }`}
                            onClick={() => handleSetAn('Liễu Hạnh')}
                        >
                            {an === 'Liễu Hạnh' && isCharacterClickable('Liễu Hạnh') && (
                                <div className="absolute -inset-1 rounded-2xl border border-transparent bg-gradient-to-r from-purple-400 via-violet-500 to-purple-400 animate-led-border -z-10" />
                            )}
                            {isCharacterClickable('Liễu Hạnh') ? (
                                <Image src='https://res.cloudinary.com/dznt9yias/image/upload/v1760862249/Li%E1%BB%85u_H%E1%BA%A1nh_-_Ch%C6%B0%C6%A1ng_4_l8xkci.png' alt="Liễu Hạnh - Chương 4" fill className="relative z-10" />
                            ) : (
                                <div className="absolute inset-0.5 bg-[#6E6B63] rounded-xl z-10" />
                            )}
                        </div>

                        <button
                            type="button"
                            aria-label="Mở ấn"
                            onClick={handleClaim}
                            disabled={!an || !isCharacterClickable(an)}
                            className={`absolute lg:bottom-70 bottom-28 lg:right-2 right-0 flex-shrink-0 w-14 h-14 lg:w-16 lg:h-16 transition-transform duration-300 ${an && isCharacterClickable(an) ? 'hover:scale-105 cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
                        >
                            <div className="relative w-11 h-11 lg:w-16 lg:h-16">
                                <Image
                                    src="https://res.cloudinary.com/dznt9yias/image/upload/v1760725883/next_xshxeb.svg"
                                    alt="Tiếp tục"
                                    fill
                                />
                            </div>
                        </button>
                    </div>

                    {/* --- Main Content --- */}
                    <ContentKhaiNhanMoAn isHidden={isHidden || !isCharacterClickable(an)} an={an} />
                </div>
            </div>
        </ModalBackdrop >,
        document.body
    );
}

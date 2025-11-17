import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface VideoModalProps {
    isOpen: boolean;
    onClose: () => void;
    videoSrc: string;
    title?: string;
}

const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose, videoSrc, title = "Hướng dẫn" }) => {
    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 overflow-hidden">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    <div className="absolute inset-0" onClick={onClose}>
                        <button
                            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 cursor-pointer p-2"
                            onClick={onClose}
                            aria-label="Đóng"
                        >
                            <span className="relative block h-8 w-8 sm:h-10 sm:w-10">
                                <Image
                                    src="https://res.cloudinary.com/dauhpllo7/image/upload/v1763391063/Tr%E1%BB%9F_l%E1%BA%A1i_trang_tr%C6%B0%E1%BB%9Bc_t1jpaz.png"
                                    alt="Đóng"
                                    fill
                                    sizes="(max-width: 640px) 32px, 40px"
                                    style={{ objectFit: "contain" }}
                                />
                            </span>
                        </button>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="relative z-10 w-full lg:max-w-5xl max-w-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="bg-white rounded-lg overflow-hidden shadow-2xl">
                            {/* Video Container */}
                            <div className="w-full aspect-video">
                                <iframe
                                    className="w-full h-full "
                                    src={videoSrc}
                                    title={title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default VideoModal;


'use client';

import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import Sparkle from '@components/Atoms/Sparkle';
import styles from './index.module.scss';
import Image from 'next/image';
import characterImage from '../../../../public/Character.png';

type SparkleItem = { id: number; top: number; left: number };

export default function NotFoundPageClient() {
    const [sparkles, setSparkles] = useState<SparkleItem[]>([]);
    const [isCharacterClicked, setCharacterClicked] = useState<boolean>(false);

    const characterContainerRef = useRef<HTMLDivElement | null>(null);
    const errorContentRef = useRef<HTMLDivElement | null>(null);

    // 1. Quản lý hiệu ứng lấp lánh bằng state
    useEffect(() => {
        const addSparkle = () => {
            const newSparkle: SparkleItem = {
                id: Date.now() + Math.random(),
                top: Math.random() * window.innerHeight,
                left: Math.random() * window.innerWidth,
            };
            setSparkles((currentSparkles) => [...currentSparkles, newSparkle]);
        };

        const sparkleInterval = setInterval(addSparkle, 1500); // Tăng tần suất cho đẹp hơn

        return () => clearInterval(sparkleInterval);
    }, []);

    const removeSparkle = (id: number) => {
        setSparkles((currentSparkles) => currentSparkles.filter((s) => s.id !== id));
    };


    // 2. Xử lý parallax scroll (vẫn dùng ref vì cần đọc vị trí cuộn)
    useEffect(() => {
        const handleScroll = () => {
            if (!characterContainerRef.current || !errorContentRef.current) return;
            const scrolled = window.pageYOffset;
            characterContainerRef.current.style.transform = `translateY(${scrolled * 0.1}px)`;
            errorContentRef.current.style.transform = `translateY(${scrolled * -0.05}px)`;
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 3. Xử lý click nhân vật bằng event handler và state
    const handleCharacterClick = () => {
        setCharacterClicked(true);
        setTimeout(() => setCharacterClicked(false), 500);
    };

    const [hasMounted, setHasMounted] = useState<boolean>(false);
    useEffect(() => { setHasMounted(true); }, []);
    if (!hasMounted) return null;
    return (
        <>
            {/* Render các ngôi sao từ state */}
            {sparkles.map(({ id, top, left }) => (
                <Sparkle key={id} id={id} top={top} left={left} onAnimationEnd={removeSparkle} />
            ))}

            <div className={clsx(styles.particles, 'z-10')}>
                {[...Array(5)].map((_, i) => <div key={i} className={styles.particle}></div>)}
            </div>
            <div className={styles.backgroundOverlay}></div>

            <main className="px-5 py-16 flex justify-center items-center min-h-[calc(100vh-120px)] relative z-0">
                <div className={clsx(styles.errorContainer, 'max-w-7xl w-full grid grid-cols-1 lg:grid-cols-[1fr_500px] gap-20 items-center text-center lg:text-left')}>
                    <div ref={errorContentRef} className="animate-slide-in-left">
                        <div className={clsx(styles.errorCode, 'text-[140px] font-bold leading-none mb-5 animate-text-glow')}>
                            404
                        </div>
                        <h1 className={clsx(styles.errorTitle, 'font-display text-[56px] font-bold mb-5 leading-tight')}>
                            Trang Đã Thất Lạc
                        </h1>
                        <p className="text-xl text-gray-400 mb-8 font-light italic">
                            Như lá thu bay theo gió xa...
                        </p>
                        <p className="text-lg leading-relaxed mb-10 text-gray-300 max-w-lg mx-auto lg:mx-0">
                            Trang mà bạn tìm kiếm đã biến mất trong sương mù thời gian, như những câu chuyện cổ tích xa xăm. Có thể nó đã trở về với thế giới thần tiên, hoặc đang nghỉ ngơi trong một cuốn sách cổ nào đó trong thư viện kỷ nhân của chúng tôi.
                        </p>
                        <div className="flex gap-5 flex-wrap justify-center lg:justify-start">
                            <Link href="/" className={clsx(styles.btnPrimary, "px-8 py-4 border-none rounded-[30px] text-base font-semibold transition-transform duration-300 no-underline inline-block relative overflow-hidden text-white hover:-translate-y-1 hover:shadow-2xl")}>
                                Về Trang Chủ
                            </Link>
                            <Link href="#" className={clsx(styles.btnSecondary, "px-8 py-4 bg-transparent text-amber-500 border-2 border-amber-500 rounded-[30px] text-base font-semibold transition-all duration-300 no-underline inline-block hover:bg-amber-500 hover:text-black hover:-translate-y-1 hover:shadow-xl")}>
                                Khám Phá Thư Viện
                            </Link>
                        </div>
                    </div>

                    <div ref={characterContainerRef} className="relative flex justify-center items-center animate-slide-in-right -z-10">
                        <div className={clsx(styles.characterFrame, 'relative w-[320px] h-[420px] md:w-[400px] md:h-[520px] border-[8px] border-amber-500 rounded-2xl overflow-hidden animate-border-glow')}>
                            <div
                                onClick={handleCharacterClick}
                                className={clsx(
                                    styles.character,
                                    'top-1/2 left-1/2 w-64 h-80 md:w-80 md:h-[400px] rounded-[60px_60px_30px_30px] flex flex-col items-center justify-center relative cursor-pointer',
                                    // Áp dụng animation dựa trên state
                                    isCharacterClicked
                                        ? 'scale-110 rotate-3 transition-transform duration-200'
                                        : 'animate-char-float transition-transform duration-500'
                                )}
                            >
                                <Image src={characterImage} alt="Character" width={320} height={420} className='scale-x-[-1]' />
                            </div>
                        </div>

                        <div className={clsx(styles.floatingElements, "absolute top-0 left-0 w-full h-full")}>
                            <div className={clsx(styles.floatingSymbol, "absolute text-3xl animate-float-symbols")}>❀</div>
                            <div className={clsx(styles.floatingSymbol, "absolute text-3xl animate-float-symbols")}>✧</div>
                            <div className={clsx(styles.floatingSymbol, "absolute text-3xl animate-float-symbols")}>❈</div>
                            <div className={clsx(styles.floatingSymbol, "absolute text-3xl animate-float-symbols")}>✦</div>
                        </div>

                        <div className={clsx(styles.poemText, "absolute right-[-60px] top-5 w-52 p-5 rounded-xl text-amber-500 font-display text-base leading-relaxed animate-fade-in-poem")}>
                            "Trang web thất lạc,<br />
                            Như mây trôi xa,<br />
                            Hãy về trang chủ,<br />
                            Tìm đường về nhà."
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
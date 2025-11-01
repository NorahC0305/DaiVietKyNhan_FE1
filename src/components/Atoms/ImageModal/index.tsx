"use client"

import React, { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'

interface MediaItem {
    id: number
    url: string
    alt?: string | null
}

interface ImageModalProps {
    isOpen: boolean
    onClose: () => void
    images: MediaItem[]
    currentIndex: number
    onPrevious: () => void
    onNext: () => void
}

const ImageModal: React.FC<ImageModalProps> = ({
    isOpen,
    onClose,
    images,
    currentIndex,
    onPrevious,
    onNext
}) => {
    const [zoom, setZoom] = useState(1)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [isDragging, setIsDragging] = useState(false)
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
    const imageRef = useRef<HTMLDivElement>(null)

    const resetZoom = () => {
        setZoom(1)
        setPosition({ x: 0, y: 0 })
    }

    const handleZoomIn = () => {
        setZoom(prev => Math.min(prev * 1.5, 1.5))
    }

    const handleZoomOut = () => {
        setZoom(prev => Math.max(prev / 1.5, 0.5))
    }

    const handleMouseDown = (e: React.MouseEvent) => {
        if (zoom > 1) {
            setIsDragging(true)
            setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
        }
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging && zoom > 1) {
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            })
        }
    }

    const handleMouseUp = () => {
        setIsDragging(false)
    }

    const handleTouchStart = (e: React.TouchEvent) => {
        if (e.touches.length === 1 && zoom > 1) {
            const touch = e.touches[0]
            setIsDragging(true)
            setDragStart({ x: touch.clientX - position.x, y: touch.clientY - position.y })
        }
    }

    const handleTouchMove = (e: React.TouchEvent) => {
        if (e.touches.length === 1 && isDragging && zoom > 1) {
            e.preventDefault()
            const touch = e.touches[0]
            setPosition({
                x: touch.clientX - dragStart.x,
                y: touch.clientY - dragStart.y
            })
        }
    }

    const handleTouchEnd = () => {
        setIsDragging(false)
    }

    const handleImageClick = () => {
        if (zoom === 1) {
            handleZoomIn()
        } else {
            resetZoom()
        }
    }

    // Don't reset zoom when navigating between images

    // Keep zoom when navigating with next/previous
    const handlePrevious = () => {
        onPrevious()
    }

    const handleNext = () => {
        onNext()
    }

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return

            switch (e.key) {
                case 'Escape':
                    e.preventDefault()
                    onClose()
                    break
                case 'ArrowLeft':
                    e.preventDefault()
                    handlePrevious()
                    break
                case 'ArrowRight':
                    e.preventDefault()
                    handleNext()
                    break
            }
        }

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown)
            document.body.style.overflow = 'hidden'
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, onClose, handlePrevious, handleNext])

    if (!isOpen) return null

    if (!images || images.length === 0) return null

    // Fix index out of bounds
    const safeIndex = Math.max(0, Math.min(currentIndex, images.length - 1))
    const currentImage = images[safeIndex]

    if (!currentImage) return null

    console.log(currentImage.url);
    

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-90">
            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-[10000] p-3 text-white hover:text-black hover:bg-white hover:bg-opacity-20 rounded-full transition-colors cursor-pointer"
                aria-label="Đóng"
            >
                <X className="w-6 h-6" />
            </button>

            {/* Previous button */}
            {images.length > 1 && (
                <button
                    onClick={handlePrevious}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 z-[10000] p-3 text-white hover:text-black hover:bg-white hover:bg-opacity-20 rounded-full transition-colors cursor-pointer"
                    aria-label="Ảnh trước"
                >
                    <ChevronLeft className="w-8 h-8" />
                </button>
            )}

            {/* Next button */}
            {images.length > 1 && (
                <button
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 z-[10000] p-3 text-white hover:text-black hover:bg-white hover:bg-opacity-20 rounded-full transition-colors cursor-pointer"
                    aria-label="Ảnh tiếp theo"
                >
                    <ChevronRight className="w-8 h-8" />
                </button>
            )}

            {/* Zoom controls */}
            <div className="absolute top-4 left-4 z-[10000] flex gap-2">
                <button
                    onClick={handleZoomIn}
                    className="p-2 text-white hover:text-black hover:bg-white hover:bg-opacity-20 rounded-full transition-colors cursor-pointer bg-black bg-opacity-50"
                    aria-label="Phóng to"
                >
                    <ZoomIn className="w-5 h-5" />
                </button>
                <button
                    onClick={handleZoomOut}
                    className="p-2 text-white hover:text-black hover:bg-white hover:bg-opacity-20 rounded-full transition-colors cursor-pointer bg-black bg-opacity-50"
                    aria-label="Thu nhỏ"
                >
                    <ZoomOut className="w-5 h-5" />
                </button>
                <button
                    onClick={resetZoom}
                    className="p-2 text-white hover:text-black hover:bg-white hover:bg-opacity-20 rounded-full transition-colors cursor-pointer bg-black bg-opacity-50"
                    aria-label="Reset zoom"
                >
                    <RotateCcw className="w-5 h-5" />
                </button>
            </div>

            {/* Image container - Mobile friendly with zoom and pan */}
            <div
                className="relative w-full h-full flex items-center justify-center z-[9998] overflow-hidden"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onClick={handleImageClick}
            >
                <div
                    ref={imageRef}
                    className="w-full h-full flex items-center justify-center p-4"
                    style={{
                        transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                        transformOrigin: 'center center',
                        transition: isDragging ? 'none' : 'transform 0.3s ease-out'
                    }}
                >
                    <Image
                        src={currentImage.url}
                        alt={currentImage.alt || 'Hình ảnh'}
                        width={1200}
                        height={800}
                        className="max-w-none max-h-none w-auto h-auto object-contain select-none"
                        priority
                        style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            minWidth: '300px',
                            minHeight: '200px',
                            cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in'
                        }}
                        draggable={false}
                    />
                </div>
            </div>

            {/* Image counter */}
            {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded-full z-[10000]">
                    {currentIndex + 1} / {images.length}
                </div>
            )}

            {/* Zoom indicator */}
            {zoom !== 1 && (
                <div className="absolute bottom-4 right-4 text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded-full z-[10000]">
                    {Math.round(zoom * 100)}%
                </div>
            )}
        </div>
    )
}

export default ImageModal

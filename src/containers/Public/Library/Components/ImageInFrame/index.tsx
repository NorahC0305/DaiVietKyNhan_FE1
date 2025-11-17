import Image from "next/image";

interface ImageFrameProps {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}

export default function ImageFrame({
  src,
  alt = "Display image",
  width = 400,
  height = 600,
}: ImageFrameProps) {
  return (
    <div className="relative inline-block">
      {/* Backdrop frame */}
      <Image
        src="https://res.cloudinary.com/dauhpllo7/image/upload/v1763393921/Chu%CC%9Ba_co%CC%81_te%CC%82n_1080_x_1740_px_4_1_mvqq0p.svg"
        alt="Frame backdrop"
        width={width}
        height={height}
        priority
        className="block"
      />

      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-[15px] md:inset-[19px]">
          <Image
            src={src || "/placeholder.svg"}
            alt={alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </div>
    </div>
  );
}

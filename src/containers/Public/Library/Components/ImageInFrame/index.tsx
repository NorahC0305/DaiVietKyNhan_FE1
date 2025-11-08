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
        src="https://res.cloudinary.com/dznt9yias/image/upload/v1760726112/revealedBG_gzuiid.svg"
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

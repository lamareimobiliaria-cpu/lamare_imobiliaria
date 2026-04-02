import { useEffect, useRef } from "react";

interface ImageWatermarkProps {
  imageSrc: string;
  watermarkType?: "white" | "gold" | "blue"; // white for dark backgrounds, gold for interiors, blue for documents
  opacity?: number; // 40-60% as per manual
}

export default function ImageWatermark({
  imageSrc,
  watermarkType = "gold",
  opacity = 0.5,
}: ImageWatermarkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      // Set canvas size to match image
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw image
      ctx.drawImage(img, 0, 0);

      // Set watermark color based on type
      const colors: Record<string, string> = {
        white: "rgba(255, 255, 255, " + opacity + ")",
        gold: "rgba(197, 160, 89, " + opacity + ")", // #C5A059
        blue: "rgba(10, 37, 64, " + opacity + ")", // #0A2540
      };

      ctx.fillStyle = colors[watermarkType];
      ctx.font = "bold 48px 'Playfair Display', serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Draw watermark in center
      const x = canvas.width / 2;
      const y = canvas.height / 2;
      ctx.fillText("La Mare", x, y);

      // Draw subtitle
      ctx.font = "16px 'Montserrat', sans-serif";
      ctx.fillText("Imobiliária", x, y + 40);
    };
    img.src = imageSrc;
  }, [imageSrc, watermarkType, opacity]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full object-cover"
      style={{ display: "block" }}
    />
  );
}

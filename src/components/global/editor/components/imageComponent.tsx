"use client";

import React, { useState } from "react";
import UploadImage from "./uploadImage";
import { ImageIcon, Upload } from "lucide-react";
import { isRealImageSrc } from "@/lib/images/placeholder";

type CustomImageProps = {
  src: string;
  alt: string;
  className?: string;
  isPreview?: boolean;
  isEditable?: boolean;
  contentId: string;
  onContentChange: (
    contentID: string,
    newContent: string | string[] | string[][]
  ) => void;
};

const CustomImage = ({
  alt,
  contentId,
  src,
  className,
  isEditable = true,
  isPreview = false,
  onContentChange,
}: CustomImageProps) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const hasImage = isRealImageSrc(src) && !imgError;

  const handleDragOver = (e: React.DragEvent) => {
    if (!isEditable || isPreview) return;
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => setIsDraggingOver(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };

  return (
    <div
      className={`group relative w-full overflow-hidden transition-all duration-150 ${
        isDraggingOver ? "ring-2 ring-blue-400 ring-offset-2" : ""
      }`}
      style={{
        borderRadius: "var(--slide-image-radius)",
        boxShadow:
          "var(--slide-image-ring, none), var(--slide-image-shadow, none)",
        padding: "var(--slide-image-frame-pad, 0px)",
        background: "var(--slide-image-frame-bg, transparent)",
        aspectRatio: "var(--slide-image-ratio, 16 / 9)",
        height: "100%",
        minHeight: "10rem",
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {hasImage ? (
        <>
          {!imgLoaded && (
            <div
              aria-hidden
              className="absolute inset-0 animate-pulse bg-[color:var(--slide-surface)]"
              style={{ borderRadius: "var(--slide-image-radius)" }}
            />
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className={`size-full object-cover transition-opacity duration-200 ${
              imgLoaded ? "opacity-100" : "opacity-0"
            } ${className ?? ""}`}
            style={{ borderRadius: "var(--slide-image-radius)" }}
            loading={isPreview ? "eager" : "lazy"}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
          />
        </>
      ) : (
        <div
          className="flex size-full min-h-40 flex-col items-center justify-center gap-2 border-2 border-dashed border-[color:var(--slide-border)] bg-[color:var(--slide-surface)]"
          style={{ borderRadius: "var(--slide-image-radius)" }}
        >
          {isPreview ? (
            <ImageIcon className="size-6 opacity-40" />
          ) : (
            <>
              <ImageIcon className="size-8 opacity-40" />
              <p className="text-xs opacity-60">No image — click to upload</p>
            </>
          )}
        </div>
      )}

      {/* Edit overlay — show on hover for existing images, always for empty */}
      {!isPreview && isEditable && (
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/40 transition-opacity duration-200 ${
            hasImage ? "opacity-0 group-hover:opacity-100" : "opacity-100"
          }`}
          style={{ borderRadius: "var(--slide-image-radius)" }}
        >
          <Upload className="size-5 text-white" />
          <UploadImage
            contentId={contentId}
            onContentChange={onContentChange}
          />
          {isDraggingOver && (
            <p className="mt-1 text-xs font-medium text-white">Drop to upload</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomImage;

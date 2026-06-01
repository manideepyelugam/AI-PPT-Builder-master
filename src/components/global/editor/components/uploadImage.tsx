"use client";

import { FileUploaderRegular } from "@uploadcare/react-uploader/next";
import "@uploadcare/react-uploader/core.css";
import type { OutputFileEntry } from "@uploadcare/file-uploader";
import React, { useState } from "react";
import { Loader2 } from "lucide-react";

type UploadImageProps = {
  contentId: string;
  onContentChange: (
    contentID: string,
    newContent: string | string[] | string[][]
  ) => void;
};

const UploadImage = ({ contentId, onContentChange }: UploadImageProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleSuccess = (event: OutputFileEntry<"success">) => {
    // cdnUrl is non-null when status === 'success'
    const url = event.cdnUrl;
    if (url) {
      onContentChange(contentId, url);
    }
    setIsUploading(false);
  };

  const handleStart = () => setIsUploading(true);
  const handleFailed = () => setIsUploading(false);

  return (
    <div className="relative">
      {isUploading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded bg-black/30">
          <Loader2 className="size-5 animate-spin text-white" />
        </div>
      )}
      <FileUploaderRegular
        sourceList="local, camera, url, gdrive"
        pubkey={process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY!}
        multiple={false}
        maxLocalFileSizeBytes={10485760}
        onFileUploadSuccess={handleSuccess}
        onFileUploadStart={handleStart}
        onFileUploadFailed={handleFailed}
      />
    </div>
  );
};

export default UploadImage;

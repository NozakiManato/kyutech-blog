"use client";

import { usePresignedUpload } from "next-s3-upload";
import { FC, useState } from "react";

type Props = {
  key: string;
  name: string;
  url: string;
  size: number;
};

const Component:FC = (props: Props) => {
  const { uplaodToS3, FileInput, openFileDialog } = usePresignedUpload();
  const [imageUrl, setImageUrl] = useState<string>("");
  const handleFileChange = async (file:File)  => {
    const {url} = 
  }
  return <div>FileUploader</div>;
};

export default FileUploader;

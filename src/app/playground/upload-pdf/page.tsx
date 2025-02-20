"use client";
import React, { useState, ChangeEvent, useRef } from "react";
import { supabase } from "@/utils/supabase";
import Link from "next/link";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

const UploadPdfPage = () => {
  const bucketName = "body_pdf";
  const [nowFileName, setNowFileName] = useState<string | undefined>();
  const [nowFilePublicUrl, setNowFilePublicUrl] = useState<
    string | undefined
  >();
  const [file, setFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const hiddenFileInputRef = useRef<HTMLInputElement>(null);

  const onFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    setNowFileName(undefined);
    const files = event.target.files;
    if (files && files[0]) {
      const file = files[0];
      const path = `private/${file.name}`;
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(path, file, { upsert: true });

      if (error || !data) {
        window.alert(`アップロードに失敗 ${error.message}`);
        return;
      }
      setNowFileName(data.path);
      const publicUrlResult = supabase.storage
        .from(bucketName)
        .getPublicUrl(data.path);
      setNowFilePublicUrl(publicUrlResult.data.publicUrl);

      setFile(file);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <div>
      <h1>PDF アップロード</h1>
      <input
        type="file"
        accept="application/pdf"
        onChange={onFileChange}
        hidden={true}
        ref={hiddenFileInputRef}
      />
      <button
        onClick={() => hiddenFileInputRef.current?.click()}
        type="button"
        className="rounded-md bg-indigo-500 px-3 py-1 text-white"
      >
        ファイルを選択
      </button>
      {nowFileName && (
        <div className="mt-4 rounded-md border bg-gray-100 p-4">
          <p className="text-lg font-semibold">アップロードしたファイル:</p>
          <p className="text-sm text-gray-700">{nowFileName}</p>
        </div>
      )}
      {nowFilePublicUrl && (
        <Link href={nowFilePublicUrl} legacyBehavior>
          <a className="mt-4 inline-block rounded-md bg-blue-500 px-3 py-1 text-white">
            PDFを表示する
          </a>
        </Link>
      )}
      {file && (
        <Worker
          workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
        >
          <div style={{ height: "750px" }}>
            <Viewer fileUrl={URL.createObjectURL(file)} />
          </div>
        </Worker>
      )}
    </div>
  );
};

export default UploadPdfPage;

"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

const ViewPdfPage = () => {
  const searchParams = useSearchParams();
  const filePath = searchParams.get("filePath");

  return (
    <div>
      <h1>PDF 表示</h1>
      {filePath ? (
        <Worker
          workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
        >
          <div style={{ height: "750px" }}>
            <Viewer fileUrl={filePath} />
          </div>
        </Worker>
      ) : (
        <p>ファイルパスが指定されていません。</p>
      )}
    </div>
  );
};

export default ViewPdfPage;

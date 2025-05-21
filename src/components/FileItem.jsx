import React, { useState } from "react";
import {
  FiFile,
  FiImage,
  FiFileText,
  FiDownload,
  FiTrash2,
} from "react-icons/fi";
import {
  FaFilePdf,
  FaFilePowerpoint,
  FaFileExcel,
  FaFileWord,
} from "react-icons/fa";
import ConfirmationModal from "./ConfirmationModal";

function FileItem({ file, onDelete }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Determine if a file is an Office document
  const isOfficeFile = () => {
    return [
      'application/vnd.openxmlformats-officedocument.',
      'application/msword',
      'application/vnd.ms-excel',
      'application/vnd.ms-powerpoint'
    ].some(type => file.type.includes(type));
  };

  const getFileIcon = () => {
    if (file.type.includes("image")) return <FiImage />;
    if (file.type.includes("pdf")) return <FaFilePdf />;
    if (file.type.includes("presentation") || file.type.includes("powerpoint"))
      return <FaFilePowerpoint />;
    if (file.type.includes("spreadsheet") || file.type.includes("excel"))
      return <FaFileExcel />;
    if (file.type.includes("word")) return <FaFileWord />;
    if (file.type.includes("text")) return <FiFileText />;
    return <FiFile />;
  };

  const handlePreview = () => {
    if (isOfficeFile()) {
      // For Office files, use Microsoft Online Viewer (requires public URL)
      const blobUrl = URL.createObjectURL(dataURLtoBlob(file.content));
      const viewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(blobUrl)}`;
      
      const newWindow = window.open(viewerUrl, "_blank");
      if (!newWindow) {
        alert("Pop-up blocked! Please allow pop-ups for this site.");
      }
      
      // Clean up after 10 minutes
      setTimeout(() => URL.revokeObjectURL(blobUrl), 600000);
    } else {
      // Existing handling for other file types
      try {
        const blob = dataURLtoBlob(file.content);
        const blobUrl = URL.createObjectURL(blob);
        const newWindow = window.open(blobUrl, "_blank");
        
        if (!newWindow) {
          // Mobile fallback
          if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
            window.location.assign(blobUrl);
          } else {
            handleDownload();
          }
        }
        setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
      } catch (error) {
        console.error("Error opening file:", error);
        alert("Could not open the file. Please try downloading it instead.");
      }
    }
  };

  // Convert data URL to Blob
  const dataURLtoBlob = (dataURL) => {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = file.content;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="file-item">
      <button className="file-icon" onClick={handlePreview}>
        {getFileIcon()}
      </button>
      <span className="file-name" onClick={handlePreview}>
        {file.name}
      </span>
      <div className="file-actions always-visible">
        <button
          className="icon-btn download-btn"
          onClick={handleDownload}
          aria-label="Download file"
        >
          <FiDownload />
        </button>
        <button
          className="icon-btn delete-btn"
          onClick={() => setShowDeleteModal(true)}
          aria-label="Delete file"
        >
          <FiTrash2 />
        </button>
      </div>

      {showDeleteModal && (
        <ConfirmationModal
          message={`Are you sure you want to delete ${file.name}?`}
          onConfirm={() => {
            onDelete(file.id);
            setShowDeleteModal(false);
          }}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
}

export default FileItem;
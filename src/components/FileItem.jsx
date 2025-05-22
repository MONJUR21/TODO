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
      "application/vnd.openxmlformats-officedocument.",
      "application/msword",
      "application/vnd.ms-excel",
      "application/vnd.ms-powerpoint",
    ].some((type) => file.type.includes(type));
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
    const blob = dataURLtoBlob(file.content);
    const blobUrl = URL.createObjectURL(blob);

    if (file.type.includes("image") || file.type.includes("pdf")) {
      const newWindow = window.open(blobUrl, "_blank");

      if (!newWindow) {
        // Fallback for mobile or blocked popup
        if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
          window.location.assign(blobUrl);
        } else {
          handleDownload();
        }
      }

      // Clean up URL after use
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
    } else {
      // Show alert for unsupported preview types
      alert("You should download this file.");
    }
  };

  // Convert data URL to Blob
  const dataURLtoBlob = (dataURL) => {
    const arr = dataURL.split(",");
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
    const blob = dataURLtoBlob(file.content);
    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Optional cleanup
    setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
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

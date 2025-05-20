import React, { useState } from 'react';
import { FiFile, FiImage, FiFileText, FiDownload, FiTrash2 } from 'react-icons/fi';
import { FaFilePdf, FaFilePowerpoint, FaFileExcel, FaFileWord } from 'react-icons/fa';
import ConfirmationModal from './ConfirmationModal';

function FileItem({ file, onDelete }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const getFileIcon = () => {
    if (file.type.includes('image')) return <FiImage />;
    if (file.type.includes('pdf')) return <FaFilePdf />;
    if (file.type.includes('presentation') || file.type.includes('powerpoint')) return <FaFilePowerpoint />;
    if (file.type.includes('spreadsheet') || file.type.includes('excel')) return <FaFileExcel />;
    if (file.type.includes('word')) return <FaFileWord />;
    if (file.type.includes('text')) return <FiFileText />;
    return <FiFile />;
  };

  const handlePreview = () => {
    try {
      if (file.type.includes('pdf')) {
        const byteString = atob(file.content.split(',')[1]);
        const byteArray = new Uint8Array(byteString.length);
        for (let i = 0; i < byteString.length; i++) {
          byteArray[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const blobUrl = URL.createObjectURL(blob);
        
        if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
          window.location.assign(blobUrl);
        } else {
          const newWindow = window.open(blobUrl, '_blank');
          if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
            window.location.href = blobUrl;
          }
        }
        setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
      } else if (file.type.includes('image')) {
        window.open(file.content, '_blank');
      } else {
        const blob = new Blob([file.content], { type: file.type });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      }
    } catch (error) {
      console.error('Error opening file:', error);
      alert('Could not open the file. Please try downloading it instead.');
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
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
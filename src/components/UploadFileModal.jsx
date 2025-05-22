import React, { useState } from 'react';
import BaseModal from './BaseModal';

function UploadFileModal({ onClose, onSave }) {
  const [fileName, setFileName] = useState('');
  const [fileContent, setFileContent] = useState(null);
  const [fileType, setFileType] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setFileType(file.type);

    const reader = new FileReader();

    // Always read as DataURL for consistent handling (images, pdfs, docs, etc.)
    reader.readAsDataURL(file);

    reader.onload = () => {
      setFileContent(reader.result);
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (fileName && fileContent) {
      onSave({
        name: fileName,
        type: fileType,
        content: fileContent,
      });
      onClose();
    }
  };

  return (
    <BaseModal
      title="Upload File"
      onClose={onClose}
      footerContent={
        <>
          <button 
            type="button" 
            className="btn secondary"
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn primary"
            form="upload-file-form"
            disabled={!fileName || !fileContent}
          >
            Upload
          </button>
        </>
      }
    >
      <form id="upload-file-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="file-upload">Choose File</label>
          <input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            required
          />
        </div>
        {fileName && (
          <div className="file-preview">
            <p>Selected file: {fileName}</p>
          </div>
        )}
      </form>
    </BaseModal>
  );
}

export default UploadFileModal;

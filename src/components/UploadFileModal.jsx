import React, { useState } from 'react';

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
    if (file.type.includes('image') || file.type.includes('pdf')) {
      reader.readAsDataURL(file);
    } else {
      reader.readAsText(file);
    }

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
        content: fileContent
      });
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Upload File</h3>
        <form onSubmit={handleSubmit}>
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
          <div className="modal-actions">
            <button type="button" className="btn secondary" onClick={onClose}>
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn primary"
              disabled={!fileName || !fileContent}
            >
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UploadFileModal;
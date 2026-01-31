import { useState } from 'react';
import { Upload, X, File } from 'lucide-react';

export const FileUpload = ({ onUpload, accept = '*', maxSize = 5 * 1024 * 1024 }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFile = async (file) => {
    if (file.size > maxSize) {
      alert(`File too large. Max size: ${maxSize / 1024 / 1024}MB`);
      return;
    }
    setUploading(true);
    await onUpload(file);
    setUploading(false);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
      }`}
    >
      {uploading ? (
        <div className="text-gray-600">Uploading...</div>
      ) : (
        <>
          <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-2">Drag & drop or click to upload</p>
          <input
            type="file"
            accept={accept}
            onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700"
          >
            Choose File
          </label>
        </>
      )}
    </div>
  );
};

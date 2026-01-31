import { X, Download, Eye } from 'lucide-react';

export const FilePreview = ({ file, onDelete }) => {
  const isImage = file.name?.match(/\.(jpg|jpeg|png|gif)$/i);

  return (
    <div className="border rounded-lg p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {isImage ? (
          <img src={file.url} alt={file.name} className="w-16 h-16 object-cover rounded" />
        ) : (
          <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
            <Eye className="w-6 h-6 text-gray-400" />
          </div>
        )}
        <div>
          <p className="font-medium">{file.name}</p>
          <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
        </div>
      </div>
      <div className="flex gap-2">
        <a
          href={file.url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 hover:bg-gray-100 rounded"
        >
          <Download className="w-4 h-4" />
        </a>
        {onDelete && (
          <button onClick={() => onDelete(file.id)} className="p-2 hover:bg-red-100 rounded">
            <X className="w-4 h-4 text-red-600" />
          </button>
        )}
      </div>
    </div>
  );
};

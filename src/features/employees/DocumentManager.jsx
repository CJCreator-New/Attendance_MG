import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Upload, Download, Trash2, Eye, Search } from 'lucide-react';
import { useToastStore } from '../../stores/toastStore';
import { StorageService } from '../../services/storageService';
import { FileUpload } from '../../components/FileUpload';
import { FilePreview } from '../../components/FilePreview';

export const DocumentManager = ({ employees }) => {
  const [selectedEmp, setSelectedEmp] = useState(employees[0]?.empId || '');
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const showToast = useToastStore(state => state.addToast);

  const emp = employees.find(e => e.empId === selectedEmp);

  const docTypes = [
    { id: 'resume', label: 'Resume/CV', icon: FileText },
    { id: 'id_proof', label: 'ID Proof', icon: FileText },
    { id: 'address_proof', label: 'Address Proof', icon: FileText },
    { id: 'education', label: 'Education Certificates', icon: FileText },
    { id: 'experience', label: 'Experience Letters', icon: FileText },
    { id: 'other', label: 'Other Documents', icon: FileText }
  ];

  const handleUpload = async (file, type) => {
    setUploading(true);
    const result = await StorageService.uploadFile(file, type);
    
    if (result.success) {
      const newDoc = {
        id: result.fileId,
        empId: selectedEmp,
        type,
        name: file.name,
        size: file.size,
        url: result.url,
        uploadDate: new Date().toLocaleDateString()
      };
      setDocuments([...documents, newDoc]);
      showToast('Document uploaded successfully', 'success');
    } else {
      showToast('Upload failed: ' + result.error, 'error');
    }
    setUploading(false);
  };

  const handleDelete = async (docId) => {
    if (confirm('Delete this document?')) {
      const result = await StorageService.deleteFile(docId);
      if (result.success) {
        setDocuments(documents.filter(d => d.id !== docId));
        showToast('Document deleted', 'success');
      } else {
        showToast('Delete failed', 'error');
      }
    }
  };

  const empDocs = documents.filter(d => d.empId === selectedEmp);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <select
          value={selectedEmp}
          onChange={(e) => setSelectedEmp(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-gray-900 dark:text-white"
        >
          {employees.map(e => (
            <option key={e.empId} value={e.empId}>{e.name} ({e.empId})</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {docTypes.map((type) => {
          const Icon = type.icon;
          const count = empDocs.filter(d => d.type === type.id).length;
          return (
            <motion.div
              key={type.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-neutral-700 rounded-lg p-6 border border-gray-200 dark:border-neutral-600"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{type.label}</h3>
                    <p className="text-sm text-gray-600 dark:text-neutral-400">{count} file(s)</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png';
                  input.onchange = (e) => e.target.files[0] && handleUpload(e.target.files[0], type.id);
                  input.click();
                }}
                disabled={uploading}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Upload className="w-4 h-4" />
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </motion.div>
          );
        })}
      </div>

      {empDocs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-neutral-800 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Uploaded Documents</h3>
          <div className="space-y-3">
            {empDocs.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-neutral-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{doc.name}</p>
                    <p className="text-sm text-gray-600 dark:text-neutral-400">
                      {docTypes.find(t => t.id === doc.type)?.label} • {doc.size} • {doc.uploadDate}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded">
                    <Download className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(doc.id)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {empDocs.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-neutral-400">
          No documents uploaded for this employee
        </div>
      )}
    </div>
  );
};

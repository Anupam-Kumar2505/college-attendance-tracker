import React, { useRef } from 'react';
import { UploadCloud, FileText, CheckCircle, X, AlertTriangle } from 'lucide-react';
import { formatFileSize } from '../../utils/formatters.js';

export const FileUpload = ({ file, onFileSelect, error, maxMb = 10 }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    validateAndSelect(selectedFile);
  };

  const validateAndSelect = (f) => {
    if (!f) return;
    if (f.type !== 'application/pdf' && !f.name.toLowerCase().endsWith('.pdf')) {
      alert('Only PDF files (.pdf) are allowed as attendance proof.');
      return;
    }
    if (f.size > maxMb * 1024 * 1024) {
      alert(`File size exceeds maximum allowed limit of ${maxMb} MB.`);
      return;
    }
    onFileSelect(f);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSelect(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
          Proof PDF Document <span className="text-rose-400">*</span>
        </label>
        <span className="text-[11px] text-slate-400 font-medium">PDF only (Max {maxMb}MB)</span>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="application/pdf"
        className="hidden"
      />

      {!file ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-150 flex flex-col items-center justify-center gap-2 ${
            error
              ? 'border-rose-500/80 bg-rose-500/5 hover:bg-rose-500/10'
              : 'border-slate-700 bg-slate-900/50 hover:border-brand-500/60 hover:bg-slate-900/90'
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center mb-1">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-200">
              Click to select PDF or drag and drop
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Original scanned medical certificate, permission slip, or event pass
            </p>
          </div>
          <span className="text-[11px] font-semibold text-amber-400/90 bg-amber-400/10 px-2.5 py-0.5 rounded-full mt-1 border border-amber-400/20">
            PDF is mandatory for submission
          </span>
        </div>
      ) : (
        <div className="glass-card p-4 rounded-2xl border border-brand-500/40 bg-slate-900 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-100 truncate">{file.name}</p>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <span>{formatFileSize(file.size)}</span>
                <span>•</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Valid PDF
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="Remove selected file"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}
    </div>
  );
};

export default FileUpload;

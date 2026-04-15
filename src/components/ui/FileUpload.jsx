import { useRef, useState } from "react";
import { UploadCloud, X, FileText } from "lucide-react";

const FileUpload = ({
  label,
  value,
  onChange,
  error,
  accept = "image/*,application/pdf",
  maxSize = 5, // MB
  required = false,
}) => {
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = (file) => {
    if (!file) return;

    const sizeInMB = file.size / (1024 * 1024);

    if (sizeInMB > maxSize) {
      alert(`File size must be under ${maxSize}MB`);
      return;
    }

    onChange?.(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const removeFile = () => {
    onChange?.(null);
  };

  const isImage = value?.type?.startsWith("image");

  return (
    <div className="space-y-2 w-full">
      {label && (
        <label className="text-sm text-gray-600 font-medium">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current.click()}
        className={`relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition 
        ${
          dragActive
            ? "border-indigo-500 bg-indigo-50"
            : error
            ? "border-red-500"
            : "border-gray-300"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          hidden
          onChange={(e) => handleFile(e.target.files[0])}
        />

        {!value ? (
          <>
            <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">
              Drag & drop file here or click to upload
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Max {maxSize}MB
            </p>
          </>
        ) : (
          <div className="flex items-center gap-4 w-full">
            {isImage ? (
              <img
                src={URL.createObjectURL(value)}
                alt="preview"
                className="w-16 h-16 object-cover rounded"
              />
            ) : (
              <FileText className="w-12 h-12 text-gray-500" />
            )}

            <div className="flex-1 text-sm truncate">
              {value.name}
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeFile();
              }}
              className="text-red-500 hover:text-red-700"
            >
              <X size={18} />
            </button>
          </div>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-xs">{error}</p>
      )}
    </div>
  );
};

export default FileUpload;3
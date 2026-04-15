import { useEffect } from "react";
import { FiX } from "react-icons/fi";

const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    // Prevent body scroll when modal is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    // Cleanup to ensure scroll is restored if component unmounts
    return () => { document.body.style.overflow = "auto"; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

      {/* Overlay - now uses fixed to cover full screen regardless of content */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-2xl rounded shadow-xl z-10 flex flex-col max-h-[90vh]">

        {/* Fixed Header: Stay at the top */}
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white rounded-t-lg z-20">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <FiX size={24} className="text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        {/* Scrollable Body: Content goes here */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  FiMoreVertical,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiSettings,
  FiUserCheck
} from "react-icons/fi";
import Button from "@/components/ui/Button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

const getIcon = (label) => {
  const l = label.toLowerCase();
  if (l.includes("edit")) return <FiEdit2 className="mr-2" />;
  if (l.includes("delete") || l.includes("remove")) return <FiTrash2 className="mr-2" />;
  if (l.includes("view")) return <FiEye className="mr-2" />;
  if (l.includes("user")) return <FiUserCheck className="mr-2" />;
  return <FiSettings className="mr-2" />;
};

const RowActions = ({
  item,
  itemName = "Item",
  displayField = "name",
  actions = [],
}) => {
  const [open, setOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState(null);


  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !open) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const dropdownHeight = actions.length * 38;
    const spaceBelow = window.innerHeight - rect.bottom;

    // Get actual width after render, fallback to 160 if not yet measured
    const dropdownWidth = dropdownRef.current?.offsetWidth || 160;

    let top = rect.bottom + 4;
    if (spaceBelow < dropdownHeight && rect.top > dropdownHeight) {
      top = rect.top - dropdownHeight - 4;
    }

    setPosition({
      top: top,
      // Aligns the right edge of the dropdown with the right edge of the button
      left: rect.right - dropdownWidth,
    });
  }, [open, actions.length]);

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    if (open) {
      updatePosition();
      const timer = setTimeout(updatePosition, 0);
      return () => clearTimeout(timer);
    }
  }, [open, updatePosition]);

  useEffect(() => {
    if (open) {
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);
      document.addEventListener("mousedown", handleClickOutside);
    }

    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && !triggerRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, updatePosition]);

  const handleActionClick = (action) => {

    setOpen(false);
    if (action.showConfirm) {
      setConfirmConfig(action);

    } else {
      action.onClick?.(item);
    }
  };

  return (
    <div>
      <div ref={triggerRef} className="inline-block">
        <Button
          size="sm"
          variant="ghost"
          onClick={toggleDropdown}
          className={`p-1.5 rounded-full transition-colors ${open ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
        >
          <FiMoreVertical size={18} className="text-gray-600" />
        </Button>
      </div>

      {open && createPortal(
        <div
          ref={dropdownRef}
          // Changed to w-max and min-w-[140px] for dynamic width
          className="fixed w-max min-w-[140px] rounded-md shadow-lg bg-white border z-[9999] py-1 animate-in fade-in zoom-in duration-100 overflow-hidden"
          style={{
            top: position.top,
            left: position.left,
            pointerEvents: 'auto'
          }}
        >
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleActionClick(action)}
              className={`flex items-center cursor-pointer w-full text-left px-4 py-2 text-sm transition-colors whitespace-nowrap
                ${action.variant === "danger" ? "text-red-600 hover:bg-red-50" : "text-gray-700 hover:bg-gray-100"}
              `}
            >
              {/* Render specific icon if provided, otherwise auto-map based on label */}
              {action.icon ? <span className="mr-2">{action.icon}</span> : getIcon(action.label)}
              {action.label}
            </button>
          ))}
        </div>,
        document.body
      )}

      <ConfirmDialog
        open={Boolean(confirmConfig)}
        title={confirmConfig?.confirmTitle || `Confirm Action`}
        message={confirmConfig?.confirmMessage || `Are you sure?`}
        confirmText={confirmConfig?.label}
        loading={actions.find(a => a.label === confirmConfig?.label)?.loading}
        onConfirm={async () => {
          await confirmConfig.onClick?.(item);
          setConfirmConfig(null);
        }}
        onCancel={() => setConfirmConfig(null)}
      />
    </div>
  );
};

export default RowActions;
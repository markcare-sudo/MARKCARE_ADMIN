import { FiArrowLeft, FiGlobe } from "react-icons/fi";

const PageHeader = ({
  backButton,
  title,
  subtitle,
  action,
  breadcrumb,
  organization_type
}) => {
  return (
    <div className="flex flex-col gap-2 mb-6">
      {/* ===== Breadcrumb (Optional) ===== */}
      {breadcrumb && (
        <div className="text-xs md:text-sm text-gray-500 truncate">
          {breadcrumb}
        </div>
      )}

      {/* ===== Main Row: Title Container + Actions ===== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

        {/* Left Side: Back Button + Title Info */}
        <div className="flex items-start gap-3 md:gap-4">
          {backButton && (
            <button
              onClick={backButton}
              className="shrink-0 rounded-lg font-bold bg-white p-2.5 md:p-3 hover:bg-gray-50 cursor-pointer shadow-sm border border-gray-100 transition-colors"
            >
              <FiArrowLeft size={20} className="text-slate-500 hover:text-indigo-600" />
            </button>
          )}

          <div className="min-w-0"> {/* min-w-0 allows text truncation to work inside flex */}
            <h1 className="text-xl md:text-2xl font-semibold text-gray-800 leading-tight break-words">
              {title}
            </h1>

            <div className="flex flex-wrap items-center gap-2 mt-1">
              {subtitle && (
                <p className="text-xs md:text-sm text-gray-500">
                  {subtitle}
                </p>
              )}

              {organization_type && (
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded flex items-center gap-1 shrink-0">
                  <FiGlobe size={10} /> {organization_type}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Action Buttons */}
        {action && (
          <div className="flex items-center gap-2 w-full md:w-auto">
            {/* If action contains a Button component, ensure it's styled to handle full width on mobile if needed */}
            <div className="flex flex-1 md:flex-initial items-center gap-2">
              {action}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default PageHeader;
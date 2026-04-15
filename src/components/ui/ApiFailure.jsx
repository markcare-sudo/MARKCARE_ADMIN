import { handleAxiosError } from "../ErrorHandler";

const ApiFailure = ({
  error,
  onRetry,
  className = "",
}) => {
  // Use the exact same logic from your utility
  const errorMessage = handleAxiosError(error);

  // Specifically check for network/offline status
  const isNetworkError = error?.code === "ERR_NETWORK" || !window.navigator.onLine;
  const statusCode = error?.response?.status;

  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center ${className}`}
    >
      <div className="mb-4 text-red-500">
        {isNetworkError ? (
          /* WiFi/Globe Icon for Network Errors */
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ) : (
          /* Alert Icon for Server/API Errors */
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
      </div>

      <h3 className="text-lg font-bold text-gray-900 mb-2">
        {isNetworkError ? "Connection Error" : "Request Failed"}
      </h3>

      <p className="text-gray-600 text-sm max-w-xs mb-4">
        {errorMessage}
      </p>

      {/* Network errors don't have status codes, so we hide this if empty */}
      {statusCode && (
        <span className="inline-block px-2 py-1 mb-6 text-[10px] font-mono font-bold bg-gray-100 text-gray-500 rounded uppercase tracking-wider">
          Status Code: {statusCode}
        </span>
      )}

      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2 text-sm font-bold bg-indigo-600 text-white rounded shadow-sm hover:bg-indigo-700 transition-all active:scale-95"
        >
          {isNetworkError ? "Try Reconnecting" : "Try Again"}
        </button>
      )}
    </div>
  );
};

export default ApiFailure;
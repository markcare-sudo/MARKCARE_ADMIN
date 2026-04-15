const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded p-6 md:p-8">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
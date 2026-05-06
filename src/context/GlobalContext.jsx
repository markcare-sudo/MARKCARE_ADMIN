/* eslint-disable react-refresh/only-export-components */
// context/GlobalContext.js
import { createContext, useContext, useState } from 'react';

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev);

  const getImageUrl = (publicId) => {
    if (!publicId) return null;

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

    // ✅ Fix duplicate folder issue
    let cleaned = publicId.replace(/^products\/products\//, "products/");

    // ✅ Encode spaces & special chars
    cleaned = encodeURIComponent(cleaned).replace(/%2F/g, "/");

    return `${cloudName}/${cleaned}`;
  };


  return (
    <GlobalContext.Provider
      value={{
        getImageUrl,
        openDropdown,
        setOpenDropdown,
        mobileMenuOpen,
        toggleMobileMenu,
        loading,
        // logout,
        error
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);


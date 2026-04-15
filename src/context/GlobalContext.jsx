/* eslint-disable react-refresh/only-export-components */
// context/GlobalContext.js
import { postErrorHandler } from '@/components/ErrorHandler';
import { successHandler } from '@/components/SuccessHandler';
import { createBlog, deleteBlogById, getBlogs, updateBlogById } from '@/services/dashboard.service';
import { createContext, useContext, useEffect, useState } from 'react';

const GlobalContext = createContext();
const awsImageDomain = import.meta.env.VITE_AWS_IMAGE_DOMAIN

export const GlobalProvider = ({ children }) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev);

  const getFullImageUrl = (image) => {
    if (!image) return "";
    if (/^https?:\/\//i.test(image)) return image;
    return `${awsImageDomain}/uploads${image.startsWith("/") ? "" : "/"}${image}`;
  };

  const getFullImageUrl2 = (image) => {
    if (!image) return "";

    // If already absolute URL (http/https), return as-is
    if (/^https?:\/\//i.test(image)) return image;

    // Local uploads
    return `${awsImageDomain}/uploads${image.startsWith("/") ? "" : "/"}${image}`;
  };


  const fetchBlogs = async () => {
    try {
      const res = await getBlogs()
      setBlogs(res.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  const uploadBlog = async (data) => {
    try {
      const res = await createBlog(data)
      successHandler(res)
      fetchBlogs()
    } catch (error) {
      postErrorHandler(error)
    }
  }

  const updateBlog = async (data, id) => {
    try {
      const res = await updateBlogById(data, id)
      successHandler(res)
      fetchBlogs()
    } catch (error) {
      postErrorHandler(error)
    }
  }

  const deleteBlog = async (id) => {
    try {
      const res = await deleteBlogById(id)
      successHandler(res)
      fetchBlogs()
    } catch (error) {
      postErrorHandler(error)
    }
  }


  useEffect(() => {
    fetchBlogs()
  }, [])


  return (
    <GlobalContext.Provider
      value={{
        getFullImageUrl,
        getFullImageUrl2,
        openDropdown,
        setOpenDropdown,
        mobileMenuOpen,
        toggleMobileMenu,
        loading,
        blogs,
        uploadBlog,
        updateBlog,
        deleteBlog,
        // logout,
        error
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);


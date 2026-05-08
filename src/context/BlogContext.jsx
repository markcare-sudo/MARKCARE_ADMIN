import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { successHandler } from "@/components/SuccessHandler";
import { postErrorHandler } from "@/components/ErrorHandler";
import { apiStatusConstants } from "@/utils/api";
import { useAuthContext } from "./AuthContext";
import blogsService from "@/services/blogs.service";

const BlogContext = createContext();

export const BlogProvider = ({ children }) => {

    const { isAuthenticated } = useAuthContext();

    const [blogs, setBlogs] = useState([]);
    const [status, setStatus] = useState(apiStatusConstants.INITIAL);

    const fetchBlogs = useCallback(async (filters) => {

        if (!isAuthenticated) return;

        try {

            setStatus(apiStatusConstants.IN_PROGRESS);

            const res = await blogsService.getBlogs(filters);

            setBlogs(res.data.data || []);

            setStatus(apiStatusConstants.SUCCESS);

        } catch (err) {

            setStatus(apiStatusConstants.FAILURE);
        }

    }, [isAuthenticated]);

    const fetchBlog = async (id) => {

        try {

            setStatus(apiStatusConstants.IN_PROGRESS);

            const res = await blogsService.getBlog(id);

            setStatus(apiStatusConstants.SUCCESS);

            return res.data.data;

        } catch (err) {

            postErrorHandler(err);

            setStatus(apiStatusConstants.FAILURE);
        }
    };

    const createBlog = async (data) => {

        try {

            setStatus(apiStatusConstants.IN_PROGRESS);

            const res = await blogsService.createBlog(data);

            successHandler(res);

            await fetchBlogs();

        } catch (err) {

            postErrorHandler(err);

            setStatus(apiStatusConstants.FAILURE);
        }
    };

    const updateBlog = async (id, data) => {

        try {

            setStatus(apiStatusConstants.IN_PROGRESS);

            const res = await blogsService.updateBlog(id, data);

            successHandler(res);

            await fetchBlogs();

        } catch (err) {

            postErrorHandler(err);

            setStatus(apiStatusConstants.FAILURE);
        }
    };

    const deleteBlog = async (id) => {

        try {

            const res = await blogsService.deleteBlog(id);

            successHandler(res);

            await fetchBlogs();

        } catch (err) {

            postErrorHandler(err);
        }
    };

    useEffect(() => {

        if (isAuthenticated) {
            fetchBlogs();
        }

    }, [isAuthenticated, fetchBlogs]);

    return (
        <BlogContext.Provider
            value={{
                blogs,
                status,

                loading:
                    status === apiStatusConstants.IN_PROGRESS,

                isError:
                    status === apiStatusConstants.FAILURE,

                fetchBlogs,
                fetchBlog,
                createBlog,
                updateBlog,
                deleteBlog,
            }}
        >

            {children}

        </BlogContext.Provider>
    );
};

export const useBlogs = () => useContext(BlogContext);
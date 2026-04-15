import useAuth from "@/features/auth/useAuth";
import { useState, useRef, useEffect, useMemo } from "react";
import { FiBell, FiSettings, FiUser, FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Generate initials safely
  const initials = useMemo(() => {
    if (!user?.name) return "NA";
    return user.name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center justify-between bg-white px-6 py-3 border-b">
      <h1 className="text-xl font-semibold text-gray-700">Dashboard</h1>

      <div className="flex items-center gap-5 relative" ref={dropdownRef}>
        {/* Notification */}
        <FiBell className="text-gray-600 text-xl cursor-pointer hover:text-gray-800 transition" />

        {/* Avatar */}
        <div
          onClick={() => setOpen((prev) => !prev)}
          className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-semibold cursor-pointer hover:opacity-90 transition"
        >
          {initials}
        </div>

        {/* Dropdown */}
        {open && (
          <div className="absolute right-0 top-12 w-64 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50 animate-fadeIn">

            {/* User Info */}
            <div className="flex items-center gap-3 px-4 py-4 border-b bg-gray-50">
              <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-semibold">
                {initials}
              </div>
              <div className="truncate">
                <p className="font-semibold text-gray-800 truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {user?.email || "No email"}
                </p>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2 text-sm">
              <button
                onClick={() => navigate("/settings")}
                className="flex items-center gap-3 w-full px-4 py-2 hover:bg-gray-100 text-gray-700 transition"
              >
                <FiSettings /> Settings
              </button>

              <button
                onClick={() => navigate("/profile")}
                className="flex items-center gap-3 w-full px-4 py-2 hover:bg-gray-100 text-gray-700 transition"
              >
                <FiUser /> Profile
              </button>

              {/* {!user.isSuperAdmin && user?.tenant?.id && ( */}
              <button
                onClick={() => navigate(`/tenants/${user?.tenant?.id}`)}
                className="flex items-center gap-3 w-full px-4 py-2 hover:bg-gray-100 text-gray-700 transition"
              >
                <FiUser /> Lab Profile / Branches
              </button>
              {/* )} */}

              <button
                onClick={logout}
                className="flex items-center gap-3 w-full px-4 py-2 hover:bg-red-50 text-red-500 transition"
              >
                <FiLogOut /> Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
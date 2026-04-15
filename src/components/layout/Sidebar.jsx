import React, { useState, useEffect, useRef, useMemo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import * as Icons from "react-icons/fi";
import LOGOS from "@/constants/images";

// --- Skeleton Component ---
const SidebarSkeleton = ({ collapsed }) => (
  <div className="flex-1 px-3 py-6 space-y-4 animate-pulse">
    {[...Array(8)].map((_, i) => (
      <div key={i} className="flex items-center gap-3 px-3 py-2">
        <div className="w-6 h-4 bg-gray-200 rounded-md shrink-0" />
        {!collapsed && <div className="h-4 bg-gray-200 rounded w-3/4" />}
      </div>
    ))}
  </div>
);


const MENU_ORDER = {
  DASHBOARD: 1,
  RBAC: 2,
  CATALOG: 3,
  ORDERS: 4,
  BILLING: 5,
  REPORTS: 6,
  INVENTORY: 7,
  USERS: 8,
  AUDIT_LOGS: 9,
  EMAILS: 10,
  SETTINGS: 11,
};

const getModuleIcon = (code) => {
  const iconMap = {
    DASHBOARD: Icons.FiPieChart,
    BILLING: Icons.FiCreditCard,
    TENANTS: Icons.FiLayers,
    RBAC: Icons.FiLock,
    CATALOG: Icons.FiBox,
    ORDERS: Icons.FiShoppingCart,
    INVENTORY: Icons.FiPackage,
    REPORTS: Icons.FiBarChart2,
    SETTINGS: Icons.FiSettings,
    SAMPLES: Icons.FiDroplet,
    WORKFLOW: Icons.FiGitMerge,
    AUDIT_LOGS: Icons.FiClipboard,
    SUBSCRIPTIONS: Icons.FiZap,
    FINANCE: Icons.FiDollarSign,
    EMAILS: Icons.FiMail,
  };
  return iconMap[code] || Icons.FiBox;
};

const Sidebar = ({ menuItems = [], collapsed = false, toggleSidebar, onLogout, isLoading = false }) => {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState({});
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef();

  const sortedMenuItems = useMemo(() => {
    return [...menuItems].sort((a, b) => {
      const orderA = MENU_ORDER[a.code] || 99;
      const orderB = MENU_ORDER[b.code] || 99;
      return orderA - orderB;
    });
  }, [menuItems]);

  useEffect(() => {
    const currentPath = location.pathname;
    const newOpenMenus = { ...openMenus };
    sortedMenuItems.forEach((module) => {
      const isModuleActive = currentPath.startsWith(module.path);
      if (isModuleActive && module.features?.length > 0) {
        newOpenMenus[module.id] = true;
      }
    });
    setOpenMenus(newOpenMenus);
  }, [location.pathname, sortedMenuItems]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = (moduleId, hasFeatures) => {
    if (collapsed || !hasFeatures) return;
    setOpenMenus((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  return (
    <aside className={`h-screen bg-white text-gray-700 flex flex-col transition-all duration-300 border-r border-gray-200 overflow-hidden ${collapsed ? "w-16" : "w-64"}`}>

      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100 shrink-0">
        {!collapsed && <img src={LOGOS.MARKCARE_LOGO} alt="iQLIMS" className="h-7 w-auto transition-all" />}
        <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 text-xl transition-colors">
          <Icons.FiMenu />
        </button>
      </div>

      {/* Navigation Content */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2 no-scrollbar">
        <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>

        {isLoading ? (
          <SidebarSkeleton collapsed={collapsed} />
        ) : (
          sortedMenuItems.map((module) => {
            const ModuleIcon = getModuleIcon(module.code);
            const hasFeatures = module.features && module.features.length > 0;
            const isOpen = openMenus[module.id];
            const isActive = location.pathname.startsWith(module.path);

            return (
              <div key={module.id} className="group">
                <div className="relative">
                  <NavLink
                    to={hasFeatures ? "#" : module.path}
                    onClick={(e) => {
                      if (hasFeatures) {
                        e.preventDefault();
                        handleToggle(module.id, hasFeatures);
                      }
                    }}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${isActive ? "bg-blue-50 text-blue-700 shadow-sm" : "text-gray-600 hover:bg-gray-50"
                      }`}
                  >
                    <ModuleIcon className={`text-xl shrink-0 ${isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"}`} />
                    {!collapsed && (
                      <span className={`flex-1 text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis ${isActive ? "font-semibold" : ""}`}>
                        {module.name}
                      </span>
                    )}
                    {!collapsed && hasFeatures && (
                      <Icons.FiChevronRight className={`text-xs transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`} />
                    )}
                  </NavLink>
                </div>

                {!collapsed && hasFeatures && isOpen && (
                  <div className="ml-9 mt-1 space-y-1 border-l border-gray-100 pl-4 animate-in slide-in-from-top-2 duration-200">
                    {module.features.map((feat) => (
                      <NavLink
                        key={feat.id}
                        to={`${module.path}/${feat.code.toLowerCase().replace(/_/g, "-")}`}
                        className={({ isActive: isSubActive }) =>
                          `block py-2 text-xs transition-all ${isSubActive ? "text-blue-600 font-bold" : "text-gray-500 hover:text-gray-800"}`
                        }
                      >
                        {feat.name}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </nav>

      {/* Profile Section */}
      <div className="mt-auto bg-gray-50 border-t border-gray-200" ref={profileRef}>
        <div className="relative p-4">
          {isLoading ? (
            <div className="flex items-center gap-3 p-2 animate-pulse">
              <div className="w-9 h-9 rounded-full bg-gray-200" />
              {!collapsed && <div className="flex-1 space-y-2"><div className="h-2 bg-gray-200 rounded w-full" /><div className="h-2 bg-gray-200 rounded w-1/2" /></div>}
            </div>
          ) : (
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className={`w-full flex items-center gap-3 p-2 rounded-xl transition-all ${collapsed ? "justify-center" : "bg-white hover:bg-gray-100 border border-gray-200 shadow-sm"}`}
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-sm text-white shrink-0 ring-2 ring-white">
                AD
              </div>
              {!collapsed && (
                <div className="text-left overflow-hidden flex-1">
                  <p className="text-xs font-black truncate tracking-tight text-gray-800 uppercase">Admin User</p>
                  <p className="text-[10px] text-gray-500 truncate">System Manager</p>
                </div>
              )}
              {!collapsed && <Icons.FiMoreVertical className="text-gray-400" />}
            </button>
          )}
          {/* ... profile menu dropdown logic ... */}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
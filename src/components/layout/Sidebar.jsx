import React, { useState, useEffect, useRef, useMemo } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import * as Icons from "react-icons/fi";
import LOGOS from "@/constants/images";

const MENU_ORDER = {
  DASHBOARD: 1,

  // Identity / Access
  MASTERS: 2,
  RBAC: 3,
  USERS: 4,
  ROLES: 5,
  MODULES: 6,

  // Business Core
  CATALOG: 7,
  PRODUCTS: 8,
  CATEGORIES: 9,
  BRANDS: 10,
  SERVICES: 11,
  MANUFACTURERS: 12,
  COMPLIANCES: 13,

  // Transactions
  SALES: 14,
  ORDERS: 15,
  BILLING: 16,

  // Operations
  INVENTORY: 17,

  // System
  CALL_BACK_REQUESTS: 18,
  BLOGS: 19,
  REPORTS: 20,
  AUDIT_LOGS: 21,
  EMAILS: 22,
  SETTINGS: 23,
};

const getModuleIcon = (code) => {
  const iconMap = {
    DASHBOARD: Icons.FiPieChart,

    // Identity / Access
    MASTERS: Icons.FiGrid,
    RBAC: Icons.FiLock,
    USERS: Icons.FiUsers,
    ROLES: Icons.FiShield,
    MODULES: Icons.FiGrid,

    // Catalog / Masters
    CATALOG: Icons.FiBox,
    PRODUCTS: Icons.FiPackage,
    CATEGORIES: Icons.FiList,
    BRANDS: Icons.FiTag,
    SERVICES: Icons.FiTool,
    MANUFACTURERS: Icons.FiHome,
    COMPLIANCES: Icons.FiCheckCircle,

    // Transactions
    SALES: Icons.FiTrendingUp,
    ORDERS: Icons.FiShoppingCart,
    BILLING: Icons.FiCreditCard,
    BOOKINGS: Icons.FiCalendar,

    // Operations
    INVENTORY: Icons.FiArchive,

    // System
    CALL_BACK_REQUESTS: Icons.FiPhone,
    BLOGS: Icons.FiFileText,
    REPORTS: Icons.FiBarChart2,
    AUDIT_LOGS: Icons.FiClipboard,
    EMAILS: Icons.FiMail,
    SETTINGS: Icons.FiSettings,
  };

  return iconMap[code] || Icons.FiBox;
};

const Sidebar = ({
  menuItems = [],
  collapsed = false,
  toggleSidebar,
  isLoading = false,
}) => {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState({});
  const profileRef = useRef();
  const navigate = useNavigate();

  // sort recursively
  const sortRecursive = (items) => {
    return [...items]
      .sort((a, b) => (MENU_ORDER[a.code] || 99) - (MENU_ORDER[b.code] || 99))
      .map((item) => ({
        ...item,
        children: item.children?.length
          ? sortRecursive(item.children)
          : [],
      }));
  };

  const sortedMenuItems = useMemo(
    () => sortRecursive(menuItems),
    [menuItems]
  );

  // auto open active parent menus
  useEffect(() => {
    const openActiveParents = (items, path) => {
      let state = {};

      const traverse = (nodes) => {
        for (const node of nodes) {
          if (node.path && path.startsWith(node.path)) {
            state[node.id] = true;
          }
          if (node.children?.length) {
            traverse(node.children);
          }
        }
      };

      traverse(items);
      setOpenMenus((prev) => ({ ...prev, ...state }));
    };

    openActiveParents(sortedMenuItems, location.pathname);
  }, [location.pathname, sortedMenuItems]);

  const toggleMenu = (id) => {
    setOpenMenus((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderMenu = (items, level = 0) => {
    return items.map((item) => {
      const Icon = getModuleIcon(item.code);
      const hasChildren = item.children?.length > 0;
      const isOpen = openMenus[item.id];

      const isActive =
        item.path && location.pathname.startsWith(item.path);

      return (
        <div key={item.id}>
          <div style={{ paddingLeft: `${level * 14}px` }}>
            <NavLink
              to={item.path || "#"}
              onClick={(e) => {
                if (hasChildren && !item.is_clickable) {
                  e.preventDefault();
                  toggleMenu(item.id);
                }
              }}
              className={`flex items-center gap-3 px-3 py-2.5 my-1 rounded-lg transition ${isActive
                ? "bg-blue-50 text-blue-700"
                : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              <Icon className="text-lg shrink-0" />
              {!collapsed && (
                <span className="flex-1 text-sm">{item.name}</span>
              )}

              {!collapsed && hasChildren && (
                <Icons.FiChevronRight
                  className={`transition-transform ${isOpen ? "rotate-90" : ""
                    }`}
                />
              )}
            </NavLink>
          </div>

          {!collapsed && hasChildren && isOpen && (
            <div>{renderMenu(item.children, level + 1)}</div>
          )}
        </div>
      );
    });
  };

  return (
    <aside
      className={`h-screen bg-white flex flex-col border-r transition-all ${collapsed ? "w-16" : "w-64"
        }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b">
        {!collapsed && (
          <img src={LOGOS.MARKCARE_LOGO} alt="logo" onClick={() => navigate('/')} className="h-7 cursor-pointer" />
        )}
        <button onClick={toggleSidebar} className="ml-1.5 cursor-pointer">
          <Icons.FiMenu size={20} />
        </button>
      </div>

      {/* Menu */}
      {/* 🛠️ Added styling here to remove the scrollbar bar across all browsers */}
      <nav
        className="flex-1 overflow-y-auto px-2 py-4"
        style={{
          scrollbarWidth: "none",          /* Firefox */
          msOverflowStyle: "none",         /* IE and Edge */
        }}
      >
        {/* CSS injection for WebKit engines (Chrome, Safari, Brave) */}
        <style>{`
          nav::-webkit-scrollbar {
            display: none;                 /* WebKit */
          }
        `}</style>

        {isLoading ? (
          <div className="text-sm text-gray-400">Loading...</div>
        ) : (
          renderMenu(sortedMenuItems)
        )}
      </nav>

      {/* Profile */}
      <div ref={profileRef} className="border-t p-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 text-white flex items-center justify-center rounded-full">
            A
          </div>
          {!collapsed && (
            <div>
              <p className="text-sm font-bold">Admin</p>
              <p className="text-xs text-gray-500">System</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
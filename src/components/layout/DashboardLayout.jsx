import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useModules } from "@/context/ModulesContext";
import useAuth from "@/features/auth/useAuth";

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  // We extract tree and loading status from context. 
  // The context handles the fetching logic automatically.
  const { menu, isTreeLoading } = useModules();
  const { user } = useAuth()

  // Load collapse state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved !== null) {
      setCollapsed(JSON.parse(saved));
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    localStorage.setItem("sidebar-collapsed", JSON.stringify(newState));
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* ===== SIDEBAR ===== */}
      <Sidebar
        collapsed={collapsed}
        menuItems={menu}
        user={user}
        isLoading={isTreeLoading}
        // Tip: Consider getting these permissions from AuthContext instead of hardcoding
        userPermissions={["DASHBOARD.VIEW", "TENANTS.VIEW"]}
        toggleSidebar={toggleSidebar}
      />

      {/* ===== MAIN AREA ===== */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* ===== HEADER ===== */}
        <div className="shrink-0">
          <Header toggleSidebar={toggleSidebar} />
        </div>

        {/* ===== CONTENT ===== */}
        <main className="flex-1 overflow-y-auto p-4 shadow-md">
          {/* Outlet renders the child route components */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
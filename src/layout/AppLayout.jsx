import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import "./AppLayout.css";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(prev => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  // Close sidebar on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && sidebarOpen) closeSidebar();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [sidebarOpen]);

  return (
    <div className={`app-layout ${sidebarOpen ? "app-layout--sidebar-open" : ""}`}
         onClick={sidebarOpen ? closeSidebar : undefined}>
      <Sidebar />
      {sidebarOpen && <div className="app-layout__overlay" />}
      <div className="app-layout__main" onClick={e => e.stopPropagation()}> {/* prevent click propagation */}
        <Topbar onToggle={toggleSidebar} />
        <main className="app-layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

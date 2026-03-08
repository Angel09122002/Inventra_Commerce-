import { Outlet } from "react-router-dom";
import "./AppLayout.css";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout() {
  return (
    <div className="app-layout">
      <Sidebar />

      <div className="app-layout__main">
        <Topbar />

        <main className="app-layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

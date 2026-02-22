import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout() {
  return (
    <div className="appShell">
      <Sidebar />
      <div className="main">
        <Topbar />
        <main className="content">
          <Outlet />
          {/* This will render the page with out duplicating the
          layout */}
        </main>
      </div>
    </div>
  );
}

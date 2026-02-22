import { useLocation } from "react-router-dom";

function titleFromPath(pathname) {
  if (pathname === "/") return "Dashboard";
  return pathname.replace("/", "").replace(/^\w/, (c) => c.toUpperCase());
}

export default function Topbar() {
  const { pathname } = useLocation();
  const title = titleFromPath(pathname);

  return (
    <header className="topbar">
      <div className="topbarTitle">{title}</div>
      <div className="topbarRight">
        <span className="pill">Mock Mode</span>
      </div>
    </header>
  );
}

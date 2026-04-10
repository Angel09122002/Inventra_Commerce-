import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import Customers from "../pages/Customers";
import Dashboard from "../pages/Dashboard";
import Inventory from "../pages/Inventory";
import Orders from "../pages/Orders";
import Payments from "../pages/Payments";
import Products from "../pages/Products";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "products", element: <Products /> },
      { path: "orders", element: <Orders /> },
      { path: "customers", element: <Customers /> },
      { path: "inventory", element: <Inventory /> },
      { path: "payments", element: <Payments /> },
    ],
  },
]);

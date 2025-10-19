import { createBrowserRouter, Outlet } from "react-router-dom";
import Home from "../pages/Home";
import Register from "../pages/auth/register/Register";
import Login from "../pages/auth/login/Login";
import Navlist from "../components/navlist/Navlist";

const NotFound = () => <div style={{ padding: 20 }}>Page not found</div>;

function MainLayout() {
  return (
    <>
      <Navlist />
      <Outlet />
    </>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

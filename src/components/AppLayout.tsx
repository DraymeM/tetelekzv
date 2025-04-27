import { Suspense } from "react";
import { Outlet } from "@tanstack/react-router";
import Navbar from "./Navbar.tsx";

const AppLayout: React.FC = () => {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Navbar />
        <Outlet />
      </Suspense>
    </>
  );
};

export default AppLayout;

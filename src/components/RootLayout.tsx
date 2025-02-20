import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

function RootLayout() {
  return (
    <div className="min-h-screen bg-[#fcf7f2]">
      <Navbar />
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
}

export default RootLayout;

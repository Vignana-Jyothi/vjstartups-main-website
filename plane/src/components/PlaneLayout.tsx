import { Outlet } from "react-router-dom";
import PlaneHeader from "./PlaneHeader";

const PlaneLayout = () => {
  return (
    <div className="min-h-screen bg-[#0b0e14] text-[#f8fafc] flex flex-col">
      <PlaneHeader />
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default PlaneLayout;

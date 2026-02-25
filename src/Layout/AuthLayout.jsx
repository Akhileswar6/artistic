import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center " >
      <Outlet />
    </div>
  );
};

export default AuthLayout;

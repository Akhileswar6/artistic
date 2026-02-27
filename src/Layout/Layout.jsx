import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ isDark, setIsDark }) {
    return (
    <>
      <Navbar isDark={isDark} setIsDark={setIsDark} />
      <Outlet />
      <Footer/>
    </>
  );
}

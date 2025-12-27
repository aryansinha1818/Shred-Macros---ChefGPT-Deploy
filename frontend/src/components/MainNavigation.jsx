import NavBar from "./NavBar";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";

const MainNavigation = () => {
  return (
    <>
      <NavBar />
      <Outlet />
      <Footer />
    </>
  );
};

export default MainNavigation;

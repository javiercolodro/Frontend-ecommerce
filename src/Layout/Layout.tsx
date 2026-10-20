import { Outlet } from "react-router";
import Navbar from "../components/Navbar/Navbar";
// import ChatWidget from "../components/Chat/ChatWidget";

const Layout = () => {
  return (
    <div className="w-full relative">
      <Navbar />
      <main className="max-w-[1400px] mx-auto px-6 pb-10">
        <Outlet />
      </main>
      <div className="fixed bottom-4 right-4 z-50">
        {/* <ChatWidget /> */}
      </div>
    </div>
  );
};

export default Layout;

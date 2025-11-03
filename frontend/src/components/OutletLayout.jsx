import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const OutletLayout = () => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <main className="grow container mx-auto p-4 pt-20"><Outlet /></main>
    <Footer />
  </div>
);

export default OutletLayout;

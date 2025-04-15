
import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface MainLayoutProps {
  children: ReactNode;
  withPadding?: boolean;
}

const MainLayout = ({ children, withPadding = true }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className={`flex-grow ${withPadding ? 'pt-16' : ''}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;

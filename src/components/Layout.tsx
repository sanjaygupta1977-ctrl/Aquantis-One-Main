import Sidebar from "./Sidebar";
import Header from "./Header";

interface LayoutProps {
  children: React.ReactNode;
  hideSidebar?: boolean;
}

export default function Layout({ children, hideSidebar = false }: LayoutProps) {
  return (
    <>
      {!hideSidebar && <Sidebar />}
      <Header />

      <div
        style={{
          marginLeft: hideSidebar ? "0" : "240px",
          marginTop: "70px",
          padding: "30px",
          background: "#f5f7fb",
          minHeight: "100vh",
        }}
      >
        {children}
      </div>
    </>
  );
}

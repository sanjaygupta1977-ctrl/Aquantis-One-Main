import Sidebar from "./Sidebar";
import Header from "./Header";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Sidebar />
      <Header />

      <div
        style={{
          marginLeft: "240px",
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
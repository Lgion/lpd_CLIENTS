import Link from "next/link";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <>
      <Header />

      <div className="page-content">{children}</div>

      <Footer />

      <style jsx>{`
        header > a {
          width: 100%;
        }
        header > a:hover {
          color: white;
        }
      `}</style>
    </>
  );
}

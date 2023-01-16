import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <>
      <Header />

      {children}

      <Footer />

      <div id="modal"></div>

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

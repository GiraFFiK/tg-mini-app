import "./reset.css";
import "./index.css";
import { useState } from "react";
import { LanguageProvider } from "./components/LanguageContext";
import { ThemeProvider } from "./components/ThemeContext";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import Home from "./components/Home";
import Topup from "./components/Topup";
import Settings from "./components/Settings";

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>("home");

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <Home />;
      case "topup":
        return <Topup />;
      case "settings":
        return <Settings />;
      default:
        return <Home />;
    }
  };

  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="wrapper">
          <Header />
          {renderPage()}
          <Navigation onPageChange={setCurrentPage} />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}
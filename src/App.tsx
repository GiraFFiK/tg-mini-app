import "./reset.css";
import "./index.css";
import { useState, useEffect } from "react";
import { LanguageProvider } from "./components/LanguageContext";
import { ThemeProvider } from "./components/ThemeContext";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import Home from "./components/Home";
import Topup from "./components/Topup";
import Referral from "./components/Referral";
import Settings from "./components/Settings";
import { authenticate } from "./services/api";

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>("home");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initApp = async () => {
      const tg = window.Telegram?.WebApp;
      if (tg) {
        tg.expand();
        tg.ready();
      }

      const userData = await authenticate();
      if (userData) {
        setUser(userData);
        console.log("User authenticated:", userData);
      }
      setLoading(false);
    };

    initApp();
  }, []);

  const renderPage = () => {
    if (loading) {
      return <div className="loading">Загрузка...</div>;
    }

    switch (currentPage) {
      case "home":
        return <Home user={user} />;
      case "topup":
        return <Topup user={user} />;
      case "referral":
        return <Referral user={user} />;
      case "settings":
        return <Settings />;
      default:
        return <Home user={user} />;
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
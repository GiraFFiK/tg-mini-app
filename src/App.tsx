import "./reset.css";
import "./index.css";
import { useState, useEffect } from "react";
import { LanguageProvider } from "./components/LanguageContext";
import { ThemeProvider } from "./components/ThemeContext";
import Navigation from "./components/Navigation";
import Home from "./components/Home";
import Topup from "./components/Topup";
import Referral from "./components/Referral";
import Settings from "./components/Settings";
import LoadingScreen from "./components/LoadingScreen";
import { authenticate } from "./services/api";

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>("home");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initApp = async () => {
      const tg = window.Telegram?.WebApp;
      if (tg) {
        // Определяем платформу
        const platform = tg.platform || '';
        const isMobile = platform === 'ios' || platform === 'android' || platform === 'web' || platform === 'weba';
        const isDesktop = platform === 'tdesktop' || platform === 'macos' || platform === 'windows' || platform === 'webk';
        
        console.log("📱 Платформа:", platform);
        console.log("Мобильное устройство:", isMobile);
        console.log("Десктоп:", isDesktop);
        
        // Настройка отображения
        if (isMobile) {
          // На телефонах — полноэкранный режим
          tg.requestFullscreen?.();
          console.log("📱 Запрошен полноэкранный режим");
        } else if (isDesktop) {
          // На десктопе — расширенный вид (fullsize)
          tg.expand();
          console.log("💻 Запрошен расширенный режим");
        } else {
          // Fallback для неизвестных платформ
          tg.expand();
        }
        
        tg.ready();
      }

      // Засекаем время начала
      const startTime = Date.now();
      
      const userData = await authenticate();
      if (userData) {
        setUser(userData);
        console.log("User authenticated:", userData);
      }
      
      // Вычисляем, сколько прошло времени
      const elapsedTime = Date.now() - startTime;
      const minLoadTime = 2000; // 2 секунды
      
      // Если прошло меньше минимального времени, ждем остаток
      if (elapsedTime < minLoadTime) {
        await new Promise(resolve => setTimeout(resolve, minLoadTime - elapsedTime));
      }
      
      setLoading(false);
    };

    initApp();
  }, []);

  const renderPage = () => {
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
          {loading ? <LoadingScreen /> : renderPage()}
          <Navigation onPageChange={setCurrentPage} />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}
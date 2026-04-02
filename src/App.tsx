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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const initApp = async () => {
      const tg = window.Telegram?.WebApp;
      if (tg) {
        // Определяем платформу
        const platform = tg.platform || '';
        const mobilePlatforms = ['ios', 'android', 'web', 'weba'];
        const isMobileDevice = mobilePlatforms.includes(platform);
        setIsMobile(isMobileDevice);
        
        console.log("📱 Платформа:", platform);
        console.log("Мобильное устройство:", isMobileDevice);
        
        // Отключаем вертикальные свайпы для сворачивания
        tg.disableVerticalSwipes();
        
        // Настройка отображения
        if (isMobileDevice) {
          // На телефонах — полноэкранный режим
          try {
            if (tg.requestFullscreen) {
              await tg.requestFullscreen();
              console.log("📱 Полноэкранный режим активирован");
            } else {
              tg.expand();
            }
          } catch (error) {
            console.error("Ошибка при запросе fullscreen:", error);
            tg.expand();
          }
        } else {
          // На десктопе — расширенный вид
          tg.expand();
          console.log("💻 Расширенный режим активирован");
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
        return <Home user={user} isMobile={isMobile} />;
      case "topup":
        return <Topup user={user} isMobile={isMobile} />;
      case "referral":
        return <Referral user={user} isMobile={isMobile} />;
      case "settings":
        return <Settings isMobile={isMobile} />;
      default:
        return <Home user={user} isMobile={isMobile} />;
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
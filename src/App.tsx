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
import type { AppUser } from "./types/app";
import "./redesign.css";

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>("home");
  const [pendingInstruction, setPendingInstruction] = useState<"region" | "setup" | null>(null);
  const [user, setUser] = useState<AppUser | null>(null);
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
        tg.disableVerticalSwipes?.();
        
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
        
        tg.ready?.();
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

  const openInstruction = (instruction: "region" | "setup") => {
    setPendingInstruction(instruction);
    setCurrentPage("home");
  };

  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="wrapper">
          {loading ? (
            <LoadingScreen />
          ) : (
            <main className="app-pages">
              <section className={`app-page ${currentPage === "home" ? "app-page--active" : ""}`}>
                <Home
                  user={user}
                  isMobile={isMobile}
                  isActive={currentPage === "home"}
                  requestedInstruction={pendingInstruction}
                  onInstructionOpened={() => setPendingInstruction(null)}
                  onNavigate={setCurrentPage}
                />
              </section>
              <section className={`app-page ${currentPage === "topup" ? "app-page--active" : ""}`}>
                <Topup user={user} isMobile={isMobile} />
              </section>
              <section className={`app-page ${currentPage === "referral" ? "app-page--active" : ""}`}>
                <Referral user={user} isMobile={isMobile} />
              </section>
              <section className={`app-page ${currentPage === "settings" ? "app-page--active" : ""}`}>
                <Settings isMobile={isMobile} onOpenInstruction={openInstruction} />
              </section>
            </main>
          )}
          <Navigation activePage={currentPage} onPageChange={setCurrentPage} />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}

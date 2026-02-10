import { useState, useEffect, useRef } from 'react';
// import './Navigation.css';

type NavItem = {
  id: string;
  label: string;
  icon: string;
  component: React.ReactNode;
};

interface NavigationProps {
  onPageChange?: (pageId: string) => void;
}

export default function Navigation({ onPageChange }: NavigationProps) {
  const [activePage, setActivePage] = useState<string>('home');
  const [sliderPosition, setSliderPosition] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const navItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: '🏠', component: null },
    { id: 'topup', label: 'Top Up', icon: '💰', component: null },
    { id: 'settings', label: 'Settings', icon: '⚙️', component: null }
  ];
  
  const trackRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const calculatePosition = (pageId: string) => {
    const index = navItems.findIndex(item => item.id === pageId);
    if (trackRef.current && index >= 0) {
      const itemWidth = trackRef.current.offsetWidth / navItems.length;
      return index * itemWidth + itemWidth / 2;
    }
    return 0;
  };

  useEffect(() => {
    setSliderPosition(calculatePosition(activePage));
    onPageChange?.(activePage);
  }, [activePage]);

  const handleNavClick = (pageId: string) => {
    setActivePage(pageId);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    handleDrag(e.touches[0].clientX);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleDrag(e.clientX);
  };

  const handleDrag = (clientX: number) => {
    if (!trackRef.current || !isDragging) return;
    
    const trackRect = trackRef.current.getBoundingClientRect();
    const relativeX = clientX - trackRect.left;
    const trackWidth = trackRect.width;
    const itemWidth = trackWidth / navItems.length;
    
    // Определяем, на какой элемент указывает позиция
    const itemIndex = Math.min(
      Math.max(0, Math.floor(relativeX / itemWidth)),
      navItems.length - 1
    );
    
    const targetPage = navItems[itemIndex].id;
    if (targetPage !== activePage) {
      setActivePage(targetPage);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (isDragging) {
      handleDrag(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleDrag(e.clientX);
    }
  };

  const handleEndDrag = () => {
    setIsDragging(false);
  };

  // Добавляем обработчики для всего документа
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleDrag(e.clientX);
      }
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (isDragging) {
        e.preventDefault();
        handleDrag(e.touches[0].clientX);
      }
    };

    const handleGlobalTouchEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
      document.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
      document.addEventListener('touchend', handleGlobalTouchEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('touchmove', handleGlobalTouchMove);
      document.removeEventListener('touchend', handleGlobalTouchEnd);
    };
  }, [isDragging]);

  return (
    <>
      <nav className="nav-bottom">
        <div 
          className="nav-track" 
          ref={trackRef}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleEndDrag}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleEndDrag}
          onMouseUp={handleEndDrag}
        >
          {/* Интерактивный круг */}
          <div 
            className="nav-slider"
            ref={sliderRef}
            style={{ left: `${sliderPosition}px` }}
            onTouchStart={handleTouchStart}
            onMouseDown={handleMouseDown}
          />

          {/* Элементы навигации */}
          {navItems.map((item) => (
            <div
              key={item.id}
              className={`nav-item ${activePage === item.id ? 'active' : ''}`}
              onClick={() => handleNavClick(item.id)}
              onTouchStart={(e) => {
                e.preventDefault();
                handleNavClick(item.id);
              }}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-text">{item.label}</span>
            </div>
          ))}
        </div>
      </nav>
    </>
  );
}
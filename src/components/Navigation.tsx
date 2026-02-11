import { useState, useEffect, useRef } from 'react';

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
  const [dragStartX, setDragStartX] = useState<number>(0);
  const [initialPosition, setInitialPosition] = useState<number>(0);
  
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
    if (!isDragging) {
      setActivePage(pageId);
    }
  };

  // Начало перетаскивания
  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    setDragStartX(clientX);
    setInitialPosition(sliderPosition);
    
    if (sliderRef.current) {
      sliderRef.current.classList.add('dragging');
    }
    if (trackRef.current) {
      trackRef.current.classList.add('dragging');
    }
    
    // Блокируем скролл
    document.body.style.overflow = 'hidden';
    document.body.style.userSelect = 'none';
  };

  // Процесс перетаскивания
  const handleDragMove = (clientX: number) => {
    if (!isDragging || !trackRef.current) return;
    
    const trackRect = trackRef.current.getBoundingClientRect();
    const deltaX = clientX - dragStartX;
    const trackWidth = trackRect.width;
    const itemWidth = trackWidth / navItems.length;
    
    // Вычисляем новую позицию с ограничениями
    let newPosition = initialPosition + deltaX;
    const minPosition = itemWidth / 2;
    const maxPosition = trackWidth - itemWidth / 2;
    newPosition = Math.min(Math.max(newPosition, minPosition), maxPosition);
    
    // Обновляем позицию слайдера в реальном времени
    setSliderPosition(newPosition);
    
    // Определяем, на какой элемент указывает позиция
    const itemIndex = Math.min(
      Math.max(0, Math.floor(newPosition / itemWidth)),
      navItems.length - 1
    );
    
    const targetPage = navItems[itemIndex].id;
    if (targetPage !== activePage) {
      setActivePage(targetPage);
    }
  };

  // Конец перетаскивания
  const handleDragEnd = () => {
    setIsDragging(false);
    
    if (sliderRef.current) {
      sliderRef.current.classList.remove('dragging');
    }
    if (trackRef.current) {
      trackRef.current.classList.remove('dragging');
    }
    
    // Возвращаем скролл
    document.body.style.overflow = '';
    document.body.style.userSelect = '';
    
    // Плавно возвращаемся в центр активного элемента
    setSliderPosition(calculatePosition(activePage));
  };

  // Mouse события
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX);
  };

  // Touch события
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    handleDragStart(e.touches[0].clientX);
  };

  // Глобальные обработчики
  useEffect(() => {
    // Обработчики для мыши
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        e.preventDefault();
        handleDragMove(e.clientX);
      }
    };

    const handleGlobalMouseUp = () => {
      if (isDragging) {
        handleDragEnd();
      }
    };

    // Обработчики для touch
    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (isDragging) {
        e.preventDefault();
        handleDragMove(e.touches[0].clientX);
      }
    };

    const handleGlobalTouchEnd = () => {
      if (isDragging) {
        handleDragEnd();
      }
    };

    const handleGlobalTouchCancel = () => {
      if (isDragging) {
        handleDragEnd();
      }
    };

    // Блокируем контекстное меню при перетаскивании
    const handleContextMenu = (e: Event) => {
      if (isDragging) {
        e.preventDefault();
      }
    };

    if (isDragging) {
      // Добавляем глобальные обработчики
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
      window.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
      window.addEventListener('touchend', handleGlobalTouchEnd);
      window.addEventListener('touchcancel', handleGlobalTouchCancel);
      window.addEventListener('contextmenu', handleContextMenu);
    }

    return () => {
      // Удаляем глобальные обработчики
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('touchmove', handleGlobalTouchMove);
      window.removeEventListener('touchend', handleGlobalTouchEnd);
      window.removeEventListener('touchcancel', handleGlobalTouchCancel);
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [isDragging, dragStartX, initialPosition, activePage]);

  return (
    <nav className="nav-bottom">
      <div 
        className={`nav-track ${isDragging ? 'dragging' : ''}`}
        ref={trackRef}
      >
        {/* Интерактивный круг */}
        <div 
          className={`nav-slider liquid-glass ${isDragging ? 'dragging' : ''}`}
          ref={sliderRef}
          style={{ 
            left: `${sliderPosition}px`,
            transition: isDragging ? 'none' : 'left 0.3s cubic-bezier(0.2, 0.9, 0.4, 1)'
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        />

        {/* Элементы навигации */}
        {navItems.map((item) => (
          <div
            key={item.id}
            className={`nav-item ${activePage === item.id ? 'active' : ''}`}
            onClick={() => handleNavClick(item.id)}
            onTouchStart={(e) => {
              e.preventDefault();
              if (!isDragging) {
                handleNavClick(item.id);
              }
            }}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-text">{item.label}</span>
          </div>
        ))}
      </div>
    </nav>
  );
}
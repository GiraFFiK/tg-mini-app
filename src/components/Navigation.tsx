import { useState, useEffect } from 'react';
import './Navigation.css';

type NavItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  component: React.ReactNode;
};

interface NavigationProps {
  onPageChange?: (pageId: string) => void;
}

export default function Navigation({ onPageChange }: NavigationProps) {
  const [activePage, setActivePage] = useState<string>('home');
  
  const navItems: NavItem[] = [
    { 
      id: 'home', 
      label: 'Home', 
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 10L12 3L21 10V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V10Z" />
          <path d="M9 22V12H15V22" />
        </svg>
      ),
      component: null 
    },
    { 
      id: 'topup', 
      label: 'Top Up', 
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="8" width="20" height="12" rx="2" />
          <path d="M6 12H10" />
          <path d="M14 12H18" />
          <path d="M2 12H2" />
          <path d="M22 12H22" />
          <path d="M12 12V12" />
        </svg>
      ),
      component: null 
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H5.78a1.65 1.65 0 0 0-1.51 1 1.65 1.65 0 0 0 .33 1.82l.07.08A10 10 0 0 0 12 17.66a10 10 0 0 0 6.18-2.58l.07-.08z" />
          <path d="M16.5 9.4V6.5a1.5 1.5 0 0 0-3 0v2.9" />
          <path d="M10.5 9.4V6.5a1.5 1.5 0 0 0-3 0v2.9" />
        </svg>
      ),
      component: null 
    }
  ];

  useEffect(() => {
    onPageChange?.(activePage);
  }, [activePage]);

  const handleNavClick = (pageId: string) => {
    setActivePage(pageId);
  };

  return (
    <nav className="nav-minimal">
      <div className="nav-minimal__track">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-minimal__item ${activePage === item.id ? 'nav-minimal__item--active' : ''}`}
            onClick={() => handleNavClick(item.id)}
          >
            <span className="nav-minimal__icon">{item.icon}</span>
            <span className="nav-minimal__label">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
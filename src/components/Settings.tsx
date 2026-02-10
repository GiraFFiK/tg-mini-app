import { useState } from 'react';

export default function Settings() {
  const [language, setLanguage] = useState<string>('ru');
  const [notifications, setNotifications] = useState<boolean>(true);

  const languages = [
    { id: 'en', name: 'English', flag: '🇺🇸' },
    { id: 'ru', name: 'Русский', flag: '🇷🇺' },
  ];

  return (
    <div className="page-content settings-page">
      <div className="settings-section">
        <h2 className="settings-title">Настройки</h2>
        
        <div style={{ marginBottom: '25px' }}>
          <div style={{ fontSize: '16px', marginBottom: '15px' }}>Язык</div>
          {languages.map(lang => (
            <div
              key={lang.id}
              className="settings-option"
              onClick={() => setLanguage(lang.id)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '24px' }}>{lang.flag}</span>
                <span>{lang.name}</span>
              </div>
              {language === lang.id && (
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: '#6d5dfc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  ✓
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ marginBottom: '25px' }}>
          <div style={{ fontSize: '16px', marginBottom: '15px' }}>Уведомления</div>
          <div className="settings-option" onClick={() => setNotifications(!notifications)}>
            <span>Push уведомления</span>
            <div style={{
              width: '50px',
              height: '26px',
              background: notifications ? '#6d5dfc' : 'rgba(255,255,255,0.2)',
              borderRadius: '13px',
              position: 'relative',
              transition: 'background 0.3s ease'
            }}>
              <div style={{
                position: 'absolute',
                top: '3px',
                left: notifications ? '27px' : '3px',
                width: '20px',
                height: '20px',
                background: 'white',
                borderRadius: '50%',
                transition: 'left 0.3s ease'
              }} />
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '25px' }}>
          <div style={{ fontSize: '16px', marginBottom: '15px' }}>Поддержка</div>
          <div className="settings-option" style={{ cursor: 'pointer' }}>
            <span>Связаться с поддержкой</span>
            <span style={{ opacity: 0.7 }}>→</span>
          </div>
        </div>
      </div>
    </div>
  );
}
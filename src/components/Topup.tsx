import { useState } from 'react';

export default function Topup() {
  const [selectedAmount, setSelectedAmount] = useState<number>(10);
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');
  
  const amounts = [5, 10, 20, 50, 100];
  const currencies = [
    { id: 'USD', name: 'USD', symbol: '$' },
    { id: 'BTC', name: 'Bitcoin', symbol: '₿' },
    { id: 'ETH', name: 'Ethereum', symbol: 'Ξ' },
  ];

  return (
    <div className="page-content topup-page">
      <div className="topup-section">
        <h2 className="topup-title">Дополнить баланс</h2>
        
        <div style={{ marginBottom: '25px' }}>
          <div style={{ fontSize: '14px', opacity: 0.8, marginBottom: '10px' }}>
            Выберите сумму
          </div>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            marginBottom: '20px'
          }}>
            {amounts.map(amount => (
              <button
                key={amount}
                onClick={() => setSelectedAmount(amount)}
                style={{
                  flex: '1',
                  minWidth: '80px',
                  padding: '15px',
                  background: selectedAmount === amount 
                    ? 'linear-gradient(45deg, #6d5dfc, #43d4ff)'
                    : 'rgba(255,255,255,0.1)',
                  border: 'none',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '18px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                {amount}$
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '25px' }}>
          <div style={{ fontSize: '14px', opacity: 0.8, marginBottom: '10px' }}>
            Выберите валюту
          </div>
          <div>
            {currencies.map(currency => (
              <div
                key={currency.id}
                className={`currency-item ${selectedCurrency === currency.id ? 'active' : ''}`}
                onClick={() => setSelectedCurrency(currency.id)}
              >
                <span style={{ fontSize: '24px' }}>{currency.symbol}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '16px' }}>{currency.name}</div>
                  <div style={{ fontSize: '12px', opacity: 0.7 }}>{currency.id}</div>
                </div>
                {selectedCurrency === currency.id && (
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
        </div>

        <button
          className="balance__button button"
          style={{
            marginTop: '30px',
            fontSize: '18px',
            padding: '15px',
            background: 'linear-gradient(45deg, #6d5dfc, #43d4ff)'
          }}
        >
          Пополнить на {selectedAmount} {selectedCurrency}
        </button>
      </div>
    </div>
  );
}
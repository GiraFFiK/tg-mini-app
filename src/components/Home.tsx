import Balance from './Balance';

export default function Home() {
  return (
    <div className="page-content">
      <Balance />
      
      {/* <div className="container">
        <div className="balance__info" style={{ marginTop: '20px' }}>
          <h3 style={{ marginBottom: '15px', color: '#6d5dfc' }}>Последние операции</h3>
          
          <div style={{ width: '100%' }}>
            {[
              { time: '12:30', type: 'Пополнение', amount: '+10.00', currency: 'USD' },
              { time: '10:15', type: 'Перевод', amount: '-5.50', currency: 'USD' },
              { time: 'Вчера', type: 'Бонус', amount: '+2.00', currency: 'USD' },
            ].map((op, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 0',
                borderBottom: '1px solid rgba(255,255,255,0.1)'
              }}>
                <div>
                  <div style={{ fontSize: '16px' }}>{op.type}</div>
                  <div style={{ fontSize: '12px', opacity: 0.7 }}>{op.time}</div>
                </div>
                <div style={{
                  fontSize: '18px',
                  color: op.amount.startsWith('+') ? '#43d4ff' : '#ff6b6b'
                }}>
                  {op.amount} {op.currency}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div> */}
    </div>
  );
}
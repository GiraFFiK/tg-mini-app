// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'

export default function App() {
  const tg = window.Telegram?.WebApp;
  const user = tg?.initDataUnsafe?.user;

  return (
    <div>
      <h1>VPN APP</h1>

      <pre>{JSON.stringify(user, null, 2)}</pre>

      <p>{user?.first_name}</p>
    </div>
  );
}


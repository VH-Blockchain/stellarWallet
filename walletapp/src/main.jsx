import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import CreateWallet from './pages/CreateWallet.jsx';
import Faucet from './pages/Faucet.jsx';
import SendTransaction from './pages/SendTransaction.jsx';
import ReceiveTransaction from './pages/ReceiveTransaction.jsx';
import Deposit from './pages/Deposit.jsx';
import Withdraw from './pages/Withdraw.jsx';  
import CreateToken from './pages/CreateToken.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="" element={<CreateWallet />} />
      <Route path="faucet" element={<Faucet />} />
      <Route path="createToken" element={<CreateToken />} />
      <Route path="sendTransaction" element={<SendTransaction />} />
      <Route path="receiveTransaction" element={<ReceiveTransaction />} />
      <Route path="deposit" element={<Deposit />} />
      <Route path="withdraw" element={<Withdraw />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)

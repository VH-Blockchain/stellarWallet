import  { useState } from 'react';
import * as StellarSdk from "@stellar/stellar-sdk";
import * as StellarUri from '@stellarguard/stellar-uri';
import QRCode from 'qrcode.react';

const ReceiveTransaction = () => {
  const [qrCodeData, setQrCodeData] = useState('');
  const [amount, setAmount] = useState('');

  const generateQrCode = () => {
    const server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');
    console.log(server);
    const destination = localStorage.getItem('publickey');
    const paymentTransaction = new StellarSdk.TransactionBuilder(
      new StellarSdk.Account(destination, '-1'), 
      {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: StellarSdk.Networks.TESTNET,
      }
    )
      .addOperation(
        StellarSdk.Operation.payment({
          destination,
          asset: StellarSdk.Asset.native(),
          amount,
        })
      )
      .setTimeout(30)
      .build();
    const paymentUri = StellarUri.TransactionStellarUri.forTransaction(paymentTransaction);
    setQrCodeData(paymentUri.toString());
  };
  return (
    <div>
      <h2>Generate XLM Payment QR Code</h2>
      <input
        type="text"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={generateQrCode}>Generate QR Code</button>
      {qrCodeData && (
        <div>
          <QRCode value={qrCodeData} size={256} />
          <p>{qrCodeData}</p>
        </div>
      )}
    </div>
  )
}

export default ReceiveTransaction
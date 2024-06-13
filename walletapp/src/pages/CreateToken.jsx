import { useState } from "react";
import * as StellarSdk from "@stellar/stellar-sdk";

const CreateToken = () => {
  const [issuerKeyPair, setIssuerKeyPair] = useState();
  const [distributorKeyPair, setDistributorKeyPair] = useState();
  const [message, setMessage] = useState("");

  const generateKeypair = () => {
    const issuerKeys = StellarSdk.Keypair.random();
    const distributorKeys = StellarSdk.Keypair.random();
    setIssuerKeyPair(issuerKeys);
    setDistributorKeyPair(distributorKeys);
  };

  const fundIssuerAccount = async () => {
    try {
      const response = await fetch(
        `https://friendbot.stellar.org?addr=${issuerKeyPair.publicKey()}`
      );
      const data = await response.json();
      setMessage(
        `Funded issuer account with test XLM: ${JSON.stringify(data)}`
      );
      const responseDistributer = await fetch(
        `https://friendbot.stellar.org?addr=${distributorKeyPair.publicKey()}`
      );
      const data1 = await responseDistributer.json();
      setMessage(
        `Funded issuer account with test XLM: ${JSON.stringify(data1)}`
      );
    } catch (error) {
      console.error("Error funding issuer account:", error);
      setMessage(`Error funding issuer account: ${error.message}`);
    }
  };

  const createTrustline = async () => {
    try {
      const server = new StellarSdk.Horizon.Server(
        "https://horizon-testnet.stellar.org"
      );
      // StellarSdk.Network.useTestNetwork();
      const account = await server.loadAccount(distributorKeyPair.publicKey());
      console.log(account, "account");
      const transaction = new StellarSdk.TransactionBuilder(account, {
        fee: (await server.fetchBaseFee()).toString(),
        networkPassphrase: StellarSdk.Networks.TESTNET,
      })
        .addOperation(
          StellarSdk.Operation.changeTrust({
            asset: new StellarSdk.Asset(
              "Ankit",
              issuerKeyPair.publicKey()
            ),
          })
        )
        .setTimeout(30)
        .build();
      console.log(transaction, "transaction");
      transaction.sign(distributorKeyPair);
      const result = await server.submitTransaction(transaction);
      console.log(result);
      setMessage(
        `Trustline created for TOKEN_CODE on account ${distributorKeyPair.publicKey()}`
      );
    } catch (error) {
      console.error("Error creating trustline:", error);
      if (error.response && error.response.data && error.response.data.extras) {
        setMessage(
          `Error creating trustline: ${error.response.data.extras.result_codes}`
        );
      } else {
        setMessage("Error creating trustline: An unexpected error occurred.");
      }
    }
  };

  const issueTokens = async () => {
    try {
      const server = new StellarSdk.Horizon.Server(
        "https://horizon-testnet.stellar.org"
      );
      const issuerAccount = await server.loadAccount(issuerKeyPair.publicKey());
      const transaction = new StellarSdk.TransactionBuilder(issuerAccount, {
        fee: (await server.fetchBaseFee()).toString(),
        networkPassphrase: StellarSdk.Networks.TESTNET,
      })
        .addOperation(
          StellarSdk.Operation.payment({
            destination: distributorKeyPair.publicKey(),
            asset: new StellarSdk.Asset(
              "Ankit",
              issuerKeyPair.publicKey()
            ),
            amount: "1000",
          })
        )
        .setTimeout(30)
        .build();

      transaction.sign(issuerKeyPair);
      const result = await server.submitTransaction(transaction);
      console.log(result);
      setMessage(
        `Issued 1000 TOKEN_CODE tokens to ${distributorKeyPair.publicKey()}`
      );
    } catch (error) {
      console.error(
        "Error issuing tokens:",
        error.response.data.extras.result_codes
      );
      setMessage(
        `Error issuing tokens: ${error.response.data.extras.result_codes}`
      );
    }
  };

  return (
    <div>
      <h2>Create and Issue Custom Token</h2>
      <button onClick={generateKeypair}>Generate Keypairs</button>
      <p>Issuer Public Key: {issuerKeyPair?.publicKey()}</p>
      <p>Distributor Public Key: {distributorKeyPair?.publicKey()}</p>
      <button onClick={fundIssuerAccount} disabled={!issuerKeyPair}>
        Fund Issuer Account
      </button>
      <button onClick={createTrustline} disabled={!distributorKeyPair}>
        Create Trustline
      </button>
      <button
        onClick={issueTokens}
        disabled={!issuerKeyPair || !distributorKeyPair}
      >
        Issue Tokens
      </button>
      <p>{message}</p>
    </div>
  );
};

export default CreateToken;
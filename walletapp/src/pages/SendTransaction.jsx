import { useEffect, useState } from "react";
import * as StellarSdk from "@stellar/stellar-sdk";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { CardHeader, TextField } from "@mui/material";

const SendTransaction = () => {
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState("");

  const checkBalance = async () => {
    try {
      const server = new StellarSdk.Horizon.Server(
        "https://horizon-testnet.stellar.org",
      );
      const account = await server.loadAccount(localStorage.getItem('publickey'));
      console.log("Balances for account: " + localStorage.getItem('publickey'));
      account.balances.forEach(function (balance) {
        console.log(balance.asset_type === "native");
        if (balance.asset_type === "native") {
          setBalance(balance.balance);
        }
        console.log("Type:", balance.asset_type, ", Balance:", balance.balance);
      }
    )} catch (error) {
      console.log(error);
    } 
  }

  useEffect(() => {
    checkBalance();
  }, []);

  const sendTransaction = async () => {
    var server = new StellarSdk.Horizon.Server(
      "https://horizon-testnet.stellar.org",
    );
    var sourceKeys = StellarSdk.Keypair.fromSecret(
      localStorage.getItem('secret'),
    );
    var destinationId = toAddress;
    var transaction;
    server
      .loadAccount(destinationId)
      .catch(function (error) {
        if (error instanceof StellarSdk.NotFoundError) {
          throw new Error("The destination account does not exist!");
        } else return error;
      })
      .then(function () {
        return server.loadAccount(sourceKeys.publicKey());
      })
      .then(function (sourceAccount) {
        transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
          fee: StellarSdk.BASE_FEE,
          networkPassphrase: StellarSdk.Networks.TESTNET,
        })
          .addOperation(
            StellarSdk.Operation.payment({
              destination: destinationId,
              asset: StellarSdk.Asset.native(),
              amount: amount,
            }),
          )
          .addMemo(StellarSdk.Memo.text("Test Transaction"))
          .setTimeout(180)
          .build();
        transaction.sign(sourceKeys);
        return server.submitTransaction(transaction);
      })
      .then(function (result) {
        console.log("Success! Results:", result);
      })
      .catch(function (error) {
        console.error("Something went wrong!", error);
      })
  }
  return (
    <Card sx={{ minWidth: 400 }} >
      <CardHeader title="Send XLM" />
      <Typography > Balance : {balance}</Typography>
      <Typography sx={{ borderBottom: 1 }}></Typography>
      <CardContent>
        <Typography  sx={{mb:1}}>
          Enter the address of the recipient:
        </Typography>
        <TextField onChange={(e) => setToAddress(e.target.value)} label="Address" name="address" sx={{width:"80%",mb:4}} />
        <Typography  sx={{mb:1}} > 
          Enter the amount you want to send:
        </Typography>
        <TextField type="number" onChange={(e) => setAmount(e.target.value)} label="Amount" name="amount" sx={{width:"80%",mb:4}} />
      </CardContent>
      <CardActions
        sx={{ borderTop: 1, display: "flex", justifyContent: "center" }}
      >
        <Button onClick={sendTransaction} size="small">
          Send XLM
        </Button>
      </CardActions>
    </Card>
  )
}

export default SendTransaction
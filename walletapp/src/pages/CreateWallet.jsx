import { useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { CardHeader } from "@mui/material";
import * as StellarSdk from "@stellar/stellar-sdk";
// import axios from "axios";

const CreateWallet = () => {
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const [pair, setPair] = useState({
    secret: "",
    publicKey: "",
  });

  const createWallet = async () => {
    const pair = StellarSdk.Keypair.random();
    setPair({
      secret: pair.secret(),
      publicKey: pair.publicKey(),
    })
    localStorage.setItem('secret', pair.secret());
    localStorage.setItem('publickey', pair.publicKey());

    // const response = await axios.post("http://localhost:5000/create", {
    //   email: email,
    //   password: password,
    // });
    // setPair({
    //   secret: response.data.secreteKey,
    //   publicKey: response.data.publicKey,
    // });
  };

  return (
    <Card sx={{ minWidth: 500 }}>
      <CardHeader title="Create Wallet" />
      <Typography sx={{ borderBottom: 1 }}></Typography>
      <CardContent>
        {/* <TextField onChange={(e) => setEmail(e.target.value)} label="Email" name="email" />
        <TextField onChange={(e) => setPassword(e.target.value)} label="Password" name="password" /> */}
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Public Key : {pair.publicKey}
        </Typography>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Private Key : {pair.secret}
        </Typography>
      </CardContent>
      <CardActions
        sx={{ borderTop: 1, display: "flex", justifyContent: "center" }}
      >
        <Button onClick={createWallet} size="small">
          Create Wallet
        </Button>
      </CardActions>
    </Card>
  );
};

export default CreateWallet;

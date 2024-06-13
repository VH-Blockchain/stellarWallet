import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { CardHeader, TextField } from "@mui/material";

const Faucet = () => {
  const [flag, setFlag] = useState(false);
  const [toAddress, setToAddress] = useState("");
  const [message, setMessage] = useState("");

  const transferToken = async () => {
    const address  = localStorage.getItem('publickey');
    
    try {
      await fetch(
        `https://friendbot.stellar.org?addr=${encodeURIComponent(address)}`
      );
      setFlag(true);
      setMessage("SuccessFully Received 10,000 XLM");
    } catch (e) {
      console.error("ERROR!", e);
    }
  };

  useEffect(() => {
    const address  = localStorage.getItem('publickey');
    setToAddress(address);
  }, []);

  return (
    <Card sx={{ minWidth: 400 }}>
      <CardHeader title="Stellar Faucet" />
      <Typography sx={{ borderBottom: 1 }}></Typography>
      <CardContent>
        <TextField
          value = {toAddress}
          onChange={(e) => setToAddress(e.target.value)}
          label="Address"
          name="address"
          sx={{ width: "80%" }}
        />
      </CardContent>
      {flag && <Typography sx={{ fontSize: 14, color: "green" }}>{message}</Typography>}
      <CardActions
        sx={{ borderTop: 1, display: "flex", justifyContent: "center" }}
      >
        <Button onClick={transferToken} size="small">
          Get XLM
        </Button>
      </CardActions>
    </Card>
  );
};

export default Faucet;

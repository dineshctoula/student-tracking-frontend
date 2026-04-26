import { useState } from "react";
import API from "../api/axios";
import { TextField, Button, Paper, Typography } from "@mui/material";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });
      console.log(res)

      localStorage.setItem("token", res.data.token);
      window.location.href = "/dashboard";
    } catch (err) {
      alert("Invalid login");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 120 }}>
      <Paper sx={{ p: 4, width: 350 }}>
        <Typography variant="h5" mb={2}>
          Admin Login
        </Typography>

        <TextField
          fullWidth
          label="Email"
          sx={{ mb: 2 }}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          fullWidth
          label="Password"
          type="password"
          sx={{ mb: 2 }}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button fullWidth variant="contained" onClick={handleLogin}>
          Login
        </Button>
      </Paper>
    </div>
  );
}
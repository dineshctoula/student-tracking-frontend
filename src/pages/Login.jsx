import { useState } from "react";
import API from "../api/axios";
import {
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);
      const res = await API.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      window.location.href = "/dashboard";
    } catch (err) {
      alert("Invalid login");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Allow Enter key login
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>

      {/* 🔷 LEFT SIDE */}
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "#fff",
          background: "linear-gradient(135deg, #6a11cb, #2575fc)",
          p: 6,
          textAlign: "center",
        }}
      >
        <Box
          component="img"
          src="/logo.jpeg"
          alt="Marigold Logo"
          sx={{ width: 110, mb: 3 }}
        />

        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Marigold
        </Typography>

        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          Student Tracking Software
        </Typography>

        <Typography
          variant="body2"
          sx={{ mt: 3, maxWidth: 320, opacity: 0.85 }}
        >
          Manage students, monitor progress, and simplify academic workflows —
          all in one place.
        </Typography>
      </Box>

      {/* 🔷 RIGHT SIDE */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f1f5f9",
        }}
      >
        <Paper
          elevation={8}
          sx={{
            p: 5,
            width: 380,
            borderRadius: 4,
          }}
        >
          <Typography variant="h5" fontWeight="bold" mb={1}>
            Welcome Back 👋
          </Typography>

          <Typography variant="body2" mb={3} color="text.secondary">
            Please login to continue
          </Typography>

          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            sx={{ mb: 2 }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyPress}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            sx={{ mb: 3 }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyPress}
          />

          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleLogin}
            disabled={loading}
            sx={{
              py: 1.3,
              fontWeight: "bold",
              borderRadius: 2,
              background: "linear-gradient(135deg, #6a11cb, #2575fc)",
              textTransform: "none",
              fontSize: 16,
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Login"
            )}
          </Button>

          {/* 🔻 FOOTER */}
          <Typography
            variant="body2"
            align="center"
            sx={{
              mt: 4,
              color: "text.secondary",
              fontSize: 13,
            }}
          >
            ©  
            Developed by Sagar Luitel,  Dinesh Sitoula, & Dipak Sitoula.
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}
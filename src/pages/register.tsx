import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Label = styled(Typography)({
  fontWeight: 500,
});

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem("admin") || "{}");
    if (admin.token) {
      router.push("/");
    }
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/register", {
        username,
        password,
        repassword,
      });

      if (response.data.metadata.status === 200) {
        localStorage.setItem("admin", response.data.response);
        router.push("/");
      } else {
        setError(response.data.metadata.message);
      }
    } catch (error) {
      alert("An error occurred during register");
    }
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const disableLoginButton = () => {
    if (!username || !password || !repassword || error) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <>
      <Head>
        <title>Register</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "auto",
          backgroundColor: "white",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "24px",
            width: "100%",
            maxWidth: "300px",
          }}
        >
          <img src="./logo-nexa.png" style={{ width: "40%" }} />
          <Box sx={{ width: "100%" }}>
            <Label>Username</Label>
            <TextField
              id="outlined-basic"
              variant="outlined"
              onChange={(e) => {
                setUsername(e.target.value);
                setError("");
              }}
              required
              fullWidth
            />
          </Box>
          <Box sx={{ width: "100%" }}>
            <Label>Password</Label>
            <TextField
              id="outlined-basic"
              type={showPassword ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              fullWidth
            />
          </Box>
          <Box sx={{ width: "100%" }}>
            <Label>Confirm Password</Label>
            <TextField
              id="outlined-basic"
              type={showPassword ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              onChange={(e) => {
                setRepassword(e.target.value);
                setError("");
              }}
              fullWidth
            />
          </Box>
          {error && (
            <Alert
              variant="filled"
              severity="error"
              sx={{ width: "100%", borderRadius: "8px" }}
            >
              {error}
            </Alert>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={handleRegister}
            disableElevation
            sx={{
              width: "100%",
              borderRadius: "8px",
              padding: "8px",
              fontSize: "16px",
              fontWeigth: 500,
            }}
            disabled={disableLoginButton()}
          >
            Sign Up
          </Button>
          <Typography>
            Already have an Account?{" "}
            <span
              style={{
                color: "#1a52d9",
                fontWeight: 500,
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => router.push("/login")}
            >
              Sign in
            </span>
          </Typography>
        </Box>
      </Box>
    </>
  );
}

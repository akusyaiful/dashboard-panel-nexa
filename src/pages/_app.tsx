import "@/styles/globals.css";
import * as React from "react";
import { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "../theme";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  React.useEffect(() => {
    const admin = JSON.parse(localStorage.getItem("admin") || "{}");
    if (!admin.token) {
      router.push("/login");
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Component {...pageProps} />{" "}
    </ThemeProvider>
  );
}

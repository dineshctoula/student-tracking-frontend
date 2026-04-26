import { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      {/* pass toggle to pages via props or context */}
      <AppRoutes darkMode={darkMode} setDarkMode={setDarkMode} />
    </ThemeProvider>
  );
}
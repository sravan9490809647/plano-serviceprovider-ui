import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./theme"; // Adjust the import path as necessary
import AppRouter from "./routes/AppRouter";
import { Provider } from "react-redux";
import store from "./redux/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../assets/fonts/fonts.css"; // Import custom fonts

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppRouter />
        <ToastContainer position="top-right" autoClose={3000} />
      </ThemeProvider>
    </Provider>
  );
}

export default App;

import { BrowserRouter as Router, Redirect, Route } from "react-router-dom";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import { lightBlue, teal } from "@material-ui/core/colors";
import Dashboard from "./components/Dashboard";
import React from "react";
import LoginPage from "./components/LoginPage";

const theme = createMuiTheme({
  palette: {
    primary: { main: teal[600] },
    secondary: { main: lightBlue[300] },
  },
});

function App() {
  const [token, setToken] = React.useState("");
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Route
          exact
          path="/"
          render={() =>
            token == "" ? <Redirect to="/login" /> : <Dashboard />
          }
        />
        <Route
          path="/login"
          render={() => <LoginPage token={token} setToken={setToken} />}
        />
      </Router>
    </ThemeProvider>
  );
}

export default App;

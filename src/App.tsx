import { BrowserRouter as Router, Redirect, Route } from "react-router-dom";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import { lightBlue, teal } from "@material-ui/core/colors";
import Routes from "./components/Routes";
import React from "react";
import LoginPage from "./components/LoginPage";

const theme = createMuiTheme({
  palette: {
    primary: { main: teal[600] },
    secondary: { main: lightBlue[300] },
  },
  typography: {
    h1: { fontSize: "4rem" },
  },
});

function App() {
  const [token, setToken] = React.useState("");
  const [userId, setUserId] = React.useState(0);
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Route
          path="/login"
          render={() => (
            <LoginPage
              token={token}
              setToken={setToken}
              userId={userId}
              setUserId={setUserId}
            />
          )}
        />
        <Route
          render={() =>
            token === "" || userId === 0 ? (
              <Redirect to="/login" />
            ) : (
              <Routes token={token} setToken={setToken} userId={userId} />
            )
          }
        />
      </Router>
    </ThemeProvider>
  );
}

export default App;

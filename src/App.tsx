import { BrowserRouter as Router, Redirect, Route } from "react-router-dom";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import { lightBlue, teal } from "@material-ui/core/colors";
import Routes from "./components/Routes";
import React from "react";
import LoginPage from "./components/LoginPage";
import { User } from "./user";

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
  const [user, setUser] = React.useState({} as User);
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Route
          path="/login"
          render={() => (
            <LoginPage
              token={token}
              setToken={setToken}
              user={user}
              setUser={setUser}
            />
          )}
        />
        <Route
          render={() =>
            token === "" || user.id === 0 ? (
              <Redirect to="/login" />
            ) : (
              <Routes token={token} setToken={setToken} user={user} />
            )
          }
        />
      </Router>
    </ThemeProvider>
  );
}

export default App;

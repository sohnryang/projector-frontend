import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import { blue, cyan } from "@material-ui/core/colors";
import MainAppBar from "./components/MainAppBar";

const theme = createMuiTheme({
  palette: { primary: { main: blue[700] }, secondary: { main: cyan[600] } },
});

function App() {
  return (
    <div>
      <ThemeProvider theme={theme}>
        <MainAppBar></MainAppBar>
      </ThemeProvider>
    </div>
  );
}

export default App;

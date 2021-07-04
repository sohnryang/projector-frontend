import {
  AppBar,
  Button,
  createStyles,
  makeStyles,
  Theme,
  Toolbar,
  Typography,
} from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: { display: "flex", flexGrow: 1 },
    toolbar: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    title: { flexGrow: 1 },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
  })
);

export default function MainAppBar() {
  const classes = useStyles();

  return (
    <>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Projector
          </Typography>
          <Button color="inherit">Logout</Button>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </>
  );
}

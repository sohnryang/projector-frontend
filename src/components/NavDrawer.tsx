import { createStyles, makeStyles, Theme, useTheme } from "@material-ui/core";

const drawerWidth = 240;
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: { display: "flex" },
    menuButton: { marginRight: 30 },
    hide: { display: "none" },
    drawer: { width: drawerWidth, flexShrink: 0, whiteSpace: "nowrap" },
  })
);

export default function NavDrawer() {
  const classes = useStyles();
  const theme = useTheme();
}

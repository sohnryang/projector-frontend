import {
  Button,
  createStyles,
  FormControl,
  FormControlLabel,
  Input,
  InputLabel,
  makeStyles,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Theme,
} from "@material-ui/core";
import axios from "axios";
import PropType, { InferProps } from "prop-types";
import React from "react";
import { useHistory } from "react-router-dom";
import MainAppBar from "./MainAppBar";
import { User } from "../user";
import { Project } from "../project";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      flexGrow: 1,
      padding: theme.spacing(2),
    },
    formContainer: {
      display: "flex",
      flexFlow: "column",
    },
    rowContainer: {
      display: "flex",
      flexFlow: "row",
    },
    formControl: {
      margin: theme.spacing(1),
    },
  })
);

export default function ImportPostView({
  token,
  setToken,
  user,
}: InferProps<typeof ImportPostView.propTypes>) {
  const classes = useStyles();
  const [hanaUsername, setHanaUsername] = React.useState("");
  const [hanaPassword, setHanaPassword] = React.useState("");
  const [postUrl, setPostUrl] = React.useState("");
  const [postType, setPostType] = React.useState("regular_post");
  const [projectId, setProjectId] = React.useState(0);
  const [availableProjects, setAvailableProjects] = React.useState(
    [] as Project[]
  );
  React.useEffect(() => {
    async function getAvailableProjects() {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URI}/project/filter-by-user/${
          (user as User).id
        }`,
        {},
        { headers: { Authorization: token } }
      );
      setAvailableProjects(
        res.data.map((responseItem: any) => {
          return {
            id: responseItem["project_id"],
            name: responseItem["name"],
            description: responseItem["description"],
            adminName: responseItem["admin_name"],
            memberNames: responseItem["member_names"],
          };
        })
      );
    }
    getAvailableProjects();
  }, [token, user]);
  const { push } = useHistory();
  const isImportAvailable = () => {
    return (
      hanaUsername !== "" &&
      hanaPassword !== "" &&
      postUrl.match(/bbs_idx=\d+/) !== null
    );
  };
  const handleImport = () => {
    if (postType === "cardnews") {
      alert("????????? ?????? ???????????? ???????????????.");
      return;
    }
    const postId = parseInt(postUrl.match(/bbs_idx=\d+/)![0].match(/\d+/)![0]);
    axios
      .post(
        `${process.env.REACT_APP_API_URI}/post/import/${postId}`,
        {
          hana_username: hanaUsername,
          hana_password: hanaPassword,
          project_id: projectId,
        },
        { headers: { Authorization: token } }
      )
      .catch((err) => {
        if (err.response.status === 401) alert("???????????? ?????? ?????? ??????");
        else if (err.response.status === 403)
          alert("????????? ????????? ???????????? ????????? ??? ????????????.");
        return;
      })
      .then(() => push("/"));
  };
  return (
    <>
      <MainAppBar setToken={setToken} />
      <main className={classes.content}>
        <div className={classes.formContainer}>
          <form className={classes.rowContainer} autoComplete="off">
            <label htmlFor="hanaUsername" className={classes.formControl}>
              ???????????? ?????????
            </label>
            <Input
              className={classes.formControl}
              id="hanaUsername"
              placeholder="????????? ??????"
              value={hanaUsername}
              style={{ flexGrow: 1, flexShrink: 1 }}
              onChange={(event) => setHanaUsername(event.target.value)}
            />
            <label htmlFor="hanaPassword" className={classes.formControl}>
              ???????????? ????????????
            </label>
            <Input
              className={classes.formControl}
              id="hanaPassword"
              placeholder="???????????? ??????"
              value={hanaPassword}
              type="password"
              style={{ flexGrow: 1, flexShrink: 1 }}
              onChange={(event) => setHanaPassword(event.target.value)}
            />
          </form>
          <form className={classes.rowContainer} autoComplete="off">
            <label htmlFor="postUrl" className={classes.formControl}>
              ???????????? ????????? ??????
            </label>
            <Input
              className={classes.formControl}
              id="postUrl"
              placeholder="?????? ??????"
              value={postUrl}
              style={{ flexGrow: 1, flexShrink: 1 }}
              onChange={(event) => setPostUrl(event.target.value)}
            />
          </form>
          <FormControl component="fieldset">
            <RadioGroup
              row
              aria-label="post type"
              name="postType"
              defaultValue="regular_post"
              value={postType}
              onChange={(event) => setPostType(event.target.value)}
            >
              <FormControlLabel
                value="regular_post"
                control={<Radio color="secondary" />}
                label="?????? ?????????"
                labelPlacement="end"
                className={classes.formControl}
              />
              <FormControlLabel
                value="cardnews"
                control={<Radio color="secondary" />}
                label="????????????"
                labelPlacement="end"
                className={classes.formControl}
              />
            </RadioGroup>
            <FormControl className={classes.formControl}>
              <InputLabel id="project-select-label">????????????</InputLabel>
              <Select
                labelId="project-select-label"
                value={projectId}
                onChange={(event) => setProjectId(event.target.value as number)}
              >
                {availableProjects.map((project) => (
                  <MenuItem value={project.id}>{project.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </FormControl>
          <div className={classes.rowContainer}>
            <Button
              className={classes.formControl}
              variant="contained"
              color="secondary"
              style={{ flexGrow: 0, flexShrink: 0 }}
              onClick={() => handleImport()}
              disabled={!isImportAvailable()}
            >
              ????????????
            </Button>
            <Button
              className={classes.formControl}
              variant="contained"
              style={{ flexGrow: 0, flexShrink: 0 }}
              onClick={() => push("/")}
            >
              ??????
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}

ImportPostView.propTypes = {
  token: PropType.string.isRequired,
  setToken: PropType.func.isRequired,
  user: PropType.object.isRequired,
};

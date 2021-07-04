import {
  Button,
  createStyles,
  FormControl,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  TextField,
  Theme,
} from "@material-ui/core";
import MainAppBar from "./MainAppBar";
import ReactMde from "react-mde";
import "react-mde/lib/styles/css/react-mde-all.css";
import PropTypes, { InferProps } from "prop-types";
import React, { useEffect } from "react";
import { Project } from "../project";
import axios from "axios";
import { useHistory } from "react-router-dom";
import marked from "marked";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      flexGrow: 1,
      padding: theme.spacing(2),
    },
    formContainer: {
      display: "flex",
      flexFlow: "row",
    },
    formControl: {
      margin: theme.spacing(1),
    },
  })
);

export default function EditorView({
  token,
  userId,
}: InferProps<typeof EditorView.propTypes>) {
  const classes = useStyles();
  const [projectId, setProjectId] = React.useState(0);
  const [availableProjects, setAvailableProjects] = React.useState(
    [] as Project[]
  );
  useEffect(() => {
    async function getAvailableProjects() {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URI}/project/filter-by-user/${userId}`,
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
  }, [token, userId]);
  const handleProjectChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setProjectId(event.target.value as number);
  };
  const { push } = useHistory();
  const [title, setTitle] = React.useState("");
  const handleTitleChange = (event: React.ChangeEvent<{ value: string }>) => {
    setTitle(event.target.value);
  };
  const [content, setContent] = React.useState("");
  const [selectedTab, setSelectedTab] = React.useState<"write" | "preview">(
    "write"
  );
  const handlePostButton = () => {
    axios.post(
      `${process.env.REACT_APP_API_URI}/post/create`,
      {
        title: title,
        content: content,
        projectid: projectId,
      },
      { headers: { Authorization: token } }
    );
    push("/");
  };
  return (
    <>
      <MainAppBar />
      <main className={classes.content}>
        <div className={classes.formContainer}>
          <TextField
            className={classes.formControl}
            label="Title"
            variant="filled"
            value={title}
            onChange={handleTitleChange}
            style={{ flexGrow: 1, flexShrink: 1 }}
          />
          <FormControl
            variant="filled"
            className={classes.formControl}
            style={{ minWidth: 240 }}
          >
            <InputLabel id="project-select-label">Project</InputLabel>
            <Select
              labelId="project-select-label"
              id="project-select"
              value={projectId}
              onChange={handleProjectChange}
            >
              {availableProjects.map((project) => (
                <MenuItem value={project.id}>{project.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className={classes.formControl}>
          <ReactMde
            minEditorHeight={60}
            heightUnits="vh"
            value={content}
            onChange={setContent}
            selectedTab={selectedTab}
            onTabChange={setSelectedTab}
            generateMarkdownPreview={(markdown) =>
              Promise.resolve(marked(markdown))
            }
          />
        </div>
        <Button
          className={classes.formControl}
          variant="contained"
          color="secondary"
          onClick={handlePostButton}
        >
          Post
        </Button>
        <Button
          className={classes.formControl}
          variant="contained"
          onClick={() => push("/")}
        >
          Cancel
        </Button>
      </main>
    </>
  );
}

EditorView.propTypes = {
  token: PropTypes.string.isRequired,
  userId: PropTypes.number.isRequired,
};

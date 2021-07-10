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
import { useHistory, useParams } from "react-router-dom";
import marked from "marked";
import xss from "xss";
import { User } from "../user";

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

interface ParamTypes {
  postId: string;
}

export default function EditorView({
  token,
  setToken,
  user,
}: InferProps<typeof EditorView.propTypes>) {
  const classes = useStyles();
  const [projectId, setProjectId] = React.useState(0);
  const [availableProjects, setAvailableProjects] = React.useState(
    [] as Project[]
  );
  useEffect(() => {
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
  const { postId } = useParams<ParamTypes>();
  useEffect(() => {
    if (postId === undefined) return;
    async function getPostData() {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URI}/post/get/${postId}`,
        { headers: { Authorization: token } }
      );
      setContent(res.data["content"]);
      setTitle(xss(res.data["title"]));
      setProjectId(res.data["project_id"]);
    }
    getPostData();
  }, [token, postId]);
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
    if (postId === undefined) {
      axios
        .post(
          `${process.env.REACT_APP_API_URI}/post/create`,
          {
            title: title,
            content: content,
            projectid: projectId,
          },
          { headers: { Authorization: token } }
        )
        .then(() => push("/"));
    } else {
      axios
        .put(
          `${process.env.REACT_APP_API_URI}/post/edit/${postId}`,
          { title: title, content: content },
          { headers: { Authorization: token } }
        )
        .then(() => push("/"));
    }
  };
  return (
    <>
      <MainAppBar setToken={setToken} />
      <main className={classes.content}>
        <div className={classes.formContainer}>
          <TextField
            className={classes.formControl}
            label="제목"
            variant="filled"
            value={title}
            onChange={handleTitleChange}
            style={{ flexGrow: 1, flexShrink: 1 }}
          />
          <FormControl
            variant="filled"
            className={classes.formControl}
            style={{ minWidth: 240 }}
            disabled={postId !== undefined}
          >
            <InputLabel id="project-select-label">프로젝트</InputLabel>
            <Select
              labelId="project-select-label"
              id="project-select"
              value={projectId}
              onChange={handleProjectChange}
            >
              {availableProjects.map((project) => (
                <MenuItem value={project.id} key={project.id}>
                  {project.name}
                </MenuItem>
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
          disabled={content === "" || title === "" || projectId === 0}
        >
          게시
        </Button>
        <Button
          className={classes.formControl}
          variant="contained"
          onClick={() => push("/")}
        >
          취소
        </Button>
      </main>
    </>
  );
}

EditorView.propTypes = {
  token: PropTypes.string.isRequired,
  setToken: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

import {
  Button,
  createStyles,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import MainAppBar from "./MainAppBar";
import PropTypes, { InferProps } from "prop-types";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { Post } from "../post";
import xss from "xss";
import marked from "marked";
import { User } from "../user";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      flexGrow: 1,
      padding: theme.spacing(2),
    },
    formControl: {
      margin: theme.spacing(1),
    },
  })
);

interface ParamTypes {
  postId: string;
}

export default function PostView({
  token,
  setToken,
  user,
}: InferProps<typeof PostView.propTypes>) {
  const classes = useStyles();
  const { postId } = useParams<ParamTypes>();
  const id: number = +postId;
  const [post, setPost] = useState({} as Post);
  useEffect(() => {
    async function getPost() {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URI}/post/get/${id}`,
        { headers: { Authorization: token } }
      );
      setPost({
        id: id,
        title: xss(res.data["title"]),
        projectName: xss(res.data["project_name"]),
        authorId: +res.data["author_id"],
        authorName: xss(res.data["author_name"]),
        creationDate: xss(res.data["creation_date"]),
        content: res.data["content"],
      });
    }
    getPost();
  }, [token, id]);
  const { push } = useHistory();
  return (
    <>
      <MainAppBar setToken={setToken} />
      <main className={classes.content}>
        <Typography variant="h1">{post.title}</Typography>
        <Typography variant="subtitle1">
          {post.projectName} | {post.authorName} | {post.creationDate}
        </Typography>
        <div
          dangerouslySetInnerHTML={{
            __html: xss(marked(post.content === undefined ? "" : post.content)),
          }}
        ></div>
        <Button
          className={classes.formControl}
          variant="contained"
          onClick={() => push("/")}
        >
          ???????????? ????????????
        </Button>
        {post.authorId === (user as User).id ? (
          <Button
            className={classes.formControl}
            variant="contained"
            color="secondary"
            onClick={() => push(`/edit/${post.id}`)}
          >
            ??????
          </Button>
        ) : null}
      </main>
    </>
  );
}

PostView.propTypes = {
  token: PropTypes.string.isRequired,
  setToken: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      flexGrow: 1,
      padding: theme.spacing(2),
    },
  })
);

interface ParamTypes {
  postId: string;
}

export default function PostView({
  token,
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
        authorId: res.data["author_id"],
        authorName: xss(res.data["author_name"]),
        creationDate: xss(res.data["creation_date"]),
        content: xss(res.data["content"]),
      });
    }
    getPost();
  }, [token, id]);
  const { push } = useHistory();
  return (
    <>
      <MainAppBar />
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
        <Button variant="contained" onClick={() => push("/")}>
          목록으로 돌아가기
        </Button>
      </main>
    </>
  );
}

PostView.propTypes = {
  token: PropTypes.string.isRequired,
};

import { createStyles, makeStyles, Theme, Typography } from "@material-ui/core";
import MainAppBar from "./MainAppBar";
import PropTypes, { InferProps } from "prop-types";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { Post } from "../post";
import xss from "xss";

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
        authorName: xss(res.data["author_name"]),
        creationDate: xss(res.data["creation_date"]),
        content: xss(res.data["content"]),
      });
    }
    getPost();
  }, [token, id]);
  return (
    <>
      <MainAppBar />
      <main className={classes.content}>
        <Typography variant="h1">{post.title}</Typography>
        <Typography variant="subtitle1">
          {post.projectName} | {post.authorName} | {post.creationDate}
        </Typography>
        <Typography variant="body1">{post.content}</Typography>
      </main>
    </>
  );
}

PostView.propTypes = {
  token: PropTypes.string.isRequired,
};

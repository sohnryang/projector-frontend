import {
  createStyles,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Theme,
} from "@material-ui/core";
import PropTypes, { InferProps } from "prop-types";
import MainAppBar from "./MainAppBar";
import { Post } from "../post";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      flexGrow: 1,
      padding: theme.spacing(2),
    },
  })
);

interface HeadCell {
  id: keyof Post;
  label: String;
}

const headCells: HeadCell[] = [
  { id: "title", label: "제목" },
  { id: "projectName", label: "프로젝트" },
  { id: "authorName", label: "작성자" },
  { id: "creationDate", label: "작성일" },
];

export default function PostList({
  token,
}: InferProps<typeof PostList.propTypes>) {
  const [postList, setPostList] = useState([] as Post[]);
  useEffect(() => {
    async function getPostList() {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URI}/post/list`,
        { headers: { Authorization: token } }
      );
      setPostList(
        res.data.map((responseItem: any) => {
          return {
            id: responseItem["post_id"],
            title: responseItem["title"],
            projectName: responseItem["project_name"],
            authorName: responseItem["author_name"],
            creationDate: responseItem["creation_date"],
            content: "",
          };
        })
      );
    }
    getPostList();
  }, [token]);
  const classes = useStyles();
  return (
    <>
      <MainAppBar />
      <main className={classes.content}>
        <TableContainer>
          <Table size="medium" aria-label="post list">
            <TableHead>
              <TableRow>
                {headCells.map((headCell) => (
                  <TableCell key={headCell.id} align="left" padding="default">
                    {headCell.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {postList.map((post) => (
                <TableRow hover key={post.id}>
                  <TableCell component="th" scope="row">
                    <Link to={"/post/" + post.id}>{post.title}</Link>
                  </TableCell>
                  <TableCell>{post.projectName}</TableCell>
                  <TableCell>{post.authorName}</TableCell>
                  <TableCell>{post.creationDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </main>
    </>
  );
}

PostList.propTypes = {
  token: PropTypes.string.isRequired,
};

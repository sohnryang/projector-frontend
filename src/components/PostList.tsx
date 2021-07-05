import {
  createStyles,
  Fab,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Theme,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import PropTypes, { InferProps } from "prop-types";
import MainAppBar from "./MainAppBar";
import { Post } from "../post";
import { Project } from "../project";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import xss from "xss";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      flexGrow: 1,
      padding: theme.spacing(2),
    },
    fab: {
      position: "absolute",
      bottom: theme.spacing(3),
      right: theme.spacing(3),
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
  setToken,
}: InferProps<typeof PostList.propTypes>) {
  const [postList, setPostList] = useState([] as Post[]);
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    if (searchQuery !== "") return;
    async function getPostList() {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URI}/post/list`,
        { headers: { Authorization: token } }
      );
      setPostList(
        res.data.map((responseItem: any) => {
          return {
            id: responseItem["post_id"],
            title: xss(responseItem["title"]),
            projectName: xss(responseItem["project_name"]),
            authorId: responseItem["author_id"],
            authorName: xss(responseItem["author_name"]),
            creationDate: xss(responseItem["creation_date"]),
            content: "",
          };
        })
      );
    }
    getPostList();
  }, [token, searchQuery]);
  const [projectFilters, setProjectFilters] = useState([] as Project[]);
  useEffect(() => {
    if (searchQuery === "") return;
    async function getProjects() {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URI}/project/search/${searchQuery}`,
        {},
        { headers: { Authorization: token } }
      );
      setProjectFilters(
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
    getProjects();
  }, [token, searchQuery]);
  useEffect(() => {
    async function getFilteredPosts() {
      if (searchQuery === "") return;
      const res = await axios.post(
        `${process.env.REACT_APP_API_URI}/post/filter-by-projects`,
        { projects: projectFilters.map((project) => project.id) },
        { headers: { Authorization: token } }
      );
      setPostList(
        res.data.map((responseItem: any) => {
          return {
            id: responseItem["post_id"],
            title: xss(responseItem["title"]),
            projectName: xss(responseItem["project_name"]),
            authorId: responseItem["author_id"],
            authorName: xss(responseItem["author_name"]),
            creationDate: xss(responseItem["creation_date"]),
            content: "",
          };
        })
      );
    }
    getFilteredPosts();
  }, [token, projectFilters, searchQuery]);
  const classes = useStyles();
  const { push } = useHistory();
  return (
    <>
      <MainAppBar setToken={setToken} setSearchQuery={setSearchQuery} />
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
        <Fab
          className={classes.fab}
          color="secondary"
          aria-label="new post"
          onClick={() => push("/write")}
        >
          <EditIcon />
        </Fab>
      </main>
    </>
  );
}

PostList.propTypes = {
  token: PropTypes.string.isRequired,
  setToken: PropTypes.func.isRequired,
};

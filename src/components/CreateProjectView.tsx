import {
  Button,
  Chip,
  createStyles,
  makeStyles,
  Paper,
  TextField,
  Theme,
} from "@material-ui/core";
import axios from "axios";
import PropTypes, { InferProps } from "prop-types";
import React from "react";
import { useHistory } from "react-router-dom";
import { User } from "../user";
import MainAppBar from "./MainAppBar";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      justifyContent: "center",
      flexWrap: "wrap",
      listStyle: "none",
      padding: theme.spacing(0.5),
      margin: theme.spacing(0.5),
    },
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
    chip: {
      margin: theme.spacing(0.5),
    },
  })
);

export default function CreateProjectView({
  token,
  setToken,
  user,
}: InferProps<typeof CreateProjectView.propTypes>) {
  const classes = useStyles();
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [members, setMembers] = React.useState([user as User]);
  const handleMemberAdd = () => {
    axios
      .post(
        `${process.env.REACT_APP_API_URI}/user/search-by-email/${email}`,
        {},
        { headers: { Authorization: token } }
      )
      .then((response) => {
        if (
          !members.filter((member) => member.id === response.data["user_id"])
            .length
        )
          setMembers(
            members.concat([
              {
                id: response.data["user_id"],
                name: response.data["name"],
                email: response.data["email"],
              },
            ])
          );
      })
      .catch(() => {
        return;
      });
  };
  const handleDelete = (memberToDelete: User) => {
    setMembers(members.filter((member) => member.id !== memberToDelete.id));
  };
  const handleProjectCreate = () => {
    axios
      .post(
        `${process.env.REACT_APP_API_URI}/project/create`,
        {
          name: name,
          description: description,
          members: members.map((member) => member.id),
        },
        { headers: { Authorization: token } }
      )
      .then(() => {
        push("/");
      });
  };
  const { push } = useHistory();
  return (
    <>
      <MainAppBar setToken={setToken} />
      <main className={classes.content}>
        <div className={classes.formContainer}>
          <TextField
            className={classes.formControl}
            label="프로젝트 이름"
            variant="filled"
            value={name}
            onChange={(event) => setName(event.target.value)}
            style={{ flexGrow: 1, flexShrink: 1 }}
          />
          <TextField
            className={classes.formControl}
            label="프로젝트 설명"
            multiline
            rows={3}
            variant="filled"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          <div className={classes.rowContainer}>
            <TextField
              className={classes.formControl}
              label="프로젝트원 이메일 입력"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              style={{ flexGrow: 1, flexShrink: 1 }}
            />
            <Button
              className={classes.formControl}
              variant="contained"
              color="secondary"
              style={{ flexGrow: 0, flexShrink: 0 }}
              onClick={handleMemberAdd}
            >
              프로젝트원 추가
            </Button>
          </div>
          <Paper component="ul" className={classes.root}>
            {[...members].map((member) => (
              <li key={member.id}>
                <Chip
                  label={member.name}
                  onDelete={
                    member.id === (user as User).id
                      ? undefined
                      : () => handleDelete(member)
                  }
                  className={classes.chip}
                />
              </li>
            ))}
          </Paper>
        </div>
        <div className={classes.rowContainer}>
          <Button
            variant="contained"
            color="secondary"
            style={{ flexGrow: 0, flexShrink: 0 }}
            className={classes.formControl}
            onClick={() => {
              handleProjectCreate();
            }}
            disabled={name === ""}
          >
            프로젝트 생성
          </Button>
          <Button
            variant="contained"
            style={{ flexGrow: 0, flexShrink: 0 }}
            className={classes.formControl}
            onClick={() => push("/")}
          >
            취소
          </Button>
        </div>
      </main>
    </>
  );
}

CreateProjectView.propTypes = {
  token: PropTypes.string.isRequired,
  setToken: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

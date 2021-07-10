import PropTypes, { InferProps } from "prop-types";
import GoogleLogin from "react-google-login";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { User } from "../user";
import TypeWriter from "typewriter-effect";

export default function LoginPage({
  token,
  setToken,
  user,
  setUser,
}: InferProps<typeof LoginPage.propTypes>) {
  const handleResponse = (response: any) => {
    axios
      .post(`${process.env.REACT_APP_API_URI}/auth/signin`, response)
      .then((response: any) => {
        setToken(response.data["access_token"]);
        setUser({
          id: response.data["user_id"],
          name: response.data["name"],
          email: response.data["email"],
        });
      });
  };

  if (token !== "" && (user as User).id !== 0) return <Redirect to="/" />;

  return (
    <div
      style={{
        display: "flex",
        flexFlow: "column",
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -55%)",
        alignItems: "center",
      }}
    >
      <span
        style={{
          fontFamily: "Major Mono Display",
          fontSize: "4.5em",
        }}
      >
        Projector
      </span>
      <br />
      <div style={{ fontFamily: "sans-serif" }}>
        <TypeWriter
          onInit={(typewriter) => {
            typewriter
              .typeString("A project site ")
              .typeString("of HAS students")
              .pauseFor(2000)
              .deleteChars(15)
              .typeString("by HAS student")
              .pauseFor(2000)
              .deleteChars(14)
              .typeString("for HAS students")
              .pauseFor(2000)
              .deleteChars(16)
              .start();
          }}
          options={{ loop: true, autoStart: true }}
        />
      </div>
      <div style={{ flexShrink: 0, flexGrow: 0, marginTop: "1.5em" }}>
        <GoogleLogin
          clientId="732283162920-fo65na0l33ahj1f02a6qdnhcg3hdq29n.apps.googleusercontent.com"
          onSuccess={handleResponse}
          buttonText="Login"
        />
      </div>
    </div>
  );
}

LoginPage.propTypes = {
  token: PropTypes.string.isRequired,
  setToken: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  setUser: PropTypes.func.isRequired,
};

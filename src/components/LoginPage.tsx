import PropTypes, { InferProps } from "prop-types";
import GoogleLogin from "react-google-login";
import axios from "axios";
import { Redirect } from "react-router-dom";

export default function LoginPage({
  token,
  setToken,
  userId,
  setUserId,
}: InferProps<typeof LoginPage.propTypes>) {
  const handleResponse = (response: any) => {
    axios
      .post(`${process.env.REACT_APP_API_URI}/auth/signin`, response)
      .then((response: any) => {
        setToken(response.data["access_token"]);
        setUserId(response.data["user_id"]);
      });
  };

  if (token !== "" && userId !== 0) return <Redirect to="/" />;

  return (
    <GoogleLogin
      clientId="732283162920-fo65na0l33ahj1f02a6qdnhcg3hdq29n.apps.googleusercontent.com"
      onSuccess={handleResponse}
      buttonText="Login"
    />
  );
}

LoginPage.propTypes = {
  token: PropTypes.string.isRequired,
  setToken: PropTypes.func.isRequired,
  userId: PropTypes.number.isRequired,
  setUserId: PropTypes.func.isRequired,
};

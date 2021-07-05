import PropTypes, { InferProps } from "prop-types";
import { Route, Switch } from "react-router-dom";
import EditorView from "./EditorView";
import PostList from "./PostList";
import PostView from "./PostView";

export default function Routes({
  token,
  setToken,
  userId,
}: InferProps<typeof Routes.propTypes>) {
  return (
    <Switch>
      <Route
        exact
        path="/"
        render={() => <PostList token={token} setToken={setToken} />}
      />
      <Route
        exact
        path="/post/:postId"
        render={() => (
          <PostView token={token} setToken={setToken} userId={userId} />
        )}
      />
      <Route
        exact
        path="/write"
        render={() => (
          <EditorView token={token} setToken={setToken} userId={userId} />
        )}
      />
      <Route
        exact
        path="/edit/:postId"
        render={() => (
          <EditorView token={token} setToken={setToken} userId={userId} />
        )}
      />
    </Switch>
  );
}

Routes.propTypes = {
  token: PropTypes.string.isRequired,
  setToken: PropTypes.func.isRequired,
  userId: PropTypes.number.isRequired,
};

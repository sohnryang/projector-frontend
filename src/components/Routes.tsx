import PropTypes, { InferProps } from "prop-types";
import { Route, Switch } from "react-router-dom";
import EditorView from "./EditorView";
import PostList from "./PostList";
import PostView from "./PostView";

export default function Routes({
  token,
  setToken,
  user,
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
          <PostView token={token} setToken={setToken} user={user} />
        )}
      />
      <Route
        exact
        path="/write"
        render={() => (
          <EditorView token={token} setToken={setToken} user={user} />
        )}
      />
      <Route
        exact
        path="/edit/:postId"
        render={() => (
          <EditorView token={token} setToken={setToken} user={user} />
        )}
      />
    </Switch>
  );
}

Routes.propTypes = {
  token: PropTypes.string.isRequired,
  setToken: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

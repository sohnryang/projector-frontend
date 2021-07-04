import PropTypes, { InferProps } from "prop-types";
import { Route, Switch } from "react-router-dom";
import PostList from "./PostList";
import PostView from "./PostView";

export default function Routes({
  token,
  userId,
}: InferProps<typeof Routes.propTypes>) {
  return (
    <Switch>
      <Route exact path="/" render={() => <PostList token={token} />} />
      <Route
        exact
        path="/post/:postId"
        render={() => <PostView token={token} />}
      />
    </Switch>
  );
}

Routes.propTypes = {
  token: PropTypes.string.isRequired,
  userId: PropTypes.number.isRequired,
};

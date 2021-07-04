import PropTypes, { InferProps } from "prop-types";
import { Route, Switch } from "react-router-dom";
import PostList from "./PostList";

export default function Routes({ token }: InferProps<typeof Routes.propTypes>) {
  return (
    <Switch>
      <Route exact path="/" render={() => <PostList token={token} />} />
    </Switch>
  );
}

Routes.propTypes = {
  token: PropTypes.string.isRequired,
};

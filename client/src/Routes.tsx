import { BrowserRouter, Link, Route, Switch } from "react-router-dom";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";

function Routes() {
  return <BrowserRouter>
    <div>
      <Link to="/">Home</Link>
      <Link to="/register">Register</Link>
      <Link to="/login">Login</Link>
    </div>
    <Switch>
      <Route path="/" exact render={() => <Home />} />
      <Route path="/register" exact render={(props) => <Register {...props} />} />
      <Route path="/login" exact render={() => <Login />} />
    </Switch>
  </BrowserRouter>
}

export default Routes;

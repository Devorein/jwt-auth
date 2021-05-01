import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";

function Routes() {
  return <BrowserRouter>
    <Switch>
      <Route path="/" exact render={() => <Home />} />
      <Route path="/register" exact render={() => <Register />} />
      <Route path="/login" exact render={() => <Login />} />
    </Switch>
  </BrowserRouter>
}

export default Routes;

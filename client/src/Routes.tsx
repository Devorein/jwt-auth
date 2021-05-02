import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Me } from "./pages/Me";
import { Register } from "./pages/Register";

function Routes() {
  return <BrowserRouter>
    <Navbar />
    <Switch>
      <Route path="/" exact render={() => <Home />} />
      <Route path="/register" exact render={(props) => <Register {...props} />} />
      <Route path="/login" exact render={(props) => <Login  {...props} />} />
      <Route path="/me" exact render={() => <Me />} />
    </Switch>
  </BrowserRouter>
}

export default Routes;

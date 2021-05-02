import { Link } from "react-router-dom";
import { useMeQuery } from "../generated/graphql";

export const Navbar = () => {
  const { data, loading } = useMeQuery();

  let body: any = null;
  if (loading)
    body = <div>Loading ...</div>
  else if (data?.me)
    body = <div>Logged in as {data.me.username}</div>
  else
    body = <div>Not logged in</div>

  return <div>
    <div>
      <Link to="/">Home</Link>
    </div>
    <div>
      <Link to="/register">Register</Link>
    </div>
    <div>
      <Link to="/login">Login</Link>
    </div>
    <div>
      <Link to="/me">Me</Link>
    </div>
    {body}
  </div>;
}
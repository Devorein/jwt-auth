import { Link } from "react-router-dom";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";

export const Navbar = () => {
  const { data, loading } = useMeQuery();
  const [logout, { client }] = useLogoutMutation()

  let body: any = null;
  if (loading)
    body = <div>Loading ...</div>
  else if (data?.me)
    body = <div><div>
      Logged in as {data.me.username}</div>
      <button onClick={async () => {
        await logout();
        localStorage.removeItem("token");
        await client!.resetStore();
      }}>
        Logout
      </button>
    </div>
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
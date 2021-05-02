import { Link } from "react-router-dom";

export const Navbar = () => {
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
  </div>;
}
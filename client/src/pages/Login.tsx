import { useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { useLoginMutation } from "../generated/graphql";

export const Login: React.FC<RouteComponentProps> = ({ history }) => {
  const [loginData, setLoginData] = useState({
    password: '',
    usernameOrEmail: ''
  });
  const [login] = useLoginMutation()

  return <form onSubmit={async (e) => {
    e.preventDefault();
    const response = await login({
      variables: loginData
    });
    console.log(response)
    if (response?.data?.login.accessToken) {
      localStorage.setItem('token', response.data.login.accessToken)
    }
    history.push("/")
  }}>
    <div>
      <input placeholder="Email OR Password" value={loginData.usernameOrEmail} onChange={e => setLoginData({
        ...loginData,
        usernameOrEmail: e.target.value
      })} />
    </div>
    <div>
      <input placeholder="Password" type="password" value={loginData.password} onChange={e => setLoginData({
        ...loginData,
        password: e.target.value
      })} />
    </div>
    <button type="submit">Submit</button></form>;
}
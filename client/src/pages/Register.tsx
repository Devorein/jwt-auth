import { useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { UserDataInput, useRegisterMutation } from "../generated/graphql";

export const Register: React.FC<RouteComponentProps> = ({ history }) => {
  const [registerData, setRegisterData] = useState<UserDataInput>({
    email: '',
    password: '',
    username: ''
  });
  const [register] = useRegisterMutation()

  return <form onSubmit={async (e) => {
    e.preventDefault();
    const response = await register({
      variables: {
        input: registerData
      }
    });
    console.log(response);
    history.push("/")
  }}>
    <div>
      <input placeholder="Email" value={registerData.email} onChange={e => setRegisterData({
        ...registerData,
        email: e.target.value
      })} />
    </div>
    <div>
      <input placeholder="Username" value={registerData.username} onChange={e => setRegisterData({
        ...registerData,
        username: e.target.value
      })} />
    </div>
    <div>
      <input placeholder="Password" type="password" value={registerData.password} onChange={e => setRegisterData({
        ...registerData,
        password: e.target.value
      })} />
    </div>
    <button type="submit">Submit</button></form>;
}
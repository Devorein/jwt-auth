import { useState } from "react";
import { UserDataInput } from "../generated/graphql";

export const Register = () => {
  const [registerData, setRegisterData] = useState<UserDataInput>({
    email: '',
    password: '',
    username: ''
  });

  return <form onSubmit={(e) => {
    e.preventDefault();
    console.log(registerData)
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
import { useUsersQuery } from "../generated/graphql";

export const Home = () => {
  const { data, loading } = useUsersQuery();
  if (loading || !data) return <div>Loading ...</div>

  return <div>
    {data.users.map(user => <div key={user.id}>
      {user.id}
      {" "}
      {user.username}
      {" "}
      {user.email}
    </div>)}
  </div>;
}
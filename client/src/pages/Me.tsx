import { useMeQuery } from "../generated/graphql";

export const Me = () => {
  const { data, loading, error } = useMeQuery({
    fetchPolicy: 'network-only'
  });
  if (loading) return <div>Loading</div>
  else if (error) return <div>{JSON.stringify(error.message)}</div>
  else if (data)
    return <div>
      <div>Username: {data.me.username}</div>
      <div>Email: {data.me.email}</div>
    </div>;
  else return null;
}

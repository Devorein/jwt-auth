import { useHelloQuery } from "./generated/graphql";

function App() {
  const { data, loading } = useHelloQuery()
  if (loading) return <div>Loading ...</div>
  return (
    <div className="App">
      {JSON.stringify(data, null, 2)}
    </div>
  );
}

export default App;

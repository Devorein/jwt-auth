import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './Routes';

const apolloClient = new ApolloClient({
  credentials: 'include',
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <Routes />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

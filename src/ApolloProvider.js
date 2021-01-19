import React from 'react'
import App from './App'
import { ApolloClient, InMemoryCache, createHttpLink, ApolloProvider } from '@apollo/client';
import { setContext } from 'apollo-link-context';

const httplink = createHttpLink({
    uri: !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : "https://cyberworld-2020.herokuapp.com/"
})

const authLink = setContext(() => {
    const token = localStorage.getItem('jwtToken');
    return{
        headers: {
            Authorization: token ? `Bearer ${token}` : ''       
        }
    }
})

const client = new ApolloClient({
    link: authLink.concat(httplink),
    cache: new InMemoryCache()
})



export default(
<ApolloProvider client={client}>
    <App />
</ApolloProvider>
)
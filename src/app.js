import React from 'react'
import ReactDOM from 'react-dom' 
import FrontPage from './components/FrontPage.js'
import LessonsPage from './components/LessonsPage.js';

import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    useQuery,
    gql
  } from "@apollo/client";

const client = new ApolloClient({
    uri: './graphql',
    cache: new InMemoryCache()
});

const App = () => {
    const USER = gql`
        {
        user {
            name, 
            image, 
            lessons {
                title
                starRating
                }
            }
        lessons {
            title
            }
        }
      
        `
    
    const {data} = useQuery(USER)

    return (
        <div className='container'>
            {  data ? <LessonsPage userInfo={data.user} lessons={data.lessons} /> :  <FrontPage /> }
        </div>
    )
}

ReactDOM.render(
    <ApolloProvider client={client}>
            <App />
    </ApolloProvider>, 
document.querySelector("#root")
);
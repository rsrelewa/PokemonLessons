import React from 'react'
import PokeList from './PokeList.js';
import {
    gql,
    useLazyQuery
  } from "@apollo/client";

  const SEARCH = gql`
        query search($str: String!) {
            search(str: $str) {
                name
            }
        }
    `

const FrontPage = () => {
    
    const [search, { loading, error, data }] = useLazyQuery(SEARCH);
    
    if (error) return `Error! ${error.message}`; 

    return (
        <>
        <h1>Pokemon Search</h1> 
        <input className="input" onChange={(e) => {
            const query = e.target.value
            if (query.length < 2) return;
            search({ variables: { str: query } });

            }} /> 
        {data?.search && (
            <PokeList pokemonList = {data.search} />
        )}
        </>
    )
}

export default FrontPage;
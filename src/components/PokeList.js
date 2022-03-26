import React from 'react'
import {
    gql,
    useLazyQuery,
    useQuery
  } from "@apollo/client";

  const GET_POKEMON = gql`
  query GetPokemon($str: String!) {
      getPokemon(str: $str) {
          name,
          image
      }
  }
`

const LOGIN = gql`
query Login($pokemon: String!) {
  login(pokemon: $pokemon) {
      name
  }
}
`
const USER = gql`query User {
  user {
  name
  image
  lessons {
      title
      starRating
  }
  }
}
  `
const PokeList = ({pokemonList}) => {

    const [getUser, { data:userData }] = useLazyQuery(USER);
    const [getPokemon, { data:pokeData }] = useLazyQuery(GET_POKEMON);
    const [login, {data:loginData}] = useLazyQuery(LOGIN);

    const PokemonDiv = pokemonList.map(pokemon => {
        return (
            <div  onClick={()=>{
                getPokemon({ variables: { str: pokemon.name } });

            }}
            className='names'>{pokemon.name} <hr />
            </div>
        )
    })


    let postLoginPage = ''
    if (pokeData){
        postLoginPage = 
        <>
            <h1>{pokeData.getPokemon.name}</h1>
            <img src={pokeData.getPokemon.image} />
            <button onClick={(e)=>{
                login({variables:{pokemon:pokeData.getPokemon.name}}).then((result)=>{
                    getUser() 
                })
                }}>
                Login
            </button>
        </> 

    }
    
    return (
        <>
            { pokeData ? null : PokemonDiv }
            { postLoginPage }
        </>
    )
}

export default PokeList



                
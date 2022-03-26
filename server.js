import { ApolloServer, gql } from 'apollo-server-express';
import fetch from 'node-fetch';
import express from 'express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import http from 'http';
import session from 'express-session';

const pokelessons = []
const typeDefs = gql`
  type Query {
      pokemon: [Pokemon]
      lessons: [Lessons]
      search(str: String!): [Pokemon]
      getPokemon(str: String!): Pokemon
      user: User
      login(pokemon: String!): User
  }
  type Mutation {
    enroll(title: String!): User
    unenroll(title: String!): User
    stars(title:String, starRating:Int): User
  }
  type User {
    name: String
    image:String
    lessons: [Lessons]
  }
  type Pokemon {
    name: String  
    image: String
  }
  type Lessons {
    title: String
    starRating: Int
  }
`;
const fetchPokemon = (param) => {
  return fetch(`https://pokeapi.co/api/v2/pokemon/${param}`)
}
const pokemon = () => {return fetch(`https://pokeapi.co/api/v2/pokemon?limit=1118`).then(r=>r.json()).then(data=>{return data.results})}
const lessons = () => {return fetch(`https://www.c0d3.com/api/lessons`).then(r=>r.json())}
const search = (parent,args) => {
  return fetch(`https://pokeapi.co/api/v2/pokemon?limit=1118`)
  .then(r=>r.json())
  .then(data=>{
      return data.results.filter(pokemon=>{
          return pokemon.name.includes(args.str)
      })
  })
}
const getPokemon = (parent, args) => {
  return fetch(`https://pokeapi.co/api/v2/pokemon/${args.str}`)
          .then(r=>r.json())
          .then(d =>{
              return {
                  name: d.name,
                  image: d.sprites.front_default
              }
          })
}
const user = (parent,args,context) => {
  const pokemonSession = context.req.session.pokemon
  const lessons = pokelessons[pokemonSession.name] || []
  const mapLessonsToTitles = lessons.map((str)=>{
    return {
      title:str.title,
      starRating: lessons[str.title] || 1
    }
  })
  pokelessons[pokemonSession.name] = lessons
  pokemonSession.lessons = mapLessonsToTitles
  const img = context.req.session.image 

  return  {...pokemonSession ,mapLessonsToTitles}; 
}

const login = async (parent,args,context) => {
  const lessons = pokelessons[pokemon] || []
  const pokemonResponse = await fetchPokemon(args.pokemon)
  const pokemonValue = await pokemonResponse.json()
  const pokemonSession = { 
    image:pokemonValue.sprites.front_default,
    name: args.pokemon,
    lessons
   }
  context.req.session.pokemon = pokemonSession;
  return pokemonSession;
 
}
const enroll = (parent,args,context)=> {
  const pokemonSession = context.req.session.pokemon
  const lessons = pokelessons[pokemonSession.name] || []
  lessons.push({title:args.title})
/*   lessons[args.title] = 1; */
  pokelessons[pokemonSession.name] = lessons
  pokemonSession.lessons = lessons

  return pokemonSession
}

const unenroll = (parent,args,context) => {
  const pokemonSession = context.req.session.pokemon
  const lessons = pokelessons[pokemonSession.name] || []
  const indexOfLesson = (arr,str) =>{
    let id = undefined
    arr.forEach((element,index)=>{
        if (element.title === str){
            id = index
        }
    })
    return id
  }
  lessons.splice(indexOfLesson(lessons,`${args.title}`),1)
  pokelessons[pokemonSession.name] = lessons
  pokemonSession.lessons = lessons
  const mappedLessons = lessons.map((data)=>{
    return {
      title:data,
    }
  })
  return pokemonSession
}

const stars = (parent,args,context) => {
  const pokemonSession = context.req.session.pokemon
  if (!pokemon) return []
  const lessons = pokelessons[pokemonSession.name] || []
  
  lessons[args.title] = args.starRating;
  pokelessons[pokemonSession] = lessons; 
  pokemonSession.lessons = lessons
  return pokemonSession
}

const resolvers = {
    Query: {pokemon,lessons,search,getPokemon,user,login},
    Mutation: {enroll,unenroll,stars},
  };
  
  
async function startApolloServer(typeDefs, resolvers) {
    const app = express();
    const httpServer = http.createServer(app);
    
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
        context: ({ req }) => {
        return { req } 
        }
  });  
    app.use(express.static('public'))
    app.set('trust proxy', 1) // trust first proxy 
    app.use(session({
        secret: 'secret',
        saveUninitialized: false,
        resave: false
    }))
    await server.start();
    server.applyMiddleware({ app })
        
    await new Promise(resolve => httpServer.listen({  port: /*process.env.PORT || 8123 */ 3005}, resolve));
}
startApolloServer(typeDefs,resolvers)
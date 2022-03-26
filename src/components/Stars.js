import React from 'react'
import {
    gql,
    useLazyQuery,
    useMutation
  } from "@apollo/client";

const generateNumArray = (starCount) => {
    return [...Array(starCount).keys()]
 }

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

 const STARS = gql`
 mutation Stars($title: String, $starRating: Int) {
     stars(title: $title, starRating: $starRating) {
         name
         image
         lessons {
         title
         starRating
         }
     }
 }
 `

 
 const Stars = ({starsToGenerate,title}) => {
   
    const [getUser, { data: userData }] = useLazyQuery(USER);
    const [starVal, setStarVal] = React.useState(0)
    const [locked,setLocked] = React.useState(true)
    const [stars, { data:starsData }] = useMutation(STARS);
    
    const starsGenerated = generateNumArray(starsToGenerate)

    React.useEffect(()=>{
        getUser().then(result=>{

            const indexOfTitle = result.data.user.lessons.findIndex((e) => {
                return e.title === title
            })

            setStarVal(result.data.user.lessons[indexOfTitle].starRating-1)

        })

    },[])
        
    const starsArray = starsGenerated.map((e,i)=>{
        let icon = 'far'
        if (e <= starVal){
            icon = 'fas'
        }
        
        return <i   key={i} id={i}
                    className={`${icon} fa-star`}
                    onMouseEnter={()=>{
                        if (locked){
                            return
                        }
                        setStarVal(e) 
                    }}
                    
                    onClick = {()=>{
                        setLocked(true)
                        setStarVal(e)
                        stars({variables: { title: title,starRating:starVal+1 } })
                    }}
                    
                    ></i>
    })
    let text = `You are giving ${starVal+1} stars`
    if (locked){
        text = `You have given ${starVal+1} stars`
    }
    return (
        <div className='starContainer' onMouseEnter={()=>{setLocked(false)}}>
            {starsArray}
            {text}
        </div>
    )
 }

 export default Stars
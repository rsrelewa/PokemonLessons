import React from 'react'
import Lessons from './Lessons.js'

const LessonsPage = ({userInfo, lessons}) => {
    const lessonMap = lessons.reduce( (acc, lesson) => {
         acc[lesson.title] = {enrolled: false}
        return acc 
    }, {})

    const userLessons = userInfo.lessons || []

    userLessons.map( lesson => {
        lessonMap[lesson.title].enrolled = true
    })
 
    const [enrolledLessons,setEnrolledLessons] = React.useState(Object.keys(lessonMap).filter(title => lessonMap[title].enrolled))
    const [notEnrolledLessons,setNotEnrolledLessons] = React.useState(Object.keys(lessonMap).filter(title => !lessonMap[title].enrolled))
     
   return (
       <div>
           <h1>{userInfo.name}</h1>
           <img src={userInfo.image} />
           <Lessons mutation='unenroll' enrolledLessons={enrolledLessons} setEnrolled= {setEnrolledLessons} setUnenrolled = {setNotEnrolledLessons}
            />
           <Lessons mutation='enroll' enrolledLessons={notEnrolledLessons} setEnrolled= {setEnrolledLessons} setUnenrolled = {setNotEnrolledLessons}
            />   
       </div>
   )
}

export default LessonsPage
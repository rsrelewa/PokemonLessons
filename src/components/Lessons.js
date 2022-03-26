import React from "react";
import Stars from "./Stars.js";
import {
  gql,
  useMutation,
  useLazyQuery,
} from "@apollo/client";


const ENROLL = gql`
    mutation Mutation($title: String!) {
      enroll(title: $title) {
        name
      }
    }
  `;

  const UNENROLL = gql`
    mutation Unenroll($title: String!) {
      unenroll(title: $title) {
        name
      }
    }
  `;

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


const Lessons = ({ enrolledLessons, mutation, setEnrolled, setUnenrolled }) => {
  
  const isEnroll = mutation === "unenroll"

  const [enroll,{data}] = useMutation(isEnroll ? UNENROLL : ENROLL)

  const [getUser, { data: userData }] = useLazyQuery(USER);
  

  let lessonsDiv = "";
  if (enrolledLessons.length) {
    lessonsDiv = enrolledLessons.map((title) => {
      return (
        <div>
          <div
            className="lessons"
            onClick={(e) => {
              enroll({ variables: { title: title } }).then(result=>{
                getUser().then(result=>{
                   const lessons = result.data.lessons;
                  const lessonMap = lessons.reduce((acc, lesson) => {
                    acc[lesson.title] = { enrolled: false };
                    return acc;
                  }, {});
              
                  const userLessons = result.data.user.lessons || [];
              
                  userLessons.map((lesson) => {
                    lessonMap[lesson.title].enrolled = true;
                  });
              
                  setEnrolled(
                    Object.keys(lessonMap).filter(
                      (title) => lessonMap[title].enrolled
                    )
                  );
                  setUnenrolled(
                    Object.keys(lessonMap).filter(
                      (title) => !lessonMap[title].enrolled
                    )
                  ); 
                })
              })
            }}
          >
            {title}
          </div>
          {isEnroll && (
            <Stars
              style={{ fontSize: 10, marginTop: 20 }}
              starsToGenerate={5}
              title={title}
            />
          )}
        </div>
      );
    });
  }
  
  let $lessonHeader = "";
  let $lessonpara = "";
  if (mutation === "enroll") {
    $lessonHeader = "Not Enrolled";
    $lessonpara = "Click to enroll";
  } else {
    $lessonHeader = "Enrolled";
    $lessonpara = "Click to unenroll";
  }

  return (
    <div>
      <h2>{$lessonHeader}</h2>
      <p>{$lessonpara}</p>
      {lessonsDiv}
    </div>
  );
};

export default Lessons;

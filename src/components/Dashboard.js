
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { axiosWithAuth } from "../utils/axiosWithAuth";
import { setClassList } from "../actions/classActions";
import Styled from 'styled-components';

import Onboarding from "./Onboarding";
import ClassList from "./ClassList";

export default function Dashboard() {
  const user = useSelector(state => state.userReducer);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const onboarded = localStorage.getItem('onboarding'); // using local storage to check for onboarding because we forgot to add an edit user endpoint. could do clients via saved classes, but instructors don't have classes saved for them, so no other way to track if they've been on boarded.
  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      let doneLoading = await axiosWithAuth().get(`https://bw-back-end.herokuapp.com/api/auth/users/classes`)
      .then(res => {
        dispatch(setClassList(res.data.data))
        return false
      })
      .catch(err => console.log(err))
      setIsLoading(doneLoading)
    }
    if (isMounted) {
      fetchData();
    }
    return () => isMounted = false;
  }, [])
  // #region getting errors trying to wait for first axios to resolve second one. Need first one to get all the classes to filter from
  // tried separating concerns and setting result to a separate filtered_classes key in state, but still getting weird
  // errors regarding looping state updates. Not sure if it's related to this, but at least the classes show up fine without it
  // if (user.role === "client") { //if user is client and after the classes are set ...
  //   axiosWithAuth().get(`https://bw-back-end.herokuapp.com/api/auth/users/classes/savedclasses/${user.id}`)
  //     .then(res => {
  //       dispatch(filterState(res.data))}
  //     ) //... filter classes in class reducer state
  //     .catch(err => console.log(err))
  // }
  // #endregion
  if (isLoading) {
    return (
      <div>Loading...</div>
    )
  } else {
    console.log("onboarded", onboarded)
     return (
    <DivContainer>
      <Middlediv>
        Dashboard
          {onboarded === "false" ? <Onboarding /> : <ClassList />}
      </Middlediv>
    </DivContainer>
  );
  }
};

const DivContainer = Styled.div`
display: flex;
flex-direction: column;
align-items: center;
background-color:#3F51B5;
padding: 3%;
padding-top: .5rem;
font-size:1.3rem;
text-align:center;
height:100vh;
font-size: 3rem;
box-shadow:0 0 15px 5px rgba(0,0,0,0.06);


.link {
  box-shadow:inset 0px 1px 0px 0px #ffffff;
	background-color:#3F51B5;
	border-radius:6px;
	border:1px solid #dcdcdc;
	display:inline-block;
	cursor:pointer;
	color:white;
	padding:13px 62px;
  font-size: 1.3rem;}


`
const Middlediv = Styled.div`
  margin-top: 2%;
    background-color: white;
    width: 60%;
    height: 95%;
    box-shadow:0 0 15px 5px rgba(0,0,0,0.06);
  `
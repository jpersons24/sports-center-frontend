import styled from 'styled-components'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addNewPost } from '../redux/postSlice'
import { addGame } from '../redux/gameSlice'
import PostsDisplay from './PostsDisplay'
import Alert from 'react-bootstrap/Alert'


function Posts({ game }) {

   const [postInput, setPostInput] = useState("")
   const [show, setShow] = useState(false)
   const [gameSaved, setGameSaved] = useState(false)
   console.log(game)
   console.log(gameSaved)
   
   const currentUser = useSelector((state) => state.user.currentUser)
   const savedGames = useSelector((state) => state.game.savedGames)
   const dispatch = useDispatch()

   function isGameSaved(savedGames) {
      savedGames.forEach((g) => {
         if (g.id === game.id) {
            setGameSaved(true)
         } else {
            setGameSaved(false)
         }
      })
   }

   useEffect(() => {
      isGameSaved(savedGames) 
   }, [getFormInput])
   
   
   function getFormInput(event){
      setPostInput(event.target.value)
   }

   function handleFormSubmit(event) {
      event.preventDefault()
      // isGameSaved(savedGames)
      // performAction()
      if (currentUser == null) {
         setShow(true)
      } else if ((currentUser !== null) && (gameSaved === false)) {
         console.log("user is logged in, game has not been saved yet")
         createGame()
         setPostInput("")
      } else if ((currentUser !== null) && (gameSaved === true)) {
         console.log("user is logged in, game has been saved")
         newPostObj(game)
         setPostInput("")
      }
   }

   function createGame() {
      
      const away_team = game.teams.filter(team => team !== game.home_team)
      const newGameObj = {
         id: game.id,
         sport_key: game.sport_key,
         sport_nice: game.sport_nice,
         away_team: away_team[0],
         home_team: game.home_team,
         commence_time: game.commence_time,
      }
      console.log(newGameObj)
   
      fetch("http://localhost:4000/games", {
         method: "POST",
         headers: {"Content-Type": "application/json"},
         body: JSON.stringify(newGameObj)
      })
      .then(res => res.json())
      .then(data => {
         console.log(data)
         const action = addGame(data)
         console.log(action)
         dispatch(action)
         newPostObj(data)
         setGameSaved(true)
      })
   }
   

   function newPostObj(gameObj) {
      if (gameObj.length === 1) {
         const newPost = {
            user_id: currentUser.id,
            game_id: gameObj[0].id,
            content: postInput,
            likes: 0
         }
         console.log(newPost)
         createNewPost(newPost)
         // debugger
      } else {
         const newPost ={
            user_id: currentUser.id,
            game_id: gameObj.id,
            content: postInput,
            likes: 0
         }
         console.log(newPost)
         createNewPost(newPost)
         // debugger
      }
   }


   function createNewPost(newPost) {
      fetch("http://localhost:4000/posts", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(newPost)
      })
      .then(res => res.json())
      .then(data => {
         const action = addNewPost(data)
         dispatch(action)
         console.log('Success:', data)
      })
   }

   return (
      <>
         <PreviewWrapper>
            <PostHeader>What's on your mind?</PostHeader>
            {!show ?
            null
            :
            <Alert 
               variant='warning' 
               dismissible 
               onClose={() => setShow(false)}
               style={{
                  margin: '15px auto',
                  display: 'block',
                  textAlign: 'center',
                  width: '50%',
               }}
            >
               You have to be logged in to leave a post!
            </Alert>
            }
               <PostsDisplay game={game} />
               <PostForm onSubmit={handleFormSubmit}>
                  <PostTextField name="post" value={postInput} onChange={getFormInput} placeholder="Share betting wisdom here..." wrap="hard"/>
                  <br></br>
                  <br></br>
                  <SubmitButton type="submit" value="Post"/>
               </PostForm>
         </PreviewWrapper>
      </>
   )
};


export default Posts;

// ******* styled components ********

const PostForm = styled.form`
   margin: 5px;
   margin-right: auto;
   margin-left: auto;
   margin-top: 30px;
   display: block;
   width: 75%;
`

const PostHeader = styled.h3`
   margin-bottom: 20px;
`

const PostTextField = styled.textarea`
   width: 60%;
   height: 100px;
`

const PreviewWrapper = styled.div` 
   margin: auto;
   margin-top: 25px;
   margin-bottom: 50px;
   width: 80%;
   background-color: black;
   padding: 20px;
   text-align: center;
   overflow: auto;
`

const SubmitButton = styled.input`
   margin-right: auto;
   margin-left: auto;
   display: block;
   color: white;
   background-color: #307BFF;
   padding: 3px 7px;
   border-radius: 5px;
   &:hover {
      transform: scale(1.1);
      transition: 0.5s;
   }
`
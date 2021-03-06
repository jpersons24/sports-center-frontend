import Carousel from 'react-bootstrap/Carousel'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useSelector } from 'react-redux'


function NhlCarousel() {

   // const games = useSelector((state) => state.game.displayedGames)
   const apiNhlGames = useSelector((state) => state.game.nhlGames)

      const gamesToDisplay = apiNhlGames.map((game) => {
         const newDate = new Date (Date.parse(game.commence_time))
         const displayDate = String(newDate)
         const away_team = game.teams.filter(team => team !== game.home_team)
         
         return (
            <Carousel.Item key={game.id}>
               <h3>{game.sport_nice}</h3>
               <br></br>
               <h5
                  style={{
                     display: 'block',
                     marginRight: 'auto',
                     marginLeft: 'auto',
                     width: '70%',
                  }}
               >{game.home_team} <em>(h)</em> VS {away_team[0]} <em>(a)</em>
               </h5>
               <br></br>
               <GameTime>{displayDate}</GameTime>
               <Link to={`/game/${game.id}`}>View Game Details</Link>
            </Carousel.Item>
         )
      })

   return (
      <>
         <br></br>
         <br></br>
         <Carousel
            style={{
               height: '400px',
               marginRight: 'auto',
               marginLeft: 'auto',
               width: '60%',
               textAlign: 'center',
               padding: '30px',
            }}
         >
            {gamesToDisplay}
         </Carousel>
      </>
   )
}


export default NhlCarousel


const GameTime = styled.p`
   font-size: 12px;
`
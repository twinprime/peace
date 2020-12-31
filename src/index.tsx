import * as React from 'react'
import * as ReactDOM from 'react-dom'
import './app.scss'
import Button from 'react-bootstrap/Button'
import { ReactGame } from './ReactGame'

function GameControl() {
  const reactGame = React.createRef<ReactGame>()
  const [paused, setPaused] = React.useState(false)

  return (
    <div>
      <div className="title"><img src="/logo.png"></img><span className="bigtext">Peace</span>{" "}<span className="smalltext">[is not an option]</span></div>
      <ReactGame ref={reactGame} />
      <div>
        <Button onClick={() => setPaused(reactGame.current.pause())}>
          {paused ? "Resume" : "Pause"}
        </Button>
        <Button onClick={() => reactGame.current.restart()}>
          Restart
        </Button>
      </div>
      <div>
        <h3>Chopper Control</h3>
        <p>Move chopper using W, S, A, D</p>
        <p>If chopper is in the air and moving, hold Space to fire guns.</p>
        <p>If chopper is in the air and stationary,</p>
        <ul>
          <li>Hold Space to lower lifting cables.</li>
          <li>If lifting cables touches a liftable object, it will be attached to the chopper.</li>
          <li>Lower the object on ground and press Space to release it.</li>
        </ul>
        <p>If chopper is on ground and stationary,</p>
        <ul>
          <li>Nearby civilians will run towards it to board</li>
          <li>Soliders will not run towards it intentionally, but any soldier touching it will board</li>
          <li>Press and hold Space any where except the helipad to alight any soldiers onboard</li>
          <li>Press and hold Space on helipad to alight any civilians onboard</li>
        </ul>        
      </div>
  </div>
  );
}

ReactDOM.render(<GameControl />, document.getElementById('root'))

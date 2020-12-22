import * as React from 'react'
import * as ReactDOM from 'react-dom'
import './app.scss'
import Button from 'react-bootstrap/Button'
import { ReactGame } from './ReactGame'

function Example() {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = React.useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <Button onClick={() => setCount(count + 1)}>
        Click me
      </Button>
    </div>
  );
}

ReactDOM.render(
  <div>
    <div className="title"><img src="/logo.png"></img><span className="bigtext">Peace</span>{" "}<span className="smalltext">[is not an option]</span></div>
    <ReactGame />
    <Example />
  </div>,
  document.getElementById('root'),
)

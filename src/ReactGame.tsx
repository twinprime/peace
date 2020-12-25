import * as React from 'react'
import * as Phaser from 'phaser'
import GameScene from './GameScene'

export class ReactGame extends React.Component {
  private gameDivRef = React.createRef<HTMLDivElement>()

  render(): JSX.Element {
    return <div id="game" ref={this.gameDivRef}></div>
  }

  componentDidMount(): void {
    new Phaser.Game({
      title: 'Sample',
      type: Phaser.AUTO,
      
      scale: {
        mode: Phaser.Scale.FIT,
        width: 1068,
        height: 600,
      },
      
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 300 },
          debug: false,
        },
      },
      
      parent: 'game',
      backgroundColor: '#000000',
      scene: new GameScene(1068 * 3, 600),
    })
  }
}
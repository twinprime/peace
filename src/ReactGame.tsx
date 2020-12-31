import * as React from 'react'
import * as Phaser from 'phaser'
import GameScene from './GameScene'

export class ReactGame extends React.Component {
  private gameDivRef = React.createRef<HTMLDivElement>()
  private game: Phaser.Game

  render(): JSX.Element {
    return <div id="game" ref={this.gameDivRef}></div>
  }

  componentDidMount(): void {
    this.game = new Phaser.Game({
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
    })
    this.game.scene.add("main", new GameScene(1068 * 5, 600), true)
  }

  pause(): boolean {
    if (this.game.scene.isPaused("main")) {
      this.game.scene.resume("main")
      return false
    } else {
      this.game.scene.pause("main")
      return true
    }
  }

  restart(): void {
    this.game.scene.getScene("main").scene.restart()
  }
}
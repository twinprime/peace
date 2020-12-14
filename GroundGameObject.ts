import GameObject from "./GameObject"
import GameScene from "./GameScene"

export default class GroundGameObject extends GameObject {
  constructor(readonly scene: GameScene) {
    super(scene)
  }

  create() {
    const gameWidth = this.scene.sys.game.scale.gameSize.width
    const gameHeight = this.scene.sys.game.scale.gameSize.height

    console.log(`WxH = ${gameWidth}x${gameHeight}`)

    const sprite = this.scene.add.tileSprite(0, gameHeight - 16, gameWidth, 16, "nature", 1).setScale(2)
    this.scene.platforms.add(sprite)
  }
}
import GameObject from "./GameObject"
import GameScene from "./GameScene"

export default class GroundGameObject extends GameObject {
  readonly x1: number
  readonly x2: number
  readonly y1: number
  readonly y2: number
  readonly width: number
  readonly height: number

  constructor(readonly scene: GameScene) {
    super(scene, 0)
    
    const sprite = this.scene.add.tileSprite(0, this.scene.worldHeight - 16, 
      this.scene.worldWidth, 16, "nature", 1).setScale(2)
    this.scene.platforms.add(sprite)

    this.x1 = 0
    this.x2 = this.scene.worldWidth
    this.y1 = sprite.y - sprite.height / 2
    this.y2 = sprite.y + sprite.height / 2
    this.width = this.scene.worldWidth
    this.height = sprite.height
  }
}
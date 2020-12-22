import GameObject from "./GameObject"
import GameScene from "./GameScene"

export default class GroundGameObject extends GameObject {
  constructor(readonly scene: GameScene) {
    super(scene)
  }

  create(): void {
    const sprite = this.scene.add.tileSprite(0, this.scene.worldHeight - 16, 
      this.scene.worldWidth, 16, "nature", 1).setScale(2)
    this.scene.platforms.add(sprite)
  }
}
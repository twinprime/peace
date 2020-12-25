import GameScene from "../GameScene"
import SpriteGameObject from "../SpriteGameObject"

export default class FactoryGameObject extends SpriteGameObject {
  private readonly _spawnX: number
  get spawnX(): number { return this._spawnX }

  constructor(scene: GameScene, owner: number, x: number, faceLeft: boolean) {
    super(scene, owner)
    
    this.mainSprite = this.scene.add.sprite(x, this.scene.groundPos - 64, "factory")
    if (!faceLeft) {
      this.mainSprite.setFlipX(true)
      this._spawnX = x -128 + 184
    } else this._spawnX = x - 128 + 70
  }

  static preload(scene: GameScene): void {
    scene.load.image("factory", "/images/factory.png")
  }
}
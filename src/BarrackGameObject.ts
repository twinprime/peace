import GameScene from "./GameScene"
import SpriteGameObject from "./SpriteGameObject"

export default class BarrackGameObject extends SpriteGameObject {
  private readonly _spawnX: number
  get spawnX(): number { return this._spawnX }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(scene: GameScene, owner: number, x: number) {
    super(scene, owner)
    this.mainSprite = this.scene.add.sprite(x, this.scene.groundPos - 32, "barrack")
    this.mainSprite.setScale(0.5, 0.5)
    this._spawnX = x
  }

  static preload(scene: GameScene): void {
    scene.load.image("barrack", "/images/barrack.png")
  }
}
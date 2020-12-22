import GameObject from "./GameObject"
import GameScene from "./GameScene"

export default class FactoryGameObject extends GameObject {
  private sprite: Phaser.GameObjects.Sprite

  private _spawnX: number
  get spawnX(): number { return this._spawnX }

  constructor(scene: GameScene) {
    super(scene)
  }

  create(x: number, faceLeft: boolean): void {
    this.sprite = this.scene.add.sprite(x, this.scene.groundPos - 64, "factory")
    if (!faceLeft) {
      this.sprite.setFlipX(true)
      this._spawnX = x -128 + 184
    } else this._spawnX = x - 128 + 70
  }

  static preload(scene: GameScene): void {
    scene.load.image("factory", "/images/factory.png")
  }
}
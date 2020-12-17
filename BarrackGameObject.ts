import GameObject from "./GameObject"
import GameScene from "./GameScene"

export default class BarrackGameObject extends GameObject {
  private sprite: Phaser.GameObjects.Sprite

  private _spawnX: number
  get spawnX(): number { return this._spawnX }

  constructor(scene: GameScene) {
    super(scene)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create(x: number, faceLeft: boolean): void {
    this.sprite = this.scene.add.sprite(x, this.scene.groundPos - 32, "barrack")
    this.sprite.setScale(0.5, 0.5)
    this._spawnX = x
  }

  static preload(scene: GameScene): void {
    scene.load.image("barrack", "/images/barrack.png")
  }
}
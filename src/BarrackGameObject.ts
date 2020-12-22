import GameObject from "./GameObject"
import GameScene from "./GameScene"

export default class BarrackGameObject extends GameObject {
  private readonly sprite: Phaser.GameObjects.Sprite

  private readonly _spawnX: number
  get spawnX(): number { return this._spawnX }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(scene: GameScene, x: number, faceLeft: boolean) {
    super(scene)
    this.sprite = this.scene.add.sprite(x, this.scene.groundPos - 32, "barrack")
    this.sprite.setScale(0.5, 0.5)
    this._spawnX = x
  }

  static preload(scene: GameScene): void {
    scene.load.image("barrack", "/images/barrack.png")
  }
}
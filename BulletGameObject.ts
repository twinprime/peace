import GameObject from "./GameObject"
import GameScene from "./GameScene"

export default class BulletGameObject extends GameObject {
  private _sprite: Phaser.GameObjects.Sprite

  get sprite(): Phaser.GameObjects.Sprite { return this._sprite }

  constructor(scene: GameScene, readonly physicsGroup: Phaser.Physics.Arcade.Group) {
    super(scene)
  }

  create(x: number, y: number, 
         velocityX: number, velocityY: number): void {
    this._sprite = this.scene.add.sprite(x, y, "bullet")
    this.physicsGroup.add(this._sprite)
    const body = this._sprite.body as Phaser.Physics.Arcade.Body
    body.setAllowGravity(false)
    body.setVelocity(velocityX, velocityY)
  }

  remove() {
    this.physicsGroup.remove(this._sprite)
    this._sprite.destroy()
  }
}
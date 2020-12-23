import GameScene from "./GameScene"
import PhysicsBodyGameObject from "./PhysicsBodyGameObject"

export default class BulletGameObject extends PhysicsBodyGameObject {
  private readonly _sprite: Phaser.GameObjects.Sprite

  get sprite(): Phaser.GameObjects.Sprite { return this._sprite }

  constructor(scene: GameScene, owner: number, 
              readonly physicsGroup: Phaser.Physics.Arcade.Group, 
              x: number, y: number, 
              velocityX: number, velocityY: number) {
    super(scene, owner)
    this._sprite = this.scene.add.sprite(x, y, this.owner > 0 ? "bullet-blue" : "bullet-red")
    this._sprite.setDepth(200)
    this.physicsGroup.add(this._sprite)
    const body = this._sprite.body as Phaser.Physics.Arcade.Body
    body.setAllowGravity(false)
    body.setVelocity(velocityX, velocityY)

    this.mainBody = body
  }

  remove(): void {
    this.physicsGroup.remove(this._sprite)
    this._sprite.destroy()
  }

  static preload(scene: GameScene): void {
    scene.load.image("bullet-red", "/images/bullet-red.png")
    scene.load.image("bullet-blue", "/images/bullet-blue.png")
  }
}
import GameScene from "../GameScene"
import PhysicsBodyGameObject from "../PhysicsBodyGameObject"

export default class BulletGameObject extends PhysicsBodyGameObject {
  private readonly _sprite: Phaser.GameObjects.Sprite
  private startTime = 0

  get sprite(): Phaser.GameObjects.Sprite { return this._sprite }

  constructor(scene: GameScene, owner: number, 
              readonly physicsGroup: Phaser.Physics.Arcade.Group,
              readonly duration: number,
              x: number, y: number, 
              velocityX: number, velocityY: number,
              scale?: number) {
    super(scene, owner)
    this._sprite = this.scene.add.sprite(x, y, this.owner > 0 ? "bullet-blue" : "bullet-red")
    this._sprite.setDepth(200)
    if (scale) this._sprite.setScale(scale, scale)
    this.physicsGroup.add(this._sprite)
    const body = this._sprite.body as Phaser.Physics.Arcade.Body
    body.setAllowGravity(false)
    body.setVelocity(velocityX, velocityY)

    this.mainBody = body
  }

  remove(): void {
    this._sprite.destroy()
    this.removed()
  }

  update(time: number): void {
    if (this.startTime == 0) this.startTime = time
    else if ((time - this.startTime) > this.duration) this.remove()
    else {
      if (this._sprite.x < 0 || this._sprite.x > this.scene.worldWidth || 
        this._sprite.y < 0 || this._sprite.y > this.scene.worldHeight) this.remove()
    }
  }

  static preload(scene: GameScene): void {
    scene.load.image("bullet-red", "/images/bullet-red.png")
    scene.load.image("bullet-blue", "/images/bullet-blue.png")
  }
}
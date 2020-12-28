import GameScene from "../GameScene"
import PhysicsBodyGameObject from "../PhysicsBodyGameObject"

export enum BulletType {
  Chopper, AA, Bunker, Tank, Rifle
}

export class BulletGameObject extends PhysicsBodyGameObject {
  private static typeToScale = new Map<BulletType, number>([
    [BulletType.Chopper, 0.75], [BulletType.AA, 1], [BulletType.Bunker, 1.5], 
    [BulletType.Tank, 1.5], [BulletType.Rifle, 0.5]])

  private readonly _sprite: Phaser.GameObjects.Sprite
  private startTime = 0

  get sprite(): Phaser.GameObjects.Sprite { return this._sprite }

  constructor(scene: GameScene, owner: number, 
              readonly physicsGroup: Phaser.Physics.Arcade.Group,
              readonly duration: number,
              x: number, y: number, 
              velocityX: number, velocityY: number,
              readonly bulletType: BulletType) {
    super(scene, owner)
    this._sprite = this.scene.add.sprite(x, y, this.owner > 0 ? "bullet-blue" : "bullet-red")
    this._sprite.setDepth(200)
    this.addWrapperProperty(this._sprite)
    const scale = BulletGameObject.typeToScale.get(bulletType)
    this._sprite.setScale(scale, scale)
    this.physicsGroup.add(this._sprite)
    const body = this._sprite.body as Phaser.Physics.Arcade.Body
    body.setAllowGravity(false)
    body.setVelocity(velocityX, velocityY)
    body.mass = 0.01

    this.mainBody = body
  }

  remove(): void {
    this._sprite.destroy()
    this.removed()
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(time: number, delta: number): void {
    super.update(time, delta)
    if (this.startTime == 0) this.startTime = time
    else if ((time - this.startTime) > this.duration) this.remove()
    else {
      if (this._sprite.x < 0 || this._sprite.x > this.scene.worldWidth || 
        this._sprite.y < 0 || this._sprite.y > this.scene.worldHeight) this.remove()
    }
  }

  protected setVisible(visible: boolean): void {
    this._sprite.setVisible(visible)
  }

  static preload(scene: GameScene): void {
    scene.load.image("bullet-red", "/images/bullet-red.png")
    scene.load.image("bullet-blue", "/images/bullet-blue.png")
  }
}
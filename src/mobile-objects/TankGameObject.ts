import { ScanStopShootBehaviour } from "../behaviours/ScanStopShootBehaviour"
import GameScene from "../GameScene"
import PhysicsBodyGameObject from "../PhysicsBodyGameObject"
import { BulletType } from "./BulletGameObject"

export default class TankGameObject extends PhysicsBodyGameObject {
  private static readonly scanRange = 300
  private static readonly bulletDuration = 5000
  private static readonly bulletDamageMap = new Map<BulletType, number>([
    [BulletType.Chopper, 10], [BulletType.Tank, 50], 
    [BulletType.Bunker, 50], [BulletType.Rifle, 1]])

  private readonly sprite: Phaser.Physics.Arcade.Sprite

  constructor(scene: GameScene, owner: number, x: number, private readonly speed: number) {
    super(scene, owner)
    
    this.sprite = this.scene.physics.add.sprite(x, this.scene.groundPos - 20, "tank")
    this.sprite.setScale(0.5, 0.5)
    this.sprite.setDepth(1)
    const body = this.sprite.body as Phaser.Physics.Arcade.Body
    body.setAllowGravity(false)
    this.mainBody = body

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const superThis = this
    this.behaviour = new ScanStopShootBehaviour(this, 2000, 2000, {
      findTarget() { return superThis.scene.gameMap.getObjectsFrom(
        superThis, superThis.owner * -1, 92, TankGameObject.scanRange,
        (obj) => obj.y2 > superThis.scene.groundPos - superThis.height).size > 0 },
      isMoving() { return (superThis.sprite.body as Phaser.Physics.Arcade.Body).velocity.x != 0 },
      stop() { superThis.move(0, superThis.owner < 0) },
      move() { superThis.move(superThis.speed * superThis.owner, superThis.owner < 0) },
      createBullet() { superThis.scene.createBullet(superThis.owner, TankGameObject.bulletDuration,
        superThis.sprite.x + 46 * superThis.owner, superThis.sprite.y, 
        100 * superThis.owner, 0, BulletType.Tank) }
    })

    this.addBulletResponse(this.sprite, TankGameObject.bulletDamageMap)
  }

  remove(): void {
    this.sprite.destroy()
    this.removed()
  }

  protected setVisible(visible: boolean): void {
    this.sprite.setVisible(visible)
  }

  move(velocityX: number, faceLeft: boolean): void {
    const body = this.sprite.body as Phaser.Physics.Arcade.Body
    body.setVelocityX(velocityX)

    if (velocityX > 0) this.sprite.setFlipX(true)
    else this.sprite.setFlipX(!faceLeft)
  }

  static preload(scene: GameScene): void {
    scene.load.image("tank", "/images/tank.png")
  }

  static createIcon(scene: GameScene, x: number, y: number): Phaser.GameObjects.Sprite {
    const icon = scene.add.sprite(x, y, "tank")
    icon.setScale(0.35, 0.35)
    return icon
  }
}
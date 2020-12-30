import { ScanStopShootBehaviour } from "../behaviours/ScanStopShootBehaviour"
import GameObject from "../GameObject"
import GameScene from "../GameScene"
import SpriteGameObject from "../SpriteGameObject"
import { BulletType } from "./BulletGameObject"

export default class MissileLauncherGameObject extends SpriteGameObject {
  private static readonly scanRangeSq = 1000 * 1000
  private static readonly missileDuration = 10000
  private static readonly bulletDamageMap = new Map<BulletType, number>([
    [BulletType.Chopper, 10], [BulletType.Tank, 50], [BulletType.Bunker, 50], [BulletType.Rifle, 1]])

  constructor(scene: GameScene, owner: number, x: number, private readonly speed: number) {
    super(scene, owner)
    
    this.mainSprite = this.scene.physics.add.sprite(x, this.scene.groundPos - 32, "missile-launcher")
    this.mainSprite.setDepth(1)
    const body = this.mainSprite.body as Phaser.Physics.Arcade.Body
    body.setAllowGravity(false)

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const superThis = this
    this.behaviour = new ScanStopShootBehaviour(this, 2000, MissileLauncherGameObject.missileDuration + 5000, {
      findTarget() {
        const target = superThis.scene.gameMap.findChopper(superThis, MissileLauncherGameObject.scanRangeSq)
        if (target) return new Set([target])
        else return new Set()
      },
      isMoving() { return (superThis.mainSprite.body as Phaser.Physics.Arcade.Body).velocity.x != 0 },
      stop() { superThis.move(0, superThis.owner < 0) },
      move() { superThis.move(superThis.speed * superThis.owner, superThis.owner < 0) },
      createBullet(targets: Set<GameObject>) {
        const target = targets.values().next()
        scene.createMissile(superThis.owner, MissileLauncherGameObject.missileDuration, 
          superThis.x1, superThis.y1 - 8, 
          300 * superThis.owner, -300, 450, target.value)
      }
    })

    this.addBulletResponse(this.sprite, MissileLauncherGameObject.bulletDamageMap)
  }

  move(velocityX: number, faceLeft: boolean): void {
    const body = this.mainSprite.body as Phaser.Physics.Arcade.Body
    body.setVelocityX(velocityX)

    if (velocityX > 0) this.mainSprite.setFlipX(true)
    else this.mainSprite.setFlipX(!faceLeft)
  }

  static preload(scene: GameScene): void {
    scene.load.image("missile-launcher", "/images/missile-launcher.png")
  }
}
import { ScanStopShootBehaviour } from "../behaviours/ScanStopShootBehaviour"
import GameObject from "../GameObject"
import GameScene from "../GameScene"
import SpriteGameObject from "../SpriteGameObject"
import { BulletType } from "../mobile-objects/BulletGameObject"

export default class MissileBaseGameObject extends SpriteGameObject {
  private static readonly scanRangeSq = 1000 * 1000
  private static readonly missileDuration = 10000
  private static readonly bulletDamageMap = new Map<BulletType, number>([
    [BulletType.Chopper, 10], [BulletType.Tank, 20], [BulletType.Bunker, 10], [BulletType.Rifle, 1]])

  constructor(scene: GameScene, owner: number, x: number, physicsGroup: Phaser.Physics.Arcade.Group) {
    super(scene, owner)
    
    this.mainSprite = this.scene.physics.add.sprite(x, this.scene.groundPos - 32, "missile-base")
    this.addWrapperProperty(this.mainSprite)
    physicsGroup.add(this.mainSprite)

    if (owner > 0) this.mainSprite.setFlipX(true)
    this.mainSprite.setDepth(1)
    
    const body = this.mainSprite.body as Phaser.Physics.Arcade.Body
    body.setAllowGravity(false)

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const superThis = this
    this.behaviour = new ScanStopShootBehaviour(this, 2000, MissileBaseGameObject.missileDuration + 5000, {
      findTarget() {
        const target = superThis.scene.gameMap.findChopper(superThis, MissileBaseGameObject.scanRangeSq)
        if (target) return new Set([target])
        else return new Set()
      },
      isMoving() { return (superThis.mainSprite.body as Phaser.Physics.Arcade.Body).velocity.x != 0 },
      stop() { /* do nothing */ },
      move() { /* do nothing */ },
      createBullet(targets: Set<GameObject>) {
        const target = targets.values().next()
        scene.createMissile(superThis.owner, MissileBaseGameObject.missileDuration, 
          superThis.x1, superThis.y1 - 8, 
          300 * superThis.owner, -300, 450, target.value)
      }
    })

    this.addBulletResponse(this.sprite, MissileBaseGameObject.bulletDamageMap)
  }

  static preload(scene: GameScene): void {
    scene.load.image("missile-base", "/images/missile-base.png")
  }
}
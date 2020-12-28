import { ScanStopShootBehaviour } from "../behaviours/ScanStopShootBehaviour"
import GameScene from "../GameScene"
import { BulletType } from "../mobile-objects/BulletGameObject"
import SpriteGameObject from "../SpriteGameObject"

export default class BunkerGameObject extends SpriteGameObject {
  private static readonly scanRange = 500
  private static readonly bulletDuration = 5000
  private static readonly bulletDamageMap = new Map<BulletType, number>([
    [BulletType.Chopper, 10], [BulletType.Tank, 20], [BulletType.Bunker, 10], [BulletType.Rifle, 1]])

  constructor(scene: GameScene, owner: number, physicsGroup: Phaser.Physics.Arcade.Group, 
              x: number) {
    super(scene, owner)

    this.mainSprite = this.scene.physics.add.sprite(x, this.scene.groundPos - 16, "bunker", 0)
    this.mainSprite.setDepth(10)
    if (this.owner < 0) this.mainSprite.setFlipX(true)
    physicsGroup.add(this.mainSprite)
    const body = this.mainSprite.body as Phaser.Physics.Arcade.Body
    body.setAllowGravity(false)
    this.addWrapperProperty(this.mainSprite)

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const superThis = this
    this.behaviour = new ScanStopShootBehaviour(this, 2000, 2000, {
      findTarget() { return superThis.scene.gameMap.getObjectsFrom(
        superThis, superThis.owner * -1, 16, BunkerGameObject.scanRange,
        (obj) => obj.y2 > superThis.scene.groundPos - superThis.height).size > 0 },
      isMoving() { return (superThis.mainSprite.body as Phaser.Physics.Arcade.Body).velocity.x != 0 },
      stop() { /* do nothing */ },
      move() { /* do nothing */ },
      createBullet() { superThis.scene.createBullet(superThis.owner, BunkerGameObject.bulletDuration,
        superThis.mainSprite.x + 16 * superThis.owner, superThis.mainSprite.y, 
        100 * superThis.owner, 0, BulletType.Bunker) }
    })

    this.addBulletResponse(this.mainSprite, BunkerGameObject.bulletDamageMap)

    this.showHealthBar(16)
  }

  static preload(scene: GameScene): void {
    scene.load.image("bunker", "/images/bunker.png")
  }
}
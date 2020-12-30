import { ScanStopShootBehaviour } from "../behaviours/ScanStopShootBehaviour"
import GameScene from "../GameScene"
import { BulletType } from "./BulletGameObject"
import HumanGameObject from "./HumanGameObject"

export default class SoldierGameObject extends HumanGameObject {
  static readonly TYPE = "soldier"

  private static readonly bulletDamageMap = new Map<BulletType, number>([
    [BulletType.Tank, 100], [BulletType.Bunker, 100], 
    [BulletType.Chopper, 100], [BulletType.Rifle, 35]])

  private static readonly bulletDuration = 3000
  private static readonly scanRange = 200

  constructor(readonly scene: GameScene, owner: number, x: number, private readonly speed: number,
              boardableObjectGroup?: Phaser.Physics.Arcade.Group) {
    super(SoldierGameObject.TYPE, scene, owner, {
      spriteImage: "soldier-stand",
      animWalk: "soldier-walk",
      animDie: "soldier-die",
      bodyWidth: 29,
      bodyHeight: 44,
      spriteHt: 44,
      spriteScale: 0.5,
      defaultFaceLeft: true
    }, x, boardableObjectGroup)

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const superThis = this
    this.behaviour = new ScanStopShootBehaviour(this, 2000, 2000, {
      findTarget() { return superThis.scene.gameMap.getObjectsFrom(
        superThis, superThis.owner * -1, 92, SoldierGameObject.scanRange,
        (obj) => obj instanceof SoldierGameObject) },
      isMoving() { return (superThis.sprite.body as Phaser.Physics.Arcade.Body).velocity.x != 0 },
      stop() { setTimeout(() => { if (!superThis.dying) superThis.move(0, superThis.owner < 0) }, Math.random() * 1000) },
      move() { superThis.move(superThis.speed * superThis.owner, superThis.owner < 0) },
      createBullet() { superThis.scene.createBullet(superThis.owner, SoldierGameObject.bulletDuration,
        superThis.sprite.x + 15 * superThis.owner, superThis.sprite.y, 
        100 * superThis.owner, 0, BulletType.Rifle) }
    })

    this.addBulletResponse(this.sprite, SoldierGameObject.bulletDamageMap)
  }

  static preload(scene: GameScene): void {
    scene.load.image("soldier-stand", "/images/soldier-stand.png")
    scene.load.spritesheet("soldier-walk", "/images/soldier-walk.png", { frameWidth: 29, frameHeight: 44 })
    scene.load.spritesheet("soldier-die", "/images/soldier-die.png", { frameWidth: 35, frameHeight: 42 })
  }

  static createCommon(scene: GameScene): void {
    scene.anims.create({
      key: "soldier-walk",
      frames: scene.anims.generateFrameNumbers("soldier-walk", { start: 0, end: 5 }),
      repeat: -1,
      frameRate: 6
    })

    scene.anims.create({
      key: "soldier-die",
      frames: scene.anims.generateFrameNumbers("soldier-die", { start: 0, end: 4 }),
      frameRate: 6
    })
  }

  static createIcon(scene: GameScene, x: number, y: number): Phaser.GameObjects.Sprite {
    return scene.add.sprite(x, y, "soldier-stand")
  }
}
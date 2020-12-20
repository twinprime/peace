import GameScene from "./GameScene"
import HumanGameObject from "./HumanGameObject"

export default class CivilianGameObject extends HumanGameObject {
  static readonly TYPE = "civilian"

  constructor(readonly scene: GameScene, 
              private readonly homePos: number,
              private readonly homeCallback: (obj: CivilianGameObject) => void) {
    super(CivilianGameObject.TYPE, scene, {
      spriteImage: "civilian",
      animWalk: "civilian-walk",
      animDie: "civilian-die",
      spriteHt: 256,
      spriteScale: 0.0625,
      defaultFaceLeft: false
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(time: number, delta: number): void {
    const body = this.sprite.body as Phaser.Physics.Arcade.Body
    if (body.x < this.homePos) {
      this.homeCallback(this)
      this.sprite.destroy()
    }
  }

  wave(): void {
    this.move(0, true)
    this.sprite.anims.play("civilian-wave")
  }

  static preload(scene: GameScene): void {
    scene.load.spritesheet("civilian", "/images/civilian.png", { frameWidth: 128, frameHeight: 256 })
    scene.load.spritesheet("civilian-die", "/images/civilian-die.png", { frameWidth: 128, frameHeight: 256 })
    scene.load.spritesheet("civilian-wave", "/images/civilian-wave.png", { frameWidth: 128, frameHeight: 256 })
  }

  static createCommon(scene: GameScene): void {
    scene.anims.create({
      key: "civilian-walk",
      frames: scene.anims.generateFrameNumbers("civilian", { start: 1, end: 4 }),
      repeat: -1,
      frameRate: 6
    })

    scene.anims.create({
      key: "civilian-die",
      frames: scene.anims.generateFrameNumbers("civilian-die", { start: 0, end: 3 }),
      frameRate: 6
    })

    scene.anims.create({
      key: "civilian-wave",
      frames: scene.anims.generateFrameNumbers("civilian-wave", { start: 0, end: 3 }),
      repeat: -1,
      yoyo: true,
      frameRate: 6
    })
  }

  static createIcon(scene: GameScene, x: number, y: number): Phaser.GameObjects.Sprite {
    return scene.add.sprite(x, y, "civilian", 0).setScale(0.175, 0.175)
  }
}
import GameObject from "./GameObject"
import GameScene from "./GameScene"

export default class SoldierGameObject extends GameObject {
  private sprite: Phaser.Physics.Arcade.Sprite

  constructor(readonly scene: GameScene) {
    super(scene)
  }

  create(x: number): void {
    this.sprite = this.scene.physics.add.sprite(x, this.scene.groundPos - 11, "soldier-stand")
    this.sprite.setScale(0.5, 0.5)
    this.sprite.setDepth(99)
    const body = this.sprite.body as Phaser.Physics.Arcade.Body
    body.setAllowGravity(false)
  }

  move(velocityX: number, faceLeft: boolean): void {
    const body = this.sprite.body as Phaser.Physics.Arcade.Body
    body.setVelocityX(velocityX)

    if (velocityX != 0) {
      this.sprite.anims.play("soldier-walk")
      if (velocityX > 0) this.sprite.setFlipX(true)
      else this.sprite.setFlipX(false)
    } else {
      if (this.sprite.anims.isPlaying) {
        this.sprite.anims.stop()
      }
      this.sprite.setFlipX(!faceLeft)
    }
  }

  die(): void {
    const body = this.sprite.body as Phaser.Physics.Arcade.Body
    body.setVelocityX(0)
    this.sprite.anims.play("soldier-die")
    this.sprite.once("animationcomplete", () => {
      this.sprite.destroy()
    })
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
import GameObject from "./GameObject"
import GameScene from "./GameScene"

export default class HumanGameObject extends GameObject {
  protected sprite: Phaser.Physics.Arcade.Sprite
  private readonly spriteHalfHt: number

  constructor(readonly scene: GameScene, 
              private readonly spriteStand: string,
              private readonly animWalk: string,
              private readonly animDie: string,
              spriteHt: number,
              private readonly spriteScale: number,
              private readonly defaultFaceLeft: boolean) {
    super(scene)
    this.spriteHalfHt = spriteHt * spriteScale / 2
  }

  create(x: number): void {
    this.sprite = this.scene.physics.add.sprite(x, this.scene.groundPos - this.spriteHalfHt, this.spriteStand, 0)
    this.sprite.setScale(this.spriteScale, this.spriteScale)
    this.sprite.setDepth(99)
    const body = this.sprite.body as Phaser.Physics.Arcade.Body
    body.setAllowGravity(false)
  }

  move(velocityX: number, faceLeft: boolean): void {
    const body = this.sprite.body as Phaser.Physics.Arcade.Body
    body.setVelocityX(velocityX)

    if (velocityX != 0) {
      this.sprite.anims.play(this.animWalk)
      if (velocityX > 0) this.sprite.setFlipX(this.defaultFaceLeft)
      else this.sprite.setFlipX(!this.defaultFaceLeft)
    } else {
      if (this.sprite.anims.isPlaying) {
        this.sprite.anims.stop()
      }
      this.sprite.setFlipX((!faceLeft && this.defaultFaceLeft) || (faceLeft && !this.defaultFaceLeft))
    }
  }

  die(): void {
    const body = this.sprite.body as Phaser.Physics.Arcade.Body
    body.setVelocityX(0)
    this.sprite.anims.play(this.animDie)
    this.sprite.once("animationcomplete", () => {
      this.sprite.destroy()
    })
  }
}
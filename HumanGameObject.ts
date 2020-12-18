import GameObject from "./GameObject"
import GameScene from "./GameScene"

export default class HumanGameObject extends GameObject {
  private sprite: Phaser.Physics.Arcade.Sprite

  constructor(readonly scene: GameScene, 
              private readonly spriteStand: string,
              private readonly animWalk: string,
              private readonly animDie: string) {
    super(scene)
  }

  create(x: number): void {
    this.sprite = this.scene.physics.add.sprite(x, this.scene.groundPos - 11, this.spriteStand)
    this.sprite.setScale(0.5, 0.5)
    this.sprite.setDepth(99)
    const body = this.sprite.body as Phaser.Physics.Arcade.Body
    body.setAllowGravity(false)
  }

  move(velocityX: number, faceLeft: boolean): void {
    const body = this.sprite.body as Phaser.Physics.Arcade.Body
    body.setVelocityX(velocityX)

    if (velocityX != 0) {
      this.sprite.anims.play(this.animWalk)
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
    this.sprite.anims.play(this.animDie)
    this.sprite.once("animationcomplete", () => {
      this.sprite.destroy()
    })
  }
}
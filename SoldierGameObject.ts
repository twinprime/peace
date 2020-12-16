import GameObject from "./GameObject"
import GameScene from "./GameScene"

export default class SoldierGameObject extends GameObject {
  private sprite: Phaser.GameObjects.Sprite

  constructor(readonly scene: GameScene) {
    super(scene)
  }

  create(x: number): void {
    this.sprite = this.scene.physics.add.sprite(x, this.scene.groundPos - 11, "soldier-stand")
    this.sprite.setScale(0.5, 0.5)
    this.scene.physics.add.collider(this.sprite, this.scene.platforms)
  }

  walk(velocityX: number, faceLeft: boolean): void {
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
}
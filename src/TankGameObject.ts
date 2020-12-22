import GameObject from "./GameObject"
import GameScene from "./GameScene"

export default class TankGameObject extends GameObject {
  private readonly sprite: Phaser.Physics.Arcade.Sprite
  private faceLeft: boolean

  constructor(scene: GameScene, x: number) {
    super(scene)
    
    this.sprite = this.scene.physics.add.sprite(x, this.scene.groundPos - 28, "tank")
    this.sprite.setScale(0.7, 0.7)
    this.sprite.setDepth(1)
    const body = this.sprite.body as Phaser.Physics.Arcade.Body
    body.setAllowGravity(false)
  }

  move(velocityX: number, faceLeft: boolean): void {
    this.faceLeft = faceLeft

    const body = this.sprite.body as Phaser.Physics.Arcade.Body
    body.setVelocityX(velocityX)

    if (velocityX > 0) this.sprite.setFlipX(true)
    else this.sprite.setFlipX(!faceLeft)
  }

  die(): void {
    const body = this.sprite.body as Phaser.Physics.Arcade.Body
    body.setVelocityX(0)
    const explosion = this.scene.add.sprite(this.sprite.x + (this.faceLeft ? 16 : - 16), 
                                            this.sprite.y, "explode", 0)
    explosion.setDepth(1)
    explosion.anims.play("explode")
    explosion.once("animationcomplete", () => {
      this.sprite.destroy()
      explosion.destroy()
    })
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
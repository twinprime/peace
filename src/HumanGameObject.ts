import GameObject from "./GameObject"
import GameScene from "./GameScene"
import HumanBoardable from "./HumanBoardable"

export default class HumanGameObject extends GameObject {
  protected readonly sprite: Phaser.Physics.Arcade.Sprite
  private readonly spriteHalfHt: number

  constructor(readonly type: string,
              readonly scene: GameScene,
              owner: number,
              private readonly config: {
                spriteImage: string,
                bodyOffsetX?: number,
                bodyOffsetY?: number,
                bodyWidth?: number,
                bodyHeight?: number,
                animWalk: string,
                animDie: string,
                spriteHt: number,
                spriteScale: number,
                defaultFaceLeft: boolean
              },
              x: number, boardableObjectGroup?: Phaser.Physics.Arcade.Group) {
    super(scene, owner)
    this.spriteHalfHt = this.config.spriteHt * this.config.spriteScale / 2
    this.sprite = this.scene.physics.add.sprite(x, this.scene.groundPos - this.spriteHalfHt, this.config.spriteImage, 0)
    this.sprite.setScale(this.config.spriteScale, this.config.spriteScale)
    this.sprite.setDepth(99)
    const body = this.sprite.body as Phaser.Physics.Arcade.Body
    body.setAllowGravity(false)
    if (this.config.bodyOffsetX || this.config.bodyOffsetY) {
      body.setOffset(this.config.bodyOffsetX, this.config.bodyOffsetY)
    }
    if (this.config.bodyWidth) {
      body.setSize(this.config.bodyWidth, this.config.bodyHeight, false)
    }

    if (boardableObjectGroup) {
      this.scene.physics.add.overlap(this.sprite, boardableObjectGroup, (me, other) => {
        const boardable = this.getWrapper(other) as unknown as HumanBoardable
        if (boardable.board(this)) {
          this.sprite.setActive(false).setVisible(false)
          body.setEnable(false)
        }
      })
    }
  }

  get width(): number { 
    return (this.sprite.body as Phaser.Physics.Arcade.Body).width 
  }

  get walkSpeed(): number { return 10 }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(time: number, delta: number): void {
    // do nothing by default
  }

  disembark(x: number, velocityX: number): void {
    this.moveTo(x, this.scene.groundPos - this.spriteHalfHt)
    this.move(velocityX, this.config.defaultFaceLeft)
    this.sprite.setActive(true).setVisible(true)
    const body = this.sprite.body as Phaser.Physics.Arcade.Body
    body.setEnable(true)
  }

  moveTo(x: number, y: number): void {
    this.sprite.setX(x)
    this.sprite.setY(y)
  }

  move(velocityX: number, faceLeft = false): void {
    const body = this.sprite.body as Phaser.Physics.Arcade.Body
    body.setVelocityX(velocityX)

    if (velocityX != 0) {
      this.sprite.anims.play(this.config.animWalk)
      if (velocityX > 0) this.sprite.setFlipX(this.config.defaultFaceLeft)
      else this.sprite.setFlipX(!this.config.defaultFaceLeft)
    } else {
      if (this.sprite.anims.isPlaying) {
        this.sprite.anims.stop()
      }
      this.sprite.setFlipX((!faceLeft && this.config.defaultFaceLeft) || 
        (faceLeft && !this.config.defaultFaceLeft))
    }
  }

  die(): void {
    const body = this.sprite.body as Phaser.Physics.Arcade.Body
    body.setVelocityX(0)
    this.sprite.anims.play(this.config.animDie)
    this.sprite.once("animationcomplete", () => {
      this.sprite.destroy()
    })
  }
}
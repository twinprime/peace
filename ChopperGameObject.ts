import GameObject from "./GameObject"
import GameScene from "./GameScene"
import HealthBarGameObject from "./HealthBarGameObject"

export default class ChopperGameObject extends GameObject {
  private body: Phaser.Physics.Arcade.Body
  private tailSprite: Phaser.GameObjects.Sprite
  private bodySprite: Phaser.GameObjects.Sprite
  private spriteGp: Phaser.GameObjects.Group
  private facing = 0
  private maxSpeed = 600
  private acceleration = 600
  private drag = 300
  private health = 100
  private healthCallback?: ((health: number) => void)

  get sprite(): Phaser.GameObjects.Sprite {
    return this.bodySprite
  }

  constructor(scene: GameScene) {
    super(scene)
  }

  create(x: number, y: number, healthCallback?: ((health: number) => void)): void {
    this.spriteGp = this.scene.add.group()
    
    this.bodySprite = this.spriteGp.create(x, y, "chopper", 0) as Phaser.GameObjects.Sprite
    this.scene.physics.add.existing(this.bodySprite)
    this.body = this.bodySprite.body as Phaser.Physics.Arcade.Body
    this.body.setCollideWorldBounds(true)
    this.body.setAllowGravity(false)
    this.scene.physics.add.collider(this.bodySprite, this.scene.platforms)
    
    this.tailSprite = this.spriteGp.create(x - 32, y, "chopper", 1) as Phaser.GameObjects.Sprite
    this.tailSprite.setVisible(false)

    this.healthCallback = healthCallback

    this.scene.physics.add.overlap(this.bodySprite, this.scene.bullets, (me, bullet) => {
      this.scene.removeBullet(bullet)
      this.health -= 10
      if (this.health < 0) this.health = 0
      this.healthCallback?.(this.health)
    })
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys): void {
    this.updateTailPosition()

    if (cursors.down.isDown) {
      if (this.body.velocity.y < this.maxSpeed) {
        this.body.setAccelerationY(this.acceleration)
      } else {
        this.body.setAccelerationY(0)
      }
    } else if (cursors.up.isDown) {
      if (this.body.velocity.y > -this.maxSpeed) {
        this.body.setAccelerationY(-this.acceleration)
      } else {
        this.body.setAccelerationY(0)
      }
    } else {
      if (this.body.velocity.y > 0) {
        this.body.setAccelerationY(-this.drag)
      } else if (this.body.velocity.y < 0) {
        this.body.setAccelerationY(this.drag)
      } else this.body.setAccelerationY(0)
    }

    if (cursors.right.isDown) {
      this.changeFacing(1)
      if (this.body.velocity.x < this.maxSpeed) {
        this.body.setAccelerationX(this.acceleration)
      } else {
        this.body.setAccelerationX(0)
      }
    } else if (cursors.left.isDown) {
      this.changeFacing(-1)
      if (this.body.velocity.x > -this.maxSpeed) {
        this.body.setAccelerationX(-this.acceleration)
      } else {
        this.body.setAccelerationX(0)
      }
    } else {
      if (this.body.velocity.x > 0) {
        this.body.setAccelerationX(-this.drag)
      } else if (this.body.velocity.x < 0) {
        this.body.setAccelerationX(this.drag)
      } else {
        this.changeFacing(0)
        this.body.setAccelerationX(0)
      }
    }
  }

  private changeFacing(newFacing: number) {
    if (this.facing != newFacing) {
      if (newFacing != 0) {
        this.bodySprite.setTexture("chopper", 2)
        this.tailSprite.setVisible(true)
        if (newFacing == -1) {
          this.bodySprite.setFlipX(true)
          this.tailSprite.setFlipX(true)
          
        } if (newFacing == 1) {
          this.bodySprite.setFlipX(false)
          this.tailSprite.setFlipX(false)
        }
        this.bodySprite.setRotation(Phaser.Math.PI2 / 16 * newFacing)
        this.tailSprite.setRotation(Phaser.Math.PI2 / 16 * newFacing)
        this.updateTailPosition()
      } else {
        this.bodySprite.setTexture("chopper", 0)
        this.bodySprite.setRotation(0)
        this.tailSprite.setVisible(false)
        this.tailSprite.setRotation(0)
      }
      this.facing = newFacing
    }
  }

  private updateTailPosition() {
    if (this.facing != 0) {
      // 3 and 13 are adjustments for the rotation of the body
      this.tailSprite.setX(this.body.position.x + 16 - (32 - 3) * this.facing)
      this.tailSprite.setY(this.body.position.y + 16 - 13)
    }
  }
}
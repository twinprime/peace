import GameObject from "./GameObject"
import GameScene from "./GameScene"
import HelipadGameObject from "./HelipadGameObject"
import HumanGameObject from "./HumanGameObject"

enum ChopperState {
  Home = 0, Flying, Landed, Lowering
}

export default class ChopperGameObject extends GameObject {
  private state = ChopperState.Home
  private body: Phaser.Physics.Arcade.Body
  private tailSprite: Phaser.GameObjects.Sprite
  private bodySprite: Phaser.GameObjects.Sprite
  private spriteGp: Phaser.GameObjects.Group
  private facing = 0
  private maxSpeed = 600
  private acceleration = 600
  private health = 100
  private healthCallback?: ((health: number) => void)
  private keys: Record<"W"|"S"|"A"|"D"|"SPACE", Phaser.Input.Keyboard.Key>

  private helipad: HelipadGameObject
  private onGround = false
  private onPad = false

  private ropeObject: Phaser.GameObjects.Rectangle
  private ropeLength = 0
  private ropeVelocity = 0
  private maxRopeLength = 128
  private justLiftedObject = false
  private liftedObject: GameObject

  private _humansOnBoard: HumanGameObject[] = []
  private maxHumans = 10
  private boardCallback: (humans: HumanGameObject[]) => void

  get sprite(): Phaser.GameObjects.Sprite {
    return this.bodySprite
  }

  constructor(scene: GameScene) {
    super(scene)
    this.keys = this.scene.input.keyboard.addKeys("W,S,A,D,SPACE") as 
      Record<"W"|"S"|"A"|"D"|"SPACE", Phaser.Input.Keyboard.Key>
  }

  board(human: HumanGameObject): boolean {
    if (this._humansOnBoard.length < this.maxRopeLength) {
      this._humansOnBoard.push(human)
      this.boardCallback(this._humansOnBoard)
      return true
    }
    return false
  }

  setBoardCallback(boardCallback: ((humans: HumanGameObject[]) => void)): void {
    this.boardCallback = boardCallback
  }

  create(helipad: HelipadGameObject, liftableBodies: Phaser.Physics.Arcade.Group, 
         x: number, y: number, 
         healthCallback: ((health: number) => void)): void {
    this.helipad = helipad
    this.spriteGp = this.scene.add.group()
    
    this.bodySprite = this.spriteGp.create(x, y, "chopper", 0) as Phaser.GameObjects.Sprite
    this.bodySprite.setDepth(100)
    this.scene.physics.add.existing(this.bodySprite)
    this.body = this.bodySprite.body as Phaser.Physics.Arcade.Body
    this.body.setCollideWorldBounds(true)
    this.body.setAllowGravity(false)
    this.body.useDamping = true
    this.body.setDrag(0.9, 0.9)
    this.scene.physics.add.collider(this.bodySprite, this.scene.platforms)
    
    this.tailSprite = this.spriteGp.create(x - 32, y, "chopper", 1) as Phaser.GameObjects.Sprite
    this.tailSprite.setVisible(false)
    this.tailSprite.setDepth(100)

    this.healthCallback = healthCallback

    this.scene.physics.add.overlap(this.bodySprite, this.scene.bullets, (me, bullet) => {
      this.scene.removeBullet(bullet)
      this.health -= 10
      if (this.health < 0) this.health = 0
      this.healthCallback?.(this.health)
    })

    this.ropeObject = this.scene.add.rectangle(x, y, 1, 1, 0xFFFFFF)
    this.ropeObject.setDepth(5)
    this.scene.physics.add.existing(this.ropeObject)
    const ropeBody = this.ropeObject.body as Phaser.Physics.Arcade.Body
    ropeBody.setAllowGravity(false)
    this.scene.physics.add.overlap(this.ropeObject, liftableBodies, (me, liftable) => {
      if (this.ropeLength > 0 && this.ropeVelocity > 0 && !this.liftedObject) {
        this.ropeVelocity = 0
        this.liftedObject = this.getWrapper(liftable)
        this.justLiftedObject = true
      }
    })
  }

  update(time: number, delta: number): void {
    this.updateTailPosition()

    if (this.keys.S.isDown) {
      if (this.body.velocity.y < this.maxSpeed) {
        this.body.setAccelerationY(this.acceleration)
      } else {
        this.body.setAccelerationY(0)
      }
    } else if (this.keys.W.isDown) {
      if (this.body.velocity.y > -this.maxSpeed) {
        this.body.setAccelerationY(-this.acceleration)
      } else {
        this.body.setAccelerationY(0)
      }
    } else this.body.setAccelerationY(0)

    if (this.keys.D.isDown) {
      this.changeFacing(1)
      if (this.body.velocity.x < this.maxSpeed) {
        this.body.setAccelerationX(this.acceleration)
      } else {
        this.body.setAccelerationX(0)
      }
    } else if (this.keys.A.isDown) {
      this.changeFacing(-1)
      if (this.body.velocity.x > -this.maxSpeed) {
        this.body.setAccelerationX(-this.acceleration)
      } else {
        this.body.setAccelerationX(0)
      }
    } else this.body.setAccelerationX(0)

    this.onGround = false

    let onPad = false

    if (this.body.acceleration.x == 0 && this.body.acceleration.y == 0) {
      if (this.facing != 0 && Math.abs(this.body.velocity.x) < 2) this.changeFacing(0)

      if (this.facing == 0) {
        if (this.body.y == (this.scene.groundPos - 32)) {
          this.onGround = true
        } else if ((this.body.x + 32) >= this.helipad.minX && 
                   (this.body.x + 32) <= this.helipad.maxX && 
                   this.body.y == (this.scene.groundPos - 32 - this.helipad.ht)) {
          onPad = true
        }
      }
    }

    if (onPad != this.onPad) {
      this.onPad = onPad
      this.helipad.chopperOnPad(this.onPad)
    }
    
    this.updateRope(delta)
  }

  private updateRope(delta: number) {
    if (!this.justLiftedObject && this.keys.SPACE.isDown) {
      if (!this.liftedObject && this.ropeVelocity == 0 && this.facing == 0) {
        this.ropeVelocity = 64
      } else if (this.liftedObject) {
        if (this.ropeObject.displayHeight < this.ropeLength) {
          this.liftedObject = undefined
          this.ropeVelocity = -64
        } else this.ropeVelocity = 64
      }
    } else if (!this.liftedObject && this.ropeLength > 0) {
      this.ropeVelocity = -64
    }

    if (this.justLiftedObject && this.keys.SPACE.isUp) this.justLiftedObject = false

    if (this.ropeVelocity != 0) {
      this.ropeLength += this.ropeVelocity * delta / 1000
      if (this.ropeLength < 0) {
        this.ropeLength = 0
        this.ropeVelocity = 0
      } else if (this.ropeLength > this.maxRopeLength) {
        this.ropeLength = this.maxRopeLength
        this.ropeVelocity = 0
      }
    }

    const ropeEnd = this.body.y + 16 + this.ropeLength
    if (ropeEnd > this.scene.groundPos) {
      this.ropeObject.displayHeight = this.scene.groundPos - this.body.y - 16
    } else this.ropeObject.displayHeight = this.ropeLength

    this.ropeObject.setX(this.body.x + 16)
    this.ropeObject.setY(this.body.y + 16 + this.ropeObject.displayHeight / 2)

    if (this.liftedObject) {
      const ropeEnd = this.ropeObject.getBottomCenter()
      this.liftedObject.moveTo(ropeEnd.x, ropeEnd.y)
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
      this.tailSprite.setX(this.body.x + 16 - (32 - 3) * this.facing)
      this.tailSprite.setY(this.body.y + 16 - 13)
    }
  }

  static preload(scene: GameScene): void {
    scene.load.spritesheet("chopper", "/images/chopper.png", { frameWidth: 32, frameHeight: 32 })
  }
}
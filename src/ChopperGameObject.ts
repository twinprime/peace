import CivilianGameObject from "./CivilianGameObject"
import GameObject from "./GameObject"
import GameScene from "./GameScene"
import HelipadGameObject from "./HelipadGameObject"
import HumanBoardable from "./HumanBoardable"
import HumanGameObject from "./HumanGameObject"
import SoldierGameObject from "./SoldierGameObject"

export default class ChopperGameObject extends GameObject implements HumanBoardable {
  private readonly body: Phaser.Physics.Arcade.Body
  private readonly tailSprite: Phaser.GameObjects.Sprite
  private readonly bodySprite: Phaser.GameObjects.Sprite
  private readonly spriteGp: Phaser.GameObjects.Group
  private facing = 0
  private maxSpeed = 600
  private acceleration = 600
  private health = 100
  private healthCallback?: ((health: number) => void)
  private keys: Record<"W"|"S"|"A"|"D"|"SPACE", Phaser.Input.Keyboard.Key>

  private readonly helipad: HelipadGameObject

  private _onGround = false
  get onGround(): boolean { return this._onGround }
  
  private onPad = false

  private readonly ropeObject: Phaser.GameObjects.Rectangle
  private ropeLength = 0
  private ropeVelocity = 0
  private maxRopeLength = 128
  private justLiftedObject = false
  private liftedObject: GameObject

  private readonly _humansOnBoard = new Map<string, HumanGameObject[]>()
  private readonly maxHumans = 10
  private boardCallback: (humans: Map<string, HumanGameObject[]>) => void
  private lastBoardTime = 0
  private lastDisembarkTime = 0
  private perBoardingTime = 1000

  get sprite(): Phaser.GameObjects.Sprite {
    return this.bodySprite
  }

  constructor(scene: GameScene, owner: number, 
              helipad: HelipadGameObject, liftableBodies: Phaser.Physics.Arcade.Group, 
              x: number, y: number, physiscsGroup: Phaser.Physics.Arcade.Group,
              healthCallback: ((health: number) => void)) {
    super(scene, owner)
    this.keys = this.scene.input.keyboard.addKeys("W,S,A,D,SPACE") as 
      Record<"W"|"S"|"A"|"D"|"SPACE", Phaser.Input.Keyboard.Key>
    this.helipad = helipad
    this.spriteGp = this.scene.add.group()
    
    this.bodySprite = this.spriteGp.create(x, y, "chopper", 0) as Phaser.GameObjects.Sprite
    this.bodySprite.setDepth(100)
    physiscsGroup.add(this.bodySprite)
    this.body = this.bodySprite.body as Phaser.Physics.Arcade.Body
    this.body.setCollideWorldBounds(true)
    this.body.setAllowGravity(false)
    this.body.useDamping = true
    this.body.setDrag(0.9, 0.9)
    this.scene.physics.add.collider(this.bodySprite, this.scene.platforms)
    this.addWrapperProperty(this.bodySprite)
    
    this.tailSprite = this.spriteGp.create(x - 32, y, "chopper", 1) as Phaser.GameObjects.Sprite
    this.tailSprite.setVisible(false)
    this.tailSprite.setDepth(100)

    this.healthCallback = healthCallback

    this.scene.physics.add.overlap(this.bodySprite, 
      this.scene.getBulletBodies(this.owner * -1), (me, bullet) => {
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

  get boardableGameObject(): Phaser.GameObjects.GameObject { return this.bodySprite }

  board(human: HumanGameObject): boolean {
    const time = Date.now()
    if (this._onGround && (time - this.lastBoardTime) > this.perBoardingTime &&
        this.countHumansOnBoard() < this.maxHumans) {
      this.lastBoardTime = time
      this.addHumansOnBoard(human)
      this.boardCallback(this._humansOnBoard)
      return true
    }
    return false
  }

  private countHumansOnBoard(type?: string) {
    let count = 0
    if (!type) this._humansOnBoard.forEach((humans) => count += humans.length)
    else {
      const humans = this._humansOnBoard.get(type)
      if (humans) count += humans.length
    }
    return count
  }

  private addHumansOnBoard(human: HumanGameObject) {
    let humans = this._humansOnBoard.get(human.type)
    if (!humans) {
      humans = []
      this._humansOnBoard.set(human.type, humans)
    }
    humans.push(human)
  }

  setBoardCallback(boardCallback: ((humans: Map<string, HumanGameObject[]>) => void)): void {
    this.boardCallback = boardCallback
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

    this._onGround = false

    let onPad = false

    if (this.body.acceleration.x == 0) {
      if (this.facing != 0 && Math.abs(this.body.velocity.x) < 2) this.changeFacing(0)

      if (this.facing == 0) {
        if (this.body.y == (this.scene.groundPos - 32)) {
          this._onGround = true
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

    this.updateOnBoard(time)
    
    this.updateRope(delta)
  }

  private updateOnBoard(time: number) {
    if ((this._onGround || this.onPad) && !this.liftedObject && this.keys.SPACE.isDown &&
        this.ropeVelocity == 0 && this.ropeLength == 0) {
      if ((time - this.lastDisembarkTime) >= this.perBoardingTime) {
        let h: HumanGameObject = undefined
        let dir = 1
        if (this._onGround) {
          const humans = this._humansOnBoard.get(SoldierGameObject.TYPE)
          if (humans) h = humans.pop()
        } else if (this.onPad) {
          const humans = this._humansOnBoard.get(CivilianGameObject.TYPE)
          if (humans) h = humans.pop()
          dir = -1
        }
        if (h) {
          this.lastDisembarkTime = time
          const xAdj = dir > 0 ? (32 + h.width / 2 + 2) : (-h.width/2 - 2)
          h.disembark(this.body.x + xAdj, h.walkSpeed * dir)
          this.boardCallback(this._humansOnBoard)
        }
      }
    }
  }

  private updateRope(delta: number) {
    if (!this._onGround && !this.onPad && !this.justLiftedObject && this.keys.SPACE.isDown) {
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
import GameScene from "../GameScene"
import HumanGameObject from "./HumanGameObject"

enum CivilianState {
  Move, Wave, Run, GoingHome
}

export default class CivilianGameObject extends HumanGameObject {
  static readonly TYPE = "civilian"

  private static readonly minStateDuration = 500
  private static readonly chopperLookInterval = 200
  private static readonly chopperWaveDistanceSq = 500*500
  private static readonly maxWanderDistance = 100
  private static readonly minBoardDistance = 300
  private static readonly wanderSpeedMin = 5
  private static readonly wanderSpeedMax = 10
  private static readonly runSpeed = 15

  private state = CivilianState.Move
  private lastLookForChopper = 0
  private lastStateChange = 0

  constructor(readonly scene: GameScene, owner: number,
              private readonly homePos: number,
              private readonly spawnPos: number, 
              boardableObjectGroup: Phaser.Physics.Arcade.Group,
              private readonly homeCallback: (obj: CivilianGameObject) => void) {
    super(CivilianGameObject.TYPE, scene, owner, {
      spriteImage: "civilian",
      animWalk: "civilian-walk",
      animDie: "civilian-die",
      spriteHt: 256,
      spriteScale: 0.0625,
      defaultFaceLeft: false
    }, spawnPos, boardableObjectGroup)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(time: number, delta: number): void {
    super.update(time, delta)
    
    const body = this.sprite.body as Phaser.Physics.Arcade.Body
    if (body.x < this.homePos) {
      this.homeCallback(this)
      this.sprite.destroy()
    }

    if (this.state != CivilianState.GoingHome) {
      if ((time - this.lastLookForChopper) > CivilianGameObject.chopperLookInterval) {
        this.lastLookForChopper = time
        if (!this.scene.chopper.onGround && !this.scene.chopper.dying) {
          const distSq = Phaser.Math.Distance.BetweenPointsSquared(body.position, this.scene.chopper.sprite)
          if (distSq <= CivilianGameObject.chopperWaveDistanceSq) {
            if (this.state != CivilianState.Wave &&
                (time - this.lastStateChange) > CivilianGameObject.minStateDuration) {
              this.wave(time)
            }
          } else if (this.state != CivilianState.Move &&
                    (time - this.lastStateChange) > CivilianGameObject.minStateDuration) {
            this.wander(time)
          }
        } else if (!this.scene.chopper.dying) {
          const d = body.x - this.scene.chopper.sprite.x
          if (Math.abs(d)  <= CivilianGameObject.minBoardDistance) {
            this.lastStateChange = time
            this.state = CivilianState.Run
            this.move(CivilianGameObject.runSpeed * -Math.sign(d))
          }
        } else if (this.state != CivilianState.Move) {
          this.wander(time)
        }
      }

      if (this.state == CivilianState.Move) {
        const d = body.x - this.spawnPos
        if (Math.abs(d) > CivilianGameObject.maxWanderDistance) {
          this.move(this.getWanderSpeed() * -Math.sign(d))
        }
      }
    }
  }

  disembark(x: number, velocityX: number): void {
    this.state = CivilianState.GoingHome
    super.disembark(x, velocityX)
  }

  wave(time: number): void {    
    this.lastStateChange = time
    this.state = CivilianState.Wave
    this.move(0, true)
    this.sprite.anims.play("civilian-wave")
  }

  wander(time: number): void {
    this.lastStateChange = time
    this.state = CivilianState.Move
    const dir = Math.random() > 0.5 ? 1 : -1
    this.move(this.getWanderSpeed() * dir)
  }

  private getWanderSpeed() {
    return CivilianGameObject.wanderSpeedMin + Math.random() *
     (CivilianGameObject.wanderSpeedMax - CivilianGameObject.wanderSpeedMin)
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
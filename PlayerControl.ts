import AAGunGameObject from "./AAGunGameObject"
import BarrackGameObject from "./BarrackGameObject"
import ChopperGameObject from "./ChopperGameObject"
import FactoryGameObject from "./FactoryGameObject"
import GameButton from "./GameButton"
import GameScene from "./GameScene"
import HealthBarGameObject from "./HealthBarGameObject"
import HelipadGameObject from "./HelipadGameObject"
import SoldierGameObject from "./SoldierGameObject"
import TankGameObject from "./TankGameObject"

export default class PlayerControl {
  private scene: GameScene
  private cash = 1000
  private cashText: Phaser.GameObjects.Text
  private factory: FactoryGameObject
  private barrack: BarrackGameObject
  private aaGunObjects: AAGunGameObject[] = []
  private tankObjects: TankGameObject[] = []
  private soliderObjects: SoldierGameObject[] = []
  private liftableBodies: Phaser.Physics.Arcade.Group

  private _chopper: ChopperGameObject
  get chopper(): ChopperGameObject { return this._chopper }
  
  constructor(scene: GameScene) {
    this.scene = scene

    const screenWidth = scene.sys.scale.gameSize.width

    new GameButton(scene, SoldierGameObject.createIcon(scene, screenWidth - 32, 32), () => {
      this.adjustCash(-10)
      this.buildSoldier()
    })
    new GameButton(scene, TankGameObject.createIcon(scene, screenWidth - 32, 69), () => {
      this.adjustCash(-500)
      this.buildTank()
    })

    let nextPos = 10 + 64

    const helipad = new HelipadGameObject(scene)
    helipad.create(scene.platforms, nextPos, false)
    nextPos += 64 + 15

    this.factory = new FactoryGameObject(scene)
    this.factory.create(nextPos + 128, false)
    nextPos += 256 + 15

    this.barrack = new BarrackGameObject(scene)
    this.barrack.create(nextPos + 32, false)
    nextPos += 64 + 15

    this.liftableBodies = this.scene.physics.add.group()
    
    nextPos += 100
    const aaGun = new AAGunGameObject(scene)
    aaGun.create(this.liftableBodies, nextPos + 16, 3 * Math.PI / 4, false)
    this.aaGunObjects.push(aaGun)
    nextPos += 32 + 15

    const healthBar = new HealthBarGameObject(scene)
    healthBar.create(10, 15, 100)

    const onBoardCountText = scene.add.text(10 + healthBar.width + 15, 10, "0")

    this.cashText = scene.add.text(10, healthBar.height + 20, `$${this.cash}`)
    this.cashText.setScrollFactor(0, 0)

    this._chopper = new ChopperGameObject(scene)
    this._chopper.create(helipad, this.liftableBodies, 
      helipad.center.x, helipad.center.y - 15, (health) => healthBar.health = health)
    this._chopper.setBoardCallback(humans => onBoardCountText.setText(`${humans.length}`))
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(time: number, delta: number): void {
    this._chopper.update(time, delta)
    this.aaGunObjects.forEach(gun => gun.update(time))
  }

  private adjustCash(amt: number) {
    this.cash += amt
    this.cashText.setText(`$${this.cash}`)
  }

  private buildTank() {
    const tank = new TankGameObject(this.scene)
    tank.create(this.factory.spawnX)
    tank.move(50, false)
    this.tankObjects.push(tank)
  }

  private buildSoldier() {
    const soldier = new SoldierGameObject(this.scene)
    soldier.create(this.barrack.spawnX)
    soldier.move(10, false)
    this.soliderObjects.push(soldier)
  }
}
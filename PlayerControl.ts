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

    this.cashText = scene.add.text(10, 25, `$${this.cash}`)

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
    
    nextPos += 100
    const aaGun = new AAGunGameObject(scene)
    aaGun.create(nextPos + 16, 3 * Math.PI / 4, false)
    this.aaGunObjects.push(aaGun)
    nextPos += 32 + 15

    const healthBar = new HealthBarGameObject(scene)
    healthBar.create(100)

    this._chopper = new ChopperGameObject(scene)
    this._chopper.create(helipad.center.x, helipad.center.y - 16, (health) => healthBar.health = health)
  }

  update(time: number, delta: number): void {
    this._chopper.update()
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
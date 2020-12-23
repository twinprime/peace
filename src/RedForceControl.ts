import AAGunGameObject from "./AAGunGameObject"
import BarrackGameObject from "./BarrackGameObject"
import ChopperGameObject from "./ChopperGameObject"
import FactoryGameObject from "./FactoryGameObject"
import GameScene from "./GameScene"
import HelipadGameObject from "./HelipadGameObject"
import SoldierGameObject from "./SoldierGameObject"
import TankGameObject from "./TankGameObject"

export default class RedForceControl {
  private scene: GameScene
  private factory: FactoryGameObject
  private barrack: BarrackGameObject
  private aaGunObjects: AAGunGameObject[] = []
  private tankObjects: TankGameObject[] = []
  private soliderObjects: SoldierGameObject[] = []

  private _chopper: ChopperGameObject
  get chopper(): ChopperGameObject { return this._chopper }
  
  constructor(scene: GameScene) {
    this.scene = scene

    let nextPos = this.scene.worldWidth - 10 - 64

    const helipad = new HelipadGameObject(scene, -1, scene.platforms, nextPos, true)
    nextPos -= 64 + 15

    this.factory = new FactoryGameObject(scene, -1, nextPos - 128, true)
    nextPos -= 256 + 15

    this.barrack = new BarrackGameObject(scene, -1, nextPos - 32)
    nextPos -= 64 + 15
    
    nextPos -= 100
    const gunBodies = scene.physics.add.group()
    const aaGun = new AAGunGameObject(scene, -1, gunBodies, nextPos - 16, Math.PI / 4)
    this.aaGunObjects.push(aaGun)
    nextPos -= 32 + 15

    setTimeout(() => this.buildSoldier(), 2000)
    setTimeout(() => this.buildTank(), 5000)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(time: number, delta: number): void {
    this.aaGunObjects.forEach(gun => gun.update(time))
  }

  private buildTank() {
    const tank = new TankGameObject(this.scene, -1, this.factory.spawnX)
    tank.move(-50, true)
    this.tankObjects.push(tank)
  }

  private buildSoldier() {
    const soldier = new SoldierGameObject(this.scene, -1, this.barrack.spawnX)
    soldier.move(-10, true)
    this.soliderObjects.push(soldier)
  }
}
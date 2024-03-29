import BarrackGameObject from "./static-objects/BarrackGameObject"
import ChopperGameObject from "./mobile-objects/ChopperGameObject"
import FactoryGameObject from "./static-objects/FactoryGameObject"
import ForceControl from "./ForceControl"
import GameScene from "./GameScene"
import HelipadGameObject from "./static-objects/HelipadGameObject"
import SoldierGameObject from "./mobile-objects/SoldierGameObject"
import TankGameObject from "./mobile-objects/TankGameObject"

export default class RedForceControl extends ForceControl {
  protected factory: FactoryGameObject
  protected barrack: BarrackGameObject
  protected tankObjects = new Set<TankGameObject>()
  protected soliderObjects = new Set<SoldierGameObject>()
  protected boardableBodies = undefined

  private _chopper: ChopperGameObject
  get chopper(): ChopperGameObject { return this._chopper }
  
  constructor(scene: GameScene) {
    super(scene, -1)

    let nextPos = this.scene.worldWidth - 10 - 64

    new HelipadGameObject(scene, -1, scene.platforms, nextPos, true)
    nextPos -= 64 + 15

    this.factory = new FactoryGameObject(scene, -1, nextPos - 128, true)
    nextPos -= 256 + 15

    this.barrack = new BarrackGameObject(scene, -1, nextPos - 32)
    nextPos -= 64 + 15

    nextPos -= 100
    const gunBodies = scene.physics.add.group()
    this.buildMissileBase(nextPos - 16, gunBodies)
    nextPos -= 32 + 15
    
    nextPos -= 50
    this.buildAAGun(nextPos - 16, gunBodies)
    nextPos -= 32 + 15

    this.buildBunker(2300, gunBodies)
    this.buildAAGun(2600, gunBodies)
    this.buildAAGun(2400, gunBodies)
    this.buildMissileBase(2700, gunBodies)

    setTimeout(() => this.buildSoldier(), 2000)
    setTimeout(() => this.buildTank(), 3000)
    setTimeout(() => this.buildTank(), 5000)
    setTimeout(() => this.buildMissileLauncher(), 7000)
    setTimeout(() => this.buildMissileLauncher(), 9000)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(time: number, delta: number): void {
    super.update(time, delta)
  }
}
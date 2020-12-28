import BarrackGameObject from "./static-objects/BarrackGameObject"
import FactoryGameObject from "./static-objects/FactoryGameObject"
import GameScene from "./GameScene"
import SoldierGameObject from "./mobile-objects/SoldierGameObject"
import TankGameObject from "./mobile-objects/TankGameObject"
import AAGunGameObject from "./static-objects/AAGunGameObject"
import BunkerGameObject from "./static-objects/BunkerGameObject"

export default abstract class ForceControl {
  protected abstract factory: FactoryGameObject
  protected abstract barrack: BarrackGameObject
  protected abstract boardableBodies: Phaser.Physics.Arcade.Group

  protected tankObjects = new Set<TankGameObject>()
  protected soliderObjects = new Set<SoldierGameObject>()
  protected aaGunObjects = new Set<AAGunGameObject>()
  protected bunkerObjects = new Set<BunkerGameObject>()

  constructor(protected readonly scene: GameScene, protected readonly owner: number) {}

  update(time: number, delta: number): void {
    this.soliderObjects.forEach(soldier => soldier.update(time, delta))
    this.tankObjects.forEach(tank => tank.update(time, delta))
    this.aaGunObjects.forEach(gun => gun.update(time, delta))
    this.bunkerObjects.forEach(b => b.update(time, delta))
  }

  protected buildAAGun(x: number, group: Phaser.Physics.Arcade.Group): void {
    const obj = new AAGunGameObject(this.scene, this.owner, group, x, 
      this.owner > 0 ? 3 * Math.PI / 4 : Math.PI / 4)
    this.aaGunObjects.add(obj)
    this.scene.gameMap.add(obj)
    obj.destroyCallback = () => {
      this.aaGunObjects.delete(obj)
      this.scene.gameMap.remove(obj)
    }
  }

  protected buildBunker(x: number, group: Phaser.Physics.Arcade.Group): void {
    const obj = new BunkerGameObject(this.scene, this.owner, group, x)
    this.bunkerObjects.add(obj)
    this.scene.gameMap.add(obj)
    obj.destroyCallback = () => {
      this.bunkerObjects.delete(obj)
      this.scene.gameMap.remove(obj)
    }
  }

  protected buildTank(): void {
    const obj = new TankGameObject(this.scene, this.owner, this.factory.spawnX, 50)
    obj.showHealthBar(50)
    obj.move(50 * this.owner, this.owner < 0)
    this.tankObjects.add(obj)
    this.scene.gameMap.add(obj)
    obj.destroyCallback = () => {
      this.tankObjects.delete(obj)
      this.scene.gameMap.remove(obj)
    }
  }

  protected buildSoldier(): void {
    const obj = new SoldierGameObject(this.scene, this.owner, this.barrack.spawnX, 10, this.boardableBodies)
    obj.showHealthBar(16)
    obj.move(10 * this.owner, this.owner < 0)
    this.soliderObjects.add(obj)
    this.scene.gameMap.add(obj)
    obj.destroyCallback = () => {
      this.soliderObjects.delete(obj)
      this.scene.gameMap.remove(obj)
    }
  }
}
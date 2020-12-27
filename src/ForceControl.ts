import BarrackGameObject from "./static-objects/BarrackGameObject"
import FactoryGameObject from "./static-objects/FactoryGameObject"
import GameScene from "./GameScene"
import SoldierGameObject from "./mobile-objects/SoldierGameObject"
import TankGameObject from "./mobile-objects/TankGameObject"

export default abstract class ForceControl {
  protected abstract factory: FactoryGameObject
  protected abstract barrack: BarrackGameObject
  protected abstract boardableBodies: Phaser.Physics.Arcade.Group

  protected tankObjects = new Set<TankGameObject>()
  protected soliderObjects = new Set<SoldierGameObject>()

  constructor(protected readonly scene: GameScene, protected readonly owner: number) {}

  update(time: number, delta: number): void {
    this.soliderObjects.forEach(soldier => soldier.update(time, delta))
    this.tankObjects.forEach(tank => tank.update(time))
  }

  protected buildTank(): void {
    const tank = new TankGameObject(this.scene, this.owner, this.factory.spawnX, 50)
    tank.move(50 * this.owner, this.owner < 0)
    this.tankObjects.add(tank)
    this.scene.gameMap.add(tank)
    tank.destroyCallback = () => {
      this.tankObjects.delete(tank)
      this.scene.gameMap.remove(tank)
    }
  }

  protected buildSoldier(): void {
    const soldier = new SoldierGameObject(this.scene, this.owner, this.barrack.spawnX, 10, this.boardableBodies)
    soldier.move(10 * this.owner, this.owner < 0)
    this.soliderObjects.add(soldier)
    this.scene.gameMap.add(soldier)
    soldier.destroyCallback = () => {
      this.soliderObjects.delete(soldier)
      this.scene.gameMap.remove(soldier)
    }
  }
}
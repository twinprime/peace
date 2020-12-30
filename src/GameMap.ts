import GameObject from "./GameObject"
import ChopperGameObject from "./mobile-objects/ChopperGameObject"

export default class GameMap {
  private static readonly updateInterval = 32

  private readonly cellCount: number
  private lastUpdate = 0
  private allGameObjects = new Map<number, Set<GameObject>>()
  private gameObjects = new Map<number, Set<GameObject>[]>()
  private gameObjectCells = new Map<GameObject, number[]>()
  
  constructor(readonly mapSize: number, readonly cellWidth: number) {
    this.cellCount = Math.ceil(mapSize / cellWidth)
    const redCells = new Array(this.cellCount)
    const blueCells = new Array(this.cellCount)
    for (let i = 0; i < this.cellCount; i++) {
      redCells[i] = new Set()
      blueCells[i] = new Set()
    }
    this.gameObjects.set(-1, redCells)
    this.gameObjects.set(1, blueCells)
    this.allGameObjects.set(-1, new Set())
    this.allGameObjects.set(1, new Set())
  }

  add(obj: GameObject): void {
    const objs = this.gameObjects.get(obj.owner)
    if (objs) {
      const cells = [this.getCell(obj.x1), this.getCell(obj.x2)]
      for (let i = cells[0]; i <= cells[1]; i++) objs[i].add(obj)
      this.gameObjectCells.set(obj, cells)
      this.allGameObjects.get(obj.owner).add(obj)
    }
  }

  remove(obj: GameObject): void {
    const objs = this.gameObjects.get(obj.owner)
    if (objs) {
      const cells = this.gameObjectCells.get(obj)
      for (let i = cells[0]; i <= cells[1]; i++) objs[i].delete(obj)
      this.allGameObjects.get(obj.owner).delete(obj)
    }
  }

  findObject(owner: number, predicate: (obj: GameObject) => boolean): GameObject {
    const objs = this.allGameObjects.get(owner).values()
    let obj = objs.next()
    while (!obj.done) {
      if (predicate(obj.value)) return obj.value as GameObject
      obj = objs.next()
    }
    return undefined
  }

  findChopper(subject: GameObject, distanceSq: number): ChopperGameObject {
    return this.findObject(-subject.owner, (obj) => {
      if (obj instanceof ChopperGameObject) {
        return Phaser.Math.Distance.BetweenPointsSquared(subject, obj) < distanceSq
      } else return false
    }) as ChopperGameObject
  }

  getObjectsWithin(owner: number, x1: number, x2: number, 
                   filter?: (obj: GameObject) => boolean): Set<GameObject> {
    const c1 = this.getCell(x1)
    const c2 = this.getCell(x2)
    const result = new Set<GameObject>()
    const objs = this.gameObjects.get(owner)
    for (let c = c1; c <= c2; c++) {
      objs[c].forEach(o => {
        if (this.overlaps(o.x1, o.x2, x1, x2) && (!filter || filter(o))) {
          result.add(o)
        }
      })
    }
    return result
  }

  getObjectsFrom(thisObj: GameObject, thatOwner: number, 
                 startOffset: number, distance: number,
                 filter?: (obj: GameObject) => boolean): Set<GameObject> {
    if (thisObj.owner > 0) {
      return this.getObjectsWithin(thatOwner, thisObj.x + startOffset,
         thisObj.x + startOffset + distance, filter)
    } else {
      return this.getObjectsWithin(thatOwner, thisObj.x - startOffset - distance, 
        thisObj.x - startOffset, filter)
    }
  }

  private overlaps(a1: number, a2: number, b1: number, b2: number) {
    return !(b2 < a1 || b1 > a2)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(time: number, delta: number): void {
    if ((time - this.lastUpdate) >= GameMap.updateInterval) {
      this.lastUpdate = time
      this.gameObjectCells.forEach((cells, obj) => {
        const c0 = this.getCell(obj.x1)
        const c1 = this.getCell(obj.x2)
        if (c0 != cells[0] || c1 != cells[1]) {
          for (let c = cells[0]; c <= cells[1]; c++) {
            this.gameObjects.get(obj.owner)[c].delete(obj)
          }
          cells[0] = c0
          cells[1] = c1
          for (let c = cells[0]; c <= cells[1]; c++) {
            this.gameObjects.get(obj.owner)[c].add(obj)
          }
        }
      })
    }
  }

  private getCell(x: number) { 
    return Math.min(this.cellCount - 1, Math.max(0, Math.floor(x / this.cellWidth))) 
  }
}
import GameObject from "./GameObject"

export default class GameMap {
  private static readonly updateInterval = 250

  private lastUpdate = 0
  private gameObjects = new Map<number, Set<GameObject>[]>()
  private gameObjectCells = new Map<GameObject, number[]>()

  constructor(readonly mapSize: number, readonly cellWidth: number) {
    const cells = Math.ceil(mapSize / cellWidth)
    const redCells = new Array(cells)
    const blueCells = new Array(cells)
    for (let i = 0; i < cells; i++) {
      redCells[i] = new Set()
      blueCells[i] = new Set()
    }
    this.gameObjects.set(-1, redCells)
    this.gameObjects.set(1, blueCells)
  }

  add(obj: GameObject): void {
    const objs = this.gameObjects.get(obj.owner)
    if (objs) {
      const cells = [this.getCell(obj.x1), this.getCell(obj.x2)]
      console.log(`Add object in ${cells[0]} - ${cells[1]}`)
      for (let i = cells[0]; i <= cells[1]; i++) objs[i].add(obj)
      this.gameObjectCells.set(obj, cells)
    }
  }

  remove(obj: GameObject): void {
    const objs = this.gameObjects.get(obj.owner)
    if (objs) {
      const cells = this.gameObjectCells.get(obj)
      for (let i = cells[0]; i <= cells[1]; i++) objs[i].delete(obj)
    }
  }

  getObjectsWithin(owner: number, x1: number, x2: number, 
                   filter?: (obj: GameObject) => boolean): Set<GameObject> {
    const c1 = this.getCell(x1)
    const c2 = this.getCell(x2)
    console.log(`get objects in ${c1} - ${c2}`)
    const result = new Set<GameObject>()
    const objs = this.gameObjects.get(owner)
    for (let c = c1; c <= c2; c++) {
      objs[c].forEach(o => {
        if (this.overlaps(o.x1, o.x2, x1, x2) && (!filter || filter(o))) result.add(o)
      })
    }
    return result
  }

  private overlaps(a1: number, a2: number, b1: number, b2: number) {
    return !(b2 < a1 || b1 > a2)
  }

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

  private getCell(x: number) { return Math.floor(x / this.cellWidth) }
}
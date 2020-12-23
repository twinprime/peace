import GameScene from "./GameScene"

interface WrappedPhaserGameObject {
  wrapper: GameObject
}

export default abstract class GameObject {
  constructor(readonly scene: GameScene, public owner: number) {}

  abstract readonly x1: number
  abstract readonly x2: number
  abstract readonly y1: number
  abstract readonly y2: number
  abstract readonly width: number
  abstract readonly height: number

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  moveTo(x: number, y: number): void { throw "object cannot be moved" }

  addWrapperProperty(obj: Phaser.GameObjects.GameObject): void {
    (obj as unknown as WrappedPhaserGameObject).wrapper = this
  }

  getWrapper(obj: Phaser.GameObjects.GameObject): GameObject {
    return (obj as unknown as WrappedPhaserGameObject).wrapper
  }
}

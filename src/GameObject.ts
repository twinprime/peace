import GameScene from "./GameScene"

interface WrappedPhaserGameObject {
  wrapper: GameObject
}

export default abstract class GameObject {
  protected _destroyCallback: () => void
  set destroyCallback(cb: () => void) { this._destroyCallback = cb }

  abstract readonly x1: number
  abstract readonly x2: number
  abstract readonly y1: number
  abstract readonly y2: number
  abstract readonly width: number
  abstract readonly height: number

  constructor(readonly scene: GameScene, public owner: number) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  moveTo(x: number, y: number): void { throw "object cannot be moved" }

  abstract remove(): void

  removed(): void { this._destroyCallback?.() }

  addWrapperProperty(obj: Phaser.GameObjects.GameObject): void {
    (obj as unknown as WrappedPhaserGameObject).wrapper = this
  }

  getWrapper(obj: Phaser.GameObjects.GameObject): GameObject {
    return (obj as unknown as WrappedPhaserGameObject).wrapper
  }
}

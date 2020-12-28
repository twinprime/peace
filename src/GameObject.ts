import Behaviour from "./Behaviour"
import GameScene from "./GameScene"
import { BulletGameObject, BulletType } from "./mobile-objects/BulletGameObject"
import HealthBarGraphics from "./ui-objects/HealthBarGraphics"

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

  protected _dying = false
  get dying(): boolean { return this._dying }

  protected _health = 100
  get health(): number { return this._health }
  protected healthCallback?: ((health: number) => void)
  private healthBar: HealthBarGraphics

  protected behaviour: Behaviour
  public behaviourActive = true

  constructor(readonly scene: GameScene, public owner: number) {}

  showHealthBar(width: number): void {
    if (!this.healthBar) {
      this.healthBar = new HealthBarGraphics(this.scene, width, 3)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(time: number, delta: number): void {
    this.healthBar?.draw(this.x1 + (this.width - this.healthBar.width) / 2, this.y1 - 5, this._health)
    if (this.behaviourActive) this.behaviour?.update(time)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  moveTo(x: number, y: number): void { throw "object cannot be moved" }

  abstract remove(): void

  removed(): void { 
    this._destroyCallback?.() 
  }

  protected beforeDie(): void {
    this._dying = true
    this.healthBar?.graphics?.destroy()
  }

  die(): void {
    this.beforeDie()
    this.remove()
  }

  addWrapperProperty(obj: Phaser.GameObjects.GameObject): void {
    (obj as unknown as WrappedPhaserGameObject).wrapper = this
  }

  getWrapper(obj: Phaser.GameObjects.GameObject): GameObject {
    return (obj as unknown as WrappedPhaserGameObject).wrapper
  }

  addBulletResponse(subject: Phaser.GameObjects.GameObject, 
                    damageMap: Map<BulletType, number>,
                    defaultDamage = 0): void {
    this.scene.physics.add.overlap(subject, this.scene.getBulletBodies(this.owner * -1), (me, bullet) => {
      if (!this.dying) {
        const bulletType = (this.getWrapper(bullet) as BulletGameObject).bulletType
        this._health -= damageMap.get(bulletType) ?? defaultDamage
        this.healthCallback?.(this._health)
        this.scene.removeBullet(bullet)
        if (this._health <= 0) this.die()
      }
    })
  }
}

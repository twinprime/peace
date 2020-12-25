import GameObject from "../GameObject"
import GameScene from "../GameScene"

export interface ScanStopShootBehaviourCallback {
  findTarget(): boolean
  isMoving(): boolean
  stop(): void
  move(): void
  createBullet(): void
}

export class ScanStopShootBehaviour {
  private lastFired = 0
  private lastScan = 0
  private haveTarget = false

  constructor(private subject: GameObject, private readonly scene: GameScene, 
    readonly scanInterval: number, readonly fireInterval: number,
    readonly callback: ScanStopShootBehaviourCallback) {}
  
  update(time: number): void {
    if ((time - this.lastScan) >= this.scanInterval) {
      this.lastScan = time
      this.haveTarget = this.callback.findTarget()
      if (this.haveTarget) {
        this.callback.move()
      } else if (!this.callback.isMoving()) {
        this.callback.move()
      }
    }
    if (this.haveTarget && (time - this.lastFired) > this.fireInterval) {
      this.lastFired = time
      this.callback.createBullet()
    }
  }
}
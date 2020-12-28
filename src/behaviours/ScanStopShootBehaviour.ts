import GameObject from "../GameObject"

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
  
  constructor(private readonly subject: GameObject, private readonly scanInterval: number, private readonly fireInterval: number,
    private readonly callback: ScanStopShootBehaviourCallback) {}
  
  update(time: number): void {
    if (this.subject.dying != true) {
      if ((time - this.lastScan) >= this.scanInterval) {
        this.lastScan = time
        this.haveTarget = this.callback.findTarget()
        if (this.haveTarget) {
          this.callback.stop()
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
}
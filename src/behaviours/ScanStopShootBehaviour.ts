import GameObject from "../GameObject"

export interface ScanStopShootBehaviourCallback {
  findTarget(): Set<GameObject>
  isMoving(): boolean
  stop(): void
  move(): void
  createBullet(targets: Set<GameObject>): void
}

export class ScanStopShootBehaviour {
  private lastFired = 0
  private lastScan = 0
  private targets = new Set<GameObject>()
  
  constructor(private readonly subject: GameObject, private readonly scanInterval: number, private readonly fireInterval: number,
    private readonly callback: ScanStopShootBehaviourCallback) {}
  
  update(time: number): void {
    if (this.subject.dying != true) {
      if ((time - this.lastScan) >= this.scanInterval) {
        this.lastScan = time
        this.targets = this.callback.findTarget()
        if (this.targets.size > 0) {
          this.callback.stop()
        } else if (!this.callback.isMoving()) {
          this.callback.move()
        }
      }
      if (this.targets.size > 0 && (this.lastFired == 0 || (time - this.lastFired) > this.fireInterval)) {
        this.lastFired = time
        this.callback.createBullet(this.targets)
      }
    }
  }
}
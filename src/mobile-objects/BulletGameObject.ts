import GameScene from "../GameScene"
import SpriteGameObject from "../SpriteGameObject"

export enum BulletType {
  Chopper, AA, Bunker, Tank, Rifle
}

export class BulletGameObject extends SpriteGameObject {
  private static typeToScale = new Map<BulletType, number>([
    [BulletType.Chopper, 0.75], [BulletType.AA, 1], [BulletType.Bunker, 1.5], 
    [BulletType.Tank, 1.5], [BulletType.Rifle, 0.5]])

  private startTime = 0

  constructor(scene: GameScene, owner: number, 
              readonly physicsGroup: Phaser.Physics.Arcade.Group,
              readonly duration: number,
              x: number, y: number, 
              velocityX: number, velocityY: number,
              readonly bulletType: BulletType) {
    super(scene, owner)
    this.mainSprite = this.scene.add.sprite(x, y, this.owner > 0 ? "bullet-blue" : "bullet-red")
    this.mainSprite.setDepth(200)
    this.addWrapperProperty(this.mainSprite)
    const scale = BulletGameObject.typeToScale.get(bulletType)
    this.mainSprite.setScale(scale, scale)
    this.physicsGroup.add(this.mainSprite)
    const body = this.mainSprite.body as Phaser.Physics.Arcade.Body
    body.setAllowGravity(false)
    body.setVelocity(velocityX, velocityY)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(time: number, delta: number): void {
    super.update(time, delta)
    if (this.startTime == 0) this.startTime = time
    else if ((time - this.startTime) > this.duration) this.remove()
    else {
      if (this.mainSprite.x < 0 || this.mainSprite.x > this.scene.worldWidth || 
        this.mainSprite.y < 0 || this.mainSprite.y > this.scene.worldHeight) this.remove()
    }
  }

  static preload(scene: GameScene): void {
    scene.load.image("bullet-red", "/images/bullet-red.png")
    scene.load.image("bullet-blue", "/images/bullet-blue.png")
  }
}
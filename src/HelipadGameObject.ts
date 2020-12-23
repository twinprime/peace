import GameObject from "./GameObject"
import GameScene from "./GameScene"

export default class HelipadGameObject extends GameObject {
  private readonly sprite: Phaser.GameObjects.Sprite
  private readonly body: Phaser.Physics.Arcade.Body

  private readonly _center: Phaser.Math.Vector2
  get center(): Phaser.Math.Vector2 { return this._center }

  get minX(): number { return this._center.x - 60 }
  get maxX(): number { return this._center.x + 60 }
  get ht(): number { return 3 }

  constructor(scene: GameScene, owner: number, physicsGroup: Phaser.Physics.Arcade.StaticGroup, 
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              x: number, faceLeft: boolean) {
    super(scene, owner)

    this.sprite = this.scene.add.sprite(x, this.scene.groundPos - 8, "helipad", 0)
    const bodyRect = this.scene.add.rectangle(x, this.scene.groundPos - 2, 128, 2, 0)
    bodyRect.setVisible(false)
    physicsGroup.add(bodyRect)
    this.body = bodyRect.body as Phaser.Physics.Arcade.Body
    this.body.allowGravity = false
    this.body.immovable = true
    this._center = new Phaser.Math.Vector2(x, this.scene.groundPos - 4)
  }

  chopperOnPad(onPad: boolean): void {
    if (onPad) this.sprite.anims.stop()
    else this.sprite.anims.play("helipad")
  }

  static preload(scene: GameScene): void {
    scene.load.spritesheet("helipad", "/images/helipad.png", { frameWidth: 128, frameHeight: 16 })
  }

  static createCommon(scene: GameScene): void {
    scene.anims.create({
      key: "helipad",
      frames: scene.anims.generateFrameNumbers("helipad", { start: 0, end: 1 }),
      repeat: -1,
      frameRate: 2
    })
  }
}
import GameObject from "./GameObject"
import GameScene from "./GameScene"

export default class HelipadGameObject extends GameObject {
  private sprite: Phaser.GameObjects.Sprite
  private body: Phaser.Physics.Arcade.Body

  private _center: Phaser.Math.Vector2
  get center(): Phaser.Math.Vector2 { return this._center }

  constructor(scene: GameScene) {
    super(scene)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create(physicsGroup: Phaser.Physics.Arcade.StaticGroup, x: number, faceLeft: boolean): void {
    this.sprite = this.scene.add.sprite(x, this.scene.groundPos - 8, "helipad", 0)
    this.sprite.anims.play("helipad")
    const bodyRect = this.scene.add.rectangle(x, this.scene.groundPos - 2, 128, 2, 0)
    bodyRect.setVisible(false)
    physicsGroup.add(bodyRect)
    this.body = bodyRect.body as Phaser.Physics.Arcade.Body
    this.body.allowGravity = false
    this.body.immovable = true
    this._center = new Phaser.Math.Vector2(x, this.scene.groundPos - 4)
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
import GameObject from "./GameObject"
import GameScene from "./GameScene"

export default class BirdGameObject extends GameObject {
  private _sprite: Phaser.Physics.Arcade.Sprite

  get sprite(): Phaser.GameObjects.Sprite { return this._sprite }

  constructor(readonly scene: GameScene) {
    super(scene, 0)
  }

  preload(): void {
    this.scene.load.spritesheet("bird", "/images/bird.png", { frameWidth: 16, frameHeight: 16 })
  }

  create(): void {
    this.scene.anims.create({
      key: "flap",
      frames: this.scene.anims.generateFrameNumbers("bird", { frames: [1, 0, 1, 2, 3, 4, 5, 4, 3, 2] })
    })
    this._sprite = this.scene.physics.add.sprite(100, 100, "bird", 2)
    this._sprite.setScale(2, 2)
    const spriteBody = this.sprite.body as Phaser.Physics.Arcade.Body
    spriteBody.setCollideWorldBounds(true)

    this.scene.physics.add.collider(this._sprite, this.scene.platforms)
    this.scene.physics.add.collider(this._sprite, this.scene.trees)
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys): void {
    if (cursors.space.isDown) {
      if (!this._sprite.anims.isPlaying) {
        this._sprite.anims.play("flap")
      }
      this._sprite.setVelocityY(-150)
    }
    if (cursors.right.isDown) {
      this._sprite.setVelocityX(150)
    } else if (cursors.left.isDown) {
      this._sprite.setVelocityX(-150)
    }
  }
}
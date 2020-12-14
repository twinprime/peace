import GameObject from "./GameObject"
import GameScene from "./GameScene"

export default class BirdGameObject extends GameObject {
  private sprite: Phaser.Physics.Arcade.Sprite

  constructor(readonly scene: GameScene) {
    super(scene)
  }

  preload(): void {
    this.scene.load.spritesheet("bird", "/images/bird.png", { frameWidth: 16, frameHeight: 16 })
  }

  create(): void {
    this.scene.anims.create({
      key: "flap",
      frames: this.scene.anims.generateFrameNumbers("bird", { frames: [1, 0, 1, 2, 3, 4, 5, 4, 3, 2] })
    })
    this.sprite = this.scene.physics.add.sprite(100, 100, "bird", 2)
    this.sprite.setScale(2, 2)
    // const spriteBody = this.sprite.body as Phaser.Physics.Arcade.Body
    // spriteBody.allowGravity = false
    this.scene.physics.add.collider(this.sprite, this.scene.platforms)
    this.scene.physics.add.collider(this.sprite, this.scene.trees)
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys): void {
    if (cursors.space.isDown) {
      if (!this.sprite.anims.isPlaying) {
        this.sprite.anims.play("flap")
      }
      this.sprite.setVelocityY(-150)
    }
  }
}
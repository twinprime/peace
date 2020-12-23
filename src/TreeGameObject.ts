import GameObject from "./GameObject"
import GameScene from "./GameScene"

export default class TreeGameObject extends GameObject {
  private readonly sprites: Phaser.GameObjects.Sprite[] = []
  private readonly body: Phaser.Physics.Arcade.Body

  constructor(readonly scene: GameScene, physicsGroup: Phaser.Physics.Arcade.Group,
              x: number, y: number, ht: number) {
    super(scene, 0)
    let vPos = y - 16

    const htPixels = ht * 32
    const bodyRect = this.scene.add.rectangle(x, y - htPixels / 2, 32, htPixels, 0)
    bodyRect.setVisible(false)
    physicsGroup.add(bodyRect)
    this.body = bodyRect.body as Phaser.Physics.Arcade.Body
    this.body.allowGravity = false
    this.body.immovable = true
    // this.body.setVelocityX(5)

    const bottom = this.scene.add.sprite(x, vPos, "nature", 37)
    bottom.setScale(2)
    this.sprites.push(bottom)
    for (let h = 0; h < (ht - 2); h++) {
      vPos -= 32
      const sprite = this.scene.add.sprite(x, vPos, "nature", 30)
      sprite.setScale(2)
      this.sprites.push(sprite)
    }
    vPos -= 32
    const top = this.scene.add.sprite(x, vPos, "nature", 23)
    top.setScale(2)
    this.sprites.push(top)
  }

  update(): void {
    const x = this.body.position.x + 16
    let y = this.body.position.y + this.body.height - 16
    this.sprites.forEach(sprite => {
      sprite.setX(x)
      sprite.setY(y)
      y -= 32
    })
  }
}
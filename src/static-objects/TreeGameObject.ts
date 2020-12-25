import GameScene from "../GameScene"
import PhysicsBodyGameObject from "../PhysicsBodyGameObject"

export default class TreeGameObject extends PhysicsBodyGameObject {
  private readonly sprites: Phaser.GameObjects.Sprite[] = []

  constructor(readonly scene: GameScene, physicsGroup: Phaser.Physics.Arcade.Group,
              x: number, y: number, ht: number) {
    super(scene, 0)
    let vPos = y - 16

    const htPixels = ht * 32
    const bodyRect = this.scene.add.rectangle(x, y - htPixels / 2, 32, htPixels, 0)
    bodyRect.setVisible(false)
    physicsGroup.add(bodyRect)
    this.mainBody = bodyRect.body as Phaser.Physics.Arcade.Body
    this.mainBody.allowGravity = false
    this.mainBody.immovable = true

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

  remove(): void { throw "TreeGameObject cannot be removed" }

  update(): void {
    const x = this.mainBody.position.x + 16
    let y = this.mainBody.position.y + this.mainBody.height - 16
    this.sprites.forEach(sprite => {
      sprite.setX(x)
      sprite.setY(y)
      y -= 32
    })
  }
}
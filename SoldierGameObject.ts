import GameScene from "./GameScene"
import HumanGameObject from "./HumanGameObject"

export default class SoldierGameObject extends HumanGameObject {
  constructor(readonly scene: GameScene) {
    super(scene, "soldier-stand", "soldier-walk", "soldier-die", 44, 0.5, true)
  }

  static preload(scene: GameScene): void {
    scene.load.image("soldier-stand", "/images/soldier-stand.png")
    scene.load.spritesheet("soldier-walk", "/images/soldier-walk.png", { frameWidth: 29, frameHeight: 44 })
    scene.load.spritesheet("soldier-die", "/images/soldier-die.png", { frameWidth: 35, frameHeight: 42 })
  }

  static createCommon(scene: GameScene): void {
    scene.anims.create({
      key: "soldier-walk",
      frames: scene.anims.generateFrameNumbers("soldier-walk", { start: 0, end: 5 }),
      repeat: -1,
      frameRate: 6
    })

    scene.anims.create({
      key: "soldier-die",
      frames: scene.anims.generateFrameNumbers("soldier-die", { start: 0, end: 4 }),
      frameRate: 6
    })
  }

  static createIcon(scene: GameScene, x: number, y: number): Phaser.GameObjects.Sprite {
    return scene.add.sprite(x, y, "soldier-stand")
  }
}
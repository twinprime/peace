import GameScene from "./GameScene"
import HumanGameObject from "./HumanGameObject"

export default class CivilianGameObject extends HumanGameObject {
  constructor(readonly scene: GameScene) {
    //super(scene, "civilian", "civilian-walk", "civilian-die", 256, 0.0625, false)
    super(scene, "civilian", "civilian-walk", "civilian-die", 256, 0.25, false)
  }

  wave(): void {
    this.move(0, true)
    this.sprite.anims.play("civilian-wave")
  }

  static preload(scene: GameScene): void {
    scene.load.spritesheet("civilian", "/images/civilian.png", { frameWidth: 128, frameHeight: 256 })
    scene.load.spritesheet("civilian-die", "/images/civilian-die.png", { frameWidth: 128, frameHeight: 256 })
    scene.load.spritesheet("civilian-wave", "/images/civilian-wave.png", { frameWidth: 128, frameHeight: 256 })
  }

  static createCommon(scene: GameScene): void {
    scene.anims.create({
      key: "civilian-walk",
      frames: scene.anims.generateFrameNumbers("civilian", { start: 1, end: 4 }),
      repeat: -1,
      frameRate: 6
    })

    scene.anims.create({
      key: "civilian-die",
      frames: scene.anims.generateFrameNumbers("civilian-die", { start: 0, end: 3 }),
      frameRate: 6
    })

    scene.anims.create({
      key: "civilian-wave",
      frames: scene.anims.generateFrameNumbers("civilian-wave", { start: 0, end: 3 }),
      repeat: -1,
      yoyo: true,
      frameRate: 6
    })
  }

  static createIcon(scene: GameScene, x: number, y: number): Phaser.GameObjects.Sprite {
    return scene.add.sprite(x, y, "civilian", 0)
  }
}
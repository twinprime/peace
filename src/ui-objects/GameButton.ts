import GameScene from "../GameScene"

export default class GameButton {
  private pointerDown = false

  constructor(scene: GameScene, icon: Phaser.GameObjects.Sprite, onClick: () => void) {
    icon.setScrollFactor(0, 0)
    icon.setInteractive()
    icon.on("pointerdown", () => { 
      icon.setTint(0xff0000)
      this.pointerDown = true
    })
    icon.on("pointerout", () => {
      icon.clearTint()
      this.pointerDown = false
    })
    icon.on("pointerup", () => {
      icon.clearTint()
      if (this.pointerDown) {
        this.pointerDown = false
        onClick()
      }
    })
  }
}
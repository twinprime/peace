import GameScene from "../GameScene"

export default class GameButton {
  private pointerDown = false
  private _enabled = true
  set enabled(enable: boolean) {
    this._enabled = enable
    if (this._enabled) this.icon.clearTint()
    else this.icon.setTint(0x888888)
  }

  constructor(scene: GameScene, private readonly icon: Phaser.GameObjects.Sprite, onClick: () => void) {
    icon.setScrollFactor(0, 0)
    icon.setInteractive()
    icon.on("pointerdown", () => { 
      if (this._enabled) {
        icon.setTint(0xff0000)
        this.pointerDown = true
      }
    })
    icon.on("pointerout", () => {
      if (this._enabled) {
        icon.clearTint()
        this.pointerDown = false
      }
    })
    icon.on("pointerup", () => {
      if (this._enabled) {
        icon.clearTint()
        if (this.pointerDown) {
          this.pointerDown = false
          onClick()
        }
      }
    })
  }
}
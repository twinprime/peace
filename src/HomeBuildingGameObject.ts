import GameObject from "./GameObject"
import GameScene from "./GameScene"

export default class HomeBuildingGameObject extends GameObject {
  private _entryX: number
  get entryX(): number { return this._entryX }

  constructor(scene: GameScene, x: number) {
    super(scene)
    
    this.scene.add.sprite(x, this.scene.groundPos - 64, "home")
    this._entryX = x + 48
  }

  static preload(scene: GameScene): void {
    scene.load.image("home", "/images/home.png")
  }
}
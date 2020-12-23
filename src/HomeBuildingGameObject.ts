import GameScene from "./GameScene"
import SpriteGameObject from "./SpriteGameObject"

export default class HomeBuildingGameObject extends SpriteGameObject {
  private readonly _entryX: number
  get entryX(): number { return this._entryX }

  constructor(scene: GameScene, owner: number, x: number) {
    super(scene, owner)
    
    this.mainSprite = this.scene.add.sprite(x, this.scene.groundPos - 64, "home")
    this._entryX = x + 48
  }

  static preload(scene: GameScene): void {
    scene.load.image("home", "/images/home.png")
  }
}
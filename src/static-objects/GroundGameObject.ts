import GameScene from "../GameScene"

export default class GroundGameObject {
  constructor(scene: GameScene) {    
    const sprite = scene.add.tileSprite(0, scene.worldHeight - 16, 
      scene.worldWidth, 16, "nature", 1).setScale(2)
    scene.platforms.add(sprite)
  }
}
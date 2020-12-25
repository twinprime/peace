import HumanGameObject from "./mobile-objects/HumanGameObject"

export default interface HumanBoardable {
  boardableGameObject: Phaser.GameObjects.GameObject
  board(human: HumanGameObject): boolean
}
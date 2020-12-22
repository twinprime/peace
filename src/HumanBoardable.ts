import HumanGameObject from "./HumanGameObject"

export default interface HumanBoardable {
  boardableGameObject: Phaser.GameObjects.GameObject
  board(human: HumanGameObject): boolean
}
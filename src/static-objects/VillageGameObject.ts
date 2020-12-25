import CivilianGameObject from "../mobile-objects/CivilianGameObject"
import GameScene from "../GameScene"
import SpriteGameObject from "../SpriteGameObject"

export default class VillageGameObject extends SpriteGameObject {
  private villagers: CivilianGameObject[] = []
  private readonly maxVillagers = 3
  private readonly minTimeBetweenSpawn = 5000
  private lastSpawnTime = 0

  private readonly _spawnX: number
  get spawnX(): number { return this._spawnX }

  constructor(scene: GameScene, owner: number,
              private readonly homePos: number,
              x: number, faceLeft: boolean,
              private readonly villagerGroup: Phaser.Physics.Arcade.Group,
              private readonly homeCallback: (obj: CivilianGameObject) => void) {
    super(scene, owner)

    this.mainSprite = this.scene.add.sprite(x, this.scene.groundPos - 48, "village")
    if (faceLeft) {
      this.mainSprite.setFlipX(true)
      this._spawnX = x + 32
    } else {
      this._spawnX = x - 32
    }
  }

  update(time: number, delta: number): void {
    this.villagers.forEach(v => v.update(time, delta))
    if (this.villagers.length < this.maxVillagers && (time - this.lastSpawnTime) > this.minTimeBetweenSpawn) {
      const villager = new CivilianGameObject(this.scene, this.owner, this.homePos, this._spawnX,
        this.villagerGroup, v => {
          this.villagers = this.villagers.filter(i => i != v)
          this.homeCallback(v)
        })
      villager.wander(time)
      this.villagers.push(villager)
      this.lastSpawnTime = time
    }
  }

  static preload(scene: GameScene): void {
    scene.load.image("village", "/images/village.png")
  }
}
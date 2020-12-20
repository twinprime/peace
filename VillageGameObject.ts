import CivilianGameObject from "./CivilianGameObject"
import GameObject from "./GameObject"
import GameScene from "./GameScene"

export default class VillageGameObject extends GameObject {
  private sprite: Phaser.GameObjects.Sprite
  private villagers: CivilianGameObject[] = []
  private lastSpawnTime = 0
  private maxVillagers = 3
  private minTimeBetweenSpawn = 5000

  private _spawnX: number
  get spawnX(): number { return this._spawnX }

  constructor(scene: GameScene, 
              private readonly homePos: number,
              private readonly villagerGroup: Phaser.Physics.Arcade.Group,
              private readonly homeCallback: (obj: CivilianGameObject) => void) {
    super(scene)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create(x: number, faceLeft: boolean): void {
    this.sprite = this.scene.add.sprite(x, this.scene.groundPos - 48, "village")
    if (faceLeft) {
      this.sprite.setFlipX(true)
      this._spawnX = x + 32
    } else {
      this._spawnX = x - 32
    }
  }

  update(time: number, delta: number): void {
    this.villagers.forEach(v => v.update(time, delta))
    if (this.villagers.length < this.maxVillagers && (time - this.lastSpawnTime) > this.minTimeBetweenSpawn) {
      const villager = new CivilianGameObject(this.scene, this.homePos, v => {
        this.villagers = this.villagers.filter(i => i != v)
        this.homeCallback(v)
      })
      villager.create(this._spawnX, this.villagerGroup)
      villager.move(-10, true)
      this.villagers.push(villager)
      this.lastSpawnTime = time
    }
  }

  static preload(scene: GameScene): void {
    scene.load.image("village", "/images/village.png")
  }
}
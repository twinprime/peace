import BarrackGameObject from "./static-objects/BarrackGameObject"
import ChopperGameObject from "./mobile-objects/ChopperGameObject"
import CivilianGameObject from "./mobile-objects/CivilianGameObject"
import FactoryGameObject from "./static-objects/FactoryGameObject"
import ForceControl from "./ForceControl"
import GameButton from "./ui-objects/GameButton"
import GameScene from "./GameScene"
import HealthBarGameObject from "./ui-objects/HealthBarGameObject"
import HelipadGameObject from "./static-objects/HelipadGameObject"
import HomeBuildingGameObject from "./static-objects/HomeBuildingGameObject"
import SoldierGameObject from "./mobile-objects/SoldierGameObject"
import TankGameObject from "./mobile-objects/TankGameObject"
import VillageGameObject from "./static-objects/VillageGameObject"

export default class BlueForceControl extends ForceControl {
  private cash = 1000
  private cashDelta = 100
  private cashUpdateInterval = 5000
  private lastCashUpdate = 0
  private cashText: Phaser.GameObjects.Text

  private liftableBodies: Phaser.Physics.Arcade.Group
  private villages = new Set<VillageGameObject>()
  
  protected factory: FactoryGameObject
  protected barrack: BarrackGameObject
  protected tankObjects = new Set<TankGameObject>()
  protected soliderObjects = new Set<SoldierGameObject>()
  protected boardableBodies: Phaser.Physics.Arcade.Group

  private _chopper: ChopperGameObject
  get chopper(): ChopperGameObject { return this._chopper }
  
  constructor(scene: GameScene) {
    super(scene, 1)

    const screenWidth = scene.sys.scale.gameSize.width

    new GameButton(scene, SoldierGameObject.createIcon(scene, screenWidth - 32, 32), () => {
      this.adjustCash(-10)
      this.buildSoldier()
    })
    new GameButton(scene, TankGameObject.createIcon(scene, screenWidth - 32, 69), () => {
      this.adjustCash(-500)
      this.buildTank()
    })

    this.boardableBodies = scene.physics.add.group()

    let nextPos = 10 + 64

    const homeBuilding = new HomeBuildingGameObject(scene, 1, nextPos)
    nextPos += 128 + 15

    const helipad = new HelipadGameObject(scene, 1, scene.platforms, nextPos, false)
    nextPos += 64 + 15

    this.factory = new FactoryGameObject(scene, 1, nextPos + 128, false)
    nextPos += 256 + 15

    this.barrack = new BarrackGameObject(scene, 1, nextPos + 32)
    nextPos += 64 + 15

    this.liftableBodies = this.scene.physics.add.group()
    
    nextPos += 100
    this.buildAAGun(nextPos + 16, this.liftableBodies)
    nextPos += 32 + 15

    nextPos += 100
    const village = new VillageGameObject(scene, 1, homeBuilding.entryX, nextPos, false,
      this.boardableBodies, () => {
        this.cashDelta += 100
        this.adjustCash(0)
      })
    this.villages.add(village)
    nextPos += 128 + 15

    nextPos += 100
    this.buildBunker(nextPos + 16, this.liftableBodies)
    nextPos += 32 + 15

    const healthBar = new HealthBarGameObject(scene, 10, 15)

    let onBoardCountX = 10 + healthBar.width + 25
    const civilianIcon = CivilianGameObject.createIcon(scene, onBoardCountX, 16)
    civilianIcon.setScale(civilianIcon.scaleX * 0.5, civilianIcon.scaleY * 0.5).setScrollFactor(0, 0)
    onBoardCountX += 16
    const civilianOnBoardCountText = scene.add.text(onBoardCountX, 10, "0")
    civilianOnBoardCountText.setScrollFactor(0, 0)
    onBoardCountX += 16 + 10
    const soldierIcon = SoldierGameObject.createIcon(scene, onBoardCountX, 16)
    soldierIcon.setScale(soldierIcon.scaleX * 0.5, soldierIcon.scaleY * 0.5).setScrollFactor(0, 0)
    onBoardCountX += 16 + 5
    const soldierOnBoardCountText = scene.add.text(onBoardCountX, 10, "0")
    soldierOnBoardCountText.setScrollFactor(0, 0)

    this.cashText = scene.add.text(10, healthBar.height + 20, `$${this.cash} +$${this.cashDelta}`)
    this.cashText.setScrollFactor(0, 0)

    this._chopper = new ChopperGameObject(scene, 1, helipad, this.liftableBodies, 
      helipad.center.x, helipad.center.y - 15, this.boardableBodies,
      (health) => healthBar.health = health)
    this._chopper.setBoardCallback(humans => {
      soldierOnBoardCountText.setText(`${humans.get(SoldierGameObject.TYPE)?.length ?? 0}`)
      civilianOnBoardCountText.setText(`${humans.get(CivilianGameObject.TYPE)?.length ?? 0}`)
    })
    this.scene.gameMap.add(this._chopper)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(time: number, delta: number): void {
    this._chopper.update(time, delta)
    this.villages.forEach(v => v.update(time, delta))
    if ((time - this.lastCashUpdate) >= this.cashUpdateInterval) {
      this.adjustCash(this.cashDelta)
      this.lastCashUpdate = time
    }
    super.update(time, delta)
  }

  private adjustCash(amt: number) {
    this.cash += amt
    this.cashText.setText(`$${this.cash} +$${this.cashDelta}`)
  }
}
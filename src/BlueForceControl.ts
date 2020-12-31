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
import BunkerGameObject from "./static-objects/BunkerGameObject"

export default class BlueForceControl extends ForceControl {
  private _cash = 1000
  get cash(): number { return this._cash }
  private cashDelta = 100
  private cashUpdateInterval = 5000
  private lastCashUpdate = 0
  private cashText: Phaser.GameObjects.Text

  private lastProduction = 0
  private minProductionInterval = 3000
  private productionEnabled = true
  private ProductionButton = class extends GameButton {
    constructor(control: BlueForceControl, readonly cost: number, 
                icon: Phaser.GameObjects.Sprite, onClick: () => void) {
      super(control.scene, icon, () => {
        if (control._cash >= cost) {
          control.adjustCash(-cost)
          control.lastProduction = control.scene.sys.game.getTime()
          control.enableProduction(false)
          onClick()
        }
      })
    }
  }
  private productionButtons: GameButton[] = []

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

    this.productionButtons.push(new this.ProductionButton(this, 10, 
      SoldierGameObject.createIcon(scene, screenWidth - 32, 32), () => this.buildSoldier()))
    this.productionButtons.push(new this.ProductionButton(this, 500, 
      TankGameObject.createIcon(scene, screenWidth - 32, 69), () => this.buildTank()))
    this.productionButtons.push(new this.ProductionButton(this, 500, 
      BunkerGameObject.createIcon(scene, screenWidth- 32, 106), 
      () => this.buildBunker(this.factory.spawnX, this.liftableBodies)))

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
    this.buildMissileBase(nextPos + 16, this.liftableBodies)
    nextPos += 32 + 15
    
    nextPos += 50
    this.buildAAGun(nextPos + 16, this.liftableBodies)
    nextPos += 32 + 15

    nextPos += 100
    this.buildVillage(nextPos, homeBuilding.entryX)
    nextPos += 128 + 15

    nextPos += 100
    this.buildBunker(nextPos + 16, this.liftableBodies)
    nextPos += 32 + 15

    this.buildVillage(2500, homeBuilding.entryX)

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

    this.cashText = scene.add.text(10, healthBar.height + 20, `$${this._cash} +$${this.cashDelta}`)
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

    if (!this.productionEnabled && 
        (time - this.lastProduction) >= this.minProductionInterval) {
      this.enableProduction(true)
    }

    super.update(time, delta)
  }

  private enableProduction(enable: boolean) {
    this.productionEnabled = enable
    this.productionButtons.forEach(b => {
      if (enable) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
        const cost = (b as any).cost as number
        if (b.enabled && cost > this._cash) b.enabled = false
        else if (!b.enabled && cost <= this._cash) b.enabled = true
      } else b.enabled = false
    })
  }

  private adjustCash(amt: number): void {
    this._cash += amt
    this.cashText.setText(`$${this._cash} +$${this.cashDelta}`)
    if (this.productionEnabled) this.enableProduction(true)
  }

  private buildVillage(x: number, homePos: number) {
    const village = new VillageGameObject(this.scene, 1, homePos, x, false,
      this.boardableBodies, () => {
        this.cashDelta += 100
        this.adjustCash(0)
      })
    this.villages.add(village)
  }
}
import * as Phaser from 'phaser'
import AAGunGameObject from './static-objects/AAGunGameObject'
import BarrackGameObject from './static-objects/BarrackGameObject'
import { BulletGameObject, BulletType } from './mobile-objects/BulletGameObject'
import ChopperGameObject from './mobile-objects/ChopperGameObject'
import CivilianGameObject from './mobile-objects/CivilianGameObject'
import RedForceControl from './RedForceControl'
import FactoryGameObject from './static-objects/FactoryGameObject'
import GroundGameObject from './static-objects/GroundGameObject'
import HelipadGameObject from './static-objects/HelipadGameObject'
import HomeBuildingGameObject from './static-objects/HomeBuildingGameObject'
import BlueForceControl from './BlueForceControl'
import SoldierGameObject from './mobile-objects/SoldierGameObject'
import TankGameObject from './mobile-objects/TankGameObject'
import TreeGameObject from './static-objects/TreeGameObject'
import VillageGameObject from './static-objects/VillageGameObject'
import GameMap from './GameMap'

export default class GameScene extends Phaser.Scene {
  private frameTime = 0
  private treeObjects: TreeGameObject[] = []
  private bulletObjects = new Map<Phaser.GameObjects.GameObject, BulletGameObject>()
  private bulletBodies = new Map<number, Phaser.Physics.Arcade.Group>()
  private blueControl: BlueForceControl
  private redControl: RedForceControl

  readonly gameMap: GameMap

  private _platformBodies: Phaser.Physics.Arcade.StaticGroup
  get platforms(): Phaser.Physics.Arcade.StaticGroup { return this._platformBodies }

  private _treeBodies: Phaser.Physics.Arcade.Group
  get trees(): Phaser.Physics.Arcade.Group { return this._treeBodies }

  private _groundPos: number
  get groundPos(): number { return this._groundPos }

  get chopper(): ChopperGameObject { return this.blueControl.chopper }
  
  constructor(readonly worldWidth: number, readonly worldHeight: number) {
    super({
      active: false,
      visible: false,
      key: 'Game',
    })
    this.gameMap = new GameMap(worldWidth, 100)
  }

  init(): void {
    this.physics.world.setFPS(60)
  }

  preload(): void {
    this.load.image('sky', '/images/sky.png')
    this.load.spritesheet('nature', '/images/nature.png', { frameWidth: 16, frameHeight: 16 })
    this.load.spritesheet("explode", "/images/explode.png", { frameWidth: 64, frameHeight: 64 })

    HomeBuildingGameObject.preload(this)
    VillageGameObject.preload(this)
    BulletGameObject.preload(this)
    ChopperGameObject.preload(this)
    AAGunGameObject.preload(this)
    SoldierGameObject.preload(this)
    CivilianGameObject.preload(this)
    HelipadGameObject.preload(this)
    FactoryGameObject.preload(this)
    BarrackGameObject.preload(this)
    TankGameObject.preload(this)
  }

  private createAnims(): void {
    this.anims.create({
      key: "explode",
      frames: this.anims.generateFrameNumbers("explode", { start: 0, end: 15 }),
      frameRate: 6
    })
  }
  
  create(): void {
    this.createAnims()

    this.physics.world.setBounds(0, 0, this.worldWidth, this.worldHeight)

    const bg = this.add.image(this.worldWidth / 2, this.worldHeight / 2, 'sky')
    bg.setDisplaySize(this.worldWidth, this.worldHeight)

    this._platformBodies = this.physics.add.staticGroup()
    new GroundGameObject(this)

    this._groundPos = this.sys.game.scale.gameSize.height - 32

    this._treeBodies = this.physics.add.group()
    let treeX = 700
    const treeXMax = this.worldWidth - 700
    while(treeX <= treeXMax) {
      const ht = Math.floor(3 + Math.random() * 5)
      const tree = new TreeGameObject(this, this._treeBodies, treeX, this._groundPos, ht)
      this.treeObjects.push(tree)
      treeX += Math.max(200, 100 + Math.floor(Math.random() * 400))
    }

    this.bulletBodies.set(-1, this.physics.add.group())
    this.bulletBodies.set(1, this.physics.add.group())

    HelipadGameObject.createCommon(this)
    SoldierGameObject.createCommon(this)
    CivilianGameObject.createCommon(this)
    this.blueControl = new BlueForceControl(this)
    this.redControl = new RedForceControl(this)

    this.cameras.main.setBounds(0, 0, this.worldWidth, this.worldHeight)
    this.cameras.main.startFollow(this.blueControl.chopper.sprite)
  }

  createBullet(owner: number, duration: number, 
               x: number, y: number, velocityX: number, velocityY: number, 
               type: BulletType): BulletGameObject {
    const bullet = new BulletGameObject(this, owner, this.bulletBodies.get(owner), 
      duration, x, y, velocityX, velocityY, type)
    this.bulletObjects.set(bullet.sprite, bullet)
    bullet.destroyCallback = () => this.bulletObjects.delete(bullet.sprite)
    return bullet
  }

  removeBullet(b: Phaser.GameObjects.GameObject): void {
    this.bulletObjects.get(b)?.remove()
  }

  getBulletBodies(owner: number): Phaser.Physics.Arcade.Group { return this.bulletBodies.get(owner) }
  
  update(time: number, delta: number): void {
    this.frameTime += delta
    if (this.frameTime >= 16.5) {
      this.frameTime = 0
      this.gameMap.update(time, delta)
      this.blueControl.update(time, delta)
      this.redControl.update(time, delta)
      this.treeObjects.forEach(tree => tree.update())
      this.bulletObjects.forEach(bullet => bullet.update(time))
    }
  }

  end(): void {
    // Nothing to do yet
  }
}
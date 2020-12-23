import * as Phaser from 'phaser'
import AAGunGameObject from './AAGunGameObject'
import BarrackGameObject from './BarrackGameObject'
import BulletGameObject from './BulletGameObject'
import ChopperGameObject from './ChopperGameObject'
import CivilianGameObject from './CivilianGameObject'
import RedForceControl from './RedForceControl'
import FactoryGameObject from './FactoryGameObject'
import GroundGameObject from './GroundGameObject'
import HelipadGameObject from './HelipadGameObject'
import HomeBuildingGameObject from './HomeBuildingGameObject'
import BlueForceControl from './BlueForceControl'
import SoldierGameObject from './SoldierGameObject'
import TankGameObject from './TankGameObject'
import TreeGameObject from './TreeGameObject'
import VillageGameObject from './VillageGameObject'
import GameObject from './GameObject'

export default class GameScene extends Phaser.Scene {
  private frameTime = 0
  private ground: GroundGameObject
  private treeObjects: TreeGameObject[] = []
  private bulletObjects = new Map<Phaser.GameObjects.GameObject, BulletGameObject>()
  private bulletBodies = new Map<number, Phaser.Physics.Arcade.Group>()
  private playerControl: BlueForceControl
  private enemeyControl: RedForceControl
  private gameObjects = new Map<number, Map<number, GameObject>>()

  private _platformBodies: Phaser.Physics.Arcade.StaticGroup
  get platforms(): Phaser.Physics.Arcade.StaticGroup { return this._platformBodies }

  private _treeBodies: Phaser.Physics.Arcade.Group
  get trees(): Phaser.Physics.Arcade.Group { return this._treeBodies }

  private _groundPos: number
  get groundPos(): number { return this._groundPos }

  get chopper(): ChopperGameObject { return this.playerControl.chopper }
  
  constructor(readonly worldWidth: number, readonly worldHeight: number) {
    super({
      active: false,
      visible: false,
      key: 'Game',
    })
    this.gameObjects.set(-1, new Map())
    this.gameObjects.set(1, new Map())
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
    this.ground = new GroundGameObject(this)

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
    this.playerControl = new BlueForceControl(this)
    this.enemeyControl = new RedForceControl(this)

    this.cameras.main.setBounds(0, 0, this.worldWidth, this.worldHeight)
    this.cameras.main.startFollow(this.playerControl.chopper.sprite)
  }

  createBullet(owner: number, x: number, y: number, velocityX: number, velocityY: number): BulletGameObject {
    const bullet = new BulletGameObject(this, owner, this.bulletBodies.get(owner), x, y, velocityX, velocityY)
    this.bulletObjects.set(bullet.sprite, bullet)
    return bullet
  }

  removeBullet(b: Phaser.GameObjects.GameObject): void {
    const bullet = this.bulletObjects.get(b)
    if (bullet) {
      this.bulletObjects.delete(b)
      bullet.remove()
    }
  }

  getBulletBodies(owner: number): Phaser.Physics.Arcade.Group { return this.bulletBodies.get(owner) }
  
  update(time: number, delta: number): void {
    this.frameTime += delta
    if (this.frameTime >= 16.5) {
      this.frameTime = 0
      this.playerControl.update(time, delta)
      this.enemeyControl.update(time, delta)
      this.treeObjects.forEach(tree => tree.update())
      this.bulletObjects.forEach(bullet => {
        if (bullet.sprite.x < 0 || bullet.sprite.x > this.worldWidth || 
          bullet.sprite.y < 0 || bullet.sprite.y > this.worldHeight) this.removeBullet(bullet.sprite)
      })
    }
  }

  end(): void {
    // Nothing to do yet
  }
}
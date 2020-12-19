import * as Phaser from 'phaser'
import AAGunGameObject from './AAGunGameObject'
import BarrackGameObject from './BarrackGameObject'
import BulletGameObject from './BulletGameObject'
import ChopperGameObject from './ChopperGameObject'
import CivilianGameObject from './CivilianGameObject'
import EnemyControl from './EnemyControl'
import FactoryGameObject from './FactoryGameObject'
import GroundGameObject from './GroundGameObject'
import HelipadGameObject from './HelipadGameObject'
import PlayerControl from './PlayerControl'
import SoldierGameObject from './SoldierGameObject'
import TankGameObject from './TankGameObject'
import TreeGameObject from './TreeGameObject'

export default class GameScene extends Phaser.Scene {
  private frameTime = 0
  private ground: GroundGameObject
  private treeObjects: TreeGameObject[] = []
  private bulletObjects = new Map<Phaser.GameObjects.GameObject, BulletGameObject>()
  private playerControl: PlayerControl
  private enemeyControl: EnemyControl

  private _platformBodies: Phaser.Physics.Arcade.StaticGroup
  get platforms(): Phaser.Physics.Arcade.StaticGroup { return this._platformBodies }

  private _treeBodies: Phaser.Physics.Arcade.Group
  get trees(): Phaser.Physics.Arcade.Group { return this._treeBodies }

  private _bulletBodies: Phaser.Physics.Arcade.Group
  get bullets(): Phaser.Physics.Arcade.Group { return this._bulletBodies }

  private _groundPos: number
  get groundPos(): number { return this._groundPos }

  get chopper(): ChopperGameObject { return this.playerControl.chopper }
  
  constructor(readonly worldWidth: number, readonly worldHeight: number) {
    super({
      active: false,
      visible: false,
      key: 'Game',
    })
  }

  init(): void {
    this.physics.world.setFPS(60)
  }

  preload(): void {
    this.load.image('sky', '/images/sky.png')
    this.load.spritesheet('nature', '/images/nature.png', { frameWidth: 16, frameHeight: 16 })
    this.load.spritesheet("explode", "/images/explode.png", { frameWidth: 64, frameHeight: 64 })

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
    this.ground.create()

    this._groundPos = this.sys.game.scale.gameSize.height - 32

    this._treeBodies = this.physics.add.group()
    const tree = new TreeGameObject(this)
    tree.create(this._treeBodies, 700, this._groundPos, 3)
    this.treeObjects.push(tree)

    this._bulletBodies = this.physics.add.group()

    HelipadGameObject.createCommon(this)
    SoldierGameObject.createCommon(this)
    CivilianGameObject.createCommon(this)
    this.playerControl = new PlayerControl(this)
    this.enemeyControl = new EnemyControl(this)

    const civilian = new CivilianGameObject(this)
    civilian.create(100)
    civilian.move(10, false)
    setTimeout(() => civilian.wave(), 3000)
    setTimeout(() => civilian.move(-10, false), 5000)
    setTimeout(() => civilian.die(), 7000)

    this.cameras.main.setBounds(0, 0, this.worldWidth, this.worldHeight)
    this.cameras.main.startFollow(this.playerControl.chopper.sprite)
  }

  createBullet(x: number, y: number, velocityX: number, velocityY: number): BulletGameObject {
    const bullet = new BulletGameObject(this, this._bulletBodies)
    bullet.create(x, y, velocityX, velocityY)
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
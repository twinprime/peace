import * as Phaser from 'phaser'
import AAGunGameObject from './AAGunGameObject'
import BulletGameObject from './BulletGameObject'
import ChopperGameObject from './ChopperGameObject'
import GroundGameObject from './GroundGameObject'
import HealthBarGameObject from './HealthBarGameObject'
import SoldierGameObject from './SoldierGameObject'
import TreeGameObject from './TreeGameObject'

export default class GameScene extends Phaser.Scene {
  private frameTime = 0
  private ground: GroundGameObject
  private treeObjects: TreeGameObject[] = []
  private aaGunObjects: AAGunGameObject[] = []
  private bulletObjects = new Map<Phaser.GameObjects.GameObject, BulletGameObject>()
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys
  private healthBar: HealthBarGameObject

  private _platformBodies: Phaser.Physics.Arcade.StaticGroup
  get platforms(): Phaser.Physics.Arcade.StaticGroup { return this._platformBodies }

  private _treeBodies: Phaser.Physics.Arcade.Group
  get trees(): Phaser.Physics.Arcade.Group { return this._treeBodies }

  private _bulletBodies: Phaser.Physics.Arcade.Group
  get bullets(): Phaser.Physics.Arcade.Group { return this._bulletBodies }

  private _groundPos: number
  get groundPos(): number { return this._groundPos }

  private _chopper: ChopperGameObject
  get chopper(): ChopperGameObject { return this._chopper }
  
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
    this.load.spritesheet("chopper", "/images/chopper.png", { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet("aa-gun", "/images/aa-gun.png", { frameWidth: 32, frameHeight: 32 })

    this.load.image("soldier-stand", "/images/soldier-stand.png")
    this.load.spritesheet("soldier-walk", "/images/soldier-walk.png", { frameWidth: 29, frameHeight: 44 })
    this.load.spritesheet("soldier-die", "/images/soldier-die.png", { frameWidth: 35, frameHeight: 42 })
    
    this.load.spritesheet("explode", "/images/explode.png", { frameWidth: 64, frameHeight: 64 })

    this.load.image("bullet", "/images/bullet.png")
  }

  private createAnims(): void {
    this.anims.create({
      key: "soldier-walk",
      frames: this.anims.generateFrameNumbers("soldier-walk", { start: 0, end: 5 }),
      repeat: -1,
      frameRate: 6
    })

    this.anims.create({
      key: "soldier-die",
      frames: this.anims.generateFrameNumbers("soldier-die", { start: 0, end: 4 }),
      frameRate: 6
    })

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
    tree.create(this._treeBodies, 100, this._groundPos, 3)
    this.treeObjects.push(tree)

    this._bulletBodies = this.physics.add.group()

    const aaGun = new AAGunGameObject(this)
    aaGun.create(550, Math.PI / 4)
    this.aaGunObjects.push(aaGun)

    const soldier = new SoldierGameObject(this)
    soldier.create(400)
    soldier.walk(0, false)
    setTimeout(() => soldier.walk(10, false), 2000)
    setTimeout(() => soldier.die(), 4000)

    this.healthBar = new HealthBarGameObject(this)
    this.healthBar.create(100)

    this._chopper = new ChopperGameObject(this)
    this._chopper.create(100, 100, (health) => this.healthBar.health = health)

    this.cameras.main.setBounds(0, 0, this.worldWidth, this.worldHeight)
    this.cameras.main.startFollow(this._chopper.sprite)

    this.cursors = this.input.keyboard.createCursorKeys()
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
      this._chopper.update(this.cursors)
      this.treeObjects.forEach(tree => tree.update())
      this.aaGunObjects.forEach(gun => gun.update(time))
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
import * as Phaser from 'phaser'
import ChopperGameObject from './ChopperGameObject'
import GroundGameObject from './GroundGameObject'
import TreeGameObject from './TreeGameObject'

export default class GameScene extends Phaser.Scene {
  private frameTime = 0
  private _platformBodies: Phaser.Physics.Arcade.StaticGroup
  private _treeBodies: Phaser.Physics.Arcade.Group
  private chopper: ChopperGameObject
  private ground: GroundGameObject
  private treeObjects: TreeGameObject[] = []
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys
  scoreText: Phaser.GameObjects.Text

  get platforms(): Phaser.Physics.Arcade.StaticGroup {
    return this._platformBodies
  }

  get trees(): Phaser.Physics.Arcade.Group {
    return this._treeBodies
  }
  
  constructor(readonly worldWidth: number, readonly worldHeight: number) {
    super({
      active: false,
      visible: false,
      key: 'Game',
    })
    this.chopper = new ChopperGameObject(this)
    this.ground = new GroundGameObject(this)
  }

  init(): void {
    this.physics.world.setFPS(60)
  }

  preload(): void {
    this.load.image('sky', '/images/sky.png')
    this.load.spritesheet('nature', '/images/nature.png', { frameWidth: 16, frameHeight: 16 })
    this.chopper.preload()
  }
  
  create(): void {
    this.physics.world.setBounds(0, 0, this.worldWidth, this.worldHeight)

    const bg = this.add.image(this.worldWidth / 2, this.worldHeight / 2, 'sky')
    bg.setDisplaySize(this.worldWidth, this.worldHeight)

    this._platformBodies = this.physics.add.staticGroup()
    this.ground.create()

    const groundPos = this.sys.game.scale.gameSize.height - 32
    this._treeBodies = this.physics.add.group()
    const tree = new TreeGameObject(this)
    tree.create(this._treeBodies, 100, groundPos, 3)
    this.treeObjects.push(tree)

    this.cursors = this.input.keyboard.createCursorKeys()

    this.chopper.create(100, 100)

    this.cameras.main.setBounds(0, 0, this.worldWidth, this.worldHeight)
    this.cameras.main.startFollow(this.chopper.sprite)
  }
  
  update(time: number, delta: number): void {
    this.frameTime += delta
    if (this.frameTime >= 16.5) {
      this.frameTime = 0
      this.chopper.update(this.cursors)
      this.treeObjects.forEach(tree => tree.update())
    }
  }

  end(): void {
    // Nothing to do yet
  }
}
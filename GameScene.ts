import * as Phaser from 'phaser'
import BirdGameObject from './BirdGameObject'
import GroundGameObject from './GroundGameObject'
import TreeGameObject from './TreeGameObject'

export default class GameScene extends Phaser.Scene {
  private score = 0
  private _platformBodies: Phaser.Physics.Arcade.StaticGroup
  private _treeBodies: Phaser.Physics.Arcade.Group
  private bird: BirdGameObject
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
  
  constructor() {
    super({
      active: false,
      visible: false,
      key: 'Game',
    })
    this.bird = new BirdGameObject(this)
    this.ground = new GroundGameObject(this)
  }

  init(): void {
    this.score = 0
  }

  preload(): void {
    this.load.image('sky', '/images/sky.png')
    this.load.spritesheet('nature', '/images/nature.png', { frameWidth: 16, frameHeight: 16 })
    this.bird.preload()
  }
  
  create(): void {
    this.add.image(400, 300, 'sky')

    this._platformBodies = this.physics.add.staticGroup()
    this.ground.create()

    const groundPos = this.sys.game.scale.gameSize.height - 32
    this._treeBodies = this.physics.add.group()
    const tree = new TreeGameObject(this)
    tree.create(this._treeBodies, 100, groundPos, 3)
    this.treeObjects.push(tree)

    this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' })

    this.cursors = this.input.keyboard.createCursorKeys()

    this.bird.create()
  }
  
  update(): void {
    this.bird.update(this.cursors)
    this.treeObjects.forEach(tree => tree.update())
  }

  end(): void {
    // Nothing to do yet
  }
}
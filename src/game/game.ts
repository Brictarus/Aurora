import { Camera } from './camera';
import { Direction } from './direction';
import { Entity } from './entity';
import { GameMap } from './game-map';
import { Hud } from './hud';
import { Keyboard } from './keyboard';
import { Loader } from './loader';
import { Player } from './player';

export class Game {
  private started = false;
  private isStopped = false;

  private readonly FPS: number | undefined;
  private lastTime = new Date();
  private lastFrameTime = new Date();
  private frameCount = 0;
  private realFPS = 0;
  private isDebugInfoVisible = true;

  private camera: Camera | undefined;
  private entities: Entity[] = [];
  private map: GameMap | undefined;
  private loader = new Loader();
  private readonly keyboard: Keyboard;
  private readonly canvas: HTMLCanvasElement;
  private readonly context: CanvasRenderingContext2D;
  private player: Player | undefined;
  private hud: Hud | undefined;

  constructor(config: any) {
    this.keyboard = config.keyboard;
    this.canvas = config.canvas;
    this.context = this.canvas.getContext('2d')!;

    this.fetchMap('premiere')
      .then(json => {
        this.map = new GameMap(json);
        this.start();
      })
  }

  fetchMap(mapName: string) {
    return fetch(`./maps/${mapName}.json`)
      .then(response => response.json());
  }

  tick() {
    if (this.started) {
      this.update();

      const nowTime = new Date();
      const diffTime = nowTime.getTime() - this.lastFrameTime.getTime();
      if (!this.FPS || diffTime >= 1000 / this.FPS) {
        this.renderFrame();
        this.lastFrameTime = nowTime;
      }
    }

    if (!this.isStopped) {
      requestAnimationFrame(this.tick.bind(this));
    }
  }

  start() {
    this.started = true;
    this.loader.addSprite('angel1.png');
    this.loader.load(() => {
      this.player = new Player('player', 2, 2,
        this.map!.getTileWidth(), this.map!.getTileHeight(),
        80, 64, Direction.DOWN, this.loader.sprites['angel1.png'].image);
      this.entities = [
        new Entity('entity1', 50, 60, 20, 30, 'green'),
        new Entity('entity2', 150, 70, 40, 10, 'purple'),
        new Entity('entity3', 200, 200, 15, 15, 'blue'),
      ];
      this.entities.push(this.player);
      this.createCamera();

      this.camera?.followEntity(this.player);
      const hudHeight = 50;
      this.hud = new Hud(this.player, 0, this.canvas.height - hudHeight, this.canvas.width, hudHeight);
      this.tick();
    });
  }

  createCamera() {
    this.camera = new Camera(300, 300, 0, 0, this.map!.getGridHeight() * this.map!.getTileHeight(), this.map!.getGridWidth() * this.map!.getTileWidth());
    this.camera.setDeadZoneSize(100, 100);
    const windowSize = this.camera.getWindowSize();
    this.canvas.width = windowSize.w;
    this.canvas.height = windowSize.h;
  }

  drawFPS() {
    const nowTime = new Date(),
      diffTime = nowTime.getTime() - this.lastTime.getTime();

    if (diffTime >= 1000) {
      this.realFPS = this.frameCount;
      this.frameCount = 0;
      this.lastTime = nowTime;
    }
    this.frameCount++;

    this.drawText(`FPS: ${this.realFPS}`, 30, 30, false);
  }

  drawPlayerPos() {
    if (this.player) {
      let dir = '';
      switch (this.player!.direction) {
        case Direction.UP:
          dir = 'up';
          break;
        case Direction.DOWN:
          dir = 'down';
          break;
        case Direction.LEFT:
          dir = 'left';
          break;
        case Direction.RIGHT:
          dir = 'right';
          break;
      }
      this.drawText('Player: [' + this.player.gx + ', '
        + this.player.gy + '], dir : ' + dir, 100, 30, false);
    }
  }

  drawText(text: string, x: number, y: number, centered: boolean, color?: string, strokeColor?: string) {
    const ctx = this.context;

    const strokeSize = 3;

    if (text && x && y) {
      ctx.save();
      if (centered) {
        ctx.textAlign = 'center';
      }
      ctx.strokeStyle = strokeColor || '#373737';
      ctx.lineWidth = strokeSize;
      ctx.strokeText(text, x, y);
      ctx.fillStyle = color || 'white';
      ctx.fillText(text, x, y);
      ctx.restore();
    }
  }

  drawDebugInfo() {
    if (this.isDebugInfoVisible) {
      this.drawFPS();
      this.drawPlayerPos();
    }
  }

  clearScreen() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  renderFrame() {
    this.clearScreen();
    this.map!.drawMap(this.context, this.camera!);
    this.entities.forEach((entity) => {
      entity.draw(this.context, this.camera!)
    });
    this.hud!.draw(this.context);
    this.drawDebugInfo();
  }

  update() {
    this.entities.forEach((entity) => {
      entity.update(this.map!, this.keyboard)
    });
    this.camera!.update(this.keyboard);
  }
}

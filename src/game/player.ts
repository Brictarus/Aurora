import { Camera } from './camera';
import { Direction } from './direction';
import { Entity } from './entity';
import { GameMap } from './game-map';
import { Keyboard } from './keyboard';

export class Player extends Entity {

  hpMax = 100;
  hp = 80;
  mpMax = 80;
  mp = 60;

  gx: number;
  gy: number;
  direction: Direction;

  private isWalking = 0;
  private walkAnimationDuration = 60;
  private walkSteps = 4;
  private currentFrame: { sx: number; sy: number };

  private readonly tileWidth: number;
  private readonly tileHeight: number;
  private readonly sprite: HTMLImageElement;

  colors = ['purple', 'blue', 'green', 'yellow', 'orange', 'red'];

  constructor(name: string, gx: number, gy: number, tileWidth: number, tileHeight: number, w: number, h: number, direction: Direction, sprite: HTMLImageElement) {
    super(name, gx * tileWidth + (tileWidth - w) / 2, gy * tileHeight + (tileHeight - h) / 2, w, h, 'red');

    this.gx = gx;
    this.gy = gy;
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
    this.direction = direction;
    this.sprite = sprite;
    this.currentFrame = {
      sx: 0,
      sy: 0
    };
  }

  draw(context: CanvasRenderingContext2D, camera: Camera) {
    context.save();

    const offsetX = camera && camera.xScroll ? camera.xScroll : 0;
    const offsetY = camera && camera.yScroll ? camera.yScroll : 0;

    context.drawImage(this.sprite, this.currentFrame.sx, this.currentFrame.sy,
      this.w, this.h, this.x - offsetX, this.y - offsetY, this.w, this.h);

    this.drawBoundingBox(context, camera);

    context.restore();
  }

  move(direction: Direction, map: GameMap) {
    if (!this.isWalking) {
      this.direction = direction;
      const dest = map.getAdjacentCellCoord({
        x: this.gx,
        y: this.gy
      }, direction);
      // On effectue le déplacement
      if (dest != null) {
        this.isWalking = 1;
        this.gx = dest.x;
        this.gy = dest.y;
      }
    }
  }

  update(map: GameMap, keyboard: Keyboard) {

    if (this.isWalking) {
      this.isWalking++;
      if (this.isWalking > this.walkAnimationDuration) {
        this.isWalking = 0;
      }
    }

    if (keyboard) {
      if (keyboard.isPressed('up')) {
        this.move(Direction.UP, map);
      } else if (keyboard.isPressed('down')) {
        this.move(Direction.DOWN, map);
      } else if (keyboard.isPressed('left')) {
        this.move(Direction.LEFT, map);
      } else if (keyboard.isPressed('right')) {
        this.move(Direction.RIGHT, map);
      }
    }

    let offsetX = 0,
      offsetY = 0;
    if (this.isWalking) {
      const step = Math.round(this.isWalking / (this.walkAnimationDuration / (this.walkSteps))) % this.walkSteps;
      this.currentFrame.sx = step * this.w;

      const prct = (this.isWalking / this.walkAnimationDuration);
      const multiplier = (this.direction === Direction.UP || this.direction === Direction.LEFT) ? 1 : -1;
      if (this.direction === Direction.UP || this.direction === Direction.DOWN) {
        offsetY = (this.tileHeight * multiplier) - (this.tileHeight * prct * multiplier);
      } else {
        offsetX = (this.tileWidth * multiplier) - (this.tileWidth * prct * multiplier);
      }
    } else {
      this.currentFrame.sx = 0;
    }
    this.currentFrame.sy = this.direction * this.h;

    this.x = this.gx * this.tileWidth + (this.tileWidth - this.w) / 2 + offsetX;
    this.y = this.gy * this.tileHeight + (this.tileHeight - this.h) / 2 + offsetY;
  }
}

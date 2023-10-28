import { Entity } from "./entity";
import { Logger } from "../logger";
import { direction } from "./direction";

export class Player extends Entity {

  hpMax = 100;
  hp = 80;
  mpMax = 80;
  mp = 60;

  isWalking = 0;
  walkAnimationDuration = 60;
  walkSteps = 4;

  colors = ['purple', 'blue', 'green', 'yellow', 'orange', 'red'];

  constructor(name, gx, gy, tileWidth, tileHeight, w, h, direction, sprite) {
    const x = gx * tileWidth + (tileWidth - w) / 2;
    const y = gy * tileHeight + (tileHeight - h) / 2;
    super(name, x, y, w, h, 'red');
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
    this.logger = Logger.getLogger('Player', Logger.Levels.DEBUG);
  }

  draw(context, camera) {
    context.save();

    const offsetX = camera && camera.xScroll ? camera.xScroll : 0;
    const offsetY = camera && camera.yScroll ? camera.yScroll : 0;

    context.drawImage(this.sprite.image, this.currentFrame.sx, this.currentFrame.sy,
      this.w, this.h, this.x - offsetX, this.y - offsetY, this.w, this.h);

    this.drawBoundingBox(context, camera);

    context.restore();
  }

  move(direction, map) {
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

  update(map, keyboard) {

    if (this.isWalking) {
      this.isWalking++;
      if (this.isWalking > this.walkAnimationDuration) {
        this.isWalking = 0;
      }
    }

    if (keyboard) {
      if (keyboard.isPressed('up')) {
        this.move(direction.UP, map);
      } else if (keyboard.isPressed('down')) {
        this.move(direction.DOWN, map);
      } else if (keyboard.isPressed('left')) {
        this.move(direction.LEFT, map);
      } else if (keyboard.isPressed('right')) {
        this.move(direction.RIGHT, map);
      }
    }

    let offsetX = 0,
      offsetY = 0;
    if (this.isWalking) {
      const step = Math.round(this.isWalking / (this.walkAnimationDuration / (this.walkSteps))) % this.walkSteps;
      this.currentFrame.sx = step * this.w;

      const prct = (this.isWalking / this.walkAnimationDuration);
      const multiplier = (this.direction === direction.UP || this.direction === direction.LEFT) ? 1 : -1;
      if (this.direction === direction.UP || this.direction === direction.DOWN) {
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

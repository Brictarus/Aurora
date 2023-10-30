import { Color } from '@core/common-types';
import { Camera } from './camera';
import { GameMap } from './game-map';
import { Keyboard } from './keyboard';

export class Entity {
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
  color: Color;

  /**
   * Constructor
   * @param name name of the entity
   * @param x initial x position (top-left corner)
   * @param y initial y position (top-left corner)
   * @param w entity width
   * @param h entity height
   * @param [color] color of the entity. default if red
   */
  constructor(name: string, x: number, y: number, w: number, h: number, color?: Color) {
    this.name = name;

    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.color = color || '#FF0000';
  }

  /**
   * Updates the entity
   */
  update(_map: GameMap, _keyboard: Keyboard) {
  }

  getBoundingBox() {
    return {
      x: this.x,
      y: this.y,
      w: this.w,
      h: this.h
    };
  }

  /**
   * Draws entity in specified context
   * @param context drawing context
   * @param camera camera to use
   */
  draw(context: CanvasRenderingContext2D, camera: Camera) {
    context.save();

    const offsetX = camera && camera.xScroll ? camera.xScroll : 0;
    const offsetY = camera && camera.yScroll ? camera.yScroll : 0;

    context.fillStyle = this.color;
    context.fillRect(this.x - offsetX, this.y - offsetY, this.w, this.h);

    this.drawBoundingBox(context, camera);

    context.restore();
  }

  drawBoundingBox(context: CanvasRenderingContext2D, camera: Camera) {
    context.save();

    const offsetX = camera && camera.xScroll ? camera.xScroll : 0;
    const offsetY = camera && camera.yScroll ? camera.yScroll : 0;

    context.strokeStyle = '#0F0';
    context.strokeRect(this.x - offsetX, this.y - offsetY, this.w, this.h);

    context.restore();
  }
}
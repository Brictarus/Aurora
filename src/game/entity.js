/*
 * Base class for all entities in game
 *
 * @author Brictarus
 */
export class Entity {
  /**
   * Constructor
   * @param name name of the entity
   * @param x initial x position (top-left corner)
   * @param y initial y position (top-left corner)
   * @param w entity width
   * @param h entity height
   * @param [color] color of the entity. default if red
   */
  constructor(name, x, y, w, h, color) {
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
  update(map, keyboard) {
  }

  getBoundingBox() {
    return {
      x : this.x,
      y : this.y,
      w : this.w,
      h : this.h
    };
  }

  /**
   * Draws entity in specified context
   * @param context drawing context
   * @param camera camera to use
   */
  draw(context, camera) {
    context.save();

    const offsetX = camera && camera.xScroll ? camera.xScroll : 0;
    const offsetY = camera && camera.yScroll ? camera.yScroll : 0;

    context.fillStyle = this.color;
    context.fillRect(this.x - offsetX, this.y - offsetY, this.w, this.h);

    this.drawBoundingBox(context, camera);

    context.restore();
  }

  drawBoundingBox(context, camera) {
    context.save();

    const offsetX = camera && camera.xScroll ? camera.xScroll : 0;
    const offsetY = camera && camera.yScroll ? camera.yScroll : 0;

    context.strokeStyle = '#0F0';
    context.strokeRect(this.x - offsetX, this.y - offsetY, this.w, this.h);

    context.restore();
  }
}
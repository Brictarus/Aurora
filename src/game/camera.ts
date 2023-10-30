import { Entity } from './entity';
import { collisions } from './helper';
import { Keyboard } from './keyboard';

export class Camera {
  xScroll: number;
  yScroll: number;
  scrollingWindowWidth: number;
  scrollingWindowHeight: number;
  mapWidth: number;
  mapHeight: number;
  deadZoneSize = { w: 0, h: 0 };
  canPan = false;
  panSpeed = 4;
  trackedEntity: Entity | null = null;

  constructor(width: number, height: number, initialX: number, initialY: number, mapWidth: number, mapHeight: number) {
    this.xScroll = initialX;
    this.yScroll = initialY;
    this.scrollingWindowWidth = width;
    this.scrollingWindowHeight = height;
    this.mapWidth = mapWidth;
    this.mapHeight = mapHeight;
  }

  private clampScroll() {
    if (this.xScroll < 0) {
      this.xScroll = 0;
    }
    if (this.yScroll < 0) {
      this.yScroll = 0;
    }
    if (this.xScroll > this.mapWidth - this.scrollingWindowWidth) {
      this.xScroll = this.mapWidth - this.scrollingWindowWidth;
    }
    if (this.yScroll > this.mapHeight - this.scrollingWindowHeight) {
      this.yScroll = this.mapHeight - this.scrollingWindowHeight;
    }
  }

  setDeadZoneSize(w: number, h: number) {
    this.deadZoneSize.w = Math.min(w, this.scrollingWindowWidth);
    this.deadZoneSize.h = Math.min(h, this.scrollingWindowHeight);
  }

  getWindowSize() {
    return {
      h: this.scrollingWindowHeight,
      w: this.scrollingWindowWidth
    };
  }

  getDeadZoneX() {
    return this.xScroll + Math.floor((this.scrollingWindowWidth - this.deadZoneSize.w) / 2);
  }

  getDeadZoneY() {
    return this.yScroll + Math.floor((this.scrollingWindowHeight - this.deadZoneSize.h) / 2);
  }

  followEntity(entity: Entity) {
    this.trackedEntity = entity;
  }

  update(keyboard: Keyboard) {
    if (this.trackedEntity != null) {

      const trackedEntityRect = this.trackedEntity.getBoundingBox();
      const deadZoneRect = {
        x: this.getDeadZoneX(),
        y: this.getDeadZoneY(),
        w: this.deadZoneSize.w,
        h: this.deadZoneSize.h
      };
      const canTrack = collisions.canContain(deadZoneRect, trackedEntityRect);
      if (canTrack) {
        const pointIsInBox = collisions.contains(deadZoneRect, trackedEntityRect);
        if (window.__debug && pointIsInBox) console.log('contains ! ');
        if (!pointIsInBox) {
          if (trackedEntityRect.x < deadZoneRect.x) {
            this.xScroll = trackedEntityRect.x - (deadZoneRect.x - this.xScroll);
          } else if (trackedEntityRect.x + trackedEntityRect.w > deadZoneRect.x + deadZoneRect.w) {
            this.xScroll = trackedEntityRect.x + trackedEntityRect.w
              - (this.scrollingWindowWidth - Math.floor((this.scrollingWindowWidth - deadZoneRect.w) / 2));
          }
          if (trackedEntityRect.y < deadZoneRect.y) {
            this.yScroll = trackedEntityRect.y - (deadZoneRect.y - this.yScroll);
          } else if (trackedEntityRect.y + trackedEntityRect.h > deadZoneRect.y + deadZoneRect.h) {
            this.yScroll = trackedEntityRect.y + trackedEntityRect.h
              - (this.scrollingWindowHeight - Math.floor((this.scrollingWindowHeight - deadZoneRect.h) / 2));
          }
        }
      } else {
        this.xScroll = Math.floor(trackedEntityRect.x + trackedEntityRect.w / 2 - this.scrollingWindowWidth / 2);
        this.yScroll = Math.floor(trackedEntityRect.y + trackedEntityRect.h / 2 - this.scrollingWindowHeight / 2);
      }
    } else if (this.canPan) {
      if (keyboard.isPressed('up')) {
        this.yScroll -= this.panSpeed;
      }
      if (keyboard.isPressed('down')) {
        this.yScroll += this.panSpeed;
      }
      if (keyboard.isPressed('left')) {
        this.xScroll -= this.panSpeed;
      }
      if (keyboard.isPressed('right')) {
        this.xScroll += this.panSpeed;
      }
    }
    this.clampScroll();
  }

  draw(ctx: CanvasRenderingContext2D) {
    const xStart = Math.floor((this.scrollingWindowWidth - this.deadZoneSize.w) / 2);
    const yStart = Math.floor((this.scrollingWindowHeight - this.deadZoneSize.h) / 2);
    ctx.strokeStyle = window.__debugDrawingColor2;
    ctx.strokeRect(xStart, yStart, this.deadZoneSize.w, this.deadZoneSize.h);
  }
}
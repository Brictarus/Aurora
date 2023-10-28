import { Tileset } from "./tileset";
import { direction } from "./direction";

export class GameMap {

  mustDrawMesh = true;
  terrain = null;
  tileWidth = null;
  tileHeight = null;
  mapHeight = null;
  mapWidth = null;
  tileset = null;

  constructor(mapData) {
    this.terrain = mapData.terrain;
    this.tileWidth = mapData.tileWidth;
    this.tileHeight = mapData.tileHeight;
    this.mapHeight = this.terrain.length;
    this.mapWidth = this.terrain[0].length;
    this.tileset = new Tileset(mapData.tileset, this.tileWidth, this.tileHeight);
  }

  getTileWidth() {
    return this.tileWidth;
  }

  getTileHeight() {
    return this.tileHeight;
  }

  // Pour r�cup�rer la taille (en tiles) de la carte
  getGridHeight() {
    return this.mapHeight;
  }

  getAdjacentCellCoord(srcCoord, dir) {
    const destCoord = {x: srcCoord.x, y: srcCoord.y};
    switch (dir) {
      case direction.DOWN :
        destCoord.y++;
        break;
      case direction.LEFT :
        destCoord.x--;
        break;
      case direction.RIGHT :
        destCoord.x++;
        break;
      case direction.UP :
        destCoord.y--;
        break;
    }
    if (destCoord.x < 0 || destCoord.x >= this.mapWidth
      || destCoord.y < 0 || destCoord.y >= this.mapHeight) {
      return null;
    }
    return destCoord;
  }

  getGridWidth() {
    return this.mapWidth;
  }

  drawMap(context, cam) {
    const camSize = cam.getWindowSize();
    const minx = Math.floor(cam.xScroll / this.tileWidth);
    const miny = Math.floor(cam.yScroll / this.tileHeight);
    const maxx = Math.ceil((cam.xScroll + camSize.w) / this.tileWidth);
    const maxy = Math.ceil((cam.yScroll + camSize.h) / this.tileHeight);
    for (let i = miny; i < maxy; i++) {
      const ligne = this.terrain[i];
      const y = i * 32 - cam.yScroll;
      for (let j = minx; j < maxx; j++) {
        const x = j * 32 - cam.xScroll;
        this.tileset.dessinerTile(ligne[j], context, x, y);
      }
    }

    if (this.mustDrawMesh) {
      this.drawMapMesh(context, minx, maxx, miny, maxy, cam);
    }
    if (__debug) {
      cam.draw(context);
    }
  }

  drawMapMesh(context, minx, maxx, miny, maxy, cam) {
    const strokeColor = __debugDrawingColor1;
    // tracé des lignes horizontales
    for (let y = miny; y < maxy; y++) {
      const xStart = minx * this.tileWidth - cam.xScroll;
      const xStop = maxx * this.tileWidth - cam.xScroll;
      const yPixels = y * this.tileHeight - cam.yScroll;
      context.strokeStyle = strokeColor;
      context.beginPath();
      context.moveTo(xStart, yPixels);
      context.lineTo(xStop, yPixels);
      context.stroke();
    }
    // trac� des lignes verticales
    for (let x = minx; x < maxx; x++) {
      const yStart = miny * this.tileHeight - cam.yScroll;
      const yStop = maxy * this.tileHeight - cam.yScroll;
      const xPixels = x * this.tileWidth - cam.xScroll;
      context.strokeStyle = strokeColor;
      context.beginPath();
      context.moveTo(xPixels, yStart);
      context.lineTo(xPixels, yStop);
      context.stroke();
    }
  }
}

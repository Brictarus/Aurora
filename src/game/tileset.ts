export class Tileset {
  private readonly image: HTMLImageElement;
  private readonly tileWidth: number;
  private readonly tileHeight: number;
  width: number = 0;

  constructor(tilesetName: string, tileWidth: number, tileHeight: number) {
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
    this.image = new Image();

    this.image.onload = () => {
      if (!this.image.complete) {
        throw `Error loading "${tilesetName}" tileset resource`;
      }
      this.width = this.image.width / tileWidth;
    }
    this.image.src = 'tilesets/' + tilesetName;
  }

  drawTile(number: number, context: CanvasRenderingContext2D, xDestination: number, yDestination: number) {
    let xSourceEnTiles = number % this.width;
    if (xSourceEnTiles === 0) {
      xSourceEnTiles = this.width;
    }

    const ySourceEnTiles = Math.ceil(number / this.width);
    const xSource = (xSourceEnTiles - 1) * this.tileWidth;
    const ySource = (ySourceEnTiles - 1) * this.tileHeight;
    context.drawImage(this.image, xSource, ySource, this.tileWidth, 32, xDestination, yDestination, this.tileWidth, this.tileHeight);
  }
}
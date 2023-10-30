export class Loader {

  readonly sprites: { [key: string]: SpriteLoading } = {};
  readonly tilesets: { [key: string]: TilesetLoading } = {};

  resourcesCount = 0;
  remainingResourcesCount = 0;
  callbackSuccess: undefined | (() => void);

  addSprite(name: string) {
    this.sprites[name] = {
      image: new Image(),
      loaded: false,
      loading: false,
      error: false
    };
    this.resourcesCount++;
  }

  load(callback: () => void) {
    this.remainingResourcesCount = this.resourcesCount;
    this.callbackSuccess = callback;
    for (let spriteName in this.sprites) {
      this.sprites[spriteName].loading = true;
      this.sprites[spriteName].image.addEventListener('load', () => {
        this.sprites[spriteName].loaded = true;
        this.checkAllLoaded();
      });
      this.sprites[spriteName].image.src = 'sprites/' + spriteName;
    }
    for (let tilesetName in this.tilesets) {
      this.tilesets[tilesetName].loading = true;
      this.tilesets[tilesetName].image.addEventListener('load', () => {
        const name = tilesetName;
        this.tilesets[name].imageLoaded = true;
        this.tilesets[name].loaded = this.tilesets[name].metadataLoaded && this.tilesets[name].imageLoaded;
        this.checkAllLoaded();
      });
      this.tilesets[tilesetName].image.src = `tilesets/${tilesetName}`;
      fetch(`tilesets/${tilesetName}.json`)
        .then(response => response.json())
        .then(data => {
          this.tilesets[tilesetName].metadata = data;
          this.tilesets[tilesetName].metadataLoaded = true;
          this.tilesets[tilesetName].loaded = this.tilesets[tilesetName].metadataLoaded && this.tilesets[tilesetName].imageLoaded;
          this.checkAllLoaded();
        });
    }
  }

  checkAllLoaded() {
    for (let i in this.sprites) {
      if (this.sprites[i].loaded === false) {
        return false;
      }
    }
    for (let j in this.tilesets) {
      if (this.tilesets[j].loaded === false) {
        return false;
      }
    }
    this.callbackSuccess?.();
    return true;
  }
}

interface SpriteLoading {
  image: HTMLImageElement,
  loaded: boolean,
  loading: boolean,
  error: boolean
}

interface TilesetLoading {
  image: HTMLImageElement,
  loaded: boolean,
  loading: boolean,
  imageLoaded: boolean,
  metadataLoaded: boolean;
  metadata: any;
}

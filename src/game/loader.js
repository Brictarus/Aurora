import { Logger } from "../logger";

export class Loader {

  sprites = {};
  tilesets = {};
  callbackSuccess = null;
  logger = Logger.getLogger('Loader', Logger.Levels.INFO);
  resourcesCount = 0;
  remainingResourcesCount = 0;

  addSprite(name) {
    this.sprites[name] = {
      image: new Image(),
      loaded: false,
      loading: false,
      error: false
    };
    this.resourcesCount++;
  }

  load(callback) {
    if (this.resourcesCount === 0) {
      this.logger.info('[Loader] No resource to load');
    }
    this.remainingResourcesCount = this.resourcesCount;
    this.callbackSuccess = callback;
    for (let i in this.sprites) {
      this.sprites[i].loading = true;
      this.sprites[i].image.addEventListener('load', () => {
        const name = i;
        this.logger.debug(`[Loader] Sprite '${name}' loaded`);
        this.sprites[name].loaded = true;
        this.checkAllLoaded();
      });
      this.sprites[i].image.src = 'sprites/' + i;
    }
    for (let j in this.tilesets) {
      this.tilesets[j].loading = true;
      this.tilesets[j].image.addEventListener('load', () => {
        const name = j;
        this.logger.debug(`[Loader] Tileset '${name}' loaded`);
        this.tilesets[name].imageLoaded = true;
        this.tilesets[name].loaded = this.tilesets[name].metadataLoaded && this.tilesets[name].imageLoaded;
        this.checkAllLoaded();
      });
      this.tilesets[j].image.src = 'tilesets/' + j;
      $.getJSON('tilesets/' + j + '.json', () => {
        const name = j;
        this.logger.debug('[Loader] JSON -', name, ':', data);
        this.tilesets[name].metadata = data;
        this.tilesets[name].metadataLoaded = true;
        this.tilesets[name].loaded = this.tilesets[name].metadataLoaded && this.tilesets[name].imageLoaded;
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
    this.logger.info(`[Loader] ${this.resourcesCount} resource(s) loaded`);
    this.callbackSuccess?.();
    return true;
  }
}

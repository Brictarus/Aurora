import { Loader } from "./loader";
import { GameMap } from "./game-map";
import { Player } from "./player";
import { Entity } from "./entity";
import { direction } from "./direction";
import { Camera } from "./camera";
import { Hud } from "./hud";

export class Game {
  constructor(config) {
    this.started = false;
    this.isStopped = false;

    this.FPS = null;
    this.lastTime = new Date();
    this.lastFrameTime = new Date();
    this.frameCount = 0;
    this.realFPS = 0;
    this.isDebugInfoVisible = true;

    this.camera = null;
    this.keyboard = config.keyboard;
    this.entities = [];
    this.map = null;
    this.loader = new Loader();
    this.canvas = config.canvas;
    this.context = (this.canvas && this.canvas.getContext) ? this.canvas.getContext("2d") : null;

    this.fetchMap('premiere')
      .then(json => {
        this.map = new GameMap(json);
        this.start();
      })
  }

  fetchMap(mapName) {
    return fetch(`./maps/${mapName}.json`)
      .then(response => response.json());
  }

  tick () {
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

  start () {
    this.started = true;
    this.loader.addSprite('angel1.png');
    this.loader.load(function () {
      window.player = this.player = new Player('player', 2, 2,
        this.map.getTileWidth(), this.map.getTileHeight(),
        80, 64, direction.DOWN, this.loader.sprites['angel1.png']);
      this.entities = [
        new Entity('entity1', 50, 60, 20, 30, 'green'),
        new Entity('entity2', 150, 70, 40, 10, 'purple'),
        new Entity('entity3', 200, 200, 15, 15, 'blue'),
      ];
      this.entities.push(this.player);
      this.createCamera();
      //this.camera.canPan = true;
      this.camera.followEntity(this.player);
      const hudHeight = 50;
      this.hud = new Hud(this.player, 0, this.canvas.height - hudHeight, this.canvas.width, hudHeight);
      this.tick();
      console.log("Game loop started.");
    }.bind(this));
  }

  createCamera () {
    this.camera = new Camera(300, 300, 0, 0, this.map.getGridHeight() * this.map.getTileHeight(), this.map.getGridWidth() * this.map.getTileWidth());
    this.camera.setDeadZoneSize(100, 100);
    const windowSize = this.camera.getWindowSize();
    this.canvas.width = windowSize.w;
    this.canvas.height = windowSize.h;
  }

  drawFPS () {
    const nowTime = new Date(),
      diffTime = nowTime.getTime() - this.lastTime.getTime();

    if (diffTime >= 1000) {
      this.realFPS = this.frameCount;
      this.frameCount = 0;
      this.lastTime = nowTime;
    }
    this.frameCount++;

    this.drawText("FPS: " + this.realFPS, 30, 30, false);
  }

  drawPlayerPos () {
    if (this.player) {
      let dir = '';
      switch (this.player.direction) {
        case direction.UP:
          dir = 'up';
          break;
        case direction.DOWN:
          dir = 'down';
          break;
        case direction.LEFT:
          dir = 'left';
          break;
        case direction.RIGHT:
          dir = 'right';
          break;
      }
      this.drawText('Player: [' + this.player.gx + ', '
        + this.player.gy + '], dir : ' + dir, 100, 30, false);
    }
  }

  drawText (text, x, y, centered, color, strokeColor) {
    const ctx = this.context;

    const strokeSize = 3;

    if (text && x && y) {
      ctx.save();
      if (centered) {
        ctx.textAlign = "center";
      }
      ctx.strokeStyle = strokeColor || "#373737";
      ctx.lineWidth = strokeSize;
      ctx.strokeText(text, x, y);
      ctx.fillStyle = color || "white";
      ctx.fillText(text, x, y);
      ctx.restore();
    }
  }

  drawDebugInfo () {
    if (this.isDebugInfoVisible) {
      this.drawFPS();
      this.drawPlayerPos();
    }
  }

  clearScreen () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  renderFrame () {
    this.clearScreen();
    this.map.drawMap(this.context, this.camera);
    this.entities.forEach(function (entity) {
      entity.draw(this.context, this.camera)
    }
      .bind(this));
    this.hud.draw(this.context);
    this.drawDebugInfo();
  }

  update () {
    this.entities.forEach(function (entity) {
      entity.update(this.map, this.keyboard)
    }
      .bind(this));
    this.camera.update(this.keyboard);
  }
}

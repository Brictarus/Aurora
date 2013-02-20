var Player = Entity.extend({

		hpMax : 100,
		hp : 80,
		mpMax : 80,
		mp : 60,

		isWalking : 0,
		walkAnimationDuration : 60,
		walkSteps : 4,
		
		colors : ['purple', 'blue', 'green', 'yellow', 'orange', 'red'],

		initialize : function (name, gx, gy, tileWidth, tileHeight, w, h, direction, sprite) {
			var x = gx * tileWidth + (tileWidth - w) / 2;
			var y = gy * tileHeight + (tileHeight - h) / 2;
			//w = tileWidth;
			//h = tileHeight;
			this.__super__.initialize.call(this, name, x, y, w, h, 'red');
			this.gx = gx;
			this.gy = gy;
			this.tileWidth = tileWidth;
			this.tileHeight = tileHeight;
			this.direction = direction;
			this.sprite = sprite;
			this.currentFrame = {
				sx : 0,
				sy : 0
			};
			this.logger = Logger.getLogger('Player', Logger.Levels.DEBUG);
		},

		draw : function (context, camera) {
			//this.__super__.draw.call(this, context, camera);
			context.save();

			var offsetX = camera && camera.xScroll ? camera.xScroll : 0;
			var offsetY = camera && camera.yScroll ? camera.yScroll : 0;

			context.drawImage(this.sprite.image, this.currentFrame.sx, this.currentFrame.sy,
				this.w, this.h, this.x - offsetX, this.y - offsetY, this.w, this.h);

			this.__super__.drawBoundingBox.call(this, context, camera);
			
			context.restore();
		},

		move : function (direction, map) {
			if (!this.isWalking) {
				this.direction = direction;
				var dest = map.getAdjacentCellCoord({
						x : this.gx,
						y : this.gy
					}, direction);
				// On effectue le déplacement
				if (dest != null) {
					this.isWalking = 1;
					this.gx = dest.x;
					this.gy = dest.y;
				}
			}
		},

		update : function (map, keyboard) {

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

			var offsetX = 0,
			offsetY = 0;
			if (this.isWalking) {
				//var step = Math.round(this.isWalking / (this.walkAnimationDuration / (this.colors.length - 1)));
				//this.color = this.colors[step];
				
				var step = Math.round(this.isWalking / (this.walkAnimationDuration / (this.walkSteps))) % this.walkSteps;
				var oldSx = this.currentFrame.sx;
				this.currentFrame.sx = step * this.w;
				if (oldSx !== this.currentFrame.sx) {
					this.logger.debug('[Player] this.currentFrame.sx = ' + this.currentFrame.sx);
				}
				
				var prct = (this.isWalking / this.walkAnimationDuration);
				var multiplier = (this.direction == direction.UP || this.direction == direction.LEFT) ? 1 : -1;
				if (this.direction == direction.UP || this.direction == direction.DOWN) {
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
	});

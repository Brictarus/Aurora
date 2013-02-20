/*
 * Base class for all entities in game
 *
 * @author Brictarus
 */
var Entity = BaseClass.extend({
	/**
	 * Constructor
	 * @param name 
	 * 		name of the entity
	 * @param x 
	 * 		initial x position (top-left corner)
	 * @param y 
	 * 		initial y position (top-left corner)
	 * @param w 
	 * 		entity width
	 * @param h 
	 * 		entity height
	 * @param [color] 
	 * 		color of the entity. default if red
	 */
	initialize : function (name, x, y, w, h, color) {
		console.log('[entity initialize]');
		console.log('	name : ' + name);
		console.log('	x    : ' + x);
		console.log('	y    : ' + y);
		console.log('	w    : ' + w);
		console.log('	h    : ' + h);

		this.name = name;

		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;

		this.color = color || '#FF0000';
	},

	/**
	 * Sets the entity fill color
	 * @param color
	 *		the fill color to assign to the entity
	 */
	setColor : function(color) {
		this.color = color;
	},

	getBoundingBox: function() {
		return {
			x : this.x,
			y : this.y,
			w : this.w,
			h : this.h
		};
	},

	/**
	 * Updates the entity
	 */
	update : function(map, keyboard) {

	},

	/**
	 * Draws entity in specified context
	 * @param context
	 *		drawing context
	 */
	draw : function(context, camera) {
		context.save();

		var offsetX = camera && camera.xScroll ? camera.xScroll : 0;
		var offsetY = camera && camera.yScroll ? camera.yScroll : 0;

		context.fillStyle = this.color;
		context.fillRect(this.x - offsetX, this.y - offsetY, this.w, this.h);

		this.drawBoundingBox(context, camera);
		
		context.restore();
	},
	
	drawBoundingBox : function(context, camera) {
		context.save();

		var offsetX = camera && camera.xScroll ? camera.xScroll : 0;
		var offsetY = camera && camera.yScroll ? camera.yScroll : 0;

		context.strokeStyle = '#0F0';
		context.strokeRect(this.x - offsetX, this.y - offsetY, this.w, this.h);
		
		context.restore();
	}
});
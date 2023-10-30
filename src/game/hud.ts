import { Player } from './player';

export class Hud {

	character: Player;
	x: number;
	y: number;
	w: number;
	h: number;

	constructor(character: Player, x: number, y: number, w: number, h: number) {
		this.character = character;
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}

	draw(ctxt: CanvasRenderingContext2D) {
		ctxt.save();
		ctxt.lineWidth = 2;

		// HP
		const prctHP = Math.max(Math.min(this.character.hp / this.character.hpMax, 1), 0);

		const grdHP = ctxt.createRadialGradient(this.x + this.h / 2, this.y + this.h / 2, 0, this.x + this.h / 2, this.y + this.h / 2, this.h / 2);
		grdHP.addColorStop(0, '#F77');
	    grdHP.addColorStop(0.8, '#AA0000');
	    grdHP.addColorStop(1, '#550000');

		ctxt.fillStyle = grdHP;
		ctxt.strokeStyle = '#550000';

		this.drawPartialCircle(ctxt, this.x + this.h / 2, this.y + this.h / 2, this.h / 2, prctHP);
		const cosHP = Math.sqrt(1 - Math.pow(Math.asin(2 * prctHP - 1), 2));
		ctxt.fillStyle = '#881111';
		this.fillEllipse(ctxt, this.x + this.h / 2, this.y + this.h * (1-prctHP), cosHP * this.h, this.h / 7);

		ctxt.beginPath();
		ctxt.arc(this.x + this.h / 2, this.y + this.h / 2, this.h / 2, 0,  2 * Math.PI, false);
		ctxt.stroke();
		ctxt.closePath();

		// MP
		const prctMP = Math.max(Math.min(this.character.mp / this.character.mpMax, 1), 0);

		const grdMP = ctxt.createRadialGradient(this.x + this.w - this.h / 2, this.y + this.h / 2, 0, this.x + this.w - this.h / 2, this.y + this.h / 2, this.h / 2);
		grdMP.addColorStop(0, '#00C9FF');
	    grdMP.addColorStop(0.8, '#0033E2');
	    grdMP.addColorStop(1, '#000055');

		ctxt.fillStyle = grdMP;
		ctxt.strokeStyle = '#000055';

		this.drawPartialCircle(ctxt, this.x + this.w - this.h / 2, this.y + this.h / 2, this.h / 2, prctMP);
		const cosMP = Math.sqrt(1 - Math.pow(Math.asin(2 * prctMP - 1), 2));
		ctxt.fillStyle = '#003399';
		this.fillEllipse(ctxt, this.x + this.w - this.h / 2, this.y + this.h * (1-prctMP), cosMP * this.h, this.h / 7);

		ctxt.beginPath();
		ctxt.arc(this.x + this.w - this.h / 2, this.y + this.h / 2, this.h / 2, 0,  2 * Math.PI, false);
		ctxt.stroke();
		ctxt.closePath();

		ctxt.restore();
	}

	drawPartialCircle(ctxt: CanvasRenderingContext2D, x: number, y: number, r: number, percentage: number) {
		const tArc = Math.asin(2 * percentage - 1);
		ctxt.beginPath();
		if (percentage === 1) {
			ctxt.arc(x, y, r, 0,  2 * Math.PI, false);
		} else if (percentage === 0) {
			ctxt.arc(x, y, r, -Math.PI/2, -Math.PI/2, false);
		} else {
			ctxt.arc(x, y, r, -tArc, -Math.PI + tArc, false);
		}
		ctxt.closePath();
		ctxt.fill();
	}

	fillEllipse(ctxt: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
		this.drawEllipse(ctxt, x, y, w, h, 'fill');
	}

	drawEllipse (ctxt: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, func: 'fill') {
		const kappa = .5522848;
		const origX = x - w / 2;
		const origY = y - h / 2;
		const ox = (w / 2) * kappa;  // control point offset horizontal
		const oy = (h / 2) * kappa;  // control point offset vertical
		const xe = origX + w;            // x-end
		const ye = origY + h;           // y-end

		ctxt.beginPath();
		ctxt.moveTo(origX, y);
		ctxt.bezierCurveTo(origX, y - oy, x - ox, origY, x, origY);
		ctxt.bezierCurveTo(x + ox, origY, xe, y - oy, xe, y);
		ctxt.bezierCurveTo(xe, y + oy, x + ox, ye, x, ye);
		ctxt.bezierCurveTo(x - ox, ye, origX, y + oy, origX, y);
		ctxt.closePath();
		ctxt[func]();
	}
}
import { Game } from './game';
import { Keyboard } from "./keyboard";

window.__debug = false;
window.__debugDrawingColor1 = "#EEE";
window.__debugDrawingColor2 = "#F00";

const canvas = document.getElementById('canvas');
const keyboard = new Keyboard(window);

new Game({canvas: canvas, keyboard: keyboard});
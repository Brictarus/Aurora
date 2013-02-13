window.__debug = false;
window.__debugDrawingColor1 = "#EEE";
window.__debugDrawingColor2 = "#F00";
var canvas = document.getElementById('canvas');
var keyboard = new Keyboard(window);
var game = new Game({ canvas : canvas, keyboard : keyboard });
console.log(game);
game.start();
var __debug = false;
var __debugDrawingColor1 = "#EEE";
var __debugDrawingColor2 = "#F00";

window.addEventListener('load', start, false);


var clavier = {
    // Flèche haut, z, w, Z, W
    38 : 0,
    119 : 0,
    90 : 0,
    87 : 0,
    // Flèche bas, s, S
    40 : 0,
    115 : 0,
    83 : 0,
    // Flèche gauche, q, a, Q, A
    37 : 0,
    113 : 0,
    97 : 0,
    81 : 0,
    65 : 0,
    // Flèche droite, d, D
    39 : 0,
    100 : 0,
    68 : 0
};

function start() {

	var map = new Map("premiere");
	var joueur = new Personnage("player.png", 7, 7, DIRECTION.BAS);
	var camera = new Camera(300, 300, 0, 0, map.getHauteur() * 32, map.getLargeur() * 32);
	camera.setDeadZoneSize(100, 100);
	camera.followObject(joueur);
	var desiredFPS = 25;
	map.addPersonnage(joueur);
    var _keyboard = new Array();
	var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var lastUpdate = new Date().getTime();
    var fpsOut = document.getElementById('framerate');
    var windowSize = camera.getWindowSize();
    canvas.width = windowSize.width;
    canvas.height = windowSize.height;

    var keyDownFn = function (event) {
        var e = event || window.event;
        var key = e.which || e.keyCode;
        if (clavier[key] != 1) {
            clavier[key] = 1;
            console.log("key " + key + " pressed");
        }
    }

    var keyUpFn = function (event) {
        var e = event || window.event;
        var key = e.which || e.keyCode;
        clavier[key] = 0;
        console.log("key " + key + " released");
    }

    var gameloop = function () {
        function upPressed() { return (clavier[38] == 1 || clavier[119] == 1 || clavier[90] == 1 || clavier[87] == 1); }
        function downPressed() { return (clavier[40] == 1 || clavier[115] == 1 || clavier[83] == 1); }
        function leftPressed() { return (clavier[37] == 1 || clavier[113] == 1 || clavier[97] == 1 || clavier[81] == 1 || clavier[65] == 1); }
        function rightPressed() {
            return (clavier[39] == 1 || clavier[100] == 1 || clavier[68] == 1);
        }

        if (upPressed()) {
            joueur.deplacer(DIRECTION.HAUT, map);
        }
        else if (downPressed()) {
            joueur.deplacer(DIRECTION.BAS, map);
        }
        else if (leftPressed()) {
            joueur.deplacer(DIRECTION.GAUCHE, map);
        }
        else if (rightPressed()) {
            joueur.deplacer(DIRECTION.DROITE, map);
        }
    }

    setInterval(function () {
        now = new Date().getTime();
        var delta = now - lastUpdate;
        var fps = 1000 / delta;
        lastUpdate = now;
        gameloop();
        var playerPos = joueur.getBarycenterPosition();
        camera.updateCameraPosition();
        map.dessinerMap(ctx, camera);
    }, Math.round(1000 / desiredFPS));


    function loadGameState() {
        console.log("Process loading...");
        if (localStorage && JSON) {
            var itemString = localStorage.getItem("rpg-game-state");
            if (!itemString) {
                alert("Pas de sauvegarde disponible");
            }
            else {
                var item = JSON.parse(itemString);
                joueur.x = item.x;
                joueur.y = item.y;
                joueur.direction = item.direction;
                console.log("Loading complete");
            }
        } else {
            alert("Impossible d'utiliser les fonctions d'enregistrement avec ce navigateur");
        }
    }

    function saveGameState() {
        console.log("Process saving...");
        if (localStorage && JSON) {
            var state = { x: joueur.x, y: joueur.y, direction: joueur.direction };
            var item = localStorage.setItem("rpg-game-state", JSON.stringify(state));
            console.log("Saving complete");
        } else {
            alert("Impossible d'utiliser les fonctions d'enregistrement avec ce navigateur");
        }
    }

    window.addEventListener('keydown', keyDownFn, false);
    window.addEventListener('keyup', keyUpFn, false);

    document.getElementById("loadGameButton").addEventListener("click", loadGameState, false);
    document.getElementById("saveGameButton").addEventListener("click", saveGameState, false);
}

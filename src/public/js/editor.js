//(function () {
    
    function onSubmit(event) {
        event.preventDefault();
        var x = document.forms["form_taille_map"]["nb_tiles_largeur"].value;
        var y = document.forms["form_taille_map"]["nb_tiles_hauteur"].value;
        console.log("x * y : " + x * y);
        buildEmptyMap(x, y);
    }

    function buildEmptyMap(x, y) {
        console.log("test");
        var newTbody = document.createElement("tbody");
        for (var i = 0; i < x; i++) {
            var newTr = document.createElement("tr");
            for (var j = 0; j < y; j++) {
                var newTd = document.createElement("td");
                newTr.appendChild(newTd);
            }
            newTbody.appendChild(newTr);
        }
        document.getElementById("map_layer").appendChild(newTbody);
    }

    var form = document.forms["form_taille_map"].addEventListener("submit", onSubmit, false);

    
//})();
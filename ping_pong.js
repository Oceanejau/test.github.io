/* --recuperer le contexte 2D pour les animations */
var canvas = document.getElementById("pongCanvas");
var ctx = canvas.getContext("2d");
/* recuperer le contexte 2D pour les animations-- */

ctx.beginPath();
ctx.rect(20, 40, 50, 50);
ctx.fillStyle = "#FF0000";
ctx.fill();
ctx.closePath();


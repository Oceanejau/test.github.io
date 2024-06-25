/* --recuperer le contexte 2D pour les animations */
const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");
/* tentative de cadre responsive ici 90% de la fenetre*/
//canvas.width = window.innerWidth * 0.9;
//canvas.height = window.innerHeight * 0.9;
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth * 0.9;
    canvas.height = window.innerHeight * 0.9;
    // Réinitialiser les positions des éléments du jeu en fonction des nouvelles dimensions
    // Assurez-vous de recalculer les positions des raquettes et de la balle ici si nécessaire
});
/* raquettes */
let paddleWidth = 10;
let paddleHeight = 100;
let paddleSpeed = 5;
let leftPaddleY = canvas.height / 2 - paddleHeight / 2;
let rightPaddleY = canvas.height / 2 - paddleHeight / 2;

/* balle */
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSize = 10;
let ballSpeedX = 5;
let ballSpeedY = 5;

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);/*clear de la fenetre*/
/* dessine les raquettes ici*/
	ctx.fillStyle = 'white';
	ctx.fillRect(0, leftPaddleY, paddleWidth, paddleHeight);
	ctx.fillRect(canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);
/* fin dessin raquettes */

/*dessin balle */
	ctx.beginPath();
	ctx.arc(ballX, ballY, ballSize, 0, Math.PI * 2);
	ctx.fillStyle = 'white';
	ctx.fill();
	ctx.closePath();
	/* pos de la balle modifiée ici */
	ballX += ballSpeedX;
    ballY += ballSpeedY;
/* fin dessin balle */


/* ____________________________COLLISIONS__________________________ */
	if (ballY + ballSize > canvas.height || ballY - ballSize < 0)/* murs */
		ballSpeedY = -ballSpeedY;
/* collision raquettes */
	if (ballX - ballSize < paddleWidth && ballY > leftPaddleY && ballY < leftPaddleY + paddleHeight) {
		ballSpeedX = -ballSpeedX;
	}
	if (ballX + ballSize > canvas.width - paddleWidth && ballY > rightPaddleY && ballY < rightPaddleY + paddleHeight) {
		ballSpeedX = -ballSpeedX;
	}
	/* _____fin de collision_____ */
	requestAnimationFrame(draw);
}

// Gestion des événements pour les raquettes
document.addEventListener('keydown', (event) => {
    switch(event.key) {
        case 'ArrowUp':
            rightPaddleY -= paddleSpeed;
            break;
        case 'ArrowDown':
            rightPaddleY += paddleSpeed;
            break;
        case 'w':
            leftPaddleY -= paddleSpeed;
            break;
        case 's':
            leftPaddleY += paddleSpeed;
            break;
    }
});

// Lancer le jeu
draw();
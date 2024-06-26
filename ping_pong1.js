/* --recuperer le contexte 2D pour les animations */
const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");
const dimensionsCadre = document.getElementById('dimensionsCadre');
/* tentative de cadre responsive ici 90% de large pour 60% de haut de la fenetre*/

const RATIO = 2.74 / 1.525;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth * 0.9;
    canvas.height = window.innerHeight * 0.6;
    leftPaddleY = canvas.height / 2 - paddleHeight / 2;
    rightPaddleY = canvas.height / 2 - paddleHeight / 2;
});

function ajusterTailleCanvas() {
    const windowRatio = window.innerWidth / window.innerHeight;
    let canvasWidth, canvasHeight;

    if (windowRatio > RATIO) {
        // Si la fenêtre est plus large que le ratio de la table
        canvasHeight = window.innerHeight * 0.9;
        canvasWidth = canvasHeight * RATIO;
    } else {
        // Si la fenêtre est plus haute que le ratio de la table
        canvasWidth = window.innerWidth * 0.9;
        canvasHeight = canvasWidth / RATIO;
    }

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    afficherDimensionsCadre();

    // Réinitialiser les positions des éléments du jeu en fonction des nouvelles dimensions
    leftPaddleY = canvas.height / 2 - paddleHeight / 2;
    rightPaddleY = canvas.height / 2 - paddleHeight / 2;
    resetBall(); // Réinitialiser la position de la balle au centre
}

/*function ajusterTailleCanvas() {
    canvas.width = window.innerWidth * 0.9;
    canvas.height = window.innerHeight * 0.6;
    //afficherDimensionsCadre();
    leftPaddleY = canvas.height / 2 - paddleHeight / 2;
    rightPaddleY = canvas.height / 2 - paddleHeight / 2;
    resetBall();
}*/

function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = ballDirection * 5; // Utiliser la direction actuelle
    ballSpeedY = (Math.random() > 0.5 ? 1 : -1) * 5; // Changer la direction verticalement aléatoirement
}

function resetGame()
{
    resetBall();
    leftPaddleY = canvas.height / 2 - paddleHeight / 2;
    rightPaddleY = canvas.height / 2 - paddleHeight / 2;
}

// Fonction pour afficher les dimensions du cadre
/* afficherDimensionsCadre() {
    const largeurCadre = canvas.width;
    const hauteurCadre = canvas.height;
    dimensionsCadre.textContent = `Dimensions du cadre : ${largeurCadre} x ${hauteurCadre}`;
}*/

/* raquettes */
let paddleSpeed = 20;  // Augmentation de la vitesse pour une meilleure réactivité
let leftPaddleY = canvas.height / 2 - paddleHeight / 2;
let rightPaddleY = canvas.height / 2 - paddleHeight / 2;
/* balle */
let ballSpeedX = 5;
let ballSpeedY = 5;
let ballX, ballY;
let ballDirection = 1; // 1 pour aller vers la droite, -1 pour aller vers la gauche

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
 
	if (ballX + ballSize < 0) { // sortie gauche
        ballDirection = 1; // start a droite
        resetGame();
    }
    if (ballX - ballSize > canvas.width) { // sortie droite
        ballDirection = -1; // start a gauche
        resetGame();
    }
	/* _____fin de collision_____ */
	requestAnimationFrame(draw);
}

// Gestion des événements pour les raquettes
document.addEventListener('keydown', (event) => {
    switch(event.key) {
        case 'ArrowUp':
            if (rightPaddleY - paddleSpeed >= 0) {
                rightPaddleY -= paddleSpeed;
            }
            break;
        case 'ArrowDown':
            if (rightPaddleY + paddleSpeed + paddleHeight <= canvas.height) {
                rightPaddleY += paddleSpeed;
            }
            break;
        case 'z':
            if (leftPaddleY - paddleSpeed >= 0) {
                leftPaddleY -= paddleSpeed;
            }
            break;
        case 's':
            if (leftPaddleY + paddleSpeed + paddleHeight <= canvas.height) {
                leftPaddleY += paddleSpeed;
            }
            break;
    }
});

// Redimensionner le canvas lorsque la fenêtre est redimensionnée
window.addEventListener('resize', ajusterTailleCanvas);

// Ajuster la taille du canvas dès le chargement initial
ajusterTailleCanvas();

resetBall();

draw();
// Récupérer le canvas et le contexte
const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");
const dimensionsCadre = document.getElementById('dimensionsCadre');

// Ratio de la table de ping-pong cf. federation nationale de ping-pong
const LONG = 2.74;
const LAR = 1.525;
const RATIO = LONG / LAR;
const LIGNES = 0.02;
const BALL = 0.04;
const PADDLE_LAR = 0.15;
const PADDLE_EP = 0.021;

// Vitesse et positions: raquettes et la balle
let paddleSpeed = 20;
let leftPaddleY, rightPaddleY;
let leftPaddleX, rightPaddleX;

let ballSpeedX = 5;
let ballSpeedY = 5;
let ballX, ballY;
let ballDirection = 1; // 1 pour aller vers la droite, -1 pour aller vers la gauche

//scores
//let score_d = 0
//let score_g = 0;

// Fonction pour ajuster la taille du canvas
function ajusterTailleCanvas() {
    
    const headerElement = document.querySelector('header');
    const headerHeight = headerElement ? headerElement.offsetHeight : 0;
    const footerElement = document.querySelector('footer');
    const footerHeight = footerElement ? footerElement.offsetHeight : 0;
    const availableHeight = window.innerHeight - headerHeight - footerHeight;
    const availableWidth = window.innerWidth;
    const windowRatio = window.innerWidth / window.innerHeight;
    let canvasWidth, canvasHeight;

    if (windowRatio < RATIO) {
        canvasHeight = ((LAR * window.innerWidth)/ LONG) * 0.9;
        canvasWidth = ((LONG * canvasHeight)/ LAR) * 0.9;
    } else {
        canvasWidth = ((LONG * window.innerHeight)/ LAR) * 0.9;
        canvasHeight = ((LAR * canvasWidth)/ LONG) * 0.9;
    }
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    //afficherDimensionsCadre();
// Réinitialiser les positions des éléments du jeu en fonction des nouvelles dimensions
    leftPaddleY = canvas.height / 2 - ((PADDLE_LAR * canvas.height) / LAR) / 2;
    rightPaddleY = canvas.height / 2 - ((PADDLE_LAR * canvas.height) / LAR) / 2;
// Réinitialiser la pos de la balle au centre
	resetBall(); 
}

function afficherDimensionsCadre() {
    const largeurCadre = canvas.width;
    const hauteurCadre = canvas.height;
    console.log("Début de l'exécution du script...");
    dimensionsCadre.textContent = `Dimensions du cadre : ${largeurCadre.toFixed(0)} x ${hauteurCadre.toFixed(0)}`;
    const headerElement = document.querySelector('header');
    if (!headerElement)
        console.log("Avertissement : Aucun élément <header> trouvé dans le document.");
    const footerElement = document.querySelector('footer');
    if (!footerElement) 
        console.log("Avertissement : Aucun élément <footer> trouvé dans le document.");
    const headerHeight = headerElement ? headerElement.offsetHeight : 0;
    const footerHeight = footerElement ? footerElement.offsetHeight : 0;
    const availableHeight = window.innerHeight - headerHeight - footerHeight;
    console.log(`Hauteur totale : ${window.innerHeight}px`);
    console.log(`Hauteur de l'en-tête : ${headerHeight}px`);
    console.log(`Hauteur du pied de page : ${footerHeight}px`);
    console.log(`Hauteur disponible pour le canvas : ${availableHeight}px`);
}

function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = ballDirection * 5; // Utiliser la direction actuelle
    ballSpeedY = (Math.random() > 0.5 ? 1 : -1) * 5; // Changer la direction verticalement aléatoirement
}

function resetGame() {
    resetBall();
    leftPaddleY = canvas.height / 2 - ((PADDLE_LAR * canvas.height) / LAR) / 2;
    rightPaddleY = canvas.height / 2 - ((PADDLE_LAR * canvas.height) / LAR) / 2;
}

function draw() {
// Effacer le canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
//typo de la fonction : void ctx.fillRect(x, y, largeur, hauteur);

//bordure
    ctx.fillStyle = 'grey';
    ctx.fillRect(0, 0, canvas.width, (LIGNES * canvas.width) / LONG);//bordure haut
    ctx.fillRect(0, 0, (LIGNES * canvas.height) / LAR, canvas.height);//bordure gauche
    ctx.fillRect(0, canvas.height - (LIGNES * canvas.width) / LONG, canvas.width, (LIGNES * canvas.width) / LONG);//bordure bas
    ctx.fillRect(canvas.width - (LIGNES * canvas.height) / LAR, 0, (LIGNES * canvas.height) / LAR, canvas.height);//bordure droite
//filet
    ctx.fillRect((canvas.width / 2) - (((LIGNES * canvas.height) / LAR) / 2), 0, (LIGNES * canvas.height) / LAR, canvas.height);//filet
/*//multijoueur : lignes
	//if (multiplayer)
    //    ctx.fillRect(0, canvas.height / 2, canvas.width, (LIGNES * canvas.width) / LONG);//ligne au centre
//multijoueur: raquettes 
	ctx.fillStyle = 'red';//player de gauche
	ctx.fillRect(0, leftPaddleX, (PADDLE_EP * canvas.height) / LAR, (PADDLE_LAR * canvas.height) / LAR);
	ctx.fillStyle = 'blue';//player de droite
	ctx.fillRect(canvas.width - ((PADDLE_EP * canvas.height) / LAR), rightPaddleX, (PADDLE_EP * canvas.height) / LAR, (PADDLE_LAR * canvas.height) / LAR);
*/

//raquettes
	ctx.fillStyle = 'red';//player de gauche
	ctx.fillRect(0, leftPaddleY, (PADDLE_EP * canvas.height) / LAR, (PADDLE_LAR * canvas.height) / LAR);
	ctx.fillStyle = 'blue';//player de droite
	ctx.fillRect(canvas.width - ((PADDLE_EP * canvas.height) / LAR), rightPaddleY, (PADDLE_EP * canvas.height) / LAR, (PADDLE_LAR * canvas.height) / LAR);

//balle
	ctx.beginPath();
	ctx.arc(ballX, ballY, ((BALL * canvas.height) / LAR), 0, Math.PI * 2);
	ctx.fillStyle = 'white';
	ctx.fill();
	ctx.closePath();
//position de la balle
    ballX += ballSpeedX;
    ballY += ballSpeedY;

// collisions bords horizontaux
    if (ballY + ((BALL * canvas.height) / LAR) > canvas.height || ballY - ((BALL * canvas.height) / LAR) < 0)
        ballSpeedY = -ballSpeedY;
// collisions raquettes
    if (ballX - ((BALL * canvas.height) / LAR) < ((PADDLE_EP * canvas.height) / LAR) && ballY > leftPaddleY && ballY < leftPaddleY + ((PADDLE_LAR * canvas.height) / LAR))
        ballSpeedX = -ballSpeedX;
    if (ballX + ((BALL * canvas.height) / LAR) > canvas.width - ((PADDLE_EP * canvas.height) / LAR) && ballY > rightPaddleY && ballY < rightPaddleY + ((PADDLE_LAR * canvas.height) / LAR))
        ballSpeedX = -ballSpeedX;

// Réinitialiser le jeu si la balle sort du cadre
    if (ballX + ((BALL * canvas.height) / LAR) < 0) { // Si la balle sort par la gauche: le joueur de droite gagne le point
        ballDirection = 1; // Faire aller la balle vers la droite au redémarrage
		//((score_d + score_g) % 2 ) < 1 ? -1
       // let score_d += 1;//score + 1 au player de droite
        resetGame();
    }
    if (ballX - ((BALL * canvas.height) / LAR) > canvas.width) { // Si la balle sort par la droite: le joueur de gauche gagne le point
        ballDirection = -1; // Faire aller la balle vers la gauche au redémarrage
       // let score_g += 1;//score + 1 au player de gauche
        resetGame();
    }
    requestAnimationFrame(draw);
}

// Gestion des événements pour les raquettes
document.addEventListener('keydown', (event) => {
    switch(event.key) {
        case 'ArrowUp':
            if (rightPaddleY - paddleSpeed >= 0)
                rightPaddleY -= paddleSpeed;
            break;
        case 'ArrowDown':
            if (rightPaddleY + paddleSpeed + ((PADDLE_LAR * canvas.height) / LAR) <= canvas.height)
                rightPaddleY += paddleSpeed;
            break;
        case 'z':
            if (leftPaddleY - paddleSpeed >= 0)
                leftPaddleY -= paddleSpeed;
            break;
        case 's':
            if (leftPaddleY + paddleSpeed + ((PADDLE_LAR * canvas.height) / LAR) <= canvas.height)
                leftPaddleY += paddleSpeed;
            break;
		/*case 'ArrowUp':
            if (rightPaddleX - paddleSpeed >= 0)
                rightPaddleX -= paddleSpeed;
            break;
        case 'ArrowDown':
            if (rightPaddleX + paddleSpeed + ((PADDLE_LAR * canvas.height) / LAR) <= canvas.height)
                rightPaddleX += paddleSpeed;
            break;
        case 'z':
            if (leftPaddleX - paddleSpeed >= 0)
                leftPaddleX -= paddleSpeed;
            break;
        case 's':
            if (leftPaddleX + paddleSpeed + ((PADDLE_LAR * canvas.height) / LAR) <= canvas.height)
                leftPaddleX += paddleSpeed;
            break;*/
    }
});

// Redimensionner le canvas lorsque la fenêtre est redimensionnée
window.addEventListener('resize', ajusterTailleCanvas);

// Ajuster la taille du canvas dès le chargement initial
ajusterTailleCanvas();
resetBall();
draw();

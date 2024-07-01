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

let speed = 3;
let ballSpeedX = 5;
let ballSpeedY = 5;
let ballX, ballY;
let ballDirection = 1; // 1 pour aller vers la droite, -1 pour aller vers la gauche

let isPaused = true;
let pointsCounter = 0;

let multiplayer = 4 ;

//scores
let score_d = 0
let score_g = 0;
let score_max = 11;

//////////////////////////////////

// Variables pour suivre le glissement
let isDragging = false;
let dragStartX, dragStartY;

let draggingLeftPaddle = false;
let draggingRightPaddle = false;
let draggingLeftPaddleX = false;
let draggingRightPaddleX = false;
////////////////////////////////////////


// Noms des joueurs
const playerLeft_1 = "playerLeft_1";
const playerRight_1 = "playerRight_1";
const playerLeft_2 = "playerLeft_2";
const playerRight_2 = "playerRight_2";

// Charger la police PingPong
const font = new FontFace('PingPong', 'url(fonts/PingPong/PingPong.otf)');
font.load().then(function(loadedFont) {
    document.fonts.add(loadedFont);
    draw();
});

// Fonction pour ajuster la taille du canvas
function ajusterTailleCanvas()
{    
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
	if (multiplayer == 2)
	{
		leftPaddleY = canvas.height / 2 - ((PADDLE_LAR * canvas.height) / LAR) / 2;
    	rightPaddleY = canvas.height / 2 - ((PADDLE_LAR * canvas.height) / LAR) / 2;
	}
	else if (multiplayer == 3)
	{
		leftPaddleY = canvas.height / 4 - ((PADDLE_LAR * canvas.height) / LAR) / 4;
    	rightPaddleY = canvas.height / 2 - ((PADDLE_LAR * canvas.height) / LAR) / 2;
		leftPaddleX = (canvas.height / 4 - ((PADDLE_LAR * canvas.height) / LAR) / 4) * 3;//*3 pour position mileu bas
	}
	else if (multiplayer == 4)
	{
		leftPaddleY = canvas.height / 4 - ((PADDLE_LAR * canvas.height) / LAR) / 4;
    	rightPaddleY = canvas.height / 4 - ((PADDLE_LAR * canvas.height) / LAR) / 4;
		leftPaddleX = (canvas.height / 4 - ((PADDLE_LAR * canvas.height) / LAR) / 4) * 3;//* 3 pour position milieu bas
    	rightPaddleX = (canvas.height / 4 - ((PADDLE_LAR * canvas.height) / LAR) / 4) * 3;// * 3 pour position milieu
	}
	
    let fontSize = canvasHeight * 0.05; // Par exemple, 5% de la hauteur du canvas
    fontSize = Math.min(fontSize, 40); // Limiter la taille maximale à 30px
    ctx.font = `${fontSize}px PingPong`;
// Réinitialiser la pos de la balle au centre
	resetBall(); 
    //isPaused = true;
}

function afficherDimensionsCadre()
{
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

function resetBall()
{
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = ballDirection * speed; // Utiliser la direction actuelle
    ballSpeedY = (Math.random() > 0.5 ? 1 : -1) * speed; // Changer la direction verticalement aléatoirement
}

function resetGame()
{
    resetBall();
    if (multiplayer == 3)
    {
        leftPaddleY = canvas.height / 2 - ((PADDLE_LAR * canvas.height) / LAR) / 2;
        rightPaddleY = canvas.height / 2 - ((PADDLE_LAR * canvas.height) / LAR) / 2;
    }
    else if (multiplayer == 3)
    {
        leftPaddleY = canvas.height / 4 - ((PADDLE_LAR * canvas.height) / LAR) / 4;
        rightPaddleY = canvas.height / 2 - ((PADDLE_LAR * canvas.height) / LAR) / 2;
        leftPaddleY = (canvas.height / 4 - ((PADDLE_LAR * canvas.height) / LAR) / 4) * 3;
    }
    else if (multiplayer == 4)
    {
        leftPaddleY = canvas.height / 4 - ((PADDLE_LAR * canvas.height) / LAR) / 4;
        rightPaddleY = canvas.height / 4 - ((PADDLE_LAR * canvas.height) / LAR) / 4;
        leftPaddleX = (canvas.height / 4 - ((PADDLE_LAR * canvas.height) / LAR) / 4) * 3;
        rightPaddleX = (canvas.height / 4 - ((PADDLE_LAR * canvas.height) / LAR) / 4) * 3;
    }
}

function resetNewGame()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    score_d = 0;
    score_g = 0;
    isPaused = true;
    pointsCounter = 0;
    speed = 3;
    ballSpeedX = 5;
    ballSpeedY = 5;
    resetBall();
    resetGame();
    draw();
}

function endGame()
{
    isPaused = true;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (score_d == score_max)
    {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = "40px PingPong";
        ctx.textAlign = 'center';
        if (multiplayer <= 2)
            gagnant = playerRight_1;
        else
            gagnant = playerRight_1 + " & " + playerRight_2;
        ctx.fillText(`Le ${gagnant} a gagné!`, canvas.width / 2, canvas.height / 2 - 20);
        ctx.fillText('Cliquez pour rejouer', canvas.width / 2, canvas.height / 2 + 20);
        requestAnimationFrame(draw);

        // Ajouter un écouteur pour le clic pour rejouer
        console.log("joueur de droite gagne");
        canvas.addEventListener('click', resetNewGame, { once: true });

    }
    else if (score_g == score_max)
    {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = "40px PingPong";
        ctx.textAlign = 'center';
        if (multiplayer <= 2)
            gagnant = playerLeft_1;
        else
            gagnant = playerLeft_1 + " & " + playerLeft_2;
        ctx.fillText(`Le ${gagnant} a gagné!`, canvas.width / 2, canvas.height / 2 - 20);
        ctx.fillText('Cliquez pour rejouer', canvas.width / 2, canvas.height / 2 + 20);
        requestAnimationFrame(draw);
        // Ajouter un écouteur pour le clic pour rejouer
        console.log("joueur de droite gagne");
        canvas.addEventListener('click', resetNewGame, { once: true });

    }
    else
    {
        //gave up
    }
}

function draw()
{
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
//multijoueur : lignes
	if (multiplayer > 2)
        ctx.fillRect(0, canvas.height / 2, canvas.width, (LIGNES * canvas.width) / LONG);//ligne au centre

	//raquettes et multijoueur: raquettes 
	if (multiplayer == 2)
	{
		ctx.fillStyle = 'red';//player de gauche
		ctx.fillRect(0, leftPaddleY, (PADDLE_EP * canvas.height) / LAR, (PADDLE_LAR * canvas.height) / LAR);
		ctx.fillStyle = 'blue';//player de droite
		ctx.fillRect(canvas.width - ((PADDLE_EP * canvas.height) / LAR), rightPaddleY, (PADDLE_EP * canvas.height) / LAR, (PADDLE_LAR * canvas.height) / LAR);
	}
	else if (multiplayer == 3)
	{
		ctx.fillStyle = 'red';//player1 de gauche
		ctx.fillRect(0, leftPaddleY, (PADDLE_EP * canvas.height) / LAR, (PADDLE_LAR * canvas.height) / LAR);
		ctx.fillStyle = 'blue';//player1 de droite
		ctx.fillRect(canvas.width - ((PADDLE_EP * canvas.height) / LAR), rightPaddleY, (PADDLE_EP * canvas.height) / LAR, (PADDLE_LAR * canvas.height) / LAR);
	
		ctx.fillStyle = 'yellow';//player2 de gauche
		ctx.fillRect(0, leftPaddleX, (PADDLE_EP * canvas.height) / LAR, (PADDLE_LAR * canvas.height) / LAR);
	}
	else if (multiplayer == 4)
	{
		ctx.fillStyle = 'red';//player1 de gauche
		ctx.fillRect(0, leftPaddleY, (PADDLE_EP * canvas.height) / LAR, (PADDLE_LAR * canvas.height) / LAR);
		ctx.fillStyle = 'blue';//player1 de droite
		ctx.fillRect(canvas.width - ((PADDLE_EP * canvas.height) / LAR), rightPaddleY, (PADDLE_EP * canvas.height) / LAR, (PADDLE_LAR * canvas.height) / LAR);
	
		ctx.fillStyle = 'yellow';//player2 de gauche
		ctx.fillRect(0, leftPaddleX, (PADDLE_EP * canvas.height) / LAR, (PADDLE_LAR * canvas.height) / LAR);
		ctx.fillStyle = 'green';//player2 de droite
		ctx.fillRect(canvas.width - ((PADDLE_EP * canvas.height) / LAR), rightPaddleX, (PADDLE_EP * canvas.height) / LAR, (PADDLE_LAR * canvas.height) / LAR);
	}

//balle
	ctx.beginPath();
	ctx.arc(ballX, ballY, ((BALL * canvas.height) / LAR), 0, Math.PI * 2);
	ctx.fillStyle = 'white';
	ctx.fill();
	ctx.closePath();

// Affichage des scores
    ctx.fillStyle = 'white';
   // ctx.font = "30px PingPong";
    ctx.fillText(score_g, canvas.width / 4, canvas.height / 8);
    ctx.fillText(score_d, (3 * canvas.width) / 4, canvas.height / 8);
    //ctx.fillText(playerLeft, canvas.width / 4 - 50, canvas.height / 5 + 30);
    //ctx.fillText(playerRight, (3 * canvas.width) / 4 - 50, canvas.height / 5 + 30);
    //position de la balle
    if (!isPaused)
    {
        ballX += ballSpeedX;
        ballY += ballSpeedY;
    }
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
       score_d += 1;//score + 1 au player de droite
       pointsCounter += 1; // Incrémenter le compteur de points
       if (pointsCounter % 2 == 0)
           ballDirection = ballDirection * (-1); // Faire aller la balle vers la droite tous les deux points
       if (score_d == score_max)
        endGame();
       resetGame();
    }
    if (ballX - ((BALL * canvas.height) / LAR) > canvas.width) { // Si la balle sort par la droite: le joueur de gauche gagne le point
        score_g += 1;//score + 1 au player de droite
		pointsCounter += 1; // Incrémenter le compteur de points
        if (pointsCounter % 2 == 0)
			ballDirection = ballDirection * (-1); // Faire aller la balle vers la droite tous les deux points
        if (score_g == score_max)
            endGame();
        resetGame();
    }
    requestAnimationFrame(draw);
}

// Gestion des événements pour les raquettes
document.addEventListener('keydown', (event) => {
    switch(event.key) {
        case 'ArrowUp':
            rightPaddleY = movePaddle(-paddleSpeed, rightPaddleY);
            break;
        case 'ArrowDown':
            rightPaddleY = movePaddle(paddleSpeed, rightPaddleY);
            break;
        case 'z':
            leftPaddleY = movePaddle(-paddleSpeed, leftPaddleY);
            break;
        case 's':
            leftPaddleY = movePaddle(paddleSpeed, leftPaddleY);
            break;
        case 't':
            if (multiplayer > 2)
                leftPaddleX = movePaddle(-paddleSpeed, leftPaddleX);
            break;
        case 'g':
            if (multiplayer > 2)
                leftPaddleX = movePaddle(paddleSpeed, leftPaddleX);
            break;
        case 'p':
            if (multiplayer == 4)
                rightPaddleX = movePaddle(-paddleSpeed, rightPaddleX);
            break;
        case 'm':
            if (multiplayer == 4)
                rightPaddleX = movePaddle(paddleSpeed, rightPaddleX);
            break;
    }
});

function movePaddle(deltaY, paddleY) {
    return Math.min(Math.max(paddleY + deltaY, 0), canvas.height - (PADDLE_LAR * canvas.height) / LAR);
}

/////////////////////////////////////////
// Gestion des événements de souris

function getClickedPaddle(x, y)
{
    const paddleWidth = (PADDLE_EP * canvas.height) / LAR;
    const paddleHeight = (PADDLE_LAR * canvas.height) / LAR;

    if (x >= 0 && x <= paddleWidth && y >= leftPaddleY && y <= leftPaddleY + paddleHeight)
    {
        console.log("left top");
        let isDragging = true;
        let draggingLeftPaddle = true;
        return 'left';
    }
    if (x >= canvas.width - paddleWidth && x <= canvas.width && y >= rightPaddleY && y <= rightPaddleY + paddleHeight)
    {
        console.log("right top");
        let isDragging = true;
        let draggingRightPaddle = true;
        return 'right';
    }
    if (multiplayer > 2)
    {
        if (x >= 0 && x <= paddleWidth && y >= leftPaddleX && y <= leftPaddleX + paddleHeight)
        {
            console.log("left bot");
            let isDragging = true;
            let draggingLeftPaddleX = true;
            return 'leftExtra';
        }
        if (x >= canvas.width - paddleWidth && x <= canvas.width && y >= rightPaddleX && y <= rightPaddleX + paddleHeight) 
        {
            console.log("right bot");
            let isDragging = true;
            let draggingRightPaddleX = true;
            return 'rightExtra';
        }
    }
    console.log("random clic");
    return null;
}

function movePaddle(deltaY, paddleY) {
    return Math.min(Math.max(paddleY + deltaY, 0), canvas.height - (PADDLE_LAR * canvas.height) / LAR);
}
/*
deltaY : vertical + = down & - = up.
paddleY : pos verticale
 */

canvas.addEventListener('mousedown', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    let dragStartY = y;

    const clickedPaddle = getClickedPaddle(x, y);

    if (clickedPaddle)
    {
        canvas.addEventListener('mousemove', moveHandler);
        canvas.addEventListener('mouseup', () => {
            canvas.removeEventListener('mousemove', moveHandler);
        });
        function moveHandler(e) {
            const newY = e.clientY - rect.top;
            const deltaY = newY - dragStartY;
            dragStartY = newY; // Mettre à jour dragStartY pour le prochain déplacement

            switch (clickedPaddle) {
                case 'left':
                    leftPaddleY = movePaddle(deltaY, leftPaddleY);
                    break;
                case 'right':
                    rightPaddleY = movePaddle(deltaY, rightPaddleY);
                    break;
                case 'leftExtra':
                    leftPaddleX = movePaddle(deltaY, leftPaddleX);
                    break;
                case 'rightExtra':
                    rightPaddleX = movePaddle(deltaY, rightPaddleX);
                    break;
            }
        }        
    }
});


function isTouchingPaddle(x, y, paddleX, paddleY, paddleWidth, paddleHeight)
{
    return x >= paddleX && x <= paddleX + paddleWidth && y >= paddleY && y <= paddleY + paddleHeight;
}

////////////////////////////////


canvas.addEventListener('click', () => {
    isPaused = !isPaused;
});
window.addEventListener('resize', () => {
	isPaused = true;
    ajusterTailleCanvas();
});
ajusterTailleCanvas();
resetBall();
draw();

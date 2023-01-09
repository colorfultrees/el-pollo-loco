const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 600;
let canvas;
let world;


/**
 * Initiates the game
 */
async function init() {
    canvas = document.querySelector('canvas');
    canvas.setAttribute('width', CANVAS_WIDTH + 'px');
    canvas.setAttribute('height', CANVAS_HEIGHT + 'px');

    world = new World(canvas);
    
    createBackground();
    createCharacter();
    createEnemies(Chicken, 3);
    createEnemies(Chick, 2);
    // createChickens();
    // createChicks();

    renderWorld();

    // Start the timer for more clouds
    setInterval(() => {
        createClouds(canvas.width + 50);
    }, 180000);
}


/**
 * Creates the background
 */
function createBackground() {
    createSky();
    createClouds(0);
    createLandscape();    
}


/**
 * Creates the sky
 */
function createSky() {
    world.background.air = new Background(0, 0, './img/5_background/layers/air.png');
}


/**
 * Creates the clouds
 * @param {Number} startPos The position of the first cloud formation
 */
function createClouds(startPos) {
    for (let c = 0; c < 5; c++) {
        const posX = calcRandomNumber(-100, 300) + (500 * c) + startPos;
        const posY = calcRandomNumber(0, 50);
        world.background.clouds.push(new Cloud(posX, posY));
    }
}


/**
 * Creates the landscape
 */
function createLandscape() {
    world.background.landscapeLayer.push(new Background(0, 0, './img/5_background/layers/3_third_layer/full.png'));
    world.background.landscapeLayer.push(new Background(0, 0, './img/5_background/layers/2_second_layer/full.png'));
    world.background.landscapeLayer.push(new Background(0, 0, './img/5_background/layers/1_first_layer/full.png'));
}


/**
 * Creates the main character
 */
function createCharacter() {
    world.character = new Character(0, 0);
    world.character.positionY = world.canvas.height - world.character.height;
}


function createEnemies(EnemyClass, count) {
    for (let e = 1; e <= count; e++) {
        const obj = new EnemyClass(0, 0);
        obj.positionX = calcRandomNumber(230, canvas.width - 50);
        obj.positionY = canvas.height - obj.height;
        world.enemies.push(obj);
    }
}


/**
 * Creates the chickens
 */
// function createChickens() {
//     for (let e = 1; e <= 3; e++) {
//         const chicken = new Chicken(0, 0);
//         chicken.positionX = calcRandomNumber(150, canvas.width - 50);
//         chicken.positionY = canvas.height - chicken.height;
//         world.enemies.push(chicken);
//     }
// }


/**
 * Create the chicks
 */
// function createChicks() {
//     for (let e = 1; e <= 2; e++) {
//         const chick = new Chick(0, 0);
//         chick.positionX = calcRandomNumber(150, canvas.width - 50);
//         chick.positionY = canvas.height - chick.height;
//         world.enemies.push(chick);
//     }
// }


/**
 * Renders the gaming scene
 */
function renderWorld() {
    world.draw();
}
let canvas;
let world;
let keyboardListener;
let lastActiveTimestamp = Date.now();
let intervals = [];
let isGameRunning = false;
let isSoundOn = true;
let isMusicOn = true;
let isHelpVisible = false;
let hideControlsInfoDelayId = 0;
let isFullScreenMode = false;
let isTouchDevice = false;


/**
 * Initializing
 */
function init() {
    canvas = document.querySelector('canvas');
    keyboardListener = new Keyboard();
    checkForTouchDevice();
    setFullScreenHandlers();
}


/**
 * Starts the game
 */
function startGame() {
    createWorld();
    renderWorld();
    world.initBackgroundSound();
    activateCanvas();
    initCreationIntervals_Level1();
    isGameRunning = true;
}


/**
 * Creates a random integer within the given range
 * @param {Number} min - The lower limit
 * @param {Number} max - The upper limit
 * @returns Integer
 */
function calcRandomNumber (min, max) {
	return Math.round(Math.random() * (max - min)) + min;
}


/**
 * Checks if the app was loaded on a touch device
 */
function checkForTouchDevice() {
    try {
        document.createEvent('TouchEvent');
        isTouchDevice = true;
    }
    catch { /* no change necessary */ }
}


/**
 * Sets event listeners for monitoring fullscreen mode
 */
function setFullScreenHandlers() {
    document.addEventListener('fullscreenchange', exitFullscreenHandler);
    document.addEventListener('webkitfullscreenchange', exitFullscreenHandler);
    document.addEventListener('mozfullscreenchange', exitFullscreenHandler);
    document.addEventListener('MSFullscreenChange', exitFullscreenHandler);
}


/**
 * Handles exiting fullscreen
 */
function exitFullscreenHandler() {
    if (!document.fullscreenElement &&
        !document.webkitIsFullScreen &&
        !document.mozFullScreen &&
        !document.msFullscreenElement) {
            setParamOnExitFullscreen(false);
    }
}


/**
 * Sets an interval and stores it in an array
 * @param {Function} fn - The interval's callback function
 * @param {Number} time - The interval time in milliseconds
 */
function setStopableInterval(fn, time) {
    intervals.push(setInterval(fn, time));
}


/**
 * Creates the world object
 */
function createWorld() {
    world = new World(canvas);
    createLevel1();
    world.setLevel(level1);
    world.createCharacter();
    world.createStatusBars();
}


/**
 * Displays the game board
 */
function activateCanvas() {
    const startScreen = document.getElementById('startscreen');
    startScreen.classList.add('d-none');
    canvas.classList.remove('d-none');
    toggleBtnsMobile();
}


/**
 * Ends the game and deletes the world object
 */
function endGame() {
    setTimeout(() => {
        world.stopEnemiesAndClouds();
        toggleScreen('startscreen');
        toggleBtnsMobile();
        setTimeout(() => {world = [];}, 500);
    }, 8000);
}


/**
 * Controls the visibility of the control buttons for mobile devices
 */
function toggleBtnsMobile() {
    if (isTouchDevice) {
        const btnsMobile = document.getElementById('btns-mobile');
        btnsMobile.classList.toggle('d-none');
    }
}


/**
 * Toggles from the current screen to the requested screen
 * @param {String} screen - The ID of the screen to be displayed
 */
function toggleScreen(screen) {
    const screens = Array.from(document.querySelectorAll('#content > .screen:not([class=d-none])'));
    screens.forEach(s => s.classList.add('d-none'));
    document.getElementById(screen).classList.remove('d-none');
}


/**
 * Controls the endscreen
 * @param {String} img - The URL of the endscreen image
 */
function handleEndscreen(img) {
    endScreen = document.getElementById('endscreen');
    endScreen.style.backgroundImage = `url('${img}')`;
    endScreen.classList.remove('d-none');
}


/**
 * Toggles the help screen
 */
function toggleHelp() {
    resetActiveElement();

    if (isGameRunning) {
        toggleControlsInfo();
    }
    else {
        toggleHelpScreen();
    }
}


/**
 * Controls the visibility of the help screen when start screen is visible
 */
function toggleHelpScreen() {
    const btnHelp = document.querySelector('#btn-help > img');
    if (isHelpVisible) {
        toggleScreen('startscreen');
        isHelpVisible = false;
        btnHelp.src = './symbols/help_closed.png';
    }
    else {
        toggleScreen('helpscreen');
        isHelpVisible = true;
        btnHelp.src = './symbols/help_open.png';
    }
}


/**
 * Controls the visibility of the controls info badge during the game
 */
function toggleControlsInfo() {
    const ctrlInfo = document.getElementById('controls-info');
    if (isHelpVisible) {
        ctrlInfo.classList.add('d-none');
        setHelpScreenParams(false, './symbols/help_closed.png');
        clearTimeout(hideControlsInfoDelayId);
    }
    else {
        ctrlInfo.classList.remove('d-none');
        setHelpScreenParams(true, './symbols/help_open.png');
        hideControlsInfoDelayId = setTimeout(() => {toggleControlsInfo()}, 10000);
    }
}


/**
 * Sets the parameters for the control of the help screen
 * @param {Boolean} status - The visibility status of the help screen
 * @param {String} btnIcon - The URL of the button icon
 */
function setHelpScreenParams(status, btnIcon) {
    const btnHelp = document.querySelector('#btn-help > img');
    isHelpVisible = status;
    btnHelp.src = btnIcon;
}


/**
 * Toggles the background music
 */
function toggleMusic() {
    resetActiveElement();
    
    if (isMusicOn) {
        setMusicParams(false, './symbols/music_off.png');
        if (isGameRunning) world.stopSound(world.AUDIO.backgroundMusic);
    }
    else {
        setMusicParams(true, './symbols/music_on.png');
        if (isGameRunning) world.startBackgroundMusic();
    }
}


/**
 * Sets the parameters for the control of the background music
 * @param {Boolean} status - The status of the background music
 * @param {String} btnIcon - The URL of the button icon
 */
function setMusicParams(status, btnIcon) {
    const btnMusic = document.querySelector('#btn-music > img');
    isMusicOn = status;
    btnMusic.src = btnIcon;
}


/**
 * Toggles the sound effects
 */
function toggleSoundFx() {
    resetActiveElement();
    
    if (isSoundOn) {
        setSoundFxParams(false, './symbols/sound-fx_off.png');
    }
    else {
        setSoundFxParams(true, './symbols/sound-fx_on.png');
    }
}


/**
 * Sets the parameters for the control of the sound effects
 * @param {Boolean} status - The status of the sound effects
 * @param {String} btnIcon - The URL of the button icon
 */
function setSoundFxParams(status, btnIcon) {
    const btnSoundFx = document.querySelector('#btn-sound-fx > img');
    isSoundOn = status;
    btnSoundFx.src = btnIcon;
}


/**
 * Toggles fullscreen
 */
function toggleFullscreen() {
    const elem = document.getElementById('content');
    resetActiveElement();
    if (isFullScreenMode) {
        setParamOnExitFullscreen(false);
        document.exitFullscreen();
    }
    else {
        setParamOnExitFullscreen(true);
        elem.requestFullscreen();
    }
}


/**
 * Sets the parameters for the control of the fullscreen mode
 * @param {Boolean} statusFullscreen - The status of the fullscreen mode
 */
function setParamOnExitFullscreen(statusFullscreen) {
    const btnFullScreen = document.querySelector('#btn-fullscreen > img');
    isFullScreenMode = statusFullscreen;
    if (statusFullscreen) {
        btnFullScreen.src = './symbols/exit-fullscreen.png';
    }
    else {
        btnFullScreen.src = './symbols/enter-fullscreen.png';
    }
}


/**
 * Renders the game scene
 */
function renderWorld() {
    world.draw();
}


/**
 * Resets the current active button
 */
function resetActiveElement() {
    document.activeElement.blur();
}
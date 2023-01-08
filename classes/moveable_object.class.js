class MoveableObject {
    positionX = 0;
    positionY = 0;
    img = new Image();

    constructor(positionX, positionY) {
        this.positionX = positionX;
        this.positionY = positionY;
    }

    /**
     * Loads an image from the given URL
     * @param {String} imgUrl The URL of the image
     */
    loadImage(imgUrl) {
        this.img.src = imgUrl;
    }


    /**
     * Loads animation images into the given cache
     * @param {Array} urlList The list of image URLs to be loaded
     * @param {Object} imageCache The cache for animation images
     */
    loadImageCache(urlList, imageCache) {
        urlList.forEach(url => {
            imageCache[url] = (new Image().src = url);
        })
    }


    /**
     * Moves the object with the given speed to the given direction
     * @param {Number} direction The moving direction of the object: -1 = to left, 1 = to right
     * @param {Number} distance The distance that the object should move
     */
    move(direction, distance) {
        this.positionX = this.positionX + (distance * direction);
    }
}
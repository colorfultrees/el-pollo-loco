class DrawableObject {
    positionX = 0;
    positionY = 0;
    img = new Image();
    imageCache = {};
    currentImage = 0;
    aspectRatio = 0; // width/height
    width = 0;
    height = 0;
    collisionBasis = {offsetXRatio: 0, offsetYRatio: 0, widthRatio: 0, heightRatio: 0};
    collisionArea = {x: 0, y: 0, width: 0, height: 0};

    
    constructor(positionX, positionY) {
        this.positionX = positionX;
        this.positionY = positionY;
    }


    /**
     * Loads an image from the given URL
     * @param {String} imgUrl The URL of the image
     */
    loadImage(imgUrl) {
        this.img = new Image();
        this.img.src = imgUrl;
    }


    /**
     * Loads animation images from an array into the object's image cache
     * @param {Array} urlList The list of image URLs to be loaded
     * @param {Object} imageCache The cache for animation images
     */
    loadImageCache(urlList) {
        urlList.forEach(url => {
            this.imageCache[url] = new Image();
            this.imageCache[url].src = url;
        })
    }


    /**
     * Loads all animation images into the object's image cache
     * @param  {...Array} imageArrays List of arrays containing the animation images
     */
    loadImagesToCache(...imageArrays) {
        imageArrays.forEach(array => this.loadImageCache(array));
    }


    /**
     * Sets the basic parameters for the calculation of the collision area
     */
    setCollisionBasis(offsetXRatio, offsetYRatio, widthRatio, heightRatio) {
        this.collisionBasis.offsetXRatio = offsetXRatio;
        this.collisionBasis.offsetYRatio = offsetYRatio;
        this.collisionBasis.widthRatio = widthRatio;
        this.collisionBasis.heightRatio = heightRatio;
    }


    /**
     * Calculates the collision area of an object
     */
    getCollisionArea() {
        let mirror = 1;
        if (this.isImageMirrored) mirror = -1;
        this.collisionArea.x = (mirror * this.positionX) + (this.width * this.collisionBasis.offsetXRatio);
        this.collisionArea.y = this.positionY + (this.height * this.collisionBasis.offsetYRatio);
        this.collisionArea.width = this.width * this.collisionBasis.widthRatio;
        this.collisionArea.height = this.height * this.collisionBasis.heightRatio;
    }
}
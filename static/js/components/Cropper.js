class MyCropper {
    constructor() {
        this.img = document.getElementById('image');
        this.cropper = new Cropper(this.img, {
            crop(e) {
                console.log(e.detail.x);
                console.log(e.detail.y);
                console.log(e.detail.width);
                console.log(e.detail.height);
                console.log(e.detail.rotate);
                console.log(e.detail.scaleX);
                console.log(e.detail.scaleY);
            }
        })
    }
}
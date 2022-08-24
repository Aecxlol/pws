/**
 * We are in the change event on the file input
 * SkillType.php to see the details
 */
class ImageManager {
    constructor() {
        this.body             = document.body;
        this.form             = this.body.querySelector('form#add-skill-form');
        this.addSkillBtn      = this.form.querySelector('#add-skill-btn');
        this.fileInput        = this.body.querySelector('#skill_image');
        this.optionsContainer = this.body.querySelector('#options-container');
        this.newImage         = null;
        this.cropper          = null;

        /* container that contains the yes / no question */
        this.cropQuestionContainer = this.body.querySelector('div.crop-image-yn-container');

        /* container that contains all the crop infos */
        this.cropOptionsContainer       = this.body.querySelector('div.crop-options-btn-container');
        this.cropOptionsContainerInputs = {
            width: null,
            height: null,
            xPos: null,
            yPos: null,
        }

        this.init();
    }

    init = () => {
        this._previewFile();
    }

    /**
     * Create a preview of the file chosen
     * @private
     */
    _previewFile = () => {
        // get the file
        let file   = this.fileInput.files[0];
        let reader = new FileReader();

        // convert the file in a readable url
        if (file) {
            reader.readAsDataURL(file);
        }
        console.log("mdr : ", file);
        reader.addEventListener('load', (e) => {
            // get the url
            let imageUrl = e.target.result;
            // create the img element that will contain the url
            let image    = document.createElement('img');
            // update the img element src with the url
            image.src    = imageUrl;

            // when the image is fully loaded
            image.addEventListener('load', (e) => {
                // resize it
                this._resize(e, image);
            });
        });
    }

    /**
     * Resize an image using canvas
     * @param e
     * @param image
     * @private
     */
    _resize = (e, image) => {
        const RESIZED_IMAGE_WIDTH = 900;
        let canvas                = document.createElement('canvas');
        let ctx                   = canvas.getContext('2d');
        let ratio                 = RESIZED_IMAGE_WIDTH / e.target.width;
        let resizedImgUrl         = null;

        canvas.width  = RESIZED_IMAGE_WIDTH;
        canvas.height = e.target.height * ratio;

        // draw the image in the canvas
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        // get the url of the resized image
        resizedImgUrl = ctx.canvas.toDataURL();

        this.newImage = document.createElement('img');
        this.newImage.setAttribute('alt', 'aperçu de l\'image');
        this.newImage.src = resizedImgUrl;

        this.optionsContainer.append(this.newImage);

        // show if you want to crop the image or not
        this._showCropQuestion();

        // this will remove the previous image if the user decides to choose another image
        this._removeTheExistingImageIfTheUserChangesImage();
    }

    /**
     * @private
     */
    _showCropQuestion = () => {
        const CROP_QUESTION_TEMPLATE = this.body.querySelector('template#crop-image-yn-template');

        // copy the content of the template only if there is nothing in the destination container
        // this is made in case of the user decides to change his image
        // otherwise, each time he will change his image, the content will be cloned and added
        if (this.cropQuestionContainer.childElementCount === 0) {
            const CONTENT = CROP_QUESTION_TEMPLATE.content.cloneNode(true);
            this.cropQuestionContainer.classList.add('active');
            this.cropQuestionContainer.append(CONTENT);
        }

        // handle the yes or no
        this._handleCropQuestionChoice();
    }

    /**
     * yes / no choices
     * @private
     */
    _handleCropQuestionChoice = () => {
        const YES_BTN = this.body.querySelector('button#crop-btn-yes');
        const NO_BTN  = this.body.querySelector('button#crop-btn-no');

        YES_BTN.addEventListener('click', (e) => {
            e.preventDefault();
            let classObj = this;
            // hide the container choices yes / no
            this.cropQuestionContainer.classList.remove('active');
            // show the crop options container
            this._showCropOptions();
            this._updateCropOptionsContainerObj();
            // show the cropper
            this.cropper = new Cropper(this.newImage, {
                aspectRatio: 1,
                crop(e) {
                    classObj._updateCropOptionsInfos(e);
                }

            })
        });

        NO_BTN.addEventListener('click', (e) => {
            e.preventDefault();
            // hide the container choices yes / no
            this.cropQuestionContainer.classList.remove('active');
        });
    }

    /**
     * @param e
     * @private
     */
    _updateCropOptionsInfos = (e) => {
        this.cropOptionsContainerInputs.width.value  = Math.trunc(e.detail.width);
        this.cropOptionsContainerInputs.height.value = Math.trunc(e.detail.height);
        this.cropOptionsContainerInputs.xPos.value   = Math.trunc(e.detail.x);
        this.cropOptionsContainerInputs.yPos.value   = Math.trunc(e.detail.y);
    }

    /**
     * @private
     */
    _showCropOptions = () => {
        const CROP_OPTIONS_TEMPLATE  = this.body.querySelector('template#crop-options-btn-template');
        const CROP_OPTIONS_CONTAINER = this.body.querySelector('div.crop-options-btn-container');
        const CONTENT                = CROP_OPTIONS_TEMPLATE.content.cloneNode(true);

        // this prevents to append everytime the user changes the image
        if (CROP_OPTIONS_CONTAINER.childElementCount === 0) {
            CROP_OPTIONS_CONTAINER.classList.add('active');
            CROP_OPTIONS_CONTAINER.append(CONTENT);
        }

        this._handleCropOptionsChoice(CROP_OPTIONS_CONTAINER);
    }

    _updateCropOptionsContainerObj = () => {
        this.cropOptionsContainerInputs.width  = this.cropOptionsContainer.querySelector('input#width');
        this.cropOptionsContainerInputs.height = this.cropOptionsContainer.querySelector('input#height');
        this.cropOptionsContainerInputs.xPos   = this.cropOptionsContainer.querySelector('input#x-pos');
        this.cropOptionsContainerInputs.yPos   = this.cropOptionsContainer.querySelector('input#y-pos');
    }

    /**
     * @private
     */
    _handleCropOptionsChoice = (containerOptions) => {
        const CROP_BTN   = this.body.querySelector('button#crop-options-btn');
        const RESET_BTN  = this.body.querySelector('button#reset-options-btn');
        const CANCEL_BTN = this.body.querySelector('button#cancel-options-btn');

        CROP_BTN.addEventListener('click', (e) => {
            e.preventDefault();
            let lol = this.cropper.getCroppedCanvas().toDataURL();
            let img = document.createElement('img');
            img.src = lol;
            this.body.append(img)
            console.log(img);
        });

        RESET_BTN.addEventListener('click', (e) => {
            e.preventDefault();
            this.cropper.reset();
        });

        CANCEL_BTN.addEventListener('click', (e) => {
            e.preventDefault();
            this.cropper.destroy();
            this._removeAllChildNodes(this.cropOptionsContainer);
            this.cropOptionsContainer.classList.remove('active');
            this.cropQuestionContainer.classList.add('active');
        });
    }

    /**
     * @private
     */
    _removeTheExistingImageIfTheUserChangesImage = () => {
        let images = this.optionsContainer.querySelectorAll('img');

        let thereIsMoreThanOneImage = images.length > 1;

        if (thereIsMoreThanOneImage) {
            this.optionsContainer.removeChild(images[0]);
        }
    }

    /**
     * @param parent
     * @private
     */
    _removeAllChildNodes = (parent) => {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }
}
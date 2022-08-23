/**
 * We are in the change event on the file input
 * SkillType.php to see the details
 */
class MyCropper {
    constructor() {
        this.body             = document.body;
        this.form             = this.body.querySelector('form#add-skill-form');
        this.addSkillBtn      = this.form.querySelector('#add-skill-btn');
        this.fileInput        = this.body.querySelector('#skill_image');
        this.optionsContainer = this.body.querySelector('#options-container');
        this.newImage         = null;
        this.cropper          = null;

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
        const RESIZED_IMAGE_WIDTH = 600;
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
        const CROP_QUESTION_TEMPLATE  = this.body.querySelector('template#crop-image-yn-template');
        const CROP_QUESTION_CONTAINER = this.body.querySelector('div.crop-image-yn-container');


        // copy the content of the template only if there is nothing in the destination container
        // this is made in case of the user decides to change his image
        // otherwise, each time he will change his image, the content will be cloned and added
        if (CROP_QUESTION_CONTAINER.childElementCount === 0) {
            const CONTENT                 = CROP_QUESTION_TEMPLATE.content.cloneNode(true);
            CROP_QUESTION_CONTAINER.classList.add('active');
            CROP_QUESTION_CONTAINER.append(CONTENT);
        }

        // handle the yes or no
        this._handleCropQuestionChoice(CROP_QUESTION_CONTAINER);
    }

    /**
     * @param containerChoices
     * @private
     */
    _handleCropQuestionChoice = (containerChoices) => {
        const YES_BTN = this.body.querySelector('button#crop-btn-yes');
        const NO_BTN  = this.body.querySelector('button#crop-btn-no');

        YES_BTN.addEventListener('click', (e) => {
            e.preventDefault();
            // hide the container choices yes / no
            containerChoices.classList.remove('active');
            // show the crop options container
            this._showCropOptions();
            // show the cropper
            this.cropper = new Cropper(this.newImage, {
                aspectRatio: 1,
            })
        });

        NO_BTN.addEventListener('click', (e) => {
            e.preventDefault();
            // hide the container choices yes / no
            containerChoices.classList.remove('active');
        });
    }

    /**
     * @private
     */
    _showCropOptions = () => {
        const CROP_OPTIONS_TEMPLATE  = this.body.querySelector('template#crop-options-btn-template');
        const CROP_OPTIONS_CONTAINER = this.body.querySelector('div.crop-options-btn-container');
        const CONTENT                = CROP_OPTIONS_TEMPLATE.content.cloneNode(true);

        if (CROP_OPTIONS_CONTAINER.childElementCount === 0) {
            CROP_OPTIONS_CONTAINER.classList.add('active');
            CROP_OPTIONS_CONTAINER.append(CONTENT);
        }

        this._handleCropOptionsChoice(CROP_OPTIONS_CONTAINER);
    }

    /**
     * @private
     */
    _handleCropOptionsChoice = (containerOptions) => {
        const CROP_BTN = this.body.querySelector('button#crop-options-btn');
        const RESET_BTN = this.body.querySelector('button#reset-options-btn');
        const CANCEL_BTN = this.body.querySelector('button#cancel-options-btn');

        CROP_BTN.addEventListener('click', (e) => {
            e.preventDefault();
        });

        RESET_BTN.addEventListener('click', (e) => {
            e.preventDefault();
        });

        CANCEL_BTN.addEventListener('click', (e) => {
            e.preventDefault();
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
}
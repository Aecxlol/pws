/**
 * We are in the change event on the file input
 * SkillType.php to see the details
 */
class ImageManager {
    constructor() {
        this.body                = document.body;
        this.form                = this.body.querySelector('form#add-skill-form');
        this.submitBtn           = this.form.querySelector('button.submit-btn');
        this.fileInput           = this.body.querySelector('#skill_image');
        this.optionsContainer    = this.body.querySelector('#options-container');
        this.resizedImageElement = null;
        this.resizedImageFile    = null;
        this.resizedImageAttr    = {
            width: 900,
            height: 0
        }
        this.cropper             = null;

        /* container that contains the yes / no question */
        this.cropQuestionContainer = this.body.querySelector('div.crop-image-yn-container');

        /**
         * CANVAS RELATED
         */
        this.canvas = null;
        this.ctx = null

        this.init();
    }

    init = () => {
        this._previewFile();
        this._handleFormSubmission();
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
        this.canvas                  = document.createElement('canvas');
        this.ctx                     = this.canvas.getContext('2d');
        let originalImageWidth       = e.target.width
        let aspectRatio              = this.resizedImageAttr.width / originalImageWidth;
        this.resizedImageAttr.height = e.target.height * aspectRatio;
        let resizedImgUrl            = null;

        this.canvas.width  = this.resizedImageAttr.width;
        this.canvas.height = this.resizedImageAttr.height;

        // draw the image in the canvas
        this.ctx.drawImage(image, 0, 0, this.canvas.width, this.canvas.height);

        // get the url of the resized image
        resizedImgUrl = this.ctx.canvas.toDataURL();

        this.resizedImageElement = document.createElement('img');
        this.resizedImageElement.setAttribute('alt', 'aperçu de l\'image redimensionnée');
        this.resizedImageElement.setAttribute('class', 'resized-image');
        this.resizedImageElement.src = resizedImgUrl;

        /**
         * @todo récup la size de l'image
         * */

        this.optionsContainer.append(this.resizedImageElement);

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
        let modal     = new Modal(this.body, this.resizedImageElement, this.resizedImageAttr);

        YES_BTN.addEventListener('click', (e) => {
            e.preventDefault();
            if (!modal.isActive) {
                this.optionsContainer.removeChild(this.resizedImageElement);
                modal.init();
                setTimeout(() => {
                    modal.show();
                }, 200);
            }
        });

        NO_BTN.addEventListener('click', (e) => {
            e.preventDefault();
            // hide the container choices yes / no
            this.cropQuestionContainer.classList.remove('active');
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

    _handleFormSubmission = () => {
        this.submitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            let url  = this.form.querySelector('div#options-container').dataset.url;
            let data = new FormData(this.form);

            // if the image got cropped then blob it, otherwise blob the resized image
            let finalFile = this.cropper ? this.cropper.getCroppedCanvas() : this.ctx.canvas;

            finalFile.toBlob((blob) => {
                let fileName = 'bbbb'
                data.append('file', blob, fileName);

                const HTTP = new Http();

                HTTP.ajax({method: 'POST', url: url, data: data, async: true}).then((response) => {
                    console.log(response);
                }).catch((error) => {
                    console.error(error.status, error.statusText)
                });
            });

        });
    }
}
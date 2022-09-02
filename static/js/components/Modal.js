class Modal {
    constructor(body, imgToCrop, resizedImgAttr) {
        this.body                = body;
        this.img                 = imgToCrop;
        this.resizedImgAttr      = resizedImgAttr;
        this.modal               = this.body.querySelector('div.modal');
        this.optionsContainer    = this.body.querySelector('div#options-container');
        this.closeModalBtn       = this.modal.querySelector('span.close-modal');
        this.imgOptionsContainer = this.modal.querySelector('div.options');
        this.cropper             = null;
        this.isActive = false;

        this.imgOptions = {
            resizedImgWith: null,
            resizedImgHeight: null,
            resizedImageSize: null,
            cropWidth: null,
            cropHeight: null,
            cropXPos: null,
            cropYPos: null,
        }
    }

    init = () => {
        this._initImgOptions();
        this._initModal();
        this._handleCropOptionsChoice();
        this._closeModal();
    }

    _initImgOptions = () => {
        this.imgOptions.resizedImgWith   = this.imgOptionsContainer.querySelector('div.img-infos').querySelector('input#width');
        this.imgOptions.resizedImgHeight = this.imgOptionsContainer.querySelector('div.img-infos').querySelector('input#height');
        this.imgOptions.resizedImageSize = this.imgOptionsContainer.querySelector('div.img-infos').querySelector('input#size');
        this.imgOptions.cropWidth        = this.imgOptionsContainer.querySelector('div.crop-infos').querySelector('input#width');
        this.imgOptions.cropHeight       = this.imgOptionsContainer.querySelector('div.crop-infos').querySelector('input#height');
        this.imgOptions.cropXPos         = this.imgOptionsContainer.querySelector('div.crop-infos').querySelector('input#x-pos');
        this.imgOptions.cropYPos         = this.imgOptionsContainer.querySelector('div.crop-infos').querySelector('input#y-pos');
    }

    _initModal = () => {
        this.cropper             = null;
        let classObj = this;
        this.modal.querySelector('div.img-to-crop').append(this.img);
        this.cropper = new Cropper(this.img, {
            aspectRatio: 1,
            crop(e) {
                // update in real time the image information
                classObj._updateImgInfosInModal(e);
            },
        });
        this.isActive = true;
    }

    show = () => {
        this.modal.classList.add('active');
    }

    _close = () => {
        this.modal.classList.remove('active');
    }

    _closeModal = () => {
        this.closeModalBtn.addEventListener('click', () => {
            if (this.modal.classList.contains('active')) {
                this._reset();
            }
        });

        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal') && e.target.classList.contains('active')) {
                this._reset();
            }
        });
    }

    _updateImgInfosInModal = (e) => {
        this.imgOptions.resizedImgWith.value   = Math.trunc(this.resizedImgAttr.width);
        this.imgOptions.resizedImgHeight.value = Math.trunc(this.resizedImgAttr.height);
        this.imgOptions.resizedImageSize.value = Math.trunc(10);
        this.imgOptions.cropWidth.value        = Math.trunc(e.detail.width);
        this.imgOptions.cropHeight.value       = Math.trunc(e.detail.height);
        this.imgOptions.cropXPos.value         = Math.trunc(e.detail.x);
        this.imgOptions.cropYPos.value         = Math.trunc(e.detail.y);
    }

    _handleCropOptionsChoice = () => {
        const CROP_BTN   = this.modal.querySelector('button#crop');
        const RESET_BTN  = this.modal.querySelector('button#reset');
        const CANCEL_BTN = this.modal.querySelector('button#cancel');

        CROP_BTN.addEventListener('click', (e) => {
            e.preventDefault();
            let croppedImgUrl = this.cropper.getCroppedCanvas().toDataURL();

            let croppedImg = document.createElement('img');

            croppedImg.setAttribute('alt', 'aperçu de l\'image croppée');
            croppedImg.setAttribute('class', 'cropped-image');
            croppedImg.src = croppedImgUrl;

            this.body.querySelector('img.resized-image').classList.add('hide');
            this.optionsContainer.append(croppedImg);
        });

        RESET_BTN.addEventListener('click', (e) => {
            e.preventDefault();
            this.cropper.reset();
        });

        CANCEL_BTN.addEventListener('click', (e) => {
            e.preventDefault();
            this._reset();
        });
    }

    _reset = () => {
        this.isActive = false;
        this.optionsContainer.append(this.img);
        this.cropper.destroy();
        this._close();
    }
}
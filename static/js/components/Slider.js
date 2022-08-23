class Slider {
    constructor(body) {
        this.body             = body;
        this.previousSlideBtn = this.body.querySelector('#previous-slide');
        this.nextSlideBtn     = this.body.querySelector('#next-slide');
        this.slider           = this.body.querySelector('.slider');
        this.sliderImages     = this.slider.querySelectorAll('img');
        this.dotsNavigation   = this.body.querySelectorAll('.dot');
        this.direction        = {
            previous: 'previous',
            next: 'next'
        }

        this.init();
    }

    init = () => {
        this._showCurrentImage();
        this._slide();
    }

    _slide = () => {
        // previous btn
        this.previousSlideBtn.addEventListener('click', () => {
            // clones the last slider image and puts it right before the current one
            // and then deletes the one which got cloned
            this._createSlide(this.direction.previous);
            // hides all the images
            this._hideSliderImages();
            // shows the current image
            this._showCurrentImage().then((resolve) => {
                // after showing them, inits the corresponding dot
                this._initDotsNavigation();
            });
        });

        // next btn
        this.nextSlideBtn.addEventListener('click', () => {
            // clones the first slider image and puts it at the end of the slider
            // and then deletes the one which got cloned
            this._createSlide(this.direction.next);
            // hides all the images
            this._hideSliderImages();
            // shows the current image
            this._showCurrentImage().then((resolve) => {
                // after showing them, inits the corresponding dot
                this._initDotsNavigation();
            });
        });

        // dots navigation
        // this.dotsNavigation.forEach((dot, i) => {
        //     dot.addEventListener('click', () => {
        //         // hides all the images
        //         this._hideSliderImages();
        //         // only shows the one we want
        //         this.sliderImages[i].classList.add('active');
        //     });
        // });
    }

    /**
     * The image shown will always be the first element in the slider
     * in this case the element with the index 0
     * @returns {Promise<unknown>}
     * @private
     */
    _showCurrentImage = () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.sliderImages[0].classList.add('active');
                resolve(true);
            }, 100)
        });
    }

    /**
     * Creates a clone depending on which button
     * the user clicked on
     * @param direction
     * @private
     */
    _createSlide = (direction) => {
        switch (direction) {
            case this.direction.previous:
                this._createPreviousSlide();
                break;

            case this.direction.next:
                this._createNextSlide();
                break;
        }
    }

    /**
     * @private
     */
    _createPreviousSlide = () => {
        const LAST_SLIDE         = this.sliderImages.length - 1;
        const NEW_PREVIOUS_SLIDE = this.sliderImages[LAST_SLIDE].cloneNode(true);

        this.slider.prepend(NEW_PREVIOUS_SLIDE);
        this.slider.removeChild(this.sliderImages[LAST_SLIDE]);

        this._updateSliderImages();
    }

    /**
     * @private
     */
    _createNextSlide = () => {
        const FIRST_SLIDE    = 0;
        const NEW_LAST_SLIDE = this.sliderImages[FIRST_SLIDE].cloneNode(true);

        this.slider.append(NEW_LAST_SLIDE);
        this.slider.removeChild(this.sliderImages[FIRST_SLIDE]);

        this._updateSliderImages();
    }

    _updateSliderImages = () => {
        this.sliderImages = this.slider.querySelectorAll('img');
    }

    /**
     * Hides all the images
     * @private
     */
    _hideSliderImages = () => {
        this.sliderImages.forEach(sliderImage => {
            if (sliderImage.classList.contains('active')) {
                sliderImage.classList.remove('active');
            }
        });
    }

    /**
     * Activates the dot corresponding to the current image
     * @private
     */
    _initDotsNavigation = () => {
        this.sliderImages.forEach((sliderImage, i) => {
            this.dotsNavigation[i].classList.remove('active');
            setTimeout(() => {
                // when an image is active
                if (sliderImage.classList.contains('active')) {
                    // activates the corresponding dot
                    this.dotsNavigation[sliderImage.dataset.slideNumber - 1].classList.add('active');
                }
            }, 100)
        });
    }
}
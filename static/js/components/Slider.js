class Slider {
    constructor(body) {
        this.body             = body;
        this.previousSlideBtn = this.body.querySelector('#previous-slide');
        this.nextSlideBtn     = this.body.querySelector('#next-slide');
        this.slider           = this.body.querySelector('.slider');
        this.sliderImages     = this.slider.querySelectorAll('img');
        this.translation      = 300;
        this.position         = 0;
        this.direction = {
            previous: 'previous',
            next: 'next'
        }

        this.init();
    }

    init = () => {
        this._initSlide();
        this._slide();
    }

    _slide = () => {
        this.previousSlideBtn.addEventListener('click', () => {
            this._createSlide(this.direction.previous);
            this.sliderImages.forEach(sliderImage => {
                if(sliderImage.classList.contains('active')) {
                       sliderImage.classList.remove('active');
                }
            });
            this._initSlide();
        });

        this.nextSlideBtn.addEventListener('click', () => {
            this._createSlide(this.direction.next);
            this.sliderImages.forEach(sliderImage => {
                if(sliderImage.classList.contains('active')) {
                    sliderImage.classList.remove('active');
                }
            });
            this._initSlide();
        });
    }

    _initSlide = () => {
        this.sliderImages[0].classList.add('active');
    }

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

    _createPreviousSlide = () => {
        const LAST_SLIDE = this.sliderImages.length - 1;
        const NEW_PREVIOUS_SLIDE = this.sliderImages[LAST_SLIDE].cloneNode(true);

        this.slider.prepend(NEW_PREVIOUS_SLIDE);
        this.slider.removeChild(this.sliderImages[LAST_SLIDE]);

        this._updateSliderImages();
    }

    _createNextSlide = () => {
        const FIRST_SLIDE = 0;
        const NEW_LAST_SLIDE = this.sliderImages[FIRST_SLIDE].cloneNode(true);

        this.slider.append(NEW_LAST_SLIDE);
        this.slider.removeChild(this.sliderImages[FIRST_SLIDE]);

        this._updateSliderImages();
    }

    _updateSliderImages = () => {
        this.sliderImages     = this.slider.querySelectorAll('img');
    }
}
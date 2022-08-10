class Scroller {
    constructor() {
        this.body = document.querySelector('body');
        this.menu = document.getElementById('front-menu');
        this.liElements = this.menu.querySelectorAll('li');
        this.mainSection = document.getElementById('main-section-id');
        this.aboutSection = document.getElementById('about-section-id');
        this.topOfTheSite = '';
        this.oneScroll = 98;

        this.init();
    }
    
    init = () => {
        this._initScrollPosition();
        this._manageMenu();
    }

    _initScrollPosition = () => {
        // window.onbeforeunload = function() {
        //     window.scrollTo(0, 0)
        // }
    }

    _manageMenu = () => {
        window.addEventListener('scroll', () => {
           this._manageMenuBackground(); 
           this._manageMenuItemsColor();
        });
    }

    _manageMenuBackground = () => {
        if(window.scrollY > this.oneScroll) {
            this.menu.classList.add('active')
        }else {
            this.menu.classList.remove('active');
        }
    }
    
    _manageMenuItemsColor = () => {
            if(-this.body.getBoundingClientRect().top > this.mainSection.clientHeight && -this.body.getBoundingClientRect().top < this.mainSection.clientHeight + this.aboutSection.clientHeight){
                this.liElements[1].classList.add('active');
            }else {
                this.liElements[1].classList.remove('active');
            }
    }
}
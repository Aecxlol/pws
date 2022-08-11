class Scroller {
    constructor() {
        this.body             = document.querySelector('body');
        this.menu             = document.getElementById('front-menu');
        this.menuItems        = this.menu.querySelectorAll('li');
        this.sections         = this.body.querySelectorAll('section');
        this.mainSection      = document.getElementById('main-section-id');
        this.aboutSection     = document.getElementById('about-section-id');
        this.skillsSection    = document.getElementById('skills-section-id');
        this.portfolioSection = document.getElementById('portfolio-section-id');
        this.contactSection   = document.getElementById('contact-section-id');
        this.footerSection    = document.getElementById('footer-id');
        this.sectionsInfos    = [];
        this.topOfTheSite     = '';
        this.oneScroll        = 98;

        this.init();
    }

    init = () => {
        this._initSectionsInfos();
        this._initFirstItemInMenu();
        this._manageMenu();
    }

    /**
     * Puts a color on the first menu item
     * before a scroll has been done
     * @private
     */
    _initFirstItemInMenu = () => {
        const CURRENT_SECTION = 0;
        const NEXT_SECTION    = 1;
        const FIRST_ITEM_MENU = 0;

        if (-this.body.getBoundingClientRect().top >= this[this.sectionsInfos[CURRENT_SECTION]].offsetTop - this.menu.clientHeight
            && -this.body.getBoundingClientRect().top < this[this.sectionsInfos[NEXT_SECTION]].offsetTop - this.menu.clientHeight) {
            this.menuItems[FIRST_ITEM_MENU].classList.add('active');
        }
    }

    /**
     * Converts all the sections name (my-Section)
     * into something like mySection
     * and stores it in an array
     * @private
     */
    _initSectionsInfos = () => {
        [...this.sections].map(section => {
            const SECTION_NAME = section.className.split('-')[0];
            let sectionWord    = '';

            if (section.className.split('-')[1] === 'section') {
                sectionWord = this._capitalizeFirstLetter(section.className.split('-')[1]);
            } else {
                console.error('Your section\'s class must be named as follows : my-section');
                return;
            }

            this.sectionsInfos.push(SECTION_NAME + sectionWord);
        });
        this.sectionsInfos.push('footerSection');
    }

    /**
     * Takes the first character of a string
     * capitalizes it
     * concatenates it to the rest of the string
     * @param string
     * @returns {string}
     * @private
     */
    _capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    _manageMenu = () => {
        window.addEventListener('scroll', () => {
            this._manageMenuBackground();
            this._manageMenuItemsColor();
        });
    }

    /**
     * Shows the menu background after one scroll to the bottom
     * @private
     */
    _manageMenuBackground = () => {
        if (window.scrollY > this.oneScroll) {
            this.menu.classList.add('active')
        } else {
            this.menu.classList.remove('active');
        }
    }

    /**
     * Puts a color on menu items depending on the scroll position
     * @private
     */
    _manageMenuItemsColor = () => {
        for (let currentSection = 0; currentSection < this.sectionsInfos.length - 1; currentSection++) {
            let nextSection = currentSection + 1;

            if (-this.body.getBoundingClientRect().top >= this[this.sectionsInfos[currentSection]].offsetTop - this.menu.clientHeight
                && -this.body.getBoundingClientRect().top < this[this.sectionsInfos[nextSection]].offsetTop - this.menu.clientHeight) {
                this.menuItems[currentSection].classList.add('active');
            } else {
                this.menuItems[currentSection].classList.remove('active');
            }
        }
    }
}
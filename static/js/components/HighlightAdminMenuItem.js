class HighlightAdminMenuItem {
    constructor() {
        this.body             = document.querySelector("body");
        this.menuItems        = this.body.getElementsByClassName('admin-menu-item');
        this.bodyClassesName  = this.body.className;
        this.pathName         = null;
        this.pagePathName     = null;
        this.pattern          = /^path-admin-?[a-z]*-?[a-z]*$/;
        this.classAttribution = {
            'path-admin': 'admin-menu-item-dashboard',
            'path-admin-users': 'admin-menu-item-users',
            'path-admin-skills': 'admin-menu-item-skills',
            'path-admin-projects': 'admin-menu-item-portfolio',
        };

        this.init()
    }

    init = () => {
        this._highlightMenuItem();
    }

    /**
     * @private
     */
    _highlightMenuItem = () => {
        if (this._bodyContainsAnAdminPath()) {
            for (let i = 0; i < this.menuItems.length; i++) {
                if (this.menuItems[i].classList.contains(this.classAttribution[this.pagePathName])) {
                    if (this.menuItems[i].classList.contains('active')) {
                        this.menuItems[i].classList.remove('active');
                    } else {
                        this.menuItems[i].classList.add('active');
                    }
                }
            }
        } else {
            console.error('Something went wrong with the body\'s classes name');
        }
    }

    /**
     * @returns {boolean}
     * @private
     */
    _bodyContainsAnAdminPath = () => {
        // loop over every class of the body
        for (let i = 0; i < this.bodyClassesName.split(' ').length; i++) {
            // if one of them contains the following pattern (path-admin(-something))
            if (this.bodyClassesName.split(' ')[i].match(this.pattern)) {
                // stores the location of the class
                this.pathName     = i;
                // extracts it from the array
                this.pagePathName = this.bodyClassesName.split(' ')[this.pathName];

                // if the path is something like path-admin-users-create
                if (this.pagePathName.split('-').length === 4) {
                    // only get the first three words (path admin and users)
                    const SPLIT_PATH_NAME = this.pagePathName.split('-').splice(0, 3);
                    // and then concatenate them with a dash (path-admin-users)
                    this.pagePathName     = SPLIT_PATH_NAME.join('-');
                }
                return true;
            }
        }
    }
}
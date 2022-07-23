class UsersListPopupManager {
    constructor() {
        this.actionsBtn       = document.querySelector('.admin-table').getElementsByTagName('i');
        this.adminPopupAction = document.querySelector('.admin-table').getElementsByClassName('admin-popup-actions');

        this.init();
    }

    init = () => {
        this._managePopupWhenActionBtnIsClicked();
    }

    /**
     * Opens or closes the popup(submenu)
     * @private
     */
    _managePopupWhenActionBtnIsClicked = () => {
        window.addEventListener('click', (e) => {
            // When we click on the '...' button
            if (e.target.classList.contains('admin-actions-btn')) {
                // Gets the button's id
                let elementId = e.target.className.match(/\d+/)[0];
                // Closes or opens the popup(submenu)
                for (let i = 0; i < this.adminPopupAction.length; i++) {
                    // If the sub menu has the same id of the '...' button
                    if (this.adminPopupAction[i].classList.contains(`popup-id-${elementId}`)) {
                        // Open or close it depending on if it's already opened or closes
                        if (this.adminPopupAction[i].classList.contains('active')) {
                            this.adminPopupAction[i].classList.remove('active');
                        } else {
                            this.adminPopupAction[i].classList.add('active');
                        }
                        // Prevents the others submenu to open
                    } else {
                        this.adminPopupAction[i].classList.remove('active');
                    }
                }
            } else {
                _closePopupIfAClickIsMadeWhereEverOnThePage(e);
            }
        });

        /**
         * Closes popup(submenu)
         * @param e
         * @private
         */
        let _closePopupIfAClickIsMadeWhereEverOnThePage = (e) => {
            for (let j = 0; j < this.actionsBtn.length; j++) {
                if (!e.target.classList.contains('admin-popup-actions')) {
                    this.adminPopupAction[j].classList.remove('active');
                }
            }
        }
    }
}
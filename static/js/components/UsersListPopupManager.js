class UsersListPopupManager {
    constructor() {
        this.actionsBtn = document.querySelector('.admin-table').getElementsByTagName('i');
        this.adminPopupAction = document.querySelector('.admin-table').getElementsByClassName('admin-popup-actions');

        this.init();
    }

    init = () => {
        this.managePopupWhenActionBtnIsClicked();
    }

    managePopupWhenActionBtnIsClicked = () => {
        for (let i = 0; i < this.actionsBtn.length; i++) {
            this.actionsBtn[i].addEventListener('click', (e) => {

                // prevents to have others popup opened at the same time
                for (let j = 0; j < this.actionsBtn.length; j++) {
                    this.adminPopupAction[j].classList.remove('active');
                }

                if (this.adminPopupAction[i].classList.contains('active')) {
                    this.adminPopupAction[i].classList.remove('active');
                } else {
                    this.adminPopupAction[i].classList.add('active');
                }
            });
        }
    }
}
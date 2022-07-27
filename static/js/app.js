document.addEventListener('DOMContentLoaded', (e) => {

    if (document.querySelector("body").classList.contains('path-admin-users')) {
        new UsersListPopupManager();
    }
});
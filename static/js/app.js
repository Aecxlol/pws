document.addEventListener('DOMContentLoaded', (e) => {

    if (document.querySelector("body").classList.contains('path_admin_users')) {
        new UsersListPopupManager();
    }
});
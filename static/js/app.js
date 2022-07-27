document.addEventListener('DOMContentLoaded', (e) => {
    let body = document.querySelector("body");

    if (body.classList.contains('path-admin-users')) {
        new UsersListPopupManager();
    }

    if (body.classList.contains('admin-body')) {
        new HighlightAdminMenuItem();
    }
});
document.addEventListener('DOMContentLoaded', (e) => {
    let body = document.querySelector("body");

    /* ADMIN */
    if (body.classList.contains('admin-body')) {
        /* USERS AND SKILLS PAGES */
        if (body.classList.contains('path-admin-users') || body.classList.contains('path-admin-skills')) {
            new EditDeletePopupManager();
        }

        /* SKILLS PAGE */
        if(body.classList.contains('path-admin-skills')) {
            new SkillsOrderManager();
        }

        new HighlightAdminMenuItem();
    }
});
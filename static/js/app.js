document.addEventListener('DOMContentLoaded', () => {
    let body = document.querySelector("body");
    /* FRONTEND */
    if(body.classList.contains('front-body')) {
        new Scroller();
        new TypeWriter();
    }

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

        /* MENU IN THE SIDEBAR */
        new HighlightAdminMenuItem();
    }
});
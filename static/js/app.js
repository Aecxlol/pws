document.addEventListener('DOMContentLoaded', () => {
    /**
     * @type {HTMLElement}
     */
    const BODY = document.body;

    /* FRONTEND */
    if (BODY.classList.contains('front-body')) {
        if (BODY.classList.contains('single-project')) {
            new Slider(BODY);
        } else {
            new Scroller();
            new TypeWriter();
        }
    }

    /* ADMIN */
    if (BODY.classList.contains('admin-body')) {
        // new MyCropper();
        /* USERS AND SKILLS PAGES */
        if (BODY.classList.contains('path-admin-users') || BODY.classList.contains('path-admin-skills')) {
            new EditDeletePopupManager();
        }

        /* SKILLS PAGE */
        if (BODY.classList.contains('path-admin-skills')) {
            new SkillsOrderManager();
        }

        /* MENU IN THE SIDEBAR */
        new HighlightAdminMenuItem();
    }
});
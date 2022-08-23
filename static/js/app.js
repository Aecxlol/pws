document.addEventListener('DOMContentLoaded', () => {
    /** @type {HTMLElement} */
    const BODY = document.body;

    //================ FRONTEND ================//
    if (BODY.classList.contains('front-body')) {
        // Portfolio specific project details
        if (BODY.classList.contains('single-project')) {
            new Slider(BODY);
        } else {
            new Scroller();
            new TypeWriter();
            new SortSkills(BODY);
        }
    }

    //================ ADMIN ================//
    if (BODY.classList.contains('admin-body')) {
        /* USERS AND SKILLS PAGES SHOW*/
        if (BODY.classList.contains('path-admin-users') || BODY.classList.contains('path-admin-skills')) {
            new EditDeletePopupManager();
        }

        /* SKILLS AND PROJECTS PAGES CREATE */
        if (BODY.classList.contains('path-admin-projects-create') || BODY.classList.contains('path-admin-skills-create')) {
            // new MyCropper(BODY);
        }

        /* SKILLS PAGE */
        if (BODY.classList.contains('path-admin-skills')) {
            new SkillsOrderManager();
        }

        /* MENU IN THE SIDEBAR */
        new HighlightAdminMenuItem();
    }
});
class SkillsOrderManager {
    constructor() {
        this.skillsOrderContainer  = document.querySelector('.skills-order-container');
        this.skillDivs             = document.querySelectorAll('.skill');
        this.skillsContainers      = document.querySelectorAll('.skills-order');
        this.skillsUpdatingMessage = document.getElementById('skills-updating');
        this.skillsUpdatedMessage  = document.getElementById('skills-update-success');

        this.init();
    }

    init = () => {
        this._dragSkillDiv();
        this._dragSkillDivInContainer();
    }

    /**
     * Sets a dragging class to the element being dragged to add css styling
     * Removes it when we release the click
     * @private
     */
    _dragSkillDiv = () => {
        this.skillDivs.forEach(skillDiv => {
            skillDiv.addEventListener('dragstart', () => {
                skillDiv.classList.add('dragging');
            });

            skillDiv.addEventListener('dragend', () => {
                this.skillsUpdatingMessage.classList.add('active');
                skillDiv.classList.remove('dragging');
                this._defineElementOrderAfterDragging(skillDiv);
            });
        });
    }

    /**
     * Appends a skill div into one of the 2 container
     * @private
     */
    _dragSkillDivInContainer = () => {
        this.skillsContainers.forEach(skillsContainer => {
            skillsContainer.addEventListener('dragover', (e) => {
                // allows dragging into another draggable element
                e.preventDefault();
                const SKILL_DIV_DRAGGING = document.querySelector('.dragging');
                skillsContainer.appendChild(SKILL_DIV_DRAGGING);
            });
        });
    }

    /**
     * Update the position of all divs depending of where the div got dragged
     * This method only updates position in spans
     * @param element
     * @private
     */
    _defineElementOrderAfterDragging = (element) => {
        const POSITION         = element.getElementsByTagName('span');
        const SKILL_DIV_PARENT = element.parentNode;
        const UNDEFINED_ORDER  = 'non défini'
        const DIV_IS_DRAGGED_IN_THE_DEFINED_ORDER_CONTAINER = element.parentNode.classList.contains('defined-order');

        // Sets the order depending on which container the element got dragged
        if (DIV_IS_DRAGGED_IN_THE_DEFINED_ORDER_CONTAINER) {
            console.log("en bas");
            // Converts the parent's children into an array then we can get the position of the child in the list
            // Adding +1 then the order starts at 1
            // const CHILDREN_POSITION = [...(SKILL_DIV_PARENT.children)].indexOf(element) + 1
            // POSITION[0].textContent = CHILDREN_POSITION.toString();

            // Check if a div got its position changed in the defined order container
            // if yes update every divs position (span)

            [...SKILL_DIV_PARENT.children].forEach((skillDiv, i) => {
                console.log("mdr");
                skillDiv.getElementsByTagName('span')[0].textContent = i + 1;
            });




        } else {
            console.log("en haut");
            POSITION[0].textContent = UNDEFINED_ORDER;
        }

        // Once the spans are updated, we update the position in the DB using ajax
        this._updateSkillOrderInDatabase(element);
    }

    /**
     * Updates the data attribute to the new position of the div
     * @param element
     * @param displayOrderValue
     * @returns {string}
     * @private
     */
    _updateSkillPath = (element, displayOrderValue) => {
        let path        = element.dataset.skillPath;
        let updatedPath = path.replace(/[0-9]+$/, displayOrderValue);

        return element.dataset.skillPath = updatedPath;
    }

    /**
     * Builds a complete URL
     * @param path
     * @returns {`${string}//${string}:${string|string}${string}`}
     * @private
     */
    _buildFullUrl = (path) => {
        const PROTOCOL  = window.location.protocol;
        const HOST_NAME = window.location.hostname;
        const PORT      = window.location.port ?? '';

        return `${PROTOCOL}//${HOST_NAME}:${PORT}${path}`;
    }

    /**
     * Updates the DB with the new position of the divs
     * @param element
     * @private
     */
    _updateSkillOrderInDatabase = (element) => {
        let skillDivParentContainer = element.parentNode;
        const HTTP                  = new Http();

        // if the div is dragged into the 'defined-container' container
        if (skillDivParentContainer.classList.contains('defined-order')) {
            // for each div inside this container
            [...skillDivParentContainer.children].forEach(skillDiv => {

                // we update the new path
                let updatedPath = this._updateSkillPath(skillDiv, skillDiv.querySelector('span').textContent);

                // then we build a complete URL using the new path (this._buildFullUrl(updatedPath))
                let fullUrl = this._buildFullUrl(updatedPath);

                // and we finally update the DB with the fullURL
                HTTP.ajax({method: 'POST', url: fullUrl, async: true}).then((response) => {
                    this.skillsUpdatingMessage.classList.remove('active');
                    this.skillsUpdatedMessage.classList.add('active');
                    setTimeout(() => {
                        this.skillsUpdatedMessage.classList.remove('active');
                    }, 2000);
                }).catch((error) => {
                    console.error(error.status, error.statusText);
                });
            });
        } else {
            [...skillDivParentContainer.children].forEach(skillDiv => {

                let updatedPath = this._updateSkillPath(skillDiv, '0');
                let fullUrl = this._buildFullUrl(updatedPath);

                HTTP.ajax({method: 'POST', url: fullUrl, async: true}).then((response) => {
                    this.skillsUpdatingMessage.classList.remove('active');
                    this.skillsUpdatedMessage.classList.add('active');
                    setTimeout(() => {
                        this.skillsUpdatedMessage.classList.remove('active');
                    }, 2000);
                }).catch((error) => {
                    console.error(error.status, error.statusText);
                });
            });
        }
    }
}
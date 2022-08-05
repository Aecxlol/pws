class SkillsOrderManager {
    constructor() {
        this.skillDivs            = document.querySelectorAll('.skill');
        this.skillsContainers     = document.querySelectorAll('.skills-order');
        this.skillsOrderContainer = document.getElementById('skills-order-container');
        this.updatingMessageDiv   = document.getElementById('updating-message');

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
                this.skillsOrderContainer.classList.add('active');
                this.updatingMessageDiv.classList.add('active');
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
        const POSITION                                      = element.getElementsByTagName('span');
        const SKILL_DIV_PARENT                              = element.parentNode;
        const UNDEFINED_ORDER                               = 'non défini'
        const DIV_IS_DRAGGED_IN_THE_DEFINED_ORDER_CONTAINER = element.parentNode.classList.contains('defined-order');

        // For all the skill divs
        [...SKILL_DIV_PARENT.children].forEach((skillDiv, i) => {

            // if one of them is dragged in the defined-order container
            if (DIV_IS_DRAGGED_IN_THE_DEFINED_ORDER_CONTAINER) {
                // assigns to all the skill divs in the container a display order
                // if there are 3 divs and one more is dragged in, the first div
                // will get number 1, the second one number 2 etc
                skillDiv.getElementsByTagName('span')[0].textContent = i + 1;
                // then update the display order in database
                this._updateSkillOrderInDatabase(skillDiv, skillDiv.querySelector('span').textContent);
            } else {
                // skill div which are dragged back to the undefined-order container
                // got its span updated by 'non défini'
                POSITION[0].textContent = UNDEFINED_ORDER;
                // then update the display order in database
                // 'non défini' in front means that the display order equals to 0
                this._updateSkillOrderInDatabase(skillDiv, '0');
            }
        });
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
     * @param displayOrderNewValue
     * @private
     */
    _updateSkillOrderInDatabase = (element, displayOrderNewValue) => {
        const HTTP = new Http();

        // we update the current data attribute by the new path
        // because when a skill div is dragged, its path changes
        let updatedPath = this._updateSkillPath(element, displayOrderNewValue);

        // then we build a complete URL using the new path
        let fullUrl = this._buildFullUrl(updatedPath);

        // and we finally update the DB with the fullURL
        HTTP.ajax({method: 'POST', url: fullUrl, async: true}).then((response) => {
            setTimeout(() => {
                this.skillsOrderContainer.classList.remove('active');
                this.updatingMessageDiv.classList.remove('active');
            }, 1000);
        }).catch((error) => {
            console.error(error.status, error.statusText);
        });
    }
}
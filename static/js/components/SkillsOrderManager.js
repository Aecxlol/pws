class SkillsOrderManager {
    constructor() {
        this.skillsOrderContainer = document.querySelector('.skills-order-container');
        this.skillDivs            = document.querySelectorAll('.skill');
        this.skillsContainers     = document.querySelectorAll('.skills-order');

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
                skillDiv.classList.remove('dragging');

                this._defineElementOrderAfterDragging(skillDiv);
            });
        });
    }

    /**
     *
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

    _defineElementOrderAfterDragging = (element) => {
        const POSITION         = element.getElementsByTagName('span');
        const SKILL_DIV_PARENT = element.parentNode;
        const UNDEFINED_ORDER  = 'non défini'

        // Sets the order depending on which container the element got dragged
        if (element.parentNode.classList.contains('defined-order')) {
            // Converts the parent's children into an array then we can get the position of the child in the list
            // Adding +1 then the order starts at 1
            const CHILDREN_POSITION = [...(SKILL_DIV_PARENT.children)].indexOf(element) + 1
            POSITION[0].textContent = CHILDREN_POSITION.toString();

            // Check if a div got its position changed in the defined order container
            // if yes update every divs position
            for (let i = 0; i < [...(SKILL_DIV_PARENT.children)].length; i++) {
                [...(SKILL_DIV_PARENT.children)][i].getElementsByTagName('span')[0].textContent = i + 1;
            }
        } else {
            POSITION[0].textContent = UNDEFINED_ORDER;
        }
    }
}
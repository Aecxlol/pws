class TypeWriter {
    constructor() {
        this.elementsContainingTextToAnimate = document.querySelectorAll('[data-typewriter-animation]');
        this.animationSpeed = 100;

        this.init();
    }
    
    init = () => {
        this._animate();
    }

    /**
     * Animates elements having data-typewriter-animation attributes and surrounded by span
     * @private
     */
    _animate = () => {
        this.elementsContainingTextToAnimate.forEach(elementContainingTextToAnimate => {
            // the element you want to animate must be surrounded by a span
            if(elementContainingTextToAnimate.querySelector('span'))
            {
                let iteration = 0;
                let textToAnimateSplit = [];
                const TEXT_TO_ANIMATE = elementContainingTextToAnimate.querySelector('span').textContent;

                elementContainingTextToAnimate.querySelector('span').textContent = '';
                textToAnimateSplit = TEXT_TO_ANIMATE.split('');

                let animate = setInterval(() => {
                    // sets the new span text content by looping on all characters stored in textToAnimateSplit
                    elementContainingTextToAnimate.querySelector('span').textContent += textToAnimateSplit[iteration];
                    iteration++;
                    // once we get all characters, stops the animation
                    if(iteration >= textToAnimateSplit.length) {
                        clearInterval(animate);
                    }
                }, this.animationSpeed);
                
            }else {
                console.error("The text that you want to animate must be between a span tag. E.g. : <span>My text I want to animate</span>");
            }
        })
    }
}
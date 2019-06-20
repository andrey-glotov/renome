/**
 * @file Implementation of the accordion slider block
 * @author Andrey Glotov
 */

// -------------------------- BEGIN MODULE VARIABLES -------------------------- 
const Selectors = {
    ROOT: '.accordion-slider',
    THUMB: '.accordion-slider__thumb',
    IMAGE: '.accordion-slider__thumb-img',
};

const MOBILE_BREAKPOINT = 768;
const THUMB_HEIGHT = 100;

let isMobile = true;
const sliders = [];
// --------------------------- END MODULE VARIABLES ---------------------------

/**
 * Accordion slider.
 */
class AccordionSlider {

    /**
     * Create an accordion slider
     * 
     * @param {JQuery} $root The root element
     */
    constructor($root) {
        const $thumbs = $(Selectors.THUMB, $root);

        this._elements = { $root, $thumbs };

        this._collapsedThumbWidth = `${100 / $thumbs.length}%`;
        this._collapsedThumbHeight = THUMB_HEIGHT;

        this._isVertical = true;

        this._handleThumbExpand = this._handleThumbExpand.bind(this);
        this._handleThumbCollapse = this._handleThumbCollapse.bind(this);

        $root.on('mouseenter', Selectors.THUMB, this._handleThumbExpand);
        $root.on('focus', Selectors.THUMB, this._handleThumbExpand);
        $root.on('mouseleave', Selectors.THUMB, this._handleThumbCollapse);
        $root.on('blur', Selectors.THUMB, this._handleThumbCollapse);

        /**
         * Each slide acts as a thumbnail for gallery managed by the
         * magnific-popup jQuery plugin
         */
        $root.magnificPopup({
            delegate: Selectors.THUMB,
            mainClass: 'lightbox',
            gallery: {
                enabled: true,
                tCounter: '',
            },

            closeMarkup: `
                <button aria-label="Close" type="button" class="mfp-close">
                    &#215;
                </button>
            `,
            arrowMarkup: `
                <button 
                    aria-label="%title%"
                    type="button"
                    class="mfp-arrow mfp-arrow-%dir%"
                >
                </button>
            `,

            callbacks: {
                beforeOpen() {
                    // For web accessibility
                    this.wrap.attr({
                        'role': 'dialog',
                        'aria-label': 'Gallery',
                    });
                },
            },
        });

        sliders.push(this);
    }

    // -------------------------- BEGIN EVENT HANDLERS ------------------------

    /**
     * Handle the thumbnail expand event
     * 
     * @param {jQuery.Event} e The event object
     */
    _handleThumbExpand(e) {
        const $thumb = $(e.currentTarget);
        const $image = $(Selectors.IMAGE, $thumb);

        if (this._isVertical) {
            $thumb.height($image.height());
        } else {
            $thumb.width($image.width());
        }
    }

    /**
     * Handle the thumbnail collapse event
     * 
     * @param {jQuery.Event} e The event object
     */
    _handleThumbCollapse(e) {
        const $thumb = $(e.currentTarget);

        if (this._isVertical) {
            $thumb.height(this._collapsedThumbHeight);
        } else {
            $thumb.width(this._collapsedThumbWidth);
        }
    }

    // --------------------------- END EVENT HANDLERS -------------------------

    // -------------------------- BEGIN PUBLIC METHODS ------------------------

    /**
     * Switch slider orientation.
     * 
     * @param {boolean} vertical
     *      true for vertical orientation, false for horizontal
     */
    setVertical(vertical) {
        this._isVertical = vertical;

        if (vertical) {
            this._elements.$thumbs.width('').height(this._collapsedThumbHeight);
        } else {
            this._elements.$thumbs.width(this._collapsedThumbWidth).height('');
        }
    }

    /**
     * Initialize all accordion sliders on the page.
     */
    static initAll() {
        $(Selectors.ROOT).map(function() {
            new AccordionSlider($(this));
        });
    }

    /**
     * Respond to window resize event.
     * 
     * Switch between vertical orientation on mobile devices and horizontal
     * orientation on larger screens.
     */
    static handleResize() {
        if (!isMobile && ($(window).outerWidth() < MOBILE_BREAKPOINT)) {
            isMobile = true;
    
            sliders.forEach((slider) => slider.setVertical(true));
        } else if (isMobile && ($(window).outerWidth() >= MOBILE_BREAKPOINT)) {
            isMobile = false;
    
            sliders.forEach((slider) => slider.setVertical(false));
        }
    }

    // --------------------------- END PUBLIC METHODS -------------------------
}

export default AccordionSlider;


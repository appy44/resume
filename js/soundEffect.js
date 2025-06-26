// chip-hover-sound.js
(function ($) {
    $.fn.chipHoverSound = function (options) {
        const settings = $.extend({
            soundSrc: '../sounds/click.mp3', volume: 0.2
        }, options);

        const audio = new Audio(settings.soundSrc);
        audio.volume = settings.volume;

        return this.each(function () {
            $(this).on('mouseenter', function () {
                try {
                    audio.currentTime = 0;
                    audio.play().catch(() => {
                        console.warn('🔇 Audio play blocked until user interaction.');
                    });
                } catch (err) {
                    console.error('Audio error:', err);
                }
            });
        });
    };
})(jQuery);
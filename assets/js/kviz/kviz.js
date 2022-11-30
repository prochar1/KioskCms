let countQuestions = 17;
let answered = [];

jQuery(document).on('DOMNodeInserted', function (e) {
    if (jQuery(e.target).is('section') && !jQuery(e.target).hasClass('kviz')) {
        answered = [];
    }
});

function getRandomQuestion() {
    let i = Math.floor(Math.random() * countQuestions) + 1;
    if (answered.length == countQuestions) {
        answered = [];
    }
    if (answered.includes(i)) {
        i = getRandomQuestion();
    }
    return i;
}

jQuery(document).on('click', '#kviz', function (e) {
    e.preventDefault();
    let lang = location.hash.replace('#', '').split('/')[0];
    let i = getRandomQuestion();
    answered.push(i);
    jQuery(this).attr('href', lang + '/kviz' + i + '.html');
    $(this).removeAttr('id');
    $(this).trigger('click');
});

jQuery(document).on('click', '.answer', function (e) {
    e.preventDefault();
    jQuery('.page.kviz .btn.next').addClass('active');
    let obj = jQuery(this);
    obj.addClass('active');
    setTimeout(function () {
        obj.closest('.list').find('.correct').addClass('active2');
    }, 1000);
    jQuery('.answer').css({
        'pointer-events': 'none',
        // 'opacity': '0.5'
    });
    if (obj.hasClass('correct')) {
        jQuery('#correctly').addClass('active');
        audio = jQuery('audio#answer');
        if (audio.length) audio[0].play();
        jQuery('#play,#stop').toggle();
    } else {
        jQuery('#poorly').addClass('active');
    }
});

jQuery(document).on('click', '#stop', function (e) {
    e.preventDefault();
    audio = jQuery('#answer');
    if (audio.length) {
        audio[0].pause();
        audio[0].currentTime = 0;
    }
    jQuery('#play,#stop').toggle();
});

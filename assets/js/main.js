jQuery(document).ready(function () {
    console.log(location.hash);
    if (location.hash.replace('#', '')) {
        responseContent(location.hash.replace('#', ''));
    } else {
        responseContent('cz/index.html');
    }

    jQuery('.nodrag').on('dragstart', function () {
        return false;
    });
});

function initGallery() {
    var gallery = jQuery('.gallery');
    gallery.css('visibility', 'visible');
    if (gallery.length) gallery.slick({
        infinite: true,
        swipeToSlide: true
    });
}

jQuery(document).on('DOMNodeInserted', function (e) {
    if (jQuery(e.target).is('section')) {
        initGallery();
    }
});

var autoback_timeout = 3 * 60 * 1000;

autoBackRedirect();

jQuery(document).on('click mouseover touchstart', 'body', function () {
    if (timeout != undefined) clearTimeout(timeout);
    autoBackRedirect();
});

function autoBackRedirect() {
    timeout = setTimeout(function () {
        // vc.jsLogTimeout();
        autoBackSwitchPage();
    }, autoback_timeout);
}

function autoBackSwitchPage() {
    let lang = location.hash.replace('#', '').split('/')[0];
    responseContent(lang + '/index.html');
}

jQuery(document).on('click', '#cz,#en', function (e) {
    e.preventDefault();
    setTimeout(function () {
        jQuery('#en,#cz').toggleClass('active');
    }, 100);
});

let audio;

jQuery(document).on('click', '#stop', function (e) {
    e.preventDefault();
    audio = jQuery('#audio');
    if (audio.length) {
        audio[0].pause();
        audio[0].currentTime = 0;
    }
    //jQuery('#play,#stop').toggle();
});

jQuery(document).on('click', '#play', function (e) {
    e.preventDefault();
    audio = jQuery('#audio');
    if (audio.length) audio[0].play();
    jQuery('#play,#stop').toggle();
    audio.on('ended', function () {
        jQuery('#play,#stop').toggle();
    });
});



jQuery(document).on('click', 'a[href$=".html"],a[href$=".HTML"],a[href$=".htm"],a[href$=".HTML"]', function (e) {
    e.preventDefault();
    let url = jQuery(this).attr('href');
    responseContent(url);
});

function responseContent(url) {
    jQuery.ajax({
        url: url,
        cache: false,
        success: function (response) {
            console.log(url);
            jQuery('#app').html(response);
            jQuery(window).scrollTop(0);
            location.hash = url;
        }
    });
}
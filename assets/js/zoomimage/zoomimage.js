var active = false;
var currentX;
var currentY;
var initialX;
var initialY;
var xOffset = 0;
var yOffset = 0;
var scale = 2;
jQuery(document).on('click', 'a[href$=".jpg"],a[href$=".png"],a[href$=".JPG"],a[href$=".PNG"]', function (e) {
    //console.log(e);
    e.preventDefault();
    currentX = 0;
    currentY = 0;
    initialX = 0;
    initialY = 0;
    xOffset = 0;
    yOffset = 0;
    scale = 2;
    var html = '<div class="zoomimage">';
    html += '<div class="zoomimage_drag">';
    html += '<div class="zoomimage_image" style="background-image: url(' + jQuery(this).attr('href') + ');">';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    html += '<div class="zoomimage_caption">';
    var caption = jQuery(this).find('>div').html();
    if ('undefined' == typeof caption) caption = '<p>' + jQuery(this).closest('div').find('p').html() + '</p>';
    // console.log(caption);
    html += caption;
    html += '</div>';
    html += '<div class="zoomimage_controls">';
    html += '<span class="zoomimage_close"></span>';
    html += '<span class="zoomimage_plus">+</span>';
    html += '<span class="zoomimage_minus">-</span>';
    html += '</div>';
    jQuery('body').append(html);
    jQuery(this).addClass('zoomed_image');
    //vc.jsLogClick('{"action": "Show zoom image","name":"' + jQuery(this).attr('href') + '"}');
});

jQuery(document).on('click', '.zoomimage_close', function () {
    zoomimageClose();
});

function zoomimageClose() {
    jQuery('.zoomimage').remove();
    jQuery('.zoomimage_controls').remove();
    jQuery('.zoomimage_caption').remove();
    jQuery('.zoomed_image').removeClass('.zoomed_image');
    scale = 1;
}

jQuery(document).on('click', '.zoomimage_plus', function (e) {
    scale = scale + 0.4;
    jQuery('.zoomimage .zoomimage_image').css('transform', 'scale(' + scale + ')');
    //vc.jsLogClick('{"action": "Zoom image plus","name":"' + jQuery('.zoomed_image').attr('href') + '"}');
    if (scale < 3) {
        jQuery('.zoomimage_minus').show();
        jQuery(this).show();
    } else {
        jQuery(this).hide();
    }
});

jQuery(document).on('click', '.zoomimage_minus', function (e) {
    scale = scale - 0.4;
    if (scale < 0.6) scale = 0.6;
    jQuery('.zoomimage .zoomimage_image').css('transform', 'scale(' + scale + ')');
    //vc.jsLogClick('{"action": "Zoom image minus","name":"' + jQuery('.zoomed_image').attr('href') + '"}');
    if (scale > 0.6) {
        jQuery('.zoomimage_plus').show();
        jQuery(this).show();
    } else {
        jQuery(this).hide();
    }
});

var dragItem = document.querySelector(".zoomimage_drag");
var container = document.querySelector(".zoomimage");
jQuery(document).on('touchstart', ".zoomimage_drag", dragStart);
jQuery(document).on('touchend', ".zoomimage_drag", dragEnd);
jQuery(document).on('touchmove', ".zoomimage_drag", drag);

function dragStart(e) {
    e = e.originalEvent;
    // console.log(e);
    if (e.type === "touchstart") {
        initialX = e.touches[0].clientX - xOffset;
        initialY = e.touches[0].clientY - yOffset;
    } else {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
    }

    // if (e.target === dragItem) {
    active = true;
    // }
}

function dragEnd(e) {
    initialX = currentX;
    initialY = currentY;

    active = false;
}

function drag(e) {
    if (active) {

        e.preventDefault();

        e = e.originalEvent;

        if (e.type === "touchmove") {
            currentX = e.touches[0].clientX - initialX;
            currentY = e.touches[0].clientY - initialY;
        } else {
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
        }

        // console.log(scale, currentX, currentY);

        xOffset = currentX;
        yOffset = currentY;

        var xPos = currentX;
        var yPos = currentY;

        if (scale > 1) {
            xPos = currentX / scale;
            yPos = currentY / scale;
        }

        setTranslate(xPos, yPos, jQuery('.zoomimage_drag')[0]);
        //vc.jsLogClick('{"action": "Zoom image drag","name":"' + jQuery('.zoomed_image').attr('href') + '"}');
    }
}

function setTranslate(xPos, yPos, el) {
    el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
}
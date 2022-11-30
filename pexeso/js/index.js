let pexesoTime = 180;
let pexesoTimerInterval;
let pexesed = [];

jQuery(document).on('DOMNodeInserted', function (e) {
	if (jQuery(e.target).is('section') && jQuery(e.target).hasClass('pexeso')) {
		$('#pexeso_timer').attr('data-s', pexesoTime + 1);

		pexesoTimer();

		pexesoInit();
	}
});

$(document).ready(function () {

	$('#pexeso_timer').attr('data-s', pexesoTime + 1);

	pexesoTimer();

	pexesoInit();

});

$(document).on('click', '#pexeso_reset', function (e) {
	e.preventDefault();
	pexesoInit();
});

function getRandomImagesFolder() {
	let i = Math.floor(Math.random() * 2) + 1;
	if (pexesed.length == 2) {
		pexesed = [];
	}
	if (pexesed.includes(i)) {
		i = getRandomImagesFolder();
	}
	return i;
}

function pexesoInit() {

	let lang = 'cz';

	if (location.hash.replace('#', '')) lang = location.hash.replace('#', '').split('/')[0];

	$('.lang').hide();
	$('.lang.' + lang).show();

	$('#pexeso_app').html();
	$('#pexeso_data ul').clone().appendTo('#pexeso_app');

	let i = getRandomImagesFolder();

	$('#pexeso_app img').each(function () {
		var src = $(this).attr('data-src').replace('/img/', '/img/' + i + '/');
		$(this).attr('src', src);
	});
	$('#pexeso_app').css({
		'visibility': 'hidden'
	});

	$('#pexeso_app').quizyMemoryGame({
		itemWidth: 310,
		itemHeight: 310,
		itemsMargin: 10,
		colCount: 4,
		animType: 'fade',
		flipAnim: 'tb',
		animSpeed: 250,
		resultIcons: false,
		gameSummary: false,
		openDelay: 1000,
		onFinishCall: function () {
			pexesoEndGame();
		}
	});
	$('#pexeso_app').css({
		'visibility': 'visible'
	});

}

function pexesoTimer() {
	clearTimeout(pexesoTimerInterval);
	var selector = '#pexeso_timer';
	if (!$(selector).hasClass('stop')) {
		var s = Number($(selector).attr('data-s'));
		if (s == 0) {
			pexesoEndGame();
			return;
		}
		$(selector).attr('data-s', s - 1);
		$(selector).text(pexesoSecondsToTime(s - 1));
	}
	pexesoTimerInterval = setTimeout(function () {
		pexesoTimer();
	}, 1000);
}

function pexesoSecondsToTime(secs) {
	var hours = Math.floor(secs / (60 * 60));

	var divisor_for_minutes = secs % (60 * 60);
	var minutes = Math.floor(divisor_for_minutes / 60);

	var divisor_for_seconds = divisor_for_minutes % 60;
	var seconds = Math.ceil(divisor_for_seconds);

	var obj = {
		"h": hours,
		"m": minutes,
		"s": seconds
	};
	if (obj.m <= 9) obj.m = '0' + obj.m;
	if (obj.s <= 9) obj.s = '0' + obj.s;
	return obj.m + ':' + obj.s;
}

function pexesoEndGame() {
	$('#pexeso_timer').addClass('stop');
	var s = pexesoTime - $('#pexeso_timer').attr('data-s');
	if (s != pexesoTime) {
		// $('#pexeso_result #pexeso_ctime').text(pexesoSecondsToTime(s));
		// $('#pexeso_result').show();
	} else {
		// $('#pexeso_timeend').show();
	}
}






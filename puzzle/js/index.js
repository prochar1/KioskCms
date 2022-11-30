class Puzzle {

	constructor() {
		this.time = 300;
		this.count = 6;
		this.pieces = 16;
		this.used = [];
		this.i = this.getRandomNumber();
		this.zIndex = 1;

		this.imagecanvas = document.createElement('canvas');
		this.imagecontext = this.imagecanvas.getContext('2d');

		this.wrapper = $('.puzzle #wrapper');

		$('#timer').attr('data-s', this.time + 1);

		this.timer();

		this.init();

	}

	getRandomNumber(count) {
		if (!count) count = this.count;
		let i = Math.floor(Math.random() * count) + 1;
		return i;
	}

	getRandom(count) {
		if (!count) count = this.count;
		let i = this.getRandomNumber(count);
		const unique = (value, index, self) => self.indexOf(value) === index;
		if (this.used.length == count) {
			this.used = [];
		}
		if (this.used.includes(i)) {
			i = this.getRandom(count);
		}
		this.used.push(i);
		this.used = this.used.filter(unique);
		return i;
	}

	init() {

		this.wrapper
			.removeClass()
			.html('')
			.addClass('pieces' + this.pieces)
			.append('<img src="puzzle/img/' + this.pieces + '/' + this.i + '.png" id="base"/><img src="puzzle/img/' + this.pieces + '/grid.png" id="grid"/>');

		let img = $('.puzzle img#base');

		jQuery('.puzzle .tile').remove();
		for (let i = 0; i < this.pieces; i++) {
			let j = i + 1;
			let tile = '<div class="grid" id="grid' + j + '">';
			tile += '<div class="tile" id="tile' + j + '">';
			tile += '<div class="tile_wrapper">';
			tile += '<div class="handle"></div>';
			tile += '<img src="' + img.attr('src') + '" class="piece mask" id="piece' + j + '" data-mask="puzzle/img/' + this.pieces + '/mask/' + j + '.png"/>';
			tile += '</div>';
			tile += '</div>';
			tile += '</div>';
			this.wrapper.append(tile);
			let position = $('#tile' + j).position();
			$('#piece' + j).css({
				left: (position.left * (-1)),
				top: (position.top * (-1))
			});
			let offset = $('#tile' + j).offset();
			j = i + 1;
			$('#tile' + j).css({
				left: (offset.left * (-1)) + 150,
				top: (offset.top * (-1)) + 100
			}).addClass('unplaced');

		}

		this.prepareTile();

		let that = this;

		$('.puzzle .tile').draggable({
			handle: ".tile_wrapper .handle",
			containment: "body",
			scroll: false,
			start: function () {
				that.zIndex++;
				var obj = $(this);
				obj.css({ 'z-index': that.zIndex });
				obj.closest('.grid').droppable({
					drop: function (event, ui) {
						obj.draggable('disable').css({ top: 0, left: 0 });
						obj.closest('.grid').droppable('destroy');
						obj.removeClass('unplaced');
						obj.addClass('done');
						if ($('.tile.done').length == that.pieces) {
							that.endGame();
						}
						that.prepareTile();
					}
				});
			}
		});

	}

	prepareTile() {
		$('.puzzle .tile.unplaced').removeClass('ready');
		let rand = this.getRandom(this.pieces);
		let obj = $('.puzzle .tile#tile' + rand);
		let img = obj.find('img').get(0);
		let newImg = document.createElement('img');
		newImg.src = img.src;
		newImg.onload = () => {
			let width = newImg.width;
			let height = newImg.height;
			let mask = document.createElement('img');
			mask.src = img.getAttribute('data-mask');
			mask.onload = () => {
				this.imagecanvas.width = width;
				this.imagecanvas.height = height;
				this.imagecontext.drawImage(mask, 0, 0, width, height);
				this.imagecontext.globalCompositeOperation = 'source-atop';
				this.imagecontext.drawImage(img, 0, 0);
				img.src = this.imagecanvas.toDataURL();
				obj.addClass('ready');
			}
		}
	}


	timer() {
		this.resetTimer();
		let selector = '#timer';
		if (!$(selector).hasClass('stop')) {
			let s = Number($(selector).attr('data-s'));
			if (s == 0) {
				//this.endGame();
				return;
			}
			$(selector).attr('data-s', s - 1);
			$(selector).text(this.secondsToTime(s - 1));
		}
		puzzleTimerInterval = setTimeout(() => this.timer(), 1000);
	}

	resetTimer() {
		clearTimeout(puzzleTimerInterval);
	}

	secondsToTime(secs) {
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

	endGame() {
		$('#timer').addClass('stop');
		$('#base,#grid').addClass('done');
	}

}

let puzzleTimerInterval;
jQuery(document).on('DOMNodeInserted', function (e) {
	if (jQuery(e.target).is('section') && jQuery(e.target).hasClass('puzzle')) {
		const puzzle = new Puzzle();
	}
});



$(document).ready(function() {
	
	$('.debug #touch').html('isTouch: <strong>' + ('ontouchstart' in window) + '</strong>');
	$('.debug #orientation').html('orientationChange: <strong>' + ('onorientationchange' in window) + '</strong>');
	
	$('.default-slider').iosSliderVertical({
		desktopClickDrag: true,
		navNextSelector: $('.default-slider .next'),
		navPrevSelector: $('.default-slider .prev')
	});
	
	$('.default-slider-container .goToBlock .go').each(function(i) {
		$(this).bind('click', function() {
			$('.default-slider').iosslider-vertical('goToSlide', i + 1);
		});
	});
	
	$('.snap-slider').iosSliderVertical({
		desktopClickDrag: true,
		snapToChildren: true
	});
	
	$('.infinite-slider').iosSliderVertical({
		desktopClickDrag: true,
		snapToChildren: true,
		infiniteSlider: true
	});
	
	$('.responsive-slider').iosSliderVertical({
		desktopClickDrag: true,
		snapToChildren: true,
		infiniteSlider: true,
		responsiveSlideContainer: false
	});
	
	$('.responsive-slider-2').iosSliderVertical({
		desktopClickDrag: true,
		snapToChildren: true,
		infiniteSlider: true,
		responsiveSlides: false
	});
	
	$('.autoslide-slider1').iosSliderVertical({
		desktopClickDrag: true,
		snapToChildren: true,
		autoSlide: true,
		startAtSlide: '2',
		scrollbar: true
	});
	
	$('.autoslide-slider2').iosSliderVertical({
		desktopClickDrag: true,
		snapToChildren: true,
		infiniteSlider: true,
		autoSlide: true,
		startAtSlide: '2',
		scrollbar: true,
		navNextSelector: $('.autoslide-slider2 .next'),
		navPrevSelector: $('.autoslide-slider2 .prev')
	});
	
	$('.autoslide-slider2-container .goToBlock .go').each(function(i) {
		$(this).bind('click', function() {
			$('.autoslide-slider2').iosslider-vertical('goToSlide', i + 1);
		});
	});
	
	$('.autoslide-slider4').iosSliderVertical({
		desktopClickDrag: true,
		snapToChildren: true,
		infiniteSlider: true,
		autoSlide: false,
		autoSlideTimer: 2000,
		startAtSlide: '2',
		scrollbar: true,
		navNextSelector: $('.autoslide-slider4 .next'),
		navPrevSelector: $('.autoslide-slider4 .prev')
	});
	
	$('.autoslide-slider4-container .goToBlock .go').eq(0).bind('click', function() {

		$('.autoslide-slider4').iosslider-vertical('autoSlidePlay');
	
	});

	$('.autoslide-slider4-container .goToBlock .go').eq(1).bind('click', function() {

		$('.autoslide-slider4').iosslider-vertical('autoSlidePause');
	
	});
	
	$('.autoslide-slider5').iosSliderVertical({
		desktopClickDrag: true,
		snapToChildren: true,
		infiniteSlider: true,
		autoSlide: true,
		autoSlideTimer: 2000,
		startAtSlide: '2',
		scrollbar: true,
		navNextSelector: $('.autoslide-slider4 .next'),
		navPrevSelector: $('.autoslide-slider4 .prev'),
		autoSlideToggleSelector: $('.autoslide-slider5-container .goToBlock .go:eq(2)')
	});
	
	$('.autoslide-slider5-container .goToBlock .go').eq(0).bind('click', function() {

		$('.autoslide-slider5').iosslider-vertical('autoSlidePlay');
	
	});

	$('.autoslide-slider5-container .goToBlock .go').eq(1).bind('click', function() {

		$('.autoslide-slider5').iosslider-vertical('autoSlidePause');
	
	});
	
	$('.variable-width-slider').iosSliderVertical({
		desktopClickDrag: true,
		snapToChildren: true
	});
	
	$('.short-width-slider').iosSliderVertical({
		desktopClickDrag: true,
		snapToChildren: true
	});
	
	$('.short-width-slider-2').iosSliderVertical({
		desktopClickDrag: true,
		snapToChildren: true,
		infiniteSlider: true,
		navNextSelector: '.short-width-slider-2 .next',
		navPrevSelector: '.short-width-slider-2 .prev'
	});
	
	$('.short-width-slider-3').iosSliderVertical({
		desktopClickDrag: true,
		snapToChildren: true
	});
	
	$('.autoslide-slider3').iosSliderVertical({
		desktopClickDrag: true,
		snapToChildren: true,
		infiniteSlider: true,
		autoSlide: true,
		autoSlideTransTimer: 0,
		navNextSelector: $('.autoslide-slider3 .next'),
		navPrevSelector: $('.autoslide-slider3 .prev')
	});
	
	$('.destroy-slider').iosSliderVertical({
		desktopClickDrag: true,
		snapToChildren: true,
		infiniteSlider: true,
		autoSlide: true,
		navNextSelector: $('.destroy-slider .next'),
		navPrevSelector: $('.destroy-slider .prev')
	});
	
	$('.destroy-slider-container .goToBlock .go').each(function(i) {
		$(this).bind('click', function() {
			$('.destroy-slider').iosslider-vertical('goToSlide', i + 1);
		});
	});
	
	$('.destroy-slider-container .destInitBlock .dest').each(function(i) {
	
		$(this).bind('click', function() {
			$('.destroy-slider').iosslider-vertical('destroy');
		});
	
	});
	
	$('.destroy-slider-container .destInitBlock .init').each(function(i) {
	
		$(this).bind('click', function() {
			$('.destroy-slider').iosSliderVertical({
				desktopClickDrag: true,
				snapToChildren: true,
				infiniteSlider: true,
				autoSlide: true,
				navNextSelector: $('.destroy-slider .next'),
				navPrevSelector: $('.destroy-slider .prev')
			});
		});
	
	});
	
	$('.callback-slider').iosSliderVertical({
		desktopClickDrag: true,
		snapToChildren: true,
		infiniteSlider: true,
		keyboardControls: true,
		navSlideSelector: $('.callback-slider .paging .box'),
		onSliderLoaded: callbackSliderLoadedChanged,
		onSlideChange: callbackSliderChanged,
		onSlideComplete: callbackSliderComplete,
		onSlideStart: callbackSliderStart,
		onSliderUpdate: callbackSliderUpdate
	});
	
	$('.callback-slider-container .destInitBlock .dest').each(function(i) {
	
		$(this).bind('click', function() {
			$('.callback-slider').iosslider-vertical('destroy');
		});
	
	});
	
	$('.callback-slider-container .destInitBlock .update').each(function(i) {
	
		$(this).bind('click', function() {
			$('.callback-slider').iosslider-vertical('update');
		});
	
	});
	
	$('.callback-slider-container .destInitBlock .init').each(function(i) {
	
		$(this).bind('click', function() {
			$('.callback-slider').iosSliderVertical({
				desktopClickDrag: true,
				snapToChildren: true,
				infiniteSlider: true,
				autoSlide: true,
				navNextSelector: $('.destroy-slider .next'),
				navPrevSelector: $('.destroy-slider .prev')
			});
		});
	
	});
	
	$('.callback-slider-container .goToBlock .go').each(function(i) {
		$(this).bind('click', function() {
			$('.callback-slider').iosslider-vertical('goToSlide', i + 1);
		});
	});
	
	$('.full-width-slider').iosSliderVertical({
		desktopClickDrag: true,
		snapToChildren: true,
		infiniteSlider: true
	});
	
	$('.form-slider').iosSliderVertical({
		desktopClickDrag: true,
		snapToChildren: true,
		infiniteSlider: true
	});
	
	$('.media-query-slider').iosSliderVertical({
		desktopClickDrag: true,
		snapToChildren: true,
		infiniteSlider: true
	});
	
	$('.thirty-slider').iosSliderVertical({
		desktopClickDrag: true,
		snapToChildren: true
	});
	
	$('.undefined-height-slider').iosSliderVertical({
		desktopClickDrag: true,
		snapToChildren: true
	});
	
	$('.bind-event-slider .linkBlock').bind('click', function() {
		window.open('http://google.ca');
	});
	
	$('.bind-event-slider').iosSliderVertical({
		desktopClickDrag: true,
		snapToChildren: true,
		infiniteSlider: true
	});
	
	$('.image-drag-slider').iosSliderVertical({
		desktopClickDrag: true,
		snapToChildren: true,
		infiniteSlider: true
	});
	
	$('.add-remove-slide-slider').iosSliderVertical({
		desktopClickDrag: true,
		snapToChildren: true,
		scrollbar: true,
		scrollbarHide: false
	});
	
	$('.short-content-slider').iosSliderVertical({
		desktopClickDrag: true,
		snapToChildren: true
	});
	
	$('.add-remove-slide-slider-container .destInitBlock .add').bind('click', function() {
		
		var slide = $("<div/>", {
			'class': 'item item6'
		}).append($('<img />', {
			'src': '../../_site-demo/_img/h-slider-1.jpg'
		}));
		
		$('.add-remove-slide-slider').iosslider-vertical('addSlide', slide, 1);
	
	});
	
	$('.add-remove-slide-slider-container .destInitBlock .rem').bind('click', function() {
	
		$('.add-remove-slide-slider').iosslider-vertical('removeSlide', 1);
	
	});
	
	$('.drag-scrollbar-slider').iosSliderVertical({
		desktopClickDrag: true,
		snapToChildren: true,
		scrollbarDrag: true,
		scrollbarContainer: '.drag-scrollbar-scroll-container',
		scrollbarMargin: 0,
		scrollbarHeight: '40px',
		scrollbarBorderRadius: 0,
		scrollbarOpacity: 1
	});
	
	$('.drag-scrollbar-slider-2').iosSliderVertical({
		desktopClickDrag: true,
		snapToChildren: true,
		scrollbarDrag: true,
		snapSlideCenter: true,
		scrollbarContainer: '.drag-scrollbar-scroll-container-2',
		scrollbarMargin: '0 15px',
		scrollbarHeight: '10px',
		scrollbarBorderRadius: 0,
		scrollbarOpacity: 1
	});
	
	$('.lock-slider').iosSliderVertical({
		desktopClickDrag: true,
		snapToChildren: true
	});
	
	$('.lock-slider-container .destInitBlock .lock').bind('click', function() {
		
		$('.lock-slider').iosslider-vertical('lock');
	
	});
	
	$('.lock-slider-container .destInitBlock .unlock').bind('click', function() {
	
		$('.lock-slider').iosslider-vertical('unlock');
	
	});
	
	$('.unselectable-slider').iosSliderVertical({
		desktopClickDrag: true,
		snapToChildren: true,
		unselectableSelector: '.unselectable'
	});
	
	$('.scrollbar-y-slider').iosSliderVertical({
		desktopClickDrag: true,
		snapToChildren: true
	});
	
	$('.keyboard-control-slider').iosSliderVertical({
		desktopClickDrag: true,
		snapToChildren: true,
		keyboardControls: true
	});
	
	$('.tab-control-slider').iosSliderVertical({
		desktopClickDrag: true,
		snapToChildren: true,
		tabToAdvance: true
	});
	
	$('.snap-center-slider').iosSliderVertical({
		desktopClickDrag: true,
		snapToChildren: true,
		snapSlideCenter: true
	});
	
	$('.snap-center-slider-2').iosSliderVertical({
		desktopClickDrag: true,
		snapToChildren: true,
		snapSlideCenter: true,
		infiniteSlider: true
	});
	
	$('.snap-center-slider-3').iosSliderVertical({
		desktopClickDrag: true,
		snapToChildren: true,
		snapSlideCenter: true
	});
	
});

function callbackSliderStart(args) {

	try {
		console.log('start:');
		console.log(args);
	} catch(err) {}
	
}

function callbackSliderUpdate(args) {
	
	try {
		console.log('update:');
		console.log(args);
	} catch(err) {}
	
}

function callbackSliderChanged(args) {
	
	try {
		console.log('changed:');
		console.log(args);
	} catch(err) {}
	
	$(args.sliderObject).siblings('.paging').children('.box').removeClass('selected');
	$(args.sliderObject).siblings('.paging').children('.box:eq(' + (args.currentSlideNumber - 1) + ')').addClass('selected');
	
}

function callbackSliderLoadedChanged(args) {
	
	$(args.sliderObject).siblings('.paging').children('.box').removeClass('selected');
	$(args.sliderObject).siblings('.paging').children('.box:eq(' + (args.currentSlideNumber - 1) + ')').addClass('selected');
	try {
		console.log(args);
	} catch(err) {}
	
}

function callbackSliderComplete(args) {
	
	/* console.log(args); */
	$(args.currentSlideObject).html('text-added');
	try {
		console.log('conplete:');
		console.log(args);
	} catch(err) {}
	
}
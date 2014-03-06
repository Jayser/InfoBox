;(function(){

	"use strict";

	window.infoBox = function(options) {

		var opt = {
				jsonURL         : options.jsonURL,
				textCrop        : options.textCrop        || '23px',
				detailsTextHide : options.detailsTextHide || 'hide details',
				detailsTextShow : options.detailsTextShow || 'show details'
			}, $el = {};

			var setHelpers = function() {
				$el.root     = $('.info-box');
				$el.temp     = $('#info-box-template-item');

				$el.item     = $('.info-box_item');
				$el.desc     = $('.info-box_description');
				$el.details  = $('.info-box_details');
			
				// button
				$el.navigate = $('.info-box_navigation');
				$el.b_play   = $('.info-box_button_play');
				$el.b_prev   = $('.info-box_button_prev');
				$el.b_next   = $('.info-box_button_next');
			};

		// GET JSON & APPEND ITEMS TO DOM
		var addItem = function() {
			$.getJSON(opt.jsonURL, function(data) {
				$el.root.prepend(Mustache.render($el.temp.html(), data))
				init('success');
			});
		};

		// ADD ACTIVE TO FIRST CHILD
		var firstActive = function() {
			var $firstItem = $el.item.filter(':first');

			$firstItem.attr('data-active','true').show();
			$el.b_play.attr('href',$firstItem.attr('data-info-box-url'));
		};

		// ADD CROP & HEIGHT
		var hideDetails  = function() {

			// ADD TEXT
			$el.details.text(opt.detailsTextShow);

			$el.item.each(function(index, item) {

				// GET MAIN HEIGHT
				var $descItem = $(item).find('.info-box_description'),
					descHeight = $descItem.height(),
					itemHeight = $(item).height();

				$descItem.height(opt.textCrop);

				$(item).css({"min-height": $(item).height() }).attr('info-box-max-height', descHeight);

			});

			// SET MAIN HEIGHT
			$el.item.hide();
		};

		// BUTTON NAVIGATION / NEXT & PREV
		var navigation = function(nav) {
			var $current  = $el.item.filter('[data-active="true"]'),
				$navigate = (nav === 'next') ? $current.next() : $current.prev();

			if ($navigate.hasClass('info-box_item')) {
				$current.hide().removeAttr('data-active');
				$navigate.attr('data-active','true').fadeIn();
				$el.b_play.attr('href',$navigate.attr('data-info-box-url'));
			};
			
		};

		// TOGGLE DETAILS
		var toggleDetails = function(e) {
			var $target  = $(e.target),
				$item    = $target.closest('.info-box_item'),
				$desc    = $item.find('.info-box_description'),
				$img     = $item.find('.info-box_thumb'),
				$imgH    = $img.find('img').height(),
				$details = $item.find('.info-box_details');

			if ($desc.height() == opt.textCrop.split('px')[0]) {
				$img.animate({height: 0},500,function() {
					$img.css('height',0);
					$desc.animate({height: $item.attr('info-box-max-height')},500);
					$details.text(opt.detailsTextHide);
				});
			} else {
				$desc.animate({height: opt.textCrop},500,function() {
					$img.animate({height: $imgH},500);
					$details.text(opt.detailsTextShow);
				});
			};
		};

		// SET EVENTS
		var events = function() {
			$el.b_next.on('click',function(e){
				navigation('next');
				e.preventDefault();
			});

			$el.b_prev.on('click',function(e){
				navigation('prev');
				e.preventDefault();
			});

			$el.details.on('click',function(e) {
				toggleDetails(e);
				e.preventDefault();
			});
		};

		//INIT
		var init = function(status) {
			if (status === 'success') {
				// SET VARIABLES
				setHelpers();

				// HIDE DETAILS
				hideDetails();

				// SET ACTIVE FIRST CHILD
				firstActive();

				//SET EVENTS
				events();
			} else{
				// SET VARIABLES
				setHelpers();

				// APPEND ITEMS TO DOM
				addItem();
			};
		};

		// INIT
		init();
	};

}());

infoBox({
	jsonURL: 'js/info_box.json',
	textCrop:'23px',
	detailsTextHide : 'hide details',
	detailsTextShow : 'show details'
});
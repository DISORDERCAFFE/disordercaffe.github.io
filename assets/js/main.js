/*
	DISORDER Official production
*/

(function($) {

	var	$window = $(window),
		$head = $('head'),
		$body = $('body');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ '361px',   '480px'  ],
			xxsmall:  [ null,      '360px'  ],
			'xlarge-to-max':    '(min-width: 1681px)',
			'small-to-xlarge':  '(min-width: 481px) and (max-width: 1680px)'
		});

	// Stops animations/transitions until the page has ...

		// ... loaded.
			$window.on('load', function() {
				window.setTimeout(function() {
					$body.removeClass('is-preload');
				}, 100);
			});

		// ... stopped resizing.
			var resizeTimeout;

			$window.on('resize', function() {

				// Mark as resizing.
					$body.addClass('is-resizing');

				// Unmark after delay.
					clearTimeout(resizeTimeout);

					resizeTimeout = setTimeout(function() {
						$body.removeClass('is-resizing');
					}, 100);

			});

	// Fixes.

		// Object fit images.
			if (!browser.canUse('object-fit')
			||	browser.name == 'safari')
				$('.image.object').each(function() {

					var $this = $(this),
						$img = $this.children('img');

					// Hide original image.
						$img.css('opacity', '0');

					// Set background.
						$this
							.css('background-image', 'url("' + $img.attr('src') + '")')
							.css('background-size', $img.css('object-fit') ? $img.css('object-fit') : 'cover')
							.css('background-position', $img.css('object-position') ? $img.css('object-position') : 'center');

				});

	// Sidebar.
	//
	// В этой версии боковая панель ВСЕГДА закрыта при загрузке.
	// На всех размерах экрана она открывается только кнопкой-гамбургером.
	// Важно: старый Scroll lock здесь намеренно удалён.
	// Он двигал sidebar вслед за основной страницей и мог вызывать скачки.

		var $sidebar = $('#sidebar');

		if ($sidebar.length) {

			// Закрываем sidebar при загрузке страницы.
			$sidebar.addClass('inactive');

			// Создаём кнопку-гамбургер.
			$('<a href="#sidebar" class="toggle" aria-label="Открыть меню">Toggle</a>')
				.appendTo($sidebar)
				.on('click', function(event) {

					// Не даём браузеру переходить к якорю #sidebar.
					event.preventDefault();
					event.stopPropagation();

					// Открыть / закрыть панель.
					$sidebar.toggleClass('inactive');

				});

			// Клики по ссылкам внутри sidebar.
			// После выбора страницы меню закрывается.
			$sidebar.on('click', 'a', function(event) {

				var $a = $(this),
					href = $a.attr('href'),
					target = $a.attr('target');

				// Кнопка-гамбургер обрабатывается отдельно выше.
				if ($a.hasClass('toggle'))
					return;

				// Не мешаем пустым ссылкам.
				if (!href || href == '#' || href == '')
					return;

				// Закрываем панель перед переходом.
				$sidebar.addClass('inactive');

				// Для обычной ссылки оставляем стандартный переход.
				// Для target="_blank" открываем новую вкладку.
				if (target == '_blank') {
					event.preventDefault();
					window.open(href, '_blank');
				}

			});

			// События внутри панели не должны закрывать её.
			$sidebar.on('click touchstart touchmove wheel', function(event) {
				event.stopPropagation();
			});

			// Клик вне панели закрывает её.
			$body.on('click touchend', function() {
				$sidebar.addClass('inactive');
			});

		}

	// Back to top.
	// ---------------------------------------------------------------------
	// Создаём одну общую кнопку "Наверх" для ВСЕХ страниц сайта.
	// Кнопка не требует отдельного HTML-кода на каждой странице:
	// JavaScript сам добавляет её в <body>.
	//
	// После прокрутки вниз кнопка появляется в правом нижнем углу.
	// При клике страница плавно возвращается в самое начало.
	// ---------------------------------------------------------------------

		var $backToTop = $('<button type="button" class="back-to-top" aria-label="Вернуться в начало страницы" title="Наверх">↑</button>')
			.appendTo($body);

		// Показываем кнопку только после небольшой прокрутки.
		// 300 px — достаточно, чтобы она не мешала на первом экране.
		$window.on('scroll.back-to-top', function() {
			if ($window.scrollTop() > 300)
				$backToTop.addClass('is-visible');
			else
				$backToTop.removeClass('is-visible');
		});

		// Плавный возврат в начало страницы.
		$backToTop.on('click', function(event) {
			event.preventDefault();

			$('html, body').stop(true, false).animate({
				scrollTop: 0
			}, 600);
		});


	// Menu.
		var $menu = $('#menu'),
			$menu_openers = $menu.children('ul').find('.opener');

		// Openers.
			$menu_openers.each(function() {

				var $this = $(this);

				$this.on('click', function(event) {

					// Prevent default.
						event.preventDefault();

					// Toggle.
						$menu_openers.not($this).removeClass('active');
						$this.toggleClass('active');


				});

			});

})(jQuery);

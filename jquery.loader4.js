/*!
 * jQuery loader plugin
 * Version BETA 4 (28-JUNE-2012)
 * Copyright (c) 2012 Guilherme Mori {guilherme.danna.mori}@gmail.com
 */

;(function ($) {
    var jQueryLoaderPluginSettings = {
        bgColor: '#000000',
        bgOpacity: 0.85,
        load: [],
        message: 'Aguarde! Carregando o site: %f (%p% | %c de %t)',
        ending_message: 'Uma vez carregado o site não irá mais ser carregado.',
        fadeOutSpeed: 'fast',
		callbackEach: function (el) { },
		callbackEnd: function () { },
		imageExt: [],
		cssExt: [],
		jsExt: [],
		htmlExt: [],
		otherExt: []
    };
	
	var jQueryLoaderPluginCore = {
		imageExt: ['png', 'jpg', 'jpeg', 'bmp', 'gif'],
		cssExt: ['css'],
		jsExt: ['js'],
		htmlExt: ['html', 'htm', 'php', 'asp', 'aspx'],
		otherExt: []
	}
	
	var $jQueryLoaderPluginLastItem = '';
    var jQueryLoaderPluginMethods = {
        init: function (options) {
            if (options)
                $.extend(jQueryLoaderPluginSettings, options);
            if (!$.isArray(jQueryLoaderPluginSettings.load))
                return $.error('Options must have at least load contents array on jQuery.preLoadGUI().');
			$.extend(jQueryLoaderPluginCore.imageExt, jQueryLoaderPluginSettings.imageExt);
			$.extend(jQueryLoaderPluginCore.cssExt, jQueryLoaderPluginSettings.cssExt);
			$.extend(jQueryLoaderPluginCore.jsExt, jQueryLoaderPluginSettings.jsExt);
			$.extend(jQueryLoaderPluginCore.htmlExt, jQueryLoaderPluginSettings.htmlExt);
			$.extend(jQueryLoaderPluginCore.otherExt, jQueryLoaderPluginSettings.otherExt);
			
            jQueryLoaderPluginMethods.show(jQueryLoaderPluginSettings.load);
        },
		
		defineType: function (el) {
			var ext = el.toLowerCase();
				ext = el.split ('.');
			var len = ext.length;
				ext = ext[len-1];
			
			if ($.inArray(ext, jQueryLoaderPluginCore.imageExt) >= 0) return 'img';
			if ($.inArray(ext, jQueryLoaderPluginCore.cssExt) >= 0) return 'css';
			if ($.inArray(ext, jQueryLoaderPluginCore.jsExt) >= 0) return 'js';
			if ($.inArray(ext, jQueryLoaderPluginCore.htmlExt) >= 0) return 'html';
			if ($.inArray(ext, jQueryLoaderPluginCore.otherExt) >= 0) return 'ajax';
			return false;
		},
		
		uniqId: function () { d = new Date; return d.getTime(); },
		
        show: function (l) {
            for (var el in l) {
                if ($.isArray(l[el])) {
                    i = 'preLoadGUIBeta4';
                    c = $('#' + i).size();
					
                    if (c == 0) {
                        $('<div></div>').attr('id', i).css({
                            width: '100%',
                            height: '100%',
                            backgroundColor: jQueryLoaderPluginSettings.bgColor,
                            zIndex: 99999999,
                            position: 'fixed',
                            opacity: jQueryLoaderPluginSettings.bgOpacity,
                            left: 0,
                            top: 0
                        }).appendTo('body');
						
                        $('<div></div>').attr('id', i + 'loader').attr('rel', l.length).attr('loaded', 0).css({
                            width: '0',
                            height: '1px',
                            backgroundColor: '#ffffff',
                            zIndex: 999999999,
                            position: 'fixed',
                            left: 0,
                            top: '50%'
                        }).appendTo('body');
						
                        $('<div></div>').attr('id', i + 'loaderText').css({
                            fontSize: '11px',
                            fontFamily: "Verdana, Geneva, sans-serif",
                            width: '100%',
                            color: '#ffffff',
                            height: '12px',
                            zIndex: 999999999,
                            position: 'fixed',
                            left: 0,
                            top: '50%',
                            marginTop: '-20px'
                        }).appendTo('body')
                    }
					
					$jQueryLoaderPluginLastItem = l[el];
					type = jQueryLoaderPluginMethods.defineType(l[el][0]);
					url = l[el][0] + ((l[el][type == 'html' ? 2 : 1] === true) ? (l[el][0].indexOf ('?') >= 0 ? '&' : '?') + 'disableCache=' + jQueryLoaderPluginMethods.uniqId() : '');
                    switch (type) {
                   		case 'img':
							$("<img />").css({
								visibility: 'hidden'
							}).attr("src", url).load(function () {
								jQueryLoaderPluginSettings.callbackEach($jQueryLoaderPluginLastItem);
								jQueryLoaderPluginMethods.show(l);
							});
                        break;
                    	case 'css':
							$("<style></style>").attr({
								type: "text/css"
							}).load(url, function () {
								$(this).appendTo('head');
								jQueryLoaderPluginSettings.callbackEach($jQueryLoaderPluginLastItem);
								jQueryLoaderPluginMethods.show(l);
							});
                        break;
                    	case 'html':
							$('<div></div>').attr('rel', l[el][1]).load(url, function () {
								$($(this).attr('rel')).append($(this).html());
								jQueryLoaderPluginSettings.callbackEach($jQueryLoaderPluginLastItem);
								jQueryLoaderPluginMethods.show(l);
							});
                        break;
						case 'js':
							$.getScript(url, function () {
								jQueryLoaderPluginSettings.callbackEach($jQueryLoaderPluginLastItem);
								jQueryLoaderPluginMethods.show(l);
							});
                        break;
						case 'ajax':
							$.ajax({
								url: url,
								success: function () {
									jQueryLoaderPluginSettings.callbackEach($jQueryLoaderPluginLastItem);
									jQueryLoaderPluginMethods.show(l);
								}
							});
						break;
                    	default:
							delete l[el];
							jQueryLoaderPluginSettings.callbackEach($jQueryLoaderPluginLastItem);
							jQueryLoaderPluginMethods.show(l);
							return;
                        break
                    }
					
                    jQueryLoaderPluginMethods.update(l[el][0]);
                    delete l[el];
                    return;
                }
            }
			
			jQueryLoaderPluginSettings.callbackEnd();
            $('#' + i + 'loaderText').text(jQueryLoaderPluginSettings.ending_message);
            $('#' + i + 'loader').animate({
                width: '100%'
            }, 0, 'swing', function () {
                i = 'preLoadGUIBeta4';
                $('#' + i + 'loader, #' + i + ', #' + i + 'loaderText').fadeOut(jQueryLoaderPluginSettings.fadeOutSpeed)
            })
        },
		
        update: function (f) {
            i = 'preLoadGUIBeta4';
            ld = $('#' + i + 'loader').attr('loaded') * 1;
            t = $('#' + i + 'loader').attr('rel') * 1;
            msg = jQueryLoaderPluginSettings.message;
            msg = msg.replace(/(%f)|(%p)|(%c)|(%t)/g, function (m) {
                return (m == '%f') ? f : ((m == '%p') ? (Math.round(ld / t * 100)) : ((m == '%c') ? ld : t))
            });
            $('#' + i + 'loader').attr('loaded', (ld + 1)).css({
                width: (ld / t * 100) + '%'
            });
            $('#' + i + 'loaderText').html(msg)
        }
    };
	
    $.preLoadGUI = function (options) {
        if (typeof options === 'object')
            return jQueryLoaderPluginMethods.init(options);
        else
            $.error('Options must have at least load contents array on jQuery.preLoadGUI().');
    }
})(jQuery);
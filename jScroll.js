$.fn.jScroll = function(options,callback) {
	
	var scrollArea = {
			
		settings : {
			'scrollbarWidth' 	: 10,
			'scrollbarPadding'	: 2,
			'scrollbarColor' 	: 'invisible',
			'indicatorColor' 	: '#FFF',
			'scrollbarOpacity'	: '.8',
			'scrollbarMargin'	: 1,
			'scrollbarOverlay'	: false,
			'scrollbarShadow'	: true,
			'scrollbarHoverEft'	: true,
			'indicatorMinHeight': 20,
			'showBottom'		: false
		},
		
		setupListeners : function(d) {
			if (!d.i[0].addEventListener) {
				d.i[0].detachEvent('onmousewheel', function(e){scrollArea.mw(e,d);}, false);
				d.i[0].detachEvent('DOMMouseScroll', function(e){scrollArea.mw(e,d);}, false);
				d.i[0].attachEvent('onmousewheel', function(e){scrollArea.mw(e,d);}, false);
				d.i[0].attachEvent('DOMMouseScroll', function(e){scrollArea.mw(e,d);}, false);
			} else {
				d.i[0].removeEventListener('mousewheel', function(e){scrollArea.mw(e,d);}, false);
				d.i[0].removeEventListener('DOMMouseScroll', function(e){scrollArea.mw(e,d);}, false);
				d.i[0].addEventListener('mousewheel', function(e){scrollArea.mw(e,d);}, false);
				d.i[0].addEventListener('DOMMouseScroll', function(e){scrollArea.mw(e,d);}, false);
				d.i[0].addEventListener('MozMousePixelScroll', function(e){e.preventDefault();}, false);
			}
			d.ic.off('mousedown');
			d.ic.mousedown(function(e){
				d.i[0].onselectstart = function (){ return false; }
				e.preventDefault();
				scrollArea.icd(e,d);
			});
			$(document).off('mouseup');
			$(document).mouseup(function(){
				d.i[0].onselectstart = function (){ }
				scrollArea.icu(d);
			});
			d.sb.off('click');
			d.sb.click(function(e){
				if ( $(e.target).attr('data-scrollbar') !== undefined ) {
					if ( e.offsetY > d.ic.position().top )
					{
						d.pct = (d.ic.position().top + d.ich) / d.icmax;
					} else {
						d.pct = (d.ic.position().top - d.ich) / d.icmax;
					}
					scrollArea.pos(d);
				}
			});
			d.sb.off('hover');
			d.sb.hover(function(){
				d.sb.css({'background-color':'rgba(200,200,200,0)'});
				d.sb.animate({'background-color':'rgba(200,200,200,.5)'},200);
			},function(){
				d.sb.animate({'background-color':'rgba(200,200,200,0)'},200);
			});
		},
		
		icd : function(e,d) {
			$('body').css({ 'cursor' : 'pointer' });
			d.mstart = e.pageY;
			d.iccur = d.ic.position().top;
			$(document).mousemove(function(e){
				d.pct = (e.pageY - d.mstart + d.iccur) / d.icmax;
				scrollArea.pos(d);
			});
		},
		
		icu : function() {
			$('body').css({ 'cursor' : 'auto' });
			$(document).unbind('mousemove');
		},
		
		pos : function(d) {
			d.cnew = d.pct * d.cmax;
			d.icnew = d.pct * d.icmax;
			(d.cnew > d.cmin	? d.cnew 	= d.cmin	: d.cnew 	= d.cnew);
			(d.cnew	< d.cmax 	? d.cnew 	= d.cmax 	: d.cnew 	= d.cnew);
			(d.icnew < d.icmin 	? d.icnew 	= d.icmin 	: d.icnew 	= d.icnew);
			(d.icnew > d.icmax 	? d.icnew 	= d.icmax 	: d.icnew 	= d.icnew);
			d.c.css({ 'top' : d.cnew + 'px' });
			d.ic.css({ 'top' : d.icnew + 'px' });
		},
		
		updatePos : function(d) {
			d.cnew = d.pct * d.cmax;
			d.icnew = d.pct * d.icmax;
			(d.cnew > d.cmin	? d.cnew 	= d.cmin	: d.cnew 	= d.cnew);
			(d.cnew	< d.cmax 	? d.cnew 	= d.cmax 	: d.cnew 	= d.cnew);
			(d.icnew < d.icmin 	? d.icnew 	= d.icmin 	: d.icnew 	= d.icnew);
			(d.icnew > d.icmax 	? d.icnew 	= d.icmax 	: d.icnew 	= d.icnew);
			d.c.stop(false,true).animate({ 'top' : d.cnew + 'px' },{duration:300,easing:'easeOutExpo',queue:false});
			d.ic.stop(false,true).animate({ 'top' : d.icnew + 'px' },{duration:300,easing:'easeOutExpo',queue:false});
		},
		
		mw : function(e,d) {
			if(e.preventDefault){e.preventDefault();}else{e.returnValue = false;};
			wDelta = e.wheelDelta ? e.wheelDelta : -e.detail * 8;
			d.cnew = (d.c.position().top+(wDelta / Math.max((Math.abs(d.cmax) / 333),3)));
			d.pct = d.cnew / d.cmax;
			scrollArea.pos(d);
		},
		
		setupCss : function (d) {
			d.i.css({
				'position'	: 'absolute',
				'overflow'	: 'hidden'
			});
			d.sb.css({
				'position'		: 'absolute',
				'z-index'		: '2',
				'left'			: '100%',
				'height'		: '100%',
				'top'			: '0',
				'background'	: scrollArea.settings.scrollbarColor,
				'width'			: scrollArea.settings.scrollbarWidth+'px',
				'margin-left'	: '-'+scrollArea.settings.scrollbarWidth+'px',
				'-moz-opacity'	: scrollArea.settings.scrollbarOpacity,
				'-khtml-opacity': scrollArea.settings.scrollbarOpacity,
				'opacity'		: scrollArea.settings.scrollbarOpacity,
				'ms-filter'		: '"progid:DXImageTransform.Microsoft.Alpha(Opacity='+(scrollArea.settings.scrollbarOpacity * 100)+')"',
				'filter'		: '"alpha(opacity='+(scrollArea.settings.scrollbarOpacity * 100)+')"',
				'-webkit-border-radius' : (scrollArea.settings.scrollbarWidth / 2)+'px',
				'-moz-border-radius' : (scrollArea.settings.scrollbarWidth / 2)+'px',
				'border-radius'	: (scrollArea.settings.scrollbarWidth / 2)+'px'
			});
			if (scrollArea.settings.scrollbarShadow) {
				d.sb.css({
					'-webkit-box-shadow' : '0px 0px 1px #555 inset',
					'-moz-box-shadow' : '0px 0px 1px #555 inset',
					'box-shadow'	: '0px 0px 1px #555 inset'
				});
			}
			d.ic.css({
				'position'		: 'absolute',
				'z-index'		: '3',
				'left'			: scrollArea.settings.scrollbarPadding+'px',
				'top'			: scrollArea.settings.scrollbarPadding+'px',
				'height'		: '40px',
				'cursor'		: 'pointer',
				'background'	: scrollArea.settings.indicatorColor,
				'width'			: (scrollArea.settings.scrollbarWidth - (scrollArea.settings.scrollbarPadding * 2))+'px',
				'-webkit-border-radius' : ((scrollArea.settings.scrollbarWidth - (scrollArea.settings.scrollbarPadding * 2)) / 2)+'px',
				'-moz-border-radius' : ((scrollArea.settings.scrollbarWidth - (scrollArea.settings.scrollbarPadding * 2)) / 2)+'px',
				'border-radius'	: ((scrollArea.settings.scrollbarWidth - (scrollArea.settings.scrollbarPadding * 2)) / 2)+'px'
			});
			d.c.css({
				'position'	: 'absolute',
				'z-index'	: '1',
				'top'		: d.jPaddingTop+'px'
			});
			if ( scrollArea.settings.scrollbarOverlay )
			{
				d.c.css({
					'width' : d.i.width()+'px'
				});
			} else {
				d.c.css({
					'width'	: (d.i.width()-scrollArea.settings.scrollbarWidth-scrollArea.settings.scrollbarMargin)+'px'
				});
			}
			scrollArea.setupVars(d);
		},
		
		noNeed : function (d) {
			if ( d.c.outerHeight() < d.i.outerHeight() )
			{
				//console.log('no need for scroll');
				return true;
			}
		},
		
		setup : function (d) {
			
			d.i.wrapInner('<div data-content />');
			d.i.append('<div style="clear:both;"></div>');
				d.c = d.i.children('[data-content]');
				
				if ( scrollArea.noNeed(d) ) { return; }
				
				d.i.prepend('<div data-scrollbar><div data-indicator></div></div>');
				d.sb = d.i.children('[data-scrollbar]');
				d.ic = d.sb.children('[data-indicator]');
			d.ph = d.c.clone().prependTo(d.i).removeAttr('data-content').attr('data-ph','').addClass('invis').css({
				'opacity':'0',
				'-moz-opacity': '0',
				'-khtml-opacity': '0',
				'filter': 'alpha(opacity=0)',
				'-ms-filter':'progid:DXImageTransform.Microsoft.Alpha(Opacity=0)',
				'position':'relative',
				'z-index':'-1'
			});
			scrollArea.setupCss(d);
			return true;
			
		},
		
		setupVars : function (d) {
			
				d.h = d.i.height();
				d.cmax = 0-d.c.outerHeight()+d.h;
				
			if ( (scrollArea.settings.scrollbarMargin*2) > d.h ) {
				scrollArea.settings.scrollbarMargin = (d.h / 2) - 10;
			}
			
			h = d.sb.height()-(scrollArea.settings.scrollbarMargin*2);
			d.sb.css({
				'margin-top' : scrollArea.settings.scrollbarMargin+'px',
				'height' : h+'px'
			});
			
			d.cmin = d.jPaddingTop;
			d.icmin = parseInt(d.ic.css('top').replace(/[^-\d\.]/g, ''));
			
			d.ich = (d.h * d.sb.height()) / d.c.outerHeight();
			d.ich = (d.ich < scrollArea.settings.indicatorMinHeight) ? scrollArea.settings.indicatorMinHeight : d.ich;
			d.ic.css({
				'height' : d.ich+'px'
			});
			
			d.icmax = d.sb.height() - d.icmin - d.ic.outerHeight();
			
			scrollArea.setupListeners(d);
			
		}
		
	};
	
	if (typeof options == 'string') {
		options = $.parseJSON(options.replace(/\'/g,'\"'));
	}
	$.extend(true, scrollArea.settings, options);
	
	return this.each(function(){
	
		if ( $(this).data('init') != true ) {
			
			$(this).data('init', true);

			var d = {},h,w,nh;
			d.settings = scrollArea.settings;
			
			d.o = $(this);
			d.o.wrapInner('<div data-jScroll />');
			d.i = d.o.children('[data-jScroll]');
			d.o.css({
				'overflow':'hidden'
			});
			d.marginTop = d.o.parent().css('margin-top');
			if (d.marginTop=='auto') {d.marginTop = 0;}
			d.positionTop = d.o.position().top;
			if (d.o.parent().css('position') == 'static') {
				d.o.parent().css({'position':'relative'});
				d.positionTop = d.o.position().top;
				d.o.parent().css({'position':'static'});
			}
			h = d.o.parent().outerHeight()-d.positionTop+parseInt(d.marginTop);
			if (parseInt(d.o.css('height'))>0 && d.o.css('position')!='static') {
				h = parseInt(d.o.css('height'));
			}
			d.o.css({
				'width' : d.o.width()+'px',
				'height': h+'px'
			});
			if (!h) {
				h = d.o.innerHeight();
			}
			d.jPaddingTop = parseInt(d.i.css('padding-top').replace(/[^-\d\.]/g, ''));
			
			w = parseInt(d.i.css('padding-left').replace(/[^-\d\.]/g, '')) + parseInt(d.i.css('padding-right').replace(/[^-\d\.]/g, ''));
			w = d.o.width() - w;
			
			nh = d.jPaddingTop + parseInt(d.i.css('padding-bottom').replace(/[^-\d\.]/g, ''));
			nh = h - nh;
			
			d.i.css({
				'width':w+'px',
				'height':nh+'px'
			});
			
			
			if ( scrollArea.setup(d) ) {
				$(this).data('setup',true);
				if ( scrollArea.settings.showBottom ) {
					d.pct = 1;
					scrollArea.pos(d);
				}
			}
			
			$(this).data('d',d);
			d.o.trigger('jScrollComplete');
		
		} else {
			
			
			var d = $(this).data('d'),h,w,nh;
			scrollArea.settings = d.settings;
			if ( scrollArea.noNeed(d) ) { return; }
			
			if ( !$(this).data('setup') ) {
				if ( scrollArea.setup(d) ) {
					$(this).data('setup',true);
					if ( scrollArea.settings.showBottom ) {
						d.pct = 1;
						scrollArea.pos(d);
					}
				}
			}
			
			d.ph = $('[data-ph]');
			d.ph.html( d.c.html() );
			
			
			h = d.o.parent().outerHeight()-d.positionTop+parseInt(d.marginTop);
			if (parseInt(d.o.css('height'))>0 && d.o.css('position')!='static') {
				h = parseInt(d.o.css('height'));
			}
			d.i.css('height',h+'px');
			d.sb.css('height',parseInt(h-(scrollArea.settings.scrollbarMargin*2))+'px');
			d.h = d.i.height();
			d.ich = (d.h * d.sb.height()) / d.c.outerHeight();
			d.ich = (d.ich < scrollArea.settings.indicatorMinHeight) ? scrollArea.settings.indicatorMinHeight : d.ich;
			
			d.cmax = 0-d.c.outerHeight()+d.h;
			d.ic.stop(false,true).animate({
				'height' : d.ich+'px'
			},{
				duration: 200,
				easing: 'easeOutExpo',
				queue: false
			});
			d.icmax = d.sb.height() - d.icmin - d.ich;
			
			scrollArea.updatePos(d);
			scrollArea.setupListeners(d);
		
		}

	});
	
};
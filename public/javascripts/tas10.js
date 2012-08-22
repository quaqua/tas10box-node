var tas10 = {

	'userCan': function(obj, priv){
		return ($(obj) && $(obj).attr('data-privileges') && $(obj).attr('data-privileges').indexOf('w') > 0)
	},

	'cleanupCreateForms': function(){
		$('.create-form input[type=text]').val('');
	},

	'disabledContextMenuItems': {},

	'dashboard': function( action ){
		if( action === 'reload' ){
			$('#tas10-dashboard').load('/dashboard/reload', function(){
				tas10.dashboard('show');
			});
		} else if ( action === 'hide' ){
			$('#tas10-dashboard').fadeOut({easing: 'easeOutQuart'});
			$('#tas10-tab-container').fadeIn({easing: 'easeOutQuart'});
		} else if ( action === 'show' ){
			$('#tas10-tab-container').fadeOut({easing: 'easeOutQuart'});
			$('#tas10-dashboard').fadeIn({easing: 'easeOutQuart'});
		}

	},

	'ajaxLoad': function( elem ){
		var method = $(elem).attr('data-method') || 'get'
		  , data = null;
		if( $(elem).attr('data-method') !== 'get' )
			data = {_csrf: $('#_csrf').val()};
	  	$.ajax({ url: $(elem).attr('href'),
	  			 dataType: 'script',
	  			 type: method,
	  			 data: data
	  	});
	}

};

tas10['notify'] = function( msg, error ){
	if( error )
		$('#tas10-notifier').addClass('error');
	else
		$('#tas10-notifier').removeClass('error');
	$('#tas10-notifier .content').html(msg);
	$('#tas10-notifier').show().find('.wrapper').switchClass('low','high', 0).delay(2000).switchClass('high','low', 600, 'easeOutBack');
}

tas10['flash'] = function( flash ){
	if( flash.info.length > 0 )
		tas10.notify(flash.info[flash.info.length-1]);
	if( flash.error.length > 0 )
		tas10.notify(flash.error[flash.error.length-1],true);
}

tas10['loader'] = function( show ){
	if( show ){
		$('#tas10-logo').addClass('loading');
		$('#tas10-loader').show();
	} else {
		$('#tas10-loader').hide();
		$('#tas10-logo').removeClass('loading');
	}
}

tas10['confirm'] = function( msg, callback ){
	var really = confirm(msg);
	if( really )
		callback();
}

tas10['prompt'] = function( msg, text, callback ){
	var inputText = prompt(msg, text);
	if( inputText && inputText.length > 0 )
		callback( inputText );
	else
		tas10.notify( 'aborted' );
}

tas10['infoDialog'] = function(id){

	$.ajax({ url: '/document/'+id, dataType: 'json',
			 success: function( data ){
			 	tas10.dialog( 'new', $('#document-info-template').tmpl( data ),
			 		function( data ){
				 		//setupTBColorPicker();

						var hexDigits = new Array
						        ("0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"); 

						function rgb2hex(rgb) {
						 rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
						 return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
						}

						function hex(x) {
						  return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
						 }

				 		$('#tas10-dialog .color-chooser').bind('click', function(){
				 			var color = $(this).css('background-color');
				 			if( $(this).hasClass('reset') )
				 				color = '';
				 			else if( color )
				 				color = rgb2hex(color);
				 			$(this).closest('form').find('.'+$(this).attr('data-color-receiver')).val(color);
				 			$(this).closest('form').find('.color-chooser').removeClass('selected');
				 			$(this).addClass('selected');
				 			var elem = $('[data-id='+$(this).closest('.info-container').data('id')+']').find('.title');
				 			if( color === '' )
				 				$(elem).removeClass('item-color').css('background-color','');
				 			else
				 				$(elem).addClass('item-color').css('background-color', color);
				 			$(this).closest('form').submit();
				 		});
				 		$('#tas10-dialog abbr.timeago').timeago();	
	 					$('.strftime').strftime('%A, %d. %b %Y - %H:%M:%S');

	 					$('#tas10-dialog .info-title h1').tastenboxInlineEdit();
				 	}
				 );
			 }
	});

}

tas10['shareDialog'] = function(id){

	$.ajax({ url: '/document/'+id, dataType: 'json',
			 success: function( data ){
			 	tas10.dialog( 'new', $('#document-share-template').tmpl( data ),
			 		function( data ){
				 		setupTBColorPicker();
				 		$('#tas10-dialog abbr.timeago').timeago();	
	 					$('.strftime').strftime('%A, %d. %b %Y - %H:%M:%S');
				 	}
				 );
			 }
	});

}

tas10['dialog'] = function( action, text, callback ){

	if( action === 'close' ){
		$('#tas10-overlay').hide();
		$('#tas10-dialog').hide().html('');
		return;
	}

	$('#tas10-overlay').show();
	$('#tas10-dialog').show().html('<img src="/images/loading_50x50.gif" class="loading" />').center();

 	$('#tas10-dialog').html('<span class="ui-icon ui-icon-closethick float-right" onclick="$(\'#tas10-dialog\').hide(); $(\'#tas10-overlay\').hide();"></span>');
 	$('#tas10-dialog').append( text );

 	if( typeof( action ) === 'object' ){
 		var l = $(action).offset().left + ($(action).outerWidth() / 2 ) - ($('#tas10-dialog').outerWidth() / 2);
 		if( l < 10 )
 			l = 10;
 		var off = ( 375 - $('#tas10-dialog').outerWidth() ) / 2
 		  , bTop = $('<div class="border-top" />').css('backgroundPosition', '-'+(off + 10)+'px -4px');
		$('#tas10-dialog').css({ top: $(action).offset().top + $(action).outerHeight() + 20,
							 left: l, borderTop: 'none' }).prepend(bTop).find('.ui-icon-closethick').remove();
	} else
 		$('#tas10-dialog').center();

	$('.tas10-datepicker').datepicker({
		firstDay: 1,
		dateFormat: 'yy-mm-dd'
	});
	
 	if( typeof(callback) === 'function' )
 		callback();

}

tas10['getPath'] = function( elem ){
	var path = [{id: $(elem).data('id'), className: $(elem).attr('data-className'), name: $(elem).find('div.item-container:first .title').text()}];
	$(elem).parents('li.item').each( function( ){
		path.push({id: $(this).attr('data-id'), className: $(this).attr('data-className'), name: $(this).find('div.item-container:first .title').text()});
	});
	return path.reverse();
}

tas10['setPath'] = function( path, append ){

	var tbPathMarkup = "&nbsp;/&nbsp;<a href=\"/${className ? className.toLowerCase()+'s' : ''}/${id}\" data-remote=\"true\" class=\"item_${id}_title\">${name}</a>";
	var tbFindMarkup = "<span class=\"path-item item_${id}_title\" data-id=\"${id}\">${name}</span>";

	if( append && typeof(path) === 'object' ){
		$('#tas10-find .path').append( $.tmpl( tbFindMarkup, path ) );
		$('.tas10-current-tag').val(path.id);
		var labelVal = $('#tas10-find [name=label_ids]');
		$(labelVal).val( $(labelVal).val() + ($(labelVal).val().length > 0 ? ',' : '') + path.id );
		return;
	}

	$('.tas10-path').html('');
	if( path && path.length > 0 && 'id' in path[0] && path[0].id.length > 0 ){
		
		$('#tas10-find .path').html( $.tmpl( tbFindMarkup, path ) );
		for( var i in path )
			$('#tas10-find [name=label_ids]').val( path[i].id );


		$.tmpl( tbPathMarkup, path ).appendTo( '.tas10-path' );
		$('.tas10-current-tag').val(path[path.length-1].id);
	} else{
		$('.tas10-current-tag').val('');
		$('#tas10-find .path').html( $.tmpl( tbFindMarkup, path ) );
		$('#tas10-find [name=label_ids]').val( '' );
	}

}
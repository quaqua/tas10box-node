$( function(){

	$.i18n.init({ fallbackLng: 'en', useLocalStorage: false }, function(t){} );

	$('.js-get-focus:last').focus();
	$('.live-tipsy').tipsy({live: true});
	$('.live-tipsy-e').tipsy({live: true, gravity: 'e'});
	$('.live-tipsy-w').tipsy({live: true, gravity: 'w'});

	$('.tas10-checkbox').live('click', function(e){
		$(this).toggleClass('checked');
	});
	$('.tas10-checkbox-label').live('click', function(e){
		$(this).prev('.tas10-checkbox').toggleClass('checked');
	});


	$('input.tas10-current-tag').val('');
	$('#tas10-tab-container').tas10Container();

	function hideAjaxLoader(e){
		$('.ajax-loading').each(function(){
			$(this).html($(this).data('orig')).removeClass('ajax-loading').attr('disabled',false);
		});
	  	$('.tab-close').removeClass('loading');
	}

	function setupAjaxHelpers(){
	  
	  $(document).bind("ajaxSend", function(e, req){
	  	var elem = e.currentTarget.activeElement;
	  	if( $('.tab.active').length )
	  		$('.tab.active').find('.tab-close').addClass('loading');
	    tas10.loader(true);
	    $('.want-to-load-ajax').each(function(){
	      $(this).removeClass('want-to-load-ajax').attr('disabled',true).addClass('ajax-loading').data('orig',$(this).html()).html('<img src="/assets/loading-small.gif" />');
	    });
	  }).bind("ajaxComplete", function(e, req){
	    hideAjaxLoader(e);
	    tas10.loader(false);
	  }).bind("ajaxError", function(e, xhr){
	    hideAjaxLoader(e);
	    if( xhr.status === 0 )
			tas10.notify('You are offline!!\n Please Check Your Network.', true);
	    else if( xhr.status in [401,403] )
	    	location = '/login';
	    //else if( xhr.status === 404 )
	    //  tas10.notify('Destination target could not be found', true);
	    else if( xhr.status === 500 )
	      tas10.notify('Unexpected server error - We have been notified!', true);
	    else if( e === 'parsererror' )
			  tas10.notify('Error.\nParsing JSON Request failed.', true);
	    else if( e === 'timeout' )
			  tas10.notify('Request Time out.', true);
	  });
	  $('.ajax-button').live('click', function(){
	    $(this).addClass('want-to-load-ajax');
	  });

	  $('form[data-remote=true]').live('submit', function(e){
	  	e.preventDefault();
	  	$.ajax({ url: $(this).attr('action'),
	  			 dataType: 'script',
	  			 data: $(this).serializeArray(),
	  			 type: $(this).attr('method') });
	  });

	  $('a[data-remote=true]').live('click', function(e){
	  	e.preventDefault();
	  	var elem = this;
	  	if( $(this).attr('data-confirm') )
	  		tas10.confirm( $(elem).attr('data-confirm'), function(){
	  			tas10.ajaxLoad( elem );
		  });
	  	else
	  		tas10.ajaxLoad( this );
	  })

	}

	setupAjaxHelpers();

	$(document).bind('click', function(e){
		$('.tipsy').remove();
		if( $(e.target).attr('id') === 'tas10-overlay' && $('#tas10-dialog').is(':visible') ){
			$('#tas10-dialog').hide();
			$('#tas10-overlay').hide();
		}
	}).bind('keydown', function(e){
	    // ESC
	    if ( e.keyCode === 27 ){
	    	if( $('#tas10-dialog').is(':visible') )
	      		tas10.dialog('close');
	      	else if( $('#tas10-find .label-res').length )
	      		$('#tas10-find .label-res').remove();
	    	else if( $('.selected-item').length ){
	      		$('.selected-item').removeClass('selected-item');
	      		tas10.setPath([]);
	      	}
	    }
	});

	// if ($.browser.webkit) {
 	//   $('.login-container input').attr('autocomplete', 'off');

});
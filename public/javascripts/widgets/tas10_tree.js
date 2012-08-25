/*
 * tas10tree tas10box plugin (client side)
 */

tas10.getTemplate = function getTemplate( doc ){
	var name = '#'+doc.className.toLowerCase()+'-tree-item-template';
	if( $(name).length )
		return name;
	else
		return '#default-tree-item-template';
};

(function( jQuery ){

	var loadTreeItemTaggers = function loadTreeItemTaggers( handle, li, id, callback ){
		$.getJSON('/labels/' + id + '/taggers?taggable=true', function(data){
					if( data && data.length > 0 ){
						$(li).append('<ul class="taggers" style="padding-left: 16px"></ul>');
						$( tas10.getTemplate( data[i] )).render( data );
						$(handle).addClass('open ui-icon-triangle-1-s').removeClass('ui-icon-triangle-1-e');
			    	} else 
			    		$(handle).die('click')
			    				 .removeClass('opener')
								 .removeClass('ui-icon-triangle-1-e')
								 .removeClass('ui-icon')
								 .addClass('spacer');
					$(handle).removeClass('loading');
					$(li).addClass('loaded');
					if( callback )
						callback();
		});
	}

	var setupTas10TreeEvents = function(treeItem){

		// children
		$(treeItem).find('.opener').die('click').live('click', function(){
			var handle = this
			  , li = $(this).closest('li')
			  , id = $(li).attr('data-id');
			if( $(this).hasClass('open') ){
				$(this).removeClass('open').addClass('ui-icon-triangle-1-e').removeClass('ui-icon-triangle-1-s');
				$(li).find('ul.taggers:first').hide();
			} else if( $(li).hasClass('loaded') ){
				$(li).find('ul.taggers:first').show();
				$(handle).addClass('ui-icon-triangle-1-s open').removeClass('ui-icon-triangle-1-e');
			} else {
				loadTreeItemTaggers(handle, li, id);
			}
		})

		// item functions
		$(treeItem).find('li').live('click', function(e){

			var self = this;
			var actionContainer = $(this).closest('.action-container');

			if( $(e.target).hasClass('opener') )
				return;

			if( e.target.nodeName === 'A' )
				$('.selected-item').removeClass('selected').removeClass('selected-item');

			
			if( $(this).hasClass('selected-item') ){
				$(this).removeClass('selected-item');
				tas10.setPath();
			} else {
				$(this).addClass('selected-item');
				tas10.setPath(tas10.getPath(this));
			}

			if( $(actionContainer).find('.selected-item').length > 1 ){
				$(actionContainer).find('.browser-actions .single').addClass('disabled');
				$(actionContainer).find('.browser-actions .multi').removeClass('disabled');
			} else if( $(actionContainer).find('.selected-item').length === 1 ){
				$(actionContainer).find('.browser-actions .single').removeClass('disabled');
				$(actionContainer).find('.browser-actions .multi').each(function(){
					if( !$(this).hasClass('single') )
						$(this).addClass('disabled');
				})
			} else
				$(actionContainer).find('.browser-actions a').addClass('disabled');
			if( typeof(tas10.clipboardStore) === 'undefined' || tas10.clipboardStore.length == 0 )
				$(actionContainer).find('.paste').addClass('disabled');

			if( e.target.nodeName !== 'A' )
				e.stopPropagation();

		});

	};

	var tbTreeMethods = {
	    init : function( options ) {

	      if( $(this).hasClass('tas10-tree-obj') || !$(this).is('ul') )
	        return;

	      var settings = { url: ($(this).attr('data-url') || null), page: 1, pageCount: 30 };
	      if ( typeof(options) != 'undefined' ) {
	        $.extend( settings, options );
	      }
	      $(this).data('settings', settings);

	      $(this).addClass('tas10-tree-obj');
	      $(this).css('height', $(this).closest('#tas10-left-panel').height()-50);

	      setupTas10TreeEvents( this );

	    },
	    reload : function() {
	    	var self = this;
			$.getJSON( $(self).data('settings').url, function( data ){
				if( 'items' in data )
					data = data['items'];
				if( data.length > 0 )
					$(self).append( $( tas10.getTemplate( data[0] )).render( data ) );
			});
	    },
	    append : function( doc ) {
	    	console.log('call');
	    	var self = this;
	    	if( doc.tags.length > 0 )
	    		for( var i in doc.tags){
	    			var li = $('.tas10-tree li[data-id='+doc.tags[i]+']');
	    			if( $(li).find('ul.taggers').length ){
	    				if( !$(li).find('.opener').hasClass('open') )
	    					$(li).find('.opener').click();
	    				if( ! $(li).find('ul.taggers li[data-id='+doc._id+']').length )
	    					$(li).find('.ul.taggers').prepend( $( tas10.getTemplate( doc )).render( doc ) );
	    				$(li).find('li[data-id='+doc._id+']').effect('highlight', {color: '#fc6'}, 2000);
	    			} else
	    				loadTreeItemTaggers( $(li).find('.opener'), li, doc.tags[i], function(){
	    					$(li).find('li[data-id='+doc._id+']').effect('highlight', {color: '#fc6'}, 2000);	
	    				});
	    		}
	    	else
	    		$(this).prepend( $( tas10.getTemplate( doc )).render( doc ) );
	    },
	    unselectAll: function(){
	    	$('.selected-item').removeClass('selected-item');
			tas10.setPath([]);
	    },
	    select: function( itemId ){
	    	var item = $('.tas10-tree:visible li[data-id='+itemId+']:first');
			if( !$(item).length )
				return;
	    	$('.selected-item').removeClass('selected-item');
			$(item).addClass('selected-item');
			tas10.setPath(tas10.getPath(item));
	    }

	  };

	  jQuery.fn.tas10Tree = function( method ) {

	    if ( tbTreeMethods[method] ) {
	      return tbTreeMethods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
	    } else if ( typeof method === 'object' || ! method ) {
	      tbTreeMethods.init.apply( this, arguments );
	      return tbTreeMethods.reload.apply( this );
	    } else {
	      $.error( 'Method ' +  method + ' does not exist on jQuery.tas10Tree' );
	    }
  	};

})( jQuery );

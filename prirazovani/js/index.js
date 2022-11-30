$(document).ready(function() {
			
	$('.nodrag').on('dragstart', function(){
		return false;
	});
	
	var lang = getGet('lang');

	if(!lang) lang = 'cz';
	
	$('.lang.' + lang).show();
	
	$('a').each(function(){
		var href = $(this).attr('href');
		if(href.indexOf("?lang=") == -1){
			href =  href + '?lang=' + lang;
		}
		$(this).attr('href', href);
	});
	
	var zIndex = 1;
	
	var count = $( 'ul.circles#start li img' ).length;
	
	$('#base').on('dragstart', function(){return false;});

    $( 'ul.circles#start li img' ).draggable({
    	//revert: 'invalid',
    	start: function(){
    		var obj = $(this);
    		obj.css({
    			'z-index': zIndex
    		});
    		zIndex++;
    		$( 'ul#text li.active').removeClass('active');
    		$( 'ul#text li.' + obj.closest('li').attr('class')).addClass('active');
    		obj_drop = $( 'ul.circles#finish li.' + obj.closest('li').attr('class') + ' p');
    		obj_drop.droppable({
    		  tolerance: 'pointer',
		      drop: function( event, ui ) {
		         obj.draggable('disable').css({top: 0,left: 0}).appendTo(this);
		         if($('ul.circles#finish li img').length == count){
		         	$('.content').addClass('done');
		         }
		      }
		    });
    	},
    	stop: function(){
    		var obj = $(this);
    		$( 'ul.circles#finish li.' + $(this).closest('li').attr('class') + ' p').droppable('destroy');
    	}
    });
    
}); 

function getGet(variable){
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}
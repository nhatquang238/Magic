$(function(){
	var deck = [];
	var socket;

	//fix css
	var battlefieldHeight = $(window).height() - $('.navbar').height() - 20 + 'px'
	$('.battlefield').css('height', battlefieldHeight);

	$('form').submit(function(e){
		e.preventDefault();
		$('.navbar-search').append('<i class="icon-spinner icon-spin"></i>')
		$.ajax({
			url:'/card/'+$('.card-name').val(),
			type:'POST',
			success: function(data){
				console.log(data);
				$('.icon-spinner').remove();
				$('<img id="'+$.now()+'" class="card" src='+data.image_url+'></img>').appendTo('.battlefield').draggable({containment:'.battlefield'})
				deck.push(data);
			}
		})
	})

	//show deck
	$('.deck a').click(function(e){
		e.preventDefault();
		$('.modal-alert h3').html('Deck');
		$.each(deck, function(i, card){
			$('.modal-alert p').append(card.name+'<br>');			
		})
		$('.modal-alert').modal('show');
	})

	//socket.io
	$('#make-game').click(function(e){
		e.preventDefault();
		socket = io.connect();

		socket.on('connect', function(){
			$('.modal-alert h3').html('Time to Duel');
			$('.modal-alert p').append('test');			
			$('.modal-alert').modal('show');			
		})

		socket.on('dragcards', function(card_id, top, left){
			$('#'+card_id).css({top:top, left:left});
			console.log(card_id);
		});

		//event triggers & handlers
		$(document).on('drag', '.card', function(e,ui){
			console.log('test');
			socket.emit('dragcard', $(this).attr('id'), ui.position.top, ui.position.left);
		})
	})
})
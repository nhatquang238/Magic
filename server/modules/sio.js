//socket.io established. waiting for incoming events. 
//use session.socket.io for session support
//pending changes to export
var ObjectID = require('mongodb').ObjectID;

module.exports = function(sessionSockets, io){
	var history = {};	
	sessionSockets.on('connection',function (err, socket, session){
		if(session !== undefined){
			var room = session.user.p;
			history[room] = history[room] === undefined ? [] : history[room];
			var username = session.user.name;
			var color = session.user.color;
			var msg_s;

			socket.on('newuser',function(){
				socket.join(room);
				socket.emit('history', history[room]);
				socket.broadcast.to(room).emit('message', username + ' has logged');
			});

			socket.on('type', function(){
				socket.broadcast.to(room).emit('typing', username);
			})
			
			socket.on('nottype',function(){
				socket.broadcast.to(room).emit('nottyping');
			})

			socket.on('chatsend', function(msg){
				if(msg != ''){
					var msg_s = sanitize(sanitize(msg).xss()).entityEncode();
					io.sockets.in(room).emit('chatupdate', username, msg_s, color);
					history[room].push({u:username, m: msg_s, c: color});
					//only store last 100 messages in the room
					history[room] = history[room].slice(-1000);
				}
			});

			socket.on('updates',function(){
				io.sockets.in(room).emit('lastupdate', 'Last updated by '+ username); 
			});
			
			socket.on('newnode',function(pic){
				if(pic){
					io.sockets.in(room).emit('getnode',new ObjectID(),username, pic);
				}else{
					io.sockets.in(room).emit('getnode',new ObjectID(),username);
				}
			});
			
			socket.on('movecursor',function(id, x, y){
				socket.broadcast.to(room).emit('movingcursor', id, x, y);
			});
			
			socket.on('dragcard', function(card_id, top, left){
				socket.broadcast.to(room).emit('dragcard', card_id, top, left);
			});
			
			socket.on('sendtofront', function(zindexCounter, node_id){
				socket.broadcast.to(room).emit('sendtofronts', zindexCounter, node_id);
			});
			
			socket.on('disconnect', function(){
				//Proceed to delete user info in global user object
				socket.broadcast.to(room).emit('userleft', username);
			});
		}
	});	

}


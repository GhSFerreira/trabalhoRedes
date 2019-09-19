const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');
const exec = require('child_process').exec;


function runCommand(cmds, cb){
	const next = cmds.shift();
	if (!next) return cb();
	exec(next, {
		cwd: __dirname
	}, (err, stdout, stderr) => {
		console.log(stdout);
		if (err && !next.match(/\-s$/)) {
			console.log(`O commando "${next}" falhou.`, err);
			cb(err);
		}
		else runCommand(cmds, cb);
	});
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', function(socket){
    socket.on('chat message', function(time){
        runCommand([`date +%T -s "${time}" `], err => {
            console.log(`Hora alterada -> ${time}`);
        });
    });
  });

http.listen('3000', function() {
    console.log('Server running on port 3000');
})

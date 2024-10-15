const express = require('express');
const bodyParser = require('body-parser');
const db = require('./modulos/mysql');
const session = require('express-session');
var cors = require('cors')

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())

const LISTEN_PORT = 4000;
const server = app.listen(LISTEN_PORT, () => {
	console.log(`Servidor NodeJS corriendo en http://localhost:${LISTEN_PORT}/`);
});;

const io = require('socket.io')(server, {
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST", "PUT", "DELETE"],
		credentials: true
	}
});

const sessionMiddleware = session({
	secret: "ositos",
	resave: false,
	saveUninitialized: false
});

app.use(sessionMiddleware);

io.use((socket, next) => {
	sessionMiddleware(socket.request, {}, next);
});

app.post('/crear-sala', (req, res) => {
	const { nombre } = req.body;
	const query = 'INSERT INTO salas (nombre) VALUES (?)';
  
	db.query(query, [nombre], (err, result) => {
	  if (err) {
		console.error('Error al crear sala:', err);
		return res.status(500).send('Error al crear la sala');
	  }
	  res.status(201).json({ id: result.insertId, nombre });
	});
  });
  
  app.post('/unirse-sala', (req, res) => {
	const { usuario_nombre, sala_id } = req.body;
	const query = 'INSERT INTO usuarios_salas (usuario_nombre, sala_id) VALUES (?, ?)';
  
	db.query(query, [usuario_nombre, sala_id], (err, result) => {
	  if (err) {
		console.error('Error al unirse a la sala:', err);
		return res.status(500).send('Error al unirse a la sala');
	  }
	  res.status(200).json({ usuario_nombre, sala_id });
	});
  });
  

  io.on('connection', (socket) => {
	console.log('Un usuario se ha conectado:', socket.id);
  
	socket.on('joinRoom', (roomId, username) => {
	  console.log(`${username} se unió a la sala ${roomId}`);
	  socket.join(roomId);  
  
	  socket.to(roomId).emit('message', `${username} se ha unido a la sala.`);
	});
  
	socket.on('sendMessage', (roomId, message, username) => {
	  console.log(`Mensaje de ${username} en la sala ${roomId}: ${message}`);
	  io.to(roomId).emit('message', `${username}: ${message}`);
	});
  
	socket.on('disconnect', () => {
	  console.log('Un usuario se ha desconectado:', socket.id);
	});
  });
  
  
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
	console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
  

app.get('/', (req, res) => {
	console.log(`[REQUEST - ${req.method}] ${req.url}`);
});

app.post('/login', (req, res) => {
	console.log(`[REQUEST - ${req.method}] ${req.url}`);
});

app.delete('/login', (req, res) => {
	console.log(`[REQUEST - ${req.method}] ${req.url}`);
	res.send(null);
});

io.on("connection", (socket) => {
	const req = socket.request;

	socket.on('joinRoom', data => {
		console.log("🚀 ~ io.on ~ req.session.room:", req.session.room)
		if (req.session.room != undefined && req.session.room.length > 0)
			socket.leave(req.session.room);
		req.session.room = data.room;
		socket.join(req.session.room);

		io.to(req.session.room).emit('chat-messages', { user: req.session.user, room: req.session.room });
	});

	socket.on('pingAll', data => {
		console.log("PING ALL: ", data);
		io.emit('pingAll', { event: "Ping to all", message: data });
	});

	socket.on('sendMessage', data => {
		io.to(req.session.room).emit('newMessage', { room: req.session.room, message: data });
	});

	socket.on('disconnect', () => {
		console.log("Disconnect");
	})
});
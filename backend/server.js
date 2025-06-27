const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const Document = require('./Document');
const connectDB = require('./db');
require("dotenv").config();

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Connect to MongoDB
connectDB();

io.on('connection', socket => {
  console.log('✅ New client connected');

  socket.on('get-document', async documentId => {
    const document = await findOrCreateDocument(documentId);
    socket.join(documentId);
    socket.emit('load-document', document.data);

    socket.on('send-changes', delta => {
      socket.broadcast.to(documentId).emit('receive-changes', delta);
    });

    socket.on('save-document', async data => {
      await Document.findByIdAndUpdate(documentId, { data });
    });
  });
});

const findOrCreateDocument = async id => {
  if (!id) return;

  const document = await Document.findById(id);
  if (document) return document;

  return await Document.create({ _id: id, data: '' });
};

const PORT = 5001;
server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
const path = require("path");

app.use(express.static(path.join(__dirname, "../frontend-fixed/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend-fixed/build/index.html"));
});

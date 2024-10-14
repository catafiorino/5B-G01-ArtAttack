"use client";
import React, { useState } from 'react';

const GameRoom = () => {
  const [gameCode, setGameCode] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [gameCode2, setGameCode2] = useState('');
  const validCodes = ['ABC123', 'DEF456']; 

  const handleJoinGame = (event) => {
    event.preventDefault();
    if (validCodes.includes(gameCode)) {
      console.log('Unido a la sala con código:', gameCode);
      setError('');
    } else {
      setMessage('');
    }
  };

  const handleCreateGame = (event) => {
    event.preventDefault();
    if (gameCode2) {
      console.log('Juego creado');
      setGameCode2('');
      setError('');
    } else {
      setError('Por favor, ingrese un nombre y un código para el juego.');
    }
  };

  return (
    <div>
      <h2>Unirse a un Juego</h2>
      <form onSubmit={handleJoinGame}>
        <label htmlFor="gameCode">Código del Juego</label>
        <input
          type="text"
          id="gameCode"
          value={gameCode}
          onChange={(e) => {
            setGameCode(e.target.value);
            setError('');
          }}
          required
        />
        <button type="submit">Unirse</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>

      <h2>Crear un Juego</h2>
      <form onSubmit={handleCreateGame}>
        <label htmlFor="newGameCode">Código del Juego</label>
        <input
          type="text"
          id="newGameCode"
          value={gameCode2}
          onChange={(e) => {
            setGameCode2(e.target.value);
            setError('');
          }}
          required
        />
        <button type="submit">Crear Juego</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {message && <p style={{ color: 'green' }}>{message}</p>}
      </form>
    </div>
  );
};

export default GameRoom;

"use client";
import React, { useState, useEffect } from 'react';

const GameRoom = () => {
  const [gameCode, setGameCode] = useState('');
  const [error, setError] = useState('');
  const [gameCode2, setGameCode2] = useState('');
  const [validCodes, setValidCodes] = useState([]); 

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch('http://localhost:4000/entrarSala');
        const data = await response.json();
        const codes = data.map(room => room.codigo);
        setValidCodes(codes);
      } catch (err) {
        console.error('Error fetching rooms:', err);
      }
    };
    fetchRooms();
  }, []);

  const handleJoinGame = async (event) => {
    event.preventDefault();
    if (validCodes.includes(gameCode)) {
      console.log('Unido a la sala con código:', gameCode);
      setError('');
    } else {
      setError('Código del juego no válido.');
    }
  };

  const handleCreateGame = async (event) => {
    event.preventDefault();
    if (gameCode2) {
      try {
        const response = await fetch('http://localhost:4000/crearSala', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ codigo: gameCode2, cantidad_personas: 4 }), 
        });

        if (!response.ok) {
          throw new Error('Error al crear la sala');
        }
        setGameCode2('');
        setError('');
      } catch (err) {
        setError('Error al crear la sala.');
        console.error('Error:', err);
      }
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
      
      </form>
    </div>
  );
};

export default GameRoom;

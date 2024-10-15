"use client";
import React, { useState, useEffect } from 'react';

const GameRoom = () => {
  const [gameCode, setGameCode] = useState('');
  const [error, setError] = useState('');
  const [validCodes, setValidCodes] = useState([]);
  const [newGameCode, setNewGameCode] = useState('');
  const [maxPlayers, setMaxPlayers] = useState('');

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

    if (validCodes.includes(newGameCode)) {
      setError('El código de la sala ya existe. Por favor, elige otro.');
      return;
    }

    if (maxPlayers <= 1) {
      setError('El número máximo de jugadores debe ser mayor que 1.');
      return;
    }

    if (newGameCode && maxPlayers) {
      try {
        const response = await fetch('http://localhost:4000/crearSala', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ codigo: newGameCode, cantidad_personas: parseInt(maxPlayers) }),
        });

        if (!response.ok) {
          throw new Error('Error al crear la sala');
        }
        setNewGameCode('');
        setMaxPlayers('');
        document.getElementById('createGameModal').close(); 
        setError('');
      } catch (err) {
        setError('Error al crear la sala.');
        console.error('Error:', err);
      }
    } else {
      setError('Por favor, ingrese un código y un número de jugadores.');
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
      <button onClick={() => document.getElementById('createGameModal').showModal()}>Abrir Modal para Crear Juego</button>

      <dialog id="createGameModal">
        <h3>Crear Juego</h3>
        <form onSubmit={handleCreateGame}>
          <label htmlFor="newGameCode">Código del Juego</label>
          <input
            type="text"
            id="newGameCode"
            value={newGameCode}
            onChange={(e) => {
              setNewGameCode(e.target.value);
              setError('');
            }}
            required
          />
          <label htmlFor="maxPlayers">Máx. Jugadores</label>
          <input
            type="number"
            id="maxPlayers"
            value={maxPlayers}
            onChange={(e) => {
              setMaxPlayers(e.target.value);
              setError('');
            }}
            required
          />
          <button type="submit">Crear Juego</button>
          <button type="button" onClick={() => document.getElementById('createGameModal').close()}>Cancelar</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </dialog>
    </div>
  );
};

export default GameRoom;

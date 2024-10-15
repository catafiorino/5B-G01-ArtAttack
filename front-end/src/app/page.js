import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const [nombreSala, setNombreSala] = useState('');
  const [usuarioNombre, setUsuarioNombre] = useState('');
  const router = useRouter();

  const crearSala = async () => {
    const res = await fetch('http://localhost:4000/crear-sala', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: nombreSala }),
    });
    const data = await res.json();
    console.log('Sala creada:', data);
    router.push(`/chat/${data.id}`);
  };

  const unirseSala = async () => {
    const res = await fetch('http://localhost:4000/unirse-sala', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario_nombre: usuarioNombre, sala_id: nombreSala }),
    });
    const data = await res.json();
    console.log('Unido a la sala:', data);
    router.push(`/chat/${data.sala_id}`);
  };

  return (
    <div>
      <h1>Chat App</h1>
      <input
        type="text"
        placeholder="Nombre de la sala"
        value={nombreSala}
        onChange={(e) => setNombreSala(e.target.value)}
      />
      <input
        type="text"
        placeholder="Tu nombre"
        value={usuarioNombre}
        onChange={(e) => setUsuarioNombre(e.target.value)}
      />
      <button onClick={crearSala}>Crear Sala</button>
      <button onClick={unirseSala}>Unirse a Sala</button>
    </div>
  );
}

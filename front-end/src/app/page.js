"use client";
import { useState } from "react";
import Button from "./components/button";
import Link from "next/link";

export default function Home() {
  const [number, setNumber] = useState(0)


  async function traerNumeros() {
    const data = {
      number: number
    }
    console.log({data})
    const response = await fetch('http://localhost:4000/cualquierCosa', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    });

    return response.json()
  }

  async function chats() {

    var response = await traerNumeros();
    
    if (response != 0) {
       let num = response.data
      console.log(num)
       localStorage.setItem("num", `${num}`)
      return location.href = '/chats'
    }
    else {
      alert("no existe")
    }}

    return (
      <div>
        <form>
          <label>Ingrese su número de teléfono:</label>
          <input type="number" onChange={(event) => setNumber(event.target.value)} />
          <Button text="Iniciar sesión" onClick={chats} />
        </form>
      </div>
    );
  }
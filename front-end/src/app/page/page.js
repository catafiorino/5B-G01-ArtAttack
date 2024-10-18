"use client"
import PizarronCanvas from "../Components/Pizarron"
 export default function  Home(){
    return(
        <main className="flex min-h-screen flex-col items-center p-12">
            <h1 className="text-4x1 font-bold mb-8"> Pizarron </h1>
            <PizarronCanvas />
        </main>
    )
 }
 
"use client"
import React from "react";
import React, { useRef, useEffect, useState} from "react";
export default function PizarronCanvas(){
    const canvasRef = useRef(null);
    const [context, setContext] = useState (null);
    const [dibujar, setDibujar] = useState (false);
    const [currentColor, setCurrentColor] = useState("black");
    const [lineWidth, setLineWidth] = useState(3);
    const [accionesDibujar, setAccionesDibujar] = useState([]);
    const [currentPath, setCurrentPath] = useState([]);
    const [currentStyle, setCurrentStyle] = useState({color: "black", lineWidth: 3});
    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            canvas.width = 900;
            canvas.height = 500;
            const ctx = canvas.getContext("2d")
            setContext(ctx);
            reDrawPreviousData(ctx); 
        }
    }, []);
    const empezarDibujar = (e) => {
        if (context){
            context.beginPath();
            context.moveTo(e.nativeEvent.offSetx, e.nativeEvent.offSety);
            setDibujar(true);
        }
    };
    const dibuja = (e) => {
        if (!dibujar) return;
        if (context){
            context.strokeStyle = currentStyle.color;
            context.lineWidth = currentStyle.lineWidth;
            context.lineto(e.nativeEvent.offSetx, e.nativeEvent.offSety);
            context.stroke();
            setCurrentPath ([...currentPath, {x: e.nativeEvent.offSetx, y: e.nativeEvent.offSety}])

        }
    };
    const terminarDibujar = () => {
        setDibujar(false);
        context && context.closePath();
        if (currentPath.length > 0){
            setAccionesDibujar([...accionesDibujar, {path: currentPath, style: currentStyle}]); 
        }
        setCurrentPath([]);
    }
    const changeColor =(color) => {
        setCurrentColor(color);
        setCurrentStyle({...currentStyle, color});
    };
    const changeWidth = (width) => {
        setLineWidth(width);
        setCurrentStyle({...currentStyle, lineWidth:width});
    };
}
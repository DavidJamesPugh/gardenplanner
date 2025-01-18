import React, { useState, useRef, useEffect } from 'react';

const GardenCanvas = () => {
  const canvasRef = useRef(null);
  const [points, setPoints] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [startPoint, setStartPoint] = useState(null);

  // Drawing and canvas related variables
  const canvasSize = 500;  // Adjust the canvas size if needed
  const gridSize = 10;

  // Drawing functions
  const drawGrid = (ctx) => {
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 1;
    for (let x = 0; x <= canvasSize; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvasSize);
      ctx.stroke();
    }
    for (let y = 0; y <= canvasSize; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvasSize, y);
      ctx.stroke();
    }
  };

  const drawGarden = (ctx) => {
    if (points.length < 1) return;

    ctx.strokeStyle = 'green';
    ctx.lineWidth = 2;

    // Draw all garden lines except for the last one (from last to mouse)
    for (let i = 1; i < points.length; i++) {
      ctx.beginPath();
      ctx.moveTo(points[i - 1].x, points[i - 1].y);
      ctx.lineTo(points[i].x, points[i].y);
      ctx.stroke();
    }

    // Draw line from last point to current mouse position (if garden is not finished)
    if (points.length > 0 && !isFinished) {
      ctx.beginPath();
      ctx.moveTo(points[points.length - 1].x, points[points.length - 1].y);
      ctx.lineTo(mousePosition.x, mousePosition.y);
      ctx.stroke();
    }

    // Draw final line to close the garden (if finished)
    if (isFinished && points.length > 1) {
      ctx.beginPath();
      ctx.moveTo(points[points.length - 1].x, points[points.length - 1].y);
      ctx.lineTo(points[0].x, points[0].y);
      ctx.stroke();
    }
  };

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Mouse move event to track the current mouse position
  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Click event to add points or finish garden
  const handleClick = (e) => {
    if (isFinished) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const newPoint = {
      x: Math.round((e.clientX - rect.left) / gridSize) * gridSize,
      y: Math.round((e.clientY - rect.top) / gridSize) * gridSize,
    };

    if (startPoint && newPoint.x === startPoint.x && newPoint.y === startPoint.y) {
      setIsFinished(true);
    } else {
      if (!startPoint) setStartPoint(newPoint);
      setPoints([...points, newPoint]);
    }
  };

  const handleReset = () => {
    setPoints([]);
    setIsFinished(false);
    setStartPoint(null);
  };

  const handleHappy = () => {
    console.log("Garden Measurements: ", points);
  };

  // Draw on canvas when points change
  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    drawGrid(ctx);
    drawGarden(ctx);
  }, [points, mousePosition, isFinished]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={canvasSize}
        height={canvasSize}
        style={{ border: '1px solid black' }}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
      />
      {isFinished && (
        <div>
          <button onClick={handleHappy}>Happy?</button>
          <button onClick={handleReset}>Reset</button>
        </div>
      )}
    </div>
  );
};

export default GardenCanvas;

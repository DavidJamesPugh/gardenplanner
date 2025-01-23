import React, { useRef, useState, useEffect } from "react";

const GardenCanvas = ({ longestLine }) => {
  const canvasRef = useRef(null);
  const [points, setPoints] = useState([]); // Points drawn by the user
  const [isFinished, setIsFinished] = useState(false); // Track if the garden shape is completed
  const [mousePosition, setMousePosition] = useState(null); // Track the mouse position

  const canvasSize = 300; // Canvas size in pixels
  const gridSize = 125 / longestLine; // Grid size based on the longestLine in meters
  const threshold = gridSize / 2; // Threshold for snapping to the starting point

  const snapToGrid = (coordinate) => {
    return Math.round(coordinate / gridSize) * gridSize;
  };

  const isNearFirstPoint = (currentPoint) => {
    if (points.length === 0) return false;
    const firstPoint = points[0];
    const distance = Math.sqrt(
      Math.pow(currentPoint.x - firstPoint.x, 2) +
      Math.pow(currentPoint.y - firstPoint.y, 2)
    );
    return distance <= threshold;
  };
  // Draw the grid and garden when the component mounts or updates
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Clear the canvas
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    // Draw grid
    drawGrid(ctx);

    // Draw garden
    drawGarden(ctx);
  });

  // Draw the grid
  const drawGrid = (ctx) => {
    ctx.strokeStyle = "#eee";
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

  // Draw the garden with points and line lengths
  const drawGarden = (ctx) => {
    if (points.length < 1) return;

    ctx.strokeStyle = "green";
    ctx.lineWidth = 2;

    // Draw all garden lines
    for (let i = 1; i < points.length; i++) {
      drawLineWithLength(ctx, points[i - 1], points[i]);
    }

    // Draw the line from the last point to the mouse cursor (if not finished)
    if (!isFinished && points.length > 0 && mousePosition) {
      drawLineWithLength(ctx, points[points.length - 1], mousePosition);
    }

    // Close the garden shape by connecting the last point to the first point
    if (isFinished && points.length > 1) {
      drawLineWithLength(ctx, points[points.length - 1], points[0]);
    }
  };

  // Draw a line and display its length
  const drawLineWithLength = (ctx, start, end) => {
    // Draw the line
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();

    // Calculate the length of the line in meters
    const length =
      (Math.sqrt(
          Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
        ) /
        gridSize/2) *
      2;

    // Calculate the midpoint of the line
    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2;

    // Display the length at the midpoint
    ctx.fillStyle = "black";
    ctx.font = "12px Arial";
    ctx.fillText(length.toFixed(1) + "m", midX + 5, midY - 5);
  };

  // Handle mouse movement for live preview
  const handleMouseMove = (e) => {
    if (!isFinished) {
      const rect = e.target.getBoundingClientRect();
      const snappedX = snapToGrid(e.clientX - rect.left);
      const snappedY = snapToGrid(e.clientY - rect.top);
      setMousePosition({
        x: snappedX,
        y: snappedY,
      });
    }
  };

  // Handle canvas click to add a new point
  const handleCanvasClick = (e) => {
    if (isFinished) return;

    const rect = e.target.getBoundingClientRect();
    const snappedX = snapToGrid(e.clientX - rect.left);
    const snappedY = snapToGrid(e.clientY - rect.top);

    const newPoint = { x: snappedX, y: snappedY };

    if (isNearFirstPoint(newPoint)) {
      // If near the first point, finish the garden
      setIsFinished(true);
    } else {
      // Otherwise, add the new point
      setPoints((prevPoints) => [...prevPoints, newPoint]);
    }
  };

  // Handle finishing the garden shape
  const finishGarden = () => {
    if (points.length > 2) {
      setIsFinished(true);
    } else {
      alert("You need at least 3 points to complete a garden shape!");
    }
  };

  // Handle resetting the garden shape
  const resetGarden = () => {
    setPoints([]);
    setIsFinished(false);
    setMousePosition(null);
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={canvasSize}
        height={canvasSize}
        style={{
          border: "1px solid black",
          cursor: isFinished ? "default" : "crosshair",
        }}
        onMouseMove={handleMouseMove}
        onClick={handleCanvasClick}
      ></canvas>
      <div>
            <button onClick={finishGarden}>Finish Garden</button>
          <button onClick={resetGarden}>Reset Garden
      </button>

      </div>
    </div>
  );
};

export default GardenCanvas;

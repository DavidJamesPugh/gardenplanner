import React, { useState, useRef } from "react";

const vegetables = [
  { id: 1, name: "Potato", spacing: 4, fullSun: true },
  { id: 2, name: "Carrot", spacing: 2, fullSun: true },
  { id: 3, name: "Leek", spacing: 15, fullSun: true },
];

const canvasSize = 800; // Fixed canvas size in pixels

const GardenPlanner = ({ gardenData }) => {
  const [selectedVegetable, setSelectedVegetable] = useState(null); // Tracks the selected vegetable
  const [gardenVegetables, setGardenVegetables] = useState([]);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 }); // Tracks cursor position
  const canvasRef = useRef(null);


  gardenData.width = gardenData.shape === "square" ? gardenData.size : gardenData.width;
  gardenData.height = gardenData.shape === "square" ? gardenData.size : gardenData.length;
  const gardenCanvasDivisor = gardenData.width/gardenData.height;

  gardenData.canvasSizeX = canvasSize; // Fixed canvas width in pixels
  gardenData.canvasSizeY = canvasSize/gardenCanvasDivisor; // Fixed canvas height in pixels
  gardenData.canvasScale = gardenData.canvasSizeX / gardenData.width;


  const handleCanvasClick = (e) => {
    if (selectedVegetable) {
      const canvasRect = e.target.getBoundingClientRect(); // Get canvas bounds
      const position = {
        x: e.clientX-10 - canvasRect.left, // Adjust for canvas offset
        y: e.clientY-10 - canvasRect.top,
      };

      // Validate the position and add the vegetable
      const isValidPosition = validatePosition(position, selectedVegetable.spacing / 100);
      if (isValidPosition) {
        setGardenVegetables((prev) => [...prev, { ...selectedVegetable, position }]);
        setSelectedVegetable(null); // Deselect after placing
      } else {
        alert("Invalid position: Too close to another vegetable or garden edge.");
      }
    }
  };

  const handleMouseMove = (e) => {
    if (selectedVegetable && canvasRef.current) {
      const canvasRect = canvasRef.current.getBoundingClientRect(); // Get canvas bounds
      setCursorPosition({
        x: e.clientX-10 - canvasRect.left,
        y: e.clientY-10 - canvasRect.top,
      });

    }
  };

  const validatePosition = (position, spacing) => {
    // Validation logic for vegetable placement
    const { x, y } = position;
    const canvasScale = gardenData.canvasScale;

    // Check proximity to other vegetables
    for (let veg of gardenVegetables) {
      const dx = veg.position.x - x;
      const dy = veg.position.y - y;
      if (Math.sqrt(dx * dx + dy * dy) < veg.spacing * canvasScale / 2 / 100 + spacing * canvasScale / 2) return false;
    }

    // Check garden boundaries
    return (
      x >= spacing * canvasScale / 2 &&
      y >= spacing * canvasScale / 2 &&
      x <= gardenData.canvasSizeX - spacing * canvasScale / 2 &&
      y <= gardenData.canvasSizeY - spacing * canvasScale / 2
    );
  };

  return (
    <div onMouseMove={handleMouseMove}>
      <h2>Plan Your Garden</h2>
      <div style={{
        display: 'flex',
        gap: '1rem',
      }}>
        {vegetables.map((veg) => (
          <Vegetable
            key={veg.id}
            vegetable={veg}
            onClick={() => setSelectedVegetable(veg)} // Set the selected vegetable on click
          />
        ))}
      </div>
      <GardenDropArea
        gardenData={gardenData}
        gardenVegetables={gardenVegetables}
        onCanvasClick={handleCanvasClick}
        canvasRef={canvasRef} // Pass the ref
        selectedVegetable={selectedVegetable}
      cursorPosition={cursorPosition}
      validatePosition={validatePosition}
      />
      <button onClick={() => setGardenVegetables([])}>Reset Canvas</button>
    </div>
  );
};


const Vegetable = ({
  vegetable,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      style={{ padding: "10px", border: "1px solid black", cursor: "pointer" }}
    >
      {vegetable.name}
    </div>
  );
};

const SelectedVegetablePlacement = ({ selectedVegetable, gardenData, cursorPosition, validatePosition}) => {
  if (!cursorPosition || !selectedVegetable) return null;
  const veg = selectedVegetable;

  const canvasScale = gardenData.canvasScale;

  const isValidPosition = validatePosition(cursorPosition, selectedVegetable.spacing / 100);

  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: cursorPosition.x - (veg.spacing*canvasScale/2/100), // Ensure cursorPosition.x is defined
          top: cursorPosition.y - (veg.spacing*canvasScale/2/100), // Ensure cursorPosition.y is defined
          width: `${canvasScale * (veg.spacing / 100)}px`, // Scale vegetable size
          height: `${canvasScale * (veg.spacing / 100)}px`, // Scale vegetable size
          backgroundColor: isValidPosition ? 'green' : 'red',
          borderRadius: '50%',
          opacity: '20%',
          pointerEvents: 'none', // Let clicks pass through
        }}>
      </div>
      <div
        style={{
          position: 'absolute',
          left: cursorPosition.x - canvasScale/2/100, // Ensure cursorPosition.x is defined
          top: cursorPosition.y - canvasScale/2/100, // Ensure cursorPosition.y is defined
          width: `${canvasScale / 100}px`, // Scale vegetable size
          height: `${canvasScale / 100}px`, // Scale vegetable size
          backgroundColor:  isValidPosition ? 'green' : 'red',
          borderRadius: '50%',
          pointerEvents: 'none', // Let clicks pass through
        }}>
      </div>
    </>
)
}

const DroppedVege = ({
  gardenData,
  gardenVegetables,
}) => {

  const canvasScale = gardenData.canvasScale;

  return (
    <>
      {gardenVegetables.map((veg, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            left: veg.position.x - (canvasScale / 2) * (veg.spacing / 100), // Convert back to canvas pixels
            top: veg.position.y - (canvasScale / 2) * (veg.spacing / 100), // Convert back to canvas pixels
            width: `${canvasScale * (veg.spacing / 100)}px`, // Scale vegetable size
            height: `${canvasScale * (veg.spacing / 100)}px`, // Scale vegetable size
            backgroundColor: "green",
            borderRadius: "50%",
            opacity: "20%",
          }}
        ></div>
      ))}
      {gardenVegetables.map((veg, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            left: veg.position.x - canvasScale/2/100, // Convert back to canvas pixels
            top: veg.position.y - canvasScale/2/100, // Convert back to canvas pixels
            width: `${canvasScale/100}px`, // Scale vegetable size
            height: `${canvasScale/100}px`, // Scale vegetable size
            backgroundColor: "green",
            borderRadius: "50%",
          }}
        ></div>
      ))}
    </>
  );
};

const GardenDropArea = ({
  gardenData,
  gardenVegetables,
  onCanvasClick,
  canvasRef,
  selectedVegetable,
  cursorPosition,
  validatePosition
}) => {

  return (

    <div
      ref={canvasRef} // Attach the ref
      onClick={onCanvasClick}
      style={{
        position: "relative",
        width: `${canvasSize}px`,
        aspectRatio: `${gardenData.width/gardenData.height}`,
        background: "#f0f0f0",
        border: "1px solid #ccc",
        marginTop: "1rem",
        cursor:selectedVegetable ?  "crosshair" : "default" ,
      }}
    >
      <DroppedVege gardenData={gardenData} gardenVegetables={gardenVegetables}/>


      {/* Render hovering vegetable */}
      {selectedVegetable &&
        <SelectedVegetablePlacement selectedVegetable={selectedVegetable} gardenData={gardenData}
                                    cursorPosition={cursorPosition} validatePosition={validatePosition} />
      }
    </div>
  );
};

export default GardenPlanner;

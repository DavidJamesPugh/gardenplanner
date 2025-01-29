import React, { useState, useRef } from "react";

const vegetables = [
  { id: 1, name: "Potato", spacing: 4, fullSun: true },
  { id: 2, name: "Carrot", spacing: 2, fullSun: true },
  { id: 3, name: "Leek", spacing: 15, fullSun: true },
];

const canvasSize = 500; // Fixed canvas size in pixels

const GardenPlanner = ({ gardenData }) => {
  const [gardenVegetables, setGardenVegetables] = useState([]);
  const [selectedVegetable, setSelectedVegetable] = useState(null); // Tracks the selected vegetable
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 }); // Tracks cursor position
  const canvasRef = useRef(null);

  const handleCanvasClick = (e) => {
    if (selectedVegetable) {
      const canvasRect = e.target.getBoundingClientRect(); // Get canvas bounds
      const position = {
        x: e.clientX - canvasRect.left, // Adjust for canvas offset
        y: e.clientY - canvasRect.top,
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
        x: e.clientX - canvasRect.left,
        y: e.clientY - canvasRect.top,
      });
    }
  };

  const validatePosition = (position, spacing) => {
    // Validation logic for vegetable placement
    const { x, y } = position;
    const gardenWidth = gardenData.shape === "circle" ? gardenData.diameter : gardenData.width || gardenData.size;
    const gardenHeight = gardenData.shape === "circle" ? gardenData.diameter : gardenData.length || gardenData.size;
    const scaleX = canvasSize / gardenWidth;
    const scaleY = canvasSize / gardenHeight;

    // Check proximity to other vegetables
    for (let veg of gardenVegetables) {
      const dx = veg.position.x - x;
      const dy = veg.position.y - y;
      if (Math.sqrt(dx * dx + dy * dy) < veg.spacing * scaleX / 2 / 100 + spacing * scaleX / 2) return false;
    }

    // Check garden boundaries
    return (
      x >= spacing * scaleX / 2 &&
      y >= spacing * scaleY / 2 &&
      x <= canvasSize - spacing * scaleX / 2 &&
      y <= canvasSize - spacing * scaleY / 2
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
        cursorPosition={cursorPosition}
        selectedVegetable={selectedVegetable}
        canvasRef={canvasRef} // Pass the ref
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

const SelectedVegetablePlacement = ({ selectedVegetable, gardenData, cursorPosition }) => {
  ///if (!cursorPosition || !selectedVegetable) return null;
  const veg = selectedVegetable
  console.log(cursorPosition)
  const gardenWidth = gardenData.shape === "circle" ? gardenData.diameter : gardenData.width || gardenData.size;
  const gardenHeight = gardenData.shape === "circle" ? gardenData.diameter : gardenData.length || gardenData.size;
  const scaleX = canvasSize / gardenWidth;
  const scaleY = canvasSize / gardenHeight;

  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: cursorPosition.x - (veg.spacing*scaleX/2/100), // Ensure cursorPosition.x is defined
          top: cursorPosition.y - (veg.spacing*scaleY/2/100), // Ensure cursorPosition.y is defined
          width: `${scaleX * (veg.spacing / 100)}px`, // Scale vegetable size
          height: `${scaleY * (veg.spacing / 100)}px`, // Scale vegetable size
          backgroundColor: 'green',
          borderRadius: '50%',
          opacity: '20%',
          pointerEvents: 'none', // Let clicks pass through
        }}>
      </div>
      <div
        style={{
          position: 'absolute',
          left: cursorPosition.x - scaleX/2/100, // Ensure cursorPosition.x is defined
          top: cursorPosition.y - scaleY/2/100, // Ensure cursorPosition.y is defined
          width: `${scaleX / 100}px`, // Scale vegetable size
          height: `${scaleY / 100}px`, // Scale vegetable size
          backgroundColor: 'green',
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

  const gardenWidth = gardenData.shape === "circle" ? gardenData.diameter : gardenData.width || gardenData.size;
  const gardenHeight = gardenData.shape === "circle" ? gardenData.diameter : gardenData.length || gardenData.size;
  const scaleX = canvasSize / gardenWidth;
  const scaleY = canvasSize / gardenHeight;

  return (
    <>
      {gardenVegetables.map((veg, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            left: veg.position.x - (scaleX / 2) * (veg.spacing / 100), // Convert back to canvas pixels
            top: veg.position.y - (scaleY / 2) * (veg.spacing / 100), // Convert back to canvas pixels
            width: `${scaleX * (veg.spacing / 100)}px`, // Scale vegetable size
            height: `${scaleY * (veg.spacing / 100)}px`, // Scale vegetable size
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
            left: veg.position.x - scaleX/2/100, // Convert back to canvas pixels
            top: veg.position.y - scaleY/2/100, // Convert back to canvas pixels
            width: `${scaleX/100}px`, // Scale vegetable size
            height: `${scaleY/100}px`, // Scale vegetable size
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
  cursorPosition,
  selectedVegetable,
  canvasRef
}) => {

  return (

    <div
      ref={canvasRef} // Attach the ref
      onClick={onCanvasClick}
      style={{
        position: "relative",
        width: `${canvasSize}px`,
        height: `${canvasSize}px`,
        background: "#f0f0f0",
        border: "1px solid #ccc",
        marginTop: "1rem",
        cursor: selectedVegetable ?
          "crosshair" :
          "default",
      }}
    >
      <DroppedVege gardenData={gardenData} gardenVegetables={gardenVegetables}/>

      {/* Render hovering vegetable */}
      {selectedVegetable &&
        <SelectedVegetablePlacement selectedVegetable={selectedVegetable} gardenData={gardenData}
                                    cursorPosition={cursorPosition}/>
      }

    </div>
  );
};

export default GardenPlanner;

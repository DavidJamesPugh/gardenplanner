import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDrag, useDrop } from "react-dnd";

const vegetables = [
  { id: 1, name: "Potato", spacing: 4, fullSun: true },
  { id: 2, name: "Carrot", spacing: 2, fullSun: true },
  { id: 3, name: "Leek", spacing: 15, fullSun: true },
];

const GardenPlanner = ({ gardenData }) => {
  const [gardenVegetables, setGardenVegetables] = useState( []
  );
  const alertShownRef = useRef(false);
  // useEffect(() => {
  //   localStorage.setItem("gardenVegetables", JSON.stringify(gardenVegetables));
  // }, [gardenVegetables]);

  const handleDrop = (item, position) => {
    setGardenVegetables((prevGardenVegetables) => {
      const isValidPosition = validatePosition(position, item.spacing / 100, prevGardenVegetables);
      if (isValidPosition) {
        alertShownRef.current = false; // Reset the alert flag
        return [...prevGardenVegetables, { ...item, position }];
      } else {
        if (!alertShownRef.current) {
          alert("Invalid position: Too close to another vegetable or garden edge.");
          alertShownRef.current = true;
        }
        return prevGardenVegetables;
      }
    });
  };

  const validatePosition = (position, spacing, gardenVegetables) => {
    const { x, y } = position;
    const canvasSize = 500; // Fixed canvas size in pixels
    const gardenWidth = gardenData.shape === "circle" ? gardenData.diameter : gardenData.width || gardenData.size;
    const gardenHeight = gardenData.shape === "circle" ? gardenData.diameter : gardenData.length || gardenData.size;
    const scaleX = canvasSize / gardenWidth;
    const scaleY = canvasSize / gardenHeight;

    // Check proximity to other vegetables
    for (let veg of gardenVegetables) {
      const dx = veg.position.x - x;
      const dy = veg.position.y - y;
      if (Math.sqrt(dx * dx + dy * dy) < veg.spacing*scaleX/2/100 + spacing*scaleX/2) return false;
    }

    // Check garden boundaries
    return (
      x >= spacing*scaleX/2 && // Left boundary
      y >= spacing*scaleY/2 && // Top boundary
      x <= canvasSize - (spacing*scaleX/2) && // Right boundary
      y <= canvasSize - (spacing*scaleY/2) // Bottom boundary
    );
  };


  return (
    <div>
      <h2>Plan Your Garden</h2>
      <div style={{ display: "flex", gap: "1rem" }}>
        {vegetables.map((veg) => (
          <Vegetable key={veg.id} vegetable={veg} />
        ))}
      </div>
      <GardenDropArea
        gardenData={gardenData}
        gardenVegetables={gardenVegetables}
        onDrop={handleDrop}
      />
    </div>
  );
};

const Vegetable = ({ vegetable }) => {
  const [, drag] = useDrag(() => ({
    type: "VEGETABLE",
    item: vegetable,
  }));

  return (
    <div ref={drag} style={{ padding: "10px", border: "1px solid black" }}>
      {vegetable.name}
    </div>
  );
};

const DroppedVege = ({scaleX,scaleY,gardenVegetables}) => {

  return (
    <>
      {gardenVegetables.map((veg, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            left: veg.position.x - (scaleX/2)*(veg.spacing/100), // Convert back to canvas pixels
            top: veg.position.y - (scaleY/2)*(veg.spacing/100), // Convert back to canvas pixels
            width: `${scaleX*(veg.spacing/100)}px`, // Scale vegetable size
            height: `${scaleY*(veg.spacing/100)}px`, // Scale vegetable size
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

const GardenDropArea = ({ gardenData, gardenVegetables, onDrop }) => {
  const canvasSize = 500; // Fixed canvas size in pixels
  const gardenWidth = gardenData.shape === "circle" ? gardenData.diameter : gardenData.width || gardenData.size;
  const gardenHeight = gardenData.shape === "circle" ? gardenData.diameter : gardenData.length || gardenData.size;

  const dropRef = useRef(null);
  // Scaling factors to convert between canvas and garden size
  const scaleX = canvasSize / gardenWidth;
  const scaleY = canvasSize / gardenHeight;

  const [, drop] = useDrop(() => ({
    accept: "VEGETABLE",
    drop: (item, monitor) => {
      if (!monitor.didDrop()) {
        const cursorOffset = monitor.getClientOffset(); // Get the cursor's position in the viewport
        if (!cursorOffset) return;
        const canvasRect = dropRef.current.getBoundingClientRect();

        // Scale offset position to garden coordinates
        const position = {
          x: Math.round((cursorOffset.x - canvasRect.left)), // Adjust for scaling
          y: Math.round((cursorOffset.y - canvasRect.top)),  // Adjust for scaling
        };

        onDrop(item, position);
      }
    },
  }));
  const assignRef = useCallback(
    (node) => {
      if (node) {
        drop(node); // Attach React DnD drop functionality
        dropRef.current = node; // Assign the DOM element to dropRef
      }
    },
    [drop]
  );

  return (
    <div
      ref={assignRef}
      style={{
        position: "relative",
        width: `${canvasSize}px`,
        height: `${canvasSize}px`,
        background: "#f0f0f0",
        border: "1px solid #ccc",
        marginTop: "1rem",
      }}
    >
      <DroppedVege scaleX={scaleX} scaleY={scaleY}
        gardenVegetables={gardenVegetables}/>
    </div>
  );
};

export default GardenPlanner;

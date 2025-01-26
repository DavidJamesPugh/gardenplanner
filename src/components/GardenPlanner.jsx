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

  useEffect(() => {
    localStorage.setItem("gardenVegetables", JSON.stringify(gardenVegetables));
  }, [gardenVegetables]);

  const handleDrop = (item, position) => {
    console.log(item, position);
    const isValidPosition = validatePosition(position, item.spacing/100);
    if (isValidPosition) {
      setGardenVegetables((prev) => [...prev, { ...item, position }]);
    } else {
      alert("Invalid position: Too close to another vegetable or garden edge.");
    }
  };

  const validatePosition = (position, spacing) => {
    const { x, y } = position;
    const canvasSize = 500; // Fixed canvas size in pixels
    const gardenWidth = gardenData.shape === "circle" ? gardenData.diameter : gardenData.width || gardenData.size;
    const gardenHeight = gardenData.shape === "circle" ? gardenData.diameter : gardenData.length || gardenData.size;
    const scaleX = canvasSize / gardenWidth;
    const scaleY = canvasSize / gardenHeight;

    console.log(scaleX,scaleY);
    console.log(position,spacing);

    console.log(gardenVegetables);
    // Check proximity to other vegetables
    for (let veg of gardenVegetables) {
      const dx = veg.position.x - x;
      const dy = veg.position.y - y;
      console.log(dx, dy);
      if (Math.sqrt(dx * dx + dy * dy) < veg.spacing/100 + spacing/100) return false;
    }

    // Check garden boundaries
    return (
      x >= spacing && // Left boundary
      y >= spacing //&& // Top boundary
     // x <= scaleX - spacing && // Right boundary
     // y <= scaleY - spacing // Bottom boundary
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
            left: veg.position.x, // Convert back to canvas pixels
            top: veg.position.y, // Convert back to canvas pixels
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
            left: veg.position.x, // Convert back to canvas pixels
            top: veg.position.y, // Convert back to canvas pixels
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
      const offset = monitor.getSourceClientOffset();
      if (!offset) return;
      const canvasRect = dropRef.current.getBoundingClientRect();

    console.log(`Offset x and y ${offset.x} - ${offset.y}`);
      // Scale offset position to garden coordinates
      const position = {
        x: Math.round(offset.x - canvasRect.left),
        y: Math.round(offset.y - canvasRect.top),
      };

      onDrop(item, position);
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

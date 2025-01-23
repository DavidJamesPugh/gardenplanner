import React, { useState, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";

const vegetables = [
  { id: 1, name: "Potato", spacing: 4, fullSun: true },
  { id: 2, name: "Carrot", spacing: 2, fullSun: true },
  { id: 3, name: "Leek", spacing: 15, fullSun: true },
];

const GardenPlanner = ({ gardenData }) => {
  const [gardenVegetables, setGardenVegetables] = useState(
    JSON.parse(localStorage.getItem("gardenVegetables")) || []
  );

  useEffect(() => {
    localStorage.setItem("gardenVegetables", JSON.stringify(gardenVegetables));
  }, [gardenVegetables]);

  const handleDrop = (item, position) => {
    const isValidPosition = validatePosition(position, item.spacing);
    if (isValidPosition) {
      setGardenVegetables((prev) => [...prev, { ...item, position }]);
    } else {
      alert("Invalid position: Too close to another vegetable or garden edge.");
    }
  };

  const validatePosition = (position, spacing) => {
    const { x, y } = position;
    const gardenWidth = gardenData.shape === "circle" ? gardenData.diameter : gardenData.width || gardenData.size;
    const gardenHeight = gardenData.shape === "circle" ? gardenData.diameter : gardenData.length || gardenData.size;

    // Check proximity to other vegetables
    for (let veg of gardenVegetables) {
      const dx = veg.position.x - x;
      const dy = veg.position.y - y;
      if (Math.sqrt(dx * dx + dy * dy) < (veg.spacing + spacing) * 10) return false;
    }

    // Check garden boundaries
    return (
      x >= spacing * 10 &&
      y >= spacing * 10 &&
      x <= (gardenWidth - spacing) * 10 &&
      y <= (gardenHeight - spacing) * 10
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

const GardenDropArea = ({ gardenData, gardenVegetables, onDrop }) => {
  const [, drop] = useDrop(() => ({
    accept: "VEGETABLE",
    drop: (item, monitor) => {
      const offset = monitor.getSourceClientOffset();
      const position = {
        x: Math.round(offset.x / 10),
        y: Math.round(offset.y / 10),
      };
      onDrop(item, position);
    },
  }));

  return (
    <div
      ref={drop}
      style={{
        position: "relative",
        width: gardenData.shape === "circle" ? gardenData.diameter * 10 : gardenData.width * 10 || gardenData.size * 10,
        height: gardenData.shape === "circle" ? gardenData.diameter * 10 : gardenData.length * 10 || gardenData.size * 10,
        background: "#f0f0f0",
        border: "1px solid #ccc",
        marginTop: "1rem",
      }}
    >
      {gardenVegetables.map((veg, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            left: veg.position.x * 10,
            top: veg.position.y * 10,
            width: "10px",
            height: "10px",
            backgroundColor: "green",
            borderRadius: "50%",
          }}
        ></div>
      ))}
    </div>
  );
};

export default GardenPlanner;

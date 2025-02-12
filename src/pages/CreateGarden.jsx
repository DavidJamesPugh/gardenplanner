import React, { useState } from "react";
import GardenCanvas from "../components/GardenCanvas.jsx";
import GardenPlanner from '../components/GardenPlanner.jsx';
import ReactDOM from "react-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const CreateGarden = () => {
  const [gardenShape, setGardenShape] = useState(0); // Tracks the selected garden shape
  const [measurements, setMeasurements] = useState(null); // Stores user-provided measurements
  const [isReady, setIsReady] = useState(false); // Tracks whether the garden is ready for display
  const [inputValues, setInputValues] = useState({}); // Tracks current input values

  // Set garden shape state and reset related data
  const handleSetGardenShape = (shape) => {
    setGardenShape(shape);
    setMeasurements(null); // Reset measurements when switching shapes
    setIsReady(false);
    setInputValues({}); // Reset input values
  };

  // Handle input change for measurements
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputValues((prev) => ({ ...prev, [name]: value }));
  };

  // Handle submitting the measurements
  const handleSubmitMeasurements = () => {
    if (gardenShape === 1) {
      setMeasurements({ side: parseFloat(inputValues.side) });
    } else if (gardenShape === 2) {
      setMeasurements({
        width: parseFloat(inputValues.width),
        length: parseFloat(inputValues.length),
      });
    } else if (gardenShape === 3) {
      setMeasurements({ diameter: parseFloat(inputValues.diameter) });
    } else if (gardenShape === 4) {
      setMeasurements({ longestLine: parseFloat(inputValues.longestLine) });
    }

    setIsReady(true);

    // Save to localStorage
    const gardenData = { shape: gardenShape, measurements };
    localStorage.setItem("gardenData", JSON.stringify(gardenData));
  };

  return (
    <div>
      <h1>Create Your Garden</h1>
      {gardenShape === 0 && (
        <>
          <p>Is your garden...</p>
          <button onClick={() => handleSetGardenShape(1)}>Square?</button>
          <button onClick={() => handleSetGardenShape(2)}>Rectangular?</button>
          <button onClick={() => handleSetGardenShape(3)}>A Circle?</button>
          <button onClick={() => handleSetGardenShape(4)}>Irregularly shaped?</button>
        </>
      )}

      {gardenShape === 1 && measurements === null && (
        <div>
          <h2>Square Garden</h2>
          <label>
            Side (in meters):
            <input
              type="number"
              name="side"
              value={inputValues.side || ""}
              onChange={handleInputChange}
            />
          </label>
          <button onClick={handleSubmitMeasurements}>Submit</button>
        </div>
      )}

      {gardenShape === 2 && measurements === null && (
        <div>
          <h2>Rectangular Garden</h2>
          <label>
            Width (in meters):
            <input
              type="number"
              name="width"
              value={inputValues.width || ""}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Length (in meters):
            <input
              type="number"
              name="length"
              value={inputValues.length || ""}
              onChange={handleInputChange}
            />
          </label>
          <button onClick={handleSubmitMeasurements}>Submit</button>
        </div>
      )}

      {gardenShape === 3 && measurements === null && (
        <div>
          <h2>Circular Garden</h2>
          <label>
            Diameter (in meters):
            <input
              type="number"
              name="diameter"
              value={inputValues.diameter || ""}
              onChange={handleInputChange}
            />
          </label>
          <button onClick={handleSubmitMeasurements}>Submit</button>
        </div>
      )}

      {gardenShape === 4 && measurements === null && (
        <div>
          <h2>Irregular Garden</h2>
          <label>
            Longest line (in meters):
            <input
              type="number"
              name="longestLine"
              value={inputValues.longestLine || ""}
              onChange={handleInputChange}
            />
          </label>
          <button onClick={handleSubmitMeasurements}>Submit</button>
        </div>
      )}

      {isReady && measurements && (
        <div>
          {gardenShape === 4 ?
            (
              <GardenCanvas longestLine={measurements.longestLine}/>
            ) :
            (
              <div>
                {gardenShape === 1 && (
                  <div>
                    <DndProvider backend={HTML5Backend}>
                      <GardenPlanner gardenData={{
                        shape: "square",
                        size: measurements.side
                      }}/>
                    </DndProvider>
                  </div>
                )}
                {gardenShape === 2 && (
                  <div>
                    <DndProvider backend={HTML5Backend}>
                      <GardenPlanner gardenData={{
                        shape: "rectangle",
                        width: measurements.width,
                        length: measurements.length
                        }}/>
                    </DndProvider>
                  </div>
                )}
                {gardenShape === 3 && (
                  <div>
                    <p>Circle with diameter {measurements.diameter} meters.</p>
                  </div>
                )}
              </div>
            )}
        </div>
      )}
      {gardenShape > 0 &&
        (
      <button onClick={() => handleSetGardenShape(0)}>Redo Garden</button>
        )}
      </div>
  )
};

export default CreateGarden;

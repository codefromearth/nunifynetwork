import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [warehouseSize, setWarehouseSize] = useState('5 5');
  const [robotDetails, setRobotDetails] = useState('');
  const [robotInstructions, setRobotInstructions] = useState('');
  const [result,setResult]=useState([])

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/rc-robots', {
        warehouseSize,
        robotDetails,
        robotInstructions,
      });

      const { data } = response;
      console.log(data);
      setResult(data) 
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h1>RC Robots</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Warehouse Size:
          <input
            type="text"
            value={warehouseSize}
            onChange={(e) => setWarehouseSize(e.target.value)}
          />
        </label>
        <br />
        <label>
          Robot Details:
          <textarea
            value={robotDetails}
            onChange={(e) => setRobotDetails(e.target.value)}
          />
        </label>
        <br />
        <label>
          Robot Instructions:
          <textarea
            value={robotInstructions}
            onChange={(e) => setRobotInstructions(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Submit</button>
        <div>
          <h1>Final Coordinate :{result}</h1>
        </div>
      </form>
    </div>
  );
}

export default App;

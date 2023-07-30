const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors package


const app = express();
const port = 5000;
app.use(cors()); 
// Middleware
app.use(bodyParser.json());

// Robot movement logic
function moveRobot(x, y, direction, instructions,warehouseWidth,warehouseHeight) {
  const directions = ['N', 'E', 'S', 'W']; // Array to represent the four cardinal directions
  const dx = [0, 1, 0, -1]; // Array to represent the change in x-coordinate for each direction
  const dy = [1, 0, -1, 0]; // Array to represent the change in y-coordinate for each direction

  let currentDirectionIndex = directions.indexOf(direction);

  for (let instruction of instructions) {
    if (instruction === 'L') {
      // Turn the robot 90 degrees left
      currentDirectionIndex = (currentDirectionIndex + 3) % 4;
    } else if (instruction === 'R') {
      // Turn the robot 90 degrees right
      currentDirectionIndex = (currentDirectionIndex + 1) % 4;
    } else if (instruction === 'M') {
      // Move the robot forward one grid point in the current direction
      x += dx[currentDirectionIndex];
      y += dy[currentDirectionIndex];

      // Check if the robot is within the warehouse bounds
      if (x < 0) x = 0;
      if (x > warehouseWidth) x = warehouseWidth;
      if (y < 0) y = 0;
      if (y > warehouseHeight) y = warehouseHeight;
    }
  }

  return {
    x,
    y,
    direction: directions[currentDirectionIndex],
  };
}


// Route for handling the robot movement
app.post('/api/rc-robots', (req, res) => {
  const { warehouseSize, robotDetails, robotInstructions } = req.body;
  const [warehouseWidth, warehouseHeight] = warehouseSize.split(' ').map(Number);
  const robots = robotDetails.split('\n').filter(Boolean);
  const instructions = robotInstructions.split('\n').filter(Boolean);

  // Process each robot and get the final coordinates and heading
  const results = robots.map((robot, index) => {
    const [x, y, direction] = robot.split(' ');
    const finalPosition = moveRobot(Number(x), Number(y), direction, instructions[index]);
    return `${finalPosition.x} ${finalPosition.y} ${finalPosition.direction}`;
  });

  res.json(results);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

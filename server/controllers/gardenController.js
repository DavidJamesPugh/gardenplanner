
const getGarden = (req, res) => {
  // Simulated data fetch
  const gardenData = {
    name: 'My Garden',
    vegetables: []
  };
  res.json(gardenData);
};

const saveGarden = (req, res) => {
  const { name, vegetables } = req.body;

  // Simulate saving to a database
  const response = {
    message: 'Garden saved!',
    data: {
      name,
      vegetables
    }
  };
  res.json(response);
};

const routes = {
  getGarden,
  saveGarden,
};

export default routes;

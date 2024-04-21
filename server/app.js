const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const vehicleRoutes = require('./routes/vehicleRoutes');
const cityRoutes = require('./routes/cityRoutes');
const simulateRoutes = require('./routes/simulateRoutes');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/', vehicleRoutes);
app.use('/', cityRoutes);
app.use('/', simulateRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const vtpassService = require("../services/vtPassServices");
const { generateCode } = require("../utils/index");

const buyAirtime = async (req, res) => {
  try {
    const requestId = generateCode();
    const response = await vtpassService.buyAirtime({ ...req.body, requestId });
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

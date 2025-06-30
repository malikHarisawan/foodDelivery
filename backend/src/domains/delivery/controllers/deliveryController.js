const deliveryService = require('../services/deliveryService');

const createDelivery = async (req, res) => {
  try {
    const delivery = await deliveryService.createDelivery(req.body);
    res.status(201).json({
      message: 'Delivery created successfully',
      delivery
    });
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({ error: error.message });
    }
    res.status(400).json({ error: error.message });
  }
};

const getDeliveries = async (req, res) => {
  try {
    const result = await deliveryService.getDeliveries(req.query, req.user.role, req.user.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateDeliveryStatus = async (req, res) => {
  try {
    const delivery = await deliveryService.updateDeliveryStatus(req.params.id, req.body, req.user.role, req.user.id);
    res.json({
      message: 'Delivery status updated successfully',
      delivery
    });
  } catch (error) {
    if (error.message === 'Delivery not found') {
      return res.status(404).json({ error: error.message });
    }
    if (error.message === 'Unauthorized to update this delivery') {
      return res.status(403).json({ error: error.message });
    }
    res.status(400).json({ error: error.message });
  }
};

const updateDriverLocation = async (req, res) => {
  try {
    const { coordinates } = req.body;
    const location = await deliveryService.updateDriverLocation(req.params.id, coordinates, req.user.id);
    res.json({
      message: 'Location updated successfully',
      location
    });
  } catch (error) {
    if (error.message === 'Active delivery not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createDelivery,
  getDeliveries,
  updateDeliveryStatus,
  updateDriverLocation
};
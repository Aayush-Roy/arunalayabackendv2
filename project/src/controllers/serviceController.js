const Service = require('../models/Service');

const createService = async (req, res) => {
  try {
    const { title, description, price, durationMins, category, imageUrl } =
      req.body;

    if (!title || !description || !price || !durationMins || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    const service = await Service.create({
      title,
      description,
      price,
      durationMins,
      category,
      imageUrl,
    });

    res.status(201).json({
      success: true,
      data: service,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (service) {
      res.json({
        success: true,
        data: service,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (service) {
      service.title = req.body.title || service.title;
      service.description = req.body.description || service.description;
      service.price = req.body.price || service.price;
      service.durationMins = req.body.durationMins || service.durationMins;
      service.category = req.body.category || service.category;
      service.imageUrl = req.body.imageUrl || service.imageUrl;
      service.isActive =
        req.body.isActive !== undefined ? req.body.isActive : service.isActive;

      const updatedService = await service.save();

      res.json({
        success: true,
        data: updatedService,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (service) {
      service.isActive = false;
      await service.save();

      res.json({
        success: true,
        message: 'Service deactivated successfully',
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
};

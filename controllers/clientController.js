const Client = require("../models/Client");

// ➕ Create new client
exports.createClient = async (req, res) => {
  try {
    const { name, address, gstin, stateName } = req.body;

    const existing = await Client.findOne({ gstin });
    if (existing) {
      return res.status(400).json({ message: "Client with this GSTIN already exists" });
    }

    const client = await Client.create({
      name,
      address,
      gstin,
      stateName,
    //   createdBy: req.user._id,
    });

    res.status(201).json({ message: "Client created successfully", client });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📜 Get all clients
exports.getClients = async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.status(200).json({
      message: "Clients fetched successfully",
      clients,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to fetch clients",
    });
  }
};

// 🔍 Get single client
exports.getClientById = async (req, res) => {
  try {
    const client = await Client.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });
    if (!client) return res.status(404).json({ message: "Client not found" });
    res.status(200).json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✏️ Update client
exports.updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const client = await Client.findOneAndUpdate(
      { _id: id, createdBy: req.user._id },
      updates,
      { new: true }
    );

    if (!client) return res.status(404).json({ message: "Client not found" });
    res.status(200).json({ message: "Client updated successfully", client });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ❌ Delete client
exports.deleteClient = async (req, res) => {
  try {
    const { id } = req.params;

    const client = await Client.findOneAndDelete({
      _id: id,
      createdBy: req.user._id,
    });

    if (!client) return res.status(404).json({ message: "Client not found" });
    res.status(200).json({ message: "Client deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

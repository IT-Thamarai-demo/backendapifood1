const Menu = require("../models/menu");

// CREATE MENU with IMAGE
exports.createMenu = async (req, res) => {
    try {
        const imageUrl = req.file ? req.file.path : null;

        const menu = await Menu.create({
            ...req.body,
            image: imageUrl
        });

        res.status(201).json({ message: "Menu created", menu });

    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};

// GET ALL MENUS
exports.getMenus = async (req, res) => {
    try {
        const menus = await Menu.find();
        res.json(menus);
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};

// GET ONE MENU
exports.getMenu = async (req, res) => {
    try {
        const menu = await Menu.findById(req.params.id);
        if (!menu) return res.status(404).json({ message: "Menu not found" });

        res.json(menu);
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};

// UPDATE MENU (optional image)
exports.updateMenu = async (req, res) => {
    try {
        const imageUrl = req.file ? req.file.path : undefined;

        const updateData = { ...req.body };
        if (imageUrl) updateData.image = imageUrl;

        const menu = await Menu.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!menu) return res.status(404).json({ message: "Menu not found" });

        res.json({ message: "Menu updated", menu });

    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};

// DELETE MENU
exports.deleteMenu = async (req, res) => {
    try {
        const menu = await Menu.findByIdAndDelete(req.params.id);

        if (!menu) return res.status(404).json({ message: "Menu not found" });

        res.json({ message: "Menu deleted" });

    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};

const Application = require("../models/Application.model");
const PlacementActivity = require("../models/PlacementActivity.model");

// ============ APPLICATION CONTROLLERS ============

// Create new application
exports.createApplication = async (req, res) => {
    try {
        const { company, role, status, package: pkg, location, notes } = req.body;

        const application = new Application({
            student: req.user._id,
            company,
            role,
            status: status || "Applied",
            package: pkg,
            location,
            notes
        });

        await application.save();
        res.status(201).json({ success: true, data: application });
    } catch (error) {
        console.error("Create application error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get my applications
exports.getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ student: req.user._id })
            .sort({ createdAt: -1 });

        res.json({ success: true, data: applications });
    } catch (error) {
        console.error("Get applications error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update application
exports.updateApplication = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const application = await Application.findOne({ _id: id, student: req.user._id });

        if (!application) {
            return res.status(404).json({ success: false, message: "Application not found" });
        }

        Object.assign(application, updates);
        await application.save();

        res.json({ success: true, data: application });
    } catch (error) {
        console.error("Update application error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete application
exports.deleteApplication = async (req, res) => {
    try {
        const { id } = req.params;

        const application = await Application.findOneAndDelete({ _id: id, student: req.user._id });

        if (!application) {
            return res.status(404).json({ success: false, message: "Application not found" });
        }

        res.json({ success: true, message: "Application deleted successfully" });
    } catch (error) {
        console.error("Delete application error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Add interview round
exports.addInterviewRound = async (req, res) => {
    try {
        const { id } = req.params;
        const { round, type, date, feedback, status } = req.body;

        const application = await Application.findOne({ _id: id, student: req.user._id });

        if (!application) {
            return res.status(404).json({ success: false, message: "Application not found" });
        }

        application.interviewRounds.push({ round, type, date, feedback, status });
        await application.save();

        res.json({ success: true, data: application });
    } catch (error) {
        console.error("Add interview round error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ============ ADMIN APPLICATION CONTROLLERS ============

// Get all applications (Admin)
exports.getAllApplications = async (req, res) => {
    try {
        const applications = await Application.find()
            .populate("student", "name email")
            .sort({ createdAt: -1 });

        res.json({ success: true, data: applications });
    } catch (error) {
        console.error("Get all applications error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get selected students (Admin)
exports.getSelectedStudents = async (req, res) => {
    try {
        const applications = await Application.find({ status: "Selected" })
            .populate("student", "name email")
            .sort({ createdAt: -1 });

        res.json({ success: true, data: applications });
    } catch (error) {
        console.error("Get selected students error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ============ PLACEMENT ACTIVITY CONTROLLERS ============

// Create activity (Admin)
exports.createActivity = async (req, res) => {
    try {
        const { title, type, description, date, endDate, location, maxParticipants } = req.body;

        const activity = new PlacementActivity({
            title,
            type,
            description,
            date,
            endDate,
            location,
            maxParticipants,
            createdBy: req.user._id
        });

        await activity.save();
        res.status(201).json({ success: true, data: activity });
    } catch (error) {
        console.error("Create activity error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all activities
exports.getAllActivities = async (req, res) => {
    try {
        const { type, startDate, endDate } = req.query;

        let query = { isActive: true };

        if (type) {
            query.type = type;
        }

        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        const activities = await PlacementActivity.find(query)
            .populate("createdBy", "name")
            .sort({ date: 1 });

        res.json({ success: true, data: activities });
    } catch (error) {
        console.error("Get activities error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update activity (Admin)
exports.updateActivity = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const activity = await PlacementActivity.findByIdAndUpdate(id, updates, { new: true });

        if (!activity) {
            return res.status(404).json({ success: false, message: "Activity not found" });
        }

        res.json({ success: true, data: activity });
    } catch (error) {
        console.error("Update activity error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete activity (Admin)
exports.deleteActivity = async (req, res) => {
    try {
        const { id } = req.params;

        const activity = await PlacementActivity.findByIdAndDelete(id);

        if (!activity) {
            return res.status(404).json({ success: false, message: "Activity not found" });
        }

        res.json({ success: true, message: "Activity deleted successfully" });
    } catch (error) {
        console.error("Delete activity error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Register for activity
exports.registerForActivity = async (req, res) => {
    try {
        const { id } = req.params;

        const activity = await PlacementActivity.findById(id);

        if (!activity) {
            return res.status(404).json({ success: false, message: "Activity not found" });
        }

        // Check if already registered
        if (activity.participants.includes(req.user._id)) {
            return res.status(400).json({ success: false, message: "Already registered" });
        }

        // Check max participants
        if (activity.maxParticipants && activity.participants.length >= activity.maxParticipants) {
            return res.status(400).json({ success: false, message: "Activity is full" });
        }

        activity.participants.push(req.user._id);
        await activity.save();

        res.json({ success: true, data: activity });
    } catch (error) {
        console.error("Register for activity error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Unregister from activity
exports.unregisterFromActivity = async (req, res) => {
    try {
        const { id } = req.params;

        const activity = await PlacementActivity.findById(id);

        if (!activity) {
            return res.status(404).json({ success: false, message: "Activity not found" });
        }

        activity.participants = activity.participants.filter(
            p => p.toString() !== req.user._id.toString()
        );
        await activity.save();

        res.json({ success: true, data: activity });
    } catch (error) {
        console.error("Unregister from activity error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

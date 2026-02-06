// const Roadmap = require("../models/Roadmap.model");
// const { generateRoadmapAI } = require("../services/aiRoadmap.service");
// const { processBacklogs } = require("../services/backlog.service");


// // CREATE ROADMAP
// exports.generateRoadmap = async (req, res) => {
//   try {
//     const { topic, duration, level } = req.body;
//     const userId = req.user._id;

//     const aiDays = await generateRoadmapAI(topic, duration, level);

//     const startDate = new Date();

//     const days = aiDays.map((d, i) => ({
//       day: d.day,
//       date: new Date(startDate.getTime() + i * 86400000),
//       tasks: d.tasks.map((t) => ({ title: t })),
//     }));

//     const roadmap = await Roadmap.create({
//       userId,
//       topic,
//       duration,
//       startDate,
//       days,
//     });

//     res.json(roadmap);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


// // GET TODAY TASKS
// exports.getTodayTasks = async (req, res) => {
//   const roadmap = await Roadmap.findOne({
//     userId: req.user._id,
//     status: "active",
//   });

//   if (!roadmap) return res.json(null);

//   //processBacklogs(roadmap);
//   processBacklogs(roadmap);
//    await roadmap.save();


//   const today = new Date().toDateString();

//   const todayDay = roadmap.days.find(
//     (d) => new Date(d.date).toDateString() === today
//   );

//   res.json({
//     today: todayDay,
//     backlog: roadmap.days.filter((d) => d.backlog),
//   });
// };


// // MARK TASK COMPLETE
// exports.completeTask = async (req, res) => {
//   const { roadmapId, dayId, taskId } = req.body;

//   const roadmap = await Roadmap.findById(roadmapId);

//   const day = roadmap.days.id(dayId);
//   const task = day.tasks.id(taskId);

//   task.completed = true;
//   task.completedAt = new Date();

//   if (day.tasks.every((t) => t.completed)) {
//     day.isCompleted = true;
//     roadmap.streak += 1;
//   }

//   await roadmap.save();
//   res.json(roadmap);
// };
const Roadmap = require("../models/Roadmap.model");
const { generateRoadmapAI } = require("../services/aiRoadmap.service");
const { processBacklogs } = require("../services/backlog.service");


// CREATE ROADMAP
exports.generateRoadmap = async (req, res) => {
  try {
    const { topic, duration, level } = req.body;
    const userId = req.user._id;

    const aiDays = await generateRoadmapAI(topic, duration, level);

    const startDate = new Date();

    const days = aiDays.map((d, i) => ({
      day: d.day,
      date: new Date(startDate.getTime() + i * 86400000),
      tasks: d.tasks.map((t) => ({ title: t })),
    }));

    const roadmap = await Roadmap.create({
      userId,
      topic,
      duration,
      startDate,
      days,
    });

    res.json(roadmap);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// GET ACTIVE (FULL) ROADMAP
exports.getActiveRoadmap = async (req, res) => {
  try {
    const roadmap = await Roadmap.findOne({
      userId: req.user._id,
      status: "active",
    });

    if (!roadmap) {
      return res.json(null);
    }

    // Process backlogs before sending
    processBacklogs(roadmap);
    await roadmap.save();

    res.json(roadmap);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// GET TODAY TASKS
exports.getTodayTasks = async (req, res) => {
  try {
    const roadmap = await Roadmap.findOne({
      userId: req.user._id,
      status: "active",
    });

    // no roadmap yet
    if (!roadmap) {
      return res.json({
        roadmapId: null,
        today: null,
        backlog: [],
      });
    }

    // process backlog
    processBacklogs(roadmap);
    await roadmap.save();

    const todayStr = new Date().toDateString();

    const todayDay = roadmap.days.find(
      (d) => new Date(d.date).toDateString() === todayStr
    );

    res.json({
      roadmapId: roadmap._id,   // 🔥 VERY IMPORTANT
      today: todayDay || null,
      backlog: roadmap.days.filter((d) => d.backlog),
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// MARK TASK COMPLETE
exports.completeTask = async (req, res) => {
  try {
    const { roadmapId, dayId, taskId } = req.body;

    const roadmap = await Roadmap.findById(roadmapId);
    if (!roadmap) return res.status(404).json({ error: "Roadmap not found" });

    const day = roadmap.days.id(dayId);
    const task = day.tasks.id(taskId);

    task.completed = true;
    task.completedAt = new Date();

    if (day.tasks.every((t) => t.completed)) {
      day.isCompleted = true;
      roadmap.streak += 1;
    }

    await roadmap.save();
    res.json(roadmap);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

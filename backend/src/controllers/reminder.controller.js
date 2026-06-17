import * as reminderService from "../services/reminder.service.js";

export const getAllReminders = async (req, res) => {
  try {
    const userId = req.user.userId;
    const reminders = await reminderService.getAllReminders(userId);
    res.status(200).json(reminders);
  } catch (error) {
    console.error("Get All Reminders Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getDueTodayReminders = async (req, res) => {
  try {
    const userId = req.user.userId;
    const dueToday = await reminderService.getDueTodayReminders(userId);
    res.status(200).json({ dueToday });
  } catch (error) {
    console.error("Get Due Today Reminders Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUpcomingReminders = async (req, res) => {
  try {
    const userId = req.user.userId;
    const upcoming = await reminderService.getUpcomingReminders(userId);
    res.status(200).json({ upcoming });
  } catch (error) {
    console.error("Get Upcoming Reminders Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getOverdueReminders = async (req, res) => {
  try {
    const userId = req.user.userId;
    const overdue = await reminderService.getOverdueReminders(userId);
    res.status(200).json({ overdue });
  } catch (error) {
    console.error("Get Overdue Reminders Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

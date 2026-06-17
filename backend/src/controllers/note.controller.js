import * as noteService from "../services/note.service.js";

export const createNote = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { applicationId, content } = req.body;

    if (!applicationId || !content?.trim()) {
      return res.status(400).json({ error: "Application ID and content are required" });
    }

    const note = await noteService.createNote(userId, {
      applicationId,
      content: content.trim(),
    });

    res.status(201).json({ note });
  } catch (error) {
    if (error.message === "Application not found") {
      return res.status(404).json({ error: error.message });
    }
    console.error("Create Note Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getNotesByApplication = async (req, res) => {
  try {
    const userId = req.user.userId;
    const applicationId = req.params.applicationId;
    const result = await noteService.getNotesByApplication(userId, applicationId, req.query);
    res.status(200).json(result);
  } catch (error) {
    if (error.message === "Application not found") {
      return res.status(404).json({ error: error.message });
    }
    console.error("Get Notes Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateNote = async (req, res) => {
  try {
    const userId = req.user.userId;
    const noteId = req.params.id;
    const { content } = req.body;

    if (!content?.trim()) {
      return res.status(400).json({ error: "Content is required" });
    }

    const note = await noteService.updateNote(userId, noteId, content.trim());
    res.status(200).json({ note });
  } catch (error) {
    if (error.message === "Note not found") {
      return res.status(404).json({ error: error.message });
    }
    console.error("Update Note Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const userId = req.user.userId;
    const noteId = req.params.id;
    await noteService.deleteNote(userId, noteId);
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    if (error.message === "Note not found") {
      return res.status(404).json({ error: error.message });
    }
    console.error("Delete Note Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

import * as documentService from "../services/document.service.js";

export const uploadDocument = async (req, res) => {
  try {
    const userId = req.user.id;
    const { applicationId, label } = req.body;

    if (!applicationId || !label?.trim()) {
      return res.status(400).json({ error: "Application ID and label are required" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "File is required" });
    }

    const document = await documentService.uploadDocument(userId, {
      applicationId,
      label: label.trim(),
      file: req.file,
    });

    res.status(201).json({ document });
  } catch (error) {
    if (error.message === "Application not found") {
      return res.status(404).json({ error: error.message });
    }
    console.error("Upload Document Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getDocumentsByApplication = async (req, res) => {
  try {
    const userId = req.user.id;
    const applicationId = req.params.applicationId;
    const documents = await documentService.getDocumentsByApplication(userId, applicationId);
    res.status(200).json({ documents });
  } catch (error) {
    if (error.message === "Application not found") {
      return res.status(404).json({ error: error.message });
    }
    console.error("Get Documents Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const userId = req.user.id;
    const documentId = req.params.id;
    await documentService.deleteDocument(userId, documentId);
    res.status(200).json({ message: "Document deleted successfully" });
  } catch (error) {
    if (error.message === "Document not found") {
      return res.status(404).json({ error: error.message });
    }
    console.error("Delete Document Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

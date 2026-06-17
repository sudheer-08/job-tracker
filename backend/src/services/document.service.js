import { Readable } from "stream";
import prisma from "../config/prisma.js";
import cloudinary from "../config/cloudinary.js";
import { activeApplicationFilter } from "../utils/applicationFilters.js";

const assertApplicationOwnership = async (userId, applicationId) => {
  const application = await prisma.application.findFirst({
    where: { id: applicationId, userId, ...activeApplicationFilter },
    select: { id: true },
  });
  if (!application) throw new Error("Application not found");
  return application;
};

const uploadToCloudinary = (buffer, options) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "raw", ...options },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    Readable.from(buffer).pipe(uploadStream);
  });

export const uploadDocument = async (userId, { applicationId, label, file }) => {
  await assertApplicationOwnership(userId, applicationId);

  const uploadResult = await uploadToCloudinary(file.buffer, {
    folder: `job-tracker/documents/${applicationId}`,
    public_id: `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`,
  });

  return prisma.document.create({
    data: {
      applicationId,
      label,
      fileUrl: uploadResult.secure_url,
      mimeType: file.mimetype,
      fileSizeBytes: file.size,
    },
  });
};

export const getDocumentsByApplication = async (userId, applicationId) => {
  await assertApplicationOwnership(userId, applicationId);

  return prisma.document.findMany({
    where: { applicationId },
    orderBy: { uploadedAt: "desc" },
  });
};

export const deleteDocument = async (userId, documentId) => {
  const document = await prisma.document.findFirst({
    where: {
      id: documentId,
      application: { userId, ...activeApplicationFilter },
    },
  });
  if (!document) throw new Error("Document not found");

  const publicId = cloudinary.utils.public_id(document.fileUrl, { resource_type: "raw" });

  if (publicId) {
    await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
  }

  return prisma.document.delete({
    where: { id: documentId },
  });
};

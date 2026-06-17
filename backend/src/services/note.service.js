import prisma from "../config/prisma.js";
import { activeApplicationFilter } from "../utils/applicationFilters.js";

const assertApplicationOwnership = async (userId, applicationId) => {
  const application = await prisma.application.findFirst({
    where: { id: applicationId, userId, ...activeApplicationFilter },
    select: { id: true },
  });
  if (!application) throw new Error("Application not found");
  return application;
};

export const createNote = async (userId, { applicationId, content }) => {
  await assertApplicationOwnership(userId, applicationId);

  return prisma.note.create({
    data: { applicationId, content },
  });
};

export const getNotesByApplication = async (userId, applicationId, query) => {
  await assertApplicationOwnership(userId, applicationId);

  const { page = 1, limit = 10 } = query;
  const skip = (page - 1) * limit;
  const where = { applicationId };

  const [notes, total] = await Promise.all([
    prisma.note.findMany({
      where,
      skip: Number(skip),
      take: Number(limit),
      orderBy: { createdAt: "desc" },
    }),
    prisma.note.count({ where }),
  ]);

  return { notes, total, page: Number(page), limit: Number(limit) };
};

export const updateNote = async (userId, noteId, content) => {
  const note = await prisma.note.findFirst({
    where: {
      id: noteId,
      application: { userId, ...activeApplicationFilter },
    },
    select: { id: true },
  });
  if (!note) throw new Error("Note not found");

  return prisma.note.update({
    where: { id: noteId },
    data: { content },
  });
};

export const deleteNote = async (userId, noteId) => {
  const note = await prisma.note.findFirst({
    where: {
      id: noteId,
      application: { userId, ...activeApplicationFilter },
    },
    select: { id: true },
  });
  if (!note) throw new Error("Note not found");

  return prisma.note.delete({
    where: { id: noteId },
  });
};

import prisma from "../config/db.js";

export const getUserTasks = async (userId: number) => {
  return await prisma.task.findMany({ where: { userId } });
};

export const createTask = async (userId: number, title: string, description: string, expectedDate: string) => {
  return await prisma.task.create({
    data: {
      userId,
      title,
      description,
      createdDate: new Date().toISOString(),
      expectedDate,
      status: "PENDING",
    },
  });
};

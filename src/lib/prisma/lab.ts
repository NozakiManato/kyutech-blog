import { db } from "@/lib/db";

export async function getAllLabs() {
  try {
    const labs = await db.userProfile.findMany({
      select: {
        researchLab: true,
      },
      distinct: ["researchLab"],
      where: {
        researchLab: {
          not: "",
        },
      },
      orderBy: {
        researchLab: "asc",
      },
    });

    return labs.map((lab) => lab.researchLab).filter(Boolean);
  } catch (error) {
    console.error("Error fetching labs:", error);
    return [];
  }
}

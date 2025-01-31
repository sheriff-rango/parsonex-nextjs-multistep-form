import { db } from "@/server/db";
import { reps } from "@/server/db/schema";
import { desc, eq } from "drizzle-orm";

export type Rep = {
  repId: string;
  pcm: string | null;
  firstname: string | null;
  lastname: string | null;
  fullname: string | null;
  isActive: boolean;
  repType: string;
  isBranchMgr: boolean;
  profilePictureUrl: string | null;
};

export async function getReps() {
  try {
    const results = await db
      .select({
        repId: reps.repId,
        pcm: reps.pcm,
        firstname: reps.firstname,
        lastname: reps.lastname,
        fullname: reps.fullname,
        isActive: reps.isActive,
        repType: reps.repType,
        isBranchMgr: reps.isBranchMgr,
        profilePictureUrl: reps.profilePictureUrl,
      })
      .from(reps)
      .orderBy(desc(reps.createdon));

    return { reps: results };
  } catch (error) {
    console.error("Error fetching reps:", error);
    throw new Error("Failed to fetch reps");
  }
}

export async function getRepById(repId: string) {
  try {
    const result = await db
      .select()
      .from(reps)
      .where(eq(reps.repId, repId))
      .limit(1);

    return result[0] || null;
  } catch (error) {
    console.error("Error fetching rep:", error);
    throw new Error("Failed to fetch rep");
  }
}

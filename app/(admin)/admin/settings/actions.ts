"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getSiteSettings() {
    const settings = await prisma.siteSetting.findUnique({
        where: { id: "singleton" },
    });

    if (!settings) {
        // Initialize with defaults if not exists
        return await prisma.siteSetting.create({
            data: { id: "singleton" },
        });
    }

    return settings;
}

export async function updateSiteSettings(data: {
    adminWhatsapp?: string;
    siteTitle?: string;
    siteDescription?: string;
}) {
    await prisma.siteSetting.upsert({
        where: { id: "singleton" },
        update: data,
        create: { id: "singleton", ...data },
    });

    revalidatePath("/admin/settings");
    revalidatePath("/about");
    revalidatePath("/");

    return { success: true };
}

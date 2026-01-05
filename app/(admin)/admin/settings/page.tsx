import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getSiteSettings } from "./actions";
import { SettingsForm } from "./components/settings-form";

export default async function SettingsPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user || session.user.role !== "admin") {
        redirect("/admin-login");
    }

    const siteSettings = await getSiteSettings();

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Admin Settings</h1>
                <p className="text-muted-foreground">
                    Manage your account credentials and dynamic site configurations.
                </p>
            </div>

            <SettingsForm user={session.user} siteSettings={siteSettings} />
        </div>
    );
}

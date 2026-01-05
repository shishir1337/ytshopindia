"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { updateSiteSettings } from "../actions";
import { User } from "better-auth";

interface SettingsFormProps {
    user: any;
    siteSettings: {
        adminWhatsapp: string;
        siteTitle: string;
        siteDescription: string | null;
    };
}

export function SettingsForm({ user, siteSettings }: SettingsFormProps) {
    const [loading, setLoading] = useState(false);

    // Account State
    const [email, setEmail] = useState(user.email);
    const [newPassword, setNewPassword] = useState("");

    // Site State
    const [whatsapp, setWhatsapp] = useState(siteSettings.adminWhatsapp);
    const [title, setTitle] = useState(siteSettings.siteTitle);
    const [description, setDescription] = useState(siteSettings.siteDescription || "");

    const handleUpdateAccount = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (email !== user.email) {
                const { error } = await authClient.changeEmail({
                    newEmail: email,
                });
                if (error) throw new Error(error.message);
            }

            if (newPassword) {
                const { error } = await authClient.changePassword({
                    newPassword,
                    currentPassword: "", // Better Auth updatePassword might require current if configured, but update will work if session is active
                    revokeOtherSessions: true,
                });
                if (error) throw new Error(error.message);
            }

            toast.success("Account updated successfully");
            setNewPassword("");
        } catch (err: any) {
            toast.error(err.message || "Failed to update account");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateSite = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateSiteSettings({
                adminWhatsapp: whatsapp,
                siteTitle: title,
                siteDescription: description,
            });
            toast.success("Site settings updated successfully");
        } catch (err: any) {
            toast.error("Failed to update site settings");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Tabs defaultValue="account" className="space-y-6">
            <TabsList>
                <TabsTrigger value="account">Account Settings</TabsTrigger>
                <TabsTrigger value="site">Site Configuration</TabsTrigger>
            </TabsList>

            <TabsContent value="account">
                <Card>
                    <CardHeader>
                        <CardTitle>Account Details</CardTitle>
                        <CardDescription>Update your admin login information.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleUpdateAccount} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Admin Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">New Password (leave blank to keep current)</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="••••••••"
                                />
                            </div>
                            <Button type="submit" disabled={loading}>
                                {loading ? "Saving..." : "Save Changes"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="site">
                <Card>
                    <CardHeader>
                        <CardTitle>Site Settings</CardTitle>
                        <CardDescription>Global configuration for YTShop India.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleUpdateSite} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="whatsapp">Admin WhatsApp Number</Label>
                                <Input
                                    id="whatsapp"
                                    value={whatsapp}
                                    onChange={(e) => setWhatsapp(e.target.value)}
                                    placeholder="+919101782780"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="siteTitle">Site Title</Label>
                                <Input
                                    id="siteTitle"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="siteDescription">Site Description</Label>
                                <Input
                                    id="siteDescription"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                            <Button type="submit" disabled={loading}>
                                {loading ? "Saving..." : "Save Changes"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
}

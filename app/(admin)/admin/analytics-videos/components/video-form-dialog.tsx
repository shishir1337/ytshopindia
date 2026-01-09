"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface VideoFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    video?: any;
    onSuccess: () => void;
}

export function VideoFormDialog({
    open,
    onOpenChange,
    video,
    onSuccess,
}: VideoFormDialogProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        videoId: "",
        title: "",
        thumbnail: "",
        order: 0,
    });

    useEffect(() => {
        if (video) {
            setFormData({
                videoId: video.videoId || "",
                title: video.title || "",
                thumbnail: video.thumbnail || "",
                order: video.order || 0,
            });
        } else {
            setFormData({
                videoId: "",
                title: "",
                thumbnail: "",
                order: 0,
            });
        }
    }, [video, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = video
                ? `/api/admin/analytics-videos/${video.id}`
                : "/api/admin/analytics-videos";
            const method = video ? "PATCH" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    order: Number(formData.order)
                }),
            });

            if (response.ok) {
                toast.success(
                    video ? "Video updated successfully" : "Video created successfully"
                );
                onSuccess();
                onOpenChange(false);
            } else {
                const data = await response.json();
                toast.error(data.error || "Something went wrong");
            }
        } catch (error) {
            console.error("Error saving video:", error);
            toast.error("Error saving video");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{video ? "Edit Video" : "Add New Video"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Video Title</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, title: e.target.value }))
                            }
                            placeholder="e.g., How to analyze channel health"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="videoId">YouTube Video ID</Label>
                        <div className="flex gap-2">
                            <Input
                                id="videoId"
                                value={formData.videoId}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, videoId: e.target.value }))
                                }
                                placeholder="e.g., dQw4w9WgXcQ"
                                required
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    if (formData.videoId) {
                                        setFormData(prev => ({
                                            ...prev,
                                            thumbnail: `https://img.youtube.com/vi/${formData.videoId}/maxresdefault.jpg`
                                        }));
                                    }
                                }}
                            >
                                Get Thumbnail
                            </Button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="thumbnail">Custom Thumbnail URL (Optional)</Label>
                        <Input
                            id="thumbnail"
                            value={formData.thumbnail}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, thumbnail: e.target.value }))
                            }
                            placeholder="Leave empty to use YouTube default"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="order">Display Order</Label>
                        <Input
                            id="order"
                            type="number"
                            value={formData.order}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, order: parseInt(e.target.value) || 0 }))
                            }
                        />
                    </div>
                    <DialogFooter className="pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
                            {video ? "Save Changes" : "Create Video"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

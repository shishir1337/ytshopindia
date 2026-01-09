"use client";

import { useState, useEffect } from "react";
import { Plus, Video, Trash2, Edit2, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import { VideoFormDialog } from "./components/video-form-dialog";

export default function AnalyticsVideosPage() {
    const [videos, setVideos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingVideo, setEditingVideo] = useState<any>(null);

    const fetchVideos = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/admin/analytics-videos");
            if (response.ok) {
                const data = await response.json();
                setVideos(data.videos);
            } else {
                toast.error("Failed to fetch videos");
            }
        } catch (error) {
            console.error("Error fetching videos:", error);
            toast.error("Error fetching videos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVideos();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this video?")) return;

        try {
            const response = await fetch(`/api/admin/analytics-videos/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                toast.success("Video deleted successfully");
                fetchVideos();
            } else {
                toast.error("Failed to delete video");
            }
        } catch (error) {
            console.error("Error deleting video:", error);
            toast.error("Error deleting video");
        }
    };

    const handleEdit = (video: any) => {
        setEditingVideo(video);
        setIsDialogOpen(true);
    };

    const handleCreate = () => {
        setEditingVideo(null);
        setIsDialogOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin">
                            <ArrowLeft className="size-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Analytics Videos</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Manage YouTube videos showcased on the homepage
                        </p>
                    </div>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 size-4" />
                    Add Video
                </Button>
            </div>

            {loading ? (
                <div className="flex h-[400px] items-center justify-center">
                    <Loader2 className="size-8 animate-spin text-primary" />
                </div>
            ) : videos.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[400px] border border-dashed rounded-xl bg-muted/20">
                    <div className="size-16 bg-muted rounded-full flex items-center justify-center mb-4 text-muted-foreground">
                        <Video className="size-8" />
                    </div>
                    <h3 className="text-xl font-semibold">No Videos Found</h3>
                    <p className="text-muted-foreground mb-6">Start by adding your first analytics video.</p>
                    <Button onClick={handleCreate}>
                        <Plus className="mr-2 size-4" />
                        Add Video
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos.map((video) => (
                        <div key={video.id} className="group relative overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-md">
                            <div className="aspect-video relative overflow-hidden bg-muted">
                                <img
                                    src={video.thumbnail || `https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`}
                                    alt={video.title}
                                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <Button size="icon" variant="secondary" onClick={() => handleEdit(video)}>
                                        <Edit2 className="size-4" />
                                    </Button>
                                    <Button size="icon" variant="destructive" onClick={() => handleDelete(video.id)}>
                                        <Trash2 className="size-4" />
                                    </Button>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-foreground line-clamp-1">{video.title}</h3>
                                <p className="text-xs text-muted-foreground mt-1 font-mono">ID: {video.videoId}</p>
                                <div className="mt-2 flex items-center justify-between">
                                    <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                        Order: {video.order}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <VideoFormDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                video={editingVideo}
                onSuccess={fetchVideos}
            />
        </div>
    );
}

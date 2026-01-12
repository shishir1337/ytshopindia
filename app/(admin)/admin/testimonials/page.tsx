"use client";

import { useState, useEffect } from "react";
import { Plus, Quote, Trash2, Edit2, Loader2, ArrowLeft, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import { TestimonialFormDialog } from "./components/testimonial-form-dialog";

export default function TestimonialsPage() {
    const [testimonials, setTestimonials] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState<any>(null);

    const fetchTestimonials = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/admin/testimonials");
            if (response.ok) {
                const data = await response.json();
                setTestimonials(data.testimonials);
            } else {
                toast.error("Failed to fetch testimonials");
            }
        } catch (error) {
            console.error("Error fetching testimonials:", error);
            toast.error("Error fetching testimonials");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this testimonial?")) return;

        try {
            const response = await fetch(`/api/admin/testimonials/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                toast.success("Testimonial deleted successfully");
                fetchTestimonials();
            } else {
                toast.error("Failed to delete testimonial");
            }
        } catch (error) {
            console.error("Error deleting testimonial:", error);
            toast.error("Error deleting testimonial");
        }
    };

    const handleEdit = (testimonial: any) => {
        setEditingTestimonial(testimonial);
        setIsDialogOpen(true);
    };

    const handleCreate = () => {
        setEditingTestimonial(null);
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
                        <h1 className="text-3xl font-bold text-foreground">Testimonials</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Manage creator testimonials shown on the homepage
                        </p>
                    </div>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 size-4" />
                    Add Testimonial
                </Button>
            </div>

            {loading ? (
                <div className="flex h-[400px] items-center justify-center">
                    <Loader2 className="size-8 animate-spin text-primary" />
                </div>
            ) : testimonials.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[400px] border border-dashed rounded-xl bg-muted/20">
                    <div className="size-16 bg-muted rounded-full flex items-center justify-center mb-4 text-muted-foreground">
                        <Quote className="size-8" />
                    </div>
                    <h3 className="text-xl font-semibold">No Testimonials Found</h3>
                    <p className="text-muted-foreground mb-6">Start by adding your first testimonial.</p>
                    <Button onClick={handleCreate}>
                        <Plus className="mr-2 size-4" />
                        Add Testimonial
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((testimonial) => (
                        <div key={testimonial.id} className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-md">
                            <div className="p-6 flex-1">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 rounded-full overflow-hidden bg-muted border">
                                            {testimonial.src ? (
                                                <img src={testimonial.src} alt={testimonial.name} className="size-full object-cover" />
                                            ) : (
                                                <ImageIcon className="size-full p-2 text-muted-foreground" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-foreground line-clamp-1">{testimonial.name}</h3>
                                            <p className="text-xs text-muted-foreground">{testimonial.designation}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button size="icon" variant="ghost" className="size-8" onClick={() => handleEdit(testimonial)}>
                                            <Edit2 className="size-4" />
                                        </Button>
                                        <Button size="icon" variant="ghost" className="size-8 text-destructive hover:text-destructive" onClick={() => handleDelete(testimonial.id)}>
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </div>
                                </div>
                                <Quote className="size-5 text-primary/20 mb-2" />
                                <p className="text-sm text-foreground/80 italic line-clamp-4">"{testimonial.quote}"</p>
                            </div>
                            <div className="px-6 py-3 bg-muted/30 border-t flex items-center justify-between">
                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${testimonial.active ? 'bg-green-500/10 text-green-600' : 'bg-yellow-500/10 text-yellow-600'}`}>
                                    {testimonial.active ? 'Active' : 'Inactive'}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    Order: {testimonial.order}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <TestimonialFormDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                testimonial={editingTestimonial}
                onSuccess={fetchTestimonials}
            />
        </div>
    );
}

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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageUpload } from "@/components/admin/image-upload";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface TestimonialFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    testimonial?: any;
    onSuccess: () => void;
}

export function TestimonialFormDialog({
    open,
    onOpenChange,
    testimonial,
    onSuccess,
}: TestimonialFormDialogProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        quote: "",
        name: "",
        designation: "",
        src: "",
        active: true,
        order: 0,
    });

    useEffect(() => {
        if (testimonial) {
            setFormData({
                quote: testimonial.quote || "",
                name: testimonial.name || "",
                designation: testimonial.designation || "",
                src: testimonial.src || "",
                active: testimonial.active ?? true,
                order: testimonial.order || 0,
            });
        } else {
            setFormData({
                quote: "",
                name: "",
                designation: "",
                src: "",
                active: true,
                order: 0,
            });
        }
    }, [testimonial, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = testimonial
                ? `/api/admin/testimonials/${testimonial.id}`
                : "/api/admin/testimonials";
            const method = testimonial ? "PATCH" : "POST";

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
                    testimonial ? "Testimonial updated successfully" : "Testimonial created successfully"
                );
                onSuccess();
                onOpenChange(false);
            } else {
                const data = await response.json();
                toast.error(data.error || "Something went wrong");
            }
        } catch (error) {
            console.error("Error saving testimonial:", error);
            toast.error("Error saving testimonial");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{testimonial ? "Edit Testimonial" : "Add New Testimonial"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Creator Name</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, name: e.target.value }))
                            }
                            placeholder="e.g., Rahul Sharma"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="designation">Designation</Label>
                        <Input
                            id="designation"
                            value={formData.designation}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, designation: e.target.value }))
                            }
                            placeholder="e.g., Tech Content Creator"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="quote">Quote</Label>
                        <Textarea
                            id="quote"
                            value={formData.quote}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, quote: e.target.value }))
                            }
                            placeholder="Enter the creator's testimonial..."
                            required
                            rows={4}
                        />
                    </div>
                    <div className="space-y-2">
                        <ImageUpload
                            label="Creator Avatar"
                            value={formData.src}
                            onChange={(url) => setFormData((prev) => ({ ...prev, src: url }))}
                            uploadType="testimonials"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
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
                        <div className="flex items-center space-x-2 pt-8">
                            <Checkbox
                                id="active"
                                checked={formData.active}
                                onCheckedChange={(checked) =>
                                    setFormData((prev) => ({ ...prev, active: checked === true }))
                                }
                            />
                            <Label htmlFor="active">Active</Label>
                        </div>
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
                            {testimonial ? "Save Changes" : "Create Testimonial"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

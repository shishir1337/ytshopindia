import Image from "next/image";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface RecentBlogPost {
    id: string;
    title: string;
    slug: string;
    image: string | null;
    publishedAt: Date | null;
}

interface RecentBlogsProps {
    posts: RecentBlogPost[];
}

export function RecentBlogs({ posts }: RecentBlogsProps) {
    if (posts.length === 0) return null;

    function formatDate(date: Date | null) {
        if (!date) return "";
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        }).format(new Date(date));
    }

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-foreground">Recent Blogs</h3>
            <div className="space-y-4">
                {posts.map((post) => (
                    <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                        <Card className="overflow-hidden border-none bg-transparent shadow-none transition-colors hover:bg-muted/50">
                            <CardContent className="flex gap-4 p-2">
                                <div className="relative aspect-square w-20 shrink-0 overflow-hidden rounded-md border border-border">
                                    <Image
                                        src={post.image || "/placeholder-blog.jpg"}
                                        alt={post.title}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                                        unoptimized={post.image?.startsWith("/uploads/")}
                                    />
                                </div>
                                <div className="flex flex-col justify-center space-y-1">
                                    <h4 className="line-clamp-2 text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                                        {post.title}
                                    </h4>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Calendar className="size-3" />
                                        <time dateTime={post.publishedAt?.toISOString()}>
                                            {formatDate(post.publishedAt)}
                                        </time>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}

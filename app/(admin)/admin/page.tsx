import Link from "next/link";
import {
  FileText,
  Youtube,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  Plus,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getDashboardData } from "./lib/get-dashboard-data";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatRelativeTime(date: Date) {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(date);
}

export default async function AdminDashboardPage() {
  const data = await getDashboardData();

  const stats = [
    {
      title: "Total Listings",
      value: data.totalListings,
      subtitle: `${data.approvedListings} approved, ${data.pendingListings} pending`,
      icon: Youtube,
      href: "/admin/listings",
      color: "blue",
    },
    {
      title: "Total Blog Posts",
      value: data.totalBlogs,
      subtitle: `${data.publishedBlogs} published, ${data.draftBlogs} drafts`,
      icon: FileText,
      href: "/admin/blog",
      color: "purple",
    },
    {
      title: "Pending Listings",
      value: data.pendingListings,
      subtitle: "Require review",
      icon: AlertCircle,
      href: "/admin/listings?status=pending",
      color: "amber",
    },
    {
      title: "Published Posts",
      value: data.publishedBlogs,
      subtitle: `${Math.round((data.publishedBlogs / data.totalBlogs) * 100) || 0}% of total`,
      icon: CheckCircle2,
      href: "/admin/blog?published=true",
      color: "emerald",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Dashboard Overview
          </h1>
          <p className="mt-1 sm:mt-2 text-sm text-muted-foreground">
            Welcome back! Here's what's happening with your platform today.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm" className="flex-1 sm:flex-initial">
            <Link href="/admin/listings">
              <Youtube className="mr-2 size-4" />
              <span className="hidden sm:inline">View Listings</span>
              <span className="sm:hidden">Listings</span>
            </Link>
          </Button>
          <Button asChild size="sm" className="flex-1 sm:flex-initial">
            <Link href="/admin/blog/new">
              <Plus className="mr-2 size-4" />
              <span className="hidden sm:inline">New Post</span>
              <span className="sm:hidden">Post</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.title}
              href={stat.href}
              className="group relative overflow-hidden rounded-xl border border-border bg-card p-4 sm:p-6 shadow-sm transition-all duration-200 hover:border-primary/50 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1.5 sm:space-y-2 flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                    {stat.title}
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {stat.subtitle}
                  </p>
                </div>
                <div
                  className={`flex-shrink-0 rounded-lg p-2.5 sm:p-3 ${
                    stat.color === "blue"
                      ? "bg-blue-500/10"
                      : stat.color === "purple"
                      ? "bg-purple-500/10"
                      : stat.color === "emerald"
                      ? "bg-emerald-500/10"
                      : "bg-amber-500/10"
                  }`}
                >
                  <Icon
                    className={`size-5 sm:size-6 ${
                      stat.color === "blue"
                        ? "text-blue-600"
                        : stat.color === "purple"
                        ? "text-purple-600"
                        : stat.color === "emerald"
                        ? "text-emerald-600"
                        : "text-amber-600"
                    }`}
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Listings */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card shadow-sm">
          <div className="border-b border-border p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-foreground">
                  Recent Listings
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                  Latest channel listings
                </p>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/listings">
                  <span className="hidden sm:inline">View All</span>
                  <ArrowRight className="size-4 sm:ml-2" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="p-4 sm:p-6">
            {data.recentListings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center">
                <Youtube className="size-10 sm:size-12 text-muted-foreground/50" />
                <p className="mt-4 text-sm font-medium text-foreground">
                  No listings yet
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Get started by reviewing pending listings
                </p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {data.recentListings.map((listing) => (
                  <Link
                    key={listing.id}
                    href={`/admin/listings/${listing.id}/edit`}
                    className="group flex items-center justify-between rounded-lg border border-border bg-background p-3 sm:p-4 transition-colors hover:border-primary/50 hover:bg-accent/50"
                  >
                    <div className="flex-1 space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm sm:text-base font-medium text-foreground group-hover:text-primary truncate">
                          {listing.title}
                        </h3>
                        <Badge
                          variant={
                            listing.status === "approved"
                              ? "default"
                              : listing.status === "pending"
                              ? "secondary"
                              : "destructive"
                          }
                          className="text-xs flex-shrink-0"
                        >
                          {listing.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-4 text-xs text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1">
                          <Calendar className="size-3" />
                          {formatDate(listing.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="size-3" />
                          {formatRelativeTime(listing.updatedAt)}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 flex-shrink-0 ml-2" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions & Recent Blog Posts */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="rounded-xl border border-border bg-card shadow-sm">
            <div className="border-b border-border p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-foreground">
                Quick Actions
              </h2>
            </div>
            <div className="p-4 sm:p-6 space-y-2">
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/admin/listings">
                  <Youtube className="mr-2 size-4" />
                  Manage Listings
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/admin/blog/new">
                  <Plus className="mr-2 size-4" />
                  New Blog Post
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/admin/blog">
                  <FileText className="mr-2 size-4" />
                  Manage Posts
                </Link>
              </Button>
            </div>
          </div>

          {/* Recent Blog Posts */}
          <div className="rounded-xl border border-border bg-card shadow-sm">
            <div className="border-b border-border p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-foreground">
                    Recent Posts
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                    Latest blog posts
                  </p>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin/blog">
                    <span className="hidden sm:inline">View All</span>
                    <ArrowRight className="size-4 sm:ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="p-4 sm:p-6">
              {data.recentBlogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <FileText className="size-10 text-muted-foreground/50" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    No posts yet
                  </p>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {data.recentBlogs.map((post) => (
                    <Link
                      key={post.id}
                      href={`/admin/blog/${post.id}/edit`}
                      className="group flex items-center justify-between rounded-lg border border-border bg-background p-3 transition-colors hover:border-primary/50 hover:bg-accent/50"
                    >
                      <div className="flex-1 space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-medium text-foreground group-hover:text-primary truncate">
                            {post.title}
                          </h3>
                          <Badge
                            variant={post.published ? "default" : "secondary"}
                            className="text-xs flex-shrink-0"
                          >
                            {post.published ? "Published" : "Draft"}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {formatRelativeTime(post.updatedAt)}
                        </p>
                      </div>
                      <ArrowRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 flex-shrink-0 ml-2" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

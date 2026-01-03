import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { FileText, Users, Youtube, BarChart3, TrendingUp, Eye } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

async function getStats() {
  const [blogCount, userCount, publishedBlogs] = await Promise.all([
    prisma.blogPost.count(),
    prisma.user.count(),
    prisma.blogPost.count({ where: { published: true } }),
  ]);

  return {
    blogCount,
    userCount,
    publishedBlogs,
  };
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  const statCards = [
    {
      title: "Total Blog Posts",
      value: stats.blogCount,
      change: "+12%",
      icon: FileText,
      href: "/admin/blog",
      description: `${stats.publishedBlogs} published`,
    },
    {
      title: "Total Users",
      value: stats.userCount,
      change: "+8%",
      icon: Users,
      href: "/admin/users",
      description: "Registered users",
    },
    {
      title: "Channels",
      value: 0,
      change: "+5%",
      icon: Youtube,
      href: "/admin/channels",
      description: "YouTube channels",
    },
    {
      title: "Page Views",
      value: "12.5K",
      change: "+23%",
      icon: Eye,
      href: "/admin/analytics",
      description: "Last 30 days",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Overview of your YT Shop India platform
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} href={stat.href}>
              <div className="group relative overflow-hidden rounded-lg border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {stat.description}
                    </p>
                  </div>
                  <div className="rounded-lg bg-primary/10 p-3">
                    <Icon className="size-6 text-primary" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <TrendingUp className="size-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">
                    {stat.change}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    from last month
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              Quick Actions
            </h2>
          </div>
          <div className="space-y-3">
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/admin/blog/new">
                <FileText className="mr-2 size-4" />
                Create New Blog Post
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/admin/users">
                <Users className="mr-2 size-4" />
                Manage Users
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/admin/channels">
                <Youtube className="mr-2 size-4" />
                View Channels
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/admin/analytics">
                <BarChart3 className="mr-2 size-4" />
                View Analytics
              </Link>
            </Button>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              Recent Activity
            </h2>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-primary/10 p-2">
                <FileText className="size-4 text-primary" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-foreground">
                  New blog post created
                </p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-green-500/10 p-2">
                <Users className="size-4 text-green-600" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-foreground">
                  New user registered
                </p>
                <p className="text-xs text-muted-foreground">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-blue-500/10 p-2">
                <Youtube className="size-4 text-blue-600" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-foreground">
                  Channel listing updated
                </p>
                <p className="text-xs text-muted-foreground">1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


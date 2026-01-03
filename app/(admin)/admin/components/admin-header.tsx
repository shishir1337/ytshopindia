"use client";

import { LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";

interface AdminHeaderProps {
  user: {
    id: string;
    name?: string | null;
    email: string;
    image?: string | null;
  };
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/admin-login");
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-foreground">
          Admin Dashboard
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name || user.email}
                    className="size-full rounded-full object-cover"
                  />
                ) : (
                  <User className="size-4" />
                )}
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-medium text-foreground">
                  {user.name || "Admin"}
                </p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user.name || "Admin"}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="cursor-pointer"
            >
              <LogOut className="mr-2 size-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}


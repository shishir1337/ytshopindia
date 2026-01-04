"use client";

import { LogOut, User, Menu } from "lucide-react";
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
    <header className="flex h-14 lg:h-16 items-center justify-between border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 px-4 lg:px-6 shadow-sm">
      <div className="flex items-center gap-2 lg:gap-4">
        <div className="flex items-center gap-2">
          <div className="h-1 w-1 rounded-full bg-primary hidden sm:block" />
          <span className="text-xs sm:text-sm font-medium text-muted-foreground">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 lg:gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 hover:bg-accent h-9 lg:h-10"
            >
              <div className="flex size-8 lg:size-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-md ring-2 ring-background">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name || user.email}
                    className="size-full rounded-full object-cover"
                  />
                ) : (
                  <User className="size-3.5 lg:size-4" />
                )}
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-xs lg:text-sm font-semibold text-foreground">
                  {user.name || "Admin"}
                </p>
                <p className="text-[10px] lg:text-xs text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold">{user.name || "Admin"}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="cursor-pointer text-destructive focus:text-destructive"
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

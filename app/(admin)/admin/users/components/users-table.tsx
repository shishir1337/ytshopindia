"use client"

import { useEffect, useState } from "react"
import { authClient } from "@/lib/auth-client"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal, Ban, UserCheck, Shield, UserX, User } from "lucide-react"
import { toast } from "sonner"
import { UsersTableSkeleton } from "./users-table-skeleton"

interface UserType {
    id: string
    name: string
    email: string
    image?: string
    role?: string
    banned?: boolean
    createdAt: string
}

export function UsersTable() {
    const [users, setUsers] = useState<UserType[]>([])
    const [loading, setLoading] = useState(true)

    const fetchUsers = async () => {
        try {
            const { data, error } = await authClient.admin.listUsers({
                query: {
                    limit: 100
                }
            })
            if (error) {
                toast.error(error.message || "Failed to fetch users")
                return
            }
            if (data) {
                setUsers(data.users as any)
            }
        } catch (err) {
            toast.error("An error occurred while fetching users")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    const handleBanUser = async (userId: string) => {
        try {
            await authClient.admin.banUser({
                userId,
                banReason: "Admin action"
            })
            toast.success("User banned successfully")
            fetchUsers()
        } catch (error) {
            toast.error("Failed to ban user")
        }
    }

    const handleUnbanUser = async (userId: string) => {
        try {
            await authClient.admin.unbanUser({
                userId
            })
            toast.success("User unbanned successfully")
            fetchUsers()
        } catch (error) {
            toast.error("Failed to unban user")
        }
    }

    const handleSetRole = async (userId: string, role: "user" | "admin") => {
        try {
            await authClient.admin.setRole({
                userId,
                role
            })
            toast.success(`User role updated to ${role}`)
            fetchUsers()
        } catch (error) {
            toast.error("Failed to update user role")
        }
    }

    if (loading) {
        return <UsersTableSkeleton />
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                            No users found.
                        </TableCell>
                    </TableRow>
                ) : (
                    users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell className="flex items-center gap-3">
                                <Avatar className="size-8">
                                    <AvatarImage src={user.image} alt={user.name} />
                                    <AvatarFallback>{user.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <span className="font-medium">{user.name}</span>
                                    <span className="text-xs text-muted-foreground">{user.email}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                                    {user.role || "user"}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                {user.banned ? (
                                    <Badge variant="destructive">Banned</Badge>
                                ) : (
                                    <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                                        Active
                                    </Badge>
                                )}
                            </TableCell>
                            <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <MoreHorizontal className="size-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        {user.banned ? (
                                            <DropdownMenuItem onClick={() => handleUnbanUser(user.id)}>
                                                <UserCheck className="mr-2 size-4" />
                                                Unban User
                                            </DropdownMenuItem>
                                        ) : (
                                            <DropdownMenuItem onClick={() => handleBanUser(user.id)} className="text-destructive focus:text-destructive">
                                                <Ban className="mr-2 size-4" />
                                                Ban User
                                            </DropdownMenuItem>
                                        )}

                                        {user.role !== "admin" && (
                                            <DropdownMenuItem onClick={() => handleSetRole(user.id, "admin")}>
                                                <Shield className="mr-2 size-4" />
                                                Make Admin
                                            </DropdownMenuItem>
                                        )}

                                        {user.role === "admin" && (
                                            <DropdownMenuItem onClick={() => handleSetRole(user.id, "user")}>
                                                <User className="mr-2 size-4" />
                                                Remove Admin
                                            </DropdownMenuItem>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    )
}


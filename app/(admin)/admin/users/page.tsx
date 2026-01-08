import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UsersTable } from "./components/users-table"

export default function UsersPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Users</h1>
                    <p className="text-muted-foreground">Manage system users and their roles</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Users</CardTitle>
                    <CardDescription>
                        A list of all registered users including their name, email, role, and status.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <UsersTable />
                </CardContent>
            </Card>
        </div>
    )
}

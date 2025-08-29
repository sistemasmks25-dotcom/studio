"use client";

import { MoreHorizontal, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import type { User } from "@/lib/data";
import { getUsers } from "@/lib/actions";

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    getUsers().then(setUsers);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Users</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Invite User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>Manage users and their permissions.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={`https://picsum.photos/40/40?random=${u.id}`} data-ai-hint="profile picture" />
                      <AvatarFallback>{u.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div>{u.name}</div>
                      <div className="text-sm text-muted-foreground">{u.email}</div>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant={u.role === 'Admin' ? 'default' : 'secondary'}>{u.role}</Badge></TableCell>
                  <TableCell>{u.department}</TableCell>
                  <TableCell>{formatDistanceToNow(new Date(u.lastLogin), { addSuffix: true })}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Reset Password</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Deactivate User</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

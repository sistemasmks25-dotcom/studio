"use client";

import { Building, MoreHorizontal, PlusCircle, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { mockDepartments } from "@/lib/data";

export function DepartmentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Departments</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Department
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Departments</CardTitle>
          <CardDescription>Manage your company's departments.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department</TableHead>
                <TableHead>Members</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockDepartments.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    {d.name}
                  </TableCell>
                  <TableCell className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    {d.memberCount}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Manage Members</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
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

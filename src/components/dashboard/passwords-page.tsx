"use client";

import { useState } from "react";
import { PlusCircle, MoreHorizontal, Copy, Edit, Trash2, KeyRound, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { mockPasswords } from "@/lib/data";
import type { Password } from "@/lib/data";
import { PasswordForm } from "./password-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

export function PasswordsPage() {
  const [passwords, setPasswords] = useState<Password[]>(mockPasswords);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPassword, setSelectedPassword] = useState<Password | null>(null);
  const { toast } = useToast();

  const handleEdit = (password: Password) => {
    setSelectedPassword(password);
    setIsFormOpen(true);
  };
  
  const handleAddNew = () => {
    setSelectedPassword(null);
    setIsFormOpen(true);
  };

  const handleCopy = (password: string) => {
    navigator.clipboard.writeText(password);
    toast({ title: "Copied to clipboard!" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Passwords</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Password
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{selectedPassword ? "Edit Password" : "Add New Password"}</DialogTitle>
            </DialogHeader>
            <PasswordForm password={selectedPassword} onFormSubmit={() => setIsFormOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Items</CardTitle>
          <CardDescription>A list of all your saved credentials.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Folder</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {passwords.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <KeyRound className="h-4 w-4 text-muted-foreground" />
                    {p.name}
                  </TableCell>
                  <TableCell>{p.username}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                        <Folder className="h-3 w-3" />
                        {p.folder}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleCopy(p.passwordValue)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy Password
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(p)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
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

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function AdminLink() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      document.cookie = `admin-auth=${password}; path=/; max-age=86400`; // 24 hours
      setPassword("");
      router.push("/admin");
    } else {
      setError(true);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="text-sm text-muted-foreground hover:text-primary opacity-50">
          Privicy Policy
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Admin Access Required</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            className={error ? "border-red-500" : ""}
            autoFocus
          />
          {error && (
            <p className="text-sm text-red-500">Incorrect password</p>
          )}
          <Button type="submit" className="w-full">
            Access Admin Panel
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

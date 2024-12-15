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

const ADMIN_PASSWORD = "22984695"

export function AdminLink() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      document.cookie = `admin-auth=${password}; path=/; max-age=86400; SameSite=Strict`;
      setPassword("");
      router.push("/admin");
    } else {
      setError(true);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="text-sm text-muted-foreground hover:text-primary">
          Privacy Policy
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Verify Access</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="Enter verification code"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            className={error ? "border-red-500" : ""}
          />
          {error && (
            <p className="text-sm text-red-500">Invalid verification code</p>
          )}
          <Button type="submit" className="w-full">
            Verify
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

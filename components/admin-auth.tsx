"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ADMIN_PASSWORD = "22984695"

export function AdminAuth({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [open, setOpen] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const auth = document.cookie.split('; ').find(row => row.startsWith('admin-auth='))?.split('=')[1];
    console.log('Admin Auth Component - Cookie Auth:', auth);
    
    if (auth === ADMIN_PASSWORD)  {
      setIsAuthenticated(true);
      setOpen(false);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Admin Auth Component - Submitted Password:', password);
    
    if (password === ADMIN_PASSWORD) {
      document.cookie = `admin-auth=${password}; path=/; max-age=86400; SameSite=Strict; HttpOnly`;
      setIsAuthenticated(true);
      setOpen(false);
    } else {
      setError(true);
    }
  };

  if (!isAuthenticated) {
    return (
      <Dialog open={open} onOpenChange={(open) => {
        if (!open) {
          router.push("/");
        }
      }}>
        <DialogContent>
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

  return <>{children}</>;
}

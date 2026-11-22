"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  ShieldCheck,
  ArrowLeft,
  Trash2,
  CheckCircle2,
  Star,
  Search,
} from "lucide-react";
import { DemoSwitcher } from "@/components/DemoSwitcher";

interface UserRecord {
  id: string;
  fullName: string;
  email: string;
  role: "CHILD" | "PARENT" | "ADMIN";
  createdAt: string;
  childProfile?: {
    id: string;
    age: number;
    level: number;
    xpPoints: number;
    currentStreak: number;
  };
  parentProfile?: {
    id: string;
    phoneNumber?: string;
    children: Array<{ id: string; user: { fullName: string } }>;
  };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const json = await res.json();
      setUsers(json.users || []);
    } catch (e) {
      console.error("Fetch users error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete user "${name}"?`)) return;
    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== id));
      }
    } catch (e) {
      console.error("Delete user error:", e);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 bg-gradient-to-b from-slate-100 via-white to-slate-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="mb-6">
          <DemoSwitcher compact={true} />
        </div>

        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-black text-slate-500 hover:text-charcoal-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Admin Dashboard</span>
        </Link>

        <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-card-soft mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-babyBlue-600 block">
                User Directory
              </span>
              <h1 className="text-2xl font-black text-charcoal-900">
                Manage Accounts ({users.length})
              </h1>
            </div>

            {/* Search input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-babyBlue-400"
              />
            </div>
          </div>

          {isLoading ? (
            <p className="text-center py-10 font-bold text-slate-400">Loading users...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[11px] font-black">
                    <th className="pb-3 pl-2">User</th>
                    <th className="pb-3">Role</th>
                    <th className="pb-3">Profile Info</th>
                    <th className="pb-3">Created</th>
                    <th className="pb-3 pr-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-bold">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 pl-2">
                        <span className="text-charcoal-900 block font-black">{u.fullName}</span>
                        <span className="text-slate-400 text-xs font-medium">{u.email}</span>
                      </td>
                      <td className="py-3.5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-black uppercase ${
                            u.role === "ADMIN"
                              ? "bg-charcoal-900 text-gold-400"
                              : u.role === "PARENT"
                              ? "bg-mint-100 text-mint-800"
                              : "bg-babyBlue-100 text-babyBlue-800"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3.5 text-slate-600 text-xs">
                        {u.role === "CHILD" && u.childProfile ? (
                          <span>
                            Age {u.childProfile.age} • Level {u.childProfile.level} ({u.childProfile.xpPoints} XP)
                          </span>
                        ) : u.role === "PARENT" && u.parentProfile ? (
                          <span>{u.parentProfile.children.length} linked child profile(s)</span>
                        ) : (
                          <span className="text-slate-400">System Admin</span>
                        )}
                      </td>
                      <td className="py-3.5 text-slate-400 text-xs font-normal">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 pr-2 text-right">
                        {u.role !== "ADMIN" && (
                          <button
                            onClick={() => handleDelete(u.id, u.fullName)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

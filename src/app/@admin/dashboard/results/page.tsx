"use client";

import { useState } from "react";
import { Search, Plus, Filter, Download, MoreVertical, CheckCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const resultsData = [
  { id: "S101", name: "Alice Johnson", dept: "CSE", sem: 5, gpa: 9.2, status: "Published" },
  { id: "S102", name: "Bob Wilson", dept: "ECE", sem: 3, gpa: 8.5, status: "Pending" },
  { id: "S103", name: "Charlie Davis", dept: "MECH", sem: 7, gpa: 7.8, status: "Published" },
  { id: "S104", name: "Diana Prince", dept: "CSE", sem: 5, gpa: 9.8, status: "Published" },
  { id: "S105", name: "Ethan Hunt", dept: "IT", sem: 1, gpa: 8.2, status: "Draft" },
];

export default function ResultsManagement() {
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Results Management</h2>
          <p className="text-sm text-muted-foreground">Manage and publish student grades</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all">
            <Plus size={18} /> Upload Results
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-xl text-sm font-semibold hover:bg-zinc-50 transition-all">
            <Download size={18} /> Export
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 p-4 bg-white dark:bg-zinc-900 border border-border rounded-2xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder="Search student name or ID..."
            className="w-full pl-10 pr-4 py-2 bg-zinc-50 dark:bg-black border border-border rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm hover:bg-zinc-50">
            <Filter size={16} /> Department
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm hover:bg-zinc-50">
            Semester
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-zinc-900 border border-border rounded-3xl overflow-hidden">
        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-zinc-50 dark:bg-black/50 text-muted-foreground uppercase text-[10px] tracking-widest font-bold">
            <tr>
              <th className="px-6 py-4">Student</th>
              <th className="px-6 py-4">Dept/Sem</th>
              <th className="px-6 py-4">GPA</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {resultsData.map((row) => (
              <tr key={row.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="font-semibold">{row.name}</div>
                  <div className="text-xs text-muted-foreground">{row.id}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium">{row.dept}</div>
                  <div className="text-xs text-muted-foreground">Semester {row.sem}</div>
                </td>
                <td className="px-6 py-4 font-mono font-bold text-primary">{row.gpa.toFixed(1)}</td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold",
                    row.status === "Published" ? "bg-success/10 text-success" : 
                    row.status === "Pending" ? "bg-warning/10 text-warning" : "bg-muted text-muted-foreground"
                  )}>
                    {row.status === "Published" ? <CheckCircle size={12} /> : <Clock size={12} />}
                    {row.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                    <MoreVertical size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

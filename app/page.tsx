"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Subscription } from "@prisma/client";
import { SummaryCards } from "./components/SummaryCards";
import { SubscriptionTable } from "./components/SubscriptionTable";
import { SubscriptionForm, SubscriptionFormData } from "./components/SubscriptionForm";
import { Download, Plus, Search, Filter } from "lucide-react";

export default function Dashboard() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<SubscriptionFormData | null>(null);

  const fetchSubscriptions = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/subscriptions");
      if (!res.ok) throw new Error("Failed to fetch data");
      const data = await res.json();
      setSubscriptions(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  // Compute unique departments for filter dropdown
  const departments = useMemo(() => {
    const deps = new Set(subscriptions.map((s) => s.departmentOwner));
    return Array.from(deps).sort();
  }, [subscriptions]);

  // Derived filtered data
  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter((sub) => {
      const matchesSearch = sub.toolName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDept = departmentFilter ? sub.departmentOwner === departmentFilter : true;
      const matchesStatus = statusFilter ? sub.status === statusFilter : true;
      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [subscriptions, searchQuery, departmentFilter, statusFilter]);

  // Handlers
  const handleOpenCreate = () => {
    setEditingSub(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (sub: Subscription) => {
    setEditingSub({
      id: sub.id,
      toolName: sub.toolName,
      departmentOwner: sub.departmentOwner,
      renewalDate: new Date(sub.renewalDate).toISOString().split("T")[0],
      monthlyCost: sub.monthlyCost,
      status: sub.status,
      notes: sub.notes || "",
    });
    setIsFormOpen(true);
  };

  const handleSubmitForm = async (formData: SubscriptionFormData) => {
    const isEdit = !!formData.id;
    const url = isEdit ? `/api/subscriptions/${formData.id}` : "/api/subscriptions";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const { error } = await res.json();
      throw new Error(error || "Failed to save subscription");
    }

    await fetchSubscriptions();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this subscription?")) return;

    try {
      const res = await fetch(`/api/subscriptions/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      await fetchSubscriptions();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "Cancelled" ? "Active" : "Cancelled";
    try {
      const res = await fetch(`/api/subscriptions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      await fetchSubscriptions();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const exportToCSV = () => {
    if (filteredSubscriptions.length === 0) return;

    const headers = ["Tool Name", "Department", "Renewal Date", "Monthly Cost", "Status", "Notes"];
    const csvRows = [headers.join(",")];

    for (const sub of filteredSubscriptions) {
      const date = new Date(sub.renewalDate).toISOString().split("T")[0];
      const row = [
        `"${sub.toolName.replace(/"/g, '""')}"`,
        `"${sub.departmentOwner}"`,
        date,
        sub.monthlyCost,
        sub.status,
        `"${(sub.notes || "").replace(/"/g, '""')}"`,
      ];
      csvRows.push(row.join(","));
    }

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `subscriptions_export_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading && subscriptions.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Tools Subscription & Renewal Tracker</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage your company's software stack and recurring costs.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={exportToCSV}
            className="inline-flex items-center px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-sm"
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </button>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Subscription
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <SummaryCards subscriptions={subscriptions} />

      {/* Filters and Table Section */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-5">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search by tool name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow text-sm"
            />
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-48">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-4 w-4 text-slate-400" />
              </div>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow text-sm appearance-none"
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative flex-1 md:w-48">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-4 w-4 text-slate-400" />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow text-sm appearance-none"
              >
                <option value="">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Expiring Soon">Expiring Soon</option>
                <option value="Expired">Expired</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        <SubscriptionTable
          subscriptions={filteredSubscriptions}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
        />
      </div>

      <SubscriptionForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmitForm}
        initialData={editingSub}
        title={editingSub ? "Edit Subscription" : "Add New Subscription"}
      />
    </main>
  );
}

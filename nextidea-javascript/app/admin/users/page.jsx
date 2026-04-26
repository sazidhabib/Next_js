"use client";

import { useState, useEffect } from "react";
import { Users, UserPlus, Shield, Mail, Trash2, Edit } from "lucide-react";

export default function UsersManagement() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Users</h1>
          <p className="text-zinc-400 mt-1">Manage admin and editor accounts</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all">
          <UserPlus className="w-5 h-5" />
          Add User
        </button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-800/50">
              <th className="px-6 py-4 text-zinc-300 font-bold text-sm">Username</th>
              <th className="px-6 py-4 text-zinc-300 font-bold text-sm">Email</th>
              <th className="px-6 py-4 text-zinc-300 font-bold text-sm">Role</th>
              <th className="px-6 py-4 text-zinc-300 font-bold text-sm text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            <tr>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">A</div>
                  <span className="text-white font-medium">admin</span>
                </div>
              </td>
              <td className="px-6 py-4 text-zinc-400">admin@nextideasolution.com</td>
              <td className="px-6 py-4">
                <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs font-bold rounded-md uppercase">Admin</span>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-3">
                  <button className="text-zinc-400 hover:text-white"><Edit className="w-4 h-4" /></button>
                  <button className="text-zinc-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
        <p className="text-blue-400 text-sm">
          <strong>Note:</strong> Full user management (editing and deleting) is coming soon in the next update.
        </p>
      </div>
    </div>
  );
}

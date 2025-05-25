"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createAssignment } from "@/src/lib/actions";

export default function CreateAssignment() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
    requirements: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await createAssignment(formData);
      toast.success("Assignment created successfully!");
      router.push("/assignments");
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Assignment</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full p-2 border rounded-md bg-gray-800 border-gray-700"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full p-2 border rounded-md bg-gray-800 border-gray-700 h-32"
            required
          />
        </div>

        <div>
          <label htmlFor="deadline" className="block text-sm font-medium mb-1">
            Deadline
          </label>
          <input
            type="datetime-local"
            id="deadline"
            value={formData.deadline}
            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            className="w-full p-2 border rounded-md bg-gray-800 border-gray-700"
            required
          />
        </div>

        <div>
          <label htmlFor="requirements" className="block text-sm font-medium mb-1">
            Requirements
          </label>
          <textarea
            id="requirements"
            value={formData.requirements}
            onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
            className="w-full p-2 border rounded-md bg-gray-800 border-gray-700 h-32"
            placeholder="List the requirements and evaluation criteria..."
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Create Assignment
        </button>
      </form>
    </div>
  );
} 
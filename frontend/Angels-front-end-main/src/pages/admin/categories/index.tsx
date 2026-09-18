import { useEffect, useState, type FormEvent } from "react";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/axios";
import type { Category } from "@/lib/types";

interface CategoryDraft {
  key: string;
  label: string;
}

const emptyDraft: CategoryDraft = { key: "", label: "" };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [creating, setCreating] = useState(false);
  const [newDraft, setNewDraft] = useState<CategoryDraft>(emptyDraft);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState<CategoryDraft>(emptyDraft);

  function load() {
    setLoading(true);
    fetchCategories()
      .then(setCategories)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const category = await createCategory(newDraft);
      setCategories((prev) => [...prev, category]);
      setNewDraft(emptyDraft);
      setCreating(false);
    } catch (err) {
      setError((err as Error).message || "Couldn't create category.");
    }
  }

  function startEdit(category: Category) {
    setEditingId(category.id);
    setEditDraft({ key: category.key, label: category.label });
  }

  async function handleUpdate(id: number) {
    setError(null);
    try {
      const updated = await updateCategory(id, editDraft);
      setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)));
      setEditingId(null);
    } catch (err) {
      setError((err as Error).message || "Couldn't update category.");
    }
  }

  async function handleDelete(category: Category) {
    if (
      !confirm(
        `Delete "${category.label}"? Products in this category must be moved or removed first.`
      )
    )
      return;
    try {
      await deleteCategory(category.id);
      setCategories((prev) => prev.filter((c) => c.id !== category.id));
    } catch (err) {
      alert((err as Error).message || "Couldn't delete category.");
    }
  }

  return (
    <section className="max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-cocoa-900">Categories</h1>
        <Button onClick={() => setCreating((v) => !v)}>
          <Plus className="h-4 w-4" /> Add category
        </Button>
      </div>

      {error && (
        <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {creating && (
        <Card className="mt-6 p-5">
          <form onSubmit={handleCreate} className="flex items-end gap-3">
            <div className="flex-1">
              <label className="text-xs font-medium text-cocoa-900/70">
                Key (slug)
              </label>
              <Input
                value={newDraft.key}
                onChange={(e) =>
                  setNewDraft((d) => ({ ...d, key: e.target.value }))
                }
                placeholder="e.g. cookies"
                className="mt-1"
                required
              />
            </div>
            <div className="flex-1">
              <label className="text-xs font-medium text-cocoa-900/70">
                Label
              </label>
              <Input
                value={newDraft.label}
                onChange={(e) =>
                  setNewDraft((d) => ({ ...d, label: e.target.value }))
                }
                placeholder="e.g. Cookies"
                className="mt-1"
                required
              />
            </div>
            <Button type="submit" size="sm">
              Save
            </Button>
          </form>
        </Card>
      )}

      {loading ? (
        <p className="mt-6 text-sm text-cocoa-900/50">Loading…</p>
      ) : (
        <Card className="mt-6 divide-y divide-cocoa-900/8 overflow-hidden">
          {categories.length === 0 && (
            <p className="p-6 text-sm text-cocoa-900/50">No categories yet.</p>
          )}
          {categories.map((category) =>
            editingId === category.id ? (
              <div key={category.id} className="flex items-end gap-3 p-4">
                <Input
                  value={editDraft.key}
                  onChange={(e) =>
                    setEditDraft((d) => ({ ...d, key: e.target.value }))
                  }
                  className="flex-1"
                />
                <Input
                  value={editDraft.label}
                  onChange={(e) =>
                    setEditDraft((d) => ({ ...d, label: e.target.value }))
                  }
                  className="flex-1"
                />
                <button
                  onClick={() => handleUpdate(category.id)}
                  className="rounded-full p-2 text-sage-600 hover:bg-cream-200"
                  aria-label="Save"
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="rounded-full p-2 text-cocoa-900/50 hover:bg-cream-200"
                  aria-label="Cancel"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div key={category.id} className="flex items-center gap-4 p-4">
                <div className="flex-1">
                  <p className="font-medium text-cocoa-900">{category.label}</p>
                  <p className="text-xs text-cocoa-900/50">{category.key}</p>
                </div>
                <button
                  onClick={() => startEdit(category)}
                  className="rounded-full p-2 text-cocoa-900/60 hover:bg-cream-200"
                  aria-label={`Edit ${category.label}`}
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(category)}
                  className="rounded-full p-2 text-red-500/80 hover:bg-red-50"
                  aria-label={`Delete ${category.label}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )
          )}
        </Card>
      )}
    </section>
  );
}
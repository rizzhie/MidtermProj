import { useEffect, useRef, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Camera } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  fetchCategories,
  fetchProduct,
  createProduct,
  updateProduct,
} from "@/lib/axios";
import { readImageAsDataUrl } from "@/lib/image";
import type { Category } from "@/lib/types";

interface ProductFormState {
  name: string;
  price: string;
  category_id: string;
  image: string;
  description: string;
  is_available: boolean;
}

const emptyForm: ProductFormState = {
  name: "",
  price: "",
  category_id: "",
  image: "",
  description: "",
  is_available: true,
};

export default function AdminProductFormPage() {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleImageChange(file: File | undefined) {
    if (!file) return;
    try {
      const dataUrl = await readImageAsDataUrl(file, 800);
      update("image", dataUrl);
    } catch (err) {
      setError((err as Error).message || "Couldn't load that image.");
    }
  }

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    if (!isEditing) return;
    fetchProduct(id as string)
      .then((product) =>
        setForm({
          name: product.name,
          price: String(product.price),
          category_id: String(product.category_id),
          image: product.image || "",
          description: product.description || "",
          is_available: product.is_available,
        })
      )
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, isEditing]);

  function update(field: keyof ProductFormState, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const payload = {
      name: form.name,
      price: Number(form.price),
      category_id: Number(form.category_id),
      image: form.image || null,
      description: form.description || null,
      is_available: form.is_available,
    };

    try {
      if (isEditing) {
        await updateProduct(id as string, payload);
      } else {
        await createProduct(payload);
      }
      navigate("/admin/products");
    } catch (err) {
      setError((err as Error).message || "Couldn't save product.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-cocoa-900/50">Loading…</p>;
  }

  return (
    <section className="max-w-xl">
      <h1 className="font-display text-3xl text-cocoa-900">
        {isEditing ? "Edit product" : "Add product"}
      </h1>

      <Card className="mt-6 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-cocoa-900">Name</label>
            <Input
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className="mt-1.5"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-cocoa-900">Price</label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={(e) => update("price", e.target.value)}
                className="mt-1.5"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-cocoa-900">
                Category
              </label>
              <Select
                value={form.category_id}
                onChange={(e) => update("category_id", e.target.value)}
                className="mt-1.5"
                required
              >
                <option value="" disabled>
                  Select…
                </option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div>
            <span className="text-sm font-medium text-cocoa-900">
              Product Photo
            </span>
            <div className="mt-1.5 flex items-center gap-4">
              {form.image ? (
                <img
                  src={form.image}
                  alt="Product preview"
                  className="h-20 w-20 rounded-xl object-cover ring-1 ring-cocoa-900/10"
                />
              ) : (
                <span className="flex h-20 w-20 items-center justify-center rounded-xl bg-cream-200 text-xs text-cocoa-900/50">
                  No photo
                </span>
              )}
              <div className="flex flex-col gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => fileRef.current?.click()}
                >
                  <Camera className="h-4 w-4" />
                  {form.image ? "Change photo" : "Upload photo"}
                </Button>
                {form.image && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => update("image", "")}
                  >
                    Remove
                  </Button>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageChange(e.target.files?.[0])}
                />
              </div>
            </div>
            <p className="mt-2 text-xs text-cocoa-900/50">
              JPG or PNG — resized to a compact preview automatically.
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-cocoa-900">
              Description
            </label>
            <Textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              rows={3}
              className="mt-1.5"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-cocoa-900">
            <input
              type="checkbox"
              checked={form.is_available}
              onChange={(e) => update("is_available", e.target.checked)}
            />
            Available on the menu
          </label>

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <div className="flex gap-3">
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving…" : "Save"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/admin/products")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </section>
  );
}
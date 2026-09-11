import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Input";
import {
  fetchCategories,
  fetchProduct,
  createProduct,
  updateProduct,
} from "@/lib/api";

const emptyForm = {
  name: "",
  price: "",
  category_id: "",
  image: "",
  description: "",
  is_available: true,
};

export function AdminProductFormPage() {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    if (!isEditing) return;
    fetchProduct(id)
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

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
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
        await updateProduct(id, payload);
      } else {
        await createProduct(payload);
      }
      navigate("/admin/products");
    } catch (err) {
      setError(err.message || "Couldn't save product.");
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
            <label className="text-sm font-medium text-cocoa-900">
              Image URL
            </label>
            <Input
              value={form.image}
              onChange={(e) => update("image", e.target.value)}
              className="mt-1.5"
              placeholder="https://…"
            />
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

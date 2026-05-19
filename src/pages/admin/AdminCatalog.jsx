import { useEffect, useState } from 'react';
import { adminApi } from '../../api/services.js';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import ImageUpload from '../../components/ui/ImageUpload.jsx';
import Loader from '../../components/ui/Loader.jsx';
import Badge from '../../components/ui/Badge.jsx';
import { getCategoryImage } from '../../utils/images.js';

export default function AdminCatalog() {
  const [amenities, setAmenities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [amenityName, setAmenityName] = useState('');
  const [catName, setCatName] = useState('');
  const [catType, setCatType] = useState('sports');
  const [catImage, setCatImage] = useState('');
  const [editingCat, setEditingCat] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () =>
    Promise.all([adminApi.amenities(), adminApi.categories()])
      .then(([a, c]) => {
        setAmenities(a.data);
        setCategories(c.data);
      })
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  if (loading) return <Loader />;

  const saveCategory = async (e) => {
    e.preventDefault();
    const body = {
      name: editingCat ? editingCat.name : catName,
      type: editingCat ? editingCat.type : catType,
      image: editingCat ? editingCat.image : catImage || undefined,
      description: editingCat?.description,
      isActive: editingCat?.isActive ?? true,
    };
    if (editingCat) {
      await adminApi.updateCategory(editingCat._id, body);
      setEditingCat(null);
    } else {
      await adminApi.createCategory(body);
      setCatName('');
      setCatImage('');
    }
    load();
  };

  return (
    <section className="mx-auto max-w-4xl space-y-10 px-4 py-10 sm:px-6">
      <header>
        <h1 className="font-display text-3xl font-bold">Categories & amenities</h1>
        <p className="mt-1 text-sm text-muted">
          Sports & event types for ground listings — owners pick these when adding a ground
        </p>
      </header>

      <section className="rounded-2xl border bg-white p-6">
        <h2 className="font-semibold">Amenities</h2>
        <form
          className="mt-3 flex gap-2"
          onSubmit={async (e) => {
            e.preventDefault();
            await adminApi.createAmenity({ name: amenityName });
            setAmenityName('');
            load();
          }}
        >
          <Input placeholder="New amenity" value={amenityName} onChange={(e) => setAmenityName(e.target.value)} />
          <Button type="submit">Add</Button>
        </form>
        <ul className="mt-4 space-y-2">
          {amenities.map((a) => (
            <li key={a._id} className="flex items-center justify-between gap-2 text-sm">
              <span>{a.name}</span>
              <section className="flex gap-2">
                <Button
                  variant="ghost"
                  onClick={async () => {
                    await adminApi.updateAmenity(a._id, { isActive: !a.isActive });
                    load();
                  }}
                >
                  {a.isActive !== false ? 'Deactivate' : 'Activate'}
                </Button>
                <Button
                  variant="ghost"
                  onClick={async () => {
                    if (window.confirm('Delete amenity?')) {
                      await adminApi.deleteAmenity(a._id);
                      load();
                    }
                  }}
                >
                  Delete
                </Button>
              </section>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border bg-white p-6">
        <h2 className="font-semibold">
          {editingCat ? `Edit: ${editingCat.name}` : 'Sports / event categories'}
        </h2>
        <form className="mt-4 space-y-4" onSubmit={saveCategory}>
          <section className="grid gap-4 sm:grid-cols-2">
            <Input
              placeholder="Category name"
              value={editingCat ? editingCat.name : catName}
              onChange={(e) =>
                editingCat
                  ? setEditingCat({ ...editingCat, name: e.target.value })
                  : setCatName(e.target.value)
              }
            />
            <select
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={editingCat ? editingCat.type : catType}
              onChange={(e) =>
                editingCat
                  ? setEditingCat({ ...editingCat, type: e.target.value })
                  : setCatType(e.target.value)
              }
            >
              <option value="sports">Sports</option>
              <option value="event">Event</option>
            </select>
          </section>
          <ImageUpload
            label="Category image"
            value={editingCat ? editingCat.image || '' : catImage}
            onChange={(img) =>
              editingCat ? setEditingCat({ ...editingCat, image: img }) : setCatImage(img)
            }
          />
          {editingCat && (
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={editingCat.isActive !== false}
                onChange={(e) => setEditingCat({ ...editingCat, isActive: e.target.checked })}
              />
              Active (visible to owners & users)
            </label>
          )}
          <section className="flex gap-2">
            <Button type="submit">{editingCat ? 'Save changes' : 'Add category'}</Button>
            {editingCat && (
              <Button type="button" variant="ghost" onClick={() => setEditingCat(null)}>
                Cancel
              </Button>
            )}
          </section>
        </form>

        <section className="mt-6 grid gap-4 sm:grid-cols-2">
          {categories.map((c) => (
            <article
              key={c._id}
              className={`flex gap-3 rounded-xl border p-3 ${c.isActive === false ? 'opacity-60' : ''}`}
            >
              <img src={getCategoryImage(c)} alt={c.name} className="h-16 w-16 rounded-lg object-cover" />
              <section className="flex-1">
                <p className="font-medium">{c.name}</p>
                <p className="text-xs capitalize text-muted">{c.type}</p>
                <Badge className={c.isActive !== false ? 'mt-1 bg-emerald-100 text-emerald-800' : 'mt-1 bg-slate-200'}>
                  {c.isActive !== false ? 'Active' : 'Inactive'}
                </Badge>
              </section>
              <section className="flex flex-col gap-1">
                <Button variant="ghost" onClick={() => setEditingCat({ ...c })}>
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  onClick={async () => {
                    await adminApi.updateCategory(c._id, { isActive: !c.isActive });
                    load();
                  }}
                >
                  {c.isActive !== false ? 'Off' : 'On'}
                </Button>
                <Button
                  variant="ghost"
                  onClick={async () => {
                    if (window.confirm('Delete category?')) {
                      await adminApi.deleteCategory(c._id);
                      load();
                    }
                  }}
                >
                  Del
                </Button>
              </section>
            </article>
          ))}
        </section>
      </section>
    </section>
  );
}

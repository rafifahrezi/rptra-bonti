import React, { useEffect, useMemo, useState } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
  setDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import {
  Calendar,
  MapPin,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Users,
  Percent,
  ImagePlus,
  Star,
} from "lucide-react";
import { db, auth } from "../config/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../config/firebase";

type EventStatus = "upcoming" | "ongoing" | "finished";

export interface EventDoc {
  id: string;
  title: string;
  description: string;
  tags: string[];
  date: string; // ISO string with time
  location: string;
  status: EventStatus;
  mainPhoto?: string; // URL foto utama
  createdAt?: any;
  updatedAt?: any;
}

type Role = "admin" | "superadmin" | "user" | undefined;

const tagsList = ["Kuliner", "Seni", "Olahraga", "Edukasi", "Budaya", "Teknologi", "Kesehatan"] as const;
const statuses: { value: EventStatus; label: string }[] = [
  { value: "upcoming", label: "Akan Datang" },
  { value: "ongoing", label: "Sedang Berlangsung" },
  { value: "finished", label: "Selesai" },
];

const emptyForm: Omit<EventDoc, "id"> = {
  title: "",
  description: "",
  tags: [],
  date: "",
  location: "",
  status: "upcoming",
  mainPhoto: "",
};

const statusPill = (s: EventStatus) => {
  switch (s) {
    case "upcoming":
      return "bg-blue-100 text-blue-800";
    case "ongoing":
      return "bg-green-100 text-green-800";
    case "finished":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const EventManagement: React.FC = () => {
  const [role, setRole] = useState<Role>();
  const [authLoading, setAuthLoading] = useState(true);

  const [events, setEvents] = useState<EventDoc[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState<"create" | "edit" | "view">("create");
  const [selected, setSelected] = useState<EventDoc | null>(null);

  const [form, setForm] = useState<Omit<EventDoc, "id">>(emptyForm);
  const [images, setImages] = useState<File[]>([]);
  const [mainPhoto, setMainPhoto] = useState<string>("");

  const [search, setSearch] = useState("");
  const [filterTag, setFilterTag] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // --- Auth ---
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setRole(undefined);
        setAuthLoading(false);
        return;
      }
      const userDocRef = doc(db, "users", user.uid);
      const stop = onSnapshot(userDocRef, (snap) => {
        const r = (snap.data()?.role as Role) || "user";
        setRole(r);
        setAuthLoading(false);
      });
      return () => stop();
    });
    return () => unsub();
  }, []);

  // --- Listen events ---
  useEffect(() => {
    const q = query(collection(db, "events"), orderBy("date", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const list: EventDoc[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<EventDoc, "id">),
      }));
      setEvents(list);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filtered = useMemo(() => {
    return events.filter((e) => {
      const s = search.trim().toLowerCase();
      const matchesSearch =
        !s ||
        e.title.toLowerCase().includes(s) ||
        e.description.toLowerCase().includes(s) ||
        e.location.toLowerCase().includes(s) ||
        e.tags.some((t) => t.toLowerCase().includes(s));

      const matchesTag = filterTag === "all" || e.tags.includes(filterTag);
      const matchesStatus = filterStatus === "all" || e.status === filterStatus;

      return matchesSearch && matchesTag && matchesStatus;
    });
  }, [events, search, filterTag, filterStatus]);

  const openCreate = () => {
    setMode("create");
    setForm(emptyForm);
    setImages([]);
    setMainPhoto("");
    setSelected(null);
    setShowModal(true);
  };

  const openEdit = (ev: EventDoc) => {
    setMode("edit");
    setSelected(ev);
    const { id, ...rest } = ev;
    setForm(rest);
    setMainPhoto(ev.mainPhoto || "");
    setShowModal(true);
  };

  const openView = (ev: EventDoc) => {
    setMode("view");
    setSelected(ev);
    setShowModal(true);
  };

  const uploadImages = async (eventId: string) => {
    for (const file of images) {
      const storageRef = ref(storage, `events/${eventId}/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      await addDoc(collection(db, "events", eventId, "gallery"), {
        url,
        isMain: url === mainPhoto,
        uploadedAt: serverTimestamp(),
      });
      if (url === mainPhoto) {
        await updateDoc(doc(db, "events", eventId), { mainPhoto: url });
      }
    }
  };

  const handleSubmit = async () => {
    if (!form.title || !form.tags.length || !form.date || !form.location || !form.status) {
      alert("Harap isi semua field wajib.");
      return;
    }

    try {
      if (mode === "create") {
        const docRef = await addDoc(collection(db, "events"), {
          ...form,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        if (images.length) {
          await uploadImages(docRef.id);
        }
      } else if (mode === "edit" && selected) {
        await updateDoc(doc(db, "events", selected.id), {
          ...form,
          updatedAt: serverTimestamp(),
        });
        if (images.length) {
          await uploadImages(selected.id);
        }
      }
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan data.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus event ini?")) return;
    try {
      await deleteDoc(doc(db, "events", id));
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus.");
    }
  };

  // --- summary cards ---
  const summary = useMemo(() => {
    const totalEvent = events.length;
    const totalParticipants = events.reduce((acc, ev: any) => acc + (ev.participants ?? 0), 0);
    const activeEvent = events.filter((ev) => ev.status === "ongoing").length;

    let avgParticipation = 0;
    let totalCapacity = 0;
    let totalRegistered = 0;
    events.forEach((ev: any) => {
      if (ev.capacity && ev.participants) {
        totalRegistered += ev.participants;
        totalCapacity += ev.capacity;
      }
    });
    if (totalCapacity > 0) {
      avgParticipation = Math.round((totalRegistered / totalCapacity) * 100);
    }

    return { totalEvent, totalParticipants, activeEvent, avgParticipation };
  }, [events]);

  if (authLoading) return <div className="p-6">Memeriksa sesi pengguna…</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Event Management</h1>
            <p className="text-gray-600">Kelola event untuk ditampilkan ke pengguna.</p>
          </div>
          <button
            onClick={openCreate}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Buat Event
          </button>
        </div>

 {/* Summary Cards */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
           <div className="bg-white p-4 rounded-lg shadow flex items-center gap-3">
             <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
               <Calendar className="w-6 h-6" />
             </div>
             <div>
               <p className="text-sm text-gray-500">Total Event</p>
               <p className="text-2xl font-bold">{summary.totalEvent}</p>
             </div>
           </div>
 
           <div className="bg-white p-4 rounded-lg shadow flex items-center gap-3">
             <div className="bg-green-100 text-green-600 p-3 rounded-lg">
               <Users className="w-6 h-6" />
             </div>
             <div>
               <p className="text-sm text-gray-500">Total Peserta</p>
               <p className="text-2xl font-bold">{summary.totalParticipants}</p>
             </div>
           </div>
 
           <div className="bg-white p-4 rounded-lg shadow flex items-center gap-3">
             <div className="bg-orange-100 text-orange-600 p-3 rounded-lg">
               <Eye className="w-6 h-6" />
             </div>
             <div>
               <p className="text-sm text-gray-500">Event Aktif</p>
               <p className="text-2xl font-bold">{summary.activeEvent}</p>
             </div>
           </div>
 
           <div className="bg-white p-4 rounded-lg shadow flex items-center gap-3">
             <div className="bg-purple-100 text-purple-600 p-3 rounded-lg">
               <Percent className="w-6 h-6" />
             </div>
             <div>
               <p className="text-sm text-gray-500">Rata-rata Partisipasi</p>
               <p className="text-2xl font-bold">{summary.avgParticipation}%</p>
             </div>
           </div>
         </div>
 
         {/* Controls */}
         <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col md:flex-row gap-3">
           <div className="relative flex-1">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
             <input
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
               placeholder="Cari judul/desc/lokasi/kategori…"
             />
           </div>
           <select
             value={filterCategory}
             onChange={(e) => setFilterCategory(e.target.value)}
             className="px-3 py-2 border rounded-lg"
           >
             <option value="all">Semua Kategori</option>
             {categories.map((c) => (
               <option key={c} value={c}>
                 {c}
               </option>
             ))}
           </select>
           <select
             value={filterStatus}
             onChange={(e) => setFilterStatus(e.target.value)}
             className="px-3 py-2 border rounded-lg"
           >
             <option value="all">Semua Status</option>
             {statuses.map((s) => (
               <option key={s.value} value={s.value}>
                 {s.label}
               </option>
             ))}
           </select>
         </div>
 
         {/* Grid */}
         {loading ? (
           <div className="p-6">Memuat data…</div>
         ) : filtered.length === 0 ? (
           <div className="text-center py-16 text-gray-600">Tidak ada event.</div>
         ) : (
           <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
             {filtered.map((ev) => (
               <div
                 key={ev.id}
                 className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
               >
                 <div className="relative">
                   {ev.image ? (
                     <img src={ev.image} alt={ev.title} className="w-full h-48 object-cover" />
                   ) : (
                     <div className="w-full h-48 bg-gray-100" />
                   )}
 
                   <div className="absolute top-4 left-4">
                     <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusPill(ev.status)}`}>
                       {statuses.find((s) => s.value === ev.status)?.label ?? ev.status}
                     </span>
                   </div>
                   <div className="absolute top-4 right-4">
                     <span className="bg-gray-800/80 text-white px-2 py-1 rounded text-xs">{ev.category}</span>
                   </div>
                 </div>
 
                 <div className="p-6">
                   <h3 className="text-lg font-semibold text-gray-900 mb-1">{ev.title}</h3>
                   <p className="text-gray-600 text-sm mb-4 line-clamp-2">{ev.description}</p>
 
                   <div className="space-y-2 text-sm text-gray-500 mb-5">
                     <div className="flex items-center gap-2">
                       <Calendar className="w-4 h-4" />
                       <span>{new Date(ev.date).toLocaleDateString("id-ID")}</span>
                     </div>
                     <div className="flex items-center gap-2">
                       <MapPin className="w-4 h-4" />
                       <span className="truncate">{ev.location}</span>
                     </div>
                   </div>
 
                   <div className="flex gap-2">
                     <button
                       onClick={() => openView(ev)}
                       className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded hover:bg-gray-200 transition-colors flex items-center justify-center gap-1 text-sm"
                     >
                       <Eye className="w-4 h-4" />
                       Lihat
                     </button>
                     <button
                       onClick={() => openEdit(ev)}
                       className="flex-1 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition-colors flex items-center justify-center gap-1 text-sm"
                     >
                       <Edit className="w-4 h-4" />
                       Edit
                     </button>
                     <button
                       onClick={() => handleDelete(ev.id)}
                       className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition-colors flex items-center justify-center"
                     >
                       <Trash2 className="w-4 h-4" />
                     </button>
                   </div>
                 </div>
               </div>
             ))}
           </div>
         )}
       </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {mode === "create" ? "Buat Event" : mode === "edit" ? "Edit Event" : "Detail Event"}
              </h2>
              <button className="text-gray-400 hover:text-gray-600" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>

            {mode === "view" && selected ? (
              <div className="p-6 space-y-4">
                {selected.mainPhoto && (
                  <img src={selected.mainPhoto} alt={selected.title} className="w-full h-64 object-cover rounded" />
                )}
                <div className="flex items-center gap-2 flex-wrap">
                  {selected.tags.map((tag) => (
                    <span key={tag} className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-2xl font-bold">{selected.title}</h3>
                <p className="text-gray-700">{selected.description}</p>
                <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(selected.date).toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{selected.location}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium mb-1">Judul *</label>
                    <input
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="Judul event…"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Tanggal & Waktu *</label>
                    <input
                      type="datetime-local"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Lokasi *</label>
                    <input
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="Contoh: RPTRA Bonti"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Status *</label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value as EventStatus })}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      {statuses.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Upload Image */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Upload Gambar</label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => setImages(Array.from(e.target.files || []))}
                    />
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {images.map((file) => {
                        const url = URL.createObjectURL(file);
                        return (
                          <div key={file.name} className="relative">
                            <img src={url} alt="" className="w-24 h-20 object-cover rounded border" />
                            <button
                              type="button"
                              className={`absolute top-1 right-1 bg-white rounded-full p-1 shadow ${
                                mainPhoto === url ? "text-yellow-500" : "text-gray-400"
                              }`}
                              onClick={() => setMainPhoto(url)}
                            >
                              <Star className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Deskripsi</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Deskripsi singkat event…"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium mb-2">Tags *</label>
                  <div className="flex flex-wrap gap-2">
                    {tagsList.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            tags: prev.tags.includes(t)
                              ? prev.tags.filter((x) => x !== t)
                              : [...prev.tags, t],
                          }))
                        }
                        className={`px-3 py-1 rounded-full border ${
                          form.tags.includes(t)
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button className="px-4 py-2 bg-gray-100 rounded-lg" onClick={() => setShowModal(false)}>
                    Batal
                  </button>
                  <button
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    onClick={handleSubmit}
                  >
                    {mode === "create" ? "Buat Event" : "Update Event"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventManagement;

import React, { useEffect, useState } from "react";
import { db } from "../config/firebase";
import { doc, getDoc, updateDoc, collection, getDocs, addDoc, deleteDoc } from "firebase/firestore";

const AdminAbout: React.FC = () => {
  const [hero, setHero] = useState<any>(null);
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Hero section
      const heroSnap = await getDoc(doc(db, "about", "hero"));
      if (heroSnap.exists()) setHero(heroSnap.data());

      // Programs
      const progSnap = await getDocs(collection(db, "about", "programs"));
      setPrograms(progSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

      setLoading(false);
    };
    fetchData();
  }, []);

  const saveHero = async () => {
    await updateDoc(doc(db, "about", "hero"), hero);
    alert("Hero updated!");
  };

  const addProgram = async () => {
    await addDoc(collection(db, "about", "programs"), {
      icon: "Users",
      title: "Program Baru",
      description: "Deskripsi program baru",
    });
    alert("Program ditambahkan, refresh untuk lihat!");
  };

  const deleteProgram = async (id: string) => {
    await deleteDoc(doc(db, "about", "programs", id));
    alert("Program dihapus, refresh untuk lihat!");
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Kelola Halaman About</h1>

      {/* Hero Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Hero Section</h2>
        <input
          type="text"
          className="border p-2 w-full mb-2"
          placeholder="Judul"
          value={hero?.title || ""}
          onChange={(e) => setHero({ ...hero, title: e.target.value })}
        />
        <input
          type="text"
          className="border p-2 w-full mb-2"
          placeholder="Subjudul"
          value={hero?.subtitle || ""}
          onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
        />
        <input
          type="text"
          className="border p-2 w-full mb-2"
          placeholder="Link Gambar"
          value={hero?.image || ""}
          onChange={(e) => setHero({ ...hero, image: e.target.value })}
        />
        <button onClick={saveHero} className="bg-green-500 text-white px-4 py-2 rounded">
          Simpan Hero
        </button>
      </div>

      {/* Programs */}
      <div>
        <h2 className="text-xl font-semibold">Programs</h2>
        <button onClick={addProgram} className="bg-blue-500 text-white px-4 py-2 rounded mb-2">
          Tambah Program
        </button>
        <ul>
          {programs.map((p) => (
            <li key={p.id} className="border p-2 mb-2 flex justify-between">
              <div>
                <b>{p.title}</b> - {p.description}
              </div>
              <button onClick={() => deleteProgram(p.id)} className="text-red-500">
                Hapus
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminAbout;

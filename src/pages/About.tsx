import React, { useEffect, useState } from "react";
import { db } from "../config/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { Users, Heart, Target, Award, MapPin, Clock, Play, Building2 } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Users,
  Heart,
  Target,
  Award,
  MapPin,
  Clock,
  Play,
  Building2,
};

const About: React.FC = () => {
  const [programs, setPrograms] = useState<any[]>([]);
  const [facilities, setFacilities] = useState<string[]>([]);
  const [partners, setPartners] = useState<string[]>([]);
  const [hours, setHours] = useState<any[]>([]);
  const [hero, setHero] = useState<any>(null);
  const [mission, setMission] = useState<any>(null);
  const [location, setLocation] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      // programs
      const progSnap = await getDocs(collection(db, "programs"));
setPrograms(progSnap.docs.map((doc) => doc.data()));

      // facilities
      const facSnap = await getDocs(collection(db, "facilities"));
setFacilities(facSnap.docs.map((doc) => doc.data().name));

      // partners
      const partSnap = await getDocs(collection(db, "partners"));
setPartners(partSnap.docs.map((doc) => doc.data().name));

      // hours
      const hourSnap = await getDocs(collection(db, "hours"));
setHours(hourSnap.docs.map((doc) => doc.data()));

      // hero, mission, location (single document)
      const heroDoc = await getDoc(doc(db, "hero", "documentId")); // Ganti documentId dengan ID yang tepat
      setHero(heroDoc.data());
      
      const missionDoc = await getDoc(doc(db, "mission", "documentId"));
      setMission(missionDoc.data());
    
      const locationDoc = await getDoc(doc(db, "location", "documentId"));
      setLocation(locationDoc.data());    
    };

    fetchData();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      {hero && (
        <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">{hero.title}</h1>
            <p className="text-xl">{hero.subtitle}</p>
          </div>
        </section>
      )}

      {/* Programs */}
      <section>
        <h2 className="text-2xl font-bold">Programs</h2>
        <div className="grid grid-cols-2 gap-4">
          {programs.map((p, i) => {
            const Icon = iconMap[p.icon] || Users;
            return (
              <div key={i} className="p-4 shadow rounded bg-white">
                <Icon className="w-6 h-6 text-green-600" />
                <h3 className="font-semibold">{p.title}</h3>
                <p>{p.description}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default About;
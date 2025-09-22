// src/pages/Home.tsx
import React from "react";
import { Button, Link as UiLink, Card, CardBody } from "@heroui/react";
import { FiArrowRight, FiCalendar, FiMapPin } from "react-icons/fi";
import { DOCTOR } from "../types/doctor";
import ContactCard from "@/components/ContactCard";

// local images (add these files in src/assets/)
import hero from "@/assets/hero.jpeg";         // optional, large banner
import clinic1 from "@/assets/clinic1.jpeg";
import clinic2 from "@/assets/clinic2.jpeg";
import equipment from "@/assets/equipment.jpeg";

const Home: React.FC = () => {
  return (
    <main className="bg-gradient-to-b from-white to-sky-50 dark:from-slate-900 dark:to-slate-950">
      {/* Decorative 3D blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-sky-300/30 blur-3xl dark:bg-sky-500/10" />
        <div className="absolute top-1/3 -right-20 h-64 w-64 rounded-full bg-teal-300/30 blur-3xl dark:bg-teal-500/10" />
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(65%_50%_at_50%_0%,rgba(14,165,233,0.12),transparent_70%)] dark:bg-[radial-gradient(65%_50%_at_50%_0%,rgba(56,189,248,0.12),transparent_70%)]" />
        <div className="mx-auto max-w-7xl px-4 py-16 md:py-24">
          <div className="grid items-center gap-10 md:grid-cols-2">
            {/* Left copy + CTA */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white px-3 py-1 text-xs text-sky-700 shadow-sm dark:border-sky-900/40 dark:bg-slate-900 dark:text-sky-300">
                Soin des yeux • RDV rapides • Données protégées
              </div>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl dark:text-slate-100">
                Votre vision, notre priorité.
              </h1>
              <p className="mt-4 text-slate-600 md:text-lg dark:text-slate-300">
                {DOCTOR.name} — {DOCTOR.title}. {DOCTOR.degree}.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  as={UiLink}
                  href={`https://wa.me/${DOCTOR.whatsappIntl.replace("+", "")}`}
                  size="lg"
                  color="primary"
                  startContent={<FiCalendar />}
                >
                  Prendre rendez-vous (WhatsApp)
                </Button>
                <Button
                  as={UiLink}
                  href="#services"
                  size="lg"
                  variant="flat"
                  endContent={<FiArrowRight />}
                >
                  Voir les services
                </Button>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                <span className="inline-flex items-center gap-1">
                  <FiMapPin /> {DOCTOR.addressLine1}
                </span>
                <span className="hidden md:inline">•</span>
                <span>{DOCTOR.addressLine2}</span>
              </div>
            </div>

            {/* Right: contact card over a hero image */}
            <div className="relative">
              {/* Optional hero photo */}
              <div className="relative mb-4 hidden overflow-hidden rounded-2xl border border-slate-200 shadow-sm md:block dark:border-slate-800">
                <img src={hero} alt="Clinique - Vue d’ensemble" className="h-60 w-full object-cover" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent dark:from-slate-950" />
              </div>
              <ContactCard />
            </div>
          </div>
        </div>
      </section>

      {/* 3D Photo Collage */}
      <section className="mx-auto max-w-7xl px-4 pb-8">
        <div className="grid gap-6 md:grid-cols-3 [perspective:1200px]">
          {/* Card 1 */}
          <Card className="group border border-slate-200 bg-white/70 shadow-sm backdrop-blur transition-transform hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/60">
            <CardBody className="overflow-hidden rounded-xl p-0 [transform-style:preserve-3d] group-hover:[transform:rotateX(4deg)_rotateY(-4deg)]">
              <img src={clinic1} alt="Accueil du cabinet" className="h-56 w-full object-cover" />
              <div className="p-4">
                <p className="font-semibold text-slate-900 dark:text-slate-100">Accueil & Réception</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Un espace clair et accueillant, pensé pour votre confort.</p>
              </div>
            </CardBody>
          </Card>

          {/* Card 2 */}
          <Card className="group border border-slate-200 bg-white/70 shadow-sm backdrop-blur transition-transform hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/60">
            <CardBody className="overflow-hidden rounded-xl p-0 [transform-style:preserve-3d] group-hover:[transform:rotateX(4deg)_rotateY(4deg)]">
              <img src={equipment} alt="Équipement" className="h-56 w-full object-cover" />
              <div className="p-4">
                <p className="font-semibold text-slate-900 dark:text-slate-100">Équipement de pointe</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Appareils modernes pour un diagnostic précis.</p>
              </div>
            </CardBody>
          </Card>

          {/* Card 3 */}
          <Card className="group border border-slate-200 bg-white/70 shadow-sm backdrop-blur transition-transform hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/60">
            <CardBody className="overflow-hidden rounded-xl p-0 [transform-style:preserve-3d] group-hover:[transform:rotateX(-4deg)_rotateY(-2deg)]">
              <img src={clinic2} alt="Salle d’examen" className="h-56 w-full object-cover" />
              <div className="p-4">
                <p className="font-semibold text-slate-900 dark:text-slate-100">Salle d’examen</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Un cadre calme et professionnel pour vos contrôles.</p>
              </div>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* Services highlight */}
      <section id="services" className="mx-auto max-w-7xl px-4 pb-24">
        <h2 className="text-center text-2xl font-bold md:text-3xl text-slate-900 dark:text-slate-100">
          Services principaux
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-center text-slate-600 dark:text-slate-400">
          Consultations, chirurgie et suivi adaptés à chaque patient.
        </p>
      </section>

      {/* Contact block with map */}
      <section id="contact" className="mx-auto max-w-7xl px-4 pb-24">
        <div className="h-64 w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
          <iframe
            title="Google Map"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={"https://www.google.com/maps?q=Avenue%20des%20Martyrs%20Sfax&output=embed"}
          />
        </div>
      </section>
    </main>
  );
};

export default Home;

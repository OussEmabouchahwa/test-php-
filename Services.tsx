import React from "react";
import ServiceCard from "@/components/ServiceCard";
import { DOCTOR } from "@/types/doctor"; // ensure DOCTOR.whatsappIntl exists
import { Stethoscope, ScanEye, Eye, ShieldCheck, Syringe, Baby, CalendarDays } from "lucide-react";
import { Input, Chip } from "@heroui/react";
import { motion } from "framer-motion";

const Services: React.FC = () => {
  const wa = `https://wa.me/${DOCTOR.whatsappIntl.replace("+", "")}`;

  // Richer, SEO-friendly labels in FR (ophtalmologie / chirurgien / myopie / France)
  const items = [
    {
      title: "Consultation générale",
      desc:
        "Examen complet de la vue, dépistage précoce (myopie, hypermétropie, astigmatisme), adaptation de correction et conseils personnalisés.",
      icon: <Stethoscope className="size-5" />,
      badges: ["ophtalmologiste", "bilan visuel", "lunettes & lentilles"],
    },
    {
      title: "Chirurgie de la cataracte",
      desc:
        "Prise en charge complète : évaluation pré-opératoire, chirurgie mini-invasive, suivi post-opératoire et optimisation de l’acuité visuelle.",
      icon: <ScanEye className="size-5" />,
      badges: ["cataracte", "chirurgie oculaire", "France"],
    },
    {
      title: "LASIK / Réfraction",
      desc:
        "Correction de la myopie, hypermétropie et astigmatisme (LASIK/PKR). Étude de faisabilité, topographie cornéenne et accompagnement complet.",
      icon: <Eye className="size-5" />,
      badges: ["LASIK", "chirurgie réfractive", "myopie"],
    },
    {
      title: "Glaucome",
      desc:
        "Dépistage et suivi de la tension intraoculaire, champ visuel, OCT du nerf optique, traitements adaptés et prévention de la perte visuelle.",
      icon: <ShieldCheck className="size-5" />,
      badges: ["glaucome", "tension oculaire", "OCT"],
    },
    {
      title: "Rétine & Diabète",
      desc:
        "Prise en charge de la rétinopathie diabétique, DMLA, injections intra-vitréennes et suivi régulier avec imagerie rétinienne avancée.",
      icon: <Syringe className="size-5" />,
      badges: ["rétine", "diabète", "injections"],
    },
    {
      title: "Ophtalmologie pédiatrique",
      desc:
        "Dépistage du strabisme et de l’amblyopie, adaptation de lunettes pour enfants, accompagnement doux et pédagogique.",
      icon: <Baby className="size-5" />,
      badges: ["enfant", "strabisme", "amblyopie"],
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900">
      {/* Hero */}
      <section className="border-b border-slate-200/70 dark:border-slate-800/80">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:py-16">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Services d&apos;ophtalmologie
              </h1>
              <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-300">
                Soins complets et personnalisés pour toute la famille :{" "}
                <strong>ophtalmologiste</strong>, <strong>chirurgie oculaire</strong>,{" "}
                <strong>LASIK</strong>, <strong>glaucome</strong>, <strong>rétine</strong> –
                accompagnement de qualité en France.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Chip size="sm" variant="flat" className="bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-200">ophtalmologiste France</Chip>
                <Chip size="sm" variant="flat" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200">chirurgie cataracte</Chip>
                <Chip size="sm" variant="flat" className="bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-200">LASIK myopie</Chip>
                <Chip size="sm" variant="flat" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">glaucome & tension</Chip>
              </div>
            </div>

            {/* Quick action box */}
            <motion.a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              className="group inline-flex items-center gap-3 rounded-2xl border px-4 py-3
                         bg-white/70 backdrop-blur border-slate-200 shadow-sm
                         dark:bg-slate-900/60 dark:border-slate-800"
            >
              <CalendarDays className="size-5 text-sky-600 group-hover:text-sky-700 dark:text-sky-400" />
              <div className="text-sm">
                <div className="font-semibold text-slate-900 dark:text-slate-100">Prendre rendez-vous</div>
                <div className="text-slate-600 dark:text-slate-300">WhatsApp • réponse rapide</div>
              </div>
            </motion.a>
          </div>

          {/* On-page search (client-side) */}
          <div className="mt-6 max-w-md">
            <Input
              type="search"
              placeholder="Rechercher (ex. LASIK, glaucome, enfant...)"
              variant="bordered"
              className="dark:[--inputColor:theme(colors.slate.200)]"
              onChange={(e) => {
                const q = (e.target as HTMLInputElement).value.toLowerCase();
                const cards = document.querySelectorAll<HTMLDivElement>("[data-service-card]");
                cards.forEach((el) => {
                  const hay = (el.dataset.haystack || "").toLowerCase();
                  el.style.display = hay.includes(q) ? "" : "none";
                });
              }}
            />
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="mx-auto max-w-7xl px-4 py-10 lg:py-14">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((s) => (
            <div
              key={s.title}
              data-service-card
              data-haystack={`${s.title} ${s.desc} ${s.badges?.join(" ")}`}
            >
              <ServiceCard
                title={s.title}
                desc={s.desc}
                badges={s.badges}
                ctaHref={wa}
                icon={s.icon}
              />
            </div>
          ))}
        </div>

        {/* Micro-copy for SEO (natural, not spammy) */}
        <div className="mt-12 rounded-2xl border p-6 md:p-8 bg-white/70 backdrop-blur
                        border-slate-200 dark:bg-slate-900/60 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Pourquoi consulter un ophtalmologiste&nbsp;?
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Nous assurons la prise en charge de la <strong>myopie</strong>,{" "}
            <strong>hypermétropie</strong>, <strong>astigmatisme</strong>,{" "}
            <strong>glaucome</strong>, pathologies de la <strong>rétine</strong> (diabète, DMLA),
            ainsi que la <strong>chirurgie de la cataracte</strong> et la{" "}
            <strong>chirurgie réfractive (LASIK/PKR)</strong>. Suivi pédiatrique, équipements
            certifiés et protocole d’hygiène strict pour un parcours de soins serein.
          </p>
        </div>
      </section>
    </main>
  );
};

export default Services;

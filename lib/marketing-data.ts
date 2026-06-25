import type { MarketingIconName } from "@/components/marketing/MarketingIcon";

export type MarketingLang = "id" | "en";

export const companyProfile = {
  name: "Kaizen Utama Teknik",
  productName: "Kaizen ServiceHub",
  whatsappNumber: "6281529500457",
};

export function getMarketingCopy(lang: MarketingLang) {
  return marketingCopy[lang];
}

export type MarketingCopy = ReturnType<typeof getMarketingCopy>;

export function getWhatsappUrl(lang: MarketingLang) {
  const message = marketingCopy[lang].whatsappMessage;
  return `https://wa.me/${companyProfile.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

const sharedIcons = {
  benefits: ["portal", "admin", "technician", "request"],
  workflow: ["request", "admin", "technician", "report"],
  highlights: ["workflow", "report", "equipment", "request"],
} as const;

const marketingCopy = {
  id: {
    langLabel: "ID",
    switchLabel: "EN",
    switchHref: "/?lang=en",
    tagline: "Kaizen ServiceFlow",
    nav: [
      { label: "ServiceFlow", href: "#portal" },
      { label: "Alur Kerja", href: "#workflow" },
      { label: "Keunggulan", href: "#services" },
      { label: "Kontak", href: "#contact" },
    ],
    hero: {
      title: "ServiceFlow untuk maintenance yang lebih transparan.",
      description:
        "Satu alur untuk request client, work order, pekerjaan teknisi, dan report dengan bukti foto.",
      primaryCta: "Client Access",
      secondaryCta: "Konsultasi",
    },
    stats: [
      { label: "Pantau pekerjaan", value: "Live" },
      { label: "Bukti report", value: "Foto" },
      { label: "Riwayat alat", value: "Rapi" },
    ],
    preview: [
      { label: "Request", value: "Client", icon: "request" },
      { label: "Work Order", value: "Admin", icon: "workflow" },
      { label: "Progress", value: "Teknisi", icon: "technician" },
      { label: "Report", value: "Client", icon: "report" },
    ],
    benefitsSection: {
      eyebrow: "Kaizen ServiceHub",
      title: "Satu sistem untuk alur maintenance.",
      description:
        "ServiceFlow menyatukan client, admin, dan teknisi agar progress pekerjaan tidak tercecer.",
      items: [
        {
          title: "Client Workspace",
          description:
            "Client dapat melihat status maintenance, equipment, dan laporan pekerjaan tanpa menunggu update manual.",
        },
        {
          title: "Admin Console",
          description:
            "Admin mengelola client, equipment, work order, request, report, dan akun pengguna dalam satu sistem.",
        },
        {
          title: "Technician Workspace",
          description:
            "Teknisi melihat pekerjaan yang ditugaskan, update status, dan mengisi laporan hasil maintenance.",
        },
        {
          title: "Service Request",
          description:
            "Problem dari client masuk sebagai request sehingga mudah ditinjau dan dikonversi menjadi work order.",
        },
      ].map((item, index) => ({
        ...item,
        icon: sharedIcons.benefits[index] as MarketingIconName,
      })),
    },
    workflowSection: {
      eyebrow: "Alur Kerja",
      title: "Dari problem client sampai laporan selesai.",
      stepLabel: "Step",
      items: [
        {
          title: "Client kirim problem",
          description:
            "Keluhan atau kebutuhan maintenance dicatat melalui sistem agar alurnya mudah dilacak.",
        },
        {
          title: "Admin buat work order",
          description:
            "Pekerjaan dihubungkan ke client, equipment, jadwal, status, dan teknisi yang menangani.",
        },
        {
          title: "Teknisi update pekerjaan",
          description:
            "Status dan laporan teknisi diperbarui selama pekerjaan berjalan sampai selesai.",
        },
        {
          title: "Client pantau report",
          description:
            "Client melihat progress dan hasil pekerjaan maintenance dari Client Workspace.",
        },
      ].map((item, index) => ({
        ...item,
        icon: sharedIcons.workflow[index] as MarketingIconName,
      })),
    },
    highlightsSection: {
      eyebrow: "Keunggulan Sistem",
      title: "Dibuat untuk membuat kerja sama maintenance lebih rapi.",
      description:
        "ServiceHub membantu tim service mencatat pekerjaan, membuktikan hasil maintenance, dan memberi client akses monitoring yang jelas.",
      items: [
        {
          title: "Progress kerja lebih transparan",
          description:
            "Client dapat memantau status pekerjaan tanpa harus menunggu update manual dari tim service.",
        },
        {
          title: "Dokumentasi report lebih kuat",
          description:
            "Laporan teknisi tersimpan bersama kondisi sebelum, tindakan, hasil akhir, catatan, dan foto bukti pekerjaan.",
        },
        {
          title: "Data equipment lebih mudah dilacak",
          description:
            "Riwayat work order setiap equipment tersusun rapi sehingga admin lebih mudah mengecek pekerjaan sebelumnya.",
        },
        {
          title: "Request client tidak tercecer",
          description:
            "Problem dari client masuk ke sistem sebagai request dan bisa dikonversi menjadi work order saat perlu dikerjakan.",
        },
      ].map((item, index) => ({
        ...item,
        icon: sharedIcons.highlights[index] as MarketingIconName,
      })),
    },
    contact: {
      eyebrow: "Mulai ServiceFlow",
      title: "Siap membuat maintenance lebih mudah dipantau?",
      description:
        "Hubungi tim untuk diskusi kebutuhan kerja sama dan demo alur ServiceFlow.",
      whatsappCta: "WhatsApp",
      adminCta: "Admin",
    },
    footer: {
      client: "Client",
      technician: "Teknisi",
      admin: "Admin",
    },
    whatsappMessage:
      "Halo Kaizen, saya ingin konsultasi mengenai Kaizen ServiceFlow.",
  },
  en: {
    langLabel: "EN",
    switchLabel: "ID",
    switchHref: "/?lang=id",
    tagline: "Kaizen ServiceFlow",
    nav: [
      { label: "ServiceFlow", href: "#portal" },
      { label: "Workflow", href: "#workflow" },
      { label: "Advantages", href: "#services" },
      { label: "Contact", href: "#contact" },
    ],
    hero: {
      title: "ServiceFlow for clearer maintenance operations.",
      description:
        "One flow for client requests, work orders, technician tasks, and photo-backed service reports.",
      primaryCta: "Client Access",
      secondaryCta: "Consult",
    },
    stats: [
      { label: "Track jobs", value: "Live" },
      { label: "Proof reports", value: "Photo" },
      { label: "Asset history", value: "Clear" },
    ],
    preview: [
      { label: "Request", value: "Client", icon: "request" },
      { label: "Work Order", value: "Admin", icon: "workflow" },
      { label: "Progress", value: "Technician", icon: "technician" },
      { label: "Report", value: "Client", icon: "report" },
    ],
    benefitsSection: {
      eyebrow: "Kaizen ServiceHub",
      title: "One system for the maintenance workflow.",
      description:
        "ServiceFlow connects clients, admins, and technicians so job progress stays traceable.",
      items: [
        {
          title: "Client Workspace",
          description:
            "Clients can view maintenance status, equipment, and reports without waiting for manual updates.",
        },
        {
          title: "Admin Console",
          description:
            "Admins manage clients, equipment, work orders, requests, reports, and user accounts in one place.",
        },
        {
          title: "Technician Workspace",
          description:
            "Technicians see assigned jobs, update status, and submit service reports.",
        },
        {
          title: "Service Request",
          description:
            "Client issues enter the system as requests and can be reviewed or converted into work orders.",
        },
      ].map((item, index) => ({
        ...item,
        icon: sharedIcons.benefits[index] as MarketingIconName,
      })),
    },
    workflowSection: {
      eyebrow: "Workflow",
      title: "From client issue to completed report.",
      stepLabel: "Step",
      items: [
        {
          title: "Client submits an issue",
          description:
            "Maintenance issues are recorded in the system so the process is easy to track.",
        },
        {
          title: "Admin creates a work order",
          description:
            "Jobs are linked to the client, equipment, schedule, status, and assigned technician.",
        },
        {
          title: "Technician updates the job",
          description:
            "Job status and service reports are updated until the maintenance work is complete.",
        },
        {
          title: "Client reviews the report",
          description:
            "Clients can view progress and completed maintenance reports from the Client Workspace.",
        },
      ].map((item, index) => ({
        ...item,
        icon: sharedIcons.workflow[index] as MarketingIconName,
      })),
    },
    highlightsSection: {
      eyebrow: "System Advantages",
      title: "Built to make maintenance collaboration cleaner.",
      description:
        "ServiceHub helps service teams record jobs, prove maintenance results, and give clients clear access to progress.",
      items: [
        {
          title: "More transparent job progress",
          description:
            "Clients can monitor job status without waiting for manual service team updates.",
        },
        {
          title: "Stronger report documentation",
          description:
            "Technician reports include before condition, actions, final condition, notes, and photo evidence.",
        },
        {
          title: "Equipment history is easier to track",
          description:
            "Each equipment work order history is organized so admins can review past jobs faster.",
        },
        {
          title: "Client requests stay organized",
          description:
            "Client issues enter the system as requests and can be converted into work orders when needed.",
        },
      ].map((item, index) => ({
        ...item,
        icon: sharedIcons.highlights[index] as MarketingIconName,
      })),
    },
    contact: {
      eyebrow: "Start ServiceFlow",
      title: "Ready to make maintenance easier to track?",
      description:
        "Contact the team to discuss collaboration needs and see the ServiceFlow workflow.",
      whatsappCta: "WhatsApp",
      adminCta: "Admin",
    },
    footer: {
      client: "Client",
      technician: "Technician",
      admin: "Admin",
    },
    whatsappMessage:
      "Hello Kaizen, I would like to consult about Kaizen ServiceFlow.",
  },
} as const;

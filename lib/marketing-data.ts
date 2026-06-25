export const companyProfile = {
  name: "Kaizen",
  productName: "Kaizen ServiceHub",
  tagline: "Kaizen ServiceFlow",
  whatsappNumber: "6281529500457",
  whatsappMessage:
    "Halo Kaizen, saya ingin konsultasi mengenai Kaizen ServiceFlow.",
};

export const marketingNav = [
  { label: "ServiceFlow", href: "#portal" },
  { label: "Alur Kerja", href: "#workflow" },
  { label: "Keunggulan", href: "#services" },
  { label: "Kontak", href: "#contact" },
];

export const portalStats = [
  { label: "Pantau pekerjaan", value: "Live" },
  { label: "Bukti report", value: "Foto" },
  { label: "Riwayat alat", value: "Rapi" },
];

export const portalBenefits = [
  {
    title: "Client Portal",
    icon: "portal",
    description:
      "Client dapat melihat status maintenance, equipment, dan laporan pekerjaan tanpa menunggu update manual.",
  },
  {
    title: "Admin Console",
    icon: "admin",
    description:
      "Admin mengelola client, equipment, work order, request, report, dan akun pengguna dalam satu sistem.",
  },
  {
    title: "Technician Jobs",
    icon: "technician",
    description:
      "Teknisi melihat pekerjaan yang ditugaskan, update status, dan mengisi laporan hasil maintenance.",
  },
  {
    title: "Service Request",
    icon: "request",
    description:
      "Problem dari client masuk sebagai request sehingga mudah ditinjau dan dikonversi menjadi work order.",
  },
];

export const workflowSteps = [
  {
    title: "Client kirim problem",
    icon: "request",
    description:
      "Keluhan atau kebutuhan maintenance dicatat melalui portal agar alurnya mudah dilacak.",
  },
  {
    title: "Admin buat work order",
    icon: "admin",
    description:
      "Pekerjaan dihubungkan ke client, equipment, jadwal, status, dan teknisi yang menangani.",
  },
  {
    title: "Teknisi update pekerjaan",
    icon: "technician",
    description:
      "Status dan laporan teknisi diperbarui selama pekerjaan berjalan sampai selesai.",
  },
  {
    title: "Client pantau report",
    icon: "report",
    description:
      "Client melihat progress dan hasil pekerjaan maintenance dari portal monitoring.",
  },
];

export const serviceHighlights = [
  {
    title: "Progress kerja lebih transparan",
    icon: "workflow",
    description:
      "Client dapat memantau status pekerjaan tanpa harus menunggu update manual dari tim service.",
  },
  {
    title: "Dokumentasi report lebih kuat",
    icon: "report",
    description:
      "Laporan teknisi tersimpan bersama kondisi sebelum, tindakan, hasil akhir, catatan, dan foto bukti pekerjaan.",
  },
  {
    title: "Data equipment lebih mudah dilacak",
    icon: "equipment",
    description:
      "Riwayat work order setiap equipment tersusun rapi sehingga admin lebih mudah mengecek pekerjaan sebelumnya.",
  },
  {
    title: "Request client tidak tercecer",
    icon: "request",
    description:
      "Problem dari client masuk ke sistem sebagai request dan bisa dikonversi menjadi work order saat perlu dikerjakan.",
  },
];

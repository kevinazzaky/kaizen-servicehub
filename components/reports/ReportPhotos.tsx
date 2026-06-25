import Image from "next/image";

type ReportPhotosProps = {
  beforePhotoUrl?: string | null;
  afterPhotoUrl?: string | null;
};

export function ReportPhotos({
  beforePhotoUrl,
  afterPhotoUrl,
}: ReportPhotosProps) {
  if (!beforePhotoUrl && !afterPhotoUrl) {
    return null;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <ReportPhoto label="Foto Sebelum" url={beforePhotoUrl} />
      <ReportPhoto label="Foto Setelah" url={afterPhotoUrl} />
    </div>
  );
}

export function ReportPhotoInputs({
  beforePhotoUrl,
  afterPhotoUrl,
}: ReportPhotosProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <label className="grid gap-2 text-sm font-medium">
        Foto Sebelum
        <input
          name="beforePhoto"
          type="file"
          accept="image/*"
          className="rounded-md border border-zinc-300 px-3 py-2 font-normal"
        />
        {beforePhotoUrl ? (
          <span className="text-xs text-zinc-500">
            Foto sebelum sudah tersimpan. Pilih file baru untuk mengganti.
          </span>
        ) : null}
      </label>

      <label className="grid gap-2 text-sm font-medium">
        Foto Setelah
        <input
          name="afterPhoto"
          type="file"
          accept="image/*"
          className="rounded-md border border-zinc-300 px-3 py-2 font-normal"
        />
        {afterPhotoUrl ? (
          <span className="text-xs text-zinc-500">
            Foto setelah sudah tersimpan. Pilih file baru untuk mengganti.
          </span>
        ) : null}
      </label>
    </div>
  );
}

function ReportPhoto({ label, url }: { label: string; url?: string | null }) {
  return (
    <div className="rounded-md border border-zinc-200 bg-zinc-50 p-4">
      <p className="text-sm font-medium text-zinc-700">{label}</p>
      {url ? (
        <Image
          src={url}
          alt={label}
          width={1200}
          height={675}
          className="mt-3 aspect-video w-full rounded-md object-cover"
        />
      ) : (
        <div className="mt-3 grid aspect-video place-items-center rounded-md border border-dashed border-zinc-300 text-sm text-zinc-500">
          Belum ada foto
        </div>
      )}
    </div>
  );
}

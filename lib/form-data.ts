export function getString(formData: FormData, key: string): string | null {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function getRequiredString(formData: FormData, key: string) {
  const value = getString(formData, key);

  if (!value) {
    throw new Error(`${key} wajib diisi.`);
  }

  return value;
}

export function getDate(value: string | null): Date | null {
  if (!value) {
    return null;
  }

  return new Date(value);
}

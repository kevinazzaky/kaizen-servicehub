export type LayoutIconName =
  | "dashboard"
  | "clients"
  | "equipment"
  | "workOrders"
  | "requests"
  | "team"
  | "clientAccess"
  | "jobs"
  | "logout";

const iconPaths: Record<LayoutIconName, string> = {
  dashboard:
    "M4 5.5A1.5 1.5 0 0 1 5.5 4h5A1.5 1.5 0 0 1 12 5.5v5a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 4 10.5v-5Zm10 0A1.5 1.5 0 0 1 15.5 4h3A1.5 1.5 0 0 1 20 5.5v3A1.5 1.5 0 0 1 18.5 10h-3A1.5 1.5 0 0 1 14 8.5v-3ZM4 15.5A1.5 1.5 0 0 1 5.5 14h3a1.5 1.5 0 0 1 1.5 1.5v3A1.5 1.5 0 0 1 8.5 20h-3A1.5 1.5 0 0 1 4 18.5v-3Zm8 0a1.5 1.5 0 0 1 1.5-1.5h5a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-5a1.5 1.5 0 0 1-1.5-1.5v-3Z",
  clients:
    "M16 11a4 4 0 1 0-8 0 4 4 0 0 0 8 0ZM5 20a7 7 0 0 1 14 0M18 8a3 3 0 0 1 2.7 4.3M20.5 20a5.5 5.5 0 0 0-3-4.9",
  equipment:
    "M5 7h14v10H5V7Zm3-3h8v3H8V4Zm1 7h6m-6 3h4",
  workOrders:
    "M7 4h7l4 4v12H7V4Zm7 0v5h4M10 13h5M10 17h5",
  requests:
    "M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v9a1.5 1.5 0 0 1-1.5 1.5H12l-4 4v-4H5.5A1.5 1.5 0 0 1 4 14.5v-9Zm4 3h8M8 12h5",
  team: "M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8-1a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM3 20a5 5 0 0 1 10 0m2.5 0H21a4.5 4.5 0 0 0-6.3-4.1",
  clientAccess:
    "M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6Zm4 14h8M10 16v4m4-4v4M8 8h8m-8 4h5",
  jobs: "M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-3 3-2.4-2.4 3-3Z",
  logout:
    "M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4m5-4 4-4-4-4m4 4H9",
};

export function LayoutIcon({
  name,
  className = "",
}: {
  name: LayoutIconName;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d={iconPaths[name]} />
    </svg>
  );
}

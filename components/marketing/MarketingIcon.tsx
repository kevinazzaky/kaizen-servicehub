export type MarketingIconName =
  | "portal"
  | "admin"
  | "technician"
  | "request"
  | "workflow"
  | "maintenance"
  | "equipment"
  | "report";

const iconPaths: Record<MarketingIconName, string> = {
  portal: "M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v9a1.5 1.5 0 0 1-1.5 1.5H12l-4 4v-4H5.5A1.5 1.5 0 0 1 4 14.5v-9Zm4 3h8M8 12h5",
  admin: "M12 4l7 3v5c0 4-2.7 7-7 8-4.3-1-7-4-7-8V7l7-3Zm0 4v8m-3-4h6",
  technician:
    "M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-3 3-2.4-2.4 3-3Z",
  request:
    "M6 4h9l3 3v13H6V4Zm8 0v4h4M9 12h6M9 16h4",
  workflow:
    "M6 7a3 3 0 1 0 0 .1M18 17a3 3 0 1 0 0 .1M8.5 7H14a4 4 0 0 1 4 4v3M15.5 17H10a4 4 0 0 1-4-4v-3",
  maintenance:
    "M12 3v3m0 12v3M4.6 6.6l2.1 2.1m10.6 10.6 2.1 2.1M3 12h3m12 0h3M4.6 17.4l2.1-2.1M17.3 8.7l2.1-2.1M9 12a3 3 0 1 0 6 0 3 3 0 0 0-6 0Z",
  equipment:
    "M5 7h14v10H5V7Zm3-3h8v3H8V4Zm1 7h6m-6 3h4",
  report:
    "M7 4h7l4 4v12H7V4Zm7 0v5h4M10 12h5m-5 4h5",
};

export function MarketingIcon({
  name,
  className = "",
}: {
  name: MarketingIconName;
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

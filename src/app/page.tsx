"use client";

import { useMemo, useState } from "react";

type FileKind = "Docs" | "Sheets" | "Slides" | "PDF" | "Image" | "Video";

type DriveItem = {
  id: string;
  name: string;
  owner: string;
  modified: string;
  size: string;
} & (
  | {
      type: "folder";
      children: DriveItem[];
    }
  | {
      type: "file";
      kind: FileKind;
      href: string;
    }
);

type IconName =
  | "archive"
  | "arrowUp"
  | "chevronRight"
  | "clock"
  | "cloud"
  | "file"
  | "folder"
  | "grid"
  | "hardDrive"
  | "image"
  | "link"
  | "search"
  | "share"
  | "sparkle"
  | "star"
  | "trash";

const driveItems: DriveItem[] = [
  {
    id: "strategy",
    name: "Product Strategy",
    type: "folder",
    owner: "Maya Chen",
    modified: "Today",
    size: "12 items",
    children: [
      {
        id: "roadmap",
        name: "2026 Roadmap",
        type: "file",
        kind: "Slides",
        owner: "Maya Chen",
        modified: "Today",
        size: "18 MB",
        href: "https://docs.google.com/presentation/",
      },
      {
        id: "planning",
        name: "Launch Planning Notes",
        type: "file",
        kind: "Docs",
        owner: "Jordan Lee",
        modified: "Yesterday",
        size: "84 KB",
        href: "https://docs.google.com/document/",
      },
      {
        id: "research",
        name: "Customer Research",
        type: "folder",
        owner: "Priya Shah",
        modified: "Jul 18",
        size: "6 items",
        children: [
          {
            id: "interviews",
            name: "Interview Highlights",
            type: "file",
            kind: "Docs",
            owner: "Priya Shah",
            modified: "Jul 18",
            size: "116 KB",
            href: "https://docs.google.com/document/",
          },
          {
            id: "survey",
            name: "Survey Export",
            type: "file",
            kind: "Sheets",
            owner: "Maya Chen",
            modified: "Jul 16",
            size: "2.2 MB",
            href: "https://docs.google.com/spreadsheets/",
          },
        ],
      },
    ],
  },
  {
    id: "design",
    name: "Design",
    type: "folder",
    owner: "Elena Ruiz",
    modified: "Jul 20",
    size: "28 items",
    children: [
      {
        id: "brand-kit",
        name: "Brand Kit",
        type: "file",
        kind: "PDF",
        owner: "Elena Ruiz",
        modified: "Jul 20",
        size: "7.4 MB",
        href: "https://drive.google.com/file/",
      },
      {
        id: "hero-art",
        name: "Homepage Hero",
        type: "file",
        kind: "Image",
        owner: "Elena Ruiz",
        modified: "Jul 12",
        size: "11 MB",
        href: "https://drive.google.com/file/",
      },
    ],
  },
  {
    id: "finance",
    name: "Finance",
    type: "folder",
    owner: "Noah Patel",
    modified: "Jul 15",
    size: "9 items",
    children: [
      {
        id: "budget",
        name: "Q3 Budget",
        type: "file",
        kind: "Sheets",
        owner: "Noah Patel",
        modified: "Jul 15",
        size: "940 KB",
        href: "https://docs.google.com/spreadsheets/",
      },
      {
        id: "invoice",
        name: "Vendor Invoices",
        type: "folder",
        owner: "Noah Patel",
        modified: "Jul 10",
        size: "14 items",
        children: [
          {
            id: "northstar",
            name: "Northstar Creative Invoice",
            type: "file",
            kind: "PDF",
            owner: "Noah Patel",
            modified: "Jul 10",
            size: "312 KB",
            href: "https://drive.google.com/file/",
          },
        ],
      },
    ],
  },
  {
    id: "team-handbook",
    name: "Team Handbook",
    type: "file",
    kind: "Docs",
    owner: "Sam Rivera",
    modified: "Today",
    size: "128 KB",
    href: "https://docs.google.com/document/",
  },
  {
    id: "quarterly-report",
    name: "Quarterly Report",
    type: "file",
    kind: "Sheets",
    owner: "Noah Patel",
    modified: "Yesterday",
    size: "1.8 MB",
    href: "https://docs.google.com/spreadsheets/",
  },
  {
    id: "company-all-hands",
    name: "Company All Hands Recording",
    type: "file",
    kind: "Video",
    owner: "Maya Chen",
    modified: "Jul 11",
    size: "824 MB",
    href: "https://drive.google.com/file/",
  },
];

const navItems: { label: string; icon: IconName; active?: boolean }[] = [
  { label: "My Drive", icon: "cloud", active: true },
  { label: "Shared", icon: "share" },
  { label: "Recent", icon: "clock" },
  { label: "Starred", icon: "star" },
  { label: "Trash", icon: "trash" },
];

const fileTheme: Record<FileKind, string> = {
  Docs: "bg-blue-50 text-blue-700 ring-blue-100",
  Sheets: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  Slides: "bg-amber-50 text-amber-700 ring-amber-100",
  PDF: "bg-rose-50 text-rose-700 ring-rose-100",
  Image: "bg-violet-50 text-violet-700 ring-violet-100",
  Video: "bg-sky-50 text-sky-700 ring-sky-100",
};

function findFolder(items: DriveItem[], path: string[]): DriveItem[] {
  let current = items;

  for (const id of path) {
    const next = current.find(
      (item) => item.type === "folder" && item.id === id,
    );

    if (!next || next.type !== "folder") {
      return items;
    }

    current = next.children;
  }

  return current;
}

function findCrumbs(items: DriveItem[], path: string[]) {
  const crumbs = [{ id: "root", name: "My Drive" }];
  let current = items;

  for (const id of path) {
    const next = current.find(
      (item) => item.type === "folder" && item.id === id,
    );

    if (!next || next.type !== "folder") {
      break;
    }

    crumbs.push({ id: next.id, name: next.name });
    current = next.children;
  }

  return crumbs;
}

function Icon({
  name,
  className = "h-5 w-5",
}: {
  name: IconName;
  className?: string;
}) {
  const paths: Record<IconName, React.ReactNode> = {
    archive: (
      <>
        <path d="M4 7h16" />
        <path d="M6 7v11a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7" />
        <path d="M9 11h6" />
        <path d="M5 4h14v3H5z" />
      </>
    ),
    arrowUp: (
      <>
        <path d="M12 19V5" />
        <path d="m6 11 6-6 6 6" />
      </>
    ),
    chevronRight: <path d="m9 18 6-6-6-6" />,
    clock: (
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v5l3 2" />
      </>
    ),
    cloud: (
      <path d="M17.5 18H8a5 5 0 0 1-.9-9.9 6.5 6.5 0 0 1 12 2.4A3.8 3.8 0 0 1 17.5 18Z" />
    ),
    file: (
      <>
        <path d="M7 3h7l4 4v14H7z" />
        <path d="M14 3v5h5" />
      </>
    ),
    folder: (
      <>
        <path d="M3.5 7.5A2.5 2.5 0 0 1 6 5h4l2 2h6a2.5 2.5 0 0 1 2.5 2.5V17A2.5 2.5 0 0 1 18 19.5H6A2.5 2.5 0 0 1 3.5 17Z" />
        <path d="M3.5 10h17" />
      </>
    ),
    grid: (
      <>
        <path d="M5 5h5v5H5z" />
        <path d="M14 5h5v5h-5z" />
        <path d="M5 14h5v5H5z" />
        <path d="M14 14h5v5h-5z" />
      </>
    ),
    hardDrive: (
      <>
        <path d="M5 5h14l2 8v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4Z" />
        <path d="M3 13h18" />
        <path d="M7 16h.01" />
      </>
    ),
    image: (
      <>
        <path d="M5 5h14v14H5z" />
        <path d="m5 15 4-4 3 3 2-2 5 5" />
        <circle cx="15.5" cy="8.5" r="1.5" />
      </>
    ),
    link: (
      <>
        <path d="M10 13a5 5 0 0 0 7.1 0l1.4-1.4a5 5 0 0 0-7.1-7.1L10.5 5" />
        <path d="M14 11a5 5 0 0 0-7.1 0l-1.4 1.4a5 5 0 0 0 7.1 7.1l.9-.9" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </>
    ),
    share: (
      <>
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <path d="m8.6 10.5 6.8-4" />
        <path d="m8.6 13.5 6.8 4" />
      </>
    ),
    sparkle: (
      <>
        <path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7Z" />
        <path d="m19 15 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7Z" />
      </>
    ),
    star: (
      <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z" />
    ),
    trash: (
      <>
        <path d="M4 7h16" />
        <path d="M10 11v6" />
        <path d="M14 11v6" />
        <path d="M6 7l1 14h10l1-14" />
        <path d="M9 7V4h6v3" />
      </>
    ),
  };

  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      {paths[name]}
    </svg>
  );
}

function UploadButton({ compact = false }: { compact?: boolean }) {
  return (
    <label
      className={`group inline-flex cursor-pointer items-center justify-center rounded-full bg-[#1d1d1f] font-medium text-white shadow-[0_12px_28px_rgba(0,0,0,0.16)] transition duration-200 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#7a8fa8] hover:-translate-y-0.5 hover:bg-black ${
        compact ? "h-11 w-11" : "gap-2 px-5 py-3 text-sm"
      }`}
    >
      <Icon
        className={`transition group-hover:-translate-y-0.5 ${compact ? "h-5 w-5" : "h-4 w-4"}`}
        name="arrowUp"
      />
      {!compact && <span>Upload</span>}
      <input className="sr-only" multiple type="file" />
    </label>
  );
}

function Sidebar() {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-black/5 bg-white/55 px-5 py-6 backdrop-blur-xl lg:block">
      <div className="mb-10 flex items-center gap-3 px-2">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#1d1d1f] text-white shadow-sm">
          <Icon className="h-5 w-5" name="cloud" />
        </div>
        <div>
          <div className="text-base font-semibold text-[#1d1d1f]">Drive</div>
          <div className="text-xs text-[#737373]">Personal workspace</div>
        </div>
      </div>

      <UploadButton />

      <nav aria-label="Primary" className="mt-9 space-y-1">
        {navItems.map((item) => (
          <button
            className={`flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-sm transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7a8fa8] ${
              item.active
                ? "bg-white text-[#1d1d1f] shadow-[0_10px_30px_rgba(15,23,42,0.07)] ring-1 ring-black/[0.04]"
                : "text-[#676767] hover:bg-white/70 hover:text-[#1d1d1f]"
            }`}
            key={item.label}
            type="button"
          >
            <Icon className="h-4.5 w-4.5" name={item.icon} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <section
        aria-label="Storage usage"
        className="mt-10 rounded-3xl border border-white/70 bg-white/65 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.06)]"
      >
        <div className="mb-4 flex items-center justify-between text-sm">
          <span className="font-medium text-[#1d1d1f]">Storage</span>
          <span className="text-[#737373]">62%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[#eceff3]">
          <div className="h-full w-[62%] rounded-full bg-[#7a8fa8]" />
        </div>
        <p className="mt-3 text-xs leading-5 text-[#737373]">
          9.3 GB used of 15 GB. Files here are sample UI links.
        </p>
      </section>
    </aside>
  );
}

function TopBar({
  query,
  setQuery,
}: {
  query: string;
  setQuery: (query: string) => void;
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-black/[0.04] bg-[#f6f5f2]/80 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-7xl items-center gap-3">
        <div className="flex items-center gap-3 lg:hidden">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#1d1d1f] text-white">
            <Icon className="h-5 w-5" name="cloud" />
          </div>
          <span className="text-base font-semibold text-[#1d1d1f]">Drive</span>
        </div>

        <label className="ml-auto flex h-12 min-w-0 flex-1 items-center rounded-full border border-black/[0.06] bg-white/75 px-4 text-[#737373] shadow-[0_10px_30px_rgba(15,23,42,0.04)] transition focus-within:border-[#7a8fa8]/50 focus-within:bg-white focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#7a8fa8]/30 lg:ml-0 lg:max-w-2xl">
          <Icon className="mr-3 h-4.5 w-4.5 shrink-0" name="search" />
          <span className="sr-only">Search in Drive</span>
          <input
            className="w-full bg-transparent text-sm text-[#1d1d1f] outline-none placeholder:text-[#8a8a8a]"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search files and folders"
            type="search"
            value={query}
          />
        </label>

        <div className="hidden items-center gap-2 sm:flex">
          <button
            aria-label="Grid view"
            className="grid h-11 w-11 place-items-center rounded-full border border-black/[0.06] bg-white/70 text-[#676767] transition hover:bg-white hover:text-[#1d1d1f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7a8fa8]"
            type="button"
          >
            <Icon className="h-4.5 w-4.5" name="grid" />
          </button>
          <UploadButton compact />
        </div>
      </div>
    </header>
  );
}

function Breadcrumbs({
  crumbs,
  onJump,
}: {
  crumbs: { id: string; name: string }[];
  onJump: (index: number) => void;
}) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1">
      {crumbs.map((crumb, index) => (
        <span className="flex items-center gap-1" key={crumb.id}>
          {index > 0 && (
            <Icon className="h-3.5 w-3.5 text-[#a2a2a2]" name="chevronRight" />
          )}
          <button
            className="rounded-full px-2.5 py-1 text-sm font-medium text-[#676767] transition hover:bg-white hover:text-[#1d1d1f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7a8fa8]"
            onClick={() => onJump(index)}
            type="button"
          >
            {crumb.name}
          </button>
        </span>
      ))}
    </nav>
  );
}

function FileBadge({ kind }: { kind: FileKind }) {
  return (
    <span
      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl text-[10px] font-semibold ring-1 ${fileTheme[kind]}`}
    >
      {kind.slice(0, 3).toUpperCase()}
    </span>
  );
}

function FolderIcon() {
  return (
    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-[#7a8fa8] shadow-sm ring-1 ring-black/[0.04]">
      <Icon className="h-5 w-5" name="folder" />
    </span>
  );
}

function FolderTile({
  item,
  onOpen,
}: {
  item: Extract<DriveItem, { type: "folder" }>;
  onOpen: (id: string) => void;
}) {
  return (
    <button
      className="group rounded-[1.75rem] border border-white/70 bg-white/70 p-4 text-left shadow-[0_18px_50px_rgba(15,23,42,0.06)] transition duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_22px_60px_rgba(15,23,42,0.09)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7a8fa8]"
      onClick={() => onOpen(item.id)}
      type="button"
    >
      <div className="mb-7 flex items-start justify-between gap-4">
        <FolderIcon />
        <Icon
          className="h-4 w-4 text-[#a2a2a2] transition group-hover:translate-x-0.5 group-hover:text-[#1d1d1f]"
          name="chevronRight"
        />
      </div>
      <h3 className="truncate text-base font-semibold text-[#1d1d1f]">
        {item.name}
      </h3>
      <p className="mt-2 text-sm text-[#737373]">
        {item.size} by {item.owner}
      </p>
    </button>
  );
}

function FileRow({
  item,
  onOpen,
}: {
  item: DriveItem;
  onOpen: (id: string) => void;
}) {
  const content = (
    <>
      <div className="flex min-w-0 items-center gap-3">
        {item.type === "folder" ? (
          <FolderIcon />
        ) : (
          <FileBadge kind={item.kind} />
        )}
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-[#1d1d1f]">
            {item.name}
          </div>
          <div className="mt-1 text-xs text-[#737373] md:hidden">
            {item.owner} / {item.size}
          </div>
        </div>
      </div>
      <span className="hidden truncate text-sm text-[#737373] md:block">
        {item.owner}
      </span>
      <span className="text-sm text-[#737373]">{item.modified}</span>
      <span className="hidden text-right text-sm text-[#737373] md:block">
        {item.size}
      </span>
    </>
  );

  const rowClass =
    "grid w-full grid-cols-[minmax(0,1fr)_6rem] items-center gap-4 px-4 py-3.5 text-left transition duration-200 hover:bg-[#f8f8f6] focus-visible:relative focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#7a8fa8] md:grid-cols-[minmax(0,1fr)_10rem_8rem_7rem]";

  if (item.type === "folder") {
    return (
      <button
        className={rowClass}
        onClick={() => onOpen(item.id)}
        type="button"
      >
        {content}
      </button>
    );
  }

  return (
    <a className={rowClass} href={item.href} rel="noreferrer" target="_blank">
      {content}
    </a>
  );
}

export default function HomePage() {
  const [path, setPath] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const currentItems = useMemo(() => findFolder(driveItems, path), [path]);
  const crumbs = useMemo(() => findCrumbs(driveItems, path), [path]);
  const visibleItems = currentItems.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase()),
  );
  const folderItems = visibleItems.filter(
    (item): item is Extract<DriveItem, { type: "folder" }> =>
      item.type === "folder",
  );

  function openFolder(id: string) {
    setPath((currentPath) => [...currentPath, id]);
    setQuery("");
  }

  function jumpToCrumb(index: number) {
    setPath(path.slice(0, index));
    setQuery("");
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#ffffff_0,#f6f5f2_42%,#eceff3_100%)] font-sans text-[#1d1d1f]">
      <div className="flex min-h-screen">
        <Sidebar />

        <section className="flex min-w-0 flex-1 flex-col">
          <TopBar query={query} setQuery={setQuery} />

          <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <Breadcrumbs crumbs={crumbs} onJump={jumpToCrumb} />
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <div className="sm:hidden">
                  <UploadButton />
                </div>
                <div className="flex rounded-full border border-white/70 bg-white/65 p-1 shadow-[0_14px_40px_rgba(15,23,42,0.05)]">
                  {["All", "Folders", "Files"].map((label, index) => (
                    <button
                      className={`rounded-full px-4 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7a8fa8] ${
                        index === 0
                          ? "bg-[#1d1d1f] text-white"
                          : "text-[#676767] hover:text-[#1d1d1f]"
                      }`}
                      key={label}
                      type="button"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {folderItems.length > 0 && (
              <section aria-labelledby="folders" className="mb-9">
                <h2
                  className="mb-4 text-lg font-semibold text-[#1d1d1f]"
                  id="folders"
                >
                  Folders
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {folderItems.map((item) => (
                    <FolderTile item={item} key={item.id} onOpen={openFolder} />
                  ))}
                </div>
              </section>
            )}

            <section
              aria-labelledby="all-items"
              className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/70 shadow-[0_24px_80px_rgba(15,23,42,0.07)]"
            >
              <div className="flex flex-col gap-2 border-b border-black/[0.04] px-5 py-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2
                    className="text-lg font-semibold text-[#1d1d1f]"
                    id="all-items"
                  >
                    {crumbs.at(-1)?.name}
                  </h2>
                  <p className="mt-1 text-sm text-[#737373]">
                    Open folders in place. Files open as direct sample links.
                  </p>
                </div>
                <button
                  className="inline-flex items-center gap-2 self-start rounded-full px-3 py-2 text-sm font-medium text-[#676767] transition hover:bg-[#f1f1ee] hover:text-[#1d1d1f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7a8fa8]"
                  type="button"
                >
                  <Icon className="h-4 w-4" name="grid" />
                  List view
                </button>
              </div>

              <div className="grid grid-cols-[minmax(0,1fr)_6rem] gap-4 border-b border-black/[0.04] px-4 py-3 text-xs font-semibold tracking-normal text-[#8a8a8a] uppercase md:grid-cols-[minmax(0,1fr)_10rem_8rem_7rem]">
                <span>Name</span>
                <span className="hidden md:block">Owner</span>
                <span>Modified</span>
                <span className="hidden text-right md:block">Size</span>
              </div>

              {visibleItems.length > 0 ? (
                <div className="divide-y divide-black/[0.04]">
                  {visibleItems.map((item) => (
                    <FileRow item={item} key={item.id} onOpen={openFolder} />
                  ))}
                </div>
              ) : (
                <div className="px-6 py-16 text-center">
                  <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-[#f1f1ee] text-[#7a8fa8]">
                    <Icon className="h-5 w-5" name="search" />
                  </div>
                  <h3 className="text-base font-semibold text-[#1d1d1f]">
                    No items found
                  </h3>
                  <p className="mt-2 text-sm text-[#737373]">
                    Try another search or choose a different folder.
                  </p>
                </div>
              )}
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}

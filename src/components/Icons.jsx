const P = {
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  branch: <><circle cx="6" cy="5" r="2.5" /><circle cx="6" cy="19" r="2.5" /><circle cx="18" cy="9" r="2.5" /><path d="M6 7.5v9M18 11.5c0 5-12 2-12 5" /></>,
  folder: <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />,
  award: <><circle cx="12" cy="9" r="6" /><path d="m8.5 14-1.5 7 5-2.5 5 2.5-1.5-7" /></>,
  file: <><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 7 9-7" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19" /></>,
  moon: <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" />,
  insta: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".8" /></>,
  chat: <path d="M4 5h16v11H9l-5 4V5Z" />,
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />,
  linkedin: <><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M8 10v6M8 7.5v.01M12 16v-6m0 3a3 3 0 0 1 6 0v3" /></>,
  github: <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />,
  arrow: <path d="M7 17 17 7M8 7h9v9" />,
  spark: <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Zm7 12 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" />,
  search: <><circle cx="11" cy="11" r="6" /><path d="m20 20-4-4" /></>,
  cap: <><path d="m2 9 10-5 10 5-10 5L2 9Z" /><path d="M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5M22 9v6" /></>,
  music: <><path d="M9 18V5l11-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="17" cy="16" r="3" /></>,
  send: <path d="M4 12 20 4l-6 16-3-7-7-1Z" />,
  copy: <><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></>,
  swap: <path d="M7 4 3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7" />,
  download: <path d="M12 4v11m0 0-4-4m4 4 4-4M5 20h14" />,
  volume: <><path d="M4 9v6h4l5 4V5L8 9H4Z" /><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" /></>,
  mute: <><path d="M4 9v6h4l5 4V5L8 9H4Z" /><path d="m17 9 5 6m0-6-5 6" /></>,
  refresh: <><path d="M20 11a8 8 0 1 0-2.3 5.7" /><path d="M20 4v7h-7" /></>,
  card: <><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="11" r="2.2" /><path d="M5.8 16a3.4 3.4 0 0 1 6.4 0M14 10h4M14 13.5h3" /></>,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></>,
  grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
  frame: <><rect x="3" y="4" width="18" height="16" rx="1" /><rect x="7" y="8" width="10" height="8" /></>,
  play: <path d="M7 4.5v15l12-7.5-12-7.5Z" />,
  pause: <path d="M7 4h3.5v16H7zM13.5 4H17v16h-3.5z" />,
};

export default function Icon({ name, size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {P[name]}
    </svg>
  );
}

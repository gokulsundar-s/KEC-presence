export const DashboardIcon = ({ filled }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="30"
    height="30"
    fill={filled ? "#fff" : "none"}
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <circle cx="6.5" cy="17.5" r="3.5" />
  </svg>
);

export const NewRequestIcon = ({ filled }) => (
  <svg
    width="32"
    height="32"
    fill="none"
    stroke="currentColor"
    stroke-width="1.75"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <rect
      x="4"
      y="4"
      width="16"
      height="16"
      rx="2"
      stroke="currentColor"
      fill={filled ? "#fff" : "none"}
    />
    <path
      d="M12 8v8M8 12h8"
      stroke={filled ? "#4061f2" : "currentColor"}
      stroke-linecap="round"
    />
  </svg>
);

export const HistoryIcon = ({ filled }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="28"
    fill={filled ? "#fff" : "none"}
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline
      points="12 6 12 12 16 15"
      stroke={filled ? "#4061f2" : "currentColor"}
    />
  </svg>
);

export const SettingsIcon = ({ filled }) => (
  <svg
    width="30"
    height="30"
    viewBox="0 0 1024 1024"
    class="icon"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill={filled ? "#fff" : "none"}
      d="M764.416 254.72a351.68 351.68 0 0186.336 149.184H960v192.064H850.752a351.68 351.68 0 01-86.336 149.312l54.72 94.72-166.272 96-54.592-94.72a352.64 352.64 0 01-172.48 0L371.136 936l-166.272-96 54.72-94.72a351.68 351.68 0 01-86.336-149.312H64v-192h109.248a351.68 351.68 0 0186.336-149.312L204.8 160l166.208-96h.192l54.656 94.592a352.64 352.64 0 01172.48 0L652.8 64h.128L819.2 160l-54.72 94.72zM704 499.968a192 192 0 10-384 0 192 192 0 00384 0z"
    />
  </svg>
);

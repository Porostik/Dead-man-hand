/**
 * High Noon western icon set — solid-fill glyphs on a 24×24 grid, drawn with
 * `currentColor` so they tint to any token. Two families share one style:
 * brand paraphernalia (suits, sheriff star, coin, revolver, bullet, hat…)
 * and UI essentials (plus, close, back, chevron…). Raw inner-SVG per name.
 */
export const HN_ICONS = {
  // ---- card suits ----
  spade:
    '<path d="M12 2C12 2 4 8.5 4 13.6c0 2.7 2 4.4 4.4 4.1c.7-.1 1.3-.4 1.8-.8c-.2 1.7-.9 3.2-2.2 4.6h8c-1.3-1.4-2-2.9-2.2-4.6c.5.4 1.1.7 1.8.8c2.4.3 4.4-1.4 4.4-4.1C20 8.5 12 2 12 2Z"/>',
  heart:
    '<path d="M12 21C12 21 3 14.6 3 8.7C3 5.7 5.2 4 7.6 4C9.6 4 11.1 5.4 12 7C12.9 5.4 14.4 4 16.4 4C18.8 4 21 5.7 21 8.7C21 14.6 12 21 12 21Z"/>',
  club: '<circle cx="12" cy="7.2" r="3.7"/><circle cx="7.2" cy="13.4" r="3.7"/><circle cx="16.8" cy="13.4" r="3.7"/><path d="M10.6 12.5h2.8l1.4 8.5h-5.6z"/>',
  diamond: '<path d="M12 2.2 20 12 12 21.8 4 12Z"/>',
  // ---- brand / paraphernalia ----
  star: '<path d="M12 2 14.7 8.6 21.8 9.2 16.4 13.9 18.1 21 12 17.2 5.9 21 7.6 13.9 2.2 9.2 9.3 8.6Z"/>',
  sheriffStar:
    '<path d="M12 3 14.3 8.85 20.6 9.2 15.7 13.2 17.3 19.3 12 15.9 6.7 19.3 8.3 13.2 3.4 9.2 9.7 8.85Z"/><circle cx="12" cy="3" r="1.5"/><circle cx="20.6" cy="9.2" r="1.5"/><circle cx="17.3" cy="19.3" r="1.5"/><circle cx="6.7" cy="19.3" r="1.5"/><circle cx="3.4" cy="9.2" r="1.5"/><circle cx="12" cy="11.6" r="1.7" fill="#000" opacity=".28"/>',
  coin: '<path fill-rule="evenodd" d="M12 2.5a9.5 9.5 0 100 19 9.5 9.5 0 000-19Zm0 2.6a6.9 6.9 0 110 13.8 6.9 6.9 0 010-13.8ZM12 7.6 15.4 12 12 16.4 8.6 12Z"/>',
  chip: '<path fill-rule="evenodd" d="M12 2a10 10 0 100 20 10 10 0 000-20Zm0 4.2a5.8 5.8 0 110 11.6 5.8 5.8 0 010-11.6ZM11 2.4h2v3h-2zm0 16.2h2v3h-2zM2.4 11h3v2h-3zm16.2 0h3v2h-3z"/>',
  bullet:
    '<path d="M12 2.2c2.1 0 3.6 2.3 3.6 5.4V10H8.4V7.6C8.4 4.5 9.9 2.2 12 2.2Z"/><path d="M8.2 11h7.6v8.4a2 2 0 01-2 2h-3.6a2 2 0 01-2-2Z"/>',
  hat: '<path d="M7 13c-.4-3 .1-7 1.6-8.5c1.2-1.2 5.6-1.2 6.8 0C16.9 6 17.4 10 17 13Z"/><path d="M2.5 14.2c2.4 1.6 5.8 2.3 9.5 2.3s7.1-.7 9.5-2.3c.5 1.6-.2 2.8-2 3.5c-2 .8-4.7 1.2-7.5 1.2s-5.5-.4-7.5-1.2c-1.8-.7-2.5-1.9-2-3.5Z"/>',
  horseshoe:
    '<path d="M6 21c-1.4-1.6-2.4-4-2.4-7C3.6 8.5 7.4 4 12 4s8.4 4.5 8.4 10c0 3-1 5.4-2.4 7l-2.6-1.4c1-1.2 1.7-3.1 1.7-5.6c0-3.6-2.3-6.4-5.1-6.4S6.8 10.4 6.8 14c0 2.5.7 4.4 1.7 5.6Z"/><circle cx="6.4" cy="20" r="1.1"/><circle cx="17.6" cy="20" r="1.1"/>',
  revolver:
    '<path d="M2 8.5h12.5l1.8-1.8 1.4 1.4-1.4 1.4H15v1.6h-2.2l-.7 1.9H9.6l-.5 2.4c-.4 2-1.6 3.7-3.6 3.7H4v-2.2h1.5c.8 0 1.3-.7 1.5-1.7l.4-1.9H6a3.6 3.6 0 010-7.2Z"/><circle cx="8.4" cy="12.1" r="1.9" fill="#000" opacity=".28"/>',
  dynamite:
    '<path d="M8 8h8a2 2 0 012 2v9a2 2 0 01-2 2H8a2 2 0 01-2-2v-9a2 2 0 012-2Z"/><path d="M11 8V5.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="11" cy="4" r="1.6"/>',
  skull:
    '<path d="M12 2.5c-4.7 0-8 3.3-8 7.6c0 2.6 1.2 4.4 2.8 5.6V19a1.5 1.5 0 001.5 1.5h1V18h1.5v2.5h2.4V18H16v2.5h1A1.5 1.5 0 0018.5 19v-3.3c1.6-1.2 2.8-3 2.8-5.6c0-4.3-3.4-7.6-8-7.6Z"/><circle cx="8.8" cy="10.4" r="1.9" fill="#000" opacity=".3"/><circle cx="15.2" cy="10.4" r="1.9" fill="#000" opacity=".3"/>',
  cactus:
    '<path d="M10.5 22V6a1.5 1.5 0 013 0v16Z"/><path d="M10.5 13H8a1.5 1.5 0 01-1.5-1.5V9a1.2 1.2 0 012.4 0v1.6h1.6Z"/><path d="M13.5 11h2a1.5 1.5 0 001.5-1.5V8a1.2 1.2 0 00-2.4 0v1.1h-1.1Z"/>',
  flame:
    '<path d="M12 2.5c2 3.3 1 5.2-.5 6.8C9.7 11.2 8 12.7 8 15.4A4 4 0 0012 19.5 4 4 0 0016 15.4c0-1.6-.7-2.9-1.4-4c-.4 1-1 1.6-1.8 2c.6-2.3.1-4.6-.8-6.9c-.4 2-1.3 3-2.2 3.7c.7-2.6.9-5.2.2-7.7Z"/>',
  bolt: '<path d="M13 2 4 13.5h5.5L9 22l9-12h-5.7Z"/>',
  trophy:
    '<path d="M7 4h10v3a5 5 0 01-3.6 4.8L13 14h-2l-.4-2.2A5 5 0 017 7Z"/><path d="M7 5H4.5v1.5A2.5 2.5 0 007 9Zm10 0h2.5v1.5A2.5 2.5 0 0117 9Z"/><path d="M10 14h4v3h-4z"/><path d="M8 19h8v2.2H8z"/>',
  target:
    '<path fill-rule="evenodd" d="M12 2.5a9.5 9.5 0 100 19 9.5 9.5 0 000-19Zm0 3a6.5 6.5 0 110 13 6.5 6.5 0 010-13Z"/><path fill-rule="evenodd" d="M12 8a4 4 0 100 8 4 4 0 000-8Zm0 2.4a1.6 1.6 0 110 3.2 1.6 1.6 0 010-3.2Z"/>',
  // ---- UI essentials ----
  plus: '<path d="M11 4h2v7h7v2h-7v7h-2v-7H4v-2h7Z"/>',
  close:
    '<path d="M5.6 4.2 12 10.6l6.4-6.4 1.4 1.4L13.4 12l6.4 6.4-1.4 1.4L12 13.4l-6.4 6.4-1.4-1.4L10.6 12 4.2 5.6Z"/>',
  back: '<path d="M11 4.6 12.4 6 7.4 11H21v2H7.4l5 5L11 19.4 3.6 12Z"/>',
  chevron: '<path d="M9 4.6 16.4 12 9 19.4 7.6 18l6-6-6-6Z"/>',
  menu: '<path d="M3 5h18v2H3Zm0 6h18v2H3Zm0 6h18v2H3Z"/>',
  check: '<path d="M9.6 16.2 4.8 11.4 6.2 10l3.4 3.4L17.8 5.2 19.2 6.6Z"/>',
  user: '<circle cx="12" cy="7.5" r="4"/><path d="M4.5 20.5c0-3.8 3.4-6.5 7.5-6.5s7.5 2.7 7.5 6.5Z"/>',
  wallet:
    '<path d="M4 6.5A2.5 2.5 0 016.5 4H17v3H6.5A2.5 2.5 0 014 6.5Z"/><path d="M4 7.5c.7.6 1.6 1 2.5 1H20a1.5 1.5 0 011.5 1.5v8A1.5 1.5 0 0120 19.5H6A2 2 0 014 17.5Zm13 4.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3Z"/>',
  gear: '<path fill-rule="evenodd" d="M10.3 2h3.4l.5 2.4 1.7.9 2.3-.9 1.7 3-1.8 1.6v1.9l1.8 1.6-1.7 3-2.3-.9-1.7.9-.5 2.4h-3.4l-.5-2.4-1.7-.9-2.3.9-1.7-3 1.8-1.6V9l-1.8-1.6 1.7-3 2.3.9 1.7-.9ZM12 8.4a3.6 3.6 0 100 7.2 3.6 3.6 0 000-7.2Z"/>',
  clock:
    '<path fill-rule="evenodd" d="M12 2.5a9.5 9.5 0 100 19 9.5 9.5 0 000-19Zm-1 4h2v5.6l3.8 2.2-1 1.7L11 13.2Z"/>',
  share:
    '<circle cx="18" cy="5.5" r="2.8"/><circle cx="6" cy="12" r="2.8"/><circle cx="18" cy="18.5" r="2.8"/><path d="M8.2 10.6 15.8 6.6l1 1.7-7.6 4Zm0 2.8 7.6 4-1 1.7-7.6-4Z"/>',
  copy: '<path d="M9 3h9a2 2 0 012 2v9h-2V5H9Z"/><path d="M5 7h9a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2Z"/>',
  info: '<path fill-rule="evenodd" d="M12 2.5a9.5 9.5 0 100 19 9.5 9.5 0 000-19ZM11 10h2v7h-2Zm1-4.2a1.4 1.4 0 110 2.8 1.4 1.4 0 010-2.8Z"/>',
} as const;

export type IconName = keyof typeof HN_ICONS;

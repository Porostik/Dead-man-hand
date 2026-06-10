/* @ds-bundle: {"format":3,"namespace":"HighNoonQuickDrawDesignSystem_d935db","components":[{"name":"HN_ICONS","sourcePath":"components/brand/Icon.jsx"},{"name":"Icon","sourcePath":"components/brand/Icon.jsx"},{"name":"Wordmark","sourcePath":"components/brand/Wordmark.jsx"},{"name":"Button","sourcePath":"components/buttons/Button.jsx"},{"name":"IconButton","sourcePath":"components/buttons/IconButton.jsx"},{"name":"Badge","sourcePath":"components/feedback/Badge.jsx"},{"name":"Banner","sourcePath":"components/feedback/Banner.jsx"},{"name":"ProgressBar","sourcePath":"components/feedback/ProgressBar.jsx"},{"name":"Spinner","sourcePath":"components/feedback/Spinner.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Tooltip","sourcePath":"components/feedback/Tooltip.jsx"},{"name":"AmountField","sourcePath":"components/forms/AmountField.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"SegmentedControl","sourcePath":"components/forms/SegmentedControl.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"AmmoMeter","sourcePath":"components/game/AmmoMeter.jsx"},{"name":"Avatar","sourcePath":"components/game/Avatar.jsx"},{"name":"Chip","sourcePath":"components/game/Chip.jsx"},{"name":"Coin","sourcePath":"components/game/Coin.jsx"},{"name":"FuseTimer","sourcePath":"components/game/FuseTimer.jsx"},{"name":"PlayingCard","sourcePath":"components/game/PlayingCard.jsx"},{"name":"PotPile","sourcePath":"components/game/PotPile.jsx"},{"name":"BottomNav","sourcePath":"components/navigation/BottomNav.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"},{"name":"Card","sourcePath":"components/surfaces/Card.jsx"},{"name":"Drawer","sourcePath":"components/surfaces/Drawer.jsx"},{"name":"Modal","sourcePath":"components/surfaces/Modal.jsx"}],"sourceHashes":{"components/brand/Icon.jsx":"c0b5b9e271ae","components/brand/Wordmark.jsx":"ed1ab0a692fd","components/buttons/Button.jsx":"37b195e07e4f","components/buttons/IconButton.jsx":"027e1c69ec12","components/feedback/Badge.jsx":"30ca9d54bff0","components/feedback/Banner.jsx":"4ab19e3ca900","components/feedback/ProgressBar.jsx":"28167abc1ecc","components/feedback/Spinner.jsx":"32b39221c3d5","components/feedback/Toast.jsx":"6bc60fafa8a2","components/feedback/Tooltip.jsx":"a521e3077628","components/forms/AmountField.jsx":"25a696816828","components/forms/Checkbox.jsx":"6abfa5076810","components/forms/Input.jsx":"860dbf01de96","components/forms/SegmentedControl.jsx":"87cb0b91d974","components/forms/Switch.jsx":"4deb15efb450","components/game/AmmoMeter.jsx":"86b8d12a37d8","components/game/Avatar.jsx":"1f9d385e86f1","components/game/Chip.jsx":"84afb131bb7c","components/game/Coin.jsx":"f62795f6d1f9","components/game/FuseTimer.jsx":"477a7790c14a","components/game/PlayingCard.jsx":"478a970e5910","components/game/PotPile.jsx":"7a01e4f3b4f4","components/navigation/BottomNav.jsx":"efda1c668946","components/navigation/Tabs.jsx":"a8a4fa09da6e","components/surfaces/Card.jsx":"db5e3bab8f88","components/surfaces/Drawer.jsx":"dad5caea8df9","components/surfaces/Modal.jsx":"806808921a43"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {
  const __ds_ns = (window.HighNoonQuickDrawDesignSystem_d935db =
    window.HighNoonQuickDrawDesignSystem_d935db || {});

  const __ds_scope = {};

  __ds_ns.__errors = __ds_ns.__errors || [];

  // components/brand/Icon.jsx
  try {
    (() => {
      function _extends() {
        return (
          (_extends = Object.assign
            ? Object.assign.bind()
            : function (n) {
                for (var e = 1; e < arguments.length; e++) {
                  var t = arguments[e];
                  for (var r in t)
                    ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
                }
                return n;
              }),
          _extends.apply(null, arguments)
        );
      }
      /**
       * High Noon western icon set — solid-fill glyphs on a 24×24 grid, drawn with
       * `currentColor` so they tint to any token. Two families share one style:
       * brand paraphernalia (suits, sheriff star, coin, revolver, bullet, hat…)
       * and UI essentials (plus, close, back, chevron…). Raw inner-SVG per name.
       */
      const HN_ICONS = {
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
        check:
          '<path d="M9.6 16.2 4.8 11.4 6.2 10l3.4 3.4L17.8 5.2 19.2 6.6Z"/>',
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
      };

      /** Inline western icon. `name` keys into HN_ICONS; tints via CSS `color`. */
      function Icon({
        name,
        size = 20,
        title,
        className = '',
        style,
        ...rest
      }) {
        const inner = HN_ICONS[name] || HN_ICONS.star;
        return /*#__PURE__*/ React.createElement(
          'svg',
          _extends(
            {
              className: ['hn-icon', className].filter(Boolean).join(' '),
              width: size,
              height: size,
              viewBox: '0 0 24 24',
              fill: 'currentColor',
              role: title ? 'img' : 'presentation',
              'aria-label': title,
              'aria-hidden': title ? undefined : true,
              style: {
                display: 'inline-block',
                verticalAlign: 'middle',
                flex: '0 0 auto',
                ...style,
              },
              dangerouslySetInnerHTML: {
                __html: inner,
              },
            },
            rest,
          ),
        );
      }
      Object.assign(__ds_scope, { HN_ICONS, Icon });
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: 'components/brand/Icon.jsx',
      error: String((e && e.message) || e),
    });
  }

  // components/brand/Wordmark.jsx
  try {
    (() => {
      function _extends() {
        return (
          (_extends = Object.assign
            ? Object.assign.bind()
            : function (n) {
                for (var e = 1; e < arguments.length; e++) {
                  var t = arguments[e];
                  for (var r in t)
                    ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
                }
                return n;
              }),
          _extends.apply(null, arguments)
        );
      }
      /** The High Noon / Quick Draw lockup — Rye name over a CSS sun glow. */
      function Wordmark({
        kicker = 'HIGH NOON',
        name = 'Quick Draw',
        tagline = 'first to flinch loses',
        size = 'md',
        className = '',
        ...rest
      }) {
        const cls = [
          'hn-wordmark',
          size === 'sm' && 'hn-wordmark--sm',
          className,
        ]
          .filter(Boolean)
          .join(' ');
        return /*#__PURE__*/ React.createElement(
          'div',
          _extends(
            {
              className: cls,
            },
            rest,
          ),
          /*#__PURE__*/ React.createElement('span', {
            className: 'hn-wordmark__sun',
          }),
          kicker &&
            /*#__PURE__*/ React.createElement(
              'span',
              {
                className: 'hn-wordmark__kicker',
              },
              kicker,
            ),
          /*#__PURE__*/ React.createElement(
            'span',
            {
              className: 'hn-wordmark__name',
            },
            name,
          ),
          tagline &&
            /*#__PURE__*/ React.createElement(
              'span',
              {
                className: 'hn-wordmark__tag',
              },
              tagline,
            ),
        );
      }
      Object.assign(__ds_scope, { Wordmark });
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: 'components/brand/Wordmark.jsx',
      error: String((e && e.message) || e),
    });
  }

  // components/buttons/Button.jsx
  try {
    (() => {
      function _extends() {
        return (
          (_extends = Object.assign
            ? Object.assign.bind()
            : function (n) {
                for (var e = 1; e < arguments.length; e++) {
                  var t = arguments[e];
                  for (var r in t)
                    ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
                }
                return n;
              }),
          _extends.apply(null, arguments)
        );
      }
      /**
       * Primary action control for High Noon. Wraps a native <button> and applies
       * the hn-btn class set. Variants map to rust (primary), turquoise (secondary),
       * outline (ghost) and danger.
       */
      function Button({
        variant = 'primary',
        size = 'md',
        block = false,
        disabled = false,
        type = 'button',
        children,
        className = '',
        ...rest
      }) {
        const cls = [
          'hn-btn',
          variant !== 'primary' && `hn-btn--${variant}`,
          size !== 'md' && `hn-btn--${size}`,
          block && 'hn-btn--block',
          className,
        ]
          .filter(Boolean)
          .join(' ');
        return /*#__PURE__*/ React.createElement(
          'button',
          _extends(
            {
              type: type,
              className: cls,
              disabled: disabled,
            },
            rest,
          ),
          children,
        );
      }
      Object.assign(__ds_scope, { Button });
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: 'components/buttons/Button.jsx',
      error: String((e && e.message) || e),
    });
  }

  // components/buttons/IconButton.jsx
  try {
    (() => {
      function _extends() {
        return (
          (_extends = Object.assign
            ? Object.assign.bind()
            : function (n) {
                for (var e = 1; e < arguments.length; e++) {
                  var t = arguments[e];
                  for (var r in t)
                    ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
                }
                return n;
              }),
          _extends.apply(null, arguments)
        );
      }
      /**
       * Square icon-only button (44px hit target). Use for toolbar / header actions
       * like back, close, share, info. Pass an icon glyph or SVG as children.
       */
      function IconButton({
        variant = 'outline',
        label,
        children,
        className = '',
        ...rest
      }) {
        const cls = [
          'hn-iconbtn',
          variant === 'bare' && 'hn-iconbtn--bare',
          variant === 'solid' && 'hn-iconbtn--solid',
          className,
        ]
          .filter(Boolean)
          .join(' ');
        return /*#__PURE__*/ React.createElement(
          'button',
          _extends(
            {
              type: 'button',
              className: cls,
              'aria-label': label,
            },
            rest,
          ),
          children,
        );
      }
      Object.assign(__ds_scope, { IconButton });
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: 'components/buttons/IconButton.jsx',
      error: String((e && e.message) || e),
    });
  }

  // components/feedback/Badge.jsx
  try {
    (() => {
      function _extends() {
        return (
          (_extends = Object.assign
            ? Object.assign.bind()
            : function (n) {
                for (var e = 1; e < arguments.length; e++) {
                  var t = arguments[e];
                  for (var r in t)
                    ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
                }
                return n;
              }),
          _extends.apply(null, arguments)
        );
      }
      /** Small status label / count. */
      function Badge({ tone, dot = false, children, className = '', ...rest }) {
        const cls = ['hn-badge', tone && `hn-badge--${tone}`, className]
          .filter(Boolean)
          .join(' ');
        return /*#__PURE__*/ React.createElement(
          'span',
          _extends(
            {
              className: cls,
            },
            rest,
          ),
          dot &&
            /*#__PURE__*/ React.createElement('span', {
              className: 'hn-badge__dot',
            }),
          children,
        );
      }
      Object.assign(__ds_scope, { Badge });
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: 'components/feedback/Badge.jsx',
      error: String((e && e.message) || e),
    });
  }

  // components/feedback/Banner.jsx
  try {
    (() => {
      function _extends() {
        return (
          (_extends = Object.assign
            ? Object.assign.bind()
            : function (n) {
                for (var e = 1; e < arguments.length; e++) {
                  var t = arguments[e];
                  for (var r in t)
                    ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
                }
                return n;
              }),
          _extends.apply(null, arguments)
        );
      }
      const TONE_ICON = {
        info: 'info',
        warning: 'flame',
        danger: 'skull',
        positive: 'check',
      };

      /** Inline callout / notice strip with a leading western icon. */
      function Banner({
        tone = 'info',
        icon,
        title,
        children,
        className = '',
        ...rest
      }) {
        const cls = [
          'hn-banner',
          tone !== 'info' && `hn-banner--${tone}`,
          className,
        ]
          .filter(Boolean)
          .join(' ');
        return /*#__PURE__*/ React.createElement(
          'div',
          _extends(
            {
              className: cls,
            },
            rest,
          ),
          /*#__PURE__*/ React.createElement(
            'span',
            {
              className: 'hn-banner__icon',
            },
            /*#__PURE__*/ React.createElement(__ds_scope.Icon, {
              name: icon || TONE_ICON[tone] || 'info',
              size: 20,
            }),
          ),
          /*#__PURE__*/ React.createElement(
            'div',
            null,
            title &&
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  className: 'hn-banner__title',
                },
                title,
              ),
            children &&
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  className: 'hn-banner__msg',
                },
                children,
              ),
          ),
        );
      }
      Object.assign(__ds_scope, { Banner });
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: 'components/feedback/Banner.jsx',
      error: String((e && e.message) || e),
    });
  }

  // components/feedback/ProgressBar.jsx
  try {
    (() => {
      function _extends() {
        return (
          (_extends = Object.assign
            ? Object.assign.bind()
            : function (n) {
                for (var e = 1; e < arguments.length; e++) {
                  var t = arguments[e];
                  for (var r in t)
                    ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
                }
                return n;
              }),
          _extends.apply(null, arguments)
        );
      }
      /** Slim progress / stat bar (XP, ELO-to-next, loading). */
      function ProgressBar({ value = 0, tone, size, className = '', ...rest }) {
        const pct = Math.max(0, Math.min(100, value));
        const cls = [
          'hn-progress',
          tone && `hn-progress--${tone}`,
          size && `hn-progress--${size}`,
          className,
        ]
          .filter(Boolean)
          .join(' ');
        return /*#__PURE__*/ React.createElement(
          'div',
          _extends(
            {
              className: cls,
              role: 'progressbar',
              'aria-valuenow': pct,
              'aria-valuemin': 0,
              'aria-valuemax': 100,
            },
            rest,
          ),
          /*#__PURE__*/ React.createElement('div', {
            className: 'hn-progress__fill',
            style: {
              width: pct + '%',
            },
          }),
        );
      }
      Object.assign(__ds_scope, { ProgressBar });
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: 'components/feedback/ProgressBar.jsx',
      error: String((e && e.message) || e),
    });
  }

  // components/feedback/Spinner.jsx
  try {
    (() => {
      function _extends() {
        return (
          (_extends = Object.assign
            ? Object.assign.bind()
            : function (n) {
                for (var e = 1; e < arguments.length; e++) {
                  var t = arguments[e];
                  for (var r in t)
                    ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
                }
                return n;
              }),
          _extends.apply(null, arguments)
        );
      }
      /** Spinning loader ring. */
      function Spinner({ size, tone, className = '', ...rest }) {
        const cls = [
          'hn-spinner',
          size && `hn-spinner--${size}`,
          tone && `hn-spinner--${tone}`,
          className,
        ]
          .filter(Boolean)
          .join(' ');
        return /*#__PURE__*/ React.createElement(
          'span',
          _extends(
            {
              className: cls,
              role: 'status',
              'aria-label': '\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430',
            },
            rest,
          ),
        );
      }
      Object.assign(__ds_scope, { Spinner });
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: 'components/feedback/Spinner.jsx',
      error: String((e && e.message) || e),
    });
  }

  // components/feedback/Toast.jsx
  try {
    (() => {
      /** Transient notification banner. Render in a fixed corner; auto-dismiss in app. */
      function Toast({ tone, icon, children }) {
        const cls = ['hn-toast', tone && `hn-toast--${tone}`]
          .filter(Boolean)
          .join(' ');
        return /*#__PURE__*/ React.createElement(
          'div',
          {
            className: cls,
            role: 'status',
          },
          icon &&
            /*#__PURE__*/ React.createElement(
              'span',
              {
                className: 'hn-toast__icon',
              },
              icon,
            ),
          /*#__PURE__*/ React.createElement(
            'span',
            {
              className: 'hn-toast__msg',
            },
            children,
          ),
        );
      }
      Object.assign(__ds_scope, { Toast });
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: 'components/feedback/Toast.jsx',
      error: String((e && e.message) || e),
    });
  }

  // components/feedback/Tooltip.jsx
  try {
    (() => {
      function _extends() {
        return (
          (_extends = Object.assign
            ? Object.assign.bind()
            : function (n) {
                for (var e = 1; e < arguments.length; e++) {
                  var t = arguments[e];
                  for (var r in t)
                    ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
                }
                return n;
              }),
          _extends.apply(null, arguments)
        );
      }
      /** Lightweight hover/focus tooltip wrapping its child trigger. */
      function Tooltip({ label, children, className = '', ...rest }) {
        const [open, setOpen] = React.useState(false);
        return /*#__PURE__*/ React.createElement(
          'span',
          _extends(
            {
              className: ['hn-tooltip', className].filter(Boolean).join(' '),
              onMouseEnter: () => setOpen(true),
              onMouseLeave: () => setOpen(false),
              onFocus: () => setOpen(true),
              onBlur: () => setOpen(false),
            },
            rest,
          ),
          children,
          open &&
            /*#__PURE__*/ React.createElement(
              'span',
              {
                className: 'hn-tooltip__bubble',
                role: 'tooltip',
              },
              label,
            ),
        );
      }
      Object.assign(__ds_scope, { Tooltip });
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: 'components/feedback/Tooltip.jsx',
      error: String((e && e.message) || e),
    });
  }

  // components/forms/AmountField.jsx
  try {
    (() => {
      /**
       * Stepper for choosing a stake / amount in TON. Controlled: pass value + onChange.
       * Used in round setup, deposits and challenge creation.
       */
      function AmountField({
        value,
        onChange,
        step = 0.1,
        min = 0,
        max = Infinity,
        unit = 'TON',
      }) {
        const fmt = (n) => Number(n.toFixed(2)).toString();
        const dec = () => onChange(Math.max(min, +(value - step).toFixed(2)));
        const inc = () => onChange(Math.min(max, +(value + step).toFixed(2)));
        return /*#__PURE__*/ React.createElement(
          'div',
          {
            className: 'hn-amount',
          },
          /*#__PURE__*/ React.createElement(
            'span',
            {
              className: 'hn-amount__val',
            },
            /*#__PURE__*/ React.createElement('b', null, fmt(value)),
            ' ',
            unit,
          ),
          /*#__PURE__*/ React.createElement(
            'span',
            {
              className: 'hn-amount__step',
            },
            /*#__PURE__*/ React.createElement(
              'button',
              {
                type: 'button',
                className: 'hn-step-btn',
                onClick: dec,
                disabled: value <= min,
                'aria-label': '\u041C\u0435\u043D\u044C\u0448\u0435',
              },
              '\u2013',
            ),
            /*#__PURE__*/ React.createElement(
              'button',
              {
                type: 'button',
                className: 'hn-step-btn',
                onClick: inc,
                disabled: value >= max,
                'aria-label': '\u0411\u043E\u043B\u044C\u0448\u0435',
              },
              '+',
            ),
          ),
        );
      }
      Object.assign(__ds_scope, { AmountField });
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: 'components/forms/AmountField.jsx',
      error: String((e && e.message) || e),
    });
  }

  // components/forms/Checkbox.jsx
  try {
    (() => {
      /** Checkbox for consents / multi-select (onboarding terms, filters). Controlled. */
      function Checkbox({ checked = false, onChange, label }) {
        return /*#__PURE__*/ React.createElement(
          'div',
          {
            className: 'hn-check',
            role: 'checkbox',
            'aria-checked': checked,
            tabIndex: 0,
            onClick: () => onChange(!checked),
            onKeyDown: (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onChange(!checked);
              }
            },
          },
          /*#__PURE__*/ React.createElement('span', {
            className: 'hn-check__box',
          }),
          label &&
            /*#__PURE__*/ React.createElement(
              'span',
              {
                className: 'hn-switch__label',
              },
              label,
            ),
        );
      }
      Object.assign(__ds_scope, { Checkbox });
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: 'components/forms/Checkbox.jsx',
      error: String((e && e.message) || e),
    });
  }

  // components/forms/Input.jsx
  try {
    (() => {
      function _extends() {
        return (
          (_extends = Object.assign
            ? Object.assign.bind()
            : function (n) {
                for (var e = 1; e < arguments.length; e++) {
                  var t = arguments[e];
                  for (var r in t)
                    ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
                }
                return n;
              }),
          _extends.apply(null, arguments)
        );
      }
      /**
       * Text input with optional label, prefix/suffix affix and helper/error text.
       * Used across auth, onboarding, profile and payment forms.
       */
      function Input({
        label,
        prefix,
        suffix,
        help,
        error = false,
        id,
        className = '',
        ...rest
      }) {
        const inputId =
          id ||
          (label
            ? `in-${label.replace(/\s+/g, '-').toLowerCase()}`
            : undefined);
        return /*#__PURE__*/ React.createElement(
          'div',
          {
            className: ['hn-field', error && 'hn-field--error', className]
              .filter(Boolean)
              .join(' '),
          },
          label &&
            /*#__PURE__*/ React.createElement(
              'label',
              {
                className: 'hn-label',
                htmlFor: inputId,
              },
              label,
            ),
          /*#__PURE__*/ React.createElement(
            'div',
            {
              className: 'hn-input-wrap',
            },
            prefix &&
              /*#__PURE__*/ React.createElement(
                'span',
                {
                  className: 'hn-affix',
                },
                prefix,
              ),
            /*#__PURE__*/ React.createElement(
              'input',
              _extends(
                {
                  id: inputId,
                  className: 'hn-input',
                },
                rest,
              ),
            ),
            suffix &&
              /*#__PURE__*/ React.createElement(
                'span',
                {
                  className: 'hn-affix',
                },
                suffix,
              ),
          ),
          help &&
            /*#__PURE__*/ React.createElement(
              'span',
              {
                className: 'hn-help',
              },
              help,
            ),
        );
      }
      Object.assign(__ds_scope, { Input });
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: 'components/forms/Input.jsx',
      error: String((e && e.message) || e),
    });
  }

  // components/forms/SegmentedControl.jsx
  try {
    (() => {
      /**
       * Segmented control / radio group rendered as a pill. Use for 2–4 short options
       * such as stake rooms (Bronze/Silver/Gold) or game modes.
       */
      function SegmentedControl({ options, value, onChange, block = false }) {
        return /*#__PURE__*/ React.createElement(
          'div',
          {
            className: ['hn-seg', block && 'hn-seg--block']
              .filter(Boolean)
              .join(' '),
            role: 'tablist',
          },
          options.map((opt) => {
            const val = typeof opt === 'string' ? opt : opt.value;
            const label = typeof opt === 'string' ? opt : opt.label;
            return /*#__PURE__*/ React.createElement(
              'button',
              {
                key: val,
                type: 'button',
                role: 'tab',
                'aria-selected': val === value,
                className: 'hn-seg__opt',
                onClick: () => onChange(val),
              },
              label,
            );
          }),
        );
      }
      Object.assign(__ds_scope, { SegmentedControl });
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: 'components/forms/SegmentedControl.jsx',
      error: String((e && e.message) || e),
    });
  }

  // components/forms/Switch.jsx
  try {
    (() => {
      /** On/off toggle. Controlled via checked + onChange. */
      function Switch({ checked = false, onChange, label }) {
        return /*#__PURE__*/ React.createElement(
          'div',
          {
            className: 'hn-switch',
            role: 'switch',
            'aria-checked': checked,
            tabIndex: 0,
            onClick: () => onChange(!checked),
            onKeyDown: (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onChange(!checked);
              }
            },
          },
          /*#__PURE__*/ React.createElement(
            'span',
            {
              className: 'hn-switch__track',
            },
            /*#__PURE__*/ React.createElement('span', {
              className: 'hn-switch__thumb',
            }),
          ),
          label &&
            /*#__PURE__*/ React.createElement(
              'span',
              {
                className: 'hn-switch__label',
              },
              label,
            ),
        );
      }
      Object.assign(__ds_scope, { Switch });
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: 'components/forms/Switch.jsx',
      error: String((e && e.message) || e),
    });
  }

  // components/game/AmmoMeter.jsx
  try {
    (() => {
      function _extends() {
        return (
          (_extends = Object.assign
            ? Object.assign.bind()
            : function (n) {
                for (var e = 1; e < arguments.length; e++) {
                  var t = arguments[e];
                  for (var r in t)
                    ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
                }
                return n;
              }),
          _extends.apply(null, arguments)
        );
      }
      const BULLET =
        '<path d="M12 2.2c2.1 0 3.6 2.3 3.6 5.4V10H8.4V7.6C8.4 4.5 9.9 2.2 12 2.2Z"/><path d="M8.2 11h7.6v8.4a2 2 0 01-2 2h-3.6a2 2 0 01-2-2Z"/>';

      /**
       * Row of bullets tracking rounds in a Bo3 / best-of-N duel.
       * `won` bullets are loaded (gold), the current round can glow rust (`live`),
       * the rest are spent (faint).
       */
      function AmmoMeter({
        total = 3,
        won = 0,
        live = -1,
        size = 22,
        className = '',
        ...rest
      }) {
        return /*#__PURE__*/ React.createElement(
          'div',
          _extends(
            {
              className: ['hn-ammo', className].filter(Boolean).join(' '),
            },
            rest,
          ),
          Array.from({
            length: total,
          }).map((_, i) => {
            const state = i === live ? 'live' : i < won ? '' : 'spent';
            return /*#__PURE__*/ React.createElement('svg', {
              key: i,
              className: ['hn-ammo__slot', state && `hn-ammo__slot--${state}`]
                .filter(Boolean)
                .join(' '),
              width: size,
              height: size,
              viewBox: '0 0 24 24',
              fill: 'currentColor',
              dangerouslySetInnerHTML: {
                __html: BULLET,
              },
            });
          }),
        );
      }
      Object.assign(__ds_scope, { AmmoMeter });
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: 'components/game/AmmoMeter.jsx',
      error: String((e && e.message) || e),
    });
  }

  // components/game/Avatar.jsx
  try {
    (() => {
      /** Player avatar — initials or image, optional gold frame and active ring. */
      function Avatar({
        name = '',
        src,
        size = 'md',
        gold = false,
        active = false,
      }) {
        const initials = name
          .split(/\s+/)
          .map((w) => w[0])
          .slice(0, 2)
          .join('')
          .toUpperCase();
        const cls = [
          'hn-avatar',
          size !== 'md' && `hn-avatar--${size}`,
          gold && 'hn-avatar--gold',
          active && 'hn-avatar--active',
        ]
          .filter(Boolean)
          .join(' ');
        return /*#__PURE__*/ React.createElement(
          'span',
          {
            className: cls,
            'aria-label': name,
          },
          src
            ? /*#__PURE__*/ React.createElement('img', {
                src: src,
                alt: name,
              })
            : initials || '?',
          /*#__PURE__*/ React.createElement('span', {
            className: 'hn-avatar__ring',
          }),
        );
      }
      Object.assign(__ds_scope, { Avatar });
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: 'components/game/Avatar.jsx',
      error: String((e && e.message) || e),
    });
  }

  // components/game/Chip.jsx
  try {
    (() => {
      /** Betting chip. */
      function Chip({ value, tone, size = 'md' }) {
        const cls = [
          'hn-chip',
          tone && `hn-chip--${tone}`,
          size === 'sm' && 'hn-chip--sm',
        ]
          .filter(Boolean)
          .join(' ');
        return /*#__PURE__*/ React.createElement(
          'span',
          {
            className: cls,
          },
          value,
        );
      }
      Object.assign(__ds_scope, { Chip });
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: 'components/game/Chip.jsx',
      error: String((e && e.message) || e),
    });
  }

  // components/game/Coin.jsx
  try {
    (() => {
      function _extends() {
        return (
          (_extends = Object.assign
            ? Object.assign.bind()
            : function (n) {
                for (var e = 1; e < arguments.length; e++) {
                  var t = arguments[e];
                  for (var r in t)
                    ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
                }
                return n;
              }),
          _extends.apply(null, arguments)
        );
      }
      const TON_MARK = '<path d="M12 4 19 12 12 20 5 12Z"/>';

      /** Stylised TON token / coin. Gold by default; silver & rust tiers. */
      function Coin({
        tone,
        size = 'md',
        mark = true,
        count,
        className = '',
        style,
        ...rest
      }) {
        const cls = [
          'hn-coin',
          tone && `hn-coin--${tone}`,
          size !== 'md' && `hn-coin--${size}`,
          className,
        ]
          .filter(Boolean)
          .join(' ');
        return /*#__PURE__*/ React.createElement(
          'span',
          _extends(
            {
              className: cls,
              style: style,
            },
            rest,
          ),
          mark &&
            /*#__PURE__*/ React.createElement('svg', {
              className: 'hn-coin__mark',
              viewBox: '0 0 24 24',
              fill: 'currentColor',
              dangerouslySetInnerHTML: {
                __html: TON_MARK,
              },
            }),
          count != null &&
            /*#__PURE__*/ React.createElement(
              'span',
              {
                className: 'hn-coin__count',
              },
              count,
            ),
        );
      }
      Object.assign(__ds_scope, { Coin });
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: 'components/game/Coin.jsx',
      error: String((e && e.message) || e),
    });
  }

  // components/game/FuseTimer.jsx
  try {
    (() => {
      /**
       * Burning-fuse turn timer. Set `running` to start the burn; `seconds` controls
       * duration. Pass onEnd to resolve the turn (auto-check / auto-fold).
       */
      function FuseTimer({ seconds = 10, running = false, onEnd }) {
        const ref = React.useRef(null);
        React.useEffect(() => {
          if (!running || !onEnd) return undefined;
          const t = setTimeout(onEnd, seconds * 1000);
          return () => clearTimeout(t);
        }, [running, seconds, onEnd]);
        return /*#__PURE__*/ React.createElement(
          'div',
          {
            ref: ref,
            className: ['hn-fuse', running && 'hn-fuse--run']
              .filter(Boolean)
              .join(' '),
            style: {
              '--fuse-dur': `${seconds}s`,
            },
          },
          /*#__PURE__*/ React.createElement('div', {
            className: 'hn-fuse__fill',
          }),
          /*#__PURE__*/ React.createElement('span', {
            className: 'hn-fuse__spark',
          }),
        );
      }
      Object.assign(__ds_scope, { FuseTimer });
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: 'components/game/FuseTimer.jsx',
      error: String((e && e.message) || e),
    });
  }

  // components/game/PlayingCard.jsx
  try {
    (() => {
      function _extends() {
        return (
          (_extends = Object.assign
            ? Object.assign.bind()
            : function (n) {
                for (var e = 1; e < arguments.length; e++) {
                  var t = arguments[e];
                  for (var r in t)
                    ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
                }
                return n;
              }),
          _extends.apply(null, arguments)
        );
      }
      const SUIT = {
        spade:
          '<path d="M12 2C12 2 4 8.5 4 13.6c0 2.7 2 4.4 4.4 4.1c.7-.1 1.3-.4 1.8-.8c-.2 1.7-.9 3.2-2.2 4.6h8c-1.3-1.4-2-2.9-2.2-4.6c.5.4 1.1.7 1.8.8c2.4.3 4.4-1.4 4.4-4.1C20 8.5 12 2 12 2Z"/>',
        heart:
          '<path d="M12 21C12 21 3 14.6 3 8.7C3 5.7 5.2 4 7.6 4C9.6 4 11.1 5.4 12 7C12.9 5.4 14.4 4 16.4 4C18.8 4 21 5.7 21 8.7C21 14.6 12 21 12 21Z"/>',
        club: '<circle cx="12" cy="7.2" r="3.7"/><circle cx="7.2" cy="13.4" r="3.7"/><circle cx="16.8" cy="13.4" r="3.7"/><path d="M10.6 12.5h2.8l1.4 8.5h-5.6z"/>',
        diamond: '<path d="M12 2.2 20 12 12 21.8 4 12Z"/>',
      };
      const COURT_ICON = {
        J: '<path d="M7 13c-.4-3 .1-7 1.6-8.5c1.2-1.2 5.6-1.2 6.8 0C16.9 6 17.4 10 17 13Z"/><path d="M2.5 14.2c2.4 1.6 5.8 2.3 9.5 2.3s7.1-.7 9.5-2.3c.5 1.6-.2 2.8-2 3.5c-2 .8-4.7 1.2-7.5 1.2s-5.5-.4-7.5-1.2c-1.8-.7-2.5-1.9-2-3.5Z"/>',
        Q: '<path d="M6 21c-1.4-1.6-2.4-4-2.4-7C3.6 8.5 7.4 4 12 4s8.4 4.5 8.4 10c0 3-1 5.4-2.4 7l-2.6-1.4c1-1.2 1.7-3.1 1.7-5.6c0-3.6-2.3-6.4-5.1-6.4S6.8 10.4 6.8 14c0 2.5.7 4.4 1.7 5.6Z"/><circle cx="6.4" cy="20" r="1.1"/><circle cx="17.6" cy="20" r="1.1"/>',
        K: '<path d="M12 3 14.3 8.85 20.6 9.2 15.7 13.2 17.3 19.3 12 15.9 6.7 19.3 8.3 13.2 3.4 9.2 9.7 8.85Z"/><circle cx="12" cy="3" r="1.5"/><circle cx="20.6" cy="9.2" r="1.5"/><circle cx="17.3" cy="19.3" r="1.5"/><circle cx="6.7" cy="19.3" r="1.5"/><circle cx="3.4" cy="9.2" r="1.5"/>',
      };
      const RED = {
        heart: true,
        diamond: true,
      };
      function Glyph({ path, className }) {
        return /*#__PURE__*/ React.createElement('svg', {
          className: className,
          viewBox: '0 0 24 24',
          fill: 'currentColor',
          dangerouslySetInnerHTML: {
            __html: path,
          },
        });
      }

      /**
       * A High Noon playing card — parchment face, gold edge, bold central read.
       * Number cards show rank + suit; courts (J/Q/K) get a western cartouche
       * (hat / horseshoe / sheriff star); aces a sun-glow emblem.
       */
      function PlayingCard({
        rank = 'A',
        suit = 'spade',
        faceDown = false,
        win = false,
        size = 'md',
        className = '',
        ...rest
      }) {
        const cls = [
          'hn-pcard',
          RED[suit] && 'hn-pcard--red',
          size !== 'md' && `hn-pcard--${size}`,
          faceDown && 'hn-pcard--back',
          win && 'hn-pcard--win',
          className,
        ]
          .filter(Boolean)
          .join(' ');
        if (faceDown)
          return /*#__PURE__*/ React.createElement(
            'div',
            _extends(
              {
                className: cls,
              },
              rest,
            ),
          );
        const sp = SUIT[suit] || SUIT.spade;
        const ix = (pos) =>
          /*#__PURE__*/ React.createElement(
            'span',
            {
              className: `hn-pcard__ix hn-pcard__ix--${pos}`,
            },
            /*#__PURE__*/ React.createElement(
              'span',
              {
                className: 'rk',
              },
              rank,
            ),
            /*#__PURE__*/ React.createElement(Glyph, {
              path: sp,
            }),
          );
        let center;
        if (rank === 'A') {
          center = /*#__PURE__*/ React.createElement(
            React.Fragment,
            null,
            /*#__PURE__*/ React.createElement('span', {
              className: 'hn-pcard__glow',
            }),
            /*#__PURE__*/ React.createElement(
              'div',
              {
                className: 'hn-pcard__face',
              },
              /*#__PURE__*/ React.createElement(Glyph, {
                path: sp,
                className: 'hn-pcard__ace',
              }),
            ),
          );
        } else if (COURT_ICON[rank]) {
          center = /*#__PURE__*/ React.createElement(
            'div',
            {
              className: 'hn-pcard__court',
            },
            /*#__PURE__*/ React.createElement(
              'span',
              {
                className: 'hn-pcard__court-pip t',
              },
              /*#__PURE__*/ React.createElement(Glyph, {
                path: sp,
              }),
            ),
            /*#__PURE__*/ React.createElement(Glyph, {
              path: COURT_ICON[rank],
              className: 'hn-pcard__court-ic',
            }),
            /*#__PURE__*/ React.createElement(
              'span',
              {
                className: 'hn-pcard__court-l',
              },
              rank,
            ),
            /*#__PURE__*/ React.createElement(
              'span',
              {
                className: 'hn-pcard__court-pip b',
              },
              /*#__PURE__*/ React.createElement(Glyph, {
                path: sp,
              }),
            ),
          );
        } else {
          center = /*#__PURE__*/ React.createElement(
            React.Fragment,
            null,
            /*#__PURE__*/ React.createElement('span', {
              className: 'hn-pcard__halo',
            }),
            /*#__PURE__*/ React.createElement(
              'div',
              {
                className: 'hn-pcard__face',
              },
              /*#__PURE__*/ React.createElement(
                'span',
                {
                  className:
                    'hn-pcard__num' + (String(rank).length > 1 ? ' two' : ''),
                },
                rank,
              ),
              /*#__PURE__*/ React.createElement(Glyph, {
                path: sp,
                className: 'hn-pcard__s',
              }),
            ),
          );
        }
        return /*#__PURE__*/ React.createElement(
          'div',
          _extends(
            {
              className: cls,
            },
            rest,
          ),
          ix('tl'),
          center,
          ix('br'),
        );
      }
      Object.assign(__ds_scope, { PlayingCard });
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: 'components/game/PlayingCard.jsx',
      error: String((e && e.message) || e),
    });
  }

  // components/game/PotPile.jsx
  try {
    (() => {
      function _extends() {
        return (
          (_extends = Object.assign
            ? Object.assign.bind()
            : function (n) {
                for (var e = 1; e < arguments.length; e++) {
                  var t = arguments[e];
                  for (var r in t)
                    ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
                }
                return n;
              }),
          _extends.apply(null, arguments)
        );
      }
      /** A stacked pile of coins with a pot tag — the staked bank of a duel. */
      function PotPile({
        amount,
        count = 4,
        tone = 'gold',
        unit = 'TON',
        label = 'POT',
        className = '',
        ...rest
      }) {
        const n = Math.max(1, Math.min(count, 7));
        const step = 7;
        const coinTone = tone === 'gold' ? undefined : tone;
        return /*#__PURE__*/ React.createElement(
          'div',
          _extends(
            {
              className: ['hn-pot', className].filter(Boolean).join(' '),
            },
            rest,
          ),
          /*#__PURE__*/ React.createElement(
            'div',
            {
              className: 'hn-pot__stack',
              style: {
                width: 52,
                height: 46 + (n - 1) * step,
              },
            },
            /*#__PURE__*/ React.createElement('div', {
              className: 'hn-pot__glow',
            }),
            Array.from({
              length: n,
            }).map((_, i) =>
              /*#__PURE__*/ React.createElement(__ds_scope.Coin, {
                key: i,
                tone: coinTone,
                mark: i === n - 1,
                style: {
                  bottom: i * step,
                  zIndex: i,
                },
              }),
            ),
          ),
          amount != null &&
            /*#__PURE__*/ React.createElement(
              'span',
              {
                className: 'hn-pottag',
              },
              '\u2605 ',
              label,
              ' ',
              amount,
              ' ',
              unit,
            ),
        );
      }
      Object.assign(__ds_scope, { PotPile });
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: 'components/game/PotPile.jsx',
      error: String((e && e.message) || e),
    });
  }

  // components/navigation/BottomNav.jsx
  try {
    (() => {
      /** App bottom navigation bar. Items: {value, label, icon}. */
      function BottomNav({ items, value, onChange }) {
        return /*#__PURE__*/ React.createElement(
          'nav',
          {
            className: 'hn-bottomnav',
          },
          items.map((it) =>
            /*#__PURE__*/ React.createElement(
              'button',
              {
                key: it.value,
                type: 'button',
                'aria-selected': it.value === value,
                className: 'hn-navitem',
                onClick: () => onChange(it.value),
              },
              /*#__PURE__*/ React.createElement(
                'span',
                {
                  className: 'hn-navitem__icon',
                },
                it.icon,
              ),
              it.label,
            ),
          ),
        );
      }
      Object.assign(__ds_scope, { BottomNav });
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: 'components/navigation/BottomNav.jsx',
      error: String((e && e.message) || e),
    });
  }

  // components/navigation/Tabs.jsx
  try {
    (() => {
      /** Underline tabs for in-screen sections (leaderboard ranges, profile sections). */
      function Tabs({ tabs, value, onChange }) {
        return /*#__PURE__*/ React.createElement(
          'div',
          {
            className: 'hn-tabs',
            role: 'tablist',
          },
          tabs.map((t) => {
            const val = typeof t === 'string' ? t : t.value;
            const label = typeof t === 'string' ? t : t.label;
            return /*#__PURE__*/ React.createElement(
              'button',
              {
                key: val,
                type: 'button',
                role: 'tab',
                'aria-selected': val === value,
                className: 'hn-tab',
                onClick: () => onChange(val),
              },
              label,
            );
          }),
        );
      }
      Object.assign(__ds_scope, { Tabs });
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: 'components/navigation/Tabs.jsx',
      error: String((e && e.message) || e),
    });
  }

  // components/surfaces/Card.jsx
  try {
    (() => {
      function _extends() {
        return (
          (_extends = Object.assign
            ? Object.assign.bind()
            : function (n) {
                for (var e = 1; e < arguments.length; e++) {
                  var t = arguments[e];
                  for (var r in t)
                    ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
                }
                return n;
              }),
          _extends.apply(null, arguments)
        );
      }
      /** Surface container for grouped content. */
      function Card({ variant, title, children, className = '', ...rest }) {
        const cls = [
          'hn-card',
          variant === 'raised' && 'hn-card--raised',
          variant === 'flush' && 'hn-card--flush',
          variant === 'gold' && 'hn-card--gold',
          className,
        ]
          .filter(Boolean)
          .join(' ');
        return /*#__PURE__*/ React.createElement(
          'div',
          _extends(
            {
              className: cls,
            },
            rest,
          ),
          title &&
            /*#__PURE__*/ React.createElement(
              'h3',
              {
                className: 'hn-card__title',
              },
              title,
            ),
          children,
        );
      }
      Object.assign(__ds_scope, { Card });
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: 'components/surfaces/Card.jsx',
      error: String((e && e.message) || e),
    });
  }

  // components/surfaces/Drawer.jsx
  try {
    (() => {
      /**
       * Bottom sheet / drawer that rises from the bottom edge. Use for stake setup,
       * deposit/withdraw, taunt picker, share. Render only when open.
       */
      function Drawer({ open, onClose, title, children }) {
        if (!open) return null;
        return /*#__PURE__*/ React.createElement(
          React.Fragment,
          null,
          /*#__PURE__*/ React.createElement('div', {
            className: 'hn-drawer__scrim',
            onClick: onClose,
          }),
          /*#__PURE__*/ React.createElement(
            'div',
            {
              className: 'hn-drawer',
              role: 'dialog',
              'aria-modal': 'true',
            },
            /*#__PURE__*/ React.createElement('div', {
              className: 'hn-drawer__handle',
            }),
            title &&
              /*#__PURE__*/ React.createElement(
                'h2',
                {
                  className: 'hn-drawer__title',
                },
                title,
              ),
            children,
          ),
        );
      }
      Object.assign(__ds_scope, { Drawer });
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: 'components/surfaces/Drawer.jsx',
      error: String((e && e.message) || e),
    });
  }

  // components/surfaces/Modal.jsx
  try {
    (() => {
      /**
       * Centered modal dialog with scrim. Render only when open; pass onClose for the
       * backdrop tap. Actions are buttons you supply.
       */
      function Modal({ open, onClose, title, children, actions }) {
        if (!open) return null;
        return /*#__PURE__*/ React.createElement(
          'div',
          {
            className: 'hn-overlay',
            onClick: onClose,
          },
          /*#__PURE__*/ React.createElement(
            'div',
            {
              className: 'hn-modal',
              role: 'dialog',
              'aria-modal': 'true',
              onClick: (e) => e.stopPropagation(),
            },
            title &&
              /*#__PURE__*/ React.createElement(
                'h2',
                {
                  className: 'hn-modal__title',
                },
                title,
              ),
            /*#__PURE__*/ React.createElement(
              'div',
              {
                className: 'hn-modal__body',
              },
              children,
            ),
            actions &&
              /*#__PURE__*/ React.createElement(
                'div',
                {
                  className: 'hn-modal__actions',
                },
                actions,
              ),
          ),
        );
      }
      Object.assign(__ds_scope, { Modal });
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: 'components/surfaces/Modal.jsx',
      error: String((e && e.message) || e),
    });
  }

  __ds_ns.HN_ICONS = __ds_scope.HN_ICONS;

  __ds_ns.Icon = __ds_scope.Icon;

  __ds_ns.Wordmark = __ds_scope.Wordmark;

  __ds_ns.Button = __ds_scope.Button;

  __ds_ns.IconButton = __ds_scope.IconButton;

  __ds_ns.Badge = __ds_scope.Badge;

  __ds_ns.Banner = __ds_scope.Banner;

  __ds_ns.ProgressBar = __ds_scope.ProgressBar;

  __ds_ns.Spinner = __ds_scope.Spinner;

  __ds_ns.Toast = __ds_scope.Toast;

  __ds_ns.Tooltip = __ds_scope.Tooltip;

  __ds_ns.AmountField = __ds_scope.AmountField;

  __ds_ns.Checkbox = __ds_scope.Checkbox;

  __ds_ns.Input = __ds_scope.Input;

  __ds_ns.SegmentedControl = __ds_scope.SegmentedControl;

  __ds_ns.Switch = __ds_scope.Switch;

  __ds_ns.AmmoMeter = __ds_scope.AmmoMeter;

  __ds_ns.Avatar = __ds_scope.Avatar;

  __ds_ns.Chip = __ds_scope.Chip;

  __ds_ns.Coin = __ds_scope.Coin;

  __ds_ns.FuseTimer = __ds_scope.FuseTimer;

  __ds_ns.PlayingCard = __ds_scope.PlayingCard;

  __ds_ns.PotPile = __ds_scope.PotPile;

  __ds_ns.BottomNav = __ds_scope.BottomNav;

  __ds_ns.Tabs = __ds_scope.Tabs;

  __ds_ns.Card = __ds_scope.Card;

  __ds_ns.Drawer = __ds_scope.Drawer;

  __ds_ns.Modal = __ds_scope.Modal;
})();

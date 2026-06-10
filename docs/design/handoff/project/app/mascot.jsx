/* Dead Men — mascot: a face-down DECK (stack) at the top; cards fly out of it
   onto the board when dealt. Alternatives: drop-in art slot, or none. */
(function () {
  const e = React.createElement;

  const STACK = [0, 1, 2, 3, 4, 5];

  function Deck({ dealing, busted }) {
    return e(
      'div',
      {
        className:
          'dm-mdeck' +
          (dealing ? ' is-dealing' : '') +
          (busted ? ' is-busted' : ''),
      },
      e('div', { className: 'dm-mdeck__glow' }),
      STACK.map((i) =>
        e('div', {
          key: i,
          className: 'dm-mdeck__card hn-pcard hn-pcard--back',
          style: { '--i': i },
        }),
      ),
    );
  }

  function ArtSlot() {
    return e(
      'div',
      { className: 'dm-artwrap' },
      e('image-slot', {
        id: 'dm-mascot-art',
        className: 'dm-artslot',
        shape: 'rounded',
        radius: '20',
        fit: 'cover',
        placeholder: 'перетащи арт «Dead Men»',
      }),
    );
  }

  function Mascot({ treatment = 'hand', dealing = false, busted = false }) {
    if (treatment === 'art')
      return e(
        'div',
        { className: 'dm-emblem dm-emblem--art' },
        e(ArtSlot, null),
      );
    if (treatment === 'none')
      return e('div', { className: 'dm-emblem dm-emblem--none' });
    return e('div', { className: 'dm-emblem' }, e(Deck, { dealing, busted }));
  }

  window.DM.Mascot = Mascot;
})();

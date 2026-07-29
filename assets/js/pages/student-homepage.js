/**
 * Student Homepage -- the tile wall you land on after signing in.
 *
 * Only the Registration tile leads anywhere; the rest are inert, drawn so the
 * page you are about to be walked through is recognisable when you meet the
 * real thing.
 */
(function (ERP) {
  'use strict';

  var esc = ERP.esc;

  ERP.renderChrome({ pageName: 'Student Homepage' });

  // Tile artwork is the portal's own, copied out of a saved homepage into
  // assets/img, so the grid reads the way it does on the real thing.
  var TILES = [
    { title: 'Important Notices',        img: 'tile-announce.svg' },
    { title: 'Application Forms',        img: 'tile-application.svg' },
    { title: 'Academic Progress',        progress: true },
    { title: 'Profile',                  img: 'tile-personal.svg' },
    { title: 'Student Documents',        img: 'tile-doc.svg' },
    { title: 'My Academics',             img: 'tile-graduation.svg' },
    { title: 'Registration',             img: 'tile-registration.svg',
      href: 'academic-requirements.html' },
    { title: 'My Finance',               img: 'tile-accounting.svg' },
    { title: 'Acknowledgements',         img: 'tile-approval.svg' },
    { title: 'Demographic Details',      img: 'tile-personal.svg' },
    { title: 'Student Center',           img: 'tile-studentcenter.svg' },
    { title: 'Practice School',          img: 'tile-default.svg' },
    { title: 'Convocation',              img: 'tile-graduation.svg' },
    { title: 'Student Pre Registration', img: 'tile-registration1.svg' }
  ];

  function tileBodyHtml(tile) {
    if (tile.progress) {
      return '<div class="progress-row">' +
          '<div class="progress-note">Incomplete <b>1</b></div>' +
          '<div class="progress-donut"></div>' +
        '</div>' +
        '<div class="progress-pct"><b>0%</b> Complete</div>';
    }

    return '<div class="tile-icon-wrap">' +
      '<img src="assets/img/' + tile.img + '" alt=""></div>';
  }

  var tilesHtml = TILES.map(function (tile) {
    // Inert tiles keep the anchor -- they should look and focus like the live
    // one -- but a data-action swallows the click instead of jumping to top.
    var attrs = tile.href
      ? ' href="' + tile.href + '"'
      : ' href="#" data-action="inactive-tile" aria-disabled="true"';

    return '<a class="tile"' + attrs + '>' +
      '<div class="tile-title">' + esc(tile.title) + '</div>' +
      tileBodyHtml(tile) +
    '</a>';
  }).join('');

  // The homepage is the one page on the grey Fluid backdrop rather than the
  // white classic content area, and the only one that closes with the footer
  // band -- both hang off this class.
  document.body.classList.add('homepage');

  ERP.mount('<div class="tiles">' + tilesHtml + '</div>' +
    '<div class="lpfooter"></div>');

  ERP.onAction({
    'inactive-tile': function () { /* not part of the walkthrough */ }
  });
})(window.ERP);

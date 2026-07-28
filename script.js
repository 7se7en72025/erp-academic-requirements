function setCollapsed(head, collapsed) {
  var body = document.getElementById(head.dataset.toggle);
  if (!body) return;
  head.classList.toggle('collapsed', collapsed);
  body.classList.toggle('hidden', collapsed);
}

var heads = document.querySelectorAll('.group-head[data-toggle]');

heads.forEach(function (head) {
  head.addEventListener('click', function () {
    setCollapsed(head, !head.classList.contains('collapsed'));
  });
});

document.getElementById('collapseAll').addEventListener('click', function () {
  heads.forEach(function (h) { setCollapsed(h, true); });
});

document.getElementById('expandAll').addEventListener('click', function () {
  heads.forEach(function (h) { setCollapsed(h, false); });
});

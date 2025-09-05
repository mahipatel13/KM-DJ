// Import header and footer into pages
function importComponent(id, file) {
  fetch(file)
    .then(res => res.text())
    .then(html => {
      document.getElementById(id).innerHTML = html;
    });
}
// Example usage in HTML:
// <div id="header"></div>
// <script>importComponent('header', 'components/header.html');</script>

$(function() {
  $('.date').text(new Date().getFullYear());

  $('.upload').click( function(e) {
    e.preventDefault();
    processFile($);
    return false;
  });

  $('.get-all').click( function(e) {
    e.preventDefault();
    $.get('/albums').done(res => buildTable(res))
    return false;
  })

  $('#find-by-name').on('submit', function(e) {
    e.preventDefault();
    $.get(`/albums/${$('.input-name').val()}`).done(res => buildTable(res));
    return false;
  });

  function buildTable(res) {
    if (!res.length) return;
    //! we're supposing that all dox have will have the same tags and attributes
    const keys = Object.keys(res[0]);
    const headers = keys.map(h => `<th>${h}</th>`);
    const rows = res.map(
      doc => `<tr>${keys.map(k => `<td>${doc[k]}</td>`)}</tr>`
    );
    $(".table-div").html(`<table class="table table-hover">
      <thead>
        <tr>
        ${headers}
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>`);
  }
});

function sendXML(xml, name, jquery) {
  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", "/");
  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      const res = xhttp.response;
      alert(`${res}: ${name}`);
    }
  };
  xhttp.setRequestHeader("Content-Type", "text/xml");
  xhttp.send(xml);
  jquery('#xml-upload').val('');
}

function processFile(jquery) {
  const file = document.getElementById("xml-upload").files;
  if (!file.length) return;
  const name = file[0].name;
  const reader = new FileReader();
  let xml;
  reader.readAsText(file[0]);
  reader.onload = function(e) {
    xml = e.target.result;
    const beginXML = xml.search("<albums");
    xml = xml.substring(beginXML, xml.length);
    sendXML(xml, name, jquery);
  };
}

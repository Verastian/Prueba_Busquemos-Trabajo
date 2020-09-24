// PRUEBA FINAL ->
const gitJobsUrl = 'https://corsanywhere.herokuapp.com/https://jobs.github.com/positions.json?';
const showAnswer = document.querySelector('#showAnswer');
var type;

/* Mostrar Mensaje */
function showMessage(message) {
  $("#alert").addClass("ui message");
  $("#alert").text(`${message}`);
}
/* validar Dropdown */
function checkSelect(idSelect) {
  let $val = $(idSelect).val();
  if ($val != '0') {
    return true
  } else {
    return false;
  }
}
/* Validar Input */
function checkInput(idInput) {
  return $(idInput).val() ? true : false;
}
/* Validar Form*/
function checkForm() {
  console.log(checkInput("#search"));
  console.log(checkSelect("#formType"));
  if (checkInput("#search") && checkSelect("#formType")) {
    return true;
  } else {
    return false;
  }
}

/* Seleccionar modo de Búsqueda */
function typeOfSearch() {

  let $select = $(this).val();
  checkSelect($select);

  if ($select === 'description') {
    $('input[type="text"]').val('');
    $('#inputs input:first-child').attr('placeholder', 'Ej: Javascript, Frontend...');
    type = `search=`;
    return type;
  } else if ($select === 'location') {
    $('input[type="text"]').val('');
    $('#inputs input:first-child').attr('placeholder', 'Ej: New York, Remote...');
    type = `location=`;
    return type;
  } else {
    $('#inputs input:first-child').attr('placeholder', '');
  }

}

$(document).ready(function () {
  checkForm("#jobsForm");
  $('#formType').change(typeOfSearch);//ojo conexión con fx externa

  $('#jobsForm').on('submit', function (e) {
    e.preventDefault();

    var $search = $('#search').val();
    var $type = `${type}`;
    var url = `${gitJobsUrl}${$type}${$search}`;

    if (checkForm()) {
      axios.get(url, {
        responseType: 'json'
      })
        .then(function (res) {
          if (res.status == 200) {
            showVacancies(res);
            $("#alert").removeClass("ui info message");
            $("#alert").text('');
          }
          if(res.data.length <= 0){
            $("#alert").addClass("info");
            showMessage(`Intenta con otra busqueda`);
          }
        })
        .catch(function (err) {
          $("#alert").removeClass("info");
          $("#alert").addClass("negative");
          showMessage(`${err}`);
        });
    } else {
      showMessage('Debes llenar todos los campos para realizar tu busqueda')
      showAnswer.innerHTML = '';
    }
  });
});

function showVacancies(showData) {
  while (showAnswer.firstChild) {
    showAnswer.removeChild(showAnswer.firstChild);
  }
  let resData = showData.data;

  showAnswer.classList.add('row');
  resData.forEach(data => {
    const { company, title, type, url } = data;
    showAnswer.innerHTML += `

        <div class="column">
        <div class="ui card">
        <div class="content">
          <div class="header">${title}</div>
        </div>
        <div class="content">
          <h4 class="ui sub header">Company</h4>
          <div class="ui small feed">
            <div class="event">
              <div class="content">
                <div class="summary">
                <h3>${company}</h3>
                </div>
              </div>
            </div>
            <div class="event">
              <div class="content">
                <div class="summary">
                ${type}
                </div>
              </div>
            </div>
        </div>
        <div class="extra content">
          <button class="ui button"><a href="${url}">Ver Vacante</a></button>
        </div>
      </div>
        </div>

    `;
  });

}

var {
  app,
  shell,
  BrowserWindow,
  ipcRenderer
} = require('electron');
const {
  v4: uuidv4
} = require('uuid');
const dateTime = require('node-datetime');
var https = require('https');
var fs = require('fs');
var path = require('path');
var autoComplete = require("@tarekraafat/autocomplete.js/dist/js/autoComplete");

// COG
var effect_tt = true;
var effect_box = true;
var userInf = true;
var jsoncog = require(path.join(__dirname, 'package.json'));

// ENLACES
var ads = true;
var windowsopen = '_blank';

// RUTAS ALL
var file_data_ruta = path.join(__dirname, 'aplication', 'db-json', 'data.json');
var file_generos_ruta = path.join(__dirname, 'aplication', 'db-json', 'generos.json');
var file_temp_json = path.join(__dirname, 'aplication', 'temp', 'tempJson.json');

// SAMPLES
var sample = '::h1;Descripcion::/h1;\n-Text-\n\n::h1;Requisitos::/h1;\n::h4;Minimos:::/h4;\n-Text-\n\n::h4;Recomendados:::/h4;\n-Text-\n\n::h1;Zona de Descarga::/h1;\n::h6;hola, soy @lokuedo5000 y como no cuento con entradas de ingresos le puse a los enlaces publicidad pasiva, que significa pasiva pues es fácil, al momento de abrir un enlace se le abre dos pestañas del navegador una es publicidad y la otra es un enlace de AdFly solo espera 5 segundo y listo, no tienes que presionar ningún botón que diga permitir::/h6;\n\n::h4;Enlaces::/h4;\n::h5;Parte 1::/h5;::a;-link-::/a;\n\n::h4;Requerimientos::/h4;\n::h6;Contraseña: Pass::/h6;';

// INFO DEFAULT USER
var app_user_name = 'lokuedo5000';
var app_user_img = 'https://i.imgur.com/nJi56nZ.jpg';
var app_user_origen = 'AppWebCat';

// CREAR FILES
fs.readFile(file_temp_json, 'utf-8', (err, data) => {
  if (err) {
    fs.writeFileSync(file_temp_json, '', 'utf-8');
  } else {}
});



window.addEventListener('DOMContentLoaded', () => {
  // const newwin = document.querySelector(".newwin");
  // // Agregar listener
  // newwin.addEventListener("click", function(evento) {
  //
  // })

  const version = document.getElementById('version');
  const notification = document.getElementById('notification');
  const message = document.getElementById('message');
  const close_bt = document.getElementById('close-button');
  const restartButton = document.getElementById('restart-button');

  ipcRenderer.send('app_version');
  ipcRenderer.on('app_version', (event, arg) => {
    ipcRenderer.removeAllListeners('app_version');
    version.innerText = 'Version ' + arg.version;
  });

  ipcRenderer.on('update_available', () => {
    ipcRenderer.removeAllListeners('update_available');
    message.innerText = 'A new update is available. Downloading now...';
    notification.classList.remove('hidden');
  });

  ipcRenderer.on('update_downloaded', () => {
    ipcRenderer.removeAllListeners('update_downloaded');
    message.innerText = 'Update Downloaded. It will be installed on restart. Restart now?';
    restartButton.classList.remove('hidden');
    notification.classList.remove('hidden');
  });

  restartButton.addEventListener("click", function(evento) {
    ipcRenderer.send('restart_app');
  })
  close_bt.addEventListener("click", function(evento) {
    notification.classList.add('d-none');
  })

  const newwin = document.querySelector(".newwin");
  newwin.addEventListener("click", function(evento) {
    ipcRenderer.send('app--update', 'false');


    // GENERAR EL AUTOCOMPLETE DEL BUSCADOR
    // RUTA FILE DATA
    const file_data_ruta = path.join(__dirname, 'aplication', 'db-json', 'data.json');
    // RUTA FILE SEARCH
    const file_search_ruta = path.join(__dirname, 'aplication', 'db-json', 'search.json');
    fs.writeFileSync(file_search_ruta, '[]', 'utf-8');
    // LEER DATA
    const file_data_leer = fs.readFileSync(file_data_ruta, 'utf-8');
    const file_search_leer = fs.readFileSync(file_search_ruta, 'utf-8');

    /*PARSE JSON*/
    let data_parse = JSON.parse(file_data_leer);
    let data_search = JSON.parse(file_search_leer);
    for (var i = 0; i < data_parse.length; i++) {
      var userrem = data_parse[i].uploader.replace(/-app/g, 'lokuedo5000');
      var newsearch = {
        Spanish: data_parse[i].titulo,
        User: userrem
      }
      data_search.push(newsearch);
      fs.writeFileSync(file_search_ruta, JSON.stringify(data_search, null, 2), 'utf-8');
    }
    // END

  })


  // LOAD GENEROS
  const file_generos_leer = fs.readFileSync(file_generos_ruta, 'utf-8');
  /*PARSE JSON*/
  let generos_parse = JSON.parse(file_generos_leer);

  /*LIMPIAR*/
  let clear_generos = document.querySelector('#load_generos');
  clear_generos.innerHTML = '';

  for (var i = 0; i < generos_parse.length; i++) {
    clear_generos.innerHTML += `<a class="dropdown-item" href="#" onclick="setgene('${generos_parse[i].item}')">${generos_parse[i].item}</a>`;
  }
  var conts = generos_parse.length;
  var menos_num = conts - 1;
  document.querySelector('.genetotal').innerHTML = '*(' + menos_num + ')';
  // BUSCADOR ALL
  var file_data_leer = fs.readFileSync(file_data_ruta, 'utf-8');
  /*PARSE JSON*/
  var data = JSON.parse(file_data_leer);
  var search_fields = ['tags', 'genero'] //key fields to search for in dataset

  function search(keyword) {
    if (keyword.length < 1) // skip if input is empty
      return

    var results = []

    for (var i in data) { // iterate through dataset
      for (var u = 0; u < search_fields.length; u++) { // iterate through each key in dataset

        var rel = getRelevance(data[i][search_fields[u]], keyword) // check if there are matches

        if (rel == 0) // no matches...
          continue // ...skip

        results.push({
          relevance: rel,
          entry: data[i]
        }) // matches found, add to results and store relevance
      }
    }

    results.sort(compareRelevance) // sort by relevance

    for (i = 0; i < results.length; i++) {
      results[i] = results[i].entry // remove relevance since it is no longer needed
    }

    return results
  }

  function getRelevance(value, keyword) {
    value = value.toLowerCase() // lowercase to make search not case sensitive
    keyword = keyword.toLowerCase()

    var index = value.indexOf(keyword) // index of the keyword
    var word_index = value.indexOf(' ' + keyword) // index of the keyword if it is not on the first index, but a word

    if (index == 0) // value starts with keyword (eg. for 'Dani California' -> searched 'Dan')
      return 3 // highest relevance
    else if (word_index != -1) // value doesnt start with keyword, but has the same word somewhere else (eg. 'Dani California' -> searched 'Cali')
      return 2 // medium relevance
    else if (index != -1) // value contains keyword somewhere (eg. 'Dani California' -> searched 'forn')
      return 1 // low relevance
    else
      return 0 // no matches, no relevance
  }

  function compareRelevance(a, b) {
    return b.relevance - a.relevance
  }

  // BTN SEARCH
  let btn_serach = document.querySelectorAll('.btnl_run_search');
  btn_serach.forEach(btnl_run_search => {
    btnl_run_search.addEventListener('click', () => {
      // HACER LA BUSQUEDA
      // NOMBRE
      var tags_buscar = document.querySelector('.btnl_run_search').getAttribute('data-tags');


      /*RESULT JSON*/
      let result_data = JSON.stringify(search(tags_buscar), null, 2);

      /*PARSE JSON*/
      var encontrados = JSON.parse(result_data);

      /*LIMPIAR*/
      let quitarelementos = document.querySelector('.resultados');
      quitarelementos.innerHTML = '';

      for (var i = 0; i < encontrados.length; i++) {
        var origen_link = encontrados[i].web;
        var web_app = origen_link.replace(/-app/g, app_user_origen);
        var user_app = encontrados[i].uploader.replace(/-app/g, app_user_name);
        quitarelementos.innerHTML += `<div class="search_art">
          <div class="us_ver_uploader">
            <span class="appin">${web_app}</span><span class="appin">${user_app}</span>
          </div>
          <div class="titulo_search" onclick="showpage('infodownload', '${encontrados[i].id}', '${encontrados[i].titulo.replace(/'/g, ':;')}')">${encontrados[i].titulo}</div>
          <div class="dcp_search">${textecorto(encontrados[i].dcp, 150)}</div>
        </div>`;
      }


    });
  });


  // LOAD GAMES
  const file_data_games_leer = fs.readFileSync(file_data_ruta, 'utf-8');
  /*PARSE JSON*/
  // var data_games_parse = JSON.parse(file_data_games_leer);
  var alljson = JSON.parse(file_data_games_leer);
  var data_games_parse = alljson.filter(all => all.tipo == 'Games');
  var suma = 10;
  getJsonFile(suma);

  const boton = document.querySelector(".click_gene");
  // Agregar listener
  boton.addEventListener("click", function(evento) {
    // LOAD GENEROS
    const file_data_games_leer = fs.readFileSync(file_data_ruta, 'utf-8');
    /*PARSE JSON*/
    var alljson = JSON.parse(file_data_games_leer);
    var data_games_parse = alljson.filter(all => all.tipo == 'Games');
    getJsonFile(10);
    addclassShad();
    addclassTrans();
  });


  // CARAGAR DADOS DE EL ARTICULO
  const get_datos = document.querySelector(".get_games");
  // Agregar listener
  get_datos.addEventListener("click", function(evento) {
    var tags_id = document.querySelector('.get_games').getAttribute('data-id');
    const file_data_games_leer = fs.readFileSync(file_data_ruta, 'utf-8');
    var data_games_parse = JSON.parse(file_data_games_leer);
    var buscargame = data_games_parse.filter(obj => obj.id == tags_id);

    var brea = `<li class="breadcrumb-item"><a href="#" onclick="showpage('home', '', 'Home')">Inicio</a></li>
    <li class="breadcrumb-item"><a href="#">${buscargame[0].tipo}</a></li>
    <li class="breadcrumb-item active" aria-current="page">${textecorto(buscargame[0].titulo, 40)}</li>`;


    document.querySelector('#breadcrumb').innerHTML = brea;



    /*CAPTURAS*/
    let limpiarcaps = document.querySelector('#caps');
    limpiarcaps.innerHTML = '';

    var verdata_caps = buscargame[0].capturas;
    var getcaps = verdata_caps.split(",");

    for (var b = 0; b < getcaps.length; b++) {
      limpiarcaps.innerHTML += `<div class="col-app col-app-5">
        <div class="img_ver zoomimg" src='${getcaps[b]}' data-ver='show' style="background-image: url(${getcaps[b]});">

        </div>
      </div>`;
    }


    document.querySelector('.info_all').innerHTML = findall(buscargame[0].infoall);



    // BTN REMOVE
    let click_open_link = document.querySelectorAll('.openlink');
    click_open_link.forEach(el_link_open => {
      el_link_open.addEventListener('click', () => {
        //var get_link = document.querySelector('.openlink').innerText;
        if (ads == true) {
          openlinksads(windowsopen, el_link_open.innerText);
        } else {
          openlinks(windowsopen, el_link_open.innerText);
        }
        //console.log(el_link_open.innerText);
        // window.open('http://adf.ly/9857561/' + el_link_open.innerText);
      });
    });

    function openlinks(open, link) {
      if (open == '_parent') {
        window.open(link);
      } else if (open == '_blank') {
        event.preventDefault();
        shell.openExternal(link);
      }
    }

    function openlinksads(open, link) {
      if (open == '_parent') {
        window.open('http://adf.ly/9857561/' + link);
      } else if (open == '_blank') {
        event.preventDefault();
        shell.openExternal('https://3sk7d418al8u.com/sgskqgdm0?key=2035fd79fbd429c833c57c4a588f2767');
        shell.openExternal('http://adf.ly/9857561/' + link);
      }
    }

    document.querySelector('.youtube-player').setAttribute("data-id", buscargame[0].video);
    document.querySelector('.youtube-player').innerHTML = "";
    play();

    function play() {
      var div, n,
        v = document.getElementsByClassName("youtube-player");
      for (n = 0; n < v.length; n++) {
        div = document.createElement("div");
        div.setAttribute("data-id", v[n].dataset.id);
        div.innerHTML = labnolThumb(v[n].dataset.id);
        div.onclick = labnolIframe;
        v[n].appendChild(div);
      }
    }

    function labnolThumb(id) {
      var thumb = '<img src="https://i.ytimg.com/vi/ID/hqdefault.jpg">',
        play = '<div class="play"></div>';
      return thumb.replace("ID", id) + play;
    }

    function labnolIframe() {
      var iframe = document.createElement("iframe");
      var embed = "https://www.youtube.com/embed/ID?autoplay=1";
      iframe.setAttribute("src", embed.replace("ID", this.dataset.id));
      iframe.setAttribute("frameborder", "0");
      iframe.setAttribute("allowfullscreen", "1");
      this.parentNode.replaceChild(iframe, this);
    }


    // BTN ZOOM
    let zoomimg = document.querySelectorAll('.zoomimg');
    zoomimg.forEach(imgzoom => {
      imgzoom.addEventListener('click', () => {

        var showon = imgzoom.getAttribute('data-ver');
        if (showon == 'show') {
          var imagenget = imgzoom.getAttribute('src');
          document.querySelector('.setzoomimg').setAttribute('src', imagenget);
          document.querySelector('.zoomimg_close').style.display = 'inline-block';
          document.querySelector('.zoomimg_cuerpo').style.display = 'inline-block';
          document.querySelector('.zoomimg_close').style.opacity = 1;
          document.querySelector('.zoomimg_cuerpo').style.opacity = 1;
        } else if (showon == 'hide') {
          document.querySelector('.setzoomimg').setAttribute('src', '');
          document.querySelector('.zoomimg_close').style.display = 'none';
          document.querySelector('.zoomimg_cuerpo').style.display = 'none';
          document.querySelector('.zoomimg_close').style.opacity = 0;
          document.querySelector('.zoomimg_cuerpo').style.opacity = 0;
        }

      });
    });


  });



  var divs = document.getElementsByClassName("contarall").length;
  document.querySelector('.counts_item').innerHTML = divs;

  // VER RESTANTES
  var restar_items = data_games_parse.length;
  var menos_items = restar_items - divs;
  document.querySelector('.numall').innerHTML = '(*' + menos_items + ')';
  //document.getElementById("jugador1puntos").innerHTML = "Jugador1: " + puntos1;


  // BTN ADD
  let btn_add_item = document.querySelectorAll('.add_item');
  btn_add_item.forEach(btn_run_add_item => {
    btn_run_add_item.addEventListener('click', () => {
      var get_items_val = document.querySelector('.counts_item').innerHTML;
      var get_num = 10;
      var suma = parseInt(get_items_val) + parseInt(get_num);
      getJsonFile(suma);
      addclassShad();
      addclassTrans();
    });


  });


  // BTN REMOVE
  let btn_back_item = document.querySelectorAll('.clear_item');
  btn_back_item.forEach(btn_run_back_item => {
    btn_run_back_item.addEventListener('click', () => {
      var get_items_val = document.querySelector('.counts_item').innerHTML;
      var get_num = 1;
      var quequitar = parseInt(get_items_val);

      var suma = 10;

      getJsonFile(suma);

      addclassShad();
      addclassTrans();
    });


  });

  // LOAD IDS
  const file_data_edit_leer = fs.readFileSync(file_data_ruta, 'utf-8');
  var data_edit_parse = JSON.parse(file_data_edit_leer);

  let clear_data_edits = document.querySelector('#loadedist');
  clear_data_edits.innerHTML = '';

  for (var i = 0; i < data_edit_parse.length; i++) {
    clear_data_edits.innerHTML += `<option value="${data_edit_parse[i].id}">${data_edit_parse[i].titulo}</option>`;
  }

  clear_data_edits.innerHTML += '<option value="" selected disabled>--Select</option>';



  // BTN GET EDIT
  let click_edit = document.querySelectorAll('.getedit');
  click_edit.forEach(el_edit => {
    el_edit.addEventListener('click', () => {
      var verifiq = el_edit.getAttribute('data-id');
      if (verifiq == "") {

      } else {
        const file_data_value_leer = fs.readFileSync(file_data_ruta, 'utf-8');
        var data_value_parse = JSON.parse(file_data_value_leer);

        var getdataValue = data_value_parse.filter(obj => obj.id == verifiq);

        // SET TEXT INPUTS & TEXTAREA
        var verificar_texto = getdataValue[0].infoall;
        var verificar_state = getdataValue[0].state;

        if (verificar_state == 'true') {
          document.querySelector('#state_select').options.selectedIndex = 1;
        } else if (verificar_state == 'false') {
          document.querySelector('#state_select').options.selectedIndex = 2;
        }


        document.querySelector('#titulo').value = getdataValue[0].titulo;
        document.querySelector('#imgedit').value = getdataValue[0].img;
        document.querySelector('#video').value = getdataValue[0].video;
        document.querySelector('#capturas').value = getdataValue[0].capturas;
        document.querySelector('#dcp').value = getdataValue[0].dcp;


        if (verificar_texto == "") {
          document.querySelector('#infoall').value = sample;
        } else {
          document.querySelector('#infoall').value = getdataValue[0].infoall;
        }

        document.querySelector('#uploader').value = getdataValue[0].uploader;
        document.querySelector('#userimg').value = getdataValue[0].userimg;
        document.querySelector('#peso').value = getdataValue[0].peso;
        document.querySelector('#servidor').value = getdataValue[0].servidor;
        document.querySelector('#genero').value = getdataValue[0].genero;
        document.querySelector('#tags').value = getdataValue[0].tags;
        // document.querySelector('#titulo').value = getdataValue[0].titulo;
      }

    });
  });


  const save_new = document.querySelector(".save_id");
  // Agregar listener
  save_new.addEventListener("click", function(evento) {
    var idsave = save_new.getAttribute('data-id');
    if (idsave == "") {

    } else {
      const file_data_save_leer = fs.readFileSync(file_data_ruta, 'utf-8');
      var data_save_parse = JSON.parse(file_data_save_leer);

      // SET TEXT INPUTS & TEXTAREA
      var get_text_state = document.querySelector('#state_select').value;
      var get_text_titulo = document.querySelector('#titulo').value;
      var get_text_video = document.querySelector('#video').value;
      var get_text_capturas = document.querySelector('#capturas').value;
      var get_text_img = document.querySelector('#imgedit').value;
      var get_text_dcp = document.querySelector('#dcp').value;
      var get_text_infoall = document.querySelector('#infoall').value;
      var get_text_uploader = document.querySelector('#uploader').value;
      var get_text_userimg = document.querySelector('#userimg').value;
      var get_text_peso = document.querySelector('#peso').value;
      var get_text_servidor = document.querySelector('#servidor').value;
      var get_text_genero = document.querySelector('#genero').value;
      var get_text_tags = document.querySelector('#tags').value;

      for (var i = 0; i < data_save_parse.length; i++) {
        if (data_save_parse[i].id == idsave) {
          // add_yes.splice(i, 1);
          data_save_parse[i].state = get_text_state;
          data_save_parse[i].titulo = get_text_titulo;
          data_save_parse[i].img = get_text_img;
          data_save_parse[i].video = get_text_video;
          data_save_parse[i].capturas = get_text_capturas;
          data_save_parse[i].dcp = get_text_dcp;
          data_save_parse[i].infoall = get_text_infoall;
          data_save_parse[i].uploader = get_text_uploader;
          data_save_parse[i].userimg = get_text_userimg;
          data_save_parse[i].peso = get_text_peso;
          data_save_parse[i].servidor = get_text_servidor;
          data_save_parse[i].genero = get_text_genero;
          data_save_parse[i].tags = get_text_tags;
          break;
        }
      }

      fs.writeFile(file_data_ruta, JSON.stringify(data_save_parse, null, 2), function writeJSON(err) {
        if (err) return console.log(err);
        // LOAD SAVE EDIT
        const file_data_games_leer = fs.readFileSync(file_data_ruta, 'utf-8');
        /*PARSE JSON*/
        var data_games_parse = JSON.parse(file_data_games_leer);


        let clear_data_edits = document.querySelector('#loadedist');
        clear_data_edits.innerHTML = '';

        for (var i = 0; i < data_games_parse.length; i++) {
          clear_data_edits.innerHTML += `<option value="${data_games_parse[i].id}">${data_games_parse[i].titulo}</option>`;
        }

        clear_data_edits.innerHTML += '<option value="" selected>--Select</option>';


        getJsonFile(10);
        addclassShad();
        addclassTrans();
      });

    }
  });


  function getJsonFile(suma) {
    var tags_generos = document.querySelector('.vergenero').getAttribute('data-genero');
    // LOAD GENEROS
    const file_data_games_leer = fs.readFileSync(file_data_ruta, 'utf-8');
    /*PARSE JSON*/
    if (tags_generos == "") {
      var alljson = JSON.parse(file_data_games_leer);
      var data_games_parse = alljson.filter(all => all.tipo == 'Games');
    } else if (tags_generos == "Todos") {
      var alljson = JSON.parse(file_data_games_leer);
      var data_games_parse = alljson.filter(all => all.tipo == 'Games');

    } else {
      /*RESULT JSON*/
      let result_data = JSON.stringify(search(tags_generos), null, 2);

      /*PARSE JSON*/
      var alljson = JSON.parse(result_data);
      var data_games_parse = alljson.filter(all => all.tipo == 'Games');

    }


    // VER RESTANTES
    var restar_items = data_games_parse.length;
    var menos_items = restar_items - divs;
    document.querySelector('.numall').innerHTML = '(*' + menos_items + ')';

    /*LIMPIAR*/
    let clear_data_games = document.querySelector('#load_data_games');
    clear_data_games.innerHTML = '';

    if (data_games_parse.length < suma) {
      var veritems = data_games_parse.length;
      document.querySelector('.numall').innerHTML = '(*' + '0' + ')';
    } else {
      var veritems = suma;
      var restar_items = data_games_parse.length;
      var menos_items = restar_items - veritems;
      document.querySelector('.numall').innerHTML = '(*' + menos_items + ')';
    }

    for (var i = 0; i < veritems; i++) {
      var user_rem = data_games_parse[i].uploader.replace(/-app/g, app_user_name);
      var user_app_img = data_games_parse[i].userimg.replace(/-app/g, app_user_img);

      if (data_games_parse[i].state == 'true') {
        var stategames = '';
      } else {
        var stategames = `<div class="suviendogameprograma cwI-cloud-upload1"></div>`;
      }
      clear_data_games.innerHTML += `<div class="col-app col-app-5 contarall">
        <div class="covers tt_02" onclick="showpage('infodownload', '${data_games_parse[i].id}', '${data_games_parse[i].titulo.replace(/'/g, ':;')}')">
          <div class="zom_cover box_sha" style="background-image: url(${data_games_parse[i].img});">
            ${stategames}
            <div class="ico_uploader" style="background-image: url(${user_app_img});" title="${user_rem}"></div>
            <div class="server_up ${data_games_parse[i].servidor.toLowerCase()}">${data_games_parse[i].servidor}</div>
            <div class="peso_file">${data_games_parse[i].peso}</div>
            <div class="gradient_cover"></div>
          </div>
        </div>
        <h6 class="titulo_cover">${data_games_parse[i].titulo}</h6>
      </div>`;
    }
    document.querySelector('.counts_item').innerHTML = veritems;
  }


  // SAVE NEW ART
  // FECHA
  const dt = dateTime.create();

  var days = dt.format('d');
  var years = dt.format('Y');

  var mes = dt.format('m');

  if (mes == '01') {
    var vermes = 'Enero';
  } else if (mes == '02') {
    var vermes = 'Febrero';
  } else if (mes == '03') {
    var vermes = 'Marzo';
  } else if (mes == '04') {
    var vermes = 'Abril';
  } else if (mes == '05') {
    var vermes = 'Mayo';
  } else if (mes == '06') {
    var vermes = 'Junio';
  } else if (mes == '07') {
    var vermes = 'Julio';
  } else if (mes == '08') {
    var vermes = 'Agosto';
  } else if (mes == '09') {
    var vermes = 'Septiembre';
  } else if (mes == '10') {
    var vermes = 'Octubre';
  } else if (mes == '11') {
    var vermes = 'Noviembre';
  } else if (mes == '12') {
    var vermes = 'Diciembre';
  }
  // $('#getfecha').val(fecha_spanish);
  // $('#getid').val(uuidv4());
  var fecha_spanish = days + ' de ' + vermes + ' ' + years;
  document.querySelector(".setfechaart").value = fecha_spanish;

  // SAVE COG
  const save_cog = document.querySelector(".save_cog");
  // Agregar listener
  save_cog.addEventListener("click", function(evento) {
    var ruta_save_cog = save_cog.getAttribute('data-ruta');
    var get_data_save = require(ruta_save_cog);

    var getdata_input_cog = document.querySelector(".input_value_tiempo").value;
    var getdata_input_cog_link = document.querySelector(".input_value_update").value;
    get_data_save.enlaces.tiempoUpdate = getdata_input_cog;
    get_data_save.enlaces.update = getdata_input_cog_link;
    fs.writeFileSync(ruta_save_cog, JSON.stringify(get_data_save, null, 2), 'utf-8');
  });

  // DESCARGAR ARCHIVOS
  function clickDownload(enlace) {
    var file = fs.createWriteStream(path.join(__dirname, 'ServerGitHub', 'download', 'update.zip'));
    var len = 0;

    https.get(enlace, function(res) {
      res.on('data', function(chunk) {
        file.write(chunk);
        len += chunk.length;

        // percentage downloaded is as follows
        var percent = (len / res.headers['content-length']) * 100;
        document.querySelector('.progrees_bar').style.width = percent + '%';
      });
      res.on('end', function() {
        file.close();
      });
      file.on('close', function() {
        // the file is done downloading
        // exec('update_setup.exe');
        findownload();
      });
    });
  }

  // CLICK DOWNLOAD
  const webapp = document.querySelector(".click_down");
  // Agregar listener
  webapp.addEventListener("click", function(evento) {
    document.querySelector('.barra_progrees').style.display = 'inline-block';
    clickDownload(jsoncog.enlaces.update);
  });


  function findownload() {
    // EXTRAER ARCHIVOS
    var file_descargada = path.join(__dirname, 'ServerGitHub', 'download', 'update.zip');
    var folder_installl = path.join(__dirname, '/');
    var extract = require('extract-zip');
    var update_file = path.resolve(file_descargada);
    var install_update = path.resolve(folder_installl);

    extract(update_file, {
      dir: install_update
    }, function(err) {
      if (err) {
        console.log(err);
      } else {
        document.querySelector('.progrees_bar').style.width = '0' + '%';
        document.querySelector('.barra_progrees').style.display = 'none';
        document.querySelector('.mensaje_app').click();
      }
    })
  }

  // ID
  document.querySelector(".setidart").value = uuidv4().slice(0, 8);

  // ID
  document.querySelector(".ejemploinfo").value = sample;

  const addnewart = document.querySelector(".setadd_art");
  // Agregar listener
  addnewart.addEventListener("click", function(evento) {
    const formSerialize = formElement => {
      const values = {};
      const inputs = formElement.elements;

      for (let i = 0; i < inputs.length; i++) {
        values[inputs[i].name] = inputs[i].value;
      }
      return values;
    }

    const form = document.querySelector('.addforms');

    const r = formSerialize(form);

    // LOAD ALL
    const file_data_edit_leer = fs.readFileSync(file_data_ruta, 'utf-8');
    var rempla = file_data_edit_leer.replace(/\[/g, '').replace(/\]/g, '');
    // var arreglar = JSON.stringify([rempla], null, 2);
    var setadd = JSON.parse(file_data_edit_leer);

    const rows = {
      id: r.id,
      web: r.web,
      state: r.state,
      uploader: r.uploader,
      userimg: r.userimg,
      titulo: r.titulo,
      img: r.img,
      capturas: r.capturas,
      dcp: r.dcp,
      infoall: r.infoall,
      tags: r.tags,
      peso: r.peso,
      servidor: r.servidor,
      genero: r.genero,
      video: r.video,
      tipo: r.tipo
    }
    // rows.push(setadd);
    if (setadd.length == 0) {
      var spr = '';
    } else {
      var spr = ',';
    }
    // var setadd = JSON.parse([rows + spr + rempla]);
    var parse_json = '[' + JSON.stringify(rows, null, 2) + spr + rempla + ']';
    fs.writeFileSync(file_temp_json, parse_json, 'utf-8');

    const finalizar = fs.readFileSync(file_temp_json, 'utf-8');
    var setadd = JSON.parse(finalizar);

    fs.writeFileSync(file_data_ruta, JSON.stringify(setadd, null, 2), 'utf-8');
  });



  addclassShad();
  addclassTrans();


  function addclassShad() {
    if (effect_box == true) {
      var rojos = document.getElementsByClassName("box_sha");
      for (var i = 0; i < rojos.length; i++) {
        rojos[i].classList.remove("box_sha_js");
        rojos[i].classList.add("box_sha_js");
      }
    }
  }

  function addclassTrans() {
    if (effect_tt == true) {
      var transi = document.getElementsByClassName("tt_02");
      for (var a = 0; a < transi.length; a++) {
        transi[a].classList.remove("tt_02_js");
        transi[a].classList.add("tt_02_js");
      }
    }
  }


  function findall(rem) {
    return rem.replace(/::h1;/g, '<h1>')
      .replace(/::\/h1;/g, '</h1>')
      .replace(/::h1-mb-1;/g, '<h1 clsss="mb-1">')
      .replace(/::h1-mb-2;/g, '<h1 clsss="mb-2">')
      .replace(/::h1-mb-3;/g, '<h1 clsss="mb-3">')
      .replace(/::h1-mb-4;/g, '<h1 clsss="mb-4">')
      .replace(/::h1-mb-5;/g, '<h1 clsss="mb-5">')
      .replace(/::h1-mb-0;/g, '<h1 clsss="mb-0">')
      .replace(/::h2;/g, '<h2>')
      .replace(/::\/h2;/g, '</h2>')
      .replace(/::h2-mb-1;/g, '<h2 clsss="mb-1">')
      .replace(/::h2-mb-2;/g, '<h2 clsss="mb-2">')
      .replace(/::h2-mb-3;/g, '<h2 clsss="mb-3">')
      .replace(/::h2-mb-4;/g, '<h2 clsss="mb-4">')
      .replace(/::h2-mb-5;/g, '<h2 clsss="mb-5">')
      .replace(/::h2-mb-0;/g, '<h2 clsss="mb-0">')
      .replace(/::h3;/g, '<h3>')
      .replace(/::\/h3;/g, '</h3>')
      .replace(/::h3-mb-1;/g, '<h3 clsss="mb-1">')
      .replace(/::h3-mb-2;/g, '<h3 clsss="mb-2">')
      .replace(/::h3-mb-3;/g, '<h3 clsss="mb-3">')
      .replace(/::h3-mb-4;/g, '<h3 clsss="mb-4">')
      .replace(/::h3-mb-5;/g, '<h3 clsss="mb-5">')
      .replace(/::h3-mb-0;/g, '<h3 clsss="mb-0">')
      .replace(/::h4;/g, '<h4>')
      .replace(/::\/h4;/g, '</h4>')
      .replace(/::h4-mb-1;/g, '<h4 clsss="mb-1">')
      .replace(/::h4-mb-2;/g, '<h4 clsss="mb-2">')
      .replace(/::h4-mb-3;/g, '<h4 clsss="mb-3">')
      .replace(/::h4-mb-4;/g, '<h4 clsss="mb-4">')
      .replace(/::h4-mb-5;/g, '<h4 clsss="mb-5">')
      .replace(/::h4-mb-0;/g, '<h4 clsss="mb-0">')
      .replace(/::h5;/g, '<h5>')
      .replace(/::\/h5;/g, '</h5>')
      .replace(/::h5-mb-1;/g, '<h5 clsss="mb-1">')
      .replace(/::h5-mb-2;/g, '<h5 clsss="mb-2">')
      .replace(/::h5-mb-3;/g, '<h5 clsss="mb-3">')
      .replace(/::h5-mb-4;/g, '<h5 clsss="mb-4">')
      .replace(/::h5-mb-5;/g, '<h5 clsss="mb-5">')
      .replace(/::h5-mb-0;/g, '<h5 clsss="mb-0">')
      .replace(/::h6;/g, '<h6>')
      .replace(/::\/h6;/g, '</h6>')
      .replace(/::h6-mb-1;/g, '<h6 clsss="mb-1">')
      .replace(/::h6-mb-2;/g, '<h6 clsss="mb-2">')
      .replace(/::h6-mb-3;/g, '<h6 clsss="mb-3">')
      .replace(/::h6-mb-4;/g, '<h6 clsss="mb-4">')
      .replace(/::h6-mb-5;/g, '<h6 clsss="mb-5">')
      .replace(/::h6-mb-0;/g, '<h6 clsss="mb-0">')
      .replace(/::a;/g, '<a class="openlink">')
      .replace(/::\/a;/g, '</a>')
  }

  function textecorto(text, max) {
    if (max > text.length) {
      return text;
    } else {
      return text.slice(0, max) + "...";
    }
    return
  }

  if (userInf == false) {
    var elem = document.getElementById("conts_btn");
    elem.remove();
  }

  window.addEventListener('load', calculos, false);

  function calculos() {
    document.querySelector(".newwin").click();
    // SET DATA PACKAGE
    var ruta_appdata_cog = document.querySelector('.save_cog').getAttribute('data-ruta');
    var cog_data_json = require(ruta_appdata_cog);
    document.querySelector('.version_app').innerHTML = 'v' + jsoncog.version;
    document.querySelector('.vcode').innerHTML = 'v' + jsoncog.vCode;
    document.querySelector('.input_value_tiempo').value = cog_data_json.enlaces.tiempoUpdate;
    document.querySelector('.input_value_update').value = cog_data_json.enlaces.update;
  }

});

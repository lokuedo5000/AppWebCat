$(document).ready(function() {

  // OCULTAR TODO
  // $('.appviwe').slideUp(100).delay(700);
  // $('#home').slideDown(200).delay(300);

  $('.settime_dwn').click(function(event) {
    var timedown = $(this).attr('data-tipo');
    $('.input_value_tiempo').val(timedown);
  });
  $('.mensaje_app').click(function (event) {
    $('#showaviso').modal('show');
  })

  // END
  $('body').css('padding-top', $('.menu_app').outerHeight() + 'px');
  $(window).resize(function() {
    // body_pd();
    $('body').css('padding-top', $('.menu_app').outerHeight() + 'px');
  });


  posmenu_logo();
  // body_pd();

  // COG LOGO
  function posmenu_logo() {

    // var ancho_win = $(window).outerWidth();
    // if (ancho_win > 767) {
    // 	// ALTO MENU
    // 	var alto_menu = $('.menu_app').innerHeight();

    // 	// LOGO
    // 	var alto_logo = $('.logo').innerHeight();
    // 	var dividir_pos_logo = alto_menu/2-alto_logo/2;
    // 	$('.logo').css('margin', dividir_pos_logo + 'px 0 0 0');

    // 	//SEARCH
    // 	var alto_search = $('.search_form').innerHeight();
    // 	var dividir_pos_search = alto_menu/2-alto_search/2;
    // 	$('.search_form').css('margin-top', dividir_pos_search + 'px');

    // 	// LINK
    // 	var link_menu = $('.link_menu').innerHeight();
    // 	var dividir_pos_list_menu = alto_menu/2-link_menu/2;
    // 	$('.link_menu').css('margin', dividir_pos_list_menu + 'px 0 0 0');
    // 	$('.menu_poup').css('top', alto_menu+15 + 'px');
    // }else {
    // 	$('.logo').css('margin', '10px auto 0 auto');
    // 	// COG SEARCH
    // 	$('.search_form').css('margin', '0 0 10px 0');
    // 	// COG LIST MENU
    // 	$('.link_menu').css('margin',  '0 0 10px 0');

    // 	var get_h_menu = $('.menu_app').innerHeight();
    // 	$('.menu_poup').css('top', get_h_menu+15 + 'px');
    // }


  }
  // END

  $('.usdata_img').click(function(event) {
    $('.menu_poup').fadeIn(200);
    $('.menu_poup').css('z-index', '99999');
    $('.close_poup').show();
  });

  $('.close_poup').click(function(event) {
    $('.menu_poup').fadeOut(200);
    $('.menu_poup').css('z-index', '0');
    $('.close_poup').hide();
  });

  var get_menu = $('.menu_ef').html();

  var remplace = get_menu.replaceAll('menu_app_rem', 'dropdown-item');

  $('.dr_set').html(remplace);

  // $(".buscador-hide").slideUp(300);
  // $('.icon_search').click(function(event) {
  // 	var ver = $(this).attr('data-active');
  // 	if (ver == "false") {
  // 		$(".buscador-hide").slideUp(300).delay(800);
  // 		$(this).attr('data-active', 'true');
  // 		$('.buscador-hide').css('overflow', 'hidden');
  // 	}else{
  // 		$('.buscador-hide').slideDown(300).delay(800);
  // 		$(this).attr('data-active', 'false');
  // 		$('.buscador-hide').css('overflow', 'visible');
  // 	}
  //
  // });

  $('.home').fadeIn(200);

  // AGREGAR NUEVO ARTICULO
  $('.parte_one').show();
  $('.setadd_art').fadeOut(200);


});
$('.zoomimg').click(function(event) {
  var urlimg = $(this).attr('src');
  $('.zoomimg_cuerpo img').attr('src', urlimg);
  $('.zoomimg_close').fadeIn(200);
  $('.zoomimg_cuerpo').fadeIn(200);

})



function newartSet(parte, sd) {
  $('.parte_all').fadeOut(200);
  $('.' + parte).fadeIn(200);
  if (sd == 'final') {
    $('.setadd_art').fadeIn(200);
  } else {
    $('.setadd_art').fadeOut(200);
  }
}

function showpage(page, id, title) {
  $('.appviwe').fadeOut(200).delay(300);
  $('#' + page).fadeIn(200);
  $('title').text(textecorto(title.replace(/:;/g, "'"), 40) + ' | AppWebCat - DtoLKD');

  // CARGAR JUEGOS
  if (id == '') {
    $('.get_games').attr('data-id', '');
    document.querySelector('.youtube-player').innerHTML = "";
  } else {
    $('.get_games').attr('data-id', id);
    var textrem = $('.info_all').text();
    // $('.info_all').html(remplazartextos(textrem));
    var requitext = $('.requisitosall').text();
    // $('.requisitosall').html(remplazartextos(requitext));
    $('.get_games').click();
  }

}

function showeditor(page, title) {
  $('.appviwe').fadeOut(200).delay(300);
  $('#' + page).fadeIn(200);
  $('title').text(textecorto(title.replace(/:;/g, "'"), 40) + ' | AppWebCat - DtoLKD');
  $('.get_games').attr('data-id', '');

  $('.menu_poup').fadeOut(200);
  $('.menu_poup').css('z-index', '0');
  $('.close_poup').hide();

  document.querySelector('.youtube-player').innerHTML = "";
}

function setgene(gene) {
  $('.setgne').text(gene);
  var genero_rem = gene.replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i').replace(/ó/g, 'o').replace(/ú/g, 'u').replace(/Á/g, 'A').replace(/É/g, 'E').replace(/Í/g, 'I').replace(/Ó/g, 'O').replace(/Ú/g, 'U');
  $('.vergenero').attr('data-genero', genero_rem);

  document.querySelector(".click_gene").click();
}

function textecorto(text, max) {
  if (max > text.length) {
    return text;
  } else {
    return text.slice(0, max) + "...";
  }
  return
}

// tinymce.init({
//   selector: "textarea#infoall",
//   skin: "bootstrap",
//   plugins: "lists, link, image, media",
//   toolbar:
//     "h1 h2 bold italic strikethrough blockquote bullist numlist backcolor | link image media | removeformat help",
//   menubar: true,
//   setup: (editor) => {
//     // Apply the focus effect
//     editor.on("init", () => {
//       editor.getContainer().style.transition =
//         "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out";
//     });
//     editor.on("focus", () => {
//       (editor.getContainer().style.boxShadow =
//         "0 0 0 .2rem rgba(0, 123, 255, .25)"),
//         (editor.getContainer().style.borderColor = "#80bdff");
//     });
//     editor.on("blur", () => {
//       (editor.getContainer().style.boxShadow = ""),
//         (editor.getContainer().style.borderColor = "");
//     });
//   },
// });

import $ from 'jquery';
import { pontos } from './data.js';

function update24(h) {
  return h >= 24 ? h - 24 : h;
}

function updateGMT(hora) {
  const offset = new Date().getTimezoneOffset() / 60;
  const gmtRio = 3;
  return offset !== gmtRio ? update24(hora - (gmtRio - offset)) : hora;
}

function addZero(num) {
  return num < 10 ? `0${num}` : `${num}`;
}

function show(id) {
  if ($(`#box-${id}`).css('display') === 'block' && $(`#info-${id}`).css('display') === 'block') {
    $(`#box-${id}`).fadeOut(800);
    $(`#info-${id}`).fadeOut(800);
  } else {
    $('.box').hide();
    $('.dados').hide();
    $(`#box-${id}`).fadeIn(800);
    $(`#info-${id}`).fadeIn(800);
  }
}

function addFlutuantes() {
  $.each(pontos, (i, ponto) => {
    const x = ponto.posX;
    const y = ponto.posY;

    $('<img>')
      .attr('id', `i-${i}`)
      .addClass('marker')
      .attr('src', 'images/marker.png')
      .css({ left: y, top: x })
      .on('click', function () {
        show($(this).attr('id').replace('i-', ''));
      })
      .appendTo('#expo');

    const box = $('<img>').attr('id', `box-${i}`).addClass('box');
    if (ponto.box === 0) {
      box.attr('src', 'images/box3.png').css({ left: y - 190, top: x + 40 });
    } else if (ponto.box === 2) {
      box.attr('src', 'images/box1.png').css({ left: y - 100, top: x - 263 });
    }
    box.appendTo('#expo');

    const dat = $('<div>')
      .attr('id', `info-${i}`)
      .addClass('dados')
      .html(
        `<div class="boxTitle">${ponto.quem}</div>` +
        `<table cellspacing="3" border="0" width="95%">` +
        `<tr><td class="contexto">O que</td><td>  ${ponto.oque}</td></tr>` +
        `<tr><td class="contexto">Quando</td><td>  ${ponto.quando}</td></tr>` +
        `<tr><td class="contexto">Horário</td><td>  ${ponto.de}h - ${ponto.ate}h</td></tr>` +
        `<tr><td class="contexto">Desde</td><td>  ${ponto.desde}</td></tr>` +
        `<tr><td class="contexto">Mora</td><td>  ${ponto.mora}</td></tr>` +
        `</table>`
      );

    if (ponto.box === 0) {
      dat.css({ left: y - 180, top: x + 120 });
    } else {
      dat.css({ left: y - 90, top: x - 253 });
    }
    dat.appendTo('#expo');
  });
}

function atualiza() {
  const agora = new Date();
  const horaNum = updateGMT(agora.getHours());
  const minNum = agora.getMinutes();
  const hora = addZero(horaNum);
  const minuto = addZero(minNum);
  const segundo = addZero(agora.getSeconds());

  const time = $('#time');
  time.text(`${hora}:${minuto}:${segundo}`);
  time.css('margin-left', $(window).width() - time.width() - 10);
  $('#time-text').css('left', $(window).width() - $('#time-text').width() - 10);
  $('#video').css('left', $(window).width() - 110);

  let image = `mapa-${hora}h.jpg`;
  if (horaNum === 5  && minNum >= 30) image = 'mapa-05h30.jpg';
  if (horaNum === 19 && minNum >= 30) image = 'mapa-19h30.jpg';

  const src = `images/mapa/${image}`;
  if ($('#mapa').attr('src') !== src) $('#mapa').attr('src', src);
}

$(function () {
  $('#video').on('click', function () {
    if ($('#video-box').css('display') === 'none') {
      $('#video-box').css({
        left: $('#mapa').width() / 2 - $('#video-box').width() / 2,
        top:  $('#mapa').height() / 2 - $('#video-box').height() / 2,
      }).fadeIn(600);
    } else {
      $('#video-box').fadeOut(600);
    }
  });

  $('#info').on('click', function () {
    if ($('#time-text').css('display') === 'block') $('#time-text').slideToggle('slow');
    if ($('#sobre-text').css('display') === 'block') $('#sobre-text').slideToggle('slow');
    $('#info-text').slideToggle('slow', function () {
      $('#info').text($('#info-text').css('display') === 'block' ? 'info@pensarpublico.com.br' : 'info');
    });
  });

  $('#time').on('click', function () {
    if ($('#sobre-text').css('display') === 'block') $('#sobre-text').hide('slow');
    $('#time-text').slideToggle('slow');
    if ($('#info-text').css('display') === 'block') {
      $('#info-text').slideToggle('slow');
      $('#info').text('info');
    }
  });

  $('#sobre').on('click', function () {
    $('#sobre-text').slideToggle(800);
    if ($('#time-text').css('display') === 'block') $('#time-text').slideToggle('slow');
    if ($('#info-text').css('display') === 'block') {
      $('#info-text').slideToggle();
      $('#info').text('info');
    }
  });

  $('#mapa').on('load', function () {
    $('#loading').fadeOut(function () { $(this).remove(); });
    $('#mapa').fadeIn(2600, function () {
      $('.link').slideToggle(900);
      $('.marker').fadeIn(1100);
    });
  });

  $(window).on('resize', function () {
    if ($('body').width() > 900) {
      const fontSize = ($('body').width() * 25) / 1024;
      if (fontSize >= 20 && fontSize <= 33) $('body').css('font-size', fontSize);
    }
  }).trigger('resize');

  addFlutuantes();
  setInterval(atualiza, 1000);
});

// Odszkodowanie za lot — PUBLICZNA wersja pismo.js (wdroz.sh podmienia nią pismo.js w /odszkodowanie/).
// Bez generatora wniosków: treść wniosku do linii i do Rzecznika jest tylko w pełnej wersji. Bez DOM.
(function (root) {
  'use strict';
  function dataPL(d) { var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(d || '')); return m ? m[3] + '.' + m[2] + '.' + m[1] : '…'; }
  function czasPL(dt) { var m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(String(dt || '')); return m ? m[3] + '.' + m[2] + '.' + m[1] + ' ' + m[4] + ':' + m[5] : '…'; }
  function wart(v) { var t = String(v == null ? '' : v).trim(); return t || '…'; }
  function pasazerowie(o) {
    var l = String(o.pasazerowie || '').split(/\r?\n/).map(function (x) { return x.trim(); }).filter(Boolean);
    return l.length ? l : [wart(o.imie)];
  }
  function tylkoPelna() { return 'Gotowy wniosek przygotujesz w pełnej wersji aplikacji.'; }
  var API = { wniosek: tylkoPelna, wniosekRzecznik: tylkoPelna, pasazerowie: pasazerowie, dataPL: dataPL, czasPL: czasPL };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.WLP = API;
})(this);

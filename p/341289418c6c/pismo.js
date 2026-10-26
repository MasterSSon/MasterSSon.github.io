// Odszkodowanie za lot — treść wniosku do linii (PL/EN) i wniosku do Rzecznika Praw Pasażerów (ULC). Bez DOM.
(function (root) {
  'use strict';
  var WL = root.WL || (typeof require !== 'undefined' ? require('./rdzen.js') : null);

  function dataPL(d) { var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(d || '')); return m ? m[3] + '.' + m[2] + '.' + m[1] : '…'; }
  function czasPL(dt) { var m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(String(dt || '')); return m ? m[3] + '.' + m[2] + '.' + m[1] + ' ' + m[4] + ':' + m[5] : '…'; }
  function wart(v) { var t = String(v == null ? '' : v).trim(); return t || '…'; }
  function lot(l) { return l ? l.iata + (l.miasto ? ' (' + l.miasto + ')' : '') : '…'; }
  function pasazerowie(o) {
    var l = String(o.pasazerowie || '').split(/\r?\n/).map(function (x) { return x.trim(); }).filter(Boolean);
    return l.length ? l : [wart(o.imie)];
  }
  function kwotaRazem(w, n) { return w.kwota * n; }
  function eur(v) { return Math.round(v) + ' EUR'; } // kwoty z art. 7 (także po obniżeniu o 50%) są zawsze całe
  function zl(v) { var n = WL.liczba(v); return n ? n.toFixed(2).replace('.', ',') + ' zł' : ''; }

  var ZDARZENIE = { opoznienie: 'opóźnienie lotu', odwolanie: 'odwołanie lotu', odmowa: 'odmowę przyjęcia na pokład' };

  function opisPL(s) {
    if (s.typ === 'opoznienie') return 'Planowany przylot do miejsca docelowego: ' + czasPL(s.planPrzylot) + ', rzeczywisty przylot: ' + czasPL(s.rzeczPrzylot) +
      (s.opoznienieMin != null ? ' (opóźnienie ' + WL.godz(s.opoznienieMin) + ').' : '.');
    if (s.typ === 'odwolanie') return 'Lot został odwołany. O odwołaniu poinformowano mnie ' + ({ '7-13': '7–13 dni', '<7': 'mniej niż 7 dni' }[s.uprzedzenie] || '…') + ' przed planowanym wylotem.' +
      (s.zastepczy === 'tak' ? ' Zaproponowany lot zastępczy: wylot ' + czasPL(s.zastWylot) + ', przylot ' + czasPL(s.zastPrzylot) + ' (planowo: wylot ' + czasPL(s.planWylot) + ', przylot ' + czasPL(s.planPrzylot) + ').' : ' Nie zaproponowano mi lotu zastępczego spełniającego warunki art. 5 ust. 1 lit. c.');
    return 'Mimo stawienia się na czas do odprawy z ważnymi dokumentami odmówiono mi przyjęcia na pokład wbrew mojej woli.' +
      (s.zastPrzylot ? ' Do miejsca docelowego dotarłem/dotarłam: ' + czasPL(s.zastPrzylot) + '.' : '');
  }
  function opisEN(s) {
    if (s.typ === 'opoznienie') return 'Scheduled arrival at the final destination: ' + czasPL(s.planPrzylot) + ', actual arrival: ' + czasPL(s.rzeczPrzylot) +
      (s.opoznienieMin != null ? ' (delay of ' + WL.godz(s.opoznienieMin) + ').' : '.');
    if (s.typ === 'odwolanie') return 'The flight was cancelled. I was informed ' + ({ '7-13': '7–13 days', '<7': 'less than 7 days' }[s.uprzedzenie] || '…') + ' before the scheduled departure.' +
      (s.zastepczy === 'tak' ? ' Re-routing offered: departure ' + czasPL(s.zastWylot) + ', arrival ' + czasPL(s.zastPrzylot) + ' (scheduled: departure ' + czasPL(s.planWylot) + ', arrival ' + czasPL(s.planPrzylot) + ').' : ' No re-routing meeting the conditions of Article 5(1)(c) was offered.');
    return 'Although I presented myself for check-in on time with valid travel documents, I was denied boarding against my will.' +
      (s.zastPrzylot ? ' I reached the final destination on ' + czasPL(s.zastPrzylot) + '.' : '');
  }

  function wniosek(s, w, o, jezyk) {
    o = o || {};
    var p = pasazerowie(o), n = p.length, razem = kwotaRazem(w, n), wyd = zl(o.wydatki), en = jezyk === 'en';
    var trasa = lot(s.wylot) + (s.przesiadka && s.przes ? ' – ' + lot(s.przes) : '') + ' – ' + lot(s.przylot);
    var L = [];
    if (en) {
      L.push(wart(o.imie), wart(o.adres), 'E-mail: ' + wart(o.email) + (o.telefon ? ', phone: ' + o.telefon : ''), '', 'To: ' + wart(s.linia), 'Date: ' + dataPL(o.dzis), '',
        'CLAIM FOR COMPENSATION UNDER REGULATION (EC) No 261/2004', '',
        'Booking reference: ' + wart(o.rezerwacja), 'Flight number(s): ' + wart(s.nrLotu), 'Date of flight: ' + dataPL(s.data), 'Route: ' + trasa + ' (great-circle distance: ' + w.km + ' km)', '',
        'Passengers: ' + p.join(', '), '', opisEN(s), '',
        'Under Articles ' + (s.typ === 'odmowa' ? '4 and 7' : s.typ === 'odwolanie' ? '5 and 7' : '7') + ' of Regulation (EC) No 261/2004' + (s.typ === 'opoznienie' ? ' and the judgment of the Court of Justice in joined cases C-402/07 and C-432/07 (Sturgeon)' : '') +
        ', I hereby claim compensation of ' + eur(w.kwota) + ' per passenger, i.e. ' + eur(razem) + ' in total for ' + n + ' passenger' + (n > 1 ? 's' : '') + '.');
      if (wyd) L.push('', 'I also claim reimbursement of expenses for meals, accommodation and transport incurred because the carrier failed to provide care under Article 9: ' + wyd + ' (receipts attached).');
      L.push('', 'Please transfer the amount within 30 days to the bank account: ' + wart(o.iban) + ' (account holder: ' + wart(o.imie) + ').',
        'If the claim is not settled, I will refer the matter to the national enforcement body (Passenger Rights Ombudsman at the Polish Civil Aviation Authority) and/or the competent court.', '',
        'Attachments: boarding passes / booking confirmation' + (wyd ? ', receipts' : '') + '.', '', 'Yours faithfully,', wart(o.imie));
    } else {
      L.push(wart(o.imie), wart(o.adres), 'E-mail: ' + wart(o.email) + (o.telefon ? ', tel. ' + o.telefon : ''), '', 'Do: ' + wart(s.linia), 'Data: ' + dataPL(o.dzis), '',
        'WNIOSEK O ODSZKODOWANIE NA PODSTAWIE ROZPORZĄDZENIA (WE) NR 261/2004', '',
        'Numer rezerwacji: ' + wart(o.rezerwacja), 'Numer lotu: ' + wart(s.nrLotu), 'Data lotu: ' + dataPL(s.data), 'Trasa: ' + trasa + ' (odległość po ortodromie: ' + w.km + ' km)', '',
        'Pasażerowie: ' + p.join(', '), '', opisPL(s), '',
        'Na podstawie art. ' + (s.typ === 'odmowa' ? '4 i 7' : s.typ === 'odwolanie' ? '5 i 7' : '7') + ' rozporządzenia (WE) nr 261/2004' + (s.typ === 'opoznienie' ? ' oraz wyroku TSUE w sprawach połączonych C-402/07 i C-432/07 (Sturgeon)' : '') +
        ' wnoszę o wypłatę odszkodowania w kwocie ' + eur(w.kwota) + ' na pasażera, łącznie ' + eur(razem) + ' za ' + n + ' ' + (n === 1 ? 'pasażera' : 'pasażerów') + '.');
      if (wyd) L.push('', 'Wnoszę także o zwrot wydatków na posiłki, nocleg i transport poniesionych z powodu niezapewnienia opieki (art. 9): ' + wyd + ' (paragony w załączeniu).');
      L.push('', 'Proszę o przelew w terminie 30 dni na rachunek: ' + wart(o.iban) + ' (właściciel: ' + wart(o.imie) + ').',
        'W razie nieuwzględnienia wniosku skieruję sprawę do Rzecznika Praw Pasażerów przy Prezesie Urzędu Lotnictwa Cywilnego i/lub do sądu.', '',
        'Załączniki: karty pokładowe / potwierdzenie rezerwacji' + (wyd ? ', paragony' : '') + '.', '', 'Z poważaniem', wart(o.imie));
    }
    return L.join('\n');
  }

  function wniosekRzecznik(s, w, o) {
    o = o || {};
    var p = pasazerowie(o), n = p.length;
    return [wart(o.imie), wart(o.adres), 'E-mail: ' + wart(o.email), '', 'Rzecznik Praw Pasażerów przy Prezesie Urzędu Lotnictwa Cywilnego', 'Data: ' + dataPL(o.dzis), '',
      'WNIOSEK O POZASĄDOWE ROZWIĄZANIE SPORU KONSUMENCKIEGO', '',
      'Przewoźnik: ' + wart(s.linia), 'Numer lotu: ' + wart(s.nrLotu) + ', data: ' + dataPL(s.data) + ', numer rezerwacji: ' + wart(o.rezerwacja), '',
      'Dnia ' + dataPL(o.dataWyslania) + ' złożyłem/złożyłam u przewoźnika reklamację dotyczącą: ' + ZDARZENIE[s.typ] + '. ' +
        (o.odpowiedz === 'odmowa' ? 'Przewoźnik odmówił wypłaty.' : 'Przewoźnik nie odpowiedział w terminie 30 dni.'), '',
      opisPL(s), '',
      'Żądam: odszkodowania ' + eur(w.kwota) + ' na pasażera, łącznie ' + eur(kwotaRazem(w, n)) + ' (pasażerowie: ' + p.join(', ') + ').', '',
      'Załączniki: reklamacja do przewoźnika, ' + (o.odpowiedz === 'odmowa' ? 'odpowiedź przewoźnika, ' : '') + 'karty pokładowe / potwierdzenie rezerwacji.', '', wart(o.imie)].join('\n');
  }

  var API = { wniosek: wniosek, wniosekRzecznik: wniosekRzecznik, pasazerowie: pasazerowie, dataPL: dataPL, czasPL: czasPL };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.WLP = API;
})(this);

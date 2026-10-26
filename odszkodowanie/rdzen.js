// Odszkodowanie za lot — rdzeń obliczeń wg rozporządzenia (WE) nr 261/2004 i orzecznictwa TSUE.
// Bez DOM: działa w przeglądarce (window.WL) i w Node (testy).
(function (root) {
  'use strict';

  // Państwa, w których stosuje się rozporządzenie: UE (z regionami najbardziej oddalonymi), EOG i Szwajcaria
  var UE = ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
    'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'GP', 'MQ', 'GF', 'RE', 'YT', 'MF', 'IS', 'NO', 'LI', 'CH'];
  // Lotniska w państwach UE, ale poza obszarem stosowania prawa UE (północny Cypr)
  var POZA_UE = ['ECN'];
  var NOWE_PRZEPISY = '2027-10-23'; // rozporządzenie (UE) 2026/2202 stosuje się od tego dnia

  function liczba(v) {
    if (typeof v === 'number') return isFinite(v) ? v : 0;
    var n = parseFloat(String(v == null ? '' : v).replace(/\s/g, '').replace(',', '.'));
    return isFinite(n) ? n : 0;
  }

  // Odległość po ortodromie (wzór haversine, promień Ziemi 6371 km) — art. 7 ust. 4
  function odleglosc(a, b) {
    var R = 6371, rad = Math.PI / 180;
    var dLat = (b.lat - a.lat) * rad, dLon = (b.lon - a.lon) * rad;
    var h = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
  }

  function wUE(lotnisko) { return !!lotnisko && POZA_UE.indexOf(lotnisko.iata) < 0 && UE.indexOf(lotnisko.kraj) >= 0; }

  // Czy rozporządzenie obejmuje lot (art. 3 ust. 1): wylot z UE — każda linia; przylot do UE z kraju trzeciego — tylko linia unijna
  function obejmuje(wylot, przylot, liniaUE) {
    if (wUE(wylot)) return { tak: true, powod: 'Wylot z lotniska w UE/EOG/Szwajcarii — rozporządzenie obejmuje każdą linię lotniczą.' };
    if (wUE(przylot) && liniaUE === 'tak') return { tak: true, powod: 'Przylot do UE linią unijną — rozporządzenie ma zastosowanie (o ile nie dostałeś odszkodowania w kraju wylotu).' };
    if (wUE(przylot) && liniaUE === 'nie_wiem') return { tak: null, powod: 'Przylot do UE z kraju spoza UE: prawo należy się tylko wtedy, gdy linia jest unijna (licencja w UE/EOG/Szwajcarii). Sprawdź przewoźnika.' };
    if (wUE(przylot)) return { tak: false, powod: 'Przylot do UE linią spoza UE z kraju spoza UE — rozporządzenie nie obejmuje tego lotu.' };
    return { tak: false, powod: 'Ani wylot, ani przylot nie jest w UE/EOG/Szwajcarii — rozporządzenie nie obejmuje tego lotu.' };
  }

  // Przedział odległości: 1 = do 1500 km, 2 = lot wewnątrz UE ponad 1500 km albo 1500–3500 km, 3 = ponad 3500 km poza UE
  function przedzial(km, wewnatrzUE) {
    if (km <= 1500) return 1;
    if (wewnatrzUE || km <= 3500) return 2;
    return 3;
  }
  var KWOTY = { 1: 250, 2: 400, 3: 600 };
  var PROG_REDUKCJI_MIN = { 1: 120, 2: 180, 3: 240 }; // art. 7 ust. 2: lot zastępczy przyleciał nie później niż 2/3/4 h po planie → 50%
  var PROG_OPIEKI_MIN = { 1: 120, 2: 180, 3: 240 }; // art. 6 ust. 1: opóźnienie wylotu, od którego należą się posiłki i napoje

  // Przyczyny podawane przez linie: czy co do zasady zwalniają linię (okoliczności nadzwyczajne, art. 5 ust. 3 + motyw 14)
  var PRZYCZYNY = {
    nie_podano: { nazwa: 'Linia nie podała przyczyny / nie wiem', nadzw: false, opis: 'To linia musi udowodnić okoliczności nadzwyczajne — bez tego odszkodowanie się należy.' },
    techniczna: { nazwa: 'Usterka techniczna samolotu', nadzw: false, opis: 'Usterka techniczna co do zasady nie zwalnia linii (TSUE C-549/07 Wallentin-Hermann).' },
    strajk_linii: { nazwa: 'Strajk personelu tej linii', nadzw: false, opis: 'Strajk własnych pracowników linii nie jest okolicznością nadzwyczajną (TSUE C-28/20, C-195/17).' },
    zaloga: { nazwa: 'Brak załogi / problemy organizacyjne', nadzw: false, opis: 'Problemy z obsadą i organizacją to ryzyko linii — nie zwalniają z odszkodowania.' },
    poprzedni_lot: { nazwa: 'Opóźnienie poprzedniego lotu tym samolotem', nadzw: null, opis: 'Zależy od przyczyny tamtego opóźnienia: jeśli była to np. usterka — odszkodowanie się należy; jeśli pogoda — linia może się zwolnić (TSUE C-74/19).' },
    pogoda: { nazwa: 'Złe warunki pogodowe', nadzw: true, opis: 'Pogoda uniemożliwiająca lot zwykle jest okolicznością nadzwyczajną — ale linia musi to wykazać, a „pogoda” bywa nadużywana.' },
    kontrola_ruchu: { nazwa: 'Decyzja kontroli ruchu lotniczego / strajk kontrolerów', nadzw: true, opis: 'Ograniczenia kontroli ruchu lotniczego zwykle zwalniają linię (motyw 15).' },
    strajk_lotniska: { nazwa: 'Strajk na lotnisku lub w służbach (nie linii)', nadzw: true, opis: 'Strajk osób spoza linii (lotnisko, kontrola bezpieczeństwa) zwykle jest okolicznością nadzwyczajną.' },
    bezpieczenstwo: { nazwa: 'Zagrożenie bezpieczeństwa / sytuacja polityczna', nadzw: true, opis: 'Zagrożenia bezpieczeństwa i niestabilność polityczna zwykle zwalniają linię.' },
    ptak: { nazwa: 'Zderzenie z ptakiem', nadzw: true, opis: 'Zderzenie z ptakiem jest okolicznością nadzwyczajną (TSUE C-315/15), choć linia musi wykazać, że nie dało się uniknąć opóźnienia.' },
    pasazer: { nazwa: 'Agresywny lub chory pasażer na pokładzie', nadzw: true, opis: 'Nagła choroba lub agresja pasażera zwykle zwalnia linię (TSUE C-74/19), chyba że linia przyczyniła się do zdarzenia.' }
  };

  var CZAS = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::\d{2}(?:\.\d+)?)?$/;
  function chwila(t) { // 'RRRR-MM-DDTHH:MM' (sekundy pomijane) → minuty od epoki albo null
    var m = CZAS.exec(String(t == null ? '' : t)); if (!m) return null;
    var v = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]), d = new Date(v);
    if (d.getUTCMonth() !== +m[2] - 1 || d.getUTCDate() !== +m[3] || +m[4] > 23 || +m[5] > 59) return null;
    return v / 60000;
  }
  function minutyMiedzy(a, b) { // wynik b - a w minutach albo null, gdy któraś godzina pusta lub błędna
    var ta = chwila(a), tb = chwila(b);
    if (ta === null || tb === null) return null;
    return Math.round(tb - ta);
  }

  function dodajMiesiace(data, n) { // 'RRRR-MM-DD' → 'RRRR-MM-DD' (koniec miesiąca przycinany)
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(data || ''));
    if (!m) return '';
    var r = +m[1], mi = +m[2] - 1 + n, d = +m[3];
    r += Math.floor(mi / 12); mi = ((mi % 12) + 12) % 12;
    var ost = new Date(Date.UTC(r, mi + 1, 0)).getUTCDate();
    return r + '-' + ('0' + (mi + 1)).slice(-2) + '-' + ('0' + Math.min(d, ost)).slice(-2);
  }

  // Główna ocena sprawy. s = { wylot, przylot (lotniska {iata,kraj,lat,lon}), liniaUE, typ, ... } — opis pól w testach
  function ocen(s) {
    var w = { nalezy: 'nie', kwota: 0, kwotaPelna: 0, redukcja: false, przedzial: 0, km: 0, wewnatrzUE: false, powody: [], uwagi: [], opieka: [], podstawa: [] };
    if (!s || !s.wylot || !s.przylot) { w.nalezy = 'brak'; w.powody.push('Wybierz lotnisko wylotu i docelowe.'); return w; }
    if (s.wylot.iata === s.przylot.iata) { w.nalezy = 'brak'; w.powody.push('Lotnisko wylotu i docelowe są takie same.'); return w; }
    var kmDokl = odleglosc(s.wylot, s.przylot); // przedział z dokładnej odległości; zaokrąglenie tylko do wyświetlenia
    w.km = Math.round(kmDokl);
    w.wewnatrzUE = wUE(s.wylot) && wUE(s.przylot);
    w.przedzial = przedzial(kmDokl, w.wewnatrzUE);
    w.kwotaPelna = KWOTY[w.przedzial];
    if (Math.abs(kmDokl - 1500) <= 15 || (!w.wewnatrzUE && Math.abs(kmDokl - 3500) <= 35)) w.uwagi.push('Odległość jest blisko progu (1500/3500 km) — linia może liczyć ją nieco inaczej.');

    var ob = obejmuje(s.wylot, s.przylot, s.liniaUE);
    if (ob.tak === false) { w.powody.push(ob.powod); return w; }
    if (ob.tak === null) w.uwagi.push(ob.powod); else w.podstawa.push('art. 3 ust. 1 rozporządzenia (WE) nr 261/2004');
    if (s.przesiadka && s.jednaRezerwacja === 'nie') { w.powody.push('Loty z przesiadką kupione osobno (na różne rezerwacje) liczy się oddzielnie — oceń każdy lot osobno.'); return w; }
    if (s.przesiadka) w.uwagi.push('Przy przesiadce na jednej rezerwacji liczy się odległość od pierwszego lotniska do celu i opóźnienie przylotu do celu (TSUE C-11/11, C-559/16).');

    var progRed = PROG_REDUKCJI_MIN[w.przedzial], kwota = 0, red = false;

    if (s.typ === 'opoznienie') {
      var op = s.opoznienieMin;
      if (op == null || !isFinite(op)) { w.nalezy = 'brak'; w.powody.push('Podaj planowaną i rzeczywistą godzinę przylotu do celu.'); return w; }
      if (op < 180) { w.powody.push('Opóźnienie przylotu do celu wyniosło mniej niż 3 godziny — odszkodowanie się nie należy (TSUE C-402/07 Sturgeon).'); }
      else {
        kwota = w.kwotaPelna;
        if (w.przedzial === 3 && op < 240) { kwota = w.kwotaPelna / 2; red = true; w.uwagi.push('Lot ponad 3500 km z opóźnieniem 3–4 h: odszkodowanie obniżone o 50% (art. 7 ust. 2 lit. c, wyrok Sturgeon).'); }
        w.podstawa.push('art. 7 rozporządzenia w związku z wyrokiem TSUE C-402/07 i C-432/07 (Sturgeon)');
        w.powody.push('Dotarłeś do celu z opóźnieniem ' + godz(op) + ' — to co najmniej 3 godziny.');
      }
      var opW = s.opoznienieWylotuMin != null && isFinite(s.opoznienieWylotuMin) ? s.opoznienieWylotuMin : null;
      if (opW != null && opW >= 300) w.opieka.push('Przy opóźnieniu wylotu co najmniej 5 h możesz zrezygnować z lotu i żądać zwrotu ceny biletu (art. 8 ust. 1 lit. a).');
    } else if (s.typ === 'odwolanie') {
      var dni = s.uprzedzenie; // '14+', '7-13', '<7'
      if (dni === '14+') { w.powody.push('Linia poinformowała o odwołaniu co najmniej 14 dni przed wylotem — odszkodowanie się nie należy (art. 5 ust. 1 lit. c pkt i).'); }
      else if (dni !== '7-13' && dni !== '<7') { w.nalezy = 'brak'; w.powody.push('Zaznacz, kiedy linia poinformowała o odwołaniu.'); return w; }
      else {
        var zw = false;
        if (s.zastepczy === 'tak') {
          var dw = s.zastWylotMin, dp = s.zastPrzylotMin; // zastępczy minus planowy (minuty; ujemne = wcześniej)
          if (dw == null || dp == null || !isFinite(dw) || !isFinite(dp)) { w.nalezy = 'brak'; w.powody.push('Podaj planowane i zastępcze godziny wylotu i przylotu.'); return w; }
          if (dni === '7-13' && dw >= -120 && dp < 240) zw = true;
          if (dni === '<7' && dw >= -60 && dp < 120) zw = true;
          if (zw) w.powody.push('Linia uprzedziła ' + (dni === '7-13' ? '7–13 dni' : 'mniej niż 7 dni') + ' przed wylotem i zaproponowała lot zastępczy w dozwolonych godzinach — odszkodowanie się nie należy (art. 5 ust. 1 lit. c).');
          else {
            kwota = w.kwotaPelna;
            if (dp <= progRed) { kwota = w.kwotaPelna / 2; red = true; w.uwagi.push('Lot zastępczy przyleciał nie później niż ' + godz(progRed) + ' po planie: linia może obniżyć odszkodowanie o 50% (art. 7 ust. 2).'); }
          }
        } else kwota = w.kwotaPelna;
        if (kwota > 0) {
          w.podstawa.push('art. 5 ust. 1 lit. c i art. 7 rozporządzenia (WE) nr 261/2004');
          w.powody.push('Lot odwołano bez wymaganego uprzedzenia' + (s.zastepczy === 'tak' ? ', a lot zastępczy nie mieścił się w dozwolonych godzinach.' : '.'));
        }
      }
      w.opieka.push('Przy odwołaniu możesz wybrać: zwrot ceny biletu albo lot zastępczy (art. 8).');
    } else if (s.typ === 'odmowa') {
      if (s.dobrowolnie === 'tak') { w.powody.push('Dobrowolna rezygnacja z miejsca w zamian za świadczenia uzgodnione z linią — odszkodowanie z art. 7 się nie należy (art. 4 ust. 1).'); }
      else if (s.naCzas === 'nie') { w.powody.push('Jeśli nie stawiłeś się na czas do odprawy albo nie miałeś ważnych dokumentów, linia może odmówić przyjęcia na pokład bez odszkodowania (art. 2 lit. j, art. 3 ust. 2).'); }
      else if (s.naCzas !== 'tak' || (s.dobrowolnie !== 'nie')) { w.nalezy = 'brak'; w.powody.push('Odpowiedz, czy zrezygnowałeś dobrowolnie i czy stawiłeś się na czas z dokumentami.'); return w; }
      else {
        kwota = w.kwotaPelna;
        var pz = s.zastPrzylotMin;
        if (pz != null && isFinite(pz) && pz <= progRed) { kwota = w.kwotaPelna / 2; red = true; w.uwagi.push('Lot zastępczy przyleciał nie później niż ' + godz(progRed) + ' po planie: linia może obniżyć odszkodowanie o 50% (art. 7 ust. 2).'); }
        w.podstawa.push('art. 4 ust. 3 i art. 7 rozporządzenia (WE) nr 261/2004');
        w.powody.push('Odmówiono ci przyjęcia na pokład wbrew twojej woli (np. nadkomplet) — przysługuje odszkodowanie.');
      }
      w.opieka.push('Przy odmowie przyjęcia na pokład należy ci się wybór: zwrot ceny biletu albo lot zastępczy, oraz opieka (art. 4 ust. 3, art. 8, art. 9).');
    } else { w.nalezy = 'brak'; w.powody.push('Wybierz, co się stało z lotem.'); return w; }

    if (kwota > 0) {
      var pr = PRZYCZYNY[s.przyczyna] || PRZYCZYNY.nie_podano;
      if (s.typ === 'odmowa') w.nalezy = 'tak'; // nadkomplet: okoliczności nadzwyczajne nie dotyczą
      else if (pr.nadzw === true) { w.nalezy = 'raczej_nie'; w.uwagi.push(pr.opis); }
      else if (pr.nadzw === null) { w.nalezy = 'zalezy'; w.uwagi.push(pr.opis); }
      else { w.nalezy = 'tak'; if (s.przyczyna && s.przyczyna !== 'nie_podano') w.uwagi.push(pr.opis); }
      if (ob.tak === null && w.nalezy === 'tak') w.nalezy = 'zalezy';
      w.kwota = kwota; w.redukcja = red;
    }

    // Prawo do opieki (art. 9) — niezależnie od odszkodowania
    if (s.typ === 'opoznienie' && s.opoznienieWylotuMin != null && isFinite(s.opoznienieWylotuMin) && s.opoznienieWylotuMin >= PROG_OPIEKI_MIN[w.przedzial])
      w.opieka.push('Opóźnienie wylotu co najmniej ' + godz(PROG_OPIEKI_MIN[w.przedzial]) + ': należały ci się posiłki i napoje, a przy nocowaniu hotel z transportem (art. 6 i 9). Wydatki z paragonami możesz odzyskać.');
    if (s.typ !== 'opoznienie') w.opieka.push('Podczas czekania należały ci się posiłki i napoje, a przy nocowaniu hotel z transportem (art. 9). Wydatki z paragonami możesz odzyskać.');

    // Terminy
    if (s.data) {
      if (s.data >= NOWE_PRZEPISY) w.uwagi.push('Lot od 23.10.2027: obowiązują zmienione przepisy (rozporządzenie (UE) 2026/2202) — wniosek trzeba złożyć w ciągu 9 miesięcy od wylotu.');
      var nowe = s.data >= NOWE_PRZEPISY, granica = dodajMiesiace(s.data, nowe ? 9 : 12);
      w.terminDo = granica;
      if (s.dzis && granica && s.dzis > granica) w.uwagi.push(nowe ? 'Minęło 9 miesięcy od wylotu — po nowych przepisach linia może odrzucić spóźniony wniosek.' :
        'Minął rok od lotu — w Polsce roszczenie się przedawnia po roku (uchwała SN III CZP 111/16). Linia może odmówić wypłaty.');
    }
    return w;
  }

  function godz(min) {
    var m = Math.max(0, Math.round(min)), h = Math.floor(m / 60), r = m % 60;
    return h + ' h' + (r ? ' ' + r + ' min' : '');
  }

  // Kontrola numeru konta IBAN (ISO 13616, mod 97)
  function ibanOk(iban) {
    var s = String(iban || '').replace(/\s/g, '').toUpperCase();
    if (/^\d{26}$/.test(s)) s = 'PL' + s;
    if (!/^[A-Z]{2}\d{2}[A-Z0-9]{10,30}$/.test(s)) return false;
    if (s.slice(0, 2) === 'PL' && s.length !== 28) return false;
    var r = s.slice(4) + s.slice(0, 4), reszta = 0;
    for (var i = 0; i < r.length; i++) {
      var c = r.charCodeAt(i), v = c >= 65 ? String(c - 55) : r[i];
      for (var j = 0; j < v.length; j++) reszta = (reszta * 10 + (v.charCodeAt(j) - 48)) % 97;
    }
    return reszta === 1;
  }

  function normalizuj(t) {
    return String(t || '').toLowerCase().replace(/ł/g, 'l').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  var API = { UE: UE, KWOTY: KWOTY, PRZYCZYNY: PRZYCZYNY, PROG_REDUKCJI_MIN: PROG_REDUKCJI_MIN, NOWE_PRZEPISY: NOWE_PRZEPISY,
    liczba: liczba, odleglosc: odleglosc, wUE: wUE, obejmuje: obejmuje, przedzial: przedzial, minutyMiedzy: minutyMiedzy,
    dodajMiesiace: dodajMiesiace, ocen: ocen, godz: godz, ibanOk: ibanOk, normalizuj: normalizuj };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.WL = API;
})(this);

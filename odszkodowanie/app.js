// Odszkodowanie za lot — interfejs. Dane zostają w localStorage tego urządzenia.
(function () {
  'use strict';
  var KLUCZ = 'odszkodowanieLotu1';
  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return [].slice.call(document.querySelectorAll(s)); };

  // ---------- dane lotnisk ----------
  var LOTN = {};
  WL_LOTNISKA.forEach(function (a) { LOTN[a[0]] = { iata: a[0], nazwa: a[1], miasto: a[2], kraj: a[3], lat: a[4], lon: a[5], szuk: WL.normalizuj(a[0] + ' ' + a[1] + ' ' + a[2]) }; });
  // Polskie nazwy popularnych miast i wysp → lotniska
  var ALIASY = {
    'warszawa': ['WAW', 'WMI', 'RDO'], 'krakow': ['KRK'], 'rzeszow': ['RZE'], 'olsztyn': ['SZY'], 'zielona gora': ['IEG'], 'szczecin': ['SZZ'], 'lodz': ['LCJ'],
    'londyn': ['LHR', 'LGW', 'STN', 'LTN', 'LCY', 'SEN'], 'rzym': ['FCO', 'CIA'], 'mediolan': ['MXP', 'LIN', 'BGY'], 'paryz': ['CDG', 'ORY', 'BVA'],
    'teneryfa': ['TFS', 'TFN'], 'majorka': ['PMI'], 'kreta': ['HER', 'CHQ'], 'rodos': ['RHO'], 'korfu': ['CFU'], 'ateny': ['ATH'], 'saloniki': ['SKG'],
    'madryt': ['MAD'], 'lizbona': ['LIS'], 'walencja': ['VLC'], 'neapol': ['NAP'], 'wenecja': ['VCE', 'TSF'], 'bolonia': ['BLQ'], 'piza': ['PSA'],
    'florencja': ['FLR'], 'katania': ['CTA'], 'edynburg': ['EDI'], 'bruksela': ['BRU', 'CRL'], 'monachium': ['MUC'], 'kolonia': ['CGN'],
    'wieden': ['VIE'], 'praga': ['PRG'], 'budapeszt': ['BUD'], 'kopenhaga': ['CPH'], 'sztokholm': ['ARN', 'NYO'], 'wilno': ['VNO'], 'ryga': ['RIX'],
    'tallin': ['TLL'], 'stambul': ['IST', 'SAW'], 'szarm el-szejk': ['SSH'], 'monastyr': ['MIR'], 'dzerba': ['DJE'], 'dubaj': ['DXB', 'DWC'],
    'nowy jork': ['JFK', 'EWR'], 'tel awiw': ['TLV'], 'wyspy kanaryjskie': ['TFS', 'LPA', 'ACE', 'FUE'], 'madera': ['FNC'], 'cypr': ['LCA', 'PFO'],
    'malta': ['MLA'], 'dubrownik': ['DBV'], 'warna': ['VAR'], 'bukareszt': ['OTP'], 'reykjavik': ['KEF'], 'zakynthos': ['ZTH'], 'kefalonia': ['EFL']
  };
  function szukaj(q) {
    var n = WL.normalizuj(q).trim(); if (n.length < 2) return [];
    var wyn = [], dodaj = function (k) { if (LOTN[k] && wyn.indexOf(k) < 0) wyn.push(k); };
    if (n.length === 3) dodaj(n.toUpperCase());
    Object.keys(ALIASY).forEach(function (a) { if (a.indexOf(n) === 0) ALIASY[a].forEach(dodaj); });
    var kl = Object.keys(LOTN);
    kl.forEach(function (k) { if (wyn.length < 8 && WL.normalizuj(LOTN[k].miasto).indexOf(n) === 0) dodaj(k); });
    kl.forEach(function (k) { if (wyn.length < 8 && LOTN[k].szuk.indexOf(n) >= 0) dodaj(k); });
    return wyn.slice(0, 8);
  }
  function opisLotn(k) { var a = LOTN[k]; return a.iata + ' — ' + a.nazwa + (a.miasto ? ', ' + a.miasto : '') + ' (' + WL_KRAJE[a.kraj] + ')'; } // k zawsze z LOTN

  // ---------- stan ----------
  function nowaSprawa() {
    return { wylot: '', przylot: '', przesiadka: false, przes: '', jednaRezerwacja: 'tak', data: '', nrLotu: '', linia: '', liniaUE: 'nie_wiem', typ: '',
      planWylot: '', rzeczWylot: '', planPrzylot: '', rzeczPrzylot: '', uprzedzenie: '', zastepczy: 'nie', zastWylot: '', zastPrzylot: '',
      dobrowolnie: 'nie', naCzas: 'tak', przyczyna: 'nie_podano' };
  }
  function nowyStan() { return { v: 1, sprawa: nowaSprawa(), osoba: { imie: '', adres: '', email: '', telefon: '', iban: '', pasazerowie: '', rezerwacja: '', wydatki: '' }, jezyk: 'pl', sprawy: [] }; }
  var S;
  function wczytaj() {
    var obiekt = function (x) { return !!x && typeof x === 'object' && !Array.isArray(x); };
    try { S = JSON.parse(localStorage.getItem(KLUCZ)); } catch (e) { S = null; }
    var n = nowyStan();
    if (!obiekt(S)) S = n; // uszkodzony zapis (np. tekst, tablica) → czysty start
    Object.keys(n).forEach(function (k) { if (S[k] === undefined || S[k] === null) S[k] = n[k]; });
    if (!obiekt(S.sprawa)) S.sprawa = n.sprawa;
    if (!obiekt(S.osoba)) S.osoba = n.osoba;
    Object.keys(n.sprawa).forEach(function (k) { if (S.sprawa[k] === undefined) S.sprawa[k] = n.sprawa[k]; });
    Object.keys(n.osoba).forEach(function (k) { if (S.osoba[k] === undefined) S.osoba[k] = n.osoba[k]; });
    S.sprawy = (Array.isArray(S.sprawy) ? S.sprawy : []).filter(function (z) { return obiekt(z) && obiekt(z.sprawa) && obiekt(z.osoba); });
  }
  function zapisz() { try { localStorage.setItem(KLUCZ, JSON.stringify(S)); } catch (e) { toast('Nie udało się zapisać — brak miejsca w pamięci przeglądarki.'); } }
  function dzis() { var d = new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function id() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function toast(t) { var e = document.createElement('div'); e.className = 'toast'; e.textContent = t; document.body.appendChild(e); setTimeout(function () { e.remove(); }, 2200); }

  // ---------- licencja (wersja dla kupujących): wniosek generuje serwer MasterSSon, nie przeglądarka ----------
  // WL_API = adres generatora; WL_API_PLIK = plik z adresem (np. api.json — adres tunelu zmienia się po restarcie serwera)
  var API = window.WL_API ? String(window.WL_API).replace(/\/+$/, '') : '', PLIK_API = window.WL_API_PLIK || '', LICT = !!(API || PLIK_API), LKL = 'odszkodowanieLicencja', adresP = null;
  function adres() {
    if (API) return Promise.resolve(API);
    if (!adresP) adresP = fetch(PLIK_API, { cache: 'no-store' }).then(function (r) { return r.json(); }).then(function (j) { API = String(j.api || '').replace(/\/+$/, ''); if (!API) throw new Error('brak adresu'); return API; })
      .catch(function (e) { adresP = null; throw e; });
    return adresP;
  }
  var LIC = { klucz: '', wyniki: {}, wToku: {}, ostatni: {}, ok: false, stan: '', czas: {} };
  try { LIC.klucz = localStorage.getItem(LKL) || ''; } catch (e) {}
  var KOMUNIKAT = { brak: 'Wpisz klucz licencji z instrukcji w paczce — wtedy przygotuję wniosek.', zly: 'Klucz licencji nieprawidłowy — przepisz go dokładnie z instrukcji (np. MSS-ABCD-EFGH-JKLM).',
    format: 'Klucz ma postać MSS-XXXX-XXXX-XXXX — przepisz go w całości z instrukcji.', limit: 'Za dużo prób z błędnym kluczem — spróbuj za 10 minut.', siec: 'Brak połączenia z serwerem — wniosek przygotowuje się online. Sprawdź internet i spróbuj ponownie.', czeka: 'Przygotowuję wniosek…' };
  function zdalnie(rodzaj, wej, o, jezyk) { // zwraca gotowy tekst z pamięci albo komunikat; wynik dociąga w tle
    LIC.ok = false;
    if (!LIC.klucz) { LIC.stan = 'brak'; return KOMUNIKAT.brak; }
    if (!/^MSS(-[A-Z0-9]{4}){3}$/.test(LIC.klucz)) { LIC.stan = 'format'; return KOMUNIKAT.format; } // niepełny klucz: bez zapytania do serwera
    var cialo = JSON.stringify({ klucz: LIC.klucz, rodzaj: rodzaj, s: wej, o: o, jezyk: jezyk }), r = LIC.wyniki[cialo];
    if (r && r.do && r.do < Date.now()) { delete LIC.wyniki[cialo]; r = null; } // błąd sieci/limit: ponowna próba po 15 s, przy następnej akcji
    if (r) { LIC.stan = r.stan; LIC.ok = r.stan === 'ok'; if (LIC.ok) LIC.ostatni[rodzaj] = r.tekst; return LIC.ok ? r.tekst : KOMUNIKAT[r.stan]; }
    if (!LIC.wToku[cialo]) {
      var pobierz = function () {
        LIC.wToku[cialo] = true;
        adres().then(function (u) { return fetch(u + '/wniosek', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: cialo }); }).then(function (x) {
          return x.json().catch(function () { return {}; }).then(function (j) {
            if (x.ok && j.ok && typeof j.tekst === 'string') LIC.wyniki[cialo] = { stan: 'ok', tekst: j.tekst };
            else if (x.status === 403) LIC.wyniki[cialo] = { stan: 'zly' };
            else LIC.wyniki[cialo] = { stan: x.status === 429 ? 'limit' : 'siec', do: Date.now() + 15000 };
          });
        }).catch(function () { LIC.wyniki[cialo] = { stan: 'siec', do: Date.now() + 15000 }; if (PLIK_API) { API = ''; adresP = null; } }) // błąd: tunel mógł dostać nowy adres
          .then(function () { delete LIC.wToku[cialo]; odswiezLicencje(); });
      };
      if (rodzaj === 'linia') { clearTimeout(LIC.czas.linia); LIC.czas.linia = setTimeout(pobierz, 350); } // 350 ms przerwy w pisaniu = jedno zapytanie
      else pobierz();
    }
    return (rodzaj === 'linia' && LIC.ostatni.linia) || KOMUNIKAT.czeka;
  }
  function odswiezLicencje() {
    if (widok() === 'wniosek') { odswiezTekst(); var e = $('#licStan'); if (e) e.textContent = opisLicencji(); }
    else if (widok() === 'sprawy') pokaz();
  }
  function opisLicencji() { return LIC.stan === 'ok' ? '✓ Klucz przyjęty' : LIC.stan && KOMUNIKAT[LIC.stan] && LIC.stan !== 'czeka' ? KOMUNIKAT[LIC.stan] : ''; }
  function poleLicencji() {
    return '<div class="k nie-drukuj"><h2>Klucz licencji</h2><input id="licKlucz" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="MSS-XXXX-XXXX-XXXX" value="' + esc(LIC.klucz) + '">' +
      '<div class="info" id="licStan">' + esc(opisLicencji()) + '</div><p class="info">Klucz jest w pliku INSTRUKCJA.txt w paczce kupionej na naffy. Nie masz go? Napisz do sklepu MasterSSon na naffy i podaj numer zamówienia.</p></div>';
  }

  // Sprawa z formularza → dane wejściowe rdzenia
  function wejscie(sp) {
    var lot = function (k) { var a = LOTN[k]; return a ? { iata: a.iata, kraj: a.kraj, lat: a.lat, lon: a.lon, miasto: a.miasto } : null; };
    return { wylot: lot(sp.wylot), przylot: lot(sp.przylot), przes: sp.przesiadka ? lot(sp.przes) : null, przesiadka: !!sp.przesiadka, jednaRezerwacja: sp.jednaRezerwacja,
      liniaUE: sp.liniaUE, typ: sp.typ, data: sp.data, nrLotu: sp.nrLotu, linia: sp.linia, przyczyna: sp.przyczyna, uprzedzenie: sp.uprzedzenie, zastepczy: sp.zastepczy,
      dobrowolnie: sp.dobrowolnie, naCzas: sp.naCzas, planWylot: sp.planWylot, planPrzylot: sp.planPrzylot, rzeczPrzylot: sp.rzeczPrzylot, zastWylot: sp.zastWylot, zastPrzylot: sp.zastPrzylot,
      opoznienieMin: WL.minutyMiedzy(sp.planPrzylot, sp.rzeczPrzylot), opoznienieWylotuMin: WL.minutyMiedzy(sp.planWylot, sp.rzeczWylot),
      zastWylotMin: WL.minutyMiedzy(sp.planWylot, sp.zastWylot), zastPrzylotMin: WL.minutyMiedzy(sp.planPrzylot, sp.zastPrzylot), dzis: dzis() };
  }

  // ---------- pola formularza ----------
  function pole(et, sciezka, wart, typ, extra) {
    return '<label>' + et + '</label><input data-p="' + sciezka + '" value="' + esc(wart) + '"' + (typ ? ' type="' + typ + '"' : '') + (extra || '') + '>';
  }
  function wybory(sciezka, wart, opcje) {
    return '<div class="wybory">' + opcje.map(function (o) {
      return '<label class="' + (wart === o[0] ? 'on' : '') + '"><input type="radio" name="' + sciezka + '" data-p="' + sciezka + '" value="' + o[0] + '"' + (wart === o[0] ? ' checked' : '') + '>' + esc(o[1]) + '</label>';
    }).join('') + '</div>';
  }
  function wyborLotn(et, klucz) {
    var k = S.sprawa[klucz];
    return '<label>' + et + '</label><div class="podp"><input data-lot="' + klucz + '" autocomplete="off" placeholder="Miasto, lotnisko lub kod, np. Kraków, KRK" value="' + esc(k ? k + ' — ' + (LOTN[k] ? LOTN[k].miasto || LOTN[k].nazwa : '') : '') + '">' +
      '<ul class="lista ukryj" data-lista="' + klucz + '"></ul></div>' + (k && LOTN[k] ? '<div class="wybrane">✓ ' + esc(opisLotn(k)) + '</div>' : '');
  }

  // ---------- widok: kalkulator ----------
  function widokKalkulator() {
    var sp = S.sprawa, wej = wejscie(sp), h = '';
    h += '<div class="k"><h2>1. Trasa</h2>' + wyborLotn('Skąd leciałeś', 'wylot') + wyborLotn('Dokąd (cel podróży)', 'przylot') +
      '<label class="chk"><input type="checkbox" data-p="przesiadka"' + (sp.przesiadka ? ' checked' : '') + '> Lot z przesiadką</label>' +
      (sp.przesiadka ? wyborLotn('Lotnisko przesiadki', 'przes') + '<label>Oba loty na jednej rezerwacji?</label>' + wybory('jednaRezerwacja', sp.jednaRezerwacja, [['tak', 'Tak, jedna rezerwacja'], ['nie', 'Nie, kupione osobno']]) : '') + '</div>';
    var pytajLinie = wej.wylot && wej.przylot && !WL.wUE(wej.wylot) && WL.wUE(wej.przylot);
    h += '<div class="k"><h2>2. Lot</h2><div class="r2"><div>' + pole('Data lotu', 'data', sp.data, 'date') + '</div><div>' + pole('Numer lotu', 'nrLotu', sp.nrLotu, '', ' placeholder="np. FR1234"') + '</div></div>' +
      pole('Linia lotnicza', 'linia', sp.linia, '', ' placeholder="np. Ryanair"') +
      (pytajLinie ? '<label>Czy linia jest z UE, Norwegii, Islandii lub Szwajcarii?</label>' + wybory('liniaUE', sp.liniaUE, [['tak', 'Tak'], ['nie', 'Nie'], ['nie_wiem', 'Nie wiem']]) +
        '<p class="info">Przy locie do UE spoza UE prawo do odszkodowania masz tylko z linią unijną (np. LOT, Ryanair, Wizz Air, Lufthansa — tak; Turkish, Emirates — nie).</p>' : '') + '</div>';
    h += '<div class="k"><h2>3. Co się stało?</h2>' + wybory('typ', sp.typ, [['opoznienie', 'Opóźnienie'], ['odwolanie', 'Odwołanie'], ['odmowa', 'Nie wpuścili na pokład']]);
    if (sp.typ === 'opoznienie') {
      h += '<div class="r2"><div>' + pole('Planowy przylot do celu', 'planPrzylot', sp.planPrzylot, 'datetime-local') + '</div><div>' + pole('Rzeczywisty przylot do celu', 'rzeczPrzylot', sp.rzeczPrzylot, 'datetime-local') + '</div></div>' +
        '<p class="info">Liczy się moment otwarcia drzwi samolotu na lotnisku docelowym (TSUE C-452/13). Godziny lokalne lotniska docelowego.</p>' +
        '<div class="r2"><div>' + pole('Planowy wylot (opcjonalnie)', 'planWylot', sp.planWylot, 'datetime-local') + '</div><div>' + pole('Rzeczywisty wylot (opcjonalnie)', 'rzeczWylot', sp.rzeczWylot, 'datetime-local') + '</div></div>';
    } else if (sp.typ === 'odwolanie') {
      h += '<label>Kiedy linia poinformowała o odwołaniu?</label>' + wybory('uprzedzenie', sp.uprzedzenie, [['14+', '14 dni lub wcześniej'], ['7-13', '7–13 dni przed'], ['<7', 'Mniej niż 7 dni przed']]) +
        '<label>Czy zaproponowano lot zastępczy?</label>' + wybory('zastepczy', sp.zastepczy, [['tak', 'Tak'], ['nie', 'Nie']]);
      if (sp.zastepczy === 'tak') h += '<div class="r2"><div>' + pole('Planowy wylot', 'planWylot', sp.planWylot, 'datetime-local') + '</div><div>' + pole('Wylot zastępczy', 'zastWylot', sp.zastWylot, 'datetime-local') + '</div></div>' +
        '<div class="r2"><div>' + pole('Planowy przylot', 'planPrzylot', sp.planPrzylot, 'datetime-local') + '</div><div>' + pole('Przylot zastępczy', 'zastPrzylot', sp.zastPrzylot, 'datetime-local') + '</div></div>';
    } else if (sp.typ === 'odmowa') {
      h += '<label>Czy zgodziłeś się oddać miejsce w zamian za świadczenia (bon, pieniądze)?</label>' + wybory('dobrowolnie', sp.dobrowolnie, [['nie', 'Nie, odmówili wbrew mojej woli'], ['tak', 'Tak, dobrowolnie']]) +
        '<label>Czy byłeś na czas na odprawie z ważnymi dokumentami?</label>' + wybory('naCzas', sp.naCzas, [['tak', 'Tak'], ['nie', 'Nie']]) +
        '<div class="r2"><div>' + pole('Planowy przylot (opcjonalnie)', 'planPrzylot', sp.planPrzylot, 'datetime-local') + '</div><div>' + pole('Faktyczny przylot innym lotem (opcjonalnie)', 'zastPrzylot', sp.zastPrzylot, 'datetime-local') + '</div></div>';
    }
    h += '</div>';
    if (sp.typ && sp.typ !== 'odmowa') h += '<div class="k"><h2>4. Jaką przyczynę podała linia?</h2><select data-p="przyczyna">' + Object.keys(WL.PRZYCZYNY).map(function (k) {
      return '<option value="' + k + '"' + (sp.przyczyna === k ? ' selected' : '') + '>' + esc(WL.PRZYCZYNY[k].nazwa) + '</option>'; }).join('') + '</select></div>';
    h += '<div id="wynik">' + kartaWyniku() + '</div>';
    h += '<button class="btn ma szer" id="nowa">Wyczyść i sprawdź inny lot</button>';
    return h;
  }

  function kartaWyniku() {
    var wej = wejscie(S.sprawa), w = WL.ocen(wej), n = WLP.pasazerowie(S.osoba).length;
    var tytul = { tak: 'Należy ci się odszkodowanie', zalezy: 'Odszkodowanie możliwe — zależy od szczegółów', raczej_nie: 'Raczej się nie należy', nie: 'Odszkodowanie się nie należy', brak: 'Uzupełnij dane' }[w.nalezy];
    var h = '<div class="k wynik ' + w.nalezy + '" data-wynik="' + w.nalezy + '"><h2>' + tytul + '</h2>';
    if (w.kwota > 0) h += '<div class="kw" data-kwota="' + w.kwota + '">' + w.kwota + ' EUR' + (n > 1 ? ' × ' + n + ' = ' + (w.kwota * n) + ' EUR' : '') + '</div>' +
      '<div class="info">na pasażera' + (w.redukcja ? ' (po obniżeniu o 50%; pełna kwota ' + w.kwotaPelna + ' EUR)' : '') + ' · odległość ' + w.km + ' km</div>';
    else if (w.km) h += '<div class="info">Odległość ' + w.km + ' km → w tym przedziale ' + w.kwotaPelna + ' EUR na pasażera</div>';
    var lista = function (t, l) { return l.length ? '<b>' + t + '</b><ul>' + l.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' : ''; };
    h += lista('Dlaczego', w.powody) + lista('Ważne', w.uwagi) + lista('Twoje inne prawa', w.opieka);
    if (w.terminDo) h += '<p class="info">Wniosek złóż najlepiej od razu — termin: do ' + WLP.dataPL(w.terminDo) + '.</p>';
    if (w.kwota > 0) h += '<a class="btn szer" href="#wniosek">Przygotuj wniosek do linii →</a>';
    return h + '</div>';
  }

  // ---------- widok: wniosek ----------
  function widokWniosek() {
    var wej = wejscie(S.sprawa), w = WL.ocen(wej), o = S.osoba;
    if (!(w.kwota > 0)) return '<div class="k"><h2>Najpierw sprawdź lot</h2><p>Wniosek przygotujesz, gdy kalkulator pokaże kwotę odszkodowania.</p><a class="btn" href="#kalkulator">Sprawdź lot</a></div>';
    if (window.WL_PUBLICZNA) return '<div class="k" id="pelna"><h2>Należy ci się ' + w.kwota + ' EUR na pasażera</h2><p>W pełnej wersji aplikacja przygotuje gotowy wniosek do linii (po polsku albo angielsku, z podstawą prawną), ' +
      'wniosek do Rzecznika Praw Pasażerów, gdy linia nie odpowie, i przypilnuje terminów. Płacisz raz, bez prowizji: 100% odszkodowania trafia prosto od linii na Twoje konto.</p>' +
      '<a class="btn szer" href="https://www.naffy.io/mastersson/odszkodowanie-za-lot-kalkulator-ue-261-i-gotowy-wniosek-do-linii-250600-aplikacja-teq" target="_blank" rel="noopener">Kup pełną wersję — 69 zł</a>' +
      '<p class="info">Możesz też napisać wniosek sam: zobacz zakładkę „Zasady” — krok po kroku, co i gdzie wysłać.</p><a class="btn" href="#info">Krok po kroku</a></div>'; // publiczny kalkulator: wniosek tylko w pełnej wersji
    var ibanZly = o.iban && !WL.ibanOk(o.iban);
    var h = (LICT ? poleLicencji() : '') + '<div class="k nie-drukuj"><h2>Twoje dane do wniosku</h2>' + polO('Imię i nazwisko', 'imie', o.imie) + polO('Adres', 'adres', o.adres) +
      '<div class="r2"><div>' + polO('E-mail', 'email', o.email, 'email') + '</div><div>' + polO('Telefon (opcjonalnie)', 'telefon', o.telefon, 'tel') + '</div></div>' +
      polO('Numer rezerwacji', 'rezerwacja', o.rezerwacja) + polO('Numer konta (IBAN)', 'iban', o.iban) + '<div class="blad" id="ibanBlad">' + (ibanZly ? 'Sprawdź numer konta — suma kontrolna się nie zgadza.' : '') + '</div>' +
      '<label>Wszyscy pasażerowie z biletem (jeden w linii; puste = tylko ty)</label><textarea data-o="pasazerowie">' + esc(o.pasazerowie) + '</textarea>' +
      polO('Wydatki na posiłki, hotel, transport (zł, opcjonalnie)', 'wydatki', o.wydatki, '', ' inputmode="decimal"') +
      '<label>Język wniosku</label>' + wybory('jezyk', S.jezyk, [['pl', 'Polski (linie z Polski)'], ['en', 'Angielski (linie zagraniczne)']]) + '</div>';
    h += '<div class="k"><h2 class="nie-drukuj">Wniosek</h2><pre id="tekst">' + esc(tekstWniosku()) + '</pre><div class="pasek nie-drukuj">' +
      '<button class="btn" id="kopiuj">Kopiuj tekst</button><button class="btn ma" id="drukuj">Drukuj / PDF</button><button class="btn ma" id="pobierz">Pobierz .txt</button><button class="btn ma" id="zapiszSprawe">Zapisz w „Moje sprawy”</button></div>' +
      '<p class="info nie-drukuj">Wyślij wniosek przez formularz reklamacji na stronie linii (wklej tekst) albo e-mailem. Dołącz kartę pokładową lub potwierdzenie rezerwacji. Linia ma zwykle 30 dni na odpowiedź.</p></div>';
    return h;
  }
  function polO(et, k, wart, typ, extra) { return '<label>' + et + '</label><input data-o="' + k + '" value="' + esc(wart) + '"' + (typ ? ' type="' + typ + '"' : '') + (extra || '') + '>'; }
  function tekstWniosku() {
    var wej = wejscie(S.sprawa), w = WL.ocen(wej), o = {};
    Object.keys(S.osoba).forEach(function (k) { o[k] = S.osoba[k]; }); o.dzis = dzis();
    return LICT ? zdalnie('linia', wej, o, S.jezyk) : WLP.wniosek(wej, w, o, S.jezyk);
  }

  // ---------- widok: moje sprawy ----------
  function widokSprawy() {
    if (!S.sprawy.length) return '<div class="k"><h2>Moje sprawy</h2><p class="info">Nie masz jeszcze zapisanych spraw. Po przygotowaniu wniosku kliknij „Zapisz w Moje sprawy”, a tu przypilnujesz terminów.</p></div>';
    var h = '<div class="k"><h2>Moje sprawy</h2>';
    S.sprawy.forEach(function (z, i) {
      var dni = z.dataWyslania ? Math.floor((Date.parse(dzis()) - Date.parse(z.dataWyslania)) / 86400000) : null;
      var doRzecznika = z.odpowiedz === 'odmowa' || (z.status === 'wyslany' && dni !== null && dni >= 30 && z.odpowiedz !== 'wyplata');
      h += '<div class="sprawa" data-sprawa="' + i + '"><b>' + esc(z.tytul) + '</b><div class="info">' + esc(z.kwotaOpis) + ' · zapisano ' + WLP.dataPL(z.zapisano) + '</div>' +
        '<div class="r2"><div><label>Status</label><select data-s="' + i + '.status">' + [['przygotowany', 'Przygotowany'], ['wyslany', 'Wysłany do linii'], ['zamkniety', 'Zamknięty']].map(function (o) {
          return '<option value="' + o[0] + '"' + (z.status === o[0] ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') + '</select></div>' +
        '<div><label>Data wysłania</label><input type="date" data-s="' + i + '.dataWyslania" value="' + esc(z.dataWyslania) + '"></div></div>' +
        '<label>Odpowiedź linii</label><select data-s="' + i + '.odpowiedz">' + [['brak', 'Brak odpowiedzi'], ['odmowa', 'Odmowa'], ['wyplata', 'Wypłacono']].map(function (o) {
          return '<option value="' + o[0] + '"' + (z.odpowiedz === o[0] ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') + '</select>' +
        (z.status === 'wyslany' && dni !== null && dni < 30 && z.odpowiedz === 'brak' ? '<p class="info">Linia ma czas na odpowiedź jeszcze ' + (30 - dni) + ' dni.</p>' : '') +
        (doRzecznika ? '<p class="info">Możesz złożyć bezpłatny wniosek do Rzecznika Praw Pasażerów przy ULC (pasazerlotniczy.ulc.gov.pl).</p>' : '') +
        '<div class="pasek"><button class="btn ma" data-otworz="' + i + '">Otwórz</button>' + (doRzecznika ? '<button class="btn ma" data-rzecznik="' + i + '">Wniosek do Rzecznika</button>' : '') +
        '<button class="btn ma" data-usun="' + i + '">Usuń</button></div><pre class="' + (z.pokazRzecznik ? '' : 'ukryj') + '" data-tr="' + i + '">' + (z.pokazRzecznik ? esc(tekstRzecznika(z)) : '') + '</pre></div>';
    });
    return h + '</div>';
  }
  function tekstRzecznika(z) {
    var wej = wejscie(z.sprawa), w = WL.ocen(wej), o = {};
    Object.keys(z.osoba).forEach(function (k) { o[k] = z.osoba[k]; }); o.dzis = dzis(); o.dataWyslania = z.dataWyslania; o.odpowiedz = z.odpowiedz;
    return LICT ? zdalnie('rzecznik', wej, o) : WLP.wniosekRzecznik(wej, w, o);
  }

  // ---------- widok: zasady ----------
  function widokInfo() {
    return '<div class="k"><h2>Kiedy należy się odszkodowanie</h2><ul>' +
      '<li><b>250 EUR</b> — loty do 1500 km; <b>400 EUR</b> — loty w UE ponad 1500 km i inne 1500–3500 km; <b>600 EUR</b> — ponad 3500 km (art. 7).</li>' +
      '<li><b>Opóźnienie</b> przylotu do celu o co najmniej 3 godziny (wyrok TSUE Sturgeon).</li>' +
      '<li><b>Odwołanie</b> lotu, o którym dowiedziałeś się mniej niż 14 dni przed wylotem (chyba że lot zastępczy mieścił się w dozwolonych godzinach).</li>' +
      '<li><b>Odmowa przyjęcia na pokład</b> wbrew twojej woli (np. nadkomplet).</li>' +
      '<li>Linia nie płaci, jeśli udowodni <b>okoliczności nadzwyczajne</b> (np. pogoda, decyzje kontroli ruchu). Usterka techniczna i strajk jej pracowników nie zwalniają linii.</li>' +
      '<li>Lot z UE — każda linia. Lot do UE spoza UE — tylko linia unijna.</li>' +
      '<li>W Polsce roszczenie przedawnia się po roku od lotu (uchwała SN III CZP 111/16).</li></ul></div>' +
      '<div class="k"><h2>Krok po kroku</h2><ol><li>Sprawdź lot w kalkulatorze.</li><li>Wyślij wniosek do linii (formularz na jej stronie albo e-mail).</li>' +
      '<li>Brak odpowiedzi po 30 dniach albo odmowa — bezpłatny wniosek do Rzecznika Praw Pasażerów przy ULC.</li><li>Ostatecznie — sąd (pozew w postępowaniu uproszczonym).</li></ol></div>' +
      '<div class="k"><h2>Zmiany od 23.10.2027</h2><p>Rozporządzenie (UE) 2026/2202 zachowuje próg 3 godzin i kwoty 250/400/600 EUR, ale dla lotów od 23.10.2027 wniosek trzeba złożyć w ciągu 9 miesięcy od wylotu.</p></div>' +
      '<div class="k"><h2>Prywatność i zastrzeżenia</h2><p class="info">' + (LICT ? 'Dane zapisują się tylko w tym urządzeniu. Gdy przygotowujesz wniosek, dane sprawy idą szyfrowanym połączeniem do serwera MasterSSon, który od razu odsyła gotowy tekst i niczego nie zapisuje.' : 'Wszystkie dane zostają w tym urządzeniu — aplikacja niczego nie wysyła.') + ' Wynik jest orientacyjny i nie stanowi porady prawnej; ostatecznie o wypłacie decyduje linia, Rzecznik albo sąd.</p></div>';
  }

  // ---------- nawigacja i zdarzenia ----------
  var TYT = { kalkulator: 'Odszkodowanie za lot', wniosek: 'Wniosek do linii', sprawy: 'Moje sprawy', info: 'Zasady' };
  function widok() { var v = (location.hash || '#kalkulator').slice(1); return TYT[v] ? v : 'kalkulator'; }
  function pokaz() {
    var v = widok();
    $('#m').innerHTML = { kalkulator: widokKalkulator, wniosek: widokWniosek, sprawy: widokSprawy, info: widokInfo }[v]();
    $('#tyt').textContent = TYT[v]; document.title = TYT[v] + ' — sprawdź i napisz wniosek';
    $$('nav.d a').forEach(function (a) { a.classList.toggle('on', a.dataset.n === v); });
    podepnij();
  }
  function ustaw(obj, k, v) { obj[k] = v; }
  function odswiezWynik() { var e = $('#wynik'); if (e) e.innerHTML = kartaWyniku(); }
  function odswiezTekst() {
    var t = $('#tekst'); if (t) t.textContent = tekstWniosku();
    var b = $('#ibanBlad'); if (b) b.textContent = S.osoba.iban && !WL.ibanOk(S.osoba.iban) ? 'Sprawdź numer konta — suma kontrolna się nie zgadza.' : '';
  }
  function podepnij() {
    $$('[data-p]').forEach(function (el) {
      var przebuduj = el.tagName === 'SELECT' || el.type === 'checkbox' || el.type === 'radio';
      el.addEventListener(przebuduj ? 'change' : 'input', function () {
        if (el.type === 'radio' && !el.checked) return;
        var v = el.type === 'checkbox' ? el.checked : el.value, k = el.dataset.p;
        if (k === 'jezyk') S.jezyk = v; else ustaw(S.sprawa, k, v);
        if (k === 'przesiadka' && !v) S.sprawa.przes = '';
        zapisz();
        if (przebuduj) pokaz(); else odswiezWynik(); // „jezyk” to opcja (radio), więc zawsze przebudowa
      });
    });
    $$('[data-o]').forEach(function (el) {
      el.addEventListener('input', function () { ustaw(S.osoba, el.dataset.o, el.value); zapisz(); odswiezTekst(); });
    });
    $$('[data-lot]').forEach(function (el) {
      var k = el.dataset.lot, ul = document.querySelector('[data-lista="' + k + '"]');
      el.addEventListener('input', function () {
        var l = szukaj(el.value);
        ul.innerHTML = l.map(function (a) { return '<li data-iata="' + a + '">' + esc(opisLotn(a)) + '</li>'; }).join('') || (WL.normalizuj(el.value).trim().length >= 2 ? '<li class="info">Nie znaleziono — wpisz kod IATA (3 litery) albo nazwę miasta po angielsku.</li>' : '');
        ul.classList.toggle('ukryj', !ul.innerHTML);
      });
      el.addEventListener('focus', function () { if (S.sprawa[k]) el.select(); });
      ul.addEventListener('mousedown', function (e) {
        var li = e.target.closest('li[data-iata]'); if (!li) return;
        e.preventDefault(); S.sprawa[k] = li.dataset.iata; zapisz(); pokaz();
      });
    });
    var b;
    if ((b = $('#nowa'))) b.onclick = function () { if (confirm('Wyczyścić dane lotu?')) { S.sprawa = nowaSprawa(); zapisz(); pokaz(); } };
    if ((b = $('#kopiuj'))) b.onclick = function () {
      var t = tekstWniosku(), pre = $('#tekst'); // element zapamiętany teraz: obietnica rozstrzyga się później
      if (LICT && !LIC.ok) return toast('Wniosek jeszcze nie jest gotowy');
      (navigator.clipboard && navigator.clipboard.writeText ? navigator.clipboard.writeText(t) : Promise.reject()).then(function () { toast('Skopiowano wniosek'); }, function () {
        if (!document.body.contains(pre)) return;
        var r = document.createRange(); r.selectNodeContents(pre); var s = window.getSelection(); s.removeAllRanges(); s.addRange(r); toast('Zaznaczono tekst — skopiuj ręcznie');
      });
    };
    if ((b = $('#drukuj'))) b.onclick = function () { window.print(); };
    var lk = $('#licKlucz');
    if (lk) lk.addEventListener('input', function () {
      LIC.klucz = lk.value.trim().toUpperCase(); LIC.stan = ''; LIC.ostatni = {};
      try { localStorage.setItem(LKL, LIC.klucz); } catch (e) {}
      odswiezLicencje();
    });
    if ((b = $('#pobierz'))) b.onclick = function () {
      var t = tekstWniosku(); if (LICT && !LIC.ok) return toast('Wniosek jeszcze nie jest gotowy');
      var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([t], { type: 'text/plain;charset=utf-8' }));
      a.download = 'wniosek-odszkodowanie-' + (S.sprawa.nrLotu || 'lot').replace(/[^\w-]/g, '') + '.txt'; document.body.appendChild(a); a.click(); a.remove();
    };
    if ((b = $('#zapiszSprawe'))) b.onclick = function () {
      var wej = wejscie(S.sprawa), w = WL.ocen(wej), n = WLP.pasazerowie(S.osoba).length;
      S.sprawy.unshift({ id: id(), zapisano: dzis(), tytul: (S.sprawa.nrLotu || 'Lot') + ' ' + S.sprawa.wylot + '→' + S.sprawa.przylot + ' ' + WLP.dataPL(S.sprawa.data), // przycisk jest tylko przy kwocie > 0, więc oba lotniska są wybrane
        kwotaOpis: (w.kwota * n) + ' EUR (' + n + ' pas.)', sprawa: JSON.parse(JSON.stringify(S.sprawa)), osoba: JSON.parse(JSON.stringify(S.osoba)),
        status: 'przygotowany', dataWyslania: '', odpowiedz: 'brak', pokazRzecznik: false });
      zapisz(); toast('Zapisano w „Moje sprawy”');
    };
    $$('[data-s]').forEach(function (el) {
      el.addEventListener('change', function () {
        var c = el.dataset.s.split('.'), z = S.sprawy[+c[0]];
        z[c[1]] = el.value;
        if (c[1] === 'dataWyslania' && el.value && z.status === 'przygotowany') z.status = 'wyslany';
        zapisz(); pokaz();
      });
    });
    $$('[data-otworz]').forEach(function (x) { x.onclick = function () { var z = S.sprawy[+x.dataset.otworz]; S.sprawa = JSON.parse(JSON.stringify(z.sprawa)); S.osoba = JSON.parse(JSON.stringify(z.osoba)); zapisz(); location.hash = '#kalkulator'; pokaz(); }; });
    $$('[data-usun]').forEach(function (x) { x.onclick = function () { if (confirm('Usunąć tę sprawę?')) { S.sprawy.splice(+x.dataset.usun, 1); zapisz(); pokaz(); } }; });
    $$('[data-rzecznik]').forEach(function (x) { x.onclick = function () { var z = S.sprawy[+x.dataset.rzecznik]; z.pokazRzecznik = !z.pokazRzecznik; zapisz(); pokaz(); }; });
  }

  window.addEventListener('hashchange', pokaz);
  document.addEventListener('click', function (e) { if (!e.target.closest('.podp')) $$('.lista').forEach(function (u) { u.classList.add('ukryj'); }); });
  wczytaj(); pokaz();
  if ('serviceWorker' in navigator && window.isSecureContext) navigator.serviceWorker.register('sw.js').catch(function () {});
  window.WL_APP = { S: function () { return S; }, szukaj: szukaj, wejscie: wejscie, tekstWniosku: tekstWniosku, LOTN: LOTN, ALIASY: ALIASY };
})();

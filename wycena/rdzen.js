// Wycena Fachowca — rdzeń obliczeń (bez DOM, testowany w Node)
var WF = (function () {
  function liczba(v) {
    if (typeof v === 'number') return isFinite(v) ? v : 0;
    var n = parseFloat(String(v == null ? '' : v).replace(/\s/g, '').replace(',', '.'));
    return isFinite(n) ? n : 0;
  }
  function zaokr(v, m) { var k = Math.pow(10, m == null ? 2 : m); return Math.round((v + 1e-9) * k) / k; }

  // Pomieszczenie: dl, szer, wys [m], otwory [m²] (okna/drzwi do odjęcia od ścian)
  function metryki(p) {
    var dl = liczba(p.dl), sz = liczba(p.szer), wy = liczba(p.wys), ot = liczba(p.otwory);
    var podloga = dl * sz, obwod = 2 * (dl + sz);
    return { podloga: zaokr(podloga), sufit: zaokr(podloga), obwod: zaokr(obwod),
      sciany: zaokr(Math.max(0, obwod * wy - ot)) };
  }

  var BAZY = { podloga: 'podłoga', sciany: 'ściany', sufit: 'sufit', obwod: 'obwód', reczna: 'ręcznie' };

  // Ilość bazowa dla pozycji: suma metryki z wybranych pomieszczeń ('all' albo indeks)
  function iloscBazowa(oferta, baza, pom) {
    if (!baza || baza === 'reczna') return null;
    var lista = (oferta.pomieszczenia || []);
    var wyb = (pom === 'all' || pom == null || pom === '') ? lista : [lista[+pom]].filter(Boolean);
    return zaokr(wyb.reduce(function (s, p) { return s + metryki(p)[baza]; }, 0));
  }

  function iloscPozycji(oferta, poz) {
    if (poz.ilosc !== '' && poz.ilosc != null && poz.recznie) return liczba(poz.ilosc);
    var b = iloscBazowa(oferta, poz.baza, poz.pom);
    return b == null ? liczba(poz.ilosc) : b;
  }

  // Materiał: ilość = baza × zużycie; opakowania = ceil(ilość / pojemność)
  function policzMaterial(oferta, m) {
    var baza = m.recznie || m.baza === 'reczna' ? liczba(m.ilosc) : (iloscBazowa(oferta, m.baza, m.pom) || 0);
    var potrzeba = zaokr(baza * (m.baza === 'reczna' || m.recznie ? 1 : liczba(m.zuzycie)), 3);
    var opak = liczba(m.opak) > 0 ? Math.ceil(potrzeba / liczba(m.opak) - 1e-9) : potrzeba;
    return { baza: baza, potrzeba: potrzeba, opakowania: opak, wartosc: zaokr(opak * liczba(m.cena)) };
  }

  function stawkaVat(v) { return v === 'zw' ? 0 : liczba(v) / 100; }

  function podsumowanie(oferta) {
    var poz = (oferta.pozycje || []).map(function (p) {
      var il = iloscPozycji(oferta, p); return { il: il, wartosc: zaokr(il * liczba(p.cena)) };
    });
    var robocizna = zaokr(poz.reduce(function (s, x) { return s + x.wartosc; }, 0));
    var rabatProc = Math.min(100, Math.max(0, liczba(oferta.rabat)));
    var rabat = zaokr(robocizna * rabatProc / 100);
    var mat = (oferta.materialy || []).map(function (m) { return policzMaterial(oferta, m); });
    var materialy = oferta.materialyKlienta ? 0 : zaokr(mat.reduce(function (s, x) { return s + x.wartosc; }, 0));
    var netto = zaokr(robocizna - rabat + materialy);
    var vat = zaokr(netto * stawkaVat(oferta.vat));
    var brutto = zaokr(netto + vat);
    var zaliczka = zaokr(brutto * Math.min(100, Math.max(0, liczba(oferta.zaliczka))) / 100);
    return { pozycje: poz, materialyPoz: mat, robocizna: robocizna, rabat: rabat, materialy: materialy,
      netto: netto, vat: vat, brutto: brutto, zaliczka: zaliczka };
  }

  function zl(v) {
    var s = zaokr(v).toFixed(2).split('.');
    return s[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ',' + s[1] + ' zł';
  }
  function il(v) { var x = zaokr(v, 2); return String(x).replace('.', ','); }

  // Kwota słownie (do oferty), do 999 999 999 zł
  function slownie(kwota) {
    var j = ['', 'jeden', 'dwa', 'trzy', 'cztery', 'pięć', 'sześć', 'siedem', 'osiem', 'dziewięć', 'dziesięć', 'jedenaście', 'dwanaście',
      'trzynaście', 'czternaście', 'piętnaście', 'szesnaście', 'siedemnaście', 'osiemnaście', 'dziewiętnaście'];
    var d = ['', '', 'dwadzieścia', 'trzydzieści', 'czterdzieści', 'pięćdziesiąt', 'sześćdziesiąt', 'siedemdziesiąt', 'osiemdziesiąt', 'dziewięćdziesiąt'];
    var s = ['', 'sto', 'dwieście', 'trzysta', 'czterysta', 'pięćset', 'sześćset', 'siedemset', 'osiemset', 'dziewięćset'];
    var formy = [['', '', ''], ['tysiąc', 'tysiące', 'tysięcy'], ['milion', 'miliony', 'milionów']];
    function forma(n, f) { if (n === 1) return f[0]; var r = n % 10, rr = n % 100; return r >= 2 && r <= 4 && (rr < 12 || rr > 14) ? f[1] : f[2]; }
    function trzy(n) { var w = []; if (n >= 100) w.push(s[Math.floor(n / 100)]); var r = n % 100; if (r < 20) w.push(j[r]); else { w.push(d[Math.floor(r / 10)]); w.push(j[r % 10]); } return w.filter(Boolean).join(' '); }
    var zl_ = Math.floor(zaokr(kwota)), gr = Math.round((zaokr(kwota) - zl_) * 100);
    if (zl_ === 0) return 'zero zł ' + gr + '/100';
    var czesci = [], n = zl_, i = 0;
    while (n > 0) { var t = n % 1000; if (t) czesci.unshift((i && t === 1 ? '' : trzy(t)) + (i ? ' ' + forma(t, formy[i]) : '')); n = Math.floor(n / 1000); i++; }
    return czesci.join(' ').replace(/\s+/g, ' ').trim() + ' zł ' + (gr < 10 ? '0' : '') + gr + '/100';
  }

  return { liczba: liczba, zaokr: zaokr, metryki: metryki, iloscBazowa: iloscBazowa, iloscPozycji: iloscPozycji,
    policzMaterial: policzMaterial, podsumowanie: podsumowanie, zl: zl, il: il, slownie: slownie, BAZY: BAZY, stawkaVat: stawkaVat };
})();
if (typeof module !== 'undefined') module.exports = WF;

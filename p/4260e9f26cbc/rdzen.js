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

  var BAZY = { podloga: 'podłoga', sciany: 'ściany', sufit: 'sufit', obwod: 'obwód', reczna: 'wpisuję sam' };
  var POKOJ = { podloga: 'm²', sciany: 'm²', sufit: 'm²', obwod: 'mb' };

  // ---------- kalkulatory fachowe: każdy fach liczy własne ilości (bazy) ----------
  // Bazy fachów: klucz -> [nazwa, jednostka]. Hydraulik ma dodatkowo bazy per średnica (hy_rura_w16 itd.).
  var BAZY_FACH = {
    elektryk: { el_gniazda: ['gniazda', 'szt.'], el_wlaczniki: ['włączniki', 'szt.'], el_lampy: ['punkty świetlne', 'szt.'],
      el_gnwl: ['gniazda + włączniki', 'szt.'], el_punkty: ['wszystkie punkty el.', 'szt.'], el_kabel15: ['przewód 3×1,5 (światło)', 'mb'],
      el_kabel25: ['przewód 3×2,5 (gniazda)', 'mb'], el_kabel: ['przewody razem', 'mb'], el_bruzdy: ['bruzdy pod przewody', 'mb'],
      el_puszki: ['puszki', 'szt.'], el_obwody: ['obwody', 'szt.'] },
    hydraulik: { hy_rura_woda: ['rury wodne razem', 'mb'], hy_rura_kan: ['rury kanalizacyjne razem', 'mb'], hy_rura_razem: ['rury razem (bruzdy)', 'mb'],
      hy_kolana: ['kolana razem', 'szt.'], hy_troj: ['trójniki razem', 'szt.'], hy_podejscia: ['podejścia (punkty)', 'szt.'] },
    glazurnik: { gl_pod_m2: ['płytki podłoga', 'm²'], gl_pod_m2z: ['płytki podłoga z zapasem', 'm²'], gl_pod_szt: ['płytki podłoga', 'szt.'],
      gl_sc_m2: ['płytki ściany', 'm²'], gl_sc_m2z: ['płytki ściany z zapasem', 'm²'], gl_sc_szt: ['płytki ściany', 'szt.'],
      gl_razem_m2: ['płytki razem', 'm²'], gl_klej_kg: ['klej do płytek', 'kg'], gl_fuga_kg: ['fuga', 'kg'] },
    malarz: { ma_pow: ['malowanie', 'm²'], ma_farba_l: ['farba', 'l'], ma_gladz_m2: ['gładź', 'm²'], ma_gladz_kg: ['gładź', 'kg'],
      ma_grunt_l: ['grunt', 'l'] },
    podlogi: { po_m2: ['podłoga', 'm²'], po_panele_m2z: ['panele z zapasem', 'm²'], po_listwy_mb: ['listwy z zapasem', 'mb'],
      po_narozniki: ['narożniki i zakończenia listew', 'szt.'], po_progi: ['progi (drzwi)', 'szt.'] },
    suchazabudowa: { sz_pow: ['powierzchnia zabudowy', 'm²'], sz_plyty_m2: ['płyty GK z zapasem', 'm²'], sz_plyty_szt: ['płyty GK 1,2×2,6 m', 'szt.'],
      sz_cw_mb: ['profile CW (słupki)', 'mb'], sz_uw_mb: ['profile UW (góra/dół)', 'mb'], sz_cd_mb: ['profile CD', 'mb'], sz_ud_mb: ['profile UD (obwód)', 'mb'],
      sz_wieszaki: ['wieszaki', 'szt.'], sz_wkrety: ['wkręty do GK', 'szt.'], sz_tasma_mb: ['taśma spoinowa', 'mb'], sz_masa_kg: ['masa spoinowa', 'kg'], sz_welna_m2: ['wełna', 'm²'] },
    tynkarz: { ty_pow: ['tynkowanie', 'm²'], ty_kg: ['tynk', 'kg'], ty_grunt_l: ['grunt', 'l'], ty_narozniki_mb: ['narożniki tynkarskie', 'mb'] },
    murarz: { mu_pow: ['mur (bez otworów)', 'm²'], mu_szt: ['bloczki / pustaki / cegły', 'szt.'], mu_zaprawa_kg: ['zaprawa', 'kg'] },
    ocieplenia: { oc_pow: ['docieplenie', 'm²'], oc_styro_m2: ['styropian z zapasem', 'm²'], oc_styro_paczki: ['styropian', 'paczki'],
      oc_klej_styro_kg: ['klej do styropianu', 'kg'], oc_klej_siatka_kg: ['klej do siatki', 'kg'], oc_kolki: ['łączniki (kołki)', 'szt.'],
      oc_siatka_m2: ['siatka z zakładami', 'm²'], oc_tynk_kg: ['tynk cienkowarstwowy', 'kg'], oc_grunt_kg: ['grunt pod tynk', 'kg'] },
    posadzkarz: { wy_m2: ['wylewka', 'm²'], wy_kg: ['jastrych / masa', 'kg'], wy_tasma_mb: ['taśma brzegowa', 'mb'], wy_folia_m2: ['folia z zakładami', 'm²'] },
    parkieciarz: { pk_m2: ['cyklinowanie i lakier', 'm²'], pk_lakier_l: ['lakier', 'l'], pk_podklad_l: ['podkład', 'l'] },
    co: { co_grzejniki: ['grzejniki', 'szt.'], co_rura_grz_mb: ['rura do grzejników', 'mb'], co_podl_m2: ['ogrzewanie podłogowe', 'm²'],
      co_podl_rura_mb: ['rura podłogówki', 'mb'], co_petle: ['pętle (sekcje rozdzielacza)', 'szt.'], co_tasma_mb: ['taśma brzegowa', 'mb'], co_izolacja_m2: ['izolacja pod podłogówkę', 'm²'] },
    dekarz: { de_m2: ['dach', 'm²'], de_pokrycie_m2: ['pokrycie z zapasem', 'm²'], de_dachowki_szt: ['dachówki', 'szt.'], de_membrana_m2: ['membrana', 'm²'],
      de_laty_mb: ['łaty', 'mb'], de_kontrlaty_mb: ['kontrłaty', 'mb'], de_gasiory_mb: ['kalenica / gąsiory', 'mb'] },
    brukarz: { br_m2: ['nawierzchnia', 'm²'], br_kostka_m2: ['kostka z zapasem', 'm²'], br_korytowanie_m3: ['korytowanie (wykop)', 'm³'],
      br_podbudowa_t: ['kruszywo podbudowy', 't'], br_podsypka_t: ['podsypka', 't'], br_kraweznik_mb: ['krawężniki', 'mb'], br_obrzeze_mb: ['obrzeża', 'mb'] },
    stolarka: { st_okna: ['okna', 'szt.'], st_drzwi_wew: ['drzwi wewnętrzne', 'szt.'], st_drzwi_zew: ['drzwi zewnętrzne', 'szt.'],
      st_parapety_mb: ['parapety', 'mb'], st_pianka_szt: ['pianka montażowa', 'szt.'], st_tasma_mb: ['taśma okienna', 'mb'] },
    ogolne: { zr_h: ['godziny pracy', 'h'], zr_km: ['dojazd', 'km'], zr_punkty: ['drobne naprawy', 'szt.'] }
  };
  // Typy murów: sztuk na m² i zaprawa kg na m² (orientacyjnie, do poprawienia przez fachowca)
  var MURY = { bk24: ['beton komórkowy 24 cm (59×24 cm)', 7, 4], silikat18: ['silikat 18 cm (33×22 cm)', 13.3, 4.5],
    ceramika25: ['pustak ceramiczny 25 cm (37×24 cm)', 10.7, 30], cegla12: ['cegła pełna, ściana 12 cm', 51, 50] };
  var TYNKI = { gips: ['gipsowy maszynowy', 1.0], cw: ['cementowo-wapienny', 1.6] };
  var SR_WODA = ['16', '20', '25', '32'], SR_KAN = ['32', '40', '50', '75', '110'];
  var UKLADY = { prosty: ['prosto', 0.10], cegielka: ['cegiełka', 0.10], skos: ['po skosie', 0.15], jodelka: ['jodełka', 0.15] };
  var KLEJ = { '6': 2.5, '8': 3.2, '10': 4, '12': 5 };      // kg/m² wg zębatki (orientacyjnie, klej C2)
  var GLADZ = { gotowa: ['gotowa (masa)', 1.6], sypka: ['sypka (do rozrobienia)', 1.0] }; // kg na m² na 1 mm

  function domyslneObmiary(fach) {
    return ({
      elektryk: { gniazda: '', wlaczniki: '', lampy: '', odl: '6', zapas: '10', obwody: '' },
      hydraulik: { odcinki: [{ nazwa: 'Woda zimna', rodzaj: 'w', sr: '16', dl: '', zakrety: '', odgal: '' }], podejscia: '', zapas: '10' },
      glazurnik: { pom: 'all', podTak: true, podA: '60', podB: '60', podUklad: 'prosty', podGrub: '9',
        scTak: true, scA: '30', scB: '60', scUklad: 'prosty', scGrub: '8', scWys: '', fuga: '2', zebatka: '10' },
      malarz: { pom: 'all', sciany: true, sufit: true, warstwy: '2', wydajnosc: '10', gladzTak: false, gladzMm: '2', gladzRodzaj: 'gotowa', grunt: '1' },
      podlogi: { pom: 'all', drzwi: '1', zapas: '8', narozniki: '' },
      suchazabudowa: { typ: 'sciana', dl: '4', wys: '2,6', pow: '', obwod: '', warstwy: '1', welna: true },
      tynkarz: { pom: 'all', sciany: true, sufit: true, grub: '15', rodzaj: 'gips', narozniki: '' },
      murarz: { dl: '5', wys: '2,7', otwory: '0', typ: 'bk24', szt: '7', zaprawa: '4' },
      ocieplenia: { pow: '120', otwory: '15', grub: '15', klej: '5', kolki: '6', siatka: '4', tynk: '2,5' },
      posadzkarz: { pom: 'all', grub: '5', zuzycie: '20' },
      parkieciarz: { pom: 'all', warstwy: '3', wydajnosc: '10' },
      co: { grzejniki: '0', rura: '12', podlTak: false, pom: 'all', rozstaw: '15' },
      dekarz: { pow: '120', kalenica: '10', typ: 'blacha', dachowki: '10' },
      brukarz: { pow: '50', podbudowa: '20', podsypka: '4', kraweznik: '0', obrzeze: '30' },
      stolarka: { okna: '0', drzwiWew: '0', drzwiZew: '0', parapety: '0' },
      ogolne: { godziny: '0', km: '0', punkty: '0' }
    })[fach] || null;
  }

  function wybranePom(oferta, pom) {
    var lista = (oferta.pomieszczenia || []);
    return (pom === 'all' || pom == null || pom === '') ? lista : [lista[+pom]].filter(Boolean);
  }
  function suma(lista, f) { return lista.reduce(function (s, x) { return s + f(x); }, 0); }
  function tak(v) { return v === true || v === 'true' || v === 'on'; }
  // Ilości prac wpisane ręcznie ("wpiszę ilość sam") — zapas, gdy brak wymiarów pomieszczeń
  function recznePrace(oferta, bazy) {
    return suma((oferta.pozycje || []).filter(function (p) { return p.recznie && bazy.indexOf(p.baza) >= 0; }), function (p) { return liczba(p.ilosc); });
  }

  var KALK = {
    elektryk: function (o, d) {
      var gn = liczba(d.gniazda), wl = liczba(d.wlaczniki), la = liczba(d.lampy), odl = liczba(d.odl), z = 1 + liczba(d.zapas) / 100;
      var k15 = (wl + la) * odl * z, k25 = gn * odl * z;
      return { el_gniazda: gn, el_wlaczniki: wl, el_lampy: la, el_gnwl: gn + wl, el_punkty: gn + wl + la,
        el_kabel15: k15, el_kabel25: k25, el_kabel: k15 + k25, el_bruzdy: (gn + wl + la) * odl, el_puszki: gn + wl + la, el_obwody: liczba(d.obwody) };
    },
    hydraulik: function (o, d) {
      var w = { hy_rura_woda: 0, hy_rura_kan: 0, hy_kolana: 0, hy_troj: 0, hy_podejscia: liczba(d.podejscia) }, z = 1 + liczba(d.zapas) / 100;
      SR_WODA.forEach(function (s) { w['hy_rura_w' + s] = 0; w['hy_kolana_w' + s] = 0; w['hy_troj_w' + s] = 0; });
      SR_KAN.forEach(function (s) { w['hy_rura_k' + s] = 0; w['hy_kolana_k' + s] = 0; w['hy_troj_k' + s] = 0; });
      (d.odcinki || []).forEach(function (x) {
        var k = (x.rodzaj === 'k' ? 'k' : 'w') + String(x.sr), dl = liczba(x.dl) * z, ko = liczba(x.zakrety), tr = liczba(x.odgal);
        w['hy_rura_' + k] = (w['hy_rura_' + k] || 0) + dl; w['hy_kolana_' + k] = (w['hy_kolana_' + k] || 0) + ko; w['hy_troj_' + k] = (w['hy_troj_' + k] || 0) + tr;
        w[x.rodzaj === 'k' ? 'hy_rura_kan' : 'hy_rura_woda'] += dl; w.hy_kolana += ko; w.hy_troj += tr;
      });
      w.hy_rura_razem = w.hy_rura_woda + w.hy_rura_kan;
      return w;
    },
    glazurnik: function (o, d) {
      var pom = wybranePom(o, d.pom), w = {};
      var pod = tak(d.podTak) ? suma(pom, function (p) { return metryki(p).podloga; }) : 0;
      var sc = tak(d.scTak) ? suma(pom, function (p) {   // ściany do wysokości glazury; otwory proporcjonalnie
        var wy = liczba(p.wys), h = liczba(d.scWys) > 0 ? Math.min(liczba(d.scWys), wy || liczba(d.scWys)) : wy, ob = metryki(p).obwod;
        return Math.max(0, ob * h - liczba(p.otwory) * (wy > 0 ? Math.min(1, h / wy) : 1));
      }) : 0;
      function plytki(pow, a, b, uklad, grub) {
        var A = liczba(a) * 10, B = liczba(b) * 10, zap = (UKLADY[uklad] || UKLADY.prosty)[1], m2z = pow * (1 + zap);
        return { m2z: m2z, szt: A > 0 && B > 0 ? Math.ceil(m2z / (A * B / 1e6) - 1e-9) : 0,
          fuga: A > 0 && B > 0 ? pow * (A + B) / (A * B) * liczba(d.fuga) * liczba(grub) * 1.6 * 1.1 : 0 };
      }
      var P = plytki(pod, d.podA, d.podB, d.podUklad, d.podGrub), S = plytki(sc, d.scA, d.scB, d.scUklad, d.scGrub);
      w.gl_pod_m2 = pod; w.gl_pod_m2z = P.m2z; w.gl_pod_szt = P.szt; w.gl_sc_m2 = sc; w.gl_sc_m2z = S.m2z; w.gl_sc_szt = S.szt;
      w.gl_razem_m2 = pod + sc; w.gl_klej_kg = (pod + sc) * (KLEJ[String(d.zebatka)] || KLEJ['10']); w.gl_fuga_kg = P.fuga + S.fuga;
      return w;
    },
    malarz: function (o, d) {
      var pom = wybranePom(o, d.pom);
      var pow = suma(pom, function (p) { var m = metryki(p); return (tak(d.sciany) ? m.sciany : 0) + (tak(d.sufit) ? m.sufit : 0); });
      if (!(pow > 0) && !d.bezRecznych) pow = recznePrace(o, ['sciany', 'sufit']) || recznePrace(o, ['ma_pow']);
      var gl = tak(d.gladzTak) ? pow : 0, wyd = liczba(d.wydajnosc);
      if (!(gl > 0) && !d.bezRecznych) gl = recznePrace(o, ['ma_gladz_m2']);
      return { ma_pow: pow, ma_farba_l: wyd > 0 ? pow * liczba(d.warstwy) / wyd : 0, ma_gladz_m2: gl,
        ma_gladz_kg: gl * liczba(d.gladzMm) * (GLADZ[d.gladzRodzaj] || GLADZ.gotowa)[1], ma_grunt_l: pow * 0.1 * liczba(d.grunt) };
    },
    podlogi: function (o, d) {
      var pom = wybranePom(o, d.pom), m2 = suma(pom, function (p) { return metryki(p).podloga; });
      var ob = suma(pom, function (p) { return metryki(p).obwod; }), drzwi = liczba(d.drzwi);
      return { po_m2: m2, po_panele_m2z: m2 * (1 + liczba(d.zapas) / 100), po_listwy_mb: Math.max(0, ob - drzwi * 0.9) * 1.1,
        po_narozniki: d.narozniki !== '' && d.narozniki != null ? liczba(d.narozniki) : (m2 > 0 ? 4 * pom.length : 0), po_progi: drzwi };
    }
  };

  KALK.suchazabudowa = function (o, d) {
    var dl = liczba(d.dl), wy = liczba(d.wys), sufit = d.typ === 'sufit', S = sufit ? liczba(d.pow) : dl * wy;
    var stron = d.typ === 'sciana' ? 2 : 1, plyty = S * stron * Math.max(1, liczba(d.warstwy)) * 1.1, sl = (Math.ceil(dl / 0.6 - 1e-9) + 1) * wy;
    return { sz_pow: S, sz_plyty_m2: plyty, sz_plyty_szt: Math.ceil(plyty / 3.12 - 1e-9),
      sz_cw_mb: d.typ === 'sciana' ? sl : 0, sz_uw_mb: d.typ === 'sciana' ? 2 * dl : 0,
      sz_cd_mb: d.typ === 'okladzina' ? sl : sufit ? S / 0.5 : 0, sz_ud_mb: d.typ === 'okladzina' ? 2 * dl : sufit ? (liczba(d.obwod) || 4 * Math.sqrt(S)) : 0,
      sz_wieszaki: sufit ? Math.ceil(S * 1.7 - 1e-9) : 0, sz_wkrety: Math.round(plyty * 25), sz_tasma_mb: S * stron * 1.3, sz_masa_kg: S * stron * 0.4,
      sz_welna_m2: d.typ === 'sciana' && tak(d.welna) ? S : 0 };
  };
  KALK.tynkarz = function (o, d) {
    var pow = suma(wybranePom(o, d.pom), function (p) { var m = metryki(p); return (tak(d.sciany) ? m.sciany : 0) + (tak(d.sufit) ? m.sufit : 0); });
    return { ty_pow: pow, ty_kg: pow * liczba(d.grub) * (TYNKI[d.rodzaj] || TYNKI.gips)[1], ty_grunt_l: pow * 0.2, ty_narozniki_mb: liczba(d.narozniki) };
  };
  KALK.murarz = function (o, d) {
    var pow = Math.max(0, liczba(d.dl) * liczba(d.wys) - liczba(d.otwory));
    return { mu_pow: pow, mu_szt: Math.ceil(pow * liczba(d.szt) * 1.05 - 1e-9), mu_zaprawa_kg: pow * liczba(d.zaprawa) };
  };
  KALK.ocieplenia = function (o, d) {
    var S = Math.max(0, liczba(d.pow) - liczba(d.otwory)), g = liczba(d.grub), st = S * 1.05;
    return { oc_pow: S, oc_styro_m2: st, oc_styro_paczki: g > 0 ? Math.ceil(st / (0.3 / (g / 100)) - 1e-9) : 0, oc_klej_styro_kg: S * liczba(d.klej),
      oc_klej_siatka_kg: S * liczba(d.siatka), oc_kolki: Math.ceil(S * liczba(d.kolki) - 1e-9), oc_siatka_m2: S * 1.15, oc_tynk_kg: S * liczba(d.tynk), oc_grunt_kg: S * 0.3 };
  };
  KALK.posadzkarz = function (o, d) {
    var pom = wybranePom(o, d.pom), m2 = suma(pom, function (p) { return metryki(p).podloga; });
    return { wy_m2: m2, wy_kg: m2 * liczba(d.grub) * liczba(d.zuzycie), wy_tasma_mb: suma(pom, function (p) { return metryki(p).obwod; }), wy_folia_m2: m2 * 1.1 };
  };
  KALK.parkieciarz = function (o, d) {
    var m2 = suma(wybranePom(o, d.pom), function (p) { return metryki(p).podloga; }), w = liczba(d.wydajnosc);
    return { pk_m2: m2, pk_lakier_l: w > 0 ? m2 * liczba(d.warstwy) / w : 0, pk_podklad_l: w > 0 ? m2 / w : 0 };
  };
  KALK.co = function (o, d) {
    var g = liczba(d.grzejniki), podl = tak(d.podlTak), pom = podl ? wybranePom(o, d.pom) : [];
    var m2 = suma(pom, function (p) { return metryki(p).podloga; }), roz = liczba(d.rozstaw), rura = roz > 0 ? m2 * 100 / roz * 1.1 : 0;
    return { co_grzejniki: g, co_rura_grz_mb: g * liczba(d.rura) * 1.1, co_podl_m2: m2, co_podl_rura_mb: rura, co_petle: rura > 0 ? Math.ceil(rura / 90 - 1e-9) : 0,
      co_tasma_mb: suma(pom, function (p) { return metryki(p).obwod; }), co_izolacja_m2: m2 };
  };
  KALK.dekarz = function (o, d) {
    var S = liczba(d.pow);
    return { de_m2: S, de_pokrycie_m2: d.typ === 'dachowka' ? 0 : S * 1.1, de_dachowki_szt: d.typ === 'dachowka' ? Math.ceil(S * liczba(d.dachowki) * 1.05 - 1e-9) : 0,
      de_membrana_m2: S * 1.1, de_laty_mb: S * 3, de_kontrlaty_mb: S * 1.1, de_gasiory_mb: liczba(d.kalenica) };
  };
  KALK.brukarz = function (o, d) {
    var S = liczba(d.pow), pb = liczba(d.podbudowa), ps = liczba(d.podsypka);
    return { br_m2: S, br_kostka_m2: S * 1.05, br_korytowanie_m3: S * (pb + ps + 8) / 100, br_podbudowa_t: S * pb / 100 * 1.8, br_podsypka_t: S * ps / 100 * 1.6,
      br_kraweznik_mb: liczba(d.kraweznik), br_obrzeze_mb: liczba(d.obrzeze) };
  };
  KALK.stolarka = function (o, d) {
    var ok = liczba(d.okna), dw = liczba(d.drzwiWew), dz = liczba(d.drzwiZew);
    return { st_okna: ok, st_drzwi_wew: dw, st_drzwi_zew: dz, st_parapety_mb: liczba(d.parapety), st_pianka_szt: Math.ceil(ok * 0.5 + (dw + dz) * 0.7 - 1e-9), st_tasma_mb: ok * 5 };
  };
  KALK.ogolne = function (o, d) { return { zr_h: liczba(d.godziny), zr_km: liczba(d.km), zr_punkty: liczba(d.punkty) }; };

  // Cena rynkowa materiału: cena za jednostkę z pliku cen × ile jednostek w opakowaniu
  function cenaRynkowa(ceny, kod, ile) {
    var c = ceny && ceny.ceny && ceny.ceny[kod]; if (!c || !(liczba(ile) > 0)) return null;
    return Math.round(c.cena * liczba(ile) * 100) / 100;
  }

  // Fachy liczone z pomieszczeń: przy 2+ pomieszczeniach każde ma własne ustawienia (warstwy, wydajność, płytki…)
  var POKOJOWE = ['glazurnik', 'malarz', 'podlogi', 'tynkarz', 'posadzkarz', 'parkieciarz'];
  function ustawieniaPokoju(d, i) {
    var u = {}, p = d.pokoje && d.pokoje[i];
    Object.keys(d).forEach(function (k) { if (k !== 'pokoje' && k !== 'pom') u[k] = d[k]; });
    if (p) Object.keys(p).forEach(function (k) { u[k] = p[k]; });
    if (!p || p.wl == null) u.wl = d.pom === 'all' || d.pom == null || d.pom === '' || String(d.pom) === String(i);
    if (!p) { // stara oferta: liczby „na całość” (drzwi, narożniki) zostają przy pierwszym pomieszczeniu
      var pierwszy = d.pom === 'all' || d.pom == null || d.pom === '' ? 0 : +d.pom;
      ['drzwi', 'narozniki'].forEach(function (k) { if (i !== pierwszy && d[k] !== '' && d[k] != null) u[k] = '0'; });
    }
    u.pom = String(i); return u;
  }
  function policzFach(o, f, d) {
    var pom = o.pomieszczenia || [];
    if (POKOJOWE.indexOf(f) < 0 || pom.length < 2) return KALK[f](o, d);
    var w = {};
    pom.forEach(function (p, i) {
      var u = ustawieniaPokoju(d, i); if (!tak(u.wl)) return; u.bezRecznych = true;
      var r = KALK[f](o, u); Object.keys(r).forEach(function (k) { w[k] = (w[k] || 0) + r[k]; });
    });
    if (Object.keys(w).some(function (k) { return w[k] > 0; })) return w;
    var z = {}; Object.keys(d).forEach(function (k) { z[k] = d[k]; }); z.pom = 'brak'; // brak wymiarów → ilości z ręcznie wpisanych prac
    return KALK[f](o, z);
  }

  // Wszystkie ilości z kalkulatorów fachów w tej ofercie: { klucz: liczba }
  function wynikiFachow(oferta) {
    var w = {}, ob = oferta.obmiary || {};
    Object.keys(KALK).forEach(function (f) {
      if (!ob[f]) return; var r = policzFach(oferta, f, ob[f]);
      Object.keys(r).forEach(function (k) { w[k] = zaokr(r[k] > 0 ? r[k] : recznePrace(oferta, [k]), 2); });
    });
    return w;
  }

  // Nazwa i jednostka dowolnej bazy (pomieszczenie, fach, średnica rury)
  function opisBazy(k) {
    if (POKOJ[k]) return { nazwa: BAZY[k], jedn: POKOJ[k], fach: '' };
    if (k === 'reczna' || !k) return { nazwa: 'wpisuję sam', jedn: 'j.', fach: '' };
    for (var f in BAZY_FACH) if (BAZY_FACH[f][k]) return { nazwa: BAZY_FACH[f][k][0], jedn: BAZY_FACH[f][k][1], fach: f };
    var m = /^hy_(rura|kolana|troj)_(w|k)(\d+)$/.exec(k);
    if (m) return { nazwa: { rura: 'rura', kolana: 'kolana', troj: 'trójniki' }[m[1]] + (m[2] === 'w' ? ' wod.' : ' kan.') + ' Ø' + m[3],
      jedn: m[1] === 'rura' ? 'mb' : 'szt.', fach: 'hydraulik' };
    return { nazwa: k, jedn: 'j.', fach: '' };
  }
  // Lista baz do wyboru: pomieszczenie + bazy podanych fachów (hydraulik: też każda średnica) + ręcznie
  function listaBaz(fachy) {
    var l = Object.keys(POKOJ);
    (fachy || []).forEach(function (f) {
      if (!BAZY_FACH[f]) return; l = l.concat(Object.keys(BAZY_FACH[f]));
      if (f === 'hydraulik') ['rura', 'kolana', 'troj'].forEach(function (t) {
        SR_WODA.forEach(function (s) { l.push('hy_' + t + '_w' + s); }); SR_KAN.forEach(function (s) { l.push('hy_' + t + '_k' + s); });
      });
    });
    return l.concat(['reczna']);
  }

  // Ilość bazowa dla pozycji: suma metryki z wybranych pomieszczeń ('all' albo indeks) albo wynik kalkulatora fachu
  function iloscBazowa(oferta, baza, pom) {
    if (!baza || baza === 'reczna') return null;
    if (!POKOJ[baza]) return wynikiFachow(oferta)[baza] || 0;
    var v = zaokr(wybranePom(oferta, pom).reduce(function (s, p) { return s + metryki(p)[baza]; }, 0));
    return v > 0 ? v : zaokr(recznePrace(oferta, [baza]));
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
    policzMaterial: policzMaterial, podsumowanie: podsumowanie, zl: zl, il: il, slownie: slownie, BAZY: BAZY, stawkaVat: stawkaVat,
    POKOJ: POKOJ, BAZY_FACH: BAZY_FACH, SR_WODA: SR_WODA, SR_KAN: SR_KAN, UKLADY: UKLADY, KLEJ: KLEJ, GLADZ: GLADZ,
    domyslneObmiary: domyslneObmiary, wynikiFachow: wynikiFachow, POKOJOWE: POKOJOWE, ustawieniaPokoju: ustawieniaPokoju, opisBazy: opisBazy, listaBaz: listaBaz,
    MURY: MURY, TYNKI: TYNKI, cenaRynkowa: cenaRynkowa, KALK: KALK };
})();
if (typeof module !== 'undefined') module.exports = WF;

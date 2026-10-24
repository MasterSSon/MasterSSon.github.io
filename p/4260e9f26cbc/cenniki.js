// Cenniki startowe — PRZYKŁADOWE ceny i zużycia, do edycji przez fachowca.
// baza: podloga | sciany | sufit | obwod | reczna | baza z kalkulatora fachu (el_*, hy_*, gl_*, ma_*, po_* — patrz WF.BAZY_FACH)
// robocizna: [nazwa, j.m., cena, baza] ; materialy: [nazwa, baza, zużycie na 1 j. bazy, ilość w opakowaniu, opakowanie, cena za opakowanie]
var WF_CENNIKI = {
  glazurnik: {
    nazwa: 'Glazurnik',
    robocizna: [
      ['Układanie płytek — podłoga', 'm²', 100, 'gl_pod_m2'],
      ['Układanie płytek — ściany', 'm²', 110, 'gl_sc_m2'],
      ['Gruntowanie podłoża', 'm²', 5, 'gl_razem_m2'],
      ['Hydroizolacja (folia w płynie)', 'm²', 40, 'reczna'],
      ['Cokoliki z płytek', 'mb', 35, 'obwod'],
      ['Szlifowanie narożników 45°', 'mb', 70, 'reczna'],
      ['Montaż odpływu liniowego', 'szt.', 350, 'reczna'],
      ['Skucie starych płytek', 'm²', 35, 'reczna'],
      ['Wywóz gruzu', 'kpl', 300, 'reczna']
    ],
    materialy: [
      ['Płytki podłogowe', 'gl_pod_m2z', 1, 1.44, 'karton 1,44 m²', 90],
      ['Płytki ścienne', 'gl_sc_m2z', 1, 1.44, 'karton 1,44 m²', 80],
      ['Klej elastyczny C2TE', 'gl_klej_kg', 1, 25, 'worek 25 kg', 55],
      ['Fuga', 'gl_fuga_kg', 1, 5, 'opak. 5 kg', 70],
      ['Grunt', 'gl_razem_m2', 0.2, 5, 'kanister 5 l', 55]
    ]
  },
  malarz: {
    nazwa: 'Malarz / gładzie',
    robocizna: [
      ['Malowanie ścian (2 warstwy)', 'm²', 18, 'sciany'],
      ['Malowanie sufitu (2 warstwy)', 'm²', 22, 'sufit'],
      ['Gruntowanie', 'm²', 4, 'ma_pow'],
      ['Gładź gipsowa', 'm²', 35, 'ma_gladz_m2'],
      ['Zabezpieczenie folią i taśmą', 'm²', 4, 'podloga'],
      ['Montaż listew przysufitowych', 'mb', 25, 'obwod']
    ],
    materialy: [
      ['Farba lateksowa', 'ma_farba_l', 1, 10, 'wiadro 10 l', 190],
      ['Gładź gotowa', 'ma_gladz_kg', 1, 20, 'wiadro 20 kg', 60],
      ['Grunt', 'ma_grunt_l', 1, 5, 'kanister 5 l', 50],
      ['Folia i taśma malarska', 'podloga', 1.1, 20, 'zestaw 20 m²', 35]
    ]
  },
  podlogi: {
    nazwa: 'Podłogi i panele',
    robocizna: [
      ['Montaż paneli z podkładem', 'm²', 35, 'po_m2'],
      ['Listwy przypodłogowe', 'mb', 20, 'po_listwy_mb'],
      ['Montaż listew progowych', 'szt.', 30, 'po_progi'],
      ['Wylewka samopoziomująca', 'm²', 30, 'po_m2'],
      ['Demontaż starej podłogi', 'm²', 12, 'reczna']
    ],
    materialy: [
      ['Panele', 'po_panele_m2z', 1, 2.2, 'paczka 2,2 m²', 110],
      ['Podkład pod panele', 'po_m2', 1.05, 10, 'rolka 10 m²', 50],
      ['Listwy przypodłogowe', 'po_listwy_mb', 1, 2.5, 'listwa 2,5 m', 30],
      ['Narożniki i zakończenia listew', 'po_narozniki', 1, 1, 'szt.', 6],
      ['Listwa progowa', 'po_progi', 1, 1, 'szt.', 35],
      ['Masa samopoziomująca (ok. 3 mm)', 'po_m2', 4.5, 25, 'worek 25 kg', 65]
    ]
  },
  elektryk: {
    nazwa: 'Elektryk',
    robocizna: [
      ['Punkt elektryczny (gniazdo, włącznik)', 'szt.', 120, 'el_gnwl'],
      ['Punkt oświetleniowy', 'szt.', 100, 'el_lampy'],
      ['Wykucie bruzd', 'mb', 15, 'el_bruzdy'],
      ['Ułożenie przewodów', 'mb', 6, 'el_kabel'],
      ['Montaż obwodu w rozdzielnicy', 'szt.', 80, 'el_obwody'],
      ['Montaż rozdzielnicy', 'szt.', 400, 'reczna'],
      ['Pomiary elektryczne z protokołem', 'kpl', 350, 'reczna']
    ],
    materialy: [
      ['Przewód YDYp 3×1,5', 'el_kabel15', 1, 100, 'krążek 100 m', 260],
      ['Przewód YDYp 3×2,5', 'el_kabel25', 1, 100, 'krążek 100 m', 420],
      ['Puszki podtynkowe', 'el_puszki', 1, 10, 'opak. 10 szt.', 15],
      ['Wyłącznik nadprądowy B16', 'el_obwody', 1, 1, 'szt.', 22],
      ['Gips szybkowiążący do bruzd', 'el_bruzdy', 0.3, 2, 'worek 2 kg', 12]
    ]
  },
  hydraulik: {
    nazwa: 'Hydraulik',
    robocizna: [
      ['Punkt hydrauliczny (podejście)', 'szt.', 250, 'hy_podejscia'],
      ['Ułożenie rur wodnych', 'mb', 25, 'hy_rura_woda'],
      ['Ułożenie rur kanalizacyjnych', 'mb', 35, 'hy_rura_kan'],
      ['Wykucie bruzd pod rury', 'mb', 20, 'hy_rura_razem'],
      ['Montaż WC podwieszanego ze stelażem', 'szt.', 450, 'reczna'],
      ['Montaż umywalki z baterią', 'szt.', 200, 'reczna'],
      ['Montaż kabiny prysznicowej', 'szt.', 400, 'reczna']
    ],
    materialy: [
      ['Rura wielowarstwowa Ø16', 'hy_rura_w16', 1, 25, 'zwój 25 m', 150],
      ['Kolano zaprasowywane Ø16', 'hy_kolana_w16', 1, 1, 'szt.', 12],
      ['Trójnik zaprasowywany Ø16', 'hy_troj_w16', 1, 1, 'szt.', 16],
      ['Rura kanalizacyjna PVC Ø50', 'hy_rura_k50', 1, 2, 'rura 2 m', 16],
      ['Kolano kanalizacyjne Ø50', 'hy_kolana_k50', 1, 1, 'szt.', 4],
      ['Trójnik kanalizacyjny Ø50', 'hy_troj_k50', 1, 1, 'szt.', 6],
      ['Rura kanalizacyjna PVC Ø110', 'hy_rura_k110', 1, 2, 'rura 2 m', 35],
      ['Kolano kanalizacyjne Ø110', 'hy_kolana_k110', 1, 1, 'szt.', 9],
      ['Otulina na rury wodne', 'hy_rura_woda', 1, 2, 'odcinek 2 m', 4]
    ]
  },
  ogolne: {
    nazwa: 'Prace ogólne',
    robocizna: [
      ['Godzina pracy', 'h', 80, 'reczna'],
      ['Dojazd', 'kpl', 50, 'reczna'],
      ['Wniesienie materiałów', 'kpl', 100, 'reczna'],
      ['Sprzątanie po pracach', 'kpl', 150, 'reczna']
    ],
    materialy: []
  }
};
if (typeof module !== 'undefined') module.exports = WF_CENNIKI;

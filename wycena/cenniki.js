// Fachy i cenniki startowe — PRZYKŁADOWE ceny i zużycia, do edycji przez fachowca.
// fach: nazwa, ikona, opis, pokoje (czy liczy z pomiarów pomieszczeń), przyklad (dane do oferty-przykładu),
// robocizna: [nazwa, j.m., cena, baza]
// materialy: [nazwa, baza, zużycie na 1 j. bazy, ilość w opakowaniu, opakowanie, cena za opakowanie, kod ceny rynkowej, ile jednostek ceny w opakowaniu]
var WF_CENNIKI = {
  glazurnik: {
    nazwa: 'Glazurnik', ikona: '🧱', opis: 'płytki, klej, fuga', pokoje: true,
    przyklad: { tytul: 'Remont łazienki — płytki', pom: [['Łazienka', '2,5', '2', '2,6', '1,6']], obmiary: { scWys: '2' } },
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
      ['Klej elastyczny C2TE', 'gl_klej_kg', 1, 25, 'worek 25 kg', 55, 'klej_plytki', 25],
      ['Fuga', 'gl_fuga_kg', 1, 5, 'opak. 5 kg', 70, 'fuga', 5],
      ['Grunt', 'gl_razem_m2', 0.2, 5, 'kanister 5 l', 55, 'grunt', 5]
    ]
  },
  malarz: {
    nazwa: 'Malarz / gładzie', ikona: '🖌', opis: 'farba, gładź, grunt', pokoje: true,
    przyklad: { tytul: 'Malowanie mieszkania', pom: [['Salon', '5', '4', '2,6', '4'], ['Sypialnia', '4', '3,5', '2,6', '2']], obmiary: { gladzTak: true } },
    robocizna: [
      ['Malowanie ścian (2 warstwy)', 'm²', 18, 'sciany'],
      ['Malowanie sufitu (2 warstwy)', 'm²', 22, 'sufit'],
      ['Gruntowanie', 'm²', 4, 'ma_pow'],
      ['Gładź gipsowa', 'm²', 35, 'ma_gladz_m2'],
      ['Zabezpieczenie folią i taśmą', 'm²', 4, 'podloga'],
      ['Montaż listew przysufitowych', 'mb', 25, 'obwod']
    ],
    materialy: [
      ['Farba lateksowa biała', 'ma_farba_l', 1, 10, 'wiadro 10 l', 190, 'farba_biala', 10],
      ['Gładź gotowa', 'ma_gladz_kg', 1, 20, 'wiadro 20 kg', 60, 'gladz', 20],
      ['Grunt', 'ma_grunt_l', 1, 5, 'kanister 5 l', 50, 'grunt', 5],
      ['Folia i taśma malarska', 'podloga', 1.1, 20, 'zestaw 20 m²', 35]
    ]
  },
  podlogi: {
    nazwa: 'Podłogi i panele', ikona: '📐', opis: 'panele, listwy, progi', pokoje: true,
    przyklad: { tytul: 'Panele w dwóch pokojach', pom: [['Pokój 1', '4', '3,5', '2,6', '2'], ['Pokój 2', '3,5', '3', '2,6', '2']], obmiary: { drzwi: '2' }, pomin: ['Wylewka samopoziomująca', 'Masa samopoziomująca (ok. 3 mm)'] },
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
      ['Masa samopoziomująca (ok. 3 mm)', 'po_m2', 4.5, 25, 'worek 25 kg', 65, 'masa_samopoz', 25]
    ]
  },
  elektryk: {
    nazwa: 'Elektryk', ikona: '⚡', opis: 'przewody, punkty, bruzdy', pokoje: false,
    przyklad: { tytul: 'Instalacja elektryczna w mieszkaniu', obmiary: { gniazda: '18', wlaczniki: '8', lampy: '9', obwody: '7' } },
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
      ['Przewód YDYp 3×1,5', 'el_kabel15', 1, 100, 'krążek 100 m', 260, 'ydy15', 100],
      ['Przewód YDYp 3×2,5', 'el_kabel25', 1, 100, 'krążek 100 m', 420, 'ydy25', 100],
      ['Puszki podtynkowe', 'el_puszki', 1, 10, 'opak. 10 szt.', 15],
      ['Wyłącznik nadprądowy B16', 'el_obwody', 1, 1, 'szt.', 22, 'b16', 1],
      ['Gips szybkowiążący do bruzd', 'el_bruzdy', 0.3, 2, 'worek 2 kg', 12, 'gips_szpachlowy', 2]
    ]
  },
  hydraulik: {
    nazwa: 'Hydraulik', ikona: '🔧', opis: 'rury, kolana, trójniki', pokoje: false,
    przyklad: { tytul: 'Instalacja wod-kan w łazience', obmiary: { podejscia: '5', odcinki: [
      { nazwa: 'Woda zimna i ciepła', rodzaj: 'w', sr: '16', dl: '18', zakrety: '10', odgal: '4' },
      { nazwa: 'Odpływy umywalka i prysznic', rodzaj: 'k', sr: '50', dl: '6', zakrety: '4', odgal: '2' },
      { nazwa: 'Odpływ WC', rodzaj: 'k', sr: '110', dl: '3', zakrety: '2', odgal: '0' }] } },
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
      ['Rura wielowarstwowa Ø16', 'hy_rura_w16', 1, 25, 'zwój 25 m', 150, 'rura_pex16', 25],
      ['Kolano zaprasowywane Ø16', 'hy_kolana_w16', 1, 1, 'szt.', 12],
      ['Trójnik zaprasowywany Ø16', 'hy_troj_w16', 1, 1, 'szt.', 16],
      ['Rura kanalizacyjna PVC Ø50', 'hy_rura_k50', 1, 2, 'rura 2 m', 16],
      ['Kolano kanalizacyjne Ø50', 'hy_kolana_k50', 1, 1, 'szt.', 4, 'kolano_pvc50', 1],
      ['Trójnik kanalizacyjny Ø50', 'hy_troj_k50', 1, 1, 'szt.', 6],
      ['Rura kanalizacyjna PVC Ø110', 'hy_rura_k110', 1, 2, 'rura 2 m', 35],
      ['Kolano kanalizacyjne Ø110', 'hy_kolana_k110', 1, 1, 'szt.', 9],
      ['Otulina na rury wodne', 'hy_rura_woda', 1, 2, 'odcinek 2 m', 4]
    ]
  },
  suchazabudowa: {
    nazwa: 'Sucha zabudowa (GK)', ikona: '🧩', opis: 'płyty GK, profile, wełna', pokoje: false,
    przyklad: { tytul: 'Ścianka działowa z drzwiami', obmiary: { typ: 'sciana', dl: '4,2', wys: '2,6', warstwy: '1', welna: true }, pomin: ['Sufit podwieszany z płyt GK'] },
    robocizna: [
      ['Ścianka działowa z płyt GK (z profilami)', 'm²', 90, 'sz_pow'],
      ['Sufit podwieszany z płyt GK', 'm²', 110, 'sz_pow'],
      ['Szpachlowanie i szlifowanie spoin', 'm²', 25, 'sz_pow'],
      ['Montaż wełny', 'm²', 10, 'sz_welna_m2'],
      ['Montaż ościeżnicy w ściance', 'szt.', 150, 'reczna']
    ],
    materialy: [
      ['Płyta GK 12,5 mm (1,2×2,6 m)', 'sz_plyty_m2', 1, 3.12, 'płyta 3,12 m²', 67, 'plyta_gk', 3.12],
      ['Profil CW 50 (3 m)', 'sz_cw_mb', 1, 3, 'profil 3 m', 20, 'profil_cw50', 3],
      ['Profil UW 50 (3 m)', 'sz_uw_mb', 1, 3, 'profil 3 m', 17],
      ['Profil CD 60 (3 m)', 'sz_cd_mb', 1, 3, 'profil 3 m', 14, 'profil_cd60', 3],
      ['Profil UD 27 (3 m)', 'sz_ud_mb', 1, 3, 'profil 3 m', 12],
      ['Wieszaki do sufitu', 'sz_wieszaki', 1, 1, 'szt.', 2],
      ['Wkręty do GK', 'sz_wkrety', 1, 1000, 'opak. 1000 szt.', 45],
      ['Taśma spoinowa', 'sz_tasma_mb', 1, 45, 'rolka 45 m', 15],
      ['Masa szpachlowa do spoin', 'sz_masa_kg', 1, 25, 'worek 25 kg', 60, 'masa_spoinowa', 25],
      ['Wełna mineralna 5 cm', 'sz_welna_m2', 1, 6, 'paczka 6 m²', 60]
    ]
  },
  tynkarz: {
    nazwa: 'Tynkarz', ikona: '🏗', opis: 'tynk z grubości, grunt, narożniki', pokoje: true,
    przyklad: { tytul: 'Tynki gipsowe w domu', pom: [['Salon', '6', '5', '2,7', '6'], ['Kuchnia', '4', '3', '2,7', '2,5']], obmiary: { narozniki: '20' } },
    robocizna: [
      ['Tynk gipsowy maszynowy', 'm²', 35, 'ty_pow'],
      ['Gruntowanie', 'm²', 4, 'ty_pow'],
      ['Narożniki tynkarskie', 'mb', 8, 'ty_narozniki_mb']
    ],
    materialy: [
      ['Tynk gipsowy maszynowy', 'ty_kg', 1, 30, 'worek 30 kg', 38, 'tynk_gipsowy', 30],
      ['Grunt', 'ty_grunt_l', 1, 5, 'kanister 5 l', 30, 'grunt', 5],
      ['Narożnik aluminiowy 2,5 m', 'ty_narozniki_mb', 1, 2.5, 'szt. 2,5 m', 6]
    ]
  },
  murarz: {
    nazwa: 'Murarz', ikona: '🧱', opis: 'bloczki, pustaki, zaprawa', pokoje: false,
    przyklad: { tytul: 'Ściana z betonu komórkowego', obmiary: { dl: '8', wys: '2,7', otwory: '2' } },
    robocizna: [
      ['Murowanie ścian', 'm²', 85, 'mu_pow'],
      ['Montaż nadproża', 'szt.', 150, 'reczna']
    ],
    materialy: [
      ['Bloczki / pustaki', 'mu_szt', 1, 1, 'szt.', 9],
      ['Zaprawa', 'mu_zaprawa_kg', 1, 25, 'worek 25 kg', 29, 'zaprawa_murarska', 25]
    ]
  },
  ocieplenia: {
    nazwa: 'Ocieplenia i elewacje', ikona: '🏠', opis: 'styropian, klej, kołki, siatka, tynk', pokoje: false,
    przyklad: { tytul: 'Docieplenie domu 15 cm', obmiary: { pow: '160', otwory: '25', grub: '15' } },
    robocizna: [
      ['Docieplenie styropianem (bez tynku)', 'm²', 75, 'oc_pow'],
      ['Tynk cienkowarstwowy z gruntem', 'm²', 30, 'oc_pow'],
      ['Obróbka ościeży', 'mb', 40, 'reczna']
    ],
    materialy: [
      ['Styropian fasadowy', 'oc_styro_paczki', 1, 1, 'paczka 0,3 m³', 130],
      ['Klej do styropianu', 'oc_klej_styro_kg', 1, 25, 'worek 25 kg', 30, 'klej_styropian', 25],
      ['Klej do siatki', 'oc_klej_siatka_kg', 1, 25, 'worek 25 kg', 35, 'klej_styropian', 25],
      ['Łączniki do styropianu', 'oc_kolki', 1, 100, 'opak. 100 szt.', 64, 'kolki', 100],
      ['Siatka z włókna szklanego', 'oc_siatka_m2', 1, 50, 'rolka 50 m²', 150, 'siatka', 50],
      ['Tynk silikonowy', 'oc_tynk_kg', 1, 25, 'wiadro 25 kg', 190, 'tynk_silikonowy', 25],
      ['Grunt pod tynk', 'oc_grunt_kg', 1, 20, 'wiadro 20 kg', 120]
    ]
  },
  posadzkarz: {
    nazwa: 'Posadzkarz (wylewki)', ikona: '🪣', opis: 'jastrych z grubości, taśma, folia', pokoje: true,
    przyklad: { tytul: 'Wylewki w parterze', pom: [['Parter', '10', '8', '2,7', '0']], obmiary: { grub: '5' } },
    robocizna: [
      ['Wylewka cementowa (jastrych)', 'm²', 45, 'wy_m2'],
      ['Dylatacje i taśma brzegowa', 'mb', 5, 'wy_tasma_mb']
    ],
    materialy: [
      ['Jastrych cementowy', 'wy_kg', 1, 25, 'worek 25 kg', 16],
      ['Taśma brzegowa', 'wy_tasma_mb', 1, 25, 'rolka 25 m', 25],
      ['Folia budowlana', 'wy_folia_m2', 1, 50, 'rolka 50 m²', 60]
    ]
  },
  parkieciarz: {
    nazwa: 'Parkieciarz (cyklinowanie)', ikona: '🪵', opis: 'cyklinowanie, lakier w warstwach', pokoje: true,
    przyklad: { tytul: 'Cyklinowanie i lakierowanie', pom: [['Salon', '6', '4', '2,6', '0'], ['Korytarz', '4', '1,2', '2,6', '0']] },
    robocizna: [
      ['Cyklinowanie', 'm²', 30, 'pk_m2'],
      ['Lakierowanie (komplet warstw)', 'm²', 25, 'pk_m2']
    ],
    materialy: [
      ['Lakier do parkietu', 'pk_lakier_l', 1, 5, 'puszka 5 l', 400, 'lakier_parkiet', 5],
      ['Podkład do drewna', 'pk_podklad_l', 1, 5, 'puszka 5 l', 250]
    ]
  },
  co: {
    nazwa: 'Instalator CO / podłogówka', ikona: '🔥', opis: 'grzejniki, rury, pętle podłogówki', pokoje: true,
    przyklad: { tytul: 'Grzejniki i podłogówka w łazience', pom: [['Łazienka', '2,5', '2', '2,6', '1,6']], obmiary: { grzejniki: '6', podlTak: true } },
    robocizna: [
      ['Montaż grzejnika z podłączeniem', 'szt.', 350, 'co_grzejniki'],
      ['Ogrzewanie podłogowe (ułożenie rur)', 'm²', 70, 'co_podl_m2'],
      ['Montaż rozdzielacza', 'szt.', 600, 'reczna']
    ],
    materialy: [
      ['Rura wielowarstwowa Ø16 (grzejniki)', 'co_rura_grz_mb', 1, 25, 'zwój 25 m', 150, 'rura_pex16', 25],
      ['Rura do ogrzewania podłogowego Ø16', 'co_podl_rura_mb', 1, 200, 'zwój 200 m', 450, 'rura_podlogowka', 200],
      ['Izolacja pod podłogówkę', 'co_izolacja_m2', 1, 1, 'm²', 25],
      ['Taśma brzegowa', 'co_tasma_mb', 1, 25, 'rolka 25 m', 25],
      ['Sekcja rozdzielacza', 'co_petle', 1, 1, 'sekcja', 120]
    ]
  },
  dekarz: {
    nazwa: 'Dekarz', ikona: '🏚', opis: 'pokrycie, membrana, łaty, kalenica', pokoje: false,
    przyklad: { tytul: 'Wymiana pokrycia dachu', obmiary: { pow: '140', kalenica: '11', typ: 'blacha' } },
    robocizna: [
      ['Krycie dachu', 'm²', 70, 'de_m2'],
      ['Membrana, łaty i kontrłaty', 'm²', 25, 'de_m2'],
      ['Obróbka kalenicy', 'mb', 60, 'de_gasiory_mb'],
      ['Demontaż starego pokrycia', 'm²', 20, 'reczna']
    ],
    materialy: [
      ['Blachodachówka', 'de_pokrycie_m2', 1, 1, 'm²', 45],
      ['Dachówka ceramiczna', 'de_dachowki_szt', 1, 1, 'szt.', 6],
      ['Membrana dachowa', 'de_membrana_m2', 1, 75, 'rolka 75 m²', 280],
      ['Łaty 4 m', 'de_laty_mb', 1, 4, 'łata 4 m', 14],
      ['Kontrłaty 4 m', 'de_kontrlaty_mb', 1, 4, 'kontrłata 4 m', 12],
      ['Gąsiory / obróbka kalenicy', 'de_gasiory_mb', 1, 1, 'mb', 45]
    ]
  },
  brukarz: {
    nazwa: 'Brukarz', ikona: '🛣', opis: 'kostka, podbudowa, krawężniki', pokoje: false,
    przyklad: { tytul: 'Podjazd z kostki brukowej', obmiary: { pow: '60', kraweznik: '12', obrzeze: '30' } },
    robocizna: [
      ['Układanie kostki brukowej', 'm²', 70, 'br_m2'],
      ['Korytowanie z wywozem', 'm³', 90, 'br_korytowanie_m3'],
      ['Montaż krawężników', 'mb', 40, 'br_kraweznik_mb'],
      ['Montaż obrzeży', 'mb', 30, 'br_obrzeze_mb']
    ],
    materialy: [
      ['Kostka brukowa 6 cm', 'br_kostka_m2', 1, 1, 'm²', 45],
      ['Kruszywo na podbudowę', 'br_podbudowa_t', 1, 1, 't', 90],
      ['Podsypka cementowo-piaskowa', 'br_podsypka_t', 1, 1, 't', 140],
      ['Krawężnik 1 m', 'br_kraweznik_mb', 1, 1, 'szt. 1 m', 25],
      ['Obrzeże 1 m', 'br_obrzeze_mb', 1, 1, 'szt. 1 m', 12]
    ]
  },
  stolarka: {
    nazwa: 'Montaż okien i drzwi', ikona: '🚪', opis: 'okna, drzwi, parapety, pianka', pokoje: false,
    przyklad: { tytul: 'Wymiana okien i drzwi', obmiary: { okna: '6', drzwiWew: '4', drzwiZew: '1', parapety: '8' } },
    robocizna: [
      ['Montaż okna', 'szt.', 300, 'st_okna'],
      ['Montaż drzwi wewnętrznych', 'szt.', 250, 'st_drzwi_wew'],
      ['Montaż drzwi zewnętrznych', 'szt.', 450, 'st_drzwi_zew'],
      ['Montaż parapetów', 'mb', 80, 'st_parapety_mb'],
      ['Demontaż starej stolarki', 'szt.', 80, 'reczna']
    ],
    materialy: [
      ['Pianka montażowa', 'st_pianka_szt', 1, 1, 'puszka 750 ml', 32, 'pianka', 1],
      ['Taśma okienna', 'st_tasma_mb', 1, 10, 'rolka 10 m', 60],
      ['Kotwy i kliny', 'st_okna', 1, 1, 'kpl', 25]
    ]
  },
  ogolne: {
    nazwa: 'Złota rączka / prace ogólne', ikona: '🛠', opis: 'godziny, dojazd, drobne naprawy', pokoje: false,
    przyklad: { tytul: 'Drobne naprawy w mieszkaniu', obmiary: { godziny: '6', km: '30', punkty: '5' } },
    robocizna: [
      ['Godzina pracy', 'h', 80, 'zr_h'],
      ['Dojazd', 'km', 2, 'zr_km'],
      ['Drobna naprawa (punkt)', 'szt.', 60, 'zr_punkty'],
      ['Wniesienie materiałów', 'kpl', 100, 'reczna'],
      ['Sprzątanie po pracach', 'kpl', 150, 'reczna']
    ],
    materialy: []
  }
};
if (typeof module !== 'undefined') module.exports = WF_CENNIKI;

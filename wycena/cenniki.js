// Cenniki startowe — PRZYKŁADOWE ceny i zużycia, do edycji przez fachowca.
// baza: podloga | sciany | sufit | obwod | reczna ; zuzycie = ile jednostek materiału na 1 jednostkę bazy
var WF_CENNIKI = {
  glazurnik: {
    nazwa: 'Glazurnik',
    robocizna: [
      ['Układanie płytek — podłoga', 'm²', 100, 'podloga'],
      ['Układanie płytek — ściany', 'm²', 110, 'sciany'],
      ['Gruntowanie podłoża', 'm²', 5, 'podloga'],
      ['Hydroizolacja (folia w płynie)', 'm²', 40, 'reczna'],
      ['Cokoliki z płytek', 'mb', 35, 'obwod'],
      ['Szlifowanie narożników 45°', 'mb', 70, 'reczna'],
      ['Montaż odpływu liniowego', 'szt.', 350, 'reczna'],
      ['Skucie starych płytek', 'm²', 35, 'reczna'],
      ['Wywóz gruzu', 'kpl', 300, 'reczna']
    ],
    materialy: [
      ['Płytki (zapas 10%)', 'podloga', 1.1, 1.44, 'karton 1,44 m²', 90],
      ['Klej elastyczny C2TE', 'podloga', 5, 25, 'worek 25 kg', 55],
      ['Fuga', 'podloga', 0.5, 5, 'opak. 5 kg', 70],
      ['Grunt', 'podloga', 0.2, 5, 'kanister 5 l', 55]
    ]
  },
  malarz: {
    nazwa: 'Malarz',
    robocizna: [
      ['Malowanie ścian (2 warstwy)', 'm²', 18, 'sciany'],
      ['Malowanie sufitu (2 warstwy)', 'm²', 22, 'sufit'],
      ['Gruntowanie ścian', 'm²', 4, 'sciany'],
      ['Gładź gipsowa ścian', 'm²', 35, 'sciany'],
      ['Zabezpieczenie folią i taśmą', 'm²', 4, 'podloga'],
      ['Montaż listew przysufitowych', 'mb', 25, 'obwod']
    ],
    materialy: [
      ['Farba ścienna (2 warstwy)', 'sciany', 0.28, 10, 'wiadro 10 l', 190],
      ['Farba sufitowa (2 warstwy)', 'sufit', 0.3, 10, 'wiadro 10 l', 130],
      ['Grunt', 'sciany', 0.15, 5, 'kanister 5 l', 50],
      ['Gładź gotowa', 'sciany', 1.2, 20, 'wiadro 20 kg', 60],
      ['Folia i taśma malarska', 'podloga', 1.1, 20, 'zestaw 20 m²', 35]
    ]
  },
  podlogi: {
    nazwa: 'Podłogi i panele',
    robocizna: [
      ['Montaż paneli z podkładem', 'm²', 35, 'podloga'],
      ['Listwy przypodłogowe', 'mb', 20, 'obwod'],
      ['Wylewka samopoziomująca', 'm²', 30, 'podloga'],
      ['Demontaż starej podłogi', 'm²', 12, 'reczna'],
      ['Montaż listew progowych', 'szt.', 30, 'reczna']
    ],
    materialy: [
      ['Panele (zapas 8%)', 'podloga', 1.08, 2.2, 'paczka 2,2 m²', 110],
      ['Podkład pod panele', 'podloga', 1.05, 10, 'rolka 10 m²', 50],
      ['Listwy przypodłogowe (zapas 10%)', 'obwod', 1.1, 2.5, 'listwa 2,5 m', 30],
      ['Masa samopoziomująca (ok. 3 mm)', 'podloga', 4.5, 25, 'worek 25 kg', 65]
    ]
  },
  instalacje: {
    nazwa: 'Hydraulik / elektryk / ogólne',
    robocizna: [
      ['Punkt elektryczny (gniazdo, włącznik)', 'szt.', 120, 'reczna'],
      ['Punkt hydrauliczny', 'szt.', 250, 'reczna'],
      ['Montaż WC podwieszanego ze stelażem', 'szt.', 450, 'reczna'],
      ['Montaż umywalki z baterią', 'szt.', 200, 'reczna'],
      ['Montaż kabiny prysznicowej', 'szt.', 400, 'reczna'],
      ['Godzina pracy', 'h', 80, 'reczna'],
      ['Dojazd', 'kpl', 50, 'reczna']
    ],
    materialy: []
  }
};
if (typeof module !== 'undefined') module.exports = WF_CENNIKI;

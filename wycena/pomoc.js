// Wycena Fachowca — chmurki „co wpisać?” przy polach (Adrian, 2.11.2026).
// PC: najechanie na pole pokazuje małą, półprzezroczystą chmurkę; najechanie na chmurkę = pełny kolor; klik = duża chmurka z opisem i ✕.
// Telefon: stuknięcie w pole pokazuje chmurkę; stuknięcie w chmurkę otwiera opis.
// Opis szukany po etykiecie pola (bez gwiazdek legendy), potem po początku etykiety, potem po kluczu pola.
(function () {
  var OPISY = {
    // ---- start ----
    'Nazwa firmy albo imię i nazwisko (na ofercie)': 'Tak podpiszesz się na każdej ofercie. Wpisz nazwę firmy, a jeśli jej nie masz — swoje imię i nazwisko.\nPrzykład: Usługi Remontowe Jan Kowalski',
    'Telefon': 'Twój numer telefonu. Pokaże się na ofercie, żeby klient mógł od razu zadzwonić.\nPrzykład: 600 100 200',
    // ---- klient i zlecenie ----
    'Czego dotyczy oferta': 'Krótki tytuł roboty. Pojawi się na górze oferty i na liście ofert, żebyś łatwo ją znalazł.\nPrzykład: Remont łazienki 6 m²',
    'Imię i nazwisko klienta': 'Dla kogo robisz ofertę. Klient zobaczy to na ofercie.\nPrzykład: Anna Nowak',
    'Telefon klienta': 'Numer klienta. Przyda się, żeby wysłać mu ofertę SMS-em albo WhatsAppem i zadzwonić.\nPrzykład: 501 234 567',
    'Data oferty': 'Dzień, w którym robisz ofertę. Od tej daty liczy się, jak długo oferta jest ważna. Zwykle zostaw dzisiejszą.',
    'Adres robót': 'Gdzie będziesz pracował. Pokaże się na ofercie.\nPrzykład: ul. Lipowa 5/12, Wrocław',
    'Termin realizacji': 'Kiedy zrobisz robotę albo ile to potrwa. Pisz po ludzku, tak jak powiedziałbyś klientowi.\nPrzykład: 3–5 dni roboczych od 10.11',
    'Status': 'Na jakim etapie jest oferta: wysłana, zaakceptowana, odrzucona albo wykonana. Tylko dla Ciebie — klient tego nie widzi. Pomaga ogarnąć listę ofert.',
    // ---- pomieszczenia ----
    'Długość': 'Długość pomieszczenia w metrach (dłuższa ściana). Część dziesiętną wpisz po przecinku.\nPrzykład: 4,2',
    'Szerokość': 'Szerokość pomieszczenia w metrach (krótsza ściana).\nPrzykład: 3,1',
    'Wysokość': 'Wysokość od podłogi do sufitu w metrach. Potrzebna do policzenia ścian.\nPrzykład: 2,6',
    'Okna/drzwi m²': 'Ile metrów kwadratowych zajmują okna i drzwi w tym pomieszczeniu. Odejmę je od ścian. Policz szerokość × wysokość każdego otworu i dodaj.\nPrzykład: okno 1,2×1,5 + drzwi 0,9×2 = 3,6',
    'nazwa:pomieszczenia': 'Nazwa pomieszczenia — żebyś wiedział, które to jest, i żeby klient zobaczył ją w ofercie.\nPrzykład: Łazienka, Salon, Kuchnia',
    // ---- elektryk ----
    'Gniazda (szt.)': 'Ile gniazdek zakładasz lub wymieniasz. Podwójne gniazdo liczysz jako 1 punkt.\nPrzykład: 12',
    'Włączniki (szt.)': 'Ile włączników światła montujesz.\nPrzykład: 6',
    'Punkty świetlne (szt.)': 'Ile miejsc na lampy (sufitowe, kinkiety, oczka).\nPrzykład: 8',
    'Śr. przewód na punkt (m)': 'Średnio ile metrów przewodu idzie na jeden punkt — od puszki albo rozdzielnicy do gniazdka, włącznika lub lampy, razem z zejściem po ścianie. Zwykle 5–8 m.\nPrzykład: 6',
    'Zapas przewodu %': 'Ile procent przewodu dołożyć na zapas i odpady. Zwykle 10.\nPrzykład: 10',
    'Obwody (szt.)': 'Ile osobnych obwodów (bezpieczników) idzie z rozdzielnicy.\nPrzykład: 5',
    // ---- hydraulik ----
    'nazwa:odcinki': 'Nazwa odcinka rury, żebyś wiedział, co to za kawałek.\nPrzykład: Woda do kuchni, Odpływ wanny',
    'Rodzaj': 'Czy ten odcinek to rura do wody, czy kanalizacja. Od tego zależą dostępne średnice.',
    'Średnica': 'Średnica rury w milimetrach (Ø). Wybierz z listy taką, jaką kładziesz.',
    'Długość (m)': 'Długość tego odcinka rury w metrach.\nPrzykład: 7,5',
    'Zakręty (kolana)': 'Ile razy rura skręca na tym odcinku — każdy zakręt to jedno kolano.\nPrzykład: 4',
    'Odgałęzienia (trójniki)': 'Ile razy od tej rury odchodzi inna — każde odgałęzienie to jeden trójnik.\nPrzykład: 2',
    'Podejścia / punkty (szt.)': 'Ile podłączeń przygotowujesz: umywalka, WC, prysznic, pralka, zlew itp.\nPrzykład: 5',
    'Zapas rur %': 'Ile procent rur dołożyć na zapas i docinki. Zwykle 10.\nPrzykład: 10',
    // ---- glazurnik ----
    'Płytka: dł. (cm)': 'Długość jednej płytki w centymetrach — jest na pudełku.\nPrzykład: 60',
    'szer. (cm)': 'Szerokość jednej płytki w centymetrach — jest na pudełku.\nPrzykład: 30',
    'Grubość (mm)': 'Grubość płytki w milimetrach (na pudełku). Potrzebna do policzenia fugi.\nPrzykład: 9',
    'Układ': 'Jak kładziesz płytki. Od układu zależy zapas na docinki: prosto mniej, po skosie albo w jodełkę więcej.',
    'Wysokość glazury (m) — puste = do sufitu': 'Do jakiej wysokości kładziesz płytki na ścianach, w metrach. Zostaw puste, jeśli do samego sufitu.\nPrzykład: 2,1',
    'Szerokość fugi (mm)': 'Odstęp między płytkami w milimetrach. Zwykle 2–3.\nPrzykład: 2',
    'Paca zębata': 'Jaką pacą rozprowadzasz klej. Większy ząb = więcej kleju na m². Duże płytki zwykle 10–12 mm.',
    // ---- malarz ----
    'Warstwy farby': 'Ile razy malujesz. Zwykle 2.\nPrzykład: 2',
    'Wydajność (m²/l)': 'Ile metrów kwadratowych pomalujesz 1 litrem farby na jedną warstwę. Jest na wiadrze, zwykle 8–12.\nPrzykład: 10',
    'Gruntowanie (warstwy)': 'Ile razy gruntujesz przed malowaniem. 0 = bez gruntu, zwykle 1.\nPrzykład: 1',
    'Grubość gładzi (mm)': 'Średnia grubość gładzi w milimetrach. Zwykle 1–3.\nPrzykład: 2',
    'Rodzaj gładzi': 'Jakiej gładzi używasz. Od rodzaju zależy, ile kg idzie na m².',
    // ---- podłogi ----
    'Drzwi (szt.)': 'Ile drzwi jest w pomieszczeniu. Odejmę ich szerokość od listew i doliczę progi.\nPrzykład: 1',
    'Zapas paneli %': 'Ile procent paneli dołożyć na docinki. Prosto zwykle 5–7, po skosie około 10–15.\nPrzykład: 7',
    'Narożniki (szt.)': 'Ile narożników do listew przypodłogowych. Zostaw puste — policzę 4 na pokój.\nPrzykład: 6',
    // ---- sucha zabudowa ----
    'Co budujesz?': 'Wybierz, co stawiasz: ściankę działową (płyty z obu stron), zabudowę ściany (płyty z jednej strony) albo sufit podwieszany. Od tego zależą profile i ilość płyt.',
    'Powierzchnia sufitu (m²)': 'Powierzchnia sufitu podwieszanego w m² (długość × szerokość).\nPrzykład: 18',
    'Obwód sufitu (mb)': 'Obwód sufitu w metrach — długość wszystkich ścian dookoła. Zostaw puste, to policzę sam.\nPrzykład: 17',
    'Długość ściany (m)': 'Długość ściany w metrach.\nPrzykład: 4,5',
    'Wysokość (m)': 'Wysokość ściany w metrach.\nPrzykład: 2,7',
    'Warstwy płyt (1 lub 2)': 'Ile warstw płyt z każdej strony. Zwykle 1, a 2 tam, gdzie ma być mocniej albo ciszej.\nPrzykład: 1',
    // ---- tynkarz ----
    'Grubość tynku (mm)': 'Średnia grubość tynku w milimetrach. Zwykle 10–15.\nPrzykład: 12',
    'Rodzaj tynku': 'Gipsowy czy cementowo-wapienny. Od rodzaju zależy, ile kg idzie na m².',
    'Narożniki (mb)': 'Ile metrów narożników (listew narożnych) zakładasz na rogi ścian.\nPrzykład: 10',
    // ---- murarz ----
    'Otwory (m²)': 'Ile m² zajmą okna i drzwi w tej ścianie. Odejmę je od muru.\nPrzykład: 4,2',
    'Z czego murujesz?': 'Materiał ściany. Po wyborze wpiszę orientacyjne ilości sztuk i zaprawy — możesz je poprawić.',
    'Sztuk na 1 m² ściany': 'Ile bloczków albo pustaków idzie na 1 m² ściany. Jest u producenta.\nPrzykład: 8',
    'Zaprawa (kg na 1 m²)': 'Ile kg zaprawy lub kleju idzie na 1 m² ściany. Jest na worku lub u producenta.\nPrzykład: 6',
    // ---- ocieplenia ----
    'Ściany do ocieplenia (m²)': 'Powierzchnia ścian do ocieplenia w m², razem z oknami (odejmę je w polu obok).\nPrzykład: 140',
    'Okna i drzwi (m²)': 'Ile m² zajmują okna i drzwi na ocieplanych ścianach.\nPrzykład: 22',
    'Grubość styropianu (cm)': 'Grubość płyt styropianu w centymetrach.\nPrzykład: 15',
    'Klej do styropianu (kg/m²)': 'Ile kg kleju idzie na 1 m² przyklejanego styropianu. Zwykle 4–5. Jest na worku.\nPrzykład: 4,5',
    'Kołki (szt./m²)': 'Ile kołków wbijasz na 1 m². Zwykle 4–6.\nPrzykład: 6',
    'Klej do siatki (kg/m²)': 'Ile kg kleju idzie na 1 m² przy zatapianiu siatki. Zwykle 3–4.\nPrzykład: 3,5',
    'Tynk (kg/m²)': 'Ile kg tynku cienkowarstwowego idzie na 1 m². Jest na wiadrze, zwykle 2,5–3,5.\nPrzykład: 3',
    // ---- posadzkarz ----
    'Grubość wylewki (cm)': 'Średnia grubość wylewki w centymetrach.\nPrzykład: 5',
    'Zużycie (kg na m² na 1 cm)': 'Ile kg suchej mieszanki idzie na 1 m² przy grubości 1 cm. Jest na worku, jastrych cementowy zwykle około 20.\nPrzykład: 20',
    // ---- parkieciarz ----
    'Warstwy lakieru': 'Ile warstw lakieru kładziesz. Zwykle 3.\nPrzykład: 3',
    'Wydajność lakieru (m²/l)': 'Ile m² pokryjesz 1 litrem lakieru na jedną warstwę. Jest na puszce, zwykle 8–10.\nPrzykład: 9',
    // ---- CO ----
    'Grzejniki (szt.)': 'Ile grzejników montujesz.\nPrzykład: 6',
    'Rura na 1 grzejnik (m, zasilanie + powrót)': 'Średnio ile metrów rury idzie na jeden grzejnik, liczone razem zasilanie i powrót.\nPrzykład: 10',
    'Rozstaw rur (cm)': 'Co ile centymetrów kładziesz pętle podłogówki. Zwykle 10–20, najczęściej 15.\nPrzykład: 15',
    // ---- dekarz ----
    'Powierzchnia dachu (m²)': 'Powierzchnia połaci dachu w m² (wszystkie połacie razem, po skosie).\nPrzykład: 160',
    'Długość kalenicy (mb)': 'Długość kalenicy — najwyższej krawędzi dachu — w metrach.\nPrzykład: 12',
    'Pokrycie': 'Czym kryjesz dach: blachodachówka, dachówka albo papa. Od tego zależą materiały.',
    'Dachówek na 1 m²': 'Ile dachówek idzie na 1 m² dachu. Jest u producenta, zwykle 10–15.\nPrzykład: 12',
    // ---- brukarz ----
    'Powierzchnia (m²)': 'Powierzchnia do wyłożenia kostką w m².\nPrzykład: 80',
    'Podbudowa (cm)': 'Grubość warstwy kruszywa pod kostką w centymetrach. Pod chodnik zwykle 15–20, pod podjazd 25–30.\nPrzykład: 20',
    'Podsypka (cm)': 'Grubość podsypki (piasek lub grys) pod kostką w centymetrach. Zwykle 3–5.\nPrzykład: 4',
    'Krawężniki (mb)': 'Ile metrów krawężników ustawiasz.\nPrzykład: 30',
    'Obrzeża (mb)': 'Ile metrów obrzeży (cienkich krawężników) ustawiasz.\nPrzykład: 25',
    // ---- okna i drzwi ----
    'Okna (szt.)': 'Ile okien montujesz.\nPrzykład: 5',
    'Parapety (mb)': 'Ile metrów parapetów zakładasz (suma długości).\nPrzykład: 6',
    'Drzwi wewnętrzne (szt.)': 'Ile drzwi wewnętrznych montujesz.\nPrzykład: 4',
    'Drzwi zewnętrzne (szt.)': 'Ile drzwi wejściowych lub balkonowych montujesz.\nPrzykład: 1',
    // ---- złota rączka ----
    'Godziny pracy': 'Ile godzin zajmie robota.\nPrzykład: 6',
    'Dojazd (km)': 'Ile kilometrów dojazdu doliczasz.\nPrzykład: 20',
    'Drobne naprawy (szt.)': 'Ile drobnych napraw robisz (np. kapiący kran, zawias, gniazdko).\nPrzykład: 3',
    // ---- robocizna i materiały w ofercie ----
    'nazwa:pozycje': 'Nazwa pracy, tak jak zobaczy ją klient w ofercie. Możesz ją zmienić.\nPrzykład: Układanie płytek na podłodze',
    'nazwa:materialy': 'Nazwa materiału, tak jak zobaczy ją klient w ofercie.\nPrzykład: Klej elastyczny C2TE',
    'Cena za j.m.': 'Ile bierzesz za jedną jednostkę tej pracy (za m², metr, sztukę…), w złotych.\nPrzykład: 120',
    'J.m.': 'Jednostka miary: w czym liczysz tę pracę — m², mb (metr bieżący), szt., kpl (komplet), h (godzina).\nPrzykład: m²',
    'Liczone od': 'Z czego aplikacja ma wziąć ilość: np. z podłogi, ścian albo sufitu pomieszczeń, z wyników karty fachu w „Pomiary”. „Ręcznie” = wpiszesz ilość sam.',
    'Które pomieszczenie': 'Czy ta pozycja dotyczy wszystkich pomieszczeń, czy tylko jednego. Ilość weźmie się tylko z wybranego.',
    'Ilość': 'Ile tego jest — wpisujesz sam, w jednostce tej pozycji.\nPrzykład: 14,5',
    'Ilość (': 'Ile tego potrzeba — wpisujesz sam, w podanej jednostce.\nPrzykład: 14,5',
    'Zużycie na 1 ': 'Ile tego materiału idzie na jedną jednostkę (np. na 1 m² podłogi). Jest na opakowaniu producenta.\nPrzykład: 5 (kg kleju na m²)',
    'Zużycie na 1 szt.': 'Ile tego materiału idzie na jedną sztukę.\nPrzykład: 1',
    'Mnożnik ilości': 'Przez ile pomnożyć ilość wyliczoną z pomiarów. Wpisz 1, żeby kupić dokładnie tyle, ile wyszło.\nPrzykład: 1',
    'Opakowanie (np. rolka 75 m²)': 'Jak sprzedają ten materiał — opisz opakowanie. Pokaże się w ofercie przy liście zakupów.\nPrzykład: worek 25 kg, wiadro 10 l, rolka 75 m²',
    'Opakowanie': 'Jak sprzedają ten materiał — opisz opakowanie.\nPrzykład: worek 25 kg, wiadro 10 l',
    'Ile w 1 opakowaniu': 'Ile jednostek jest w jednym opakowaniu. Z tego policzę, ile opakowań kupić.\nPrzykład: 25 (kg w worku)',
    'Ile ': 'Ile jednostek jest w jednym opakowaniu. Z tego policzę, ile opakowań kupić.\nPrzykład: 25',
    'Ilość w opakowaniu': 'Ile jednostek jest w jednym opakowaniu. Z tego policzę, ile opakowań kupić.\nPrzykład: 25 (kg w worku)',
    'Cena za 1 opakowanie': 'Ile kosztuje jedno opakowanie, w złotych.\nPrzykład: 42,99',
    'Cena za opakowanie': 'Ile kosztuje jedno opakowanie, w złotych. Gdy ją zmienisz, aplikacja nie będzie jej już sama aktualizować.\nPrzykład: 42,99',
    'Dodaj z cennika': 'Wybierz pracę z Twojego cennika — doda się do oferty z Twoją stawką, a ilość policzy się z pomiarów. Na dole listy jest „pozycja spoza cennika”.',
    'Dodaj materiał': 'Wybierz materiał z listy — doda się do oferty, a ilość policzy się z pomiarów. Na dole jest „materiał spoza listy”.',
    // ---- warunki ----
    'Rabat na robociznę %': 'Ile procent upustu dajesz klientowi od robocizny. 0 albo puste = bez rabatu.\nPrzykład: 5',
    'VAT': 'Stawka VAT na ofercie. „Zwolniony”, jeśli nie jesteś płatnikiem VAT. 8% zwykle przy remontach mieszkań, 23% w innych przypadkach — sprawdź z księgową.',
    'Zaliczka %': 'Ile procent wartości klient płaci z góry. 0 = bez zaliczki.\nPrzykład: 30',
    'Oferta ważna (dni)': 'Przez ile dni trzymasz te ceny. Po tym czasie możesz je zmienić.\nPrzykład: 14',
    'Uwagi do tej oferty': 'Dodatkowe informacje tylko do tej oferty — pokażą się klientowi na dole.\nPrzykład: Wywóz gruzu po stronie klienta.',
    // ---- cennik ----
    'nazwa:cennik': 'Nazwa pracy w Twoim cenniku — tak pokaże się w ofertach.\nPrzykład: Gruntowanie ścian',
    'nazwa:katMat': 'Nazwa materiału w Twoim katalogu.\nPrzykład: Gładź polimerowa',
    'Cena': 'Twoja stawka za jednostkę tej pracy, w złotych. Działa dla nowych pozycji w ofertach.\nPrzykład: 35',
    // ---- ustawienia ----
    'Nazwa firmy': 'Nazwa Twojej firmy — będzie na każdej ofercie.\nPrzykład: Usługi Remontowe Kowalski',
    'Imię i nazwisko': 'Twoje imię i nazwisko — podpis na ofercie.\nPrzykład: Jan Kowalski',
    'E-mail': 'Twój adres e-mail na ofercie. Nieobowiązkowo.\nPrzykład: jan@remonty.pl',
    'NIP': 'Twój NIP, jeśli masz firmę. Nieobowiązkowo.\nPrzykład: 1234567890',
    'Numer konta': 'Numer konta do przelewu zaliczki i zapłaty — pokaże się na ofercie. Nieobowiązkowo.\nPrzykład: 12 3456 7890 1234 5678 9012 3456',
    'Adres': 'Adres firmy na ofercie. Nieobowiązkowo.\nPrzykład: ul. Polna 3, 50-001 Wrocław',
    'Ważność (dni)': 'Domyślnie ile dni ważna jest każda nowa oferta.\nPrzykład: 14',
    'Stały tekst na ofercie': 'Tekst, który pokaże się na każdej ofercie, np. warunki gwarancji albo płatności.\nPrzykład: Gwarancja 24 miesiące. Płatność przelewem w 7 dni.',
    'kod': 'Kod odblokowania z pliku, który dostałeś po zakupie.\nPrzykład: WF-AB12-CD34',
    // ---- masz pomysł ----
    'Twój fach (nieobowiązkowo)': 'Czym się zajmujesz — żebyśmy lepiej zrozumieli propozycję.\nPrzykład: glazurnik',
    'Wiadomość': 'Napisz, co zmienić albo dodać w aplikacji. Każda uwaga się liczy.',
    'Telefon lub e-mail (nieobowiązkowo, jeśli chcesz odpowiedź)': 'Zostaw kontakt, jeśli chcesz, żebyśmy odpisali. Nieobowiązkowo.'
  };
  var CO = 'co wpisać?';
  var maly, duzy, pole = null, ukryj = null;
  var myszEkran = window.matchMedia && matchMedia('(hover:hover) and (pointer:fine)').matches, dotyk = false;
  function mysz() { return myszEkran && !dotyk; } // ostatnie dotknięcie palcem = tryb telefonu (także laptopy z ekranem dotykowym)
  document.addEventListener('pointerdown', function (e) { dotyk = e.pointerType === 'touch'; }, true);

  function wlasciwe(el) {
    if (!el || !el.matches || !el.matches('input,select,textarea')) return false;
    if (el.type === 'checkbox' || el.type === 'radio' || el.type === 'file' || el.hidden) return false;
    return !el.closest('.dok,#cwD');
  }
  function etykieta(el) {
    var c = el.parentNode, l = c && [].filter.call(c.children, function (x) { return x.tagName === 'LABEL' && !x.classList.contains('chk') && !x.classList.contains('fk'); });
    if (l && l.length) { // etykieta tuż przed polem
      var przed = null; [].forEach.call(c.children, function (x) { if (x === el || (x.contains && x.contains(el))) return; if (x.tagName === 'LABEL' && x.compareDocumentPosition(el) & 4) przed = x; });
      if (przed && !przed.classList.contains('chk')) return przed.textContent;
    }
    var p = el.previousElementSibling; return p && p.tagName === 'LABEL' && !p.classList.contains('chk') ? p.textContent : '';
  }
  function czysc(t) { return (t || '').replace(/\*+/g, '').replace(/\s+/g, ' ').trim(); }
  function znajdz(el) {
    var et = czysc(etykieta(el)), orig = et;
    try { var e = JSON.parse(localStorage.getItem('wycenaEtykiety')) || {}; Object.keys(e).forEach(function (k) { if (e[k] === et) orig = k; }); } catch (x) {}
    if (OPISY[orig]) return { t: orig, o: OPISY[orig] };
    var pre = Object.keys(OPISY).filter(function (k) { return orig.indexOf(k) === 0; }).sort(function (a, b) { return b.length - a.length; })[0];
    if (pre) return { t: orig, o: OPISY[pre] };
    var sc = el.getAttribute('data-p') || el.getAttribute('data-c') || '';
    if (/\.nazwa$/.test(sc)) { var g = sc.split('.'); var kl = g.indexOf('odcinki') >= 0 ? 'odcinki' : g[0]; if (OPISY['nazwa:' + kl]) return { t: 'Nazwa', o: OPISY['nazwa:' + kl] }; }
    if (el.id && OPISY[el.id]) return { t: el.placeholder || 'Kod', o: OPISY[el.id] };
    if (el.id === 'zCen') return { t: 'Dodaj z cennika', o: OPISY['Dodaj z cennika'] };
    if (el.id === 'zMat') return { t: 'Dodaj materiał', o: OPISY['Dodaj materiał'] };
    return orig ? { t: orig, o: 'Wpisz tutaj: ' + orig.toLowerCase() + '. Liczby z częścią dziesiętną wpisuj po przecinku, np. 2,5.' } : null;
  }
  function budujMaly() {
    maly = document.createElement('button'); maly.type = 'button'; maly.id = 'cwM'; maly.className = 'cwm bezleg'; maly.textContent = '💬 ' + CO; maly.setAttribute('aria-label', 'Co wpisać w to pole?');
    maly.addEventListener('pointerdown', function (e) { e.preventDefault(); }); // nie zabieraj fokusu polu przed kliknięciem
    maly.addEventListener('mouseenter', function () { clearTimeout(ukryj); maly.classList.add('mocny'); });
    maly.addEventListener('mouseleave', function () { maly.classList.remove('mocny'); if (mysz()) planujUkrycie(); }); // na telefonie stuknięcie udaje ruch myszy — nie chowaj
    maly.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); otworz(); });
    document.body.appendChild(maly);
  }
  function pokaz(el) {
    var d = znajdz(el); if (!d) return;
    if (!maly) budujMaly();
    clearTimeout(ukryj); pole = el; maly._d = d;
    var r = el.getBoundingClientRect();
    maly.style.display = 'block';
    var w = maly.offsetWidth, h = maly.offsetHeight;
    var x = Math.max(6, Math.min(window.innerWidth - w - 6, r.right - w - 4)), y = r.top - h + 6;
    if (y < 4) y = r.bottom - 6;
    maly.style.left = (x + window.scrollX) + 'px'; maly.style.top = (y + window.scrollY) + 'px';
  }
  function schowaj() { if (maly) { maly.style.display = 'none'; maly.classList.remove('mocny'); } pole = null; }
  function planujUkrycie() { clearTimeout(ukryj); ukryj = setTimeout(function () { if (!maly || !maly.matches(':hover')) schowaj(); }, mysz() ? 350 : 250); }
  function otworz() {
    var d = maly && maly._d; if (!d) return;
    if (!mysz() && document.activeElement && document.activeElement.blur) document.activeElement.blur(); // schowaj klawiaturę telefonu
    schowaj();
    if (!duzy) {
      duzy = document.createElement('div'); duzy.id = 'cwD'; duzy.className = 'cwd bezleg';
      duzy.innerHTML = '<div class="cwk" role="dialog" aria-modal="true" aria-labelledby="cwT"><button type="button" class="cwx" aria-label="Zamknij">✕</button><div class="cwe">💬 Co wpisać?</div><h3 id="cwT"></h3><p></p></div>';
      duzy.addEventListener('click', function (e) { if (e.target === duzy || e.target.closest('.cwx')) zamknij(); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && duzy.style.display === 'flex') zamknij(); });
      document.body.appendChild(duzy);
    }
    duzy.querySelector('h3').textContent = d.t;
    var p = duzy.querySelector('p'); p.textContent = '';
    d.o.split('\n').forEach(function (l, i) { if (i) p.appendChild(document.createElement('br')); if (/^Przykład:/.test(l)) { var b = document.createElement('span'); b.className = 'cwp'; b.textContent = l; p.appendChild(b); } else p.appendChild(document.createTextNode(l)); });
    duzy.style.display = 'flex'; duzy.querySelector('.cwx').focus();
  }
  function zamknij() { duzy.style.display = 'none'; }

  {
    document.addEventListener('mouseover', function (e) { if (!mysz()) return; var el = e.target.closest && e.target.closest('input,select,textarea'); if (el && wlasciwe(el)) pokaz(el); });
    document.addEventListener('mouseout', function (e) { if (!mysz()) return; var el = e.target.closest && e.target.closest('input,select,textarea'); if (el && el === pole && e.relatedTarget !== maly) planujUkrycie(); });
  }
  document.addEventListener('focusin', function (e) { if (wlasciwe(e.target)) pokaz(e.target); });
  document.addEventListener('focusout', function (e) { if (e.target === pole && !mysz() && document.hasFocus()) planujUkrycie(); }); // utrata fokusu całego okna (np. przełączenie aplikacji) nie chowa chmurki
  window.addEventListener('scroll', function () { if (pole && maly && maly.style.display === 'block') { if (document.activeElement === pole || (mysz() && pole.matches(':hover'))) pokaz(pole); else schowaj(); } }, { passive: true });
  window.addEventListener('hashchange', schowaj);
  window.WF_POMOC = { opisy: OPISY, znajdz: znajdz }; // do testów
})();

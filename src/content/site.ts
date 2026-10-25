export const site = {
  // Approved trading brand. Complete legal entity and contact data before publication.
  name: "VERTEX I.S.O",
  legalName: "",
  nip: "8961975715", // Supplied and reconfirmed by the owner; checksum requires correction before legal launch.
  address: "",
  phone: "",
  email: "vertex7706@gmail.com",
  tagline: "Dom zaczyna się od Ciebie.",
  about:
    "Wierzymy, że dobry dom zaczyna się od uważnej rozmowy. Ten katalog pomaga porównać funkcjonalne koncepcje domów szkieletowych i przygotować pytania o budowę.",
  serviceArea:
    "Wrocław i okolice w promieniu do 100 km. Dostępność realizacji potwierdzamy dla konkretnej działki.",
  website: process.env.NEXT_PUBLIC_SITE_URL || (process.env.NODE_ENV === "production" ? "https://domy-szkiletowy.vercel.app" : "http://localhost:3000"),
  published: process.env.SITE_PUBLISHED === "true",
};
export const packages = [
  {
    name: "Stan surowy",
    description: "Punkt wyjścia do dalszych prac.",
    items: [
      "Konstrukcja drewniana",
      "Uzgodniony zakres przegród i dachu",
      "Zakres stolarki do potwierdzenia",
    ],
  },
  {
    name: "Stan deweloperski",
    description: "Dom przygotowany do wykończenia.",
    items: [
      "Uzgodniony zakres stanu surowego",
      "Izolacje i instalacje według projektu",
      "Przygotowanie wnętrz do wykończenia",
    ],
  },
  {
    name: "Pod klucz",
    description: "Wykończenie według Twoich wyborów.",
    items: [
      "Uzgodniony zakres deweloperski",
      "Materiały wykończeniowe według specyfikacji",
      "Zakres wyposażenia w indywidualnej ofercie",
    ],
  },
];
export const stages = [
  [
    "Rozmowa i potrzeby",
    "Poznajemy działkę, sposób życia i oczekiwany zakres prac.",
  ],
  [
    "Koncepcja i dokumentacja",
    "Wybieramy kierunek. Uprawniony projektant sprawdza rozwiązania i wymagane formalności.",
  ],
  [
    "Zakres i wycena",
    "Ustalamy materiały, odpowiedzialność stron oraz harmonogram.",
  ],
  [
    "Budowa i odbiór",
    "Prace oraz odbiory przebiegają według uzgodnionej dokumentacji i umowy.",
  ],
];
export const faq = [
  [
    "Czy dom do 70 m² można zbudować bez pozwolenia?",
    "Nie decyduje o tym sama powierzchnia. Tryb realizacji zależy m.in. od przeznaczenia, działki, obszaru oddziaływania i obowiązujących przepisów. Wymagane formalności należy ustalić z uprawnionym projektantem i właściwym urzędem.",
  ],
  [
    "Czym różni się powierzchnia zabudowy od użytkowej?",
    "Powierzchnia zabudowy opisuje rzut budynku na teren. Powierzchnia użytkowa dotyczy wnętrza, z uwzględnieniem przyjętej metody pomiaru, przegród i skosów. W katalogu te wartości są rozdzielone; użytkowa jest orientacyjna.",
  ],
  [
    "Czy projekty w katalogu są gotową dokumentacją?",
    "Nie. To koncepcje służące do rozmowy o potrzebach. Przed budową potrzebna jest dokumentacja, sprawdzenie konstrukcji i instalacji oraz dostosowanie do działki.",
  ],
  [
    "Ile kosztuje budowa domu szkieletowego?",
    "Koszt zależy od dokumentacji, warunków gruntowych, standardu, instalacji i logistyki. Przygotujemy indywidualną wycenę dopasowaną do Twoich potrzeb.",
  ],
  [
    "Czy dom może być całoroczny?",
    "Takie przeznaczenie wymaga odpowiedniego projektu przegród, ogrzewania, wentylacji i ochrony przed wilgocią. Parametry konkretnego budynku potwierdza dokumentacja projektowa.",
  ],
  [
    "Czy mogę zmienić układ pomieszczeń?",
    "Propozycje zmian można omówić na etapie koncepcji. Ich wykonalność, wpływ na konstrukcję, instalacje i formalności ocenia projektant.",
  ],
  [
    "Gdzie możliwa jest realizacja?",
    "Wrocław i okolice w promieniu do 100 km. Podaj lokalizację działki w zapytaniu — potwierdzimy dostępność oraz warunki realizacji.",
  ],
  [
    "Jak długo trwa budowa?",
    "Termin zależy od dokumentacji, formalności, zakresu, dostępności materiałów i warunków na działce. Wiążący harmonogram powinien być częścią indywidualnych ustaleń.",
  ],
];
export const regions = [
  "dolnośląskie",
  "kujawsko-pomorskie",
  "lubelskie",
  "lubuskie",
  "łódzkie",
  "małopolskie",
  "mazowieckie",
  "opolskie",
  "podkarpackie",
  "podlaskie",
  "pomorskie",
  "śląskie",
  "świętokrzyskie",
  "warmińsko-mazurskie",
  "wielkopolskie",
  "zachodniopomorskie",
];

export const tutorialSteps = [
  {
    title: "Tétel cím",
    content: "Ebbe az input mezőbe írhatod a tételed címét",
    selector: "#tetelcime",
  },
  {
    title: "Összegzés",
    content:
      "Ebbe az input mezőbe írhatod a tételed összegzését, ami a tétel leg alján fog megjelenni.",
    selector: "#osszegzes",
  },
  {
    title: "Szekció dropdown",
    content:
      "Minden szekció összecsukható és bezárható, egy adott szekció elemeit tartalmazza.",
    selector: "#sectioncollapse",
  },
  {
    title: "Új alszekció hozzáadása",
    content:
      "A szekción belül itt tudsz új alszekciót hozzáadni, ha az adott bekezdéshez nem szükséges, nem kötelező. Katints rá!",
    selector: "#ujalszekcio",
    requiresInteraction: true,
  },
  {
    title: "Alszekciók",
    content: "Itt találod egy adott szekcióhoz tartozó összes alszekciót.",
    selector: "#alszekciotitle",
  },
  {
    title: "Alszekció Címe",
    content: "Ide íród be az alszekció címét (kötelező)",
    selector: "#subsectioncim",
  },
  {
    title: "Alszekciók",
    content:
      "Ide íród be az alszekció tartalmát (Nem kötelező de erősen ajánlott)",
    selector: "#subsectionleiras",
  },
  {
    title: "Új szekció",
    content:
      "Ha már készen vagy egy szekcióval (bekezdéssel) adhatsz hozzá a témához még többet ezzel a gombal.",
    selector: "#ujszekcio",
  },
  {
    title: "Új Flashcard",
    content:
      "Amennyiben szeretnél a témádhoz kártyákat is rendelni, azt itt tudod megtenni (nem kötelező) Kattints Rá a folytatáshoz.",
    selector: "#ujflashcard",
    requiresInteraction: true,
  },
  {
    title: "Flashcard dropdown",
    content:
      "Minden flashcard becsukható, itt találod az adott kártyához tartozó adatokat.",
    selector: "#flascardcollapse",
  },
  {
    title: "Kérdés",
    content: "A kártya elöllapja, ide írhatod a kérdést.",
    selector: "#kerdescard",
  },
  {
    title: "Válasz",
    content: "A kártya hátulja, ide írhatod a kérdéshez tartozó választ.",
    selector: "#valaszcard",
  },
  {
    title: "Előnézet",
    content:
      "Miközbe dolgozod ki a tételed van elehtőséged megtekinteni az előnézetet valós időben. Előnézetből vissza tudsz jönni ugyan ezzel a gombal.",
    selector: "#preview",
  },
  {
    title: "Mentés",
    content:
      "Mikor végeztél mindennel ezzel a gombal tudod elmenteni a munkád. Ne izgulj késöbbi szerkesztésre is van lehetőséged.",
    selector: "#submitbutton",
  },
];

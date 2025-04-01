# Senne Timbreur (202292762)

- [x] Front-end Web Development

- https://github.com/Web-IV/2324-frontendweb-SenneTimbreur

- https://frontend-sennetimbreur.onrender.com

- [x] Web Services:

- https://github.com/Web-IV/2324-webservices-SenneTimbreur

- https://webservices-sennetimbreur.onrender.com

**Logingegevens**

_Admin_

- e-mailadres: admin@gmail.com

- Wachtwoord: admintest

_User_

- e-mailadres: user@gmail.com

- Wachtwoord: usertest

## Projectbeschrijving

![Alt text](image.png)

Het project is omgeving waar de leiding van Chiro Waarschoot hun leden kunnen bijhouden. Aan deze leden zijn enkele zake gekoppeld: Huisarts, leiding en 2 ouders. De leiding kan de ingeschreven leden invullen samen met hun ouders en er huisarts uit Waarschoot aan koppelen. Hierdoor heeft de leiding altijd een handig overzicht wie er allemaal in hun jeugdbeweging zit.

## Screenshots

![Alt text](image-1.png)
Homepage met navigatiebar die naar de verschillende paginas leiden.

![Alt text](image-2.png)
Hier kan je alle ouders vinden die in de databank aanwezig zitten.

![Alt text](image-3.png)
Dit is een from waar je en ouder kan toevoegen.

![Alt text](image-4.png)
Alle leden die al aanwezig waren in de databank in een lijst

![Alt text](image-5.png)
Dit is een form waar je een lid kan aanmaken.

![Alt text](image-6.png)
Alle huisartsen die al aanwezig zijn in de databank.

![Alt text](image-7.png)
Registreer

![Alt text](image-8.png)
Log in

## API calls

**Swagger**

https://webservices-sennetimbreur.onrender.com/swagger

## Behaalde minimumvereisten

### Front-end Web Development

- **componenten**

- [x] heeft meerdere componenten - dom & slim (naast login/register)

- [x] applicatie is voldoende complex

- [x] definieert constanten (variabelen, functies en componenten) buiten de component

- [x] minstens één form met meerdere velden met validatie (naast login/register)

- [x] login systeem

<br  />

- **routing**

- [x] heeft minstens 2 pagina's (naast login/register)

- [x] routes worden afgeschermd met authenticatie en autorisatie

<br  />

- **state-management**

- [x] meerdere API calls (naast login/register)

- [x] degelijke foutmeldingen indien API-call faalt

- [x] gebruikt useState enkel voor lokale state

- [x] gebruikt gepast state management voor globale state - indien van toepassing

<br  />

- **hooks**

- [x] gebruikt de hooks op de juiste manier

<br  />

- **varia**

- [x] een aantal niet-triviale e2e testen

- [x] minstens één extra technologie

- [x] maakt gebruik van de laatste ES-features (async/await, object destructuring, spread operator...)

- [x] duidelijke en volledige README.md

- [x] volledig en tijdig ingediend dossier en voldoende commits

### Web Services

- **datalaag**

- [x] voldoende complex (meer dan één tabel, 2 een-op-veel of veel-op-veel relaties)

- [x] één module beheert de connectie + connectie wordt gesloten bij sluiten server

- [x] heeft migraties - indien van toepassing

- [x] heeft seeds

<br  />

- **repositorylaag**

- [x] definieert één repository per entiteit (niet voor tussentabellen) - indien van toepassing

- [x] mapt OO-rijke data naar relationele tabellen en vice versa - indien van toepassing

<br  />

- **servicelaag met een zekere complexiteit**

- [x] bevat alle domeinlogica

- [x] bevat geen SQL-queries of databank-gerelateerde code

<br  />

- **REST-laag**

- [x] meerdere routes met invoervalidatie

- [x] degelijke foutboodschappen

- [x] volgt de conventies van een RESTful API

- [x] bevat geen domeinlogica

- [x] geen API calls voor entiteiten die geen zin hebben zonder hun ouder (bvb tussentabellen)

- [x] degelijke authorisatie/authenticatie op alle routes

<br  />

- **algemeen**

- [x] er is een minimum aan logging voorzien

- [x] een aantal niet-triviale integratietesten (min. 1 controller >=80% coverage)

- [x] minstens één extra technologie

- [x] maakt gebruik van de laatste ES-features (async/await, object destructuring, spread operator...)

- [x] duidelijke en volledige README.md

- [x] volledig en tijdig ingediend dossier en voldoende commits

## Projectstructuur

### Front-end Web Development

Ik heb 3 hoofdmappen: cypress, src, images

- cypress is waar al mijn testen staan
- images is voor mijn fotos die ik op de website zet
- src is waar al mijn code te vinden is

**SRC**

In de src folder hebben 4 mappen: api, components, contexts, pages

- api: in de index.js wordt alles opgevraagd uit de api en doorgegeven aan de componenten
- components: hierin staan alle componenten per klasse gedefinieerd
- contexts: hierin worden alle contexts zoals theme en authenticatie die over meerdere bestanden gebruikt worden
- pages: hierin worden de componeten geladen en effectief getoond op de website

### Web Services

Ik heb 3 hoofdmappen: \_\_test\_\_, config en source

- \_test: hierin staan de tests gedefinieerd
- config: hierin staan alle variabelen gedefinieerd nodig om in de verschillende environments te kunnen werken
- source: hierin is alle code te vinden

**Source**

In de source folder heb je data, rest repository en core laag.

- core: hierin worden alle benodigdheden die in andere lagen nodig zijn gedfinieerd
- data: hierin wordt de connectie met de databank gelegd en worden alle tabellen en waarden toegevoegd.
- repository: deze laag staat in direct contact met de databank. Hier staan verschillende operaties per klasse geschreven.
- rest: deze laag zorgt voor de verbinding met de front-end applicatie en verwijst deze door naar de service laag
- service: deze laag zorgt voor de verbinding tussen respository en rest. Errorhandling wordt hier gedaan zodat het geen directe gevolgen heeft op onze databank.

## Extra technologie

### Front-end Web Development

**Chakra UI**
<br  />
Chakra UI wordt gebruikt om eenvoudig moderene en toegankelijke gebruikersinterfaces te bouwen. Het biedt kant-en-klare, aanpasbare bouwstenen voor veelvoorkomende UI-elementen, zoals knoppen en formulieren.

### Web Services

**Swagger**
<br  />
Swagger is een tool voor ontwerpen, documenteren en testen van API's. Het genereert gedatailleerde API-documentatie door de API-specificatie te schrijven YAML. Deze specifactie wordt dan gebruikt om automatisch uitgebreide, interactieve documentatie te genereren met behulp van Swagger UI.

> Wat is de extra technologie? Hoe werkt het? Voeg een link naar het npm package toe!

## Testresultaten

### Front-end Web Development

**leden.cy.js**
<br  />
Er wordt eerst gecontroleerd als de gebruiker zich kan inloggen met de gegevens die standaard ingevuld zijn.
Daarna wordt de lijst met alle leden die in de databank opgeslaan getoond.
Ook testen we als de request naar de api een lange tijd nodig heeft er een gepaste melding getoond wordt.

**spec.cy.js**
<br  />
In deze test wordt er enkel getest als de website effectief draait.

**veranderTheme.cy.js**
<br  />
Er wordt getest als de achtergrond kleur van een component gewijzigd wordt wanneer er toggleTheme knop gedrukt wordt.

**voegOuderToe.cy.js**
<br  />
In deze test wordt er een ouder toegevoegd door middel van een form. Ook wordt er getest indien er een fout formaat van telefoonnummer wordt doorgegeven dit effectief zo wordt meegedeeld aan de gebruiker.
Achterof wordt ook nog getest als deze ouder kan verwijdert worden.

### Web Services

**huisarts.test.js**
<br  />
In deze test worden de verschillende endpoints voor de klasse huisarts getest.
<br  />

- De eerste endpoint is een GET van alle huisartsen. We kregen een array van huisartsen terug indien we niets meegeven. Wanneer we een argument meegeven krijgen we een gepaste foutmelding dat dit niet mag.
- De tweede endpoint is een GET van een specifieke huisarts door een megegeven id als parameter. Het geeft een gepaste foutmelding wanneer de huisarts met dit id niet bestaat. Ook wanneer het id geen gepast formaat heeft bv. string. Geeft dit een gepaste foutmelding
- De derde enpoint is een POST van huisarts. Hierbij testen we als een huisarts toegevoegd wordt aan de databank wanneer we deze willen toevoegen. Wanneer er velden ontbreken of verkeerd formaat zijn wordt een gepaste foutmelding getoond.
- Het laatste endpoint is een DELETE van een huisarts. We verwijderen een huisarts.s

## Gekende bugs

### Front-end Web Development

Wanneer een jwt-token expires moet de gebruiker zich eerst uitloggen voor opnieuw te kunnen inloggen.

### Web Services

Ouder_id meegeven geeft bad_request_error. Dit werkte enkele commits terug wel nog.

## Wat is er verbeterd/aangepast?

> Deze sectie is enkel voor 2e zittijd, verwijder deze in 1e zittijd.

### Front-end Web Development

- Dit en dat

### Web Services

- Oh en dit ook

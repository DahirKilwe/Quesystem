øsystem (venterom/legekontor)

Selvstendig HTML/CSS/JS-løsning for kølapper i venterom. Ingen backend eller databaser; alt kjører i nettleser og lagres kun per fane med `sessionStorage`.

## Filoversikt
- `koe.html` – markup som laster stil og script.
- `koe.css` – tema, layout og responsivitet.
- `koe.js` – logikk for kø, rom, plassering og varsler.

## Funksjoner
- Pasient tar kølapp (auto B101, B102 …), valgfritt navn og årsak.
- Viser posisjon, antall foran og estimert ventetid.
- Legepanel med flere rom:
  - Legg til rom dynamisk.
  - «Kall neste» trekker øverste i kø til valgt rom.
  - «Annonsér» gjentar varsel for rommets aktive pasient.
  - «Frigjør» tømmer rommet.
- «Nullstill hele køen» tømmer både kø og rom.
- Estimattid basert på feltet «Minutter per pasient» (standard 7).

## Slik kjører du
1) Åpne `koe.html` direkte i nettleseren  
   eller start en enkel server fra prosjektmappen:
   ```bash
   npx serve .
   # eller
   python -m http.server 8000
   ```
2) Gå til `http://localhost:3000/koe.html` (eller 8000 hvis du brukte Python).

## Tilpasning
- Startrom: juster `const rooms = ["1", "2"];` i `koe.js`.
- Startticket: endre `ticketCounter = 101;`.
- Standard estimering: endre verdien i `<input id="avg-min" value="7">`.
- Fjerne alerts: erstatt `alert(...)` i `koe.js` med egen UI-komponent/lyd.

## Begrensninger
- Ingen lagring på tvers av faner eller maskiner.
- Ingen samtidighet/synk via server. For flerskjerm-støtte må du koble til en backend eller realtime-tjeneste.

## Hurtigfiltre for feilsøking
- Kjør i incognito for å teste ny session (tom `sessionStorage`).
- Sjekk konsoll for eventuelle JS-feil.

const express = require("express");
const path = require("path");
const fs = require("fs");
const fsp = require("fs/promises");
const sass = require("sass");

global.obiectGlobal = {
  folderScss: path.join(__dirname, "resurse/scss"),
  folderCss: path.join(__dirname, "resurse/scss"),
  folderBackup: path.join(__dirname, "backup")
};

["temp", "backup"].forEach(f => {
  const folder = path.join(__dirname, f);
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
});

async function compileazaScss(caleScss, caleCss) {
  const scssAbs = path.isAbsolute(caleScss)
    ? caleScss
    : path.join(obiectGlobal.folderScss, caleScss);

  const cssAbs = caleCss
    ? (path.isAbsolute(caleCss) ? caleCss : path.join(obiectGlobal.folderCss, caleCss))
    : path.join(obiectGlobal.folderCss, path.basename(scssAbs, ".scss") + ".css");

  const backupPath = path.join(obiectGlobal.folderBackup, "resurse/scss");
  await fsp.mkdir(backupPath, { recursive: true });

  try {
    if (fs.existsSync(cssAbs)) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const numeFisier = path.basename(cssAbs, ".css");
      const caleBackup = path.join(backupPath, `${numeFisier}_${timestamp}.css`);
      await fsp.copyFile(cssAbs, caleBackup);
    }

    const rezultat = sass.compile(scssAbs, { style: "expanded" });
    await fsp.writeFile(cssAbs, rezultat.css);
    console.log(`[SCSS] Compilat: ${scssAbs} -> ${cssAbs}`);
  } catch (err) {
    console.error(`[Eroare] La compilarea ${scssAbs}:`, err.message);
  }
}

function compileazaToateScss() {
  const fisiere = fs.readdirSync(obiectGlobal.folderScss).filter(f => f.endsWith(".scss"));
  for (let f of fisiere) {
    compileazaScss(f);
  }
}
compileazaToateScss();

fs.watch(obiectGlobal.folderScss, (event, filename) => {
  if (filename && filename.endsWith(".scss")) {
    console.log(`[SCSS] Detectat eveniment: ${event} pe ${filename}`);
    compileazaScss(filename);
  }
});

const app = express();

console.log("Folderul proiectului: ", __dirname);
console.log("Calea fisierului index.js: ", __filename);
console.log("Folderul curent de lucru: ", process.cwd());

app.set("view engine", "ejs");

obGlobal = {
    obErori: null
}

function initErori(){
    let continut = fs.readFileSync(path.join(__dirname, "resurse/json/erori.json")).toString("utf-8");
    console.log(continut)
    obGlobal.obErori = JSON.parse(continut);
    console.log(obGlobal.obErori)

    obGlobal.obErori.eroare_default.imagine = obGlobal.obErori.cale_baza + "/" + obGlobal.obErori.eroare_default.imagine;
    for (let eroare of obGlobal.obErori.info_erori){
        eroare.imagine = obGlobal.obErori.cale_baza + "/" + eroare.imagine;
    }
    console.log(obGlobal.obErori)
    
}

initErori();

// Functia pentru citirea datelor galeriei
function citesteJSON() {
    try {
        const jsonGalerie = JSON.parse(fs.readFileSync(path.join(__dirname, 'resurse/json/galerie.json')));
        console.log("Galerie data incarcata cu succes!");
        return jsonGalerie;
    } catch (error) {
        console.error("Eroare la citirea sau parsarea fisierului JSON:", error);
        // Returneaza un obiect gol pentru a evita erorile in restul codului
        return { cale_galerie: "/resurse/imagini/galerie", imagini: [] };
    }
}

function afisareEroare(res, identificator, titlu, text, imagine){
    let eroare = obGlobal.obErori.info_erori.find(function(elem){ 
        return elem.identificator == identificator;
    });
    
    let titluCustom, textCustom, imagineCustom;
    
    if(eroare){
        if(eroare.status)
            res.status(identificator);
        titluCustom = titlu || eroare.titlu;
        textCustom = text || eroare.text;
        imagineCustom = imagine || eroare.imagine;
    }
    else{
        let err = obGlobal.obErori.eroare_default;
        titluCustom = titlu || err.titlu;
        textCustom = text || err.text;
        imagineCustom = imagine || err.imagine;
    }

    imagineCustom = imagineCustom.replace(/\\/g, '/');
    
    res.render("pagini/eroare", {
        titlu: titluCustom,
        text: textCustom,
        imagine: imagineCustom,
    });
}

const vect_foldere = ["temp"];
for (let folder of vect_foldere) {
    let caleFolder = path.join(__dirname, folder);
    if (!fs.existsSync(caleFolder)) {
        fs.mkdirSync(caleFolder);
        console.log(`Creat folder: ${folder}`);
    } else {
        console.log(`Folderul ${folder} exista deja.`);
    }
}

app.use(function(req, res, next) {
    res.locals.ip = req.ip;
    next();
});

app.use("/resurse", function(req, res, next) {
    const fullPath = path.join(__dirname, "resurse", req.url);
    if (fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()) {
        if (!req.url.endsWith("/")) {
            afisareEroare(res, 403);
            return;
        }
    }
    next();
}, express.static(path.join(__dirname, "resurse")));

app.get("/favicon.ico", function(req, res) {
    res.sendFile(path.join(__dirname, "resurse/imagini/favicon.ico"));
});

// Ruta pentru pagina principala modificata pentru a include datele galeriei
app.get(["/", "/index", "/home"], function(req, res) {
    const ip = req.ip;
    const galerieData = citesteJSON();
    
    res.render("pagini/index", {
        ip: ip,
        imagini: galerieData.imagini,
        cale_galerie: galerieData.cale_galerie
    });
});

// Ruta pentru pagina galerie
app.get('/galerie', (req, res) => {
    const galerieData = citesteJSON();
    res.render('pagini/galerie', {
        imagini: galerieData.imagini,
        cale_galerie: galerieData.cale_galerie
    });
});

app.get("/index/a", function(req, res) {
    res.render("pagini/index", {ip: req.ip});
});

app.get("/cerere", function(req, res) {
    res.send("<p style='color:blue'>Buna ziua</p>");
});

app.get("/fisier", function(req, res) {
    res.sendFile(path.join(__dirname, "package.json"));
});

app.get("/*.ejs", function(req, res) {
    afisareEroare(res, 400);
});

app.get("/*", function(req, res) {
    try {
        res.render("pagini" + req.url, {ip: req.ip}, function(err, rezultatRandare) {
            if (err) {
                if (err.message.startsWith("Failed to lookup view")) {
                    afisareEroare(res, 404);
                } else {
                    afisareEroare(res);
                }
            } else {
                console.log(rezultatRandare);
                res.send(rezultatRandare);
            }
        });
    } catch (errRandare) {
        if (errRandare.message.startsWith("Cannot find module")) {
            afisareEroare(res, 404);
        } else {
            afisareEroare(res);
        }
    }
});

app.listen(8080);
console.log("Serverul a pornit");
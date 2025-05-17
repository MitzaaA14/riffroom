const express = require("express");
const path = require("path");
const fs = require("fs");
const fsp = require("fs/promises");
const sass = require("sass");
const pg = require("pg");
const Client = pg.Client;

// CONEXIUNE BAZA DE DATE
client = new Client({
    database: "riffroom",
    user: "mihai",
    password: "123asdz11",
    host: "localhost",
    port: 5432
});

client.connect();
client.query("select * from instrumente", function(err, rezultat){
    console.log(err)    
    console.log("Rezultat query:", rezultat)
});
client.query("select * from unnest(enum_range(null::categ_instrument))", function(err, rezultat){
    console.log(err)    
    console.log(rezultat)
});

// VARIABILE GLOBALE
global.obiectGlobal = {
  folderScss: path.join(__dirname, "resurse/scss"),
  folderCss: path.join(__dirname, "resurse/scss"),
  folderBackup: path.join(__dirname, "backup")
};

// CREARE FOLDERE NECESARE
["temp", "backup"].forEach(f => {
  const folder = path.join(__dirname, f);
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
});

// FUNCTIE PENTRU COMPILARE SCSS
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

    // Salvează outputul original
    const originalStderr = process.stderr.write;
    const originalStdout = process.stdout.write;

    // Suprascrie stderr pentru a filtra avertismentele de depreciere
    process.stderr.write = function(chunk, encoding, callback) {
      if (typeof chunk === 'string' && !chunk.includes('Deprecation Warning')) {
        return originalStderr.call(process.stderr, chunk, encoding, callback);
      }
      if (Buffer.isBuffer(chunk)) {
        const str = chunk.toString();
        if (!str.includes('Deprecation Warning')) {
          return originalStderr.call(process.stderr, chunk, encoding, callback);
        }
      }
      if (callback) callback();
      return true;
    };
    
    // Suprascrie și stdout pentru cazul în care unele mesaje ajung acolo
    process.stdout.write = function(chunk, encoding, callback) {
      if (typeof chunk === 'string' && !chunk.includes('Deprecation Warning')) {
        return originalStdout.call(process.stdout, chunk, encoding, callback);
      }
      if (Buffer.isBuffer(chunk)) {
        const str = chunk.toString();
        if (!str.includes('Deprecation Warning')) {
          return originalStdout.call(process.stdout, chunk, encoding, callback);
        }
      }
      if (callback) callback();
      return true;
    };

    // Execută compilarea
    const rezultat = sass.compile(scssAbs, { style: "expanded" });
    
    // Restaurează stdout și stderr originale
    process.stderr.write = originalStderr;
    process.stdout.write = originalStdout;
    
    await fsp.writeFile(cssAbs, rezultat.css);
    console.log(`[SCSS] Compilat: ${scssAbs} -> ${cssAbs}`);
  } catch (err) {
    // Asigură-te că stdout și stderr sunt restaurate în caz de eroare
    if (process.stderr.write !== originalStderr) {
      process.stderr.write = originalStderr;
    }
    if (process.stdout.write !== originalStdout) {
      process.stdout.write = originalStdout;
    }
    console.error(`[Eroare] La compilarea ${scssAbs}:`, err.message);
  }
}

// COMPILARE TOATE FISIERELE SCSS
function compileazaToateScss() {
  const fisiere = fs.readdirSync(obiectGlobal.folderScss).filter(f => f.endsWith(".scss"));
  for (let f of fisiere) {
    compileazaScss(f);
  }
}
compileazaToateScss();

// URMARIRE MODIFICARI SCSS
fs.watch(obiectGlobal.folderScss, (event, filename) => {
  if (filename && filename.endsWith(".scss")) {
    console.log(`[SCSS] Detectat eveniment: ${event} pe ${filename}`);
    compileazaScss(filename);
  }
});

// CREARE SERVER EXPRESS
const app = express();

console.log("Folderul proiectului: ", __dirname);
console.log("Calea fisierului index.js: ", __filename);
console.log("Folderul curent de lucru: ", process.cwd());

app.set("view engine", "ejs");

// OBIECTE GLOBALE
obGlobal = {
    obErori: null
}

// INITIALIZARE OBIECTE ERORI
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

// FUNCTIE PENTRU CITIREA DATELOR GALERIEI
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

// FUNCTIE PENTRU AFISARE ERORI
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

// CREARE FOLDERE NECESARE
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

// MIDDLEWARE PENTRU IP
app.use(function(req, res, next) {
    res.locals.ip = req.ip;
    next();
});

// RUTA PENTRU PRODUSE - IMPLEMENTARE FILTRARE LA NIVEL DE SERVER
app.get("/produse", function(req, res){
    console.log(req.query);
    
    // IMPLEMENTARE FILTRARE LA NIVEL DE SERVER
    var conditieQuery = "";
    
    // Verificam daca avem un parametru de categorie in query
    if(req.query.categorie && req.query.categorie !== "toate") {
        conditieQuery = ` WHERE categorie='${req.query.categorie}'`;
    }
    
    // Verificam daca avem un parametru de tip_produs in query
    if(req.query.tip && req.query.tip !== "toate") {
        const operator = conditieQuery ? " AND" : " WHERE";
        conditieQuery += `${operator} tip_produs='${req.query.tip}'`;
    }
    
    // OBTINEM CATEGORIILE DIN ENUM
    queryOptiuni = "select * from unnest(enum_range(null::categ_instrument))";
    client.query(queryOptiuni, function(err, rezOptiuni){
        if (err) {
            console.log(err);
            afisareEroare(res, 2);
            return;
        }
        
        // OBTINEM TIPURILE DE PRODUSE DIN ENUM
        queryTipuri = "select * from unnest(enum_range(null::tipuri_produse))";
        client.query(queryTipuri, function(err, rezTipuri){
            if (err) {
                console.log(err);
                afisareEroare(res, 2);
                return;
            }
            
            // Construim query-ul pentru produse cu conditia de filtrare
            queryProduse = "select * from instrumente" + conditieQuery;
            client.query(queryProduse, function(err, rez){
                if (err){
                    console.log(err);
                    afisareEroare(res, 2);
                }
                else{
                    // TRANSMITEM DATELE CATRE TEMPLATE
                    res.render("pagini/produse", {
                        produse: rez.rows, 
                        optiuni: rezOptiuni.rows,
                        tipuri: rezTipuri.rows
                    });
                }
            });
        });
    });
});

// RUTA PENTRU PRODUS INDIVIDUAL
app.get("/produs/:id", function(req, res){
    const produsId = req.params.id;
    
    client.query("SELECT * FROM instrumente WHERE id=$1", [produsId], function(err, rez){
        if(err || rez.rows.length == 0){
            console.log(err);
            afisareEroare(res, 404, "Produsul nu a fost găsit!");
            return;
        }
        
        res.render("pagini/produs", {prod: rez.rows[0]});
    });
});

// MIDDLEWARE PENTRU FISIERE STATICE
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

// RUTA PENTRU FAVICON
app.get("/favicon.ico", function(req, res) {
    res.sendFile(path.join(__dirname, "resurse/imagini/favicon.ico"));
});

// RUTA PENTRU PAGINA PRINCIPALA
app.get(["/", "/index", "/home"], function(req, res) {
    const ip = req.ip;
    const galerieData = citesteJSON();
    
    res.render("pagini/index", {
        ip: ip,
        imagini: galerieData.imagini,
        cale_galerie: galerieData.cale_galerie
    });
});

// RUTA PENTRU PAGINA GALERIE
app.get('/galerie', (req, res) => {
    const galerieData = citesteJSON();
    res.render('pagini/galerie', {
        imagini: galerieData.imagini,
        cale_galerie: galerieData.cale_galerie
    });
});

// ALTE RUTE
app.get("/index/a", function(req, res) {
    res.render("pagini/index", {ip: req.ip});
});

app.get("/cerere", function(req, res) {
    res.send("<p style='color:blue'>Buna ziua</p>");
});

app.get("/fisier", function(req, res) {
    res.sendFile(path.join(__dirname, "package.json"));
});

// PROTECTIE FISIERE EJS
app.get("/*.ejs", function(req, res) {
    afisareEroare(res, 400);
});

// HANDLER PENTRU ALTE RUTE
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

// PORNIRE SERVER
app.listen(8080);
console.log("Serverul a pornit pe portul 8080");
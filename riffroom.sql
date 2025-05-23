DROP TYPE IF EXISTS categ_instrument;
DROP TYPE IF EXISTS tipuri_produse;

CREATE TYPE categ_instrument AS ENUM('premium', 'editie limitata', 'pentru incepatori', 'profesional', 'vintage', 'standard');
CREATE TYPE tipuri_produse AS ENUM('chitara electrica', 'chitara acustica', 'amplificator', 'accesorii');


CREATE TABLE IF NOT EXISTS instrumente (
   id serial PRIMARY KEY,
   nume VARCHAR(50) UNIQUE NOT NULL,
   descriere TEXT,
   pret NUMERIC(8,2) NOT NULL,
   greutate INT NOT NULL CHECK (greutate>=0),   
   tip_produs tipuri_produse DEFAULT 'chitara electrica',
   putere INT CHECK (putere>=0),
   categorie categ_instrument DEFAULT 'standard',
   caracteristici VARCHAR [], --pot sa nu fie specificate deci nu punem NOT NULL
   pentru_incepatori BOOLEAN NOT NULL DEFAULT FALSE,
   imagine VARCHAR(300),
   data_adaugare TIMESTAMP DEFAULT current_timestamp
);

INSERT into instrumente (nume, descriere, pret, greutate, putere, tip_produs, categorie, caracteristici, pentru_incepatori, imagine) 
VALUES 
('Gibson Les Paul Standard', 'Chitara electrică legendară cu ton bogat și sustain excelent', 8999.00, 4500, NULL, 'chitara electrica', 'premium', '{"humbucker","mahon","rosewood fretboard","sunburst finish"}', False, 'gibson-les-paul.jpg'),

('Fender Stratocaster', 'Chitara electrică cu ton versatil și design iconic', 6799.00, 3800, NULL, 'chitara electrica', 'premium', '{"single coil","artar","maple fretboard","alder body"}', False, 'fender-stratocaster.jpg'),

('Gibson SG Custom', 'Chitară electrică cu design agresiv și performanță extraordinară', 7500.00, 3200, NULL, 'chitara electrica', 'premium', '{"humbucker","mahon","ebony fretboard","cherry finish"}', False, 'gibson-sg-custom.jpg'),

('Taylor 114ce', 'Chitară acustică premium cu electronice încorporate', 4599.00, 2100, NULL, 'chitara acustica', 'premium', '{"sitka spruce","walnut","sapele","expression system"}', False, 'taylor-114ce.jpg'),

('Squier Affinity Strat', 'Chitară electrică accesibilă cu sunet de calitate', 999.00, 3400, NULL, 'chitara electrica', 'pentru incepatori', '{"single coil","artar","indian laurel","alder body"}', True, 'squier-affinity.jpg'),

('Marshall JVM410H', 'Amplificator de chitară high-end cu ton iconic', 9299.00, 22000, 100, 'amplificator', 'profesional', '{"4 canale","efecte","reverb","EQ"}', False, 'marshall-jvm410h.jpg'),

('Fender CD-60', 'Chitară acustică ideală pentru începători', 1200.00, 2300, NULL, 'chitara acustica', 'pentru incepatori', '{"spruce top","mahogany","laminated back"}', True, 'fender-cd-60.jpg'),

('Dunlop Jazz III', 'Pene de chitară premium pentru control maxim', 25.00, 10, NULL, 'accesorii', 'standard', '{"nylon","1.38mm","red","grip"}', False, 'dunlop-jazz.jpg'),

('Martin D-28', 'Chitară acustică legendară cu ton bogat', 12000.00, 2400, NULL, 'chitara acustica', 'premium', '{"solid spruce","rosewood back","ebony fretboard"}', False, 'martin-d28.jpg'),

('Epiphone Les Paul Standard', 'Versiune accesibilă a celebrei Les Paul', 2500.00, 4200, NULL, 'chitara electrica', 'standard', '{"humbucker","mahon","rosewood","sunburst finish"}', True, 'epiphone-les-paul.jpg'),

('PRS Custom 24', 'Chitară electrică premium cu versatilitate incredibilă', 8700.00, 3800, NULL, 'chitara electrica', 'premium', '{"humbucker","maple top","rosewood","bird inlays"}', False, 'prs-custom-24.jpg'),

('Fender Rumble 40', 'Amplificator compact pentru chitară bass', 1200.00, 8500, 40, 'amplificator', 'standard', '{"1x10 speaker","overdrive","contour","bright"}', True, 'fender-rumble-40.jpg'),

('Taylor 814ce', 'Chitară acustică de top cu electronică premium', 15000.00, 2100, NULL, 'chitara acustica', 'premium', '{"solid spruce","indian rosewood","expression system 2"}', False, 'taylor-814ce.jpg'),

('Ernie Ball Strings', 'Corzi de chitară electrică de înaltă calitate', 45.00, 100, NULL, 'accesorii', 'standard', '{"nickel","10-46 gauge","bright tone"}', False, 'ernie-ball-strings.jpg'),

('Boss Katana 50', 'Amplificator digital versatil cu efecte încorporate', 1099.00, 11000, 50, 'amplificator', 'standard', '{"efecte digitale","5 canale","USB recording","tone studio"}', True, 'boss-katana-50.jpg'),

('Fender American Vintage 57', 'Reproducere autentică a Stratocasterului din 1957', 9500.00, 3700, NULL, 'chitara electrica', 'vintage', '{"single coil","ash body","v-shape maple neck","2-color sunburst"}', False, 'fender-vintage-57.jpg'),

('Ibanez RG550', 'Chitară electrică pentru stiluri moderne cu performanță excelentă', 4500.00, 3400, NULL, 'chitara electrica', 'profesional', '{"humbucker","maple","wizard neck","edge tremolo"}', False, 'ibanez-rg550.jpg'),

('Jim Dunlop Capo', 'Capo de calitate pentru chitară', 89.00, 80, NULL, 'accesorii', 'standard', '{"trigger style","nickel","spring action"}', True, 'jim-dunlop-capo.jpg'),

('Line 6 Helix', 'Procesor multi-efecte premium pentru chitară', 5500.00, 7200, NULL, 'accesorii', 'profesional', '{"amp modeling","efecte multiple","touchscreen","USB recording"}', False, 'line6-helix.jpg'),

('Gretsch White Falcon', 'Chitară electrică de lux cu aspect spectaculos', 13000.00, 4800, NULL, 'chitara electrica', 'editie limitata', '{"filtertron pickups","gold hardware","white finish","bigsby tremolo"}', False, 'gretsch-white-falcon.jpg'),

('Orange Tiny Terror', 'Amplificator de chitară compact cu ton cald', 2200.00, 7000, 15, 'amplificator', 'profesional', '{"all-tube","portabil","high gain","class A"}', False, 'orange-tiny-terror.jpg');


CREATE TABLE seturi (
    id SERIAL PRIMARY KEY,
    nume_set VARCHAR(100) NOT NULL,
    descriere_set TEXT
);

CREATE TABLE asociere_set (
    id SERIAL PRIMARY KEY,
    id_set INTEGER NOT NULL,
    id_produs INTEGER NOT NULL,
    FOREIGN KEY (id_set) REFERENCES seturi(id) ON DELETE CASCADE,
    FOREIGN KEY (id_produs) REFERENCES instrumente(id) ON DELETE CASCADE
);
INSERT INTO seturi (nume_set, descriere_set) VALUES 
('Set Chitarist Începător', 'Tot ce ai nevoie pentru a începe să cânți la chitară electrică. Acest set conține o chitară electrică de calitate, un amplificator compact și accesoriile necesare pentru primul tău pas în lumea muzicii.'),
('Set Chitarist Acustic', 'Echipamentul perfect pentru concerte acustice. Setul include o chitară acustică premium și accesorii esențiale pentru interpretări live sau înregistrări.'),
('Set Professional Studio', 'Instrumentele necesare pentru înregistrări profesionale în studio. Setul conține echipamente de înaltă calitate pentru a obține un sunet impecabil în înregistrările tale.'),
('Set Rock Clasic', 'Echipamentul iconic pentru sunetul rock clasic. Recreează sunetul legendar al anilor ''70 și ''80 cu acest set complet.'),
('Set Blues', 'Colecție selectată special pentru interpreții de blues. Setul include instrumente și accesorii care îți permit să exprimi emoția și pasiunea specifică blues-ului.'),
('Chitară Stratocaster + Amplificator', 'Combinația perfectă pentru un sunet clasic Fender - chitara Stratocaster și amplificatorul potrivit.'),
('Chitară Les Paul + Amplificator Premium', 'Sunet premium cu legendara chitară Gibson Les Paul și un amplificator premium Marshall.'),
('Set Începător Compact', 'Combinație simplă și eficientă de chitară și amplificator pentru primii pași în lumea muzicii.');

INSERT INTO asociere_set (id_set, id_produs) VALUES 
(1, 5),  -- Squier Affinity Strat (chitară electrică)
(1, 15), -- Boss Katana 50 (amplificator)
(1, 14), -- Ernie Ball Strings (stringuri)
(1, 8);  -- Dunlop Jazz III (pană)

INSERT INTO asociere_set (id_set, id_produs) VALUES 
(2, 4),  -- Taylor 114ce (chitară acustică)
(2, 14), -- Ernie Ball Strings (stringuri)
(2, 8);  -- Dunlop Jazz III (pană)

INSERT INTO asociere_set (id_set, id_produs) VALUES 
(3, 1),  -- Gibson Les Paul Standard (chitară electrică)
(3, 6),  -- Marshall JVM410H (amplificator)
(3, 19), -- Line 6 Helix (procesor efecte)
(3, 14); -- Ernie Ball Strings (stringuri)

INSERT INTO asociere_set (id_set, id_produs) VALUES 
(4, 3),  -- Gibson SG Custom (chitară electrică)
(4, 21), -- Orange Tiny Terror (amplificator)
(4, 14), -- Ernie Ball Strings (stringuri)
(4, 8);  -- Dunlop Jazz III (pană)

INSERT INTO asociere_set (id_set, id_produs) VALUES 
(5, 16), -- Fender American Vintage 57 (chitară electrică)
(5, 6),  -- Marshall JVM410H (amplificator)
(5, 14), -- Ernie Ball Strings (stringuri)
(5, 8);  -- Dunlop Jazz III (pană)

INSERT INTO asociere_set (id_set, id_produs) VALUES 
(6, 2),  -- Fender Stratocaster (chitară electrică)
(6, 15); -- Boss Katana 50 (amplificator)

INSERT INTO asociere_set (id_set, id_produs) VALUES 
(7, 1),  -- Gibson Les Paul Standard (chitară electrică)
(7, 6);  -- Marshall JVM410H (amplificator)

INSERT INTO asociere_set (id_set, id_produs) VALUES 
(8, 5),  -- Squier Affinity Strat (chitară electrică)
(8, 12); -- Fender Rumble 40 (amplificator)
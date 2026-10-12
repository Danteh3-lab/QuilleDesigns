-- Films are grouped on the portfolio under the company they were made for.
-- Every brand gets a card, also before it has films; the client adds the films in the admin.
ALTER TABLE projects ADD COLUMN brand TEXT NOT NULL DEFAULT '';
CREATE TABLE IF NOT EXISTS brands (id TEXT PRIMARY KEY, name TEXT NOT NULL UNIQUE COLLATE NOCASE, logo_url TEXT NOT NULL DEFAULT '', display_order INTEGER NOT NULL DEFAULT 0 CHECK(display_order>=0));
INSERT OR IGNORE INTO brands(id,name,logo_url,display_order) VALUES ('smartwigi','Smartwigi','assets/partners/smartwigi%20OG.jpg',0);
INSERT OR IGNORE INTO brands(id,name,logo_url,display_order) VALUES ('terzol','Terzol Vastgoed','assets/partners/Terzol%20Partner%20OG.jpg',10);
INSERT OR IGNORE INTO brands(id,name,logo_url,display_order) VALUES ('sansoers-imports','Sansoers Imports','assets/partners/Sansoer%20Partner.png',20);
INSERT OR IGNORE INTO brands(id,name,logo_url,display_order) VALUES ('ingrediently','Ingrediently','assets/partners/Incrediently%20Partner%20OG.jpg',30);
INSERT OR IGNORE INTO brands(id,name,logo_url,display_order) VALUES ('xus-super-store','Xu''s Super Store','assets/partners/Xu%27s%20Partner.png',40);
UPDATE projects SET brand='Smartwigi' WHERE id IN ('smartwigi','fake-alexa','baby') AND brand='';
UPDATE projects SET brand='Terzol Vastgoed' WHERE id='terzol' AND brand IN ('','Terzol');
UPDATE projects SET brand='Sansoers Imports' WHERE id='mage-ev' AND brand IN ('','Mage EV');

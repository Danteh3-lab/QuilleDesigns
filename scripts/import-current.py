"""One-time, reviewable import of the supplied static portfolio. Never run during build."""
from pathlib import Path
from html.parser import HTMLParser
import re, json, shutil
root = Path(__file__).resolve().parent.parent
backup = root / '.cms-backup'
backup.mkdir(exist_ok=True)
for name in ['index.html', 'portfolio.html', 'portfolio.js', 'language.js', 'DESIGN.md']:
    target = backup / name
    if not target.exists(): shutil.copy2(root / name, target)
class Parser(HTMLParser):
    def __init__(self): super().__init__(); self.projects=[]; self.p=None; self.capture=None
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if tag=='article' and 'data-category' in a:
            self.p={'id':a.get('id','').removeprefix('project-'), 'category':a['data-category'], 'orientation':'portrait' if 'portrait' in a.get('class','') else 'landscape', 'display_order':len(self.projects)*10, 'published':1, 'revision':1}
        if self.p is None: return
        if tag=='a' and 'data-media' in a: self.p.update(title=a['data-title'],media_url=a['href'])
        if tag=='img' and 'project-image' in a.get('class',''): self.p.update(poster_url=a['src'],alt_text=a['alt'],width=int(a['width']),height=int(a['height']))
        if tag=='p': self.capture='caption'
        if tag=='span' and a.get('class')=='project-description': self.capture='description'
    def handle_data(self,data):
        if self.p is not None and self.capture: self.p[self.capture]=self.p.get(self.capture,'')+data
    def handle_endtag(self,tag):
        if tag in ['p','span']: self.capture=None
        if tag=='article' and self.p is not None:
            if not self.p['id']: self.p['id']=re.sub('[^a-z0-9]+','-',self.p['title'].lower()).strip('-')
            self.projects.append(self.p); self.p=None
p=Parser(); p.feed((root/'portfolio.html').read_text(encoding='utf-8'))
assert len(p.projects)==12
(root/'migrations').mkdir(exist_ok=True)
(root/'tests').mkdir(exist_ok=True)
(root/'tests'/'legacy-projects.json').write_text(json.dumps(p.projects,indent=2,ensure_ascii=False),encoding='utf-8')
schema='''PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS cms_migrations (name TEXT PRIMARY KEY);
CREATE TABLE IF NOT EXISTS cms_state (id INTEGER PRIMARY KEY CHECK(id=1), revision INTEGER NOT NULL);
INSERT OR IGNORE INTO cms_state VALUES (1,1);
CREATE TABLE IF NOT EXISTS projects (
 id TEXT PRIMARY KEY, title TEXT NOT NULL, category TEXT NOT NULL CHECK(category IN ('logo','video')),
 orientation TEXT NOT NULL CHECK(orientation IN ('landscape','portrait')),
 poster_url TEXT NOT NULL, media_url TEXT NOT NULL, alt_text TEXT NOT NULL,
 caption TEXT NOT NULL, description TEXT NOT NULL, width INTEGER NOT NULL, height INTEGER NOT NULL,
 display_order INTEGER NOT NULL CHECK(display_order>=0), published INTEGER NOT NULL CHECK(published IN (0,1)), revision INTEGER NOT NULL DEFAULT 1
);
CREATE INDEX IF NOT EXISTS published_order ON projects(published,category,orientation,display_order,id);
CREATE TABLE IF NOT EXISTS featured_slots (slot INTEGER PRIMARY KEY CHECK(slot IN (1,2)), project_id TEXT NOT NULL UNIQUE REFERENCES projects(id), revision INTEGER NOT NULL DEFAULT 1);
CREATE TABLE IF NOT EXISTS mutation_guard (valid INTEGER NOT NULL CHECK(valid=1));
CREATE TRIGGER IF NOT EXISTS featured_update_guard BEFORE UPDATE ON projects WHEN EXISTS(SELECT 1 FROM featured_slots WHERE project_id=OLD.id) AND (NEW.published!=1 OR NEW.category!='video') BEGIN SELECT RAISE(ABORT,'featured_project'); END;
CREATE TRIGGER IF NOT EXISTS featured_delete_guard BEFORE DELETE ON projects WHEN EXISTS(SELECT 1 FROM featured_slots WHERE project_id=OLD.id) BEGIN SELECT RAISE(ABORT,'featured_project'); END;
CREATE TRIGGER IF NOT EXISTS featured_insert_guard BEFORE INSERT ON featured_slots WHEN NOT EXISTS(SELECT 1 FROM projects WHERE id=NEW.project_id AND published=1 AND category='video') BEGIN SELECT RAISE(ABORT,'invalid_featured'); END;
CREATE TRIGGER IF NOT EXISTS project_insert_state AFTER INSERT ON projects BEGIN UPDATE cms_state SET revision=revision+1 WHERE id=1; END;
CREATE TRIGGER IF NOT EXISTS project_update_state AFTER UPDATE ON projects BEGIN UPDATE cms_state SET revision=revision+1 WHERE id=1; END;
CREATE TRIGGER IF NOT EXISTS project_delete_state AFTER DELETE ON projects BEGIN UPDATE cms_state SET revision=revision+1 WHERE id=1; END;
CREATE TABLE IF NOT EXISTS uploads (
 id TEXT PRIMARY KEY, owner TEXT NOT NULL, object_key TEXT NOT NULL UNIQUE, r2_upload_id TEXT NOT NULL,
 filename TEXT NOT NULL, content_type TEXT NOT NULL, size INTEGER NOT NULL, fingerprint TEXT NOT NULL,
 status TEXT NOT NULL CHECK(status IN ('uploading','completing','complete','aborted')), created_at INTEGER NOT NULL,
 expires_at INTEGER NOT NULL, validated INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS upload_parts (upload_id TEXT NOT NULL REFERENCES uploads(id) ON DELETE CASCADE, part INTEGER NOT NULL, etag TEXT NOT NULL, sha256 TEXT NOT NULL, size INTEGER NOT NULL, PRIMARY KEY(upload_id,part));
'''
def sql(v): return str(v) if isinstance(v,int) else "'"+v.replace("'","''")+"'"
for project in p.projects:
    keys=list(project)
    schema+='INSERT INTO projects ('+','.join(keys)+') SELECT '+','.join(sql(project[k]) for k in keys)+" WHERE NOT EXISTS(SELECT 1 FROM cms_migrations WHERE name='legacy-v1');\n"
for slot,project in [(1,'smartwigi'),(2,'terzol')]:
    schema+=f"INSERT INTO featured_slots SELECT {slot},'{project}',1 WHERE NOT EXISTS(SELECT 1 FROM cms_migrations WHERE name='legacy-v1');\n"
schema+="INSERT OR IGNORE INTO cms_migrations VALUES ('legacy-v1');\n"
(root/'migrations'/'0001_initial.sql').write_text(schema,encoding='utf-8')
print('Imported 12 projects; original source copies preserved in .cms-backup.')

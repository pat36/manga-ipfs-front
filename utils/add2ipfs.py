import ipfsapi
import os
import sys
import sqlite3 as sql

ipfs = ipfsapi.connect('127.0.0.1', 5001)
db = sql.connect("manga.db")

db.execute("CREATE TABLE IF NOT EXISTS series (series_id INTEGER not null primary key autoincrement,main_name text not null);")
db.execute("CREATE TABLE IF NOT EXISTS volumes (volume_id INTEGER not null primary key autoincrement,series_id INTEGER not null,foreign key(series_id) references series(series_id));")
db.execute("CREATE TABLE IF NOT EXISTS chapters (chapter_id INTEGER not null primary key autoincrement,chapter_name text not null,chapter INTEGER not null,volume_id INTEGER not null,language text default 'en',foreign key(volume_id) references volumes(volume_id));")
db.execute("CREATE TABLE IF NOT EXISTS pages (filepath text not null primary key);")
db.execute("CREATE TABLE IF NOT EXISTS chapters_pages (page_number INTEGER not null, chapter_id INTEGER NOT NULL,filepath text not null,foreign key(filepath) references pages(filepath),foreign key(chapter_id) references chapters(chapter_id));")


path = sys.argv[1]

os.chdir(sys.argv[1])
title = os.getcwd().split('/')[-1]

if len(db.execute("SELECT series_id FROM series WHERE main_name=?", (title,)).fetchall()) != 0:
    sys.exit("Series already exists!")
else:
    db.execute("INSERT INTO series(main_name) VALUES (?)", (title,))
    series_id = db.execute("SELECT series_id FROM series WHERE main_name=?", (title,)).fetchone()[0]
    db.execute("INSERT INTO volumes(series_id) VALUES(?)", (series_id,))
    volume_id = db.execute("SELECT volume_id FROM volumes WHERE series_id=?", (series_id,)).fetchone()[0]
    db.execute("INSERT INTO chapters(chapter_name, chapter, volume_id) VALUES('rozdzial', '1', ?)", (volume_id,))
    chapter_id = db.execute("SELECT chapter_id FROM chapters WHERE volume_id=?", (volume_id,)).fetchone()[0]
    for file in sorted(os.listdir()):
        hash = ipfs.add(file)['Hash']
        if len(db.execute("SELECT filepath FROM pages WHERE filepath=?", (hash,)).fetchall()) == 0:
            db.execute("INSERT INTO pages VALUES(?)", (hash,))
        db.execute("INSERT INTO chapters_pages(page_number, chapter_id, filepath) VALUES(?,?,?)", (file.split('.')[0], chapter_id, hash))
    db.commit()
    

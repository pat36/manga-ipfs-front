import json
import sqlite3 as sql

if __name__ == "__main__":
    schema = []
    db = sql.connect("manga.db")
    for (series_id, series_name) in db.execute("SELECT * FROM series;").fetchall():
        series = {}
        pages = []
        series["id"] = series_id
        series["series_name"] = series_name
        
        page = db.execute("SELECT page_number, filepath FROM chapters_pages INNER JOIN chapters ON chapters_pages.chapter_id=chapters.chapter_id INNER JOIN volumes ON chapters.volume_id=volumes.volume_id INNER JOIN series ON volumes.series_id=series.series_id WHERE series.series_id=?", (series_id,)).fetchall()
        i = 0

        while i < len(page):
            pages.append(page[i][1])
            i += 1
        series["pages"] = pages
        schema.append(series)
    with open("manga.json", "w") as f:
        json.dump(schema, f)

#!/usr/bin/env python3

import json
import re
import urllib.parse
import urllib.request
from datetime import date
from pathlib import Path

ORCID = "0000-0002-2823-5376"
DISPLAY_NAME = "Kidanemaryam Wagaw Reta"
MAILTO = "kidane.et@gmail.com"

ROOT = Path(__file__).resolve().parents[1]
AUTO_PUBLICATIONS = ROOT / "_data" / "auto_publications.yml"
PUBLICATION_METRICS = ROOT / "_data" / "publication_metrics.yml"

OPENALEX = "https://api.openalex.org"


def fetch_json(url):
    request = urllib.request.Request(
        url,
        headers={
            "User-Agent": f"Kidane academic website updater; mailto:{MAILTO}",
            "Accept": "application/json",
        },
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        return json.loads(response.read().decode("utf-8"))


def yaml_quote(value):
    if value is None:
        return '""'
    value = str(value).replace("\n", " ").strip()
    value = value.replace('"', '\\"')
    return f'"{value}"'


def doi_url(doi):
    if not doi:
        return ""
    doi = doi.replace("https://doi.org/", "").strip()
    return f"https://doi.org/{doi}"


def clean_title(title):
    title = title or "Untitled publication"
    return re.sub(r"\s+", " ", title).strip()


def get_author():
    # Try ORCID lookup first.
    url = f"{OPENALEX}/authors/orcid:{urllib.parse.quote(ORCID)}"
    try:
        return fetch_json(url)
    except Exception:
        pass

    # Fallback: search by name.
    query = urllib.parse.quote(DISPLAY_NAME)
    url = f"{OPENALEX}/authors?search={query}&per-page=5"
    data = fetch_json(url)
    results = data.get("results", [])
    if not results:
        raise RuntimeError("No OpenAlex author record found.")

    return results[0]


def get_works(author_id):
    encoded_author = urllib.parse.quote(author_id, safe="")
    url = (
        f"{OPENALEX}/works?"
        f"filter=author.id:{encoded_author}"
        f"&sort=publication_date:desc"
        f"&per-page=200"
    )
    data = fetch_json(url)
    return data.get("results", [])


def format_publications(works):
    items = []

    for work in works:
        title = clean_title(work.get("title"))
        year = work.get("publication_year") or ""
        pub_date = work.get("publication_date") or ""
        doi = work.get("doi") or ""
        primary_location = work.get("primary_location") or {}
        source = (primary_location.get("source") or {}).get("display_name") or ""
        openalex_url = work.get("id") or ""
        cited_by_count = work.get("cited_by_count") or 0
        work_type = work.get("type") or ""

        authors = []
        for authorship in work.get("authorships", []):
            author = authorship.get("author") or {}
            name = author.get("display_name")
            if name:
                authors.append(name)

        items.append(
            {
                "title": title,
                "year": year,
                "date": pub_date,
                "authors": authors,
                "source": source,
                "doi": doi_url(doi),
                "openalex": openalex_url,
                "citations": cited_by_count,
                "type": work_type,
            }
        )

    return items


def write_publications(items):
    lines = []
    lines.append("# Automatically updated from OpenAlex. Edit script settings, not this file.\n")
    lines.append(f"# Last updated: {date.today().isoformat()}\n")

    for item in items:
        lines.append("- title: " + yaml_quote(item["title"]) + "\n")
        lines.append(f"  year: {item['year']}\n")
        lines.append("  date: " + yaml_quote(item["date"]) + "\n")
        lines.append("  authors:\n")
        for author in item["authors"]:
            lines.append("    - " + yaml_quote(author) + "\n")
        lines.append("  source: " + yaml_quote(item["source"]) + "\n")
        lines.append("  doi: " + yaml_quote(item["doi"]) + "\n")
        lines.append("  openalex: " + yaml_quote(item["openalex"]) + "\n")
        lines.append(f"  citations: {item['citations']}\n")
        lines.append("  type: " + yaml_quote(item["type"]) + "\n\n")

    AUTO_PUBLICATIONS.write_text("".join(lines), encoding="utf-8")


def write_metrics(author, items):
    total_citations = sum(item["citations"] for item in items)
    total_publications = len(items)
    cited_items = sorted([item["citations"] for item in items], reverse=True)

    h_index = 0
    for i, citations in enumerate(cited_items, start=1):
        if citations >= i:
            h_index = i

    lines = [
        "# Automatically updated from OpenAlex.\n",
        f"last_updated: {date.today().isoformat()}\n",
        "source: OpenAlex\n",
        "note: Citation counts may differ from Google Scholar and ResearchGate.\n",
        f"author_name: {yaml_quote(author.get('display_name') or DISPLAY_NAME)}\n",
        f"orcid: {yaml_quote(ORCID)}\n",
        f"openalex_author: {yaml_quote(author.get('id') or '')}\n",
        f"total_publications: {total_publications}\n",
        f"total_citations: {total_citations}\n",
        f"h_index_openalex_estimate: {h_index}\n",
        "google_scholar: https://scholar.google.com/citations?user=0C-PTFgAAAAJ&hl=en\n",
        "researchgate: https://www.researchgate.net/profile/Kidanemaryam-Wagaw\n",
    ]

    PUBLICATION_METRICS.write_text("".join(lines), encoding="utf-8")


def main():
    author = get_author()
    works = get_works(author["id"])
    items = format_publications(works)

    write_publications(items)
    write_metrics(author, items)

    print(f"Updated {AUTO_PUBLICATIONS}")
    print(f"Updated {PUBLICATION_METRICS}")
    print(f"Works found: {len(items)}")


if __name__ == "__main__":
    main()

import requests
from xml.dom.minidom import parseString
import json
from kestra import Kestra
from bs4 import BeautifulSoup
import csv
import re
import sys
import json

max_publish_date = sys.argv[1]
max_guid= sys.argv[2]

def fetch_rss_feed(urls):
    try:
        news_articles = []
        seen_guids = set()

        for url in urls:
            response = requests.get(url)
            response.raise_for_status()

            xml_data = response.text
            dom = parseString(xml_data)
            items = dom.getElementsByTagName("item")
            source = "Times of India"

            for item in items:
                title = item.getElementsByTagName("title")[0].firstChild.nodeValue if item.getElementsByTagName("title") else None
                link = item.getElementsByTagName("link")[0].firstChild.nodeValue if item.getElementsByTagName("link") else None
                publish_date = item.getElementsByTagName("pubDate")[0].firstChild.nodeValue if item.getElementsByTagName("pubDate") else None
                string_guid = item.getElementsByTagName("guid")[0].firstChild.nodeValue if item.getElementsByTagName("guid") else None
                guid_match = re.search(r"(\d+)\.cms$", string_guid)
                guid = int(guid_match.group(1)) if guid_match else None

                if guid in seen_guids:
                    continue
                int_max_guid = int(max_guid)

                if guid is None or int_max_guid is None:
                    continue
                if guid <= int_max_guid:
                    continue

                content = scrape_data(link)

                if publish_date > max_publish_date :
                    news_articles.append({
                        "guid": guid,
                        "title": title,
                        "content": content,
                        "link": link,
                        "publish_date": publish_date,
                        "source": source,
                    })
                    seen_guids.add(guid)

        csv_file_path = 'news_articles.csv'

        with open(csv_file_path, mode='w', newline='', encoding='utf-8') as csv_file:
            fieldnames = ["guid", "title", "content", "link", "publish_date", "source"]
            writer = csv.DictWriter(csv_file, fieldnames=fieldnames)

            writer.writeheader()
            writer.writerows(news_articles)

    except requests.exceptions.RequestException as e:
        print(f"Error fetching the RSS Feed: {e}")
    except Exception as e:
        print(f"Error processing the RSS Feed: {e}")


def scrape_data(url):
    try:
        response = requests.get(url)
        response.raise_for_status()
        html_content = response.text

        soup = BeautifulSoup(html_content, "html.parser")

        news_content = soup.select_one("div._s30J.clearfix")

        if news_content:
            return news_content.get_text(strip=True)
        else:
            return "Content not found"

        print("Scraping completed successfully.")
    except Exception as e:
        print(f"An error occurred: {e}")


urls = ["https://timesofindia.indiatimes.com/rssfeeds/-2128936835.cms", "https://timesofindia.indiatimes.com/rssfeedmostrecent.cms", "https://timesofindia.indiatimes.com/rssfeeds/296589292.cms","https://timesofindia.indiatimes.com/rssfeeds/2886704.cms"]

# Fetch RSS Feed
fetch_rss_feed(urls)

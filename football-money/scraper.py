# Save-a á tölvunna jafnóðum svo minnið verði ekki fullt!!

import numpy as np
from bs4 import BeautifulSoup
import requests
import json

player_list = []
url = 'https://www.fifaindex.com/players/{}/'  # creating url for primary pages

pageno = 1


def get_next(text, soup, type="float"):
    val = soup.find(text=text)
    if val and type == "float":
        try:
            val = float(val.findNext().text)
        except:
            val = -1
        return val
    elif val and type == "string":
        return val.findNext().text
    return -1

def scrape_fifa_site(page):
    response2 = requests.get(page)
    subpage = response2.text
    # turn secondary page into soup
    soup = BeautifulSoup(subpage, 'lxml')
    player = soup.find_all('h5', class_='card-header')[0].contents[0]
 
    
    if soup.find_all('p', class_='data-currency data-currency-euro'):
        values = soup.find_all('p', class_='data-currency data-currency-euro')
        if len(values) > 0:
            market_value = values[0].findNext().text.split("€")
            if len(market_value)>1: 
                market_value = market_value[1]
            else:
                market_value = -1

            weekly_salary = values[1].findNext().text.split("€") # [1]
            if len(weekly_salary)>1: 
                weekly_salary = weekly_salary[1]
            else:
                weekly_salary = -1
            
        else:
            market_value = -1
            weekly_salary = -1
        # print("market value", market_value)
    else:
        market_value = -1
        weekly_salary = -1
    height = soup.find_all(
        'span', class_="data-units data-units-metric")[0].text.split()[0]
    weight = soup.find_all(
        'span', class_="data-units data-units-metric")[1].text.split()[0]
    age = soup.find(text='Age ').findNext().text
    preferred_foot = soup.find(text='Preferred Foot ').findNext().text

    preferred_position = [a.text for a in soup.find_all(
        'a', class_='link-position')]
    kit_number = get_next("Kit Number ", soup)
    ball_control = get_next('Ball Control ', soup, type="float")
    dribbling =  get_next('Dribbling ', soup, type="float")
    marking = get_next("Marking ", soup)

    slide_tackle = get_next("Slide Tackle ", soup) 
    stand_tackle = get_next("Stand Tackle ", soup)  

    aggression = get_next("Aggression ", soup) 

    reactions = get_next(text='Reactions ', soup=soup)
    attack_position = get_next("Att. Position ", soup) 
    interceptions = get_next("Interceptions ", soup)
    vision = get_next("Vision ", soup) 
    composure = get_next("Composure ", soup) 

    crossing = get_next("Crossing ", soup) 
    short_pass = get_next("Short Pass ", soup) 
    long_pass = get_next("Long Pass ", soup) 

    acceleration = get_next("Acceleration ", soup) 
    stamina = get_next("Stamina ", soup) # float(soup.find(text='Stamina ').findNext().text)
    strength = get_next("Strength ", soup) #  float(soup.find(text='Strength ').findNext().text)
    balance = get_next("Balance ", soup) # float(soup.find(text='Balance ').findNext().text)
    sprint_speed = get_next("Sprint Speed ", soup) # float(soup.find(text='Sprint Speed ').findNext().text)
    agility = get_next("Agility ", soup) # float(soup.find(text='Agility ').findNext().text)
    jumping = get_next("Jumping ", soup)

    heading = get_next("Heading ", soup) 
    shot_power = get_next("Shot Power", soup) 
    finishing = get_next("Finishing ", soup)
    long_shots = get_next("Long Shots ", soup) 
    curve = get_next("Curve ",soup)
    fk_acc = get_next("FK Acc. ", soup) 
    penalties = get_next("Penalties ",soup) 
    volleys = get_next("Volleys ", soup) 

    gk_positioning = get_next("GK Positioning ",soup)
    gk_diving = get_next("GK Diving ", soup) 
    gk_handling = get_next("GK Handling ", soup) 
    gk_kicking = get_next("GK Kicking ", soup) 
    gk_reflexes = get_next("GK Reflexes ", soup)

    teams = [a.text for a in soup.find_all('a', class_='link-team')]
    teams.remove("")
    player = {'Player': player,
        'Market Value': market_value,
        'Weekly Salary': weekly_salary, 
        'height': height, 
        'weight': weight, 
        'age': age, 
        'preferred Foot': preferred_foot,
        "teams": teams,
        "preferred_Position": preferred_position,
        "kit number": kit_number,
        "dribbling":dribbling,
        "ball control":ball_control,
        "marking":marking,
        "slide tackle":slide_tackle,
        "stand tackle":stand_tackle,
        "aggression":aggression,
        "reactions":reactions,
        "attack_position":attack_position,
        "interceptions":interceptions,
        "vision":vision,
        "composure":composure,
        "crossing":crossing,
        "short pass":short_pass,
        "long pass":long_pass,
        "acceleration":acceleration,
        "stamina":stamina,
        "strength":strength,
        "balance":balance,
        "sprint speed":sprint_speed,
        "agility":agility,
        "jumping":jumping,
        "heading":heading,
        "shot power":shot_power,
        "finishing":finishing,
        "long shots":long_shots,
        "curve":curve,
        "FK acc":fk_acc,
        "penalties":penalties,
        "volleys":volleys,
        "GK positioning":gk_positioning,
        "GK diving":gk_diving,
        "GK handling":gk_handling,
        "GK kicking":gk_kicking,
        "GK reflexes":gk_reflexes,
        "url":page,
        }
    return player

def run_scraper():
    while True:
        webpage = url.format(pageno)
        response1 = requests.get(webpage)
        if response1.status_code != 200:   # if maximum page exceeded, break out of loop
            break
        mainpage = response1.text
        mainsoup = BeautifulSoup(mainpage, 'lxml')   # turn primary page into soup
        # iterate through each player on primary pages
        for tag in mainsoup.find_all('td', attrs={'data-title': 'Name'}):

            webpage2 = 'https://www.fifaindex.com' + \
                str(tag.find('a')['href'])  # link for secondary pages
            player = scrape_fifa_site(webpage2)
            player_list.append(player)

        print(pageno)
        if pageno % 10 == 0 and pageno != 0:
            print("saving")
            with open("players_new.json", "w", encoding="utf8") as file:
                json.dump(player_list, file, ensure_ascii=False)
        pageno += 1
        


    with open("players_new.json", "w", encoding="utf8") as file:
        json.dump(player_list, file, ensure_ascii=False)

if __name__ == "__main__":
    run_scraper()

import json 

with open("data.json", "r", encoding="utf-8") as f:
    data = json.load(f)
    


for item in data:
    n = item["soundUrl"]
    n = n.split("/")[-1]
    n = n.split(".")[0]
    
    item["thumb"] = f"https://fuglavefur.is/thumbs/{n}.jpg"
    
with open("data.json", "w", encoding="utf-8") as f:
    json.dump(data,f,ensure_ascii=False)
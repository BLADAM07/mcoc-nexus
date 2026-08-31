content = open('nesux-backend/backend/mcoc_data_module.py', 'r', encoding='utf-8').read()
content = content.replace('json.loads(MCOC_DATA_RAW)', 'json.loads(MCOC_DATA_RAW, strict=False)')
with open('nesux-backend/backend/mcoc_data_module.py', 'w', encoding='utf-8') as f:
    f.write(content)

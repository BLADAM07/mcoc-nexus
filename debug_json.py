content = open('nesux-backend/backend/mcoc_data_module.py', 'r', encoding='utf-8').read()
raw = content.split('"""')[1]
print('Context:', repr(raw[222900:222950]))

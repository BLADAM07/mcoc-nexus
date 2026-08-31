import sys
sys.path.insert(0, 'nesux-backend')
from backend.data_loader import load_all_mcoc_data

print('Loading data...')
data = load_all_mcoc_data()

print('Writing module...')
with open('nesux-backend/backend/mcoc_data_module.py', 'w', encoding='utf-8') as f:
    f.write('MCOC_DATA = ' + repr(data) + '\n')
print('Done.')

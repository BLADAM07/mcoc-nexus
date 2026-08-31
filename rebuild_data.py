import sys
import os

# Point to the correct Excel file BEFORE importing data_loader
EXCEL_PATH = os.path.abspath(r'nexus-frontend\public\excle\MCOC_dataset.xlsx')
IMAGES_PATH = os.path.abspath(r'nexus-frontend\public\images')

print('Excel path:', EXCEL_PATH)
print('Excel exists:', os.path.exists(EXCEL_PATH))

sys.path.insert(0, 'nesux-backend')

# Patch module variables before the module uses them
import backend.data_loader as dl
dl.DATASET_PATH = EXCEL_PATH
dl.IMAGES_DIR = IMAGES_PATH
dl.CLASSES_DIR = os.path.join(IMAGES_PATH, 'classes')

# Rebuild the IMAGE_MAP with the correct images dir
dl.IMAGE_MAP = {}
if os.path.exists(IMAGES_PATH):
    for f in os.listdir(IMAGES_PATH):
        full_path = os.path.join(IMAGES_PATH, f)
        if os.path.isfile(full_path):
            stem = os.path.splitext(f)[0]
            norm = dl.normalize_key(stem)
            dl.IMAGE_MAP[norm] = f

print('Images mapped:', len(dl.IMAGE_MAP))

data = dl.load_all_mcoc_data()
print('Champions loaded:', len(data.get('champions', [])))
print('Glossary entries:', len(data.get('glossary', [])))
print('Immunities:', len(data.get('immunities', [])))
print('Tags:', len(data.get('all_tags', [])))

print('Writing mcoc_data_module.py...')
with open('nesux-backend/backend/mcoc_data_module.py', 'w', encoding='utf-8') as f:
    f.write('MCOC_DATA = ' + repr(data) + '\n')
print('Done! File size:', os.path.getsize('nesux-backend/backend/mcoc_data_module.py'), 'bytes')

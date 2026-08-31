import openpyxl
import codecs

file_path = 'nexus-frontend/public/excle/MCOC_dataset.xlsx'
wb = openpyxl.load_workbook(file_path, read_only=True)
sheet = wb['Act 8 Guide']

with codecs.open('act8_guide_full.txt', 'w', encoding='utf-8') as f:
    for row in sheet.iter_rows(values_only=True):
        f.write(str(row) + "\n")

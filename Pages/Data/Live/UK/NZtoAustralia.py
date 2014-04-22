import sys
import fileinput
import os


    
originString = "assert"
folderPath = "C:\\Users\\Philch\\Desktop\\selenium_IDE\\Pages\\Data\\Live\\UK\\"
fileType = "html"

def timesToReadLine(filename, times = 1, prePosition = None, postPosition = None):
    for time in range (times):
        currentLine = filename.readline()[prePosition:postPosition]
    return currentLine
    
def replaceCharacters(line):
    if '&' in line:
        line = line.replace('&', '&amp;')
    if '</td>' in line:
        line = line.replace('</td>', '')
    return line

def convertFile(inputFile):
    for line in fileinput.input(folderPath+inputFile, inplace=1):
        sys.stdout.write(line.replace('AU', 'UK'))  # replace 'sit' and write
        
for file in os.listdir(folderPath):
    try:
        print (file)
        filetype = file.split('.')
        if filetype[1]==fileType:
           convertFile(file)
    except IndexError:
        print ("No childNodes for this element")
import sys
import os 

    
locatorPrefix = "<td>clickAndWait</td>"
titlePrefix = "assertTitle"
folderPath = "C:\\Users\\Philch\\Desktop\\selenium_IDE\\Pages\\Data\\Live\\NZ\\"
fileType = "html"

def timesToReadLine(filename, times = 1, prePosition = None, postPosition = None):
    for time in range (times):
        currentLine = filename.readline()[prePosition:postPosition]
    return currentLine
    
def replaceCharacters(line):
    if '</td>' in line:
        line = line.replace('</td>', '')
    return line

def convertFile(inputFile):
    outputFile = file.rstrip(fileType) +'xml'
    fileInAction = open(folderPath+outputFile, 'w')
    if inputFile != None:
        fileToConvert = open(folderPath+inputFile, 'r')
    else:
        fileToConvert = open(folderPath+'fileToConvert.txt', 'r')

    fileInAction.write('<?xml version="1.0" encoding="UTF-8"?>\n')
    fileInAction.write('<testdata>\n')
    for line in fileToConvert:
        if locatorPrefix in line:
            locator = replaceCharacters(timesToReadLine(fileToConvert)[5:].rstrip())
            print  ("locator =" + locator)
            secondLine = timesToReadLine(fileToConvert, 4)
            if titlePrefix in secondLine:
                title = replaceCharacters(timesToReadLine(fileToConvert)[5:].rstrip())
                print("title = "+title)
                fileInAction.write("    <vars locator=\"" + str(locator) +"\" title=\"" + str(title) + "\"/>" + "\n")
            else:
                fileInAction.write("    <vars locator=\"" + str(locator) +"\" title=\"\"/>" + "\n")
        # fileInAction.write("    <vars locator=\"%s\" title=/>\n"%str1)
        # fileInAction.write('    <vars locator={0}/>'.format(str1.lstrip(locatorPrefix)))
    fileInAction.write('</testdata>')



for file in os.listdir(folderPath):
    try:
        print (file)
        filetype = file.split('.')
        if filetype[1]==fileType:
            convertFile(file)
    except IndexError:
        print ("No childNodes for this element")
    


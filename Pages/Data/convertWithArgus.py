import sys

inputFile = str(sys.argv[1])
outputFile = inputFile.rstrip("txt") +'xml'

locatorPrefix = "clickAndWait | "
titlePrefix = "assertTitle | "
f1 = open(outputFile, 'a')
if inputFile != None:
	fToConvert = open(inputFile, 'r')
else:
	fToConvert = open('fileToConvert.txt', 'r')

f1.write('<?xml version="1.0" encoding="UTF-8"?>\n')
f1.write('<testdata>\n')
for line in fToConvert:
    if locatorPrefix in line:
        locator = line[15:].rstrip()
        # print(locator)
        if '&' in locator:
            locator = locator.replace('&', '&amp;')
            # print(locator)
        secondLine = fToConvert.readline()
        if titlePrefix in secondLine:
            title = secondLine[14:].rstrip()
            print(title)
            if '&' in title:
                title = title.replace('&', '&amp;')
                print(title)
            f1.write("    <vars locator=\"" + str(locator) +"\" title=\"" + str(title) + "\"/>" + "\n")
        else:
            f1.write("    <vars locator=\"" + str(locator) +"\" title=\"\"/>" + "\n")
        # f1.write("    <vars locator=\"%s\" title=/>\n"%str1)
        # f1.write('    <vars locator={0}/>'.format(str1.lstrip(locatorPrefix)))
f1.write('</testdata>')

f1.close()
fToConvert.close()
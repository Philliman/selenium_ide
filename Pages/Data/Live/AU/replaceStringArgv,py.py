import sys
import fileinput
import os
    
stringToReplace = str(sys.argv[1])
replaceTo = str(sys.argv[2])
filename = str(sys.argv[3])


def convertFile(inputFile):
    for line in fileinput.input(inputFile, inplace=1):
        sys.stdout.write(line.replace(stringToReplace, replaceTo))  # replace 'sit' and write

convertFile(filename)

import json


def processJSON(data):
  matrix = json.loads(data)
  nrOfItemsInRow = len(matrix[0])

  colsums = [0] * nrOfItemsInRow
  rowsums = [0] * nrOfItemsInRow

  rownum = 0

  for row in matrix:
    rowsum = 0
    colnr = 0
    for col in row:
      rowsum = rowsum + col +1
      colsums[colnr] = colsums[colnr] + col +1
      colnr = colnr + 1
    rowsums[rownum] = rowsum
    rownum = rownum + 1

  return matrix, rowsums, colsums


def printBoard(matrix, rowsums, colsums):
  rownum = 0

  for row in matrix:
    colnr = 0
    for col in row:
      print(f"{col:>3}", end=" ")
    print(f"| {rowsums[rownum]:<3}")
    rownum = rownum + 1

  for s in colsums:
    print(f"{s:>3}", end=" ")
  print()


# convert to set and test if the length is 1 or 0 (empty set)
def allEqual(items):
  return len(set(items)) <= 1


# Press the green button in the gutter to run the script.
if __name__ == '__main__':
  file = open('/mnt/ssd/Develop/Develop/wiskunde/magicalknightstour/8x8-0,0.solutions.json', 'r')
  linenr = 1
  while True:
    line = file.readline()
    if not line:
      break
    matrix, rowsums, colsums = processJSON(line)
    print(f"{linenr}:{len(matrix)}x{len(matrix)} => {rowsums[0]} ")
    linenr = linenr + 1

    # printBoard(matrix, rowsums, colsums)
    if allEqual(rowsums) and allEqual(colsums) and rowsums[0] == colsums[0]:
      print("------------------- MAGIC ---------------")
      printBoard(matrix)

  file.close()

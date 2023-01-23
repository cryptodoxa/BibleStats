import os 
import sys
import csv
import string


BIBLE = None
FREQ = None
CONC = None

def get_script_path():
  return os.path.dirname(os.path.realpath(sys.argv[0]))

def load_bible():
  global BIBLE
  if BIBLE:
    return BIBLE
  filenym = "data/csv/t_kjv.csv"
  with open(filenym) as f:
    reader = csv.reader(f)
    data = list(reader)
    data.pop(0) #headers
    data.pop(30673) #blank verse
  BIBLE = data
  return data

def load_frequency():
  global FREQ
  bible = load_bible()
  if FREQ:
    return FREQ
  data = {}
  for verse in bible:
    text = verse[4]

    #removes punctutation and lowercases
    words = [word.translate(str.maketrans('', '', string.punctuation)).lower() for word in text.split(" ")]
    for word in words:
      if data.get(word):
        data[word] = data.get(word) + 1
      else:
        data[word] = 1
  
  # sort in descending order
  data = {key: val for key, val in sorted(data.items(), key= lambda el: el[1], reverse=True)}
  FREQ = data
  return data

def load_concordance():
  global CONC
  if CONC:
    return CONC
  bible = load_bible()
  data = {}
  for idx, verse in enumerate(bible):
    text = verse[4]
    #removes punctutation and lowercases
    words = [word.translate(str.maketrans('', '', string.punctuation)).lower() for word in text.split(" ")]
    for word in words:
      site = (idx,verse[1],verse[2], verse[3]) #index num, book, chapter, verse
      if data.get(word):
        old = data.get(word)
        old[0]+= 1
        old.append(site)
        data[word] = old
      else:
        data[word] = [1, site]
  
  # sort in descending order
  data = {key: val for key, val in sorted(data.items(), key= lambda el: el[1][0], reverse=True)}
  CONC = data
  return data


def show_verses(word, page=0, all=False):
  conc = load_concordance()
  bible = load_bible()
  num_sites = all and 99999 or 10
  data = conc[word]

  output = []
  start = 10 * page + 1
  for idx, item in enumerate(data[start:]):
    if idx == num_sites:
      break
    output.append(bible[item[0]])
  
  return output


if __name__ == "__main__":
  print("hello world")

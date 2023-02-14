import os 
import sys
import csv
import string
import json



BIBLE = None
FREQ = None
CONC = None
KJV_DISCARD = ['the','and','of','to','that','in','he','shall','unto','for','i','his','a','they',
  'be','is','him','not','them','it','with','thou','thy','was','as','are']


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
    words = [word.strip(string.punctuation).lower() for word in text.split(" ")]
    for word in words:
      if word in KJV_DISCARD:
        continue
      site = (idx,verse[1],verse[2], verse[3]) #index num, book, chapter, verse
      if data.get(word):
        old = data.get(word)
        old[0]+= 1
        if not site in old:
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


def output_conc_json(filenym="concordance.json"):
  conc = load_concordance()
  fullnym = "data/output/" + filenym
  outstr = json.dumps(conc)
  outfile = open(fullnym, "w")
  outfile.write(outstr)
  outfile.close()
  
def output_bible_json(filenym="kjv.json"):
  outfilenym = "data/output/" + filenym
  bible = load_bible()
  outdata = []
  output = [verse[4] for verse in bible]
  outstr = json.dumps(output)
  outfile = open(outfilenym, "w")
  outfile.write(outstr)
  outfile.close()

def output_toc_json(filenym="toc.json"):
  # Table of Contents (toc) maps book number to book name
  infilenym = "data/csv/key_english.csv"
  outfilenym = "data/output/" + filenym
  with open(infilenym) as f:
    reader = csv.reader(f)
    data = list(reader)
    data.pop(0) # headers
  output_data = {}
  for item in data:
    output_data[item[0]] = item[1]
  outfile = open(outfilenym, "w")
  outfile.write(json.dumps(output_data))
  outfile.close()

if __name__ == "__main__":
  print("hello world")

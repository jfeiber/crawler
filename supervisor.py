import urllib2, time, json, os
from threading import Thread

if os.environ['HOME'] == '/Users/jfeiber':
	DB_SUPERVISOR_URL = 'http://127.0.0.1:5001/nextlinktocrawl'
else:
	DB_SUPERVISOR_URL = 'someaddress:5001/nextlinktocrawl'

while (True):
	while (True):
		obj = json.loads(urllib2.urlopen(DB_SUPERVISOR_URL).read())
		try:
			obj['Error']
		except KeyError:
			linkToCrawl = obj['Link']
			break
	
	


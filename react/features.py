import numpy as np, urllib2
from django.conf import settings
#from scipy import ndimage

try:
    from cStringIO import StringIO
except:
    from StringIO import StringIO

# from http://stackoverflow.com/questions/6464353/np-array-from-cstringio-object-and-avoiding-copies
def chariter(filelike):
    while True:
        octet = filelike.read(1)
        if octet:
            yield ord(octet)
        else:
            return

def extract_features(cache_key, url):
    if url:
        print url
        response = urllib2.urlopen(url)
        bits = np.fromstring(StringIO(response.read()).getvalue(), dtype=np.uint8)

        if settings.DEBUG:
            pass

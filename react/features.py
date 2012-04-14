import logging, numpy as np, sys, urllib2
from django.core.cache import cache
from PIL import Image

try:
    from scipy import ndimage
except:
    from scipy_local import ndimage

try:
    from cStringIO import StringIO
except:
    from StringIO import StringIO

logger = logging.getLogger('react')


def rgb_histogram(im):
    r = np.asarray(im.convert('RGB', (1,0,0,0, 1,0,0,0, 1,0,0,0) ))
    g = np.asarray(im.convert('RGB', (0,1,0,0, 0,1,0,0, 0,1,0,0) ))
    b = np.asarray(im.convert('RGB', (0,0,1,0, 0,0,1,0, 0,0,1,0) ))
    hr, hr_bins = np.histogram(r, bins=256, density=True)
    hg, hg_bins = np.histogram(g, bins=256, density=True)
    hb, hb_bins = np.histogram(b, bins=256, density=True)
    h_rgb = np.array([hr, hg, hb]).ravel()
    return h_rgb

def extract_features(cache_key, url, feature_list=['rgb_histogram']):
    if url:
        logger.debug('extracting features for document at: %s' % url)
        response = urllib2.urlopen(url)
        im = Image.open(StringIO(response.read()))
        feature_dict = cache.get(cache_key, { }) 

        for feature in feature_list:
            feature_dict[feature] = getattr(sys.modules[__name__], feature)(im) 
            cache.set(cache_key, feature_dict)
            print feature_dict


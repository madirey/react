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

def filter(results, source, relevant_docs, irrelevant_docs, feature):
    if feature == 'rgb_histogram':
        distances = { }
        distances_irrelevant = { }
        for photo_id in relevant_docs:
            distances[photo_id] = []
            cache_key = '%s-%s' % (source, photo_id)
            features = cache.get(cache_key)
            ft_1 = features[feature]
            
            for p in results:
                c_key = '%s-%s' % (source, p.get('id'))
                featurez = cache.get(c_key)
                ft_2 = featurez[feature]
                diff = ft_1 - ft_2
                distances[photo_id].append(np.sqrt(np.dot(diff, diff)))
        cum_r_distances = map(sum, zip(*distances.values()))
        if len(cum_r_distances) == 0:
            cum_r_distances = [1.0] * len(results)
        # normalize
        v_max = max(cum_r_distances)
        cum_r_distances = [ x / (v_max * 1.0) for x in cum_r_distances]
        cum_r_distances = [1.0-x for x in cum_r_distances]

        for photo_id in irrelevant_docs:
            distances_irrelevant[photo_id] = []
            cache_key = '%s-%s' % (source, photo_id)
            features = cache.get(cache_key)
            ft_1 = features[feature]

            for p in results:
                c_key = '%s-%s' % (source, p.get('id'))
                featurez = cache.get(c_key)
                ft_2 = featurez[feature]
                diff = ft_1 - ft_2
                distances_irrelevant[photo_id].append(np.sqrt(np.dot(diff, diff)))
        cum_i_distances = map(sum, zip(*distances_irrelevant.values()))
        if len(cum_i_distances) == 0:
            cum_i_distances = [1.0] * len(results)
        # normalize
        v_max = max(cum_i_distances)
        cum_i_distances = [ x / (v_max * 1.0) for x in cum_i_distances]

        scores = [x*y for x,y in zip(cum_r_distances, cum_i_distances)]

        sortable = []
        for i, result in enumerate(results):
            sortable.append({'obj': result, 'distance': scores[i]})
        sortable = sorted(sortable, key=lambda s: s['distance'], reverse=True)
        return [s['obj'] for s in sortable] 
    return results



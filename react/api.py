from django.conf.urls.defaults import *
from django.core.cache import cache
from tastypie import fields
from tastypie.authorization import Authorization
from tastypie.paginator import Paginator
from tastypie.resources import Resource
from tastypie.utils import trailing_slash
import flickrapi, hashlib


class DocumentObject(object):
    def __init__(self, **kwargs):
        self.source      = kwargs.get('source', None) 
        self.relevant    = kwargs.get('relevant', True)
        self.url         = kwargs.get('url', None) 
        self.id          = hashlib.sha1(self.url).hexdigest()
        self.features    = { 'hsv_histogram': [] }

# begin testing
doc1 = DocumentObject(url='http://foobar1.com')
doc2 = DocumentObject(url='http://foobar2.com')
doc3 = DocumentObject(url='http://foobar3.com')
cache.set(doc1.id, doc1)
cache.set(doc2.id, doc2)
cache.set(doc3.id, doc3)
# end testing

flickr = flickrapi.FlickrAPI('2de139a8b38bf796c0a9d3eaccda137f', cache=True)

class FlickrResource(Resource):
    id       = fields.CharField(attribute='id')
    relevant = fields.BooleanField(attribute='relevant')
    source   = fields.CharField(attribute='source')
    url      = fields.FileField(attribute='url')

    class Meta:
        resource_name = 'flickr'
        object_class  = DocumentObject
        authorization = Authorization()

    def override_urls(self):
        return [
            url(r'^(?P<resource_name>%s)/search/(?P<query>\w+)%s$' %
                (self._meta.resource_name, trailing_slash()), self.wrap_view('get_search'), name='api_get_search'),
        ]

    def _output_adapter(self, obj):
        url = 'http://farm%s.staticflickr.com/%s/%s_%s.jpg' % \
            (obj.get('farm'), obj.get('server'), obj.get('id'), obj.get('secret'))
        return DocumentObject(source='flickr', url=url)

    def get_search(self, request, **kwargs):
        query  = kwargs.pop('query')
        results = flickr.photos_search(tags=query)[0]

        paginator = Paginator(request.GET, results, resource_uri='/api/v1/flickr/search/')

        bundles = []
        for result in paginator.page()['objects']: 
            bundle = self.build_bundle(obj=self._output_adapter(result), request=request)
            bundles.append(self.full_dehydrate(bundle))

        object_list = {
            'meta': paginator.page()['meta'],
            'objects': bundles,
        }
        object_list['meta']['query'] = query

        return self.create_response(request, object_list) 

    def get_resource_uri(self, bundle_or_obj):
        return ''

    def get_object_list(self, request):
        return [doc1, doc2, doc3]

    def obj_get_list(self, request=None, **kwargs):
        return self.get_object_list(request)

    def obj_get(self, request=None, **kwargs):
        cached = cache.get(kwargs['pk'], None)
        if not cached:
            # go fetch document
            doc = DocumentObject(source='flickr', url='http://default.com')
        return cached or doc 

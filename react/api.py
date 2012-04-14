from django.conf.urls.defaults import *
from django.core.cache import cache
from react import features
from tastypie import fields
from tastypie.authorization import Authorization
from tastypie.paginator import Paginator
from tastypie.resources import Resource
import flickrapi, hashlib


class DocumentObject(object):
    def __init__(self, **kwargs):
        self.source      = kwargs.get('source', None) 
        self.relevant    = kwargs.get('relevant', True)
        self.url         = kwargs.get('url', None) 
        self.id          = hashlib.sha1(self.url).hexdigest()
        self.features    = { 'hsv_histogram': [] }

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
            url(r'^(?P<resource_name>%s)/search/(?P<query>\w+)' %
                (self._meta.resource_name), self.wrap_view('get_search'), name='api_get_search'),
        ]

    def _output_adapter(self, obj):
        url = 'http://farm%s.staticflickr.com/%s/%s_%s.jpg' % \
            (obj.get('farm'), obj.get('server'), obj.get('id'), obj.get('secret'))
        return DocumentObject(source='flickr', url=url)

    def _get_document_url(self, results, id):
        for obj in results:
            doc = self._output_adapter(obj)
            if id == doc.id:
                return doc.url
        return None

    def get_search(self, request, **kwargs):
        query  = kwargs.pop('query')
        source = 'flickr'
        relevant_docs = request.GET.getlist('relevant')
        irrelevant_docs = request.GET.getlist('irrelevant')
        page   = request.GET.get('page', 1)
        per_page = request.GET.get('limit', 20)
        results = flickr.photos_search(tags=query, page=str(page), per_page=str(per_page))[0]

        for doc_id in relevant_docs:
            cache_key = '%s-%s' % (source, doc_id)
            feature_vector = cache.get(cache_key)
            if not feature_vector:
                features.extract_features(cache_key, self._get_document_url(results, doc_id))

        for doc_id in irrelevant_docs:
            pass

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
        return bundle_or_obj.data.get('url', '')

    def get_object_list(self, request):
        return []

    def obj_get_list(self, request=None, **kwargs):
        return self.get_object_list(request)

    def obj_get(self, request=None, **kwargs):
        cached = cache.get(kwargs['pk'], None)
        if not cached:
            # go fetch document
            doc = DocumentObject(source='flickr', url='http://default.com')
        return cached or doc 

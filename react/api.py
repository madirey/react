from django.conf.urls.defaults import *
from django.core.cache import cache
from react import features
from tastypie import fields
from tastypie.authorization import Authorization
from tastypie.paginator import Paginator
from tastypie.resources import Resource
import flickrapi, hashlib


class SourceObject(object):
    def __init__(self, **kwargs):
        self.name = kwargs.get('name', None)
        self.features = kwargs.get('features', None)

flickr_source = SourceObject(name='flickr', features=['rgb_histogram'])
available_sources = {
    'flickr': flickr_source,
}

class SourceResource(Resource):
    name      = fields.CharField(attribute='name')
    features  = fields.ListField(attribute='features')

    class Meta:
        resource_name = 'source'
        object_class = SourceObject
        authorization = Authorization()

    def override_urls(self):
        return [
            url(r'^(?P<resource_name>%s)/(?P<source>\w+)' %
                (self._meta.resource_name), self.wrap_view('obj_get'), name='source_info'),
        ]

    def get_resource_uri(self, bundle_or_obj):
        return '/api/v1/%s/%s/' % (self._meta.resource_name, bundle_or_obj.obj.name)

    def get_object_list(self, request):
        return [flickr_source]

    def obj_get_list(self, request=None, **kwargs):
        return self.get_object_list(request)

    def obj_get(self, request=None, **kwargs):
        source = available_sources[kwargs['source']]
        return self.create_response(request, {
            'name': source.name,
            'features': [{'name': f} for f in source.features]})

class DocumentObject(object):
    def __init__(self, **kwargs):
        self.url         = kwargs.get('url', None)
        self.id          = kwargs.get('id', None) 
        self.source      = kwargs.get('source', None) 
        self.features    = []

flickr = flickrapi.FlickrAPI('2de139a8b38bf796c0a9d3eaccda137f', cache=True)

class FlickrResource(Resource):
    id       = fields.CharField(attribute='id')
    source   = fields.CharField(attribute='source')
    url      = fields.FileField(attribute='url')
    features = fields.ListField(attribute='features')

    class Meta:
        resource_name = 'flickr'
        object_class  = DocumentObject
        authorization = Authorization()

    def override_urls(self):
        return [
            url(r'^(?P<resource_name>%s)/search/(?P<query>\w+)' %
                (self._meta.resource_name), self.wrap_view('get_search'), name='api_get_search'),
        ]

    def _get_url(self, obj):
        return 'http://farm%s.staticflickr.com/%s/%s_%s.jpg' % \
            (obj.get('farm'), obj.get('server'), obj.get('id'), obj.get('secret'))

    def _output_adapter(self, obj):
        return DocumentObject(id=obj.get('id'), source='flickr', url=self._get_url(obj))

    def get_search(self, request, **kwargs):
        query  = kwargs.pop('query')
        source = 'flickr'
        relevant_docs = request.GET.getlist('relevant')
        irrelevant_docs = request.GET.getlist('irrelevant')
        feature = request.GET.get('feature')
        page   = request.GET.get('page', 1)
        per_page = request.GET.get('limit', 20)
        results = flickr.photos_search(tags=query, page=str(page), per_page=str(per_page))[0]

        for photo in results:
            url = self._get_url(photo)
            cache_key = '%s-%s' % (source, photo.get('id'))
            feature_vectors = cache.get(cache_key)
            if not feature_vectors:
                features.extract_features(cache_key, url)

        results = features.filter(results, source, relevant_docs, irrelevant_docs, feature)

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

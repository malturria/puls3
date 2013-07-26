var Models = {
	Video: Backbone.Model.extend(),
};

var Collections = {
	Videos: Backbone.Collection.extend({
		model: Models.Video,
		url: 'http://gdata.youtube.com/feeds/api/videos?v=2&alt=jsonc&max-results=9',
		parse: function(resp) {
			console.log('VideosCollection: recibo data y parse');
			return resp.data.items;
		},
	}),
};

var Views = {
	SingleVideo: Backbone.View.extend({
		className: 'video',
		initialize: function() {
			this.template = _.template($('#single-video-template').val());
		},
		render: function() {
			console.log('SingleVideo: inicia render');
			this.$el.html(this.template({video:this.model.toJSON()}));
			console.log('SingleVideo: finaliza render');
			return this;
		},
	}),
	VideosApp: Backbone.View.extend({
		initialize: function() {
			_.bindAll(this);
			this.template = _.template($('#app-template').val());
			this.searchBox = new Views.SearchBox();
			this.searchBox.on('searchRequest', this.performSearch, this);
			this.collection = new Collections.Videos();
			this.collection.on('reset', this.showVideos, this);
			this.performSearch();
		},
		render: function() {
			console.log('VideosApp: inicia render');
			this.$el.html(this.template());
			this.$el.find('#video-search-box').html(this.searchBox.render().el);
			this.showVideos();
			console.log('VideosApp: finaliza render');
			return this;
		},
		showVideos: function() {
			this.$el.find('#video-list-container').empty();
			var v = null;
			this.collection.each(function(item, idx) {
				v = new Views.SingleVideo({model:item});
				this.$el.find('#video-list-container').append(v.render().el);
			}, this);
			return this;
		},
		performSearch: function(evdata) {
			evdata = evdata || {};
			console.log('VideosApp: inicai performSearch - queryString: ' + evdata.queryString);
			this.collection.fetch({data:{q:evdata.queryString}});
			console.log('VideosApp: finaliza performSearch');
		},
	}),
	SearchBox: Backbone.View.extend({
		events: {
			'click #search-submit': 'performSearch',
			'keypress input' : 'keyHandler'
		},
		initialize: function() {
			this.template = _.template($('#search-box-template').val())
		},
		render: function() {
			console.log('SearchBox: entering render');
			this.$el.html(this.template());
			console.log('SearchBox: leaving render');
			return this;
		},
		performSearch: function() {
			console.log('SearchBox: inicia performSearch');
			queryString = this.$el.find('#search-query').val();
			this.trigger('searchRequest', {queryString:queryString});
			console.log('SearchBox: finaliza performSearch');
		},

		keyHandler: function(event){
			if (event.which === 13){
				this.performSearch() ;
			}
		},

	}),
};

$(document).ready(function() {
	var vs = new Views.VideosApp();
	vs.setElement($('#container')).render();
});

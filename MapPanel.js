Ext.ns('Ext.google');

Ext.google.MapPanel = Ext.extend(Ext.Panel, {
	
	initComponent : function(){
		if(this.zoom === undefined) {
			throw "'zoom' is a required value for Ext.google.MapPanel";
		}
		
		if(this.center !== undefined) {
			if(this.center.lat !== undefined && this.center.lng !== undefined)
			{
				this.center = new google.maps.LatLng(this.center.lat, this.center.lng)
			} else {
				throw "'lat' and 'lng' are requires values for 'center' in Ext.google.MapPanel"
			}
		} else {
			throw "'center' is a required value for Ext.google.MapPanel";
		}
		
		this.addEvents(
			'bounds_changed',
			'center_changed',
			'click',
			'dblclick',
			'drag',
			'dragend',
			'dragstart',
			'idle',
			'maptypeid_changed',
			'mousemove',
			'mouseout',
			'mouseover',
			'resize',
			'rightclick',
			'tilesloaded',
			'zoom_changed'
		);
		
		/**
		 * Google Maps API docs told me to: http://code.google.com/apis/maps/documentation/v3/reference.html#Map
		 */	
		this.on('bodyresize',function(){
			google.maps.event.trigger(this.map, 'resize');
		});
		
		
		Ext.google.MapPanel.superclass.initComponent.call(this);
	},
	afterRender: function() {
		this.initMap();
		Ext.google.MapPanel.superclass.afterRender.call(this);
	},
	initMap: function() {
		
		var mapOptions = {
			center: this.center,
			zoom: this.zoom
		};
		
		switch(this.mapType)
		{
			case 'hybrid': mapOptions.mapTypeId = google.maps.MapTypeId.HYBRID; break;
			case 'satellite': mapOptions.mapTypeId = google.maps.MapTypeId.SATELLITE; break;
			case 'terrain': mapOptions.mapTypeId = google.maps.MapTypeId.TERRAIN; break;
			case 'roadmap': 
			default:
				mapOptions.mapTypeId = google.maps.MapTypeId.ROADMAP; break;
		}
		
		if(this.navigationControl !== undefined){ mapOptions.navigationControl = this.navigationControl;}
		if(this.mapTypeControl !== undefined){ mapOptions.mapTypeControl = this.mapTypeControl;}
		if(this.scaleControl !== undefined){ mapOptions.scaleControl = this.scaleControl;}
		
		
		this.map = new google.maps.Map(this.body.dom, mapOptions);
		this.map.parentPanel = this;
		
		/* Attach listeners if they're present.*/
		if(this.hasListener('bounds_changed')) {		
			google.maps.event.addListener(this.map, 'bounds_changed', function(one, two, three){
				this.parentPanel.fireEvent('bounds_changed', {map: this, panel: this.parentPanel});
			});
		}
		if(this.hasListener('center_changed')) {		
			google.maps.event.addListener(this.map, 'center_changed', function(one, two, three){
				this.parentPanel.fireEvent('center_changed', {map: this, panel: this.parentPanel});
			});
		}
		if(this.hasListener('click')) {		
			google.maps.event.addListener(this.map, 'click', function(one, two, three){
				this.parentPanel.fireEvent('click', {map: this, panel: this.parentPanel});
			});
		}
		if(this.hasListener('dblclick')) {		
			google.maps.event.addListener(this.map, 'dblclick', function(one, two, three){
				this.parentPanel.fireEvent('dblclick', {map: this, panel: this.parentPanel});
			});
		}
		if(this.hasListener('drag')) {		
			google.maps.event.addListener(this.map, 'drag', function(one, two, three){
				this.parentPanel.fireEvent('drag', {map: this, panel: this.parentPanel});
			});
		}
		if(this.hasListener('dragend')) {		
			google.maps.event.addListener(this.map, 'dragend', function(one, two, three){
				this.parentPanel.fireEvent('dragend', {map: this, panel: this.parentPanel});
			});
		}
		if(this.hasListener('dragstart')) {		
			google.maps.event.addListener(this.map, 'dragstart', function(one, two, three){
				this.parentPanel.fireEvent('dragstart', {map: this, panel: this.parentPanel});
			});
		}
		if(this.hasListener('idle')) {		
			google.maps.event.addListener(this.map, 'idle', function(one, two, three){
				this.parentPanel.fireEvent('idle', {map: this, panel: this.parentPanel});
			});
		}
		if(this.hasListener('maptypeid_changed')) {		
			google.maps.event.addListener(this.map, 'maptypeid_changed', function(one, two, three){
				this.parentPanel.fireEvent('maptypeid_changed', {map: this, panel: this.parentPanel});
			});
		}
		if(this.hasListener('mousemove')) {		
			google.maps.event.addListener(this.map, 'mousemove', function(one, two, three){
				this.parentPanel.fireEvent('mousemove', {map: this, panel: this.parentPanel});
			});
		}
		if(this.hasListener('mouseout')) {		
			google.maps.event.addListener(this.map, 'mouseout', function(one, two, three){
				this.parentPanel.fireEvent('mouseout', {map: this, panel: this.parentPanel});
			});
		}
		if(this.hasListener('mouseover')) {		
			google.maps.event.addListener(this.map, 'mouseover', function(one, two, three){
				this.parentPanel.fireEvent('mouseover', {map: this, panel: this.parentPanel});
			});
		}
		if(this.hasListener('resize')) {		
			google.maps.event.addListener(this.map, 'resize', function(one, two, three){
				this.parentPanel.fireEvent('resize', {map: this, panel: this.parentPanel});
			});
		}
		if(this.hasListener('rightclick')) {		
			google.maps.event.addListener(this.map, 'rightclick', function(one, two, three){
				this.parentPanel.fireEvent('rightclick', {map: this, panel: this.parentPanel});
			});
		}
		if(this.hasListener('tilesloaded')) {		
			google.maps.event.addListener(this.map, 'tilesloaded', function(one, two, three){
				this.parentPanel.fireEvent('tilesloaded', {map: this, panel: this.parentPanel});
			});
		}
		if(this.hasListener('zoom_changed')) {		
			google.maps.event.addListener(this.map, 'zoom_changed', function(one, two, three){
				this.parentPanel.fireEvent('zoom_changed', {map: this, panel: this.parentPanel});
			});
		}		
	},
	
	/**
	 * Moves the map borders to include the values in bounds.
	 * @param bounds Object of the form {sw: {lat, lng}, ne: {lat, lng}}
	 * @uses {@link http://code.google.com/apis/maps/documentation/v3/reference.html#Map google.maps.Map::panToBounds}
	 * @uses {@link http://code.google.com/apis/maps/documentation/v3/reference.html#LatLngBounds google.maps.LatLngBounds}
	 * @uses {@link http://code.google.com/apis/maps/documentation/v3/reference.html#LatLng google.maps.LatLng}
	 */
	panToBounds: function(bounds) {
		this.map.panToBounds(new google.maps.LatLngBounds(
			new google.maps.LatLng(sw.lat, sw.lng),
			new google.maps.LatLng(ne.lat, ne.lng)
		));
	},
	createLine: function(config) {
		var newId = this.getNewLineId();
		this.lines[newId] = new google.maps.Polyline({
			map: this.map,
			path: new google.maps.MVCArray,
			strokeColor: config.color,
			strokeOpacity: config.opacity,
			strokeWeight: config.weight
		});
		return newId;
	},
	removeLine: function(lineId){
		this.lines[lineId].setMap(null);
		delete this.lines[lineId];
	},
	insertElementInLine: function(newElement, lineId) {
		this.lines[lineId].push(newElement)
	},
	getNewLineId: function() {
		var newId = 0;
		var findNewId = true;
		while(findNewId) {
			if(this.lines[newId] !== undefined) {
				findNewId = false;
			} else {
				newId++
			}
		}
		return newId;
	}
	
});
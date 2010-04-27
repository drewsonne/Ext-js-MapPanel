Ext.ux.MapPanel = Ext.extend(Ext.Panel, {
	
	initComponent : function(){
		var defConfig = {
			title: "&nbsp;",
			mobile: false,
			mapPoint: new google.maps.LatLng(this.startPoint.lat, this.startPoint.lng)
		}
		
		this.lines = [];
		
		Ext.applyIf(this, defConfig);
		
		Ext.ux.MapPanel.superclass.initComponent.call(this);
	},
	afterRender: function() {
		this.initMap();
		Ext.ux.MapPanel.superclass.afterRender.call(this);
	},
	initMap: function() {
		this.map = new google.maps.Map(this.body.dom, {
			zoom: 8,
			center: this.mapPoint,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		});
		this.map.parentPanel = this;
		
		google.maps.event.addListener(this.map, 'maptypeid_change', function(one, two, three){
			this.parentPanel.fire('maptypeid_change', {map: this, panel: panel});
		});
		google.maps.event.addListener(this.map, 'tilesloaded', function(one, two, three){
			this.parentPanel.fire('tilesloaded', {map: this, panel: panel});
		})
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
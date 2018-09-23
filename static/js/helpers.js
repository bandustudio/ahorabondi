var H = {
	mapbox : {
		accessToken : 'pk.eyJ1IjoibWFydGluZnJlZSIsImEiOiJ5ZFd0U19vIn0.Z7WBxuf0QKPrdzv2o6Mx6A',
		//style: 'mapbox://styles/mapbox/bright-v8'
		style:'mapbox://styles/mapbox/streets-v9'
	},
	geo : function(success, error) {
	  if (!navigator.geolocation){
	  	H.status("💥 Su dispositivo no soporta geolocalización.")
	    return;
	  }

	  navigator.geolocation.watchPosition(success, function(e) {
	  	H.status("💥 No pude obtener ubicación (" + e.message + ")")
	  }, {
        enableHighAccuracy: true,
        maximumAge: 5000 // 5 sec.
      });
	}
	, icon : function(data){
	    const properties = {
	    	color : ["#fc0d1b","#46e166","#583470","#f313b5","#1369f3","#cdf313","#f39d13"]
	    	, size : ["2rem","4rem","6rem","8rem"]
	    }
	    data.color = '#ff006c'
	    data.border = '#ffffff'
	    var displayName = data.displayName

	    if(displayName=='me'){
			displayName = 'Mi viaje'	    	
	    }

	    if(data.displayName=='me'){
			data.border = '#ff006c'	    	
	    }
	    if(data.uuid.length){
	    	data.color = '#' + data.uuid.substr(data.uuid.length - 6)
	    }
	    const markerHtmlStyles = `
	        background-color: ${data.color};
	        width: 3rem;
	        height: 3rem;
	        display: block;
	        left: -.1rem;
	        top: -2rem;
	        position: relative;
	        border-radius: 3rem 3rem 0;
	        transform: rotate(45deg);
	        border: 4px solid ${data.border}`
	    const markerHtmlStyles2 = `
	        width: 3rem;
	        height: 3rem;	    
	    	display: block;
			text-align: center;
    		font-weight: 600;
    		line-height: 2rem;
	    	transform: rotate(-50deg);`
	    	/*
	    const icon = L.divIcon({
	      className: data.className ? data.className + ' icon' : 'icon',
	      iconAnchor: [0, 24],
	      labelAnchor: [-6, 0],
	      popupAnchor: [0, -36],
	      html: `<a href="#${data.displayName || 'me'}"><span style="${markerHtmlStyles}"><span style="${markerHtmlStyles2}"><code>${data.displayName || 'me'}</code> <span style="display:none">${data.driverId}</span></span></a>`
	    })*/

	    const icon = `<a href="#${data.displayName}"><span style="${markerHtmlStyles}"><span style="${markerHtmlStyles2}" class="marker"><code>${displayName}</code> <span style="display:none">${data.driverId}</span></span></a>`
	    return icon
	}
    , driver : {
	    isLabelByStatus : function(status){
	        if(status=='waiting')
	            return "Disponible"
	        if(status=='engaged')
	            return "Ocupado"
	        if(status=='offline')
	            return "Desconectado"
	        if(status=='idle')
	            return "No disponible"
	    }
    }
    , status : function(a){
    	$('#status').html(a).fadeIn('fast')
    }
    , notif : {
    	set : function(a,b,c,d){
    		if(c==undefined) c = {};
            $('#notification').html($.templates(a).render(b,c)).fadeIn('fast').promise().done(function(){
            	if(typeof d == 'function') d.call(this)
            })
    	}
    	, show : function(){
    		$("#notification").css({display:'inline-block'}).fadeIn('fast')
    	}
    	, hide : function(){
    		$("#notification").fadeOut('fast')
    	}
    }
}

window.onerror = function(error) {
    H.status(error)
}
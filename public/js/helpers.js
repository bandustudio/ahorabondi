var H = {
	mb : {
		accesstoken : 'pk.eyJ1IjoibWFydGluZnJlZSIsImEiOiJ5ZFd0U19vIn0.Z7WBxuf0QKPrdzv2o6Mx6A'
	},
	geo : function(success, error) {
	  if (!navigator.geolocation){
	    $('#status').html("Error: Su dispositivo no soporta geolocalización.").fadeIn('fast')
	    return;
	  }

	  navigator.geolocation.watchPosition(success, function() {
	    $('#status').html("Error: No pude obtener ubicación").fadeIn('fast')
	  });
	}
	, icon : function(data){
	    const properties = ["#fc0d1b","#46e166","#583470","#57366f"]
	    const bgcolor = properties[data.colorId] || '#583470'
	    const className = 'check'
	    const markerHtmlStyles = `
	        background-color: ${properties[data.colorId] || '#583470'};
	        width: 3rem;
	        height: 3rem;
	        display: block;
	        left: -1.5rem;
	        top: -1.5rem;
	        position: relative;
	        border-radius: 3rem 3rem 0;
	        transform: rotate(45deg);
	        border: 4px solid #FFFFFF`

	    const icon = L.divIcon({
	      className,
	      iconAnchor: [0, 24],
	      labelAnchor: [-6, 0],
	      popupAnchor: [0, -36],
	      html: `<span style="${markerHtmlStyles}" />`
	    })

	    return icon
	}
    , carrier : {
	    isLabelByStatus : function(status){
	        if(status=='waiting')
	            return "Esperando Envío"
	        if(status=='engaged')
	            return "Trabajando"
	        if(status=='offline')
	            return "Desconectado"
	        if(status=='online')
	            return "Conectado"
	        if(status=='idle')
	            return "Break"
	    }
    }
    , notif : {
    	show : function(){
    		$("#notification").fadeIn('fast')
    	}
    	, hide : function(){
    		$("#notification").fadeOut('fast')
    	}
    }
}
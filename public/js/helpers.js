var H = {
	geo : function(success, error) {
	  if (!navigator.geolocation){
	    alert("Geolocation is not supported by your browser")
	    return;
	  }

	  navigator.geolocation.watchPosition(success, function() {
	    alert("Unable to retrieve your location")
	  });
	}
	, icon : function(data){
	    console.log(data.colorId)
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
	        border: 2px solid #FFFFFF`

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
}
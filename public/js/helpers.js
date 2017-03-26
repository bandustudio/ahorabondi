var H = {
	mb : {
		accesstoken : 'pk.eyJ1IjoibWFydGluZnJlZSIsImEiOiJ5ZFd0U19vIn0.Z7WBxuf0QKPrdzv2o6Mx6A'
	},
	geo : function(success, error) {
	  if (!navigator.geolocation){
	  	H.status("💥 Su dispositivo no soporta geolocalización.")
	    return;
	  }

	  navigator.geolocation.watchPosition(success, function() {
	  	H.status("💥 No pude obtener ubicación")
	  });
	}
	, icon : function(data){
	    const properties = {
	    	color : ["#fc0d1b","#46e166","#583470","#f313b5","#1369f3","#cdf313","#f39d13"]
	    	, size : ["2rem","4rem","6rem","8rem"]
	    }
	    const markerHtmlStyles = `
	        background-color: ${properties.color[data.colorId] || '#583470'};
	        width: ${properties.size[data.sizeId] || '3rem'};
	        height: ${properties.size[data.sizeId] || '3rem'};
	        display: block;
	        left: -${parseInt(properties.size[data.sizeId])/2 || '1.5'}rem;
	        top: -${parseInt(properties.size[data.sizeId])/2 || '1.5'}rem;
	        position: relative;
	        border-radius: ${properties.size[data.sizeId] || '3rem'} ${properties.size[data.sizeId] || '3rem'} 0;
	        transform: rotate(45deg);
	        border: 4px solid #FFFFFF`
	    const markerHtmlStyles2 = `
	        width: ${properties.size[data.sizeId] || '3rem'};
	        height: ${properties.size[data.sizeId] || '3rem'};	    
	    	display: block;
			text-align: center;
    		font-weight: 600;
	    	transform: rotate(-50deg);`
	    const icon = L.divIcon({
	      className: data.className ? data.className + ' icon' : 'icon',
	      iconAnchor: [0, 24],
	      labelAnchor: [-6, 0],
	      popupAnchor: [0, -36],
	      html: `<span style="${markerHtmlStyles}"><span style="${markerHtmlStyles2}">${data.displayName || ''}</span></span>`
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
    , status : function(a){
    	$('#status').html(a).fadeIn('fast')
    }
    , notif : {
    	set : function(a,b,c,d,e){
    		if(d==undefined) d = {};
            $(a).html($.templates(b).render(c)).css(d).fadeIn('fast').promise().done(function(){
            	if(typeof e == 'function') e.call(this)
            })
    	}
    	, show : function(){
    		$("#notification").css({display:'flex'}).fadeIn('fast')
    	}
    	, hide : function(){
    		$("#notification").fadeOut('fast')
    	}
    }
}

window.onerror = function(error) {
    alert(error)
}

$(function(){
	$(document).on('click','.with-options li', function(e){
		$('#eligedestino_text').val($(this).text())
		e.preventDefault()
	})
})

"use strict";
class IoT {
    apiKey = "pk.eyJ1IjoidW8yNzcxODgiLCJhIjoiY2xiMHUzbjI4MDBhMTN4b2puYTR1dXlxNSJ9.6-0ol9W73UtV6B8K6gS9Ew";

    url = "";
    estado = "Error";

    // datos para los marcadores
    markers = {
        lugares: [
            {nombre: "Escuela de Ingeniería Informática", lon: -5.851298, lat: 43.354826},
            {nombre: "Facultad de Ciencias", lon: -5.853622, lat: 43.357817},
            {nombre: "Campo de San Francisco", lon: -5.850598, lat: 43.361495}
        ]
    }

    datos = null;

    // obtiene los datos del arduino
    getDatosArduino(){
        $.ajax({
            dataType: "xml",
            url: this.url,
            method: 'GET',
            success: function (datos) {
                this.datos = JSON.parse(datos);
                this.estado = "Correcto";
            },
            error: function () {
                this.estado = "Error";
            }
        });
    }

    // obtiene el popup para un marcador
    getPopupFor(name, lon, lat, temp, hum){
        let html = '<div class="marker-popup">'+
            '<p>Lugar: '+name+'</p>'+
            '<p>Longitud: '+lon+'</p>'+
            '<p>Latitud: '+lat+'</p>'+
            '<p>Temperatura: '+temp+'</p>'+
            '<p>Humedad: '+hum+'</p>'
        '</div>';

        return new mapboxgl.Popup(
            {
               anchor: 'bottom',
               offset: { 'bottom': [0, -10] },
               closeOnClick: false
            }
        ).setHTML(html);
    }

    // devuelve el estado de los sensores
    // para los de mentira siempre es correcto
    getEstado(nombre){
        if(nombre=="Escuela de Ingeniería Informática")
            return this.estado;
        else
            return "Correcto";
    }

    // obtiene la temperatura del objeto datos recibido
    // para los de mentira es aleatorio
    getTemp(nombre){
        if(nombre=="Escuela de Ingeniería Informática")
            //return this.datos.tem;
            return "TEST";
        else
            return (Math.random() * (16 - 9) + 9).toFixed(2);
    }

    // obtiene la humedad del objeto datos recibido
    // para los de mentira es aleatorio
    getHum(nombre){
        if(nombre=="Escuela de Ingeniería Informática")
            //return this.datos.hum;
            return "TEST";
        else
            return (Math.random() * (95 - 70) + 70).toFixed(2);
    }

    // obtiene los marcadores a partir del json de lugares
    getMarkers(){
        let mapboxMarkers = [];
        this.markers.lugares.forEach(e => {
            mapboxMarkers.push(
                new mapboxgl.Marker()
                .setLngLat([e.lon, e.lat])
                .setPopup(this.getPopupFor(e.nombre, e.lon, e.lat, this.getTemp(e.nombre), this.getHum(e.nombre)))
            );

            // estado de los sensores
            var ul = document.getElementById("sensores");
            var li = document.createElement("li");
            li.appendChild(document.createTextNode(e.nombre+"\t"+" - "+this.getEstado(e.nombre)));
            ul.appendChild(li);
        });
        
        return mapboxMarkers;
    }

    // genera el mapa y añade los marcadores
    getMapaDinamicoMapBox() {
        var ubicacion = document.getElementById("map");
        ubicacion.innerHTML = "<h2>Mapa</h2>";

        mapboxgl.accessToken = this.apiKey;
        const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [this.markers.lugares[0].lon, this.markers.lugares[0].lat],
            zoom: 14
        });

       this.getMarkers().forEach(m => {
            m.addTo(map);
        });
    }
}

var iot = new IoT();
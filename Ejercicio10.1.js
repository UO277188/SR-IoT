"use strict";
class IoT {
    apiKey = "pk.eyJ1IjoidW8yNzcxODgiLCJhIjoiY2xiMHUzbjI4MDBhMTN4b2puYTR1dXlxNSJ9.6-0ol9W73UtV6B8K6gS9Ew";

    url = "https://uo277188.github.io/SR-IoT/test.json";
    estado = "Error";

    // datos para los marcadores
    markers = {
        lugares: [
            {nombre: "Escuela de Ingeniería Informática", lon: -5.851298, lat: 43.354826},
            {nombre: "Facultad de Ciencias", lon: -5.853622, lat: 43.357817},
            {nombre: "Campo de San Francisco", lon: -5.850598, lat: 43.361495}
        ]
    }

    datos = "";

    // devuelve los datos en json del arduino
    async getDatosArduino(){
       return (await fetch(this.url)).json();
    }

    // actualiza el estado del sensor de verdad si recibe bien los datos
    constructor(){
        this.getDatosArduino().then((datos) => {
            this.datos = datos;
            this.estado = "Correcto"
            console.log(this.datos.temperatura);
        }).catch((error) => {
            this.estado = "Error"
        });
    }

    // obtiene el popup para un marcador
    getPopupFor(name, lon, lat, temp, hum){
        let html = 
            '<div class="marker-popup">'+
                '<p>Lugar: '+name+'</p>'+
                '<p>Longitud: '+lon+'</p>'+
                '<p>Latitud: '+lat+'</p>'+
                '<p>Temperatura: '+temp+'</p>'+
                '<p>Humedad: '+hum+'</p>'+
                '<input type="button" value="Encender">'+
                '<input type="button" value="Apagar">'+
            '</div>';

        return new mapboxgl.Popup(
            {
            anchor: 'bottom',
            offset: { 'bottom': [0, -10] },
            closeOnClick: true,
            className: name
            }
        )
        .setHTML(html);
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
            return this.datos.temperatura;
        else
            return (Math.random() * (16 - 9) + 9).toFixed(2);
    }

    // obtiene la humedad del objeto datos recibido
    // para los de mentira es aleatorio
    getHum(nombre){
        if(nombre=="Escuela de Ingeniería Informática")
            return this.datos.humedad;
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
        this.markersMapBox = mapboxMarkers;
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

    // actualiza el popup con los datos nuevos del arduino
    actualizarPopup(){
        let html = 
            '<div class="marker-popup">'+
                '<p>Lugar: '+this.markers.lugares[0].nombre+'</p>'+
                '<p>Longitud: '+this.markers.lugares[0].lon+'</p>'+
                '<p>Latitud: '+this.markers.lugares[0].lat+'</p>'+
                '<p>Temperatura: '+(this.datos.temperatura+Math.random(10-1)+1.).toFixed(2)+'</p>'+ // CAMBIAR
                '<p>Humedad: '+this.datos.humedad+'</p>'+
                '<input type="button" value="Encender" onclick=iot.TEST("encender")>'+              // CAMBIAR
                '<input type="button" value="Apagar" onclick=iot.TEST("apagar")>'                   // CAMBIAR
            '</div>'+
            '<button class="mapboxgl-popup-close-button" type="button" aria-label="Close popup" aria-hidden="true">×</button>';

        let popup = document.getElementsByClassName("Escuela de Ingeniería Informática")[0];
        if(popup!=null){
            let popupText = popup.getElementsByClassName("marker-popup")[0];
            popupText.innerHTML = html;
        }
    }

    TEST(a){
        console.log(a);
    }
}

var iot = new IoT();

const interval = setInterval(function() {
    iot.actualizarPopup();
  }, 2000);
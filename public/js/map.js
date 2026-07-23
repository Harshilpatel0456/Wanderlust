    if (typeof mapboxgl !== 'undefined' && mapboxgl.setTelemetryEnabled) {
        mapboxgl.setTelemetryEnabled(false);
    }
    const map = new mapboxgl.Map({
        accessToken: mapToken,
        container: 'map',
        style: 'mapbox://styles/mapbox/standard', // Use the standard style for the map
        projection: 'globe', // display the map as a globe
        zoom: 9, // initial zoom level, 0 is the world view, higher values zoom in
        center: listing.geometry.coordinates // center the map on this longitude and latitude
    });

    map.addControl(new mapboxgl.NavigationControl());
    map.scrollZoom.disable();

    map.on('style.load', () => {
        map.setFog({}); // Set the default atmosphere style
    });

    const popup = new mapboxgl.Popup({offset: 25, className: 'myclass'})
        .setHTML(`<h3>${listing.title}</h3><p>Exact location will be provided after booking</p>`);

    const marker = new mapboxgl.Marker({color: 'red'})
        .setLngLat(listing.geometry.coordinates)
        .setPopup(popup)
        .addTo(map);

// const marker = new mapboxgl.Marker({color:'red'})
//     .setLngLat(listing.geometry.coordinates)//listing gometry coordinates
//     .setPopup(new mapboxgl.Popup({offset: 25, className: 'myclass'}))
//     // .setLngLat(e.lngLat)
//     .setHTML(`<h5>${listing.title}</h5><p>exact Location will be Provided after Booking</p>`)
//     .addTo(map);
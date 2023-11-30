document.addEventListener("DOMContentLoaded", () => {
  function init() {
    let map = new ymaps.Map("map", {
      center: [20.661721102369167, -103.35060722124784],
      zoom: 12,
    });

    let placemark = new ymaps.Placemark(
      [54.68311593836052, 20.48041989222701],
      {},
      {}
    );

    map.geoObjects.add(placemark);
  }
  if (init) {
    ymaps.ready(init);
  }
});

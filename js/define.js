
var simple = {
  "version": 7,
  "glyphs": "mapbox://fontstack/{fontstack}/{range}.pbf",
  "constants": {
    "@name": "{name_en}",
    "@sans": "Open Sans Regular, Arial Unicode MS Regular",
    "@sans-it": "Open Sans Italic, Arial Unicode MS Regular",
    "@sans-md": "Open Sans Semibold, Arial Unicode MS Bold",
    "@sans-bd": "Open Sans Bold, Arial Unicode MS Bold",
    "@big-label": "#cb4b49",
    "@medium-label": "#f27a87",
    "@small-label": "#384646",
    "@label-halo": "rgba(255,255,255,0.5)",
    "@label-halo-dark": "rgba(0,0,0,0.2)",
    "@land": "#ededed",
    "@water": "#7acad0",
    "@park": "#c2cd44",
    "@building": "#afd3d3",
    "@highway": "#5d6765",
    "@road": "#c0c4c2",
    "@path": "#5d6765",
    "@subway": "#ef7369",
    "@highway-width": {
      "base": 1.55,
      "stops": [[4, 0.5], [8, 1.5], [20, 40]]
    },
    "@road-width": {
      "base": 1.55,
      "stops": [[4, 0.25], [20, 30]]
    },
    "@path-width": {
      "base": 1.8,
      "stops": [[10, 0.15], [20, 15]]
    },
    "@road-misc-width": {
      "base": 1,
      "stops": [[4, 0.25], [20, 30]]
    },
    "@stream-width":{
      "base": 0.5,
      "stops": [[4, 0.5], [10, 1.5], [20, 5]]
    }
  },
  "sources": {
    "osm": {
      "type": "vector",
      "tiles": ["https://vector.mapzen.com/osm/all/{z}/{x}/{y}.mvt?api_key=vector-tiles-LM25tq4"]
    }
  },
  "layers": [{
    "id": "background",
    "type": "background",
    "paint": {
      "background-color": "@land"
    }
  }, {
    "id": "water-line",
    "source": "osm",
    "source-layer": "water",
    "type": "line",
    "filter": ["==", "$type", "LineString"],
    "paint": {
      "line-color": "@water",
      "line-width": {
        "base": 1.2,
        "stops": [[8, 0.5], [20, 15]]
      }
    }
  }, {
    "id": "water-polygon",
    "source": "osm",
    "source-layer": "water",
    "type": "fill",
    "filter": ["==", "$type", "Polygon"],
    "paint": {
      "fill-color": "@water"
    }
  }, {
    "id": "park",
    "type": "fill",
    "source": "osm",
    "source-layer": "landuse",
    "min-zoom": 6,
    "filter": ["in", "kind", "park", "forest", "garden", "grass", "farm", "meadow", "playground", "golf_course", "nature_reserve", "wetland", "wood", "cemetery"],
    "paint": {
      "fill-color": "@park"
    }
  }, {
    "id": "river",
    "source": "osm",
    "source-layer": "water",
    "type": "line",
    "min-zoom": 6,
    "filter": ["all", ["==", "$type", "LineString"], ["==", "kind", "river"]],
    "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
    "paint": {
      "line-color": "@water",
      "line-width": {
        "base": 1.2,
        "stops": [[8, 0.75], [20, 15]]
      }
    }
  }, {
    "id": "stream-etc",
    "source": "osm",
    "source-layer": "water",
    "type": "line",
    "min-zoom": 11,
    "filter": ["all", ["==", "$type", "LineString"], ["==", "kind", "stream", "canal"]],
    "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
    "paint": {
      "line-color": "@water",
      "line-width": {
        "base": 1.4,
        "stops": [[10, 0.5], [20, 15]]
      }
    }
  }, {
      "id": "country-boundary",
      "source": "osm",
      "source-layer": "places",
      "type": "line",
      "filter": ["==", "admin_level", "2"],
      "max-zoom": 4,
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "paint": {
        "line-color": "@building",
      "line-width": {
        "base": 2,
        "stops": [[1, 0.5], [7, 3]]
        }
      }
    }, {
      "id": "state-boundary",
      "source": "osm",
      "source-layer": "places",
      "type": "fill",
      "filter": ["==", "admin_level", "4"],
      "max-zoom": 10,
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "paint": {
        "fill-color": "@land",
        "fill-outline-color": "#cacecc"
      }
    }, {
    "id": "subways",
    "source": "osm",
    "source-layer": "roads",
    "type": "line",
    "paint": {
      "line-color": "@subway",
      "line-dasharray": [2, 1]
    },
    "filter": ["==", "railway", "subway"]
  }, {
    "id": "link-tunnel",
    "source": "osm",
    "source-layer": "roads",
    "type": "line",
    "filter": ["any",["==", "is_tunnel", "yes"]],
    "layout": {
      "line-join": "round",
      "line-cap": "round"
    },
    "paint": {
      "line-color": "@building",
      "line-width": "@road-width",
      "line-dasharray": [1, 2]
    }
  }, {
    "id": "buildings",
    "type": "fill",
    "source": "osm",
    "source-layer": "buildings",
    "paint": {
    "fill-outline-color": "@building",
    "fill-color": "@land"
    }
  }, {
    "id": "road",
    "source": "osm",
    "source-layer": "roads",
    "type": "line",
    "filter": ["any",["==", "kind", "minor_road"],["==", "kind", "major_road"]],
    "layout": {
      "line-join": "round",
      "line-cap": "round"
    },
    "paint": {
      "line-color": "@road",
      "line-width": "@road-width"
    }
  }, {
    "id": "link-bridge",
    "source": "osm",
    "source-layer": "roads",
    "type": "line",
    "filter": ["any",["==", "is_link", "yes"], ["==", "is_bridge", "yes"]],
    "layout": {
      "line-join": "round",
      "line-cap": "round"
    },
    "paint": {
      "line-color": "@road",
      "line-width": "@highway-width"
    }
  }, {
    "id": "highway",
    "source": "osm",
    "source-layer": "roads",
    "type": "line",
    "line-join": "round",
    "filter": ["==", "kind", "highway"],
    "layout": {
      "line-join": "round",
      "line-cap": "round"
    },
    "paint": {
      "line-color": "@highway",
      "line-width": "@highway-width"
    }
  }, {
    "id": "path",
    "source": "osm",
    "source-layer": "roads",
    "type": "line",
    "line-join": "round",
    "line-cap": "round",
    "filter": ["==", "kind", "path"],
    "layout": {
      "line-join": "round",
      "line-cap": "round"
    },
    "min-zoom": 12,
    "paint": {
      "line-color": "@path",
      "line-width": "@path-width",
      "line-dasharray": [2, 2]
    }
  }, {
    "id": "ocean-label",
    "source": "osm",
    "source-layer": "places",
    "type": "symbol",
    "min-zoom": 2,
    "max-zoom": 6,
    "filter": ["==", "kind", "ocean"],
    "layout": {
        "text-field": "{name}",
        "text-font": "@sans-it",
        "text-max-size": 32,
        "text-max-width": 14,
        "text-letter-spacing": 0.1
      },
    "paint": {
      "text-color": "@land",
      "text-halo-color": "@label-halo-dark",
      "text-size": {
          "stops": [[2, 28], [6, 32]]
        }
    }
  }, {
      "id": "other-label",
      "source": "osm",
      "source-layer": "places",
      "filter": ["all", ["==", "$type", "Point"], ["==", "kind", "neighbourhood", "hamlet", "suburb"]],
      "min-zoom": 12,
      "type": "symbol",
      "layout": {
        "text-field": "{name}",
        "text-font": "@sans-md",
        "text-max-size": 24,
        "text-max-width": 10
      },
      "paint": {
        "text-color": "@big-label",
        "text-halo-color": "@label-halo",
        "text-size": {
          "stops": [[12, 14], [20, 21]]
        }
      }
    }, {
      "id": "city-label",
      "source": "osm",
      "source-layer": "places",
      "filter": ["all", ["==", "$type", "Point"], ["==", "kind", "city", "county", "district"]],
      "min-zoom": 10,
      "max-zoom": 14,
      "type": "symbol",
      "layout": {
        "text-field": "{name}",
        "text-font": "@sans-md",
        "text-max-size": 24,
        "text-max-width": 10,
        "text-letter-spacing": 0.1
      },
      "paint": {
        "text-color": "@small-label",
        "text-halo-color": "@label-halo",
        "text-size": {
          "stops": [[8, 14], [12, 21]]
        }
      }
    }, {
      "id": "state-label",
      "source": "osm",
      "source-layer": "places",
      "filter": ["all", ["==", "$type", "Point"], ["==", "kind", "state"]],
      "min-zoom": 6,
      "max-zoom": 12,
      "type": "symbol",
      "layout": {
        "text-field": "{name}",
        "text-font": "@sans",
        "text-max-size": 28,
        "text-max-width": 8
      },
      "paint": {
        "text-color": "@medium-label",
        "text-halo-color": "@label-halo",
        "text-size": {
        "stops": [[7, 18], [10, 30]]
        }
      }
    }, {
      "id": "country-label",
      "source": "osm",
      "source-layer": "places",
      "filter": ["all", ["==", "$type", "Point"], ["==", "kind", "country"]],
      "max-zoom": 7,
      "type": "symbol",
      "layout": {
        "text-field": "{name}",
        "text-font": "@sans-md",
        "text-max-size": 28,
        "text-max-width": 4
      },
      "paint": {
        "text-color": "@big-label",
        "text-halo-color": "@label-halo",
        "text-size": {
          "stops": [[2, 24], [6, 21]]
        }
      }
    }
  ]
};
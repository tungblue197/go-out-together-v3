import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import Button from "components/button";
import "mapbox-gl/dist/mapbox-gl.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faSave,
  faSearch,
  faTrashAlt,
  faWindowClose,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { Location } from "type";
import UserService from "service/user";
import { useCookies } from "react-cookie";

mapboxgl.accessToken =
  "pk.eyJ1IjoidHVuZ3B2OTciLCJhIjoiY2tzb3IzNzE1M3U2bTJ3bzJzdmxpc3VxeCJ9.bWom9lqXVp6IMGcWH0Aw_A";

interface IMapProps {
  locationChanged?: (locs: (Location & { marker: any })[]) => any;
  locations?: (Location & { marker: any })[];
  onCloseMap?: () => void;
  drawR?: boolean;
}
const Map: React.FC<IMapProps> = ({
  locationChanged,
  locations,
  onCloseMap,
  drawR,
}) => {
  const [cookies] = useCookies();
  const [distance, setDistance] = useState(0);
  const map = useRef<any>(null);
  const mapContainer = useRef<any>(null);
  const searchRef = useRef<any>(null);
  const [locaionsSearched, setLocationsSeached] = useState<Location[]>([]);
  const [pickedLocations, setPickedLocations] = useState<
    (Location & { marker: any })[]
  >([]);
  const [viewport, setViewprot] = useState({
    lng: 105.84039,
    lat: 21.02765,
    zoom: 12,
  });
  useEffect(() => {
    initMap();
    initInputValue();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (locations) {
      setPickedLocations(locations);
      initMarkers(locations);
      if (drawR) {
        // @ts-expect-error
        async function draw() {
          //get user location
          const result = await UserService.getUserLocation(cookies.id);
          const { location } = result.data;
          console.log(locations && locations[0]);

          if (locations && location) {
            addMarker({ lng: location.longitude, lat: location.latitude });
            handleDraw2MarkerPoint(location, locations[0]);
          }
        }
        draw();
      }
    }
  }, [locations, drawR]);

  const initMap = () => {
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [viewport.lng, viewport.lat],
      zoom: viewport.zoom,
    });
  };

  const initMarkers = (locs: any) => {
    if (map.current) {
      locs.forEach((loc: any) => {
        addMarker({ lng: loc.longitude, lat: loc.latitude });
      });
    }
  };

  const addMarker = ({ lng, lat }: { lng: number; lat: number }) => {
    if (map.current) {
      const marker = new mapboxgl.Marker({
        color: "blue",
        draggable: false,
        scale: 1,
      })
        .setLngLat([lng, lat])
        .addTo(map.current);
      moveMapTo({ lng, lat });
      return marker;
    }
    return null;
  };

  const handleDraw2MarkerPoint = async (loc1: Location, loc2: Location) => {
    const { coordinates, distance }: any = await lookupDirection({
      from: loc1,
      to: loc2,
    });
    setDistance(distance);
    drawDirection(coordinates);
  };

  const searchLocations = async (text: string) => {
    const url = `${process.env.NEXT_PUBLIC_MAP_BOX_API}/geocoding/v5/mapbox.places/${text}.json?proximity=105.777909,21.028412&access_token=${process.env.NEXT_PUBLIC_MAP_BOX_TOKEN}`;
    try {
      const { data } = await axios.get(url);
      if (data.features && data.features.length) {
        const locs = data.features.map((loc: any) => {
          const location: Location = {
            id: loc.id,
            longitude: loc.center[0],
            latitude: loc.center[1],
            placeName: loc.place_name,
            note: loc.place_type[0],
          };
          return location;
        });
        setLocationsSeached(locs);
      }
    } catch (error) {
      setLocationsSeached([]);
    }
  };

  const handlePickLocation = (loc: Location) => {
    const locationExist = pickedLocations.some((l) => l.id === loc.id);

    const marker = addMarker({ lng: loc.longitude!, lat: loc.latitude! });
    setLocationsSeached([]);
    initInputValue();
    if (locationExist) {
      setLocationsSeached([]);
      return;
    }
    if (marker) {
      setPickedLocations([...pickedLocations, { ...loc, marker }]);
    }
  };

  const lookupDirection = async ({
    from,
    to,
  }: {
    from: Location;
    to: Location;
  }) => {
    try {
      const url = `${process.env.NEXT_PUBLIC_MAP_BOX_API}/directions/v5/mapbox/walking/${from.longitude}%2C${from.latitude}%3B${to.longitude}%2C${to.latitude}?alternatives=true&geometries=geojson&steps=true&access_token=${process.env.NEXT_PUBLIC_MAP_BOX_TOKEN}`;
      const { data } = await axios.get(url);
      console.log("geocoding : ", data);

      return {
        coordinates: data.routes[0].geometry.coordinates,
        distance: data.routes[0].distance,
      };
    } catch (error) {
      return error;
    }
  };

  const drawDirection = (coordinates: [number[], number[]]) => {
    if (map.current) {
      map.current.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: coordinates,
          },
        },
      });

      map.current.addLayer({
        id: "route",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#00aeff",
          "line-width": 8,
        },
      });
    }
  };
  const initInputValue = () => {
    if (searchRef.current) {
      searchRef.current.value = "";
      searchRef.current.focus();
    }
  };

  const moveMapTo = ({ lng, lat }: { lng: number; lat: number }) => {
    if (map.current) {
      map.current.flyTo({
        center: [lng, lat],
        zoom: 12,
        speed: 2,
        curve: 1,
        easing(t: any) {
          return t;
        },
      });
    }
  };

  const handleRemovePickLocation = (loc: Location & { marker: any }) => {
    loc.marker.remove();
    const locs = pickedLocations.filter((l) => l.id !== loc.id);
    setPickedLocations(locs);
  };

  const handleSave = () => {
    if (locationChanged) locationChanged(pickedLocations);
    if (onCloseMap) onCloseMap();
  };

  const handleClose = () => {
    if (onCloseMap) onCloseMap();
  };

  return (
    <div className="w-full h-full relative">
      <div className="absolute z-10 flex w-full md:max-w-sm bg-white h-8 top-2 left-0 md:left-2 px-2">
        {distance ? (
          <div className="w-full h-full text-blue-600 py-1 text-sm font-semibold">
            Khoảng cách tời địa điểm của bạn {(distance / 1000).toFixed(2)} Km
          </div>
        ) : (
          <>
            <input
              ref={searchRef}
              onChange={(e) => {
                const {
                  target: { value },
                } = e;
                searchLocations(value);
              }}
              className="flex-1 h-full text-sm text-gray-500 outline-none"
            />
            <button className="text-gray-400">
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </>
        )}

        <div className="absolute left-0 right-0 top-9 bg-white">
          <ul className="flex flex-col text-gray-500 text-sm">
            {locaionsSearched.map((loc: Location) => (
              <li
                key={loc.id}
                className="w-full py-1 px-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => handlePickLocation(loc)}
              >
                {" "}
                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />{" "}
                {loc.placeName}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div style={{ width: "100%", height: "100%" }} ref={mapContainer} />
      <div className="absolute bottom-8 right-8 flex w-40 justify-between">
        <Button type="danger" onClick={handleClose}>
          Close <FontAwesomeIcon className="ml-2" icon={faWindowClose} />
        </Button>
        <Button type="success" onClick={handleSave}>
          Save <FontAwesomeIcon className="ml-2" icon={faSave} />
        </Button>
      </div>
      <div className="md:max-w-xs	absolute right-0 top-0 bg-white w-full">
        <ul className="border">
          {pickedLocations.map((loc) => (
            <li
              key={loc.id}
              className="text-sm hover:bg-gray-100 p-2 cursor-pointer text-gray-600"
            >
              <FontAwesomeIcon
                icon={faMapMarkerAlt}
                className="mr-1 text-yellow-600"
              />
              -<span className="ml-1">{loc.placeName}</span>
              -
              <FontAwesomeIcon
                icon={faTrashAlt}
                onClick={(e) => handleRemovePickLocation(loc)}
                className="ml-1 text-yellow-600"
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Map;

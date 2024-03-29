// URL에서 쿼리 매개변수 가져오기
const urlParams = new URLSearchParams(window.location.search);
const fname = `${urlParams.get("fname")}.json`;
const carId = urlParams.get("car_id");

console.log(`fname: ${fname}`);
console.log(`carID : ${carId}`);

interface OrderData {
  visit_order: number;
  latitude: number;
  longitude: number;
  zip_code: string;
  address: string;
  open_time: string;
  close_time: string;
  order_volume: number;
  box_num: number;
  arrival_time: string;
  dwell_time: number;
  nm_count: number;
  box_count: number;
  e: number;
  place_id: string;
}

async function readJSON(url: string): Promise<OrderData[]> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`JSON 읽기 오류: ${response.status} ${response.statusText}`);
    }
    const jsonData = await response.json();

    return jsonData.result
      .filter((record: any) => record.CAR_NUM === carId)
      .map((record: any) => {
        const {
          VISIT_ORDER, Y, X, ZIP_CODE, ADDRESS_FULL, OPEN_TIME, CLOSE_TIME, ORDER_VOLUME,
          BOX_NUM, OPT_ARR_TIME_HM, EST_PROC_TIME, NM_COUNT, BOX_COUNT, E, PLACE_ID
        } = record;

        const visit_order = parseInt(VISIT_ORDER);
        const latitude = parseFloat(Y);
        const longitude = parseFloat(X);
        const zip_code = ZIP_CODE;
        const address = ADDRESS_FULL;
        const open_time = convertOpenTime(parseInt(OPEN_TIME));

        const close_time = convertCloseTime(parseInt(CLOSE_TIME));
        const order_volume = parseFloat(ORDER_VOLUME);
        const box_num = parseInt(BOX_NUM);
        const arrival_time = OPT_ARR_TIME_HM;
        const dwell_time = parseInt(EST_PROC_TIME);
        const nm_count = parseInt(NM_COUNT);
        const box_count = parseInt(BOX_COUNT);

        const e = parseInt(E);
        const place_id = PLACE_ID;

        return {
          visit_order, latitude, longitude, zip_code, address, open_time, close_time,
          order_volume, box_num, arrival_time, dwell_time, nm_count, box_count, e, place_id
        };
      });
  } catch (error) {
    console.error('JSON 읽기 오류:', error);
    return [];
  }
}




async function initMap(): Promise<void> {
  const map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
    zoom: 4,
  });
  const infoWindow = new google.maps.InfoWindow(); // infoWindow 생성
  const markers: google.maps.Marker[] = [];
  try {
    const list = await readJSON(`/singpost/data/input-data/${fname}`);
    if (list.length > 0) {
      displayRoute(list, map, infoWindow, markers); // infoWindow 전달
    } else {
      console.error('데이터를 불러오지 못했습니다.');
    }
  } catch (error) {
    console.error('데이터 로딩 오류:', error);
  }
}


function displayRoute(list: OrderData[], map: google.maps.Map, infoWindow: google.maps.InfoWindow, markers: google.maps.Marker[]): void {
  const alphabetLabels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  // Zoom and center map automatically by stations (each station will be in visible map area)
  var lngs = list.map(function (point) { return point.longitude; });
  var lats = list.map(function (point) { return point.latitude; });
  map.fitBounds({
    west: Math.min.apply(null, lngs),
    east: Math.max.apply(null, lngs),
    north: Math.min.apply(null, lats),
    south: Math.max.apply(null, lats),
  });

  // Divide route to several parts because max stations limit is 25 (23 waypoints + 1 origin + 1 destination)
  for (var i = 0, parts: OrderData[][] = [], max = 25 - 1; i < list.length; i = i + max) {
    parts.push(list.slice(i, i + max + 1));
  }

  // Function to create waypoints based on place_id or latitude/longitude
  function createWaypoint(data: OrderData): any {
    if (data.place_id) {
      const waypoint: google.maps.DirectionsWaypoint = {
        location: {placeId: data.place_id},
      };
      return waypoint;
    } else {
      return createWaypointByXY(data);
    }
  }
  function createWaypointByXY(data: OrderData): any {
    // return {at: data.latitude, lng: data.longitude };
    // return {
    //   location: new google.maps.LatLng(data.latitude, data.longitude)
    // };
    const waypoint: google.maps.DirectionsWaypoint = {
      location: new google.maps.LatLng(data.latitude, data.longitude),
    };
    return waypoint;
  }

  function requestRoute(
    directionsService: google.maps.DirectionsService,
    origin: any,
    destination: any,
    waypoints: google.maps.DirectionsWaypoint[]
  ) {
    const directionsRequest: google.maps.DirectionsRequest = {
      origin: origin,
      destination: destination,
      waypoints: waypoints,
      travelMode: google.maps.TravelMode.DRIVING,
      avoidTolls: true,
    };

    // Send request
    directionsService.route(directionsRequest, (response, status) => {
      if (status === google.maps.DirectionsStatus.OK && response) {

        var renderer = new google.maps.DirectionsRenderer;
        renderer.setMap(map);
        renderer.setOptions({ suppressMarkers: true, preserveViewport: true });
        renderer.setDirections(response);

        var directionsRenderer = new google.maps.DirectionsRenderer({
          draggable: false,
          map,
          // panel: document.getElementById("panel") as HTMLElement,
          suppressMarkers: false,
          preserveViewport: true,
          suppressInfoWindows: true,
          markerOptions: {
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: 'white',
              fillOpacity: 1,
              strokeWeight: 3,
              strokeColor: 'blue',
              scale: 5,
            },
            zIndex: 0,
          },
        });
        directionsRenderer.addListener("directions_changed", () => {
          const directions = directionsRenderer.getDirections();
          if (directions) {
            computeTotalDistance(directions);
          }
        });

        directionsRenderer.setDirections(response);
        list.forEach((orderData, index) => {
          // const label = index === 0 ? "A" : alphabetLabels[index];
          const label = index + 1 + "";
          const markerColor = getMarkerColor(list[index].arrival_time);
          const marker = createMarker(list, label, index, map, markerColor, orderData.e);
          const content = createWindowContent(orderData);

          markers.push(marker);
          marker.addListener('click', () => {
            infoWindow.setContent(content);
            infoWindow.open(map, marker);
          });
        });

        makeListElement(list, map, infoWindow, markers);
      } else {
        console.error('index: ', i);;
        console.error('parts: ', parts);
        console.error('경로 요청 실패:', status);


      }
    });
  }
  // const waypoints: google.maps.DirectionsWaypoint[] = [];
  // const waypointsXY: google.maps.DirectionsWaypoint[] = [];

  // list.slice(1, list.length - 1).forEach((data: OrderData) => {
  //   waypoints.push(createWaypoint(data));
  //   waypointsXY.push(createWaypointByXY(data));
  // });

  // Send requests to service to get route (for stations count <= 25 only one request will be sent)
  for (var i = 0; i < parts.length; i++) {
    // Waypoints does not include first station (origin) and last station (destination)
    const waypoints: google.maps.DirectionsWaypoint[] = [];
    const waypointsXY: google.maps.DirectionsWaypoint[] = [];


    parts[i].slice(1, list.length - 1).forEach((data: OrderData) => {
      waypoints.push(createWaypoint(data));
      waypointsXY.push(createWaypointByXY(data));
    });

    const directionsService = new google.maps.DirectionsService();

    const origin = { placeId: parts[i][0].place_id};
    const destination = { placeId: parts[i][parts[i].length - 1].place_id};

    const originXY = createWaypointByXY(parts[i][0]);
    const destinationXY = createWaypointByXY(parts[i][parts[i].length - 1]);

    // 모든 웨이포인트에 Place ID가 있는지 확인
    const allWaypointsHavePlaceId = waypoints.every(waypoint => {
      if (waypoint && 'location' in waypoint) {
        const location = waypoint.location;
        if (typeof location === 'object' && 'placeId' in location) {
          return true;
        }
      }
      return false;
    });

    if (allWaypointsHavePlaceId) {
      requestRoute(directionsService, origin, destination, waypoints);
      console.log("Routing with placeID");
    } else {
      requestRoute(directionsService, originXY, destinationXY, waypointsXY);
      console.log("Routing with XY");
    }

  }
};

function createMarker(
  orderDataList: OrderData[],
  label: string,
  index: number,
  map: google.maps.Map,
  markerColor: string,
  e: number, //긴급주문
): google.maps.Marker {
  const zIndex = index === 0 ? orderDataList.length : orderDataList.length - index;
  const strokeColor = (e == 1) ? "blue" : "black";

  const marker = new google.maps.Marker({
    position: new google.maps.LatLng(orderDataList[index].latitude, orderDataList[index].longitude),
    map: map,
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: markerColor,
      fillOpacity: 1,
      strokeWeight: 3,
      strokeColor: strokeColor,
      scale: 10, // 마커의 크기 조절
    },
    label: {
      text: label,
    },
    zIndex: zIndex,
  });

  return marker;
}

function getMarkerColor(arrivalTime: string): string {
  const hours = parseInt(arrivalTime.split(":")[0]);
  if (hours >= 0 && hours <= 11) { //~12시
    return "#FFA7A7"; //red
  } else if (hours >= 12 && hours <= 14) { //12~15시
    return "#FAED7D"; //yellow
  } else if (hours >= 15 && hours <= 17) { //15~18시
    return "#B7F0B1";
  } else { //18시 ~
    return "#6799FF";//blue
  }
}

function convertOpenTime(openTime: number): string {
  const hour = Math.floor(openTime / 60);
  const min = openTime % 60;

  const formattedTime = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`; //00:00 포맷
  return formattedTime;
}

function convertCloseTime(closeTime: number): string {
  if (closeTime >= 1440) { //24:00일 경우, 23:59로 표시(?=인 이유: 2880도 있음)
    return "23:59";
  } else {
    const hour = Math.floor(closeTime / 60);
    const min = closeTime % 60;

    const formattedTime = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`; //00:00 포맷
    return formattedTime;
  }
}

function createWindowContent(data: OrderData): string {
  const contentFormat = `
  <strong>- Zipcode: </strong>${data.zip_code}<br>
  <strong>- Customer: </strong>${data.nm_count}<br>
  <strong>- Total Item: </strong>${data.box_count}<br>
  `;
  return contentFormat;
}

function createListHeaderContent(data: OrderData): string {
  const contentFormat = `
  (${data.zip_code})<br>
  ${data.address}<br>
  `
  return contentFormat;
}

function createListContent(data: OrderData): string {
  const contentFormat = `
  - Arrival Time: ${data.arrival_time}<br>
  - Dwell Time: ${data.dwell_time}<br>
  - Items: ${data.box_num}<br>
  - Total Weight: ${data.order_volume}<br>
  - Requested time from: ${data.open_time}<br>
  - Requested time to: ${data.close_time}<br>
  `
  return contentFormat;
}

function computeTotalDistance(result: google.maps.DirectionsResult) {
  let total = 0;
  const myroute = result.routes[0];
  if (!myroute) {
    return;
  }
  for (let i = 0; i < myroute.legs.length; i++) {
    total += myroute.legs[i]!.distance!.value;
  }
  total = total / 1000;
  (document.getElementById("total") as HTMLElement).innerHTML = total + " km";
}

function makeListElement(data: OrderData[], map: google.maps.Map, infoWindow: google.maps.InfoWindow, markers: google.maps.Marker[]) {
  const dataList = document.getElementById("data-list");
  if (dataList) {
    dataList.innerHTML = "";
    data.forEach((item, i) => {
      const listItem = document.createElement("li");
      listItem.className = "data-item";

      const itemHeader = document.createElement("div");
      itemHeader.className = "item-header";
      const headerColor = (data[i].e == 1) ? "#EBF7FF" : "#EEEEEE";
      itemHeader.style.backgroundColor = headerColor;

      // 동그라미 (index) 추가
      const indexCircle = document.createElement("div");
      indexCircle.className = "index-circle";
      indexCircle.style.backgroundColor = getMarkerColor(data[i].arrival_time);
      const strokeColor = (data[i].e == 1) ? "blue" : "black";
      indexCircle.style.borderColor = strokeColor;
      const index = document.createElement("span");
      index.textContent = (i + 1).toString();
      indexCircle.appendChild(index);

      // zipcode, address 데이터 추가
      const headerInfo = document.createElement("div");
      headerInfo.className = "header-info";
      headerInfo.innerHTML = createListHeaderContent(item);

      itemHeader.appendChild(indexCircle);
      itemHeader.appendChild(headerInfo);

      listItem.appendChild(itemHeader);

      const dataInfo = document.createElement("div");
      dataInfo.innerHTML = createListContent(item);
      listItem.appendChild(dataInfo);

      dataList.appendChild(listItem);

      // 아이템 헤더 클릭 이벤트 추가
      itemHeader.addEventListener("click", () => {
        // const markerIndex = index; 
        const marker = markers[i];

        if (marker) {
          //marker 최상단으로 올리기.
          markers.forEach((marker, index) => {
            marker.setZIndex(markers.length - index);
          });
          marker.setZIndex(markers.length + 1);
          // InfoWindow 열기
          infoWindow.setContent(createWindowContent(item));
          infoWindow.open(map, marker);
        }
      });
    });
  }
}

const row = document.getElementById("accordian-header") as HTMLElement;
const arrowIcon = document.querySelector(".arrow-icon") as HTMLElement;
const sidebar = document.getElementById("sidebar") as HTMLElement;

if (row && arrowIcon && sidebar) {
  let isSidebarOpen = true;

  row.addEventListener("click", () => {
    if (isSidebarOpen) {
      sidebar.style.maxHeight = "0";
      sidebar.addEventListener("transitionend", () => {
        sidebar.style.padding = "0";
      }, { once: true });

    } else {
      sidebar.style.maxHeight = "50%";
      sidebar.style.padding = "1rem";
    }
    isSidebarOpen = !isSidebarOpen;
    arrowIcon.style.transform = isSidebarOpen ? "rotate(180deg)" : "rotate(0deg)";
  });
} else {
  console.error("Required elements not found");
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;

export { };

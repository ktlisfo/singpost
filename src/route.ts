// URL에서 쿼리 매개변수 가져오기
const urlParams = new URLSearchParams(window.location.search);
const fname = `${urlParams.get("fname")}.json`;
const carId = urlParams.get("car_id");

console.log(`fname: ${fname}`);
console.log(`carID : ${carId}`);

interface OrderData {
  latitude: number;
  longitude: number;
  address: string;
  open_time: number;
  close_time: number;
  order_volume: number;
  box_num: number;
  arrival_time: string;
  dwell_time: number;
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
          Y, X, ADDRESS_FULL, OPEN_TIME, CLOSE_TIME, ORDER_VOLUME,
          BOX_NUM, OPT_ARR_TIME_HM, EST_PROC_TIME
        } = record;

        const latitude = parseFloat(Y);
        const longitude = parseFloat(X);
        const address = ADDRESS_FULL;
        const open_time = parseInt(OPEN_TIME);
        const close_time = parseInt(CLOSE_TIME);
        const order_volume = parseFloat(ORDER_VOLUME);
        const box_num = parseInt(BOX_NUM);
        const arrival_time = OPT_ARR_TIME_HM;
        const dwell_time = parseInt(EST_PROC_TIME);

        return {
          latitude, longitude, address, open_time, close_time,
          order_volume, box_num, arrival_time, dwell_time
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

  try {
    const list = await readJSON(`/singpost-route/data/input-data/${fname}`);
    if (list.length > 0) {
      displayRoute(list, map, infoWindow); // infoWindow 전달
    } else {
      console.error('데이터를 불러오지 못했습니다.');
    }
  } catch (error) {
    console.error('데이터 로딩 오류:', error);
  }
}


function displayRoute(list: OrderData[], map: google.maps.Map, infoWindow: google.maps.InfoWindow): void {
  const alphabetLabels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  const directionsRenderer = new google.maps.DirectionsRenderer({
    draggable: false,
    map,
    panel: document.getElementById("panel") as HTMLElement,
    suppressMarkers: false,
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

  const waypoints: google.maps.DirectionsWaypoint[] = [];
  list.slice(1, list.length - 1).forEach((data: OrderData) => {
    const waypoint: google.maps.DirectionsWaypoint = {
      location: new google.maps.LatLng(data.latitude, data.longitude),
    };
    waypoints.push(waypoint);
  });

  const directionsRequest = {
    origin: { lat: list[0].latitude, lng: list[0].longitude },
    destination: { lat: list[list.length - 1].latitude, lng: list[list.length - 1].longitude },
    waypoints: waypoints,
    travelMode: google.maps.TravelMode.DRIVING,
    avoidTolls: true
  };

  const directionsService = new google.maps.DirectionsService();
  directionsService.route(directionsRequest, (response, status) => {
    if (status === google.maps.DirectionsStatus.OK && response) {
      directionsRenderer.setDirections(response);
      list.forEach((orderData, index) => { // 수정된 부분
        const label = index === 0 ? "A" : alphabetLabels[index];
        const marker = createMarker(list, label, index, map); // 수정된 부분
        const content = createContent(orderData); // 수정된 부분

        marker.addListener('click', () => {
          infoWindow.setContent(content);
          infoWindow.open(map, marker);
        });
      });
    } else {
      console.error('경로 요청 실패:', status);
    }
  });
}

function createMarker(
  orderDataList: OrderData[],
  label: string,
  index: number,
  map: google.maps.Map
): google.maps.Marker {
  const zIndex = index === 0 ? orderDataList.length : orderDataList.length - index;
  const marker = new google.maps.Marker({
    position: new google.maps.LatLng(orderDataList[index].latitude, orderDataList[index].longitude),
    map: map,
    label: {
      text: label,
      // color: index === 0 ? "black" : "yellow",
      fontWeight: "bold",
    },
    zIndex: zIndex,
  });

  return marker;
}




function createContent(data: OrderData): string {
  const contentFormat = `
  <strong>- Address: </strong>${data.address}<br>
  <strong>- Arrival Time: </strong>${data.arrival_time}<br>
  <strong>- Dwell Time: </strong>${data.dwell_time}<br>
  <strong>- Items: </strong>${data.box_num}<br>
  <strong>- Total Weight: </strong>${data.order_volume}<br>
  <strong>- Requested time from: </strong>${data.open_time}<br>
  <strong>- Request time to: </strong>${data.close_time}<br>
  `;

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

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;

export {};

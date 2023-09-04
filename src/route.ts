// URL에서 쿼리 매개변수 가져오기
const urlParams = new URLSearchParams(window.location.search);
const fname = `${urlParams.get("fname")}.json`;
const carId = urlParams.get("car_id");

console.log(`fname: ${fname}`);
console.log(`carID : ${carId}`);

interface OrderData {
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
          Y, X, ZIP_CODE, ADDRESS_FULL, OPEN_TIME, CLOSE_TIME, ORDER_VOLUME,
          BOX_NUM, OPT_ARR_TIME_HM, EST_PROC_TIME
        } = record;

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

        return {
          latitude, longitude, zip_code, address, open_time, close_time,
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
    const list = await readJSON(`/singpost/data/input-data/${fname}`);
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
        const markerColor = getArrivalTimePeriod(list[index].arrival_time);
        const marker = createMarker(list, label, index, map, markerColor); // 수정된 부분
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
  map: google.maps.Map,
  timePeriodColor: number
): google.maps.Marker {
  const zIndex = index === 0 ? orderDataList.length : orderDataList.length - index;
  const markerColor = getMarkerColor(timePeriodColor);
  
  const marker = new google.maps.Marker({
    position: new google.maps.LatLng(orderDataList[index].latitude, orderDataList[index].longitude),
    map: map,
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: markerColor,
      fillOpacity: 1,
      strokeWeight: 2,
      scale: 10, // 마커의 크기 조절
    },
    label: {
      text: label,
    },
    zIndex: zIndex,
  });

  
  return marker;
}
function getArrivalTimePeriod(arrivalTime: string): number {
  const hours = parseInt(arrivalTime.split(":")[0]);

  if (hours >= 0 && hours <= 11) { //~12시
    return 1;
  } else if (hours >= 12 && hours <= 14) { //12~15시
    return 2;
  } else if (hours >= 15 && hours <= 17) { //15~18시
    return 3;
  } else{ //18시 ~
    return 4;
  }
}

function getMarkerColor(num: number): string {
  switch (num) {
    case 1:
      return "red";
    case 2:
      return "orange";
    case 3:
      return "yellow";
    case 4:
      return "#3ADF00";
    default:
      return "black"; // 기본값 설정
  }
}

function convertOpenTime(openTime: number): string{
  if(openTime == 0){
    return "00:00";
  }else{
    const hour = Math.floor(openTime/60);
    const min = openTime%60;
    if(min == 0){
      return hour+":00";
    }
    return hour+":"+min;
  }
}
function convertCloseTime(closeTime: number): string{
  if(closeTime>=1440){
    return "23:59";    
  }else if(closeTime == 0){
    return "00:00";
  }else{
    const hour = Math.floor(closeTime/60);
    const min = closeTime%60;
    if(min == 0){
      return hour+":00";
    }
    return hour+":"+min;
  }
}

function createContent(data: OrderData): string {
  const contentFormat = `
  <strong>- Zipcode: </strong>${data.zip_code}<br>
  <strong>- Address: </strong>${data.address}<br>
  <strong>- Arrival Time: </strong>${data.arrival_time}<br>
  <strong>- Dwell Time: </strong>${data.dwell_time}<br>
  <strong>- Items: </strong>${data.box_num}<br>
  <strong>- Total Weight: </strong>${data.order_volume}<br>
  <strong>- Requested time from: </strong>${data.open_time}<br>
  <strong>- Requested time to: </strong>${data.close_time}<br>
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


const row = document.getElementById("accordian-header") as HTMLElement;
const arrowIcon = document.querySelector(".arrow-icon") as HTMLElement;
const sidebar = document.getElementById("sidebar") as HTMLElement;
const map = document.getElementById("map") as HTMLElement;

if (row && arrowIcon && sidebar) {
  let isSidebarOpen = false;

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

export {};

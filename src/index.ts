function readJSONList(): Promise<Array<string>> {
  const owner = 'ktlisfo';
  const repo = 'singpost';
  const path = 'data/input-data/';

  return fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch file list');
      }
      return response.json();
    })
    .then(data => {
      // data 배열에서 file name만 추출하여 리스트 반환
      console.log(data);
      const fileList = data.map(file => file.name);
      console.log(fileList);
      return fileList;
      
    })
    .catch(error => {
      // 오류 처리
      console.error('Error:', error);
      return [];
    });
}


function readJSON(url): Promise<Set<string>> {
  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`JSON 읽기 오류: ${response.status} ${response.statusText}`);
      }
      return response.json();
    })
    .then((jsonData) => {
      // const map = new Map();
      const carList = new Set<string>();

      jsonData.result.forEach((record) => {
        carList.add(record.CAR_NUM);
      });

      return carList;
    });
}

function generateJSONElements(jsonList: Array<string>): DocumentFragment{
  const fragment = document.createDocumentFragment();
  jsonList.forEach((fname) => {
    //expanable
    const details = document.createElement('details');
    details.className = 'tree-nav__item is-expandable';

    //date
    const summary = document.createElement('summary');
    summary.className = 'tree-nav__item-title';
    summary.textContent = fname.replace(".json","");
    console.log('fname: ' + fname);

    //클릭 시 동작하는 이벤트 리스너 추가
    summary.addEventListener('click', function(){
      const jsonURL = '/singpost/data/input-data/'+fname; // JSON 파일 경로
      console.log('jsonUrl: '+jsonURL);
      if(!generatedSet.has(fname)){
        //클릭된 json파일 읽는다.
        readJSON(jsonURL)
        .then((carList) => {
          // 데이터 처리 로직
          console.log(carList);

          generateDataElements(fname, carList);
        })
        .catch((error) => {
          console.error('JSON 읽기 오류:', error);
        });
        
        generatedSet.add(fname);
      }

    });
  
    //link container
    const div = document.createElement('div');
    div.className = 'tree-nav__item';

    
    //all-route link
    const BASE_URL = "./data/all-route/"
    const link = document.createElement('a');
    link.className = 'tree-nav__item';
    const url = BASE_URL + fname.replace("json", "html");
    console.log("all route url: "+ url);
    link.href = url;
    link.textContent = "All Route";
    div.appendChild(link);

    //all-route-by-car
    const BY_CAR_BASE_URL = "./data/all-route-by-car/"
    const bycar_url = BY_CAR_BASE_URL + fname.replace(".json", "_by_CAR.html");
    console.log("bycar url: "+ bycar_url);

    fetch(bycar_url)
      .then((response) => {
        if(response.ok){
          const bycar_link = document.createElement('a');
          bycar_link.className = 'tree-nav__item';
          bycar_link.href = bycar_url;
          bycar_link.textContent = "All Route By Car";
          div.appendChild(bycar_link);
        }
      });
  
    details.appendChild(div);
    details.appendChild(summary);
    fragment.appendChild(details);
  })

  return fragment;
}
function generateDataElements(fname:string, carList:Set<string>) {

  const BASE_URL = './route.html?';

  const summaryText = fname.replace(".json", ""); //찾으려는 항목

  const treeNav = document.querySelector('.tree-nav');
  if (treeNav && treeNav.children) {
    // tree-nav의 자식 요소들을 순회한다.
    for (const child of treeNav.children) {
      if (child.tagName === 'DETAILS') {
        const summary = child.querySelector('.tree-nav__item-title');
        if (summary && summary.textContent === summaryText) {
          // summary의 텍스트가 파일명과 일치하는 경우, div 태그를 찾는다.
          const div = child.querySelector('.tree-nav__item');
          if (div) {
            // 해당 div 요소에 CAR_NUM 링크 요소를 추가함
            sortCarName(carList).forEach((carNum) => {
              //car link
              const link = document.createElement('a');
              link.className = 'tree-nav__item';
              link.href = BASE_URL + 'fname=' + fname.replace(".json","") + '&car_id=' + carNum;
              link.textContent = carNum;//차량 번호 추가
              div.appendChild(link);
            });
          }
          break;
        }
      }
    }
  }
}

function sortFileName(fileNames: Array<string>) {
  fileNames.sort((a, b) => {
    const dateA = getDateFromFileName(a);
    const dateB = getDateFromFileName(b);

    // 먼저 날짜를 비교합니다.
    if (dateA > dateB) {
      return -1;
    } else if (dateA < dateB) {
      return 1;
    }

    //R, E를 구분합니다.
    const categoryA = getER_FromFileName(a);
    const categoryB = getER_FromFileName(b);

    if(categoryA > categoryB){
      return 1;
    }else if(categoryA < categoryB){
      return -1;
    }

    // 날짜가 같다면 R 또는 E 뒤의 숫자를 비교합니다.
    const rNumberA = (categoryA==0)?getENumberFromFileName(a):getRNumberFromFileName(a);
    const rNumberB = (categoryB==0)?getENumberFromFileName(b):getRNumberFromFileName(b);

    if (rNumberA > rNumberB) {
      return -1;
    } else if (rNumberA < rNumberB) {
      return 1;
    }

    // R 또는 E 뒤의 숫자도 같다면 T 뒤의 숫자를 비교합니다.

    const tNumberA = getTNumberFromFileName(a);
    const tNumberB = getTNumberFromFileName(b);

    if (tNumberA > tNumberB) {
      return -1;
    } else if (tNumberA < tNumberB) {
      return 1;
    }

    //T 뒤의 숫자도 같다면 P 뒤의 숫자를 비교합니다.
    const pNumberA = getPNumberFromFileName(a);
    const pNumberB = getPNumberFromFileName(b);

    if (pNumberA > pNumberB) {
      return -1;
    } else if (pNumberA < pNumberB) {
      return 1;
    }


    return 0;
  });

  console.log(fileNames);
  return fileNames;
}

// 파일명에서 날짜를 추출하는 함수
function getDateFromFileName(fileName: string): Date {
  const [day, month] = [
    fileName.substring(0, 2),
    fileName.substring(2, 5)
  ];

  const monthMap: { [key: string]: number } = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  };
  return new Date(2023, monthMap[month], parseInt(day));
}

//파일명에서 R또는 E를 추출하는 함수
function getER_FromFileName(fileName: string): number{
  console.log("E or R: "+ fileName[6]);
  if(fileName[6] == 'E'){
    return 0;
  }else{
    return 1;
  }
}

// 파일명에서 R 뒤의 숫자를 추출하는 함수
function getRNumberFromFileName(fileName: string): number {
  const match = fileName.match(/R([0-9]+)/);
  return match ? parseInt(match[1]) : 0;
}

// 파일명에서 E 뒤의 숫자를 추출하는 함수
function getENumberFromFileName(fileName: string): number {
  const match = fileName.match(/E([0-9]+)/);
  return match ? parseInt(match[1]) : 0;
}

// 파일명에서 T 뒤의 숫자를 추출하는 함수
function getTNumberFromFileName(fileName: string): number {
  const match = fileName.match(/T([0-9]+)/);
  return match ? parseInt(match[1]) : 0;
}

// 파일명에서 T 뒤의 숫자를 추출하는 함수
function getPNumberFromFileName(fileName: string): number {
  const match = fileName.match(/P([0-9]+)/);
  return match ? parseInt(match[1]) : 0;
}

function sortCarName(carList: Set<string>):Array<string>{
  return  Array.from(carList).sort();
}

//json 목록 읽어와 element 생성
const generatedSet = new Set();
readJSONList()
  .then(jsonList => {
    const fileNames = sortFileName(jsonList);
    const summaries = generateJSONElements(fileNames);

    const container = document.querySelector('.tree-nav');
    if (container) {
      container.appendChild(summaries);
    } else {
      console.error('Container Element Not Found');
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });






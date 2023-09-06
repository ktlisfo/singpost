
const fs = require('fs');
const path = require('path');

//1. google maps key 맵핑

const htmlFilePath = 'dist/route.html';// 배포할 HTML 파일 경로

let html = fs.readFileSync(htmlFilePath, 'utf-8');  // HTML 파일 읽기

// 구글 맵 API 키로 대체
const googleMapsAPIKey = process.env.GOOGLE_MAP_KEY;
html = html.replace('__GOOGLE_MAPS_API_KEY__', googleMapsAPIKey);

// 대체된 내용을 다시 파일에 쓰기
fs.writeFileSync(htmlFilePath, html, 'utf-8');

//2. json, html 파일 deploy
const sourceWebDataDirectory = './data/all-route'; // 배포할 파일들이 위치한 디렉토리 경로
const deployWebDataDirectory = './dist/data/all-route'; // 배포할 경로

const sourceInputDataDirectory = './data/input-data';
const deployInputDataDirectory = './dist/data/input-data';

function deployFiles(sourceDirectory, deployDirectory) {
  fs.readdir(sourceDirectory, (err, files) => {
    if (err) {
      console.error(`Failed to read files from ${sourceDirectory}`);
      console.error(err);
      return;
    }

     // deployDirectory에 해당하는 디렉토리 생성
    fs.mkdirSync(deployDirectory, { recursive: true });

    files.forEach(file => {
      const sourcePath = path.join(sourceDirectory, file);
      const deployPath = path.join(deployDirectory, file);

      fs.copyFile(sourcePath, deployPath, err => {
        if (err) {
          console.error(`Failed to deploy ${file}`);
          console.error(err);
        } else {
          console.log(`Deployed ${file}`);
        }
      });
    });
  });
}

// 스크립트 실행
deployFiles(sourceWebDataDirectory, deployWebDataDirectory);
deployFiles(sourceInputDataDirectory, deployInputDataDirectory);
const { execSync } = require("child_process");
const { rmSync, mkdirSync, existsSync } = require("fs");
const path = require("path");

// 타입 선언 파일 생성
console.log("타입 선언 파일 생성 중...");

// 기존 타입 디렉토리 정리
const typesDir = path.join(__dirname, "../dist/types");
if (existsSync(typesDir)) {
  rmSync(typesDir, { recursive: true, force: true });
}
mkdirSync(typesDir, { recursive: true });

// tsc를 실행하여 타입 선언 파일만 생성
try {
  execSync("tsc --declaration --emitDeclarationOnly --outDir dist/types", {
    stdio: "inherit",
    cwd: path.join(__dirname, ".."),
  });

  console.log("타입 선언 파일 생성 완료!");
} catch (error) {
  console.error("타입 선언 파일 생성 중 오류 발생:", error);
  process.exit(1);
}

const esbuild = require('esbuild');
const { readFileSync, writeFileSync, mkdirSync, existsSync } = require('node:fs');
const { join } = require('node:path');
const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));

// 외부 의존성 설정 (번들에 포함하지 않음)
const external = Object.keys(pkg.dependencies || {});

// 공통 설정
const baseConfig = {
  bundle: true,
  minify: true,
  platform: 'neutral',
  external,
  sourcemap: true,
  target: ['es2019', 'node12'],
  treeShaking: true,
  legalComments: 'external',
};

// 메인 빌드: CJS (CommonJS)
esbuild
  .build({
    ...baseConfig,
    entryPoints: ['src/index.ts'],
    outfile: 'dist/index.js',
    format: 'cjs',
  })
  .catch(() => process.exit(1));

// 메인 빌드: ESM (ECMAScript Module)
esbuild
  .build({
    ...baseConfig,
    entryPoints: ['src/index.ts'],
    outfile: 'dist/esm/index.js',
    format: 'esm',
  })
  .catch(() => process.exit(1));

// 개별 함수 엔트리포인트 생성 - ESM 포맷
async function createIndividualEntryPoints() {
  // 개별 함수 export를 위한 디렉토리 생성
  const functionsDir = join(__dirname, '../dist/functions');
  if (!existsSync(functionsDir)) {
    mkdirSync(functionsDir, { recursive: true });
  }

  // 함수별 래퍼 생성
  const functions = ['romanize', 'romanizeWithType', 'romanizeWithAssimilation'];

  for (const func of functions) {
    // ESM 래퍼 생성
    const esmContent = `import { ${func} } from '../esm/index.js';\nexport { ${func} };\nexport default ${func};`;
    writeFileSync(join(functionsDir, `${func}.js`), esmContent);

    // CJS 래퍼 생성
    const cjsContent = `const { ${func} } = require('../index.js');\nmodule.exports = ${func};\nmodule.exports.${func} = ${func};`;
    writeFileSync(join(functionsDir, `${func}.cjs`), cjsContent);
  }
}

// 실행
createIndividualEntryPoints().catch((err) => {
  console.error('개별 함수 엔트리포인트 생성 중 오류 발생:', err);
  process.exit(1);
});

/**
 * build-gh-pages.js
 * Script de build para GitHub Pages.
 *
 * Uso:
 *   node build-gh-pages.js https://seu-usuario.github.io/nome-do-repo
 *
 * O que faz:
 *   1. Lê a DEPLOY_URL passada como argumento
 *   2. Builda os 3 projetos com webpack.prod.js (passando DEPLOY_URL via env)
 *   3. Copia os artefatos para a pasta docs/ na raiz:
 *        docs/               ← container
 *        docs/cardapio/      ← micro-cardapio
 *        docs/pedido/        ← micro-pedido
 *   4. A pasta docs/ é configurada como source no GitHub Pages (branch main)
 *
 * Estrutura final de docs/:
 *   docs/
 *   ├── index.html           ← container
 *   ├── main.js / ...
 *   ├── cardapio/
 *   │   ├── remoteEntry.js
 *   │   └── ...
 *   └── pedido/
 *       ├── remoteEntry.js
 *       └── ...
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Lê e valida a DEPLOY_URL passada como argumento
// ---------------------------------------------------------------------------
const DEPLOY_URL = process.argv[2];

if (!DEPLOY_URL) {
  console.error('Erro: informe a URL do GitHub Pages como argumento.');
  console.error('Exemplo: node build-gh-pages.js https://usuario.github.io/repo');
  process.exit(1);
}

// Remove barra final, se houver
const baseUrl = DEPLOY_URL.replace(/\/$/, '');

console.log(`\nDeploy URL: ${baseUrl}\n`);

// ---------------------------------------------------------------------------
// Caminhos
// ---------------------------------------------------------------------------
const ROOT = __dirname;
const DOCS = path.join(ROOT, 'docs');
const PROJECTS = [
  { name: 'micro-cardapio', outSubdir: 'cardapio' },
  { name: 'micro-pedido',   outSubdir: 'pedido'   },
  { name: 'container',      outSubdir: ''          }, // raiz do docs/
];

// ---------------------------------------------------------------------------
// Limpa e recria a pasta docs/
// ---------------------------------------------------------------------------
if (fs.existsSync(DOCS)) {
  fs.rmSync(DOCS, { recursive: true });
}
fs.mkdirSync(DOCS);
console.log('Pasta docs/ recriada.\n');

// ---------------------------------------------------------------------------
// Builda cada projeto e copia para docs/
// ---------------------------------------------------------------------------
for (const project of PROJECTS) {
  const projectDir = path.join(ROOT, project.name);
  const destDir = project.outSubdir
    ? path.join(DOCS, project.outSubdir)
    : DOCS;

  console.log(`Buildando ${project.name}...`);

  execSync(
    `npx webpack --config webpack.prod.js`,
    {
      cwd: projectDir,
      // Injeta DEPLOY_URL como variável de ambiente para o webpack.prod.js
      env: { ...process.env, DEPLOY_URL: baseUrl },
      stdio: 'inherit',
    }
  );

  // O webpack gera os arquivos em <projeto>/dist/ por padrão
  const distDir = path.join(projectDir, 'dist');

  if (!fs.existsSync(distDir)) {
    console.error(`Erro: pasta dist/ não encontrada em ${projectDir}`);
    process.exit(1);
  }

  // Cria subpasta de destino se necessário
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  // Copia recursivamente dist/ → destino em docs/
  copyDir(distDir, destDir);
  console.log(`  → copiado para docs/${project.outSubdir || '(raiz)'}\n`);
}

console.log('Build para GitHub Pages concluído!\n');
console.log('Para publicar:');
console.log('  1. git add docs/');
console.log('  2. git commit -m "build: gh-pages"');
console.log('  3. git push');
console.log('  4. No GitHub: Settings → Pages → Source: main / docs/\n');

// ---------------------------------------------------------------------------
// Utilitário: copia diretório recursivamente (Node nativo, sem dependências)
// ---------------------------------------------------------------------------
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath  = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

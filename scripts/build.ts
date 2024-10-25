import { exec } from 'node:child_process'
import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import util from 'node:util'
import consola from 'consola'
import dotenv from 'dotenv'
import { rimraf } from 'rimraf'
import { copyDir } from './utils/fs'
import { generateHttpYaml, generateMakefile, generateNginxConf } from './utils/generate'
import { prompt } from './utils/prompt'

const execAsync = util.promisify(exec)

// 設置基本目錄
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const BASE_DIR = path.resolve(__dirname, '..')
const PACKAGES_DIR = path.join(BASE_DIR, 'packages')
const CONFIG_DIR = path.join(BASE_DIR, 'config')
const BUILD_DIR = path.join(BASE_DIR, 'build')

// 載入 .env 文件
dotenv.config({ path: path.join(BASE_DIR, '.env') })
const BUILD_NAME = process.env.BUILD_NAME || 'airaConnect'
const BUILD_FOLDER = path.join(BUILD_DIR, BUILD_NAME)

// 獲取環境變量
const NODE_ENV = process.env.NODE_ENV || 'production'

const PROJECT_NAME = process.env.PROJECT_NAME || 'ariaProject'
const PROJECT_PREFIX = process.env.PROJECT_PREFIX || 'airaconnect'
const PORT = process.env.PROJECT_PORT || '8087'
const DEPLOY_PORT = process.env.DEPLOY_PORT || '8082'

async function initializeBuildDir() {
  consola.start('初始化構建目錄...')
  try {
    // 清空 build 目錄
    await rimraf(BUILD_DIR)

    // 創建新的 build 目錄和 BUILD_NAME 子目錄
    await fs.mkdir(BUILD_FOLDER, { recursive: true })
    await fs.mkdir(path.join(BUILD_FOLDER, 'bin'), { recursive: true })

    // 複製配置文件
    const configFiles = await fs.readdir(CONFIG_DIR)
    for (const file of configFiles) {
      const sourcePath = path.join(CONFIG_DIR, file)
      const destPath = path.join(BUILD_FOLDER, file)

      try {
        const stats = await fs.lstat(sourcePath)
        if (stats.isFile()) {
          await fs.copyFile(sourcePath, destPath)
        }
        else if (stats.isDirectory()) {
          await copyDir(sourcePath, destPath)
        }
        else {
          consola.warn(`跳過特殊文件或目錄: ${file}`)
        }
      }
      catch (error: unknown) {
        if (error instanceof Error) {
          consola.warn(`無法複製 ${file}: ${error.message}`)
        }
        else {
          consola.warn(`無法複製 ${file}: 發生未知錯誤`)
        }
        process.exit(0)
      }
    }
    consola.success('構建目錄初始化完成')
  }
  catch (error: unknown) {
    if (error instanceof Error) {
      consola.error('初始化構建目錄時發生錯誤：', error.message)
    }
    else {
      consola.error('初始化構建目錄時發生錯誤：發生未知錯誤')
    }
    process.exit(0)
  }
}

async function buildProject(projectName: string, projectPath: string, version: string) {
  consola.info(`正在處理專案：${projectName}`)

  const packageJsonPath = path.join(projectPath, 'package.json')
  try {
    await fs.access(packageJsonPath)
  }
  catch (error: unknown) {
    if (error instanceof Error) {
      consola.warn(`警告：${projectName} 中找不到 package.json，跳過此專案`)
    }
    else {
      consola.warn(`警告：${projectName} 中找不到 package.json，跳過此專案`)
    }
    process.exit(0)
    return
  }

  process.chdir(projectPath)

  // 安裝依賴
  const nodeModulesPath = path.join(projectPath, 'node_modules')
  try {
    await fs.access(nodeModulesPath)
    consola.info('node_modules 已存在，跳過安裝依賴')
  }
  catch (error: unknown) {
    if (error instanceof Error) {
      consola.start('安裝依賴...')
      await execAsync('pnpm install')
    }
    else {
      consola.warn('安裝依賴時發生錯誤：發生未知錯誤')
    }
  }

  // 執行構建命令
  consola.start('執行構建...')

  if (NODE_ENV === 'production') {
    await execAsync(`pnpm run build`)
  }
  else {
    await execAsync(`pnpm run build:dev`)
  }

  // 檢查 Docker 守護進程是否運行
  try {
    await execAsync('docker info')
  }
  catch {
    consola.warn(`警告：Docker 守護進程未運行，跳過 Docker 相關操作`)
    process.exit(0)
  }

  // 構建 Docker 映像
  consola.start('構建 Docker 映像...')
  const dockerCommand = `docker buildx build --platform linux/amd64 . -t ${projectName}:${version}`
  await execAsync(dockerCommand)

  // 保存 Docker 映像
  consola.start('保存 Docker 映像...')
  const saveCommand = `docker save ${projectName}:${version} | gzip > ${path.join(BUILD_FOLDER, 'bin', `${projectName}-${version}.tar.gz`)}`
  await execAsync(saveCommand)

  // 刪除本地 Docker 映像
  consola.start('刪除本地 Docker 映像...')
  const removeCommand = `docker rmi ${projectName}:${version}`
  await execAsync(removeCommand)

  consola.success(`${projectName} 處理完成`)

  // 返回上一級目錄
  process.chdir(BASE_DIR)

  consola.log('------------------------')
}

async function getPackageVersion(): Promise<string> {
  const packageJsonPath = path.join(BASE_DIR, 'package.json')
  const packageJsonContent = await fs.readFile(packageJsonPath, 'utf-8')
  const packageJson = JSON.parse(packageJsonContent)
  return packageJson.version
}

async function compressBuildFolder() {
  consola.start('壓縮構建資料夾...')
  try {
    const outputFile = path.join(BUILD_DIR, `${BUILD_NAME}.tar.gz`)
    await execAsync(
      `tar --disable-copyfile -czvf ${outputFile} -C ${BUILD_DIR} ${BUILD_NAME}`,
    )
    consola.success('構建資料夾壓縮完成')
  }
  catch (error: unknown) {
    if (error instanceof Error) {
      consola.error('壓縮構建資料夾時發生錯誤：', error.message)
    }
    else {
      consola.error('壓縮構建資料夾時發生錯誤：發生未知錯誤')
    }
  }
}

async function main() {
  await initializeBuildDir()

  const VERSION = await getPackageVersion()
  consola.info(`當前版本：${VERSION}`)

  consola.info(`當前環境為 ${NODE_ENV}`)

  try {
    await fs.access(PACKAGES_DIR)
  }
  catch {
    consola.error('錯誤：找不到 packages 目錄')
    process.exit(0)
  }

  const projects = (await fs.readdir(PACKAGES_DIR, { withFileTypes: true }))
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

  let buildProjects: string[] = await prompt('選擇要構建的專案', {
    type: 'multiselect',
    required: true,
    options: [
      { value: 'all', label: '全部', hint: 'recommended' },
      ...projects.map(project => ({
        value: project,
        label: project,
      })),
    ],
  })

  if (buildProjects.includes('all') && buildProjects.length === 1) {
    buildProjects = [...projects]
  }

  for (const projectName of buildProjects) {
    const projectPath = path.join(PACKAGES_DIR, projectName)
    const stats = await fs.stat(projectPath)

    if (stats.isDirectory()) {
      try {
        await buildProject(projectName, projectPath, VERSION)
      }
      catch (error: unknown) {
        if (error instanceof Error) {
          consola.error(`處理 ${projectName} 時發生錯誤：`, error.message)
        }
        else {
          consola.error(`處理 ${projectName} 時發生錯誤：發生未知錯誤`)
        }
        process.exit(0)
      }
    }
  }

  if (projects.length === buildProjects.length) {
    consola.start('生成 http.yaml 文件...')
    const httpYaml = await generateHttpYaml(VERSION, PROJECT_NAME, PORT, DEPLOY_PORT)
    await fs.writeFile(
      path.join(BUILD_FOLDER, 'http.yaml'),
      httpYaml,
      'utf8',
    )
    consola.success('生成 http.yaml 文件完成')

    const hasWs = await consola.prompt('是否有 ws', {
      type: 'confirm',
      required: true,
    })

    consola.start('生成 nginx.conf 文件...')
    const nginxConf = await generateNginxConf(PROJECT_NAME, PORT, PROJECT_PREFIX, hasWs)
    await fs.writeFile(
      path.join(BUILD_FOLDER, 'nginx.conf'),
      nginxConf,
      'utf8',
    )
    consola.success('生成 nginx.conf 文件完成')

    consola.start('生成 Makefile...')
    const makefile = await generateMakefile(projects, VERSION)
    await fs.writeFile(
      path.join(BUILD_FOLDER, 'Makefile'),
      makefile,
      'utf8',
    )
    consola.success('生成 Makefile 完成')
  }

  // 壓縮構建資料夾
  await compressBuildFolder()

  consola.info('所有專案處理完成!')
}

main().catch((error) => {
  consola.error('執行過程中發生錯誤：', error)
  process.exit(0)
})

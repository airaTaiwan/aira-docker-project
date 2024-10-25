import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { consola } from 'consola'
import dotenv from 'dotenv'
import { prompt } from './utils/prompt'

// 載入 .env 文件
dotenv.config()

function runCommand(command: string): void {
  consola.info(`執行命令：${command}`)
  execSync(command, { stdio: 'inherit' })
}

async function deploy(): Promise<void> {
  try {
    const buildDir = path.join(process.cwd(), 'build')
    const buildName = process.env.BUILD_NAME

    if (!buildName) {
      consola.error('在 .env 文件中找不到 BUILD_NAME')
      return
    }

    const specificBuildDir = path.join(buildDir, buildName)
    const binDir = path.join(specificBuildDir, 'bin')

    if (!fs.existsSync(binDir)) {
      consola.error(`在 ${specificBuildDir} 中找不到 bin 目錄`)
      return
    }

    const defaultTestHost = process.env.DEFAULT_TEST_HOST || '51'

    const sshName = await prompt(
      `請輸入部署主機的 SSH 名稱（默認：${defaultTestHost}）：`,
      {
        type: 'text',
        initial: defaultTestHost,
      },
    )

    const deployOption = await prompt('請選擇部署方式：', {
      type: 'select',
      options: ['全部', '個別'],
    })

    if (deployOption === '全部') {
      const tarFile = path.join(buildDir, `${buildName}.tar.gz`)
      runCommand(`scp ${tarFile} ${sshName}:/opt/aira/`)
    }
    else {
      // 獲取 bin 目錄下的文件（不包括副檔名）
      const binFiles = fs
        .readdirSync(binDir)
        .filter(file => file.endsWith('.tar.gz'))
        .map(file => path.basename(file, '.tar.gz'))

      const fileOptions = [
        { value: 'all', label: '全部', hint: 'recommended' },
        ...binFiles.map(file => ({
          value: file,
          label: file,
        })),
      ]

      const selectedFiles = await prompt('請選擇要傳送的檔案：', {
        type: 'multiselect',
        required: true,
        options: fileOptions,
      })

      if (selectedFiles.includes('all') && selectedFiles.length === 1) {
        runCommand(`scp -r ${binDir}/* ${sshName}:/opt/aira/${buildName}/bin/`)
      }
      else {
        for (const selectedFile of selectedFiles) {
          const target = path.join(binDir, `${selectedFile}.tar.gz`)
          runCommand(`scp ${target} ${sshName}:/opt/aira/${buildName}/bin/`)
        }
      }

      consola.success('部署成功完成！')
    }
  }
  catch (error) {
    consola.error('部署過程中發生錯誤:', error)
  }
}

deploy()

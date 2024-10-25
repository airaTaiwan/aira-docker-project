import dayjs from 'dayjs'
import yaml from 'js-yaml'

export async function generateHttpYaml(version: string, name: string, port: string, deployPort: string) {
  const httpYaml = {
    services: {
      [name as string]: {
        platform: 'linux/amd64',
        image: `${name}:${version}`,
        ports: [`${port}:${port}`],
        restart: 'always',
        volumes: ['./data:/app/data', '.env:/app/.env'],
        env_file: ['.env'],
        logging: {
          driver: 'json-file',
          options: {
            'max-size': '1k',
            'max-file': '3',
          },
        },
      },
      nginx: {
        image: 'nginx:alpine',
        restart: 'always',
        ports: [`${deployPort}:80`],
        volumes: [
          './nginx.conf:/etc/nginx/conf.d/default.conf',
          './www/:/var/www/html',
        ],
        logging: {
          driver: 'json-file',
          options: {
            'max-size': '1k',
            'max-file': '3',
          },
        },
      },
    },
  }

  const warning = `# 警告：此文件是自動生成的。
# 請勿直接修改此文件，因為您的更改可能會在下次構建時被覆蓋。
# 生成時間: ${dayjs().format('YYYY-MM-DD HH:mm:ss')}
# 版本: ${version}

`

  const yamlStr = warning + yaml.dump(httpYaml)
  return yamlStr
}

export async function generateNginxConf(name: string, port: string, prefix: string, hasWs?: boolean) {
  const nginxConf = `map $http_upgrade $connection_upgrade {
    default upgrade;
    ''      close;
}

server {
        listen 80;
        server_name _;
        location / {
                root /var/www/html;
        }
        location /${prefix}/ {
                proxy_http_version 1.1;
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $remote_addr;
                proxy_pass http://${name}:${port}/${prefix}/;
        }
        ${hasWs
    ? `
        location /${prefix}/ws/ {
                proxy_http_version 1.1;
                proxy_set_header Host $host;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection $connection_upgrade;
                proxy_pass http://${name}:${port}/${prefix}/ws/;
        }
`
    : ''}
`

  const warning = `# 警告：此文件是自動生成的。
# 請勿直接修改此文件，因為您的更改可能會在下次構建時被覆蓋。
# 生成時間: ${dayjs().format('YYYY-MM-DD HH:mm:ss')}

`

  return warning + nginxConf
}

export async function generateMakefile(projects: string[], version: string) {
  const makefileContent = `# 警告：此文件是自動生成的。
# 請勿直接修改此文件，因為您的更改可能會在下次構建時被覆蓋。
# 生成時間: ${dayjs().format('YYYY-MM-DD HH:mm:ss')}
# 版本: ${version}

include .env
export

.PHONY: ps up down restart pull env logs restart certs dump restore build watch stop start init transporter load

.ONESHELL:
ps:
\t@docker compose ps

up:
\t@docker compose up -d --force-recreate
\t@docker compose -f http.yaml up -d --force-recreate

down:
\t@docker compose down
\t@docker compose -f http.yaml down

init:
\t@test -f .env || cp .env.example .env
\t@docker compose -f mongo.yaml up mongo -d
\t@docker compose -f mongo.yaml up mongosh

logs:
\t@docker compose logs -f

pull:
\t@docker compose pull

restart: down up

dump:
\t@docker run \\
\t\t--add-host=localhost:host-gateway \\
\t\t-v $$(pwd)/dump:/dump \\
\t\t-it mongo:7 \\
\t\tmongodump --uri="mongodb://localhost:27017/$(APP)"

restore:
\t@echo "請輸入要匯入的資料庫名稱"
\t@read old
\t@echo "要匯入到什麼資料庫"
\t@read new
\t@docker run \\
\t\t--add-host=localhost:host-gateway \\
\t\t-v $$(pwd)/dump:/dump \\
\t\t-it mongo:7 \\
\t\tmongorestore --uri="mongodb://localhost:27017" "/dump/$(APP)" -d "$(APP)"

watch:
\t@npx pm2 start

load:
${projects.map(project => `\t@docker load -i bin/${project}-${version}.tar.gz`).join('\n')}`

  return makefileContent
}

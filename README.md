# Aira Docker Project

用來建立 `docker` 的 `monorepo`

## 目錄結構

```txt
├── .env
├── .gitignore
├── .npmrc
├── .vscode
│   └── settings.json
├── README.md
├── config                         -- 預設配置文件
│   ├── .env.example
│   ├── mongo.yaml
├── package.json
├── packages                       -- 專案
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
└── scripts                        -- 自動化腳本
    ├── build.ts                   -- 打包 `packages` 資料夾下的專案
    ├── deploy.ts                  -- 部署到指定機器
```

## 打包

### 運行

安裝依賴

```bash
pnpm install
```

打包

```bash
pnpm run build
```

部署

```bash
pnpm run deploy
```

後續請參考 [部署文件](./DEPLOY.md)

### 專案配置

- BUILD_NAME：打包後的專案名稱

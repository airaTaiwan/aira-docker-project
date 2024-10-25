# 部署文件

執行 `pnpm run deploy` 後會將編譯壓縮檔傳至指定機器 /opt/aira/`BUILD_NAME` 位置。

運行解壓縮

```bash
cd /opt/aira
tar -xzvf `BUILD_NAME`.tar.gz
```

## 安裝套件

- [`docker`](https://docs.docker.com/engine/install/ubuntu/)
- `make` (apt install make)
- `vim` (apt install vim)

## 設定檔案

先將`.env.example` 檔案複製並重命名為 `.env`，然後修改成對應的值。

```bash
mv .env.example .env
```

## 啟動服務

### 啟動 `mongo`

```bash
make init
```

### 加載 `docker image`

```bash
make load
```

### 啟動剩餘服務

```bash
make up
```

### 更新 `docker image`

```bash
make load
make restart
```

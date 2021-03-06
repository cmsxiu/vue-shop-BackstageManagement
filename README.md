# vue-shop-backstagemanagement

## 安装项目

```
npm install
```

## 项目运行方法：

- 1.可视化操作运行

```
vue ui
```

- 2.命令项目运行

```
npm run serve
```

## 项目运行前必要操作（如果不操作，项目运行不了）

1.  把 src/assets/back-end/vue_api_server/db/mydb.sql 安装好

2.  运行数据库

3.  在 src/assets/back-end/vue_api_server 运行 node /app.js

### 打包 生产模式

```
npm run build
```

### 生成打包报告

- 打包时，为了直观地发现项目中存在的问题，可以在打包时生成报告。生成报告的方式有两种：

1.  通过命令行参数的形式生成报告（通过 vue-cli 的命令选项可以生成打包报告 report.html）

```
npm vue-cli-service build --report
```

2.  通过可视化的 UI 面板直接查看报告

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

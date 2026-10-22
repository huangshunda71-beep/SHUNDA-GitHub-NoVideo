# SHUNDA.Design 个人作品集

这是去除视频与开发者模式、压缩作品图片后的静态网站代码，保留 21 个作品。

## 上传 GitHub
1. 将整个 ZIP 解压到一个新文件夹。
2. 用 GitHub Desktop 将解压后的文件夹创建为仓库并发布。
3. 仓库根目录应直接包含 index.html、assets、data、src、vendor。不要只把 ZIP 文件上传到仓库。

## 部署
这是纯静态网站，无需安装依赖、无需构建命令。选择仓库根目录作为发布目录（通常为 .）。
不依赖 ChatGPT Sites；可以部署到支持静态文件的网站托管服务。能否在中国大陆直接访问取决于托管服务和域名。

## 本地预览
需要通过本地 HTTP 服务预览；不要直接双击 index.html。安装 Python 的电脑可在本目录运行 python -m http.server 8080，然后打开 http://localhost:8080 。

此包不包含视频、开发者后台、Git 历史、账户凭据或原托管服务配置。图片已压缩为 WebP，原始本地项目未修改。

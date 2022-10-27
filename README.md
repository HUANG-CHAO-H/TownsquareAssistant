# 血染钟楼(说书人)助手

- 这是一个谷歌游览器, 用来给血染钟楼页面注入一些代码,提升说书人的使用体验.
- 本脚本项目针对的是[townsquare](!https://github.com/bra1n/townsquare)开源项目.
- 脚本的匹配网址为: http://tampermonkey.net/

## 注意事项

- 玩家username冲突时会导致bug, 助手将无法识别当前是在和谁聊天(通过DOM解析无法获取userId)

# 使用指南

- 本地build后生成dist文件夹，而后可以直接让谷歌游览器加载dist文件夹（加载已解压的扩展程序）。

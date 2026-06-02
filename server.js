const http = require('http');
const fs = require('fs');  // 文件系统模块，用来读取文件
const path = require('path');  // 路径模块，用来处理文件路径

const server = http.createServer((req, res) => {
    const url = req.url;
    
    // 根据 URL 决定要读取哪个文件
    let filePath = '';
    if (url === '/') {
        filePath = 'index.html';
    } else if (url === '/about') {
        filePath = 'about.html';
    } else {
        // 不是 / 也不是 /about → 404
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>404</h1><p>页面不存在</p>');
        return;
    }
    
    // 读取 HTML 文件
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            // 文件读取失败（比如文件不存在）
            res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end('<h1>500</h1><p>服务器内部错误</p>');
            return;
        }
        
        // 读取成功，把文件内容返回给浏览器
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(data);
    });
});

server.listen(3000, () => {
    console.log('服务器运行在 http://localhost:3000');
});
require('dotenv').config();
const http = require('http');
const url = require('url');

const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;
    
    if (pathname === '/') {
        res.end(JSON.stringify({ message: '欢迎访问我的 API' }));
    } else if (pathname === '/user') {
        const userId = query.id;
        const users = {
            '1': { id: 1, name: '张三', age: 20 },
            '2': { id: 2, name: '李四', age: 22 }
        };
        if (userId && users[userId]) {
            res.end(JSON.stringify({ success: true, data: users[userId] }));
        } else {
            res.end(JSON.stringify({ success: false, message: '用户不存在' }));
        }
    } else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: '接口不存在' }));
    }
});

server.listen(port, () => {
    console.log(`服务器运行在 http://localhost:${port}`);
    console.log(`环境: ${process.env.NODE_ENV}`);
});
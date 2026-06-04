require('dotenv').config();
const http = require('http');
const url = require('url');
const db = require('./database');   // ← 这一行是新的，引入了 database.js

const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;
    
    if (pathname === '/') {
        res.end(JSON.stringify({ message: '欢迎访问我的 API' }));
        
    } else if (pathname === '/users') {
        // 从数据库查询所有用户
        try {
            const rows = db.prepare("SELECT * FROM users").all();
            res.end(JSON.stringify({ success: true, data: rows }));
        } catch (err) {
            res.end(JSON.stringify({ success: false, error: err.message }));
        }
        
    } else if (pathname === '/user') {
        // 从数据库查询单个用户
        const userId = query.id;
        if (!userId) {
            res.end(JSON.stringify({ success: false, message: '请提供 id 参数' }));
            return;
        }
        try {
            const row = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);
            if (row) {
                res.end(JSON.stringify({ success: true, data: row }));
            } else {
                res.end(JSON.stringify({ success: false, message: `用户 ${userId} 不存在` }));
            }
        } catch (err) {
            res.end(JSON.stringify({ success: false, error: err.message }));
        }

    } 

else if (pathname === '/add-user' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
        try {
            const { name, age, city } = JSON.parse(body);
            if (!name) {
                res.end(JSON.stringify({ success: false, message: '姓名不能为空' }));
                return;
            }
            const stmt = db.prepare("INSERT INTO users (name, age, city) VALUES (?, ?, ?)");
            const info = stmt.run(name, age || null, city || null);
            res.end(JSON.stringify({ success: true, id: info.lastInsertRowid }));
        } catch (err) {
            res.end(JSON.stringify({ success: false, message: err.message }));
        }
    });
}

    else {
        res.writeHead(404);
        res.end(JSON.stringify({ success: false, message: '接口不存在' }));
    }
});

server.listen(port, () => {
    console.log(`服务器运行在 http://localhost:${port}`);
    console.log('可用的 API:');
    console.log(`  GET  /users          - 获取所有用户`);
    console.log(`  GET  /user?id=1      - 获取指定用户`);
});
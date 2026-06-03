const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
    // 允许跨域（让前端页面能调用）
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // 解析请求的 URL，第二个参数 true 表示把查询参数解析成对象
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;  // 路径部分，比如 /user
    const query = parsedUrl.query;        // 参数部分，比如 { id: '1' }
    
    console.log(`收到请求: ${pathname}, 参数:`, query);
    
    // 设置响应头为 JSON 格式
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    
    // 路由：根据路径返回不同数据
    if (pathname === '/') {
        res.end(JSON.stringify({
            message: '欢迎访问我的 API',
            tips: '试试 /user?id=1 或 /user?id=2'
        }));
        
    } else if (pathname === '/user') {
        // 获取 id 参数
        const userId = query.id;
        
        // 模拟用户数据库
        const users = {
            '1': { id: 1, name: '张三', age: 20, city: '北京' },
            '2': { id: 2, name: '李四', age: 22, city: '上海' },
            '3': { id: 3, name: '王五', age: 21, city: '广州' }
        };
        
        if (userId && users[userId]) {
            // 找到用户，返回用户信息
            res.end(JSON.stringify({
                success: true,
                data: users[userId]
            }));
        } else {
            // 没找到用户
            res.end(JSON.stringify({
                success: false,
                message: `用户 ${userId} 不存在`
            }));
        }
        
    } else {
        // 404
        res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
            success: false,
            message: '接口不存在'
        }));
    }
});

server.listen(3000, () => {
    console.log('服务器运行在 http://localhost:3000');
    console.log('试试这些地址:');
    console.log('  - http://localhost:3000/');
    console.log('  - http://localhost:3000/user?id=1');
    console.log('  - http://localhost:3000/user?id=2');
    console.log('  - http://localhost:3000/user?id=999');
});
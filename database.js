const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, 'my-database.db');
const db = new Database(dbPath);

// 创建 users 表
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        age INTEGER,
        city TEXT
    )
`);

// 检查是否需要插入示例数据
const row = db.prepare("SELECT COUNT(*) as count FROM users").get();
if (row.count === 0) {
    const insert = db.prepare("INSERT INTO users (name, age, city) VALUES (?, ?, ?)");
    insert.run("张三", 20, "北京");
    insert.run("李四", 22, "上海");
    insert.run("王五", 21, "广州");
    console.log("已插入示例数据");
} else {
    console.log(`数据库已有 ${row.count} 条数据`);
}

module.exports = db;
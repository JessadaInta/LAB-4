const http = require('http');
const url = require('url');

const PORT = 3000;

// ข้อมูลจำลอง students array
const students = [
    { id: 1, name: 'สมชาย ใจดี', major: 'วิศวกรรม', year: 3 },
    { id: 2, name: 'สายฝน สุขใจ', major: 'คอมพิวเตอร์', year: 2 },
    { id: 3, name: 'จิรพล ชาญฉลาด', major: 'วิศวกรรม', year: 4 },
    { id: 4, name: 'พิมพ์ใจ สดใส', major: 'คณิตศาสตร์', year: 1 },
];

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const method = req.method;
    
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    
    // Route: GET /
    if (method === 'GET' && pathname === '/') {
        res.statusCode = 200;
        res.end(JSON.stringify({
            message: 'ยินดีต้อนรับสู่ Student API',
            endpoints: [
                'GET /students',
                'GET /students/:id',
                'GET /students/major/:major'
            ]
        }));
        return;
    }

    // Route: GET /students
    if (method === 'GET' && pathname === '/students') {
        res.statusCode = 200;
        res.end(JSON.stringify(students));
        return;
    }

    // Route: GET /students/:id
    const idMatch = pathname.match(/^\/students\/(\d+)$/);
    if (method === 'GET' && idMatch) {
        const id = parseInt(idMatch[1]);
        const student = students.find(s => s.id === id);
        if (student) {
            res.statusCode = 200;
            res.end(JSON.stringify(student));
        } else {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: `ไม่พบข้อมูลนักศึกษาที่ id = ${id}` }));
        }
        return;
    }

    // Route: GET /students/major/:major
    const majorMatch = pathname.match(/^\/students\/major\/(.+)$/);
    if (method === 'GET' && majorMatch) {
        const major = decodeURIComponent(majorMatch[1]);
        const filtered = students.filter(s => s.major === major);
        res.statusCode = filtered.length > 0 ? 200 : 404;
        res.end(JSON.stringify(filtered.length > 0 
            ? filtered 
            : { error: `ไม่พบนักศึกษาที่สาขา ${major}` }
        ));
        return;
    }

    // 404 Not Found
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'ไม่พบหน้า / endpoint ที่ร้องขอ' }));
});

server.listen(PORT, () => {
    console.log(`🌐 HTTP Server running on http://localhost:${PORT}`);
    console.log('Available endpoints:');
    console.log('  GET /');
    console.log('  GET /students');
    console.log('  GET /students/:id');
    console.log('  GET /students/major/:major');
});

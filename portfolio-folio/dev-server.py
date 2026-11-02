# 미리보기용 서버 — 브라우저가 예전 파일을 저장해 두지 않게 매번 새로 받게 한다.
# 실행: 이 폴더에서 python3 dev-server.py  →  http://localhost:4321
import http.server, socketserver

class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(('0.0.0.0', 4321), NoCacheHandler) as server:
    server.serve_forever()

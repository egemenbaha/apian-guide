"""Local static guide and same-origin reverse proxy for the MediaWiki forum."""
import http.client
import json
from pathlib import Path
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlsplit, unquote

ROOT = Path(__file__).resolve().parent.parent
FORUM_ENABLED = json.loads((ROOT / 'src/features.json').read_text()).get('forumEnabled') is True
HOP_HEADERS = {'connection', 'keep-alive', 'transfer-encoding', 'te', 'trailer', 'upgrade', 'proxy-authenticate', 'proxy-authorization'}

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def handle_request(self):
        path = unquote(urlsplit(self.path).path)
        if path == '/forum' or path.startswith('/forum/'):
            if not FORUM_ENABLED:
                return self.send_error(404, 'Forum is disabled')
            return self.proxy_forum()
        # Serve public assets only; .env and repository documents are private.
        if path != '/' and path != '/index.html' and not path.startswith('/src/'):
            return self.send_error(404)
        resolved = (ROOT / path.lstrip('/')).resolve()
        if path.startswith('/src/') and not resolved.is_relative_to(ROOT / 'src'):
            return self.send_error(404)
        if self.command == 'GET':
            return super().do_GET()
        if self.command == 'HEAD':
            return super().do_HEAD()
        self.send_error(405)

    def proxy_forum(self):
        size = int(self.headers.get('Content-Length', 0))
        if size > 2_000_000:
            return self.send_error(413)
        body = self.rfile.read(size) if size else None
        headers = {k: v for k, v in self.headers.items() if k.lower() not in HOP_HEADERS}
        connection = http.client.HTTPConnection('127.0.0.1', 8081, timeout=45)
        try:
            connection.request(self.command, self.path, body, headers)
            response = connection.getresponse()
            data = response.read()
            self.send_response(response.status)
            for key, value in response.getheaders():
                if key.lower() not in HOP_HEADERS | {'content-length'}:
                    self.send_header(key, value)
            self.send_header('Content-Length', str(len(data)))
            self.end_headers()
            if self.command != 'HEAD':
                self.wfile.write(data)
        except (OSError, http.client.HTTPException):
            self.send_error(503, 'Forum is offline. Run npm run forum:up.')
        finally:
            connection.close()

    do_GET = handle_request
    do_HEAD = handle_request
    do_POST = handle_request

if __name__ == '__main__':
    print('Apian Wiki: http://127.0.0.1:5173', flush=True)
    ThreadingHTTPServer(('127.0.0.1', 5173), Handler).serve_forever()

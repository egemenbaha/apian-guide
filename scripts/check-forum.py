"""Exercise DiscussionTools against the local service; remove the temporary page."""
import http.cookiejar
import json
from pathlib import Path
import urllib.parse
import urllib.request
import uuid

API = 'http://127.0.0.1:5173/forum/api.php'
client = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()))

def request(params, post=False):
    data = urllib.parse.urlencode({'format': 'json', **params}).encode()
    req = urllib.request.Request(API if post else API + '?' + data.decode(), data if post else None)
    result = json.load(client.open(req, timeout=45))
    if 'error' in result:
        raise RuntimeError(result['error'])
    return result

password = next(line.split('=', 1)[1] for line in (Path(__file__).resolve().parent.parent / '.env').read_text().splitlines() if line.startswith('FORUM_ADMIN_PASSWORD='))
rights = request({'action': 'query', 'meta': 'userinfo', 'uiprop': 'rights'})['query']['userinfo']['rights']
assert 'edit' not in rights, 'Guests must not have edit rights'
token = request({'action': 'query', 'meta': 'tokens', 'type': 'login'})['query']['tokens']['logintoken']
login = request({'action': 'login', 'lgname': 'ForumAdmin', 'lgpassword': password, 'lgtoken': token}, True)
assert login['login']['result'] == 'Success', 'Administrator login failed'
csrf = request({'action': 'query', 'meta': 'tokens'})['query']['tokens']['csrftoken']
page = 'Talk:Integration check ' + uuid.uuid4().hex
created = False
try:
    request({'action': 'discussiontoolsedit', 'paction': 'addtopic', 'page': page, 'token': csrf, 'sectiontitle': 'Integration check', 'wikitext': 'Temporary discussion integration check.'}, True)
    created = True
    info = request({'action': 'discussiontoolspageinfo', 'page': page, 'prop': 'threaditemshtml'})
    first = info['discussiontoolspageinfo']['threaditemshtml'][0]['replies'][0]
    request({'action': 'discussiontoolsedit', 'paction': 'addcomment', 'page': page, 'token': csrf, 'commentid': first['id'], 'wikitext': 'Temporary reply integration check.'}, True)
    info = request({'action': 'discussiontoolspageinfo', 'page': page, 'prop': 'threaditemshtml'})
    text = json.dumps(info)
    assert 'Temporary discussion integration check.' in text
    assert 'Temporary reply integration check.' in text
    print('PASS: guest restrictions, login, topic creation, reply, and persisted reads.')
finally:
    if created:
        request({'action': 'delete', 'title': page, 'token': csrf, 'reason': 'Remove temporary integration test'}, True)
        print('Temporary test page removed.')

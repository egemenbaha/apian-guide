#!/usr/bin/env bash
set -euo pipefail
cd /var/www/html
mkdir -p /var/lib/mediawiki
if [ ! -f /var/lib/mediawiki/LocalSettings.php ]; then
  php maintenance/run.php install \
    --dbtype sqlite --dbpath /var/lib/mediawiki --dbname apian_forum \
    --server http://127.0.0.1:5173 --scriptpath /forum --lang tr \
    --confpath /var/lib/mediawiki --pass "$FORUM_ADMIN_PASSWORD" \
    'Apian Guide Forum' ForumAdmin
  chown -R www-data:www-data /var/lib/mediawiki
fi
cp /opt/apian/LocalSettings.php /var/www/html/LocalSettings.php
php maintenance/run.php update --quick
if [ ! -f /var/lib/mediawiki/.seeded ]; then
  printf '%s\n' '__NEWSECTIONLINK__' 'Apian sakinlerinin bilgi paylaşımı ve rehbere katkıları için tartışma alanı.' '' 'Konu açmak veya yanıt yazmak için hesabınla giriş yap. Kişisel bilgileri paylaşma.' '' '[http://127.0.0.1:5173/ Apian Guide ana sayfasına dön]' | php maintenance/run.php edit --user ForumAdmin --summary 'Forum başlangıç sayfası' 'Talk:Forum'
  touch /var/lib/mediawiki/.seeded
fi
if [ ! -f /var/lib/mediawiki/.navigation-seeded ]; then
  printf '%s\n' 'Tartışma:Forum' | php maintenance/run.php edit --user ForumAdmin --summary 'Forum ana sayfası' 'MediaWiki:Mainpage'
  printf '%s\n' '* navigation' '** http://127.0.0.1:5173/|Apian Guide' '** Talk:Forum|Topluluk forumu' '** Special:RecentChanges|Son değişiklikler' | php maintenance/run.php edit --user ForumAdmin --summary 'Rehber gezinmesi' 'MediaWiki:Sidebar'
  touch /var/lib/mediawiki/.navigation-seeded
fi
chown -R www-data:www-data /var/lib/mediawiki
exec docker-php-entrypoint apache2-foreground

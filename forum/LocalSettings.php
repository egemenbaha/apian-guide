<?php
// Generated installer configuration and database are stored in the Docker volume.
if (!file_exists('/var/lib/mediawiki/LocalSettings.php')) {
    return;
}
require '/var/lib/mediawiki/LocalSettings.php';
$wgSitename = 'Apian Guide Forum';
$wgDefaultSkin = 'vector-2022';
$wgLogos = [ '1x' => '/src/forum-logo.svg', 'icon' => '/src/forum-logo.svg' ];
$wgLocaltimezone = 'Europe/Berlin';
$wgFragmentMode = [ 'html5' ];
$wgEnableUploads = false;
$wgSiteNotice = '[http://127.0.0.1:5173/ Apian Guide ana sayfası] · [[Special:UserLogin|Giriş yap]] · [[Special:CreateAccount|Hesap oluştur]]';
$wgGroupPermissions['*']['edit'] = false;
$wgGroupPermissions['*']['createaccount'] = true;
$wgGroupPermissions['user']['edit'] = true;
wfLoadExtension( 'VisualEditor' );
wfLoadExtension( 'Linter' );
wfLoadExtension( 'DiscussionTools' );
$wgDefaultUserOptions['discussiontools-replytool'] = 1;
$wgDefaultUserOptions['discussiontools-newtopictool'] = 1;
$wgDefaultUserOptions['discussiontools-visualenhancements'] = 1;

# Apian Guide

Apian sakinleri ve yeni taşınacak öğrenciler için Türkçe bilgi ve sıkça sorulan sorular projesi.

[Proje açıklaması ve 58 soruluk FAQ](PROJECT_DESCRIPTION.md) · [Tamamlanacak sorular](PROJECT_DESCRIPTION.md#acik-sorular)

Arda’nın Wikipedia tarzı düzeni korunarak 58 soruluk FAQ, kaynak bağlantıları ve açık sorular 11 konu başlığına entegre edildi. İçerik `PROJECT_DESCRIPTION.md` dosyasından üretilir; cevapları güncellemek için bu dosyayı düzenle.

Açık/koyu mod düğmesi üst çubukta masaüstü ve telefonda görünür. Tema tercihi tarayıcıda hatırlanır ve sağdaki görünüm ayarlarıyla eşzamanlı çalışır.

## Yerel geliştirme

Node.js 22+ ve Python 3 gerektirir. Haricî paket kurulumu gerekmez.

```sh
npm run dev
```

Tarayıcıda http://127.0.0.1:5173 adresini aç. Statik yayın dosyalarını üretmek için:

```sh
npm run build
```

Çıktı `dist/` klasörüne yazılır; herhangi bir statik sunucuda yayımlanabilir. Başlıklar `src/topics.js`, gezinme ve arama `src/app.js`, tasarım `src/styles.css` içinde tutulur. Konu bağlantıları URL hash kullanır; sunucuda özel yönlendirme gerekmez. Arama konu ve alt bölüm başlıklarının yanında soruları ve cevapları da tarar; Türkçe karakterleri destekler ve sonuçlar ilgili soruya gider. Rehberin forumu ayrı bir MediaWiki servisi ve `/forum/` proxy yönlendirmesi gerektirir; statik yayın tek başına forumu çalıştırmaz.

## İçerik güncelleme ve doğrulama

`npm run dev` ve `npm run build`, Markdown kaynağından `src/faq-data.js` dosyasını otomatik üretir. Üretilen dosya Git'e eklenmez. İçerik değişikliğinden sonra çalışan önizlemeyi yeniden başlat veya `node scripts/generate-faq.mjs` çalıştırıp sayfayı yenile.

Yeni soruları numara sırasını koruyarak ekle ve `src/topics.js` içindeki `questionIds` eşlemesine yerleştir. Her soru tam olarak bir bölüme atanmalıdır. Açık başlıklar tamamlandığında Markdown listesindeki kutuyu işaretle; cevapları ve güncelleme tarihini de aynı dosyada düzenle. Site yalnızca işaretlenmemiş açık başlıkları gösterir.

```sh
npm test
npm run build
```

Testler içerik aktarımını, kaynak bağlantılarının korunmasını, konu eşlemelerini, Türkçe aramayı ve güvenli Markdown gösterimini kontrol eder. `vercel.json`, Vercel için `npm run build` komutunu ve `dist/` yayın klasörünü tanımlar. Statik rehber için sunucu, veri tabanı veya ortam değişkeni gerekmez; forumun gereksinimleri aşağıdadır.

## Topluluk forumu

Forum şu anda tamamen kapalıdır. `src/features.json` içindeki `forumEnabled: false` ayarı forum bağlantılarını gizler, yerel `/forum/` rotasını 404 ile kapatır ve `npm run forum:up` komutunun servisi başlatmasını engeller. Docker servisi ayrıca isteğe bağlı `forum` profiline bağlıdır. Veritabanı, hesaplar ve kurulum dosyaları korunur.

Yeniden açmak için `src/features.json` içindeki `forumEnabled` değerini `true` yap, aşağıdaki komutları çalıştır ve çalışan yerel sunucuyu yeniden başlat. Statik yayında gezinmenin güncellenmesi için yeniden build/deploy gerekir. Mevcut Docker volume'ünü ve `.env` dosyasını koru.

Forum, MediaWiki 1.43 ve Wikimedia'nın [DiscussionTools](https://www.mediawiki.org/wiki/Extension:DiscussionTools) eklentisini kullanır. Yeni konular, yanıtlar ve kullanıcı hesapları MediaWiki tarafından yönetilir. Okuma herkese açıktır; yazmak için giriş gerekir.

Docker çalışırken:

```sh
npm run forum:up
npm run dev
```

Rehberdeki **Tartışma** veya **Topluluk forumu** bağlantısını aç: http://127.0.0.1:5173/forum/index.php?title=Talk:Forum

İlk başlangıçta `ForumAdmin` hesabı oluşturulur. Rastgele üretilen parolası yalnızca Git tarafından yok sayılan yerel `.env` dosyasındadır; dosyayı paylaşma. İstersen forumdan normal bir kullanıcı hesabı oluşturabilirsin. Mevcut veritabanında yönetici parolasını değiştirmek için MediaWiki'nin parola değiştirme araçlarını kullan; `.env` dosyasını değiştirmek mevcut hesabın parolasını değiştirmez.

`compose.yaml` forumu yalnızca yerel `127.0.0.1:8081` adresine bağlar. `scripts/dev.py`, rehberi sunar ve `/forum/` isteklerini bu servise iletir. SQLite veritabanı ve MediaWiki'nin ürettiği ayarlar `apian-guide_forum-data` Docker volume'ünde saklanır. `npm run forum:down` servisi durdurur ve verileri korur. `docker compose down -v` forum verilerini siler; yedeksiz çalıştırma.

Bu kurulum yerel kullanım içindir. Üretime taşırken HTTPS, gerçek alan adı, aynı origin altında `/forum/` proxy yönlendirmesi, posta gönderimi, moderasyon ve volume yedeği ayrıca yapılandırılmalıdır. Alan adı şu an `forum/start.sh` ve `forum/LocalSettings.php` içinde yereldir; mevcut veritabanının üretilen `LocalSettings.php` ayarları da yeni adrese uyarlanmalıdır.

Forum entegrasyonunu doğrulamak için `python3 scripts/check-forum.py` çalıştır. Kontrol geçici bir tartışma sayfası açar, yanıt ekler, kayıtları okur ve sayfayı siler.

## Kodda gezinme

[agent.md](agent.md), dosya haritası ve doğrulama adımlarını içerir. `AGENTS.md` bu rehberin ajanlar tarafından bulunmasını sağlar.

## İçerik kapsamı

- Yerleşme ve oda donanımı
- İnternet ve çamaşırhane
- Anahtar, ortak alanlar ve kargo
- Arızalar ve günlük yaşam
- Çıkış, boya ve depozito
- Ödemeler ve resmî işlemlere yönlendirme

## İçerik ilkeleri

- Apian 1 ve Apian 2 bilgileri ayrı tutulur.
- Resmî kaynak, yönetimden aktarılan bilgi, kişisel deneyim ve belirsiz bilgi birbirinden ayrılır.
- Tarihler ve kaynaklar korunur; eski fiyat ve saatler güncel bilgi gibi sunulmaz.
- Çelişen cevaplar, doğrulanmış bir sonuç bulunmadan birleştirilmez.
- Cevaplar samimi ve anlaşılır Türkçeyle yazılır. Eksik noktalar araştırılır veya kullanıcıya sorulur; doğrulanana kadar açık bırakılır.
- Ham WhatsApp dökümleri, kişi–oda eşleştirmeleri, telefon numaraları ve özel grup davet bağlantıları depoya eklenmez.
- Kişisel sağlık ve hukuki olaylar yayımlanacak içeriğe taşınmaz.
- Bu proje yurt yönetiminin resmî yayını değildir.

## Sonraki adım

Proje açıklamasındaki dört açık soru grubu, kullanıcının yanıtları geldiğinde tamamlanacak. Apian 1 ve Apian 2 ayrımı, kaynak bağlantıları ve tarihli deneyimlerin bağlamı korunacak.

## Açık kaynak ve katkı

Apian Guide [MIT lisansı](LICENSE) altında açık kaynaktır. Herkes fork oluşturup değişiklik önerebilir. `@egemenbaha` ve `@ardatas` doğrudan push ve merge yapabilir; iki hesap ana dal kurallarından muaftır. Diğer katkıcılar `main` için pull request açar; birleştirme bu iki proje sorumlusundan birinin onayını ve başarılı `Test and build` kontrolünü gerektirir.

Katkı adımları, içerik ilkeleri ve ana dal kuralları için [CONTRIBUTING.md](CONTRIBUTING.md) dosyasına bak. Dış kaynak bağlantıları, kaynakların kendi lisans ve kullanım koşullarını değiştirmez.

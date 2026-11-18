# Apian Wiki

Apian Wiki, Münih / Unterföhring’deki Apian öğrenci yurtlarında yaşayan veya buraya taşınmayı planlayan Türk öğrenciler için hazırlanmış, topluluk katkılarıyla geliştirilen bağımsız bir bilgi rehberidir. Yerleşme, oda donanımı, günlük yaşam, ulaşım, çevredeki hizmetler ve resmî işlemler hakkında pratik bilgileri tek yerde toplar.

İçerik, sakinlerin deneyimleri ve ölçümleri ile bağlantı verilen kaynaklardan derlenir. Proje, Türkçe arama ve konu sayfaları olan açık kaynaklı bir statik web sitesidir.

**Rehberi aç: [apianwiki.space](https://apianwiki.space/)**

## Bağımsızlık, bilgi doğruluğu ve sorumluluk

**Apian Wiki, yurt yönetiminin, Studierendenwerk’in, üniversitelerin veya kamu kurumlarının resmî yayını değildir; bu kurumlar adına açıklama yapmaz.** Rehberdeki bilgiler genel bilgilendirme amaçlıdır. Kira sözleşmesinin, yurt kurallarının, yetkili kurumların açıklamalarının veya hukuki, mali ve tıbbi danışmanlığın yerine geçmez.

**Bilgilerin doğruluğu, eksiksizliği, güncelliği veya belirli bir ihtiyaca uygunluğu garanti edilmez.** Hatalar, eksikler ve güncelliğini yitirmiş bilgiler bulunabilir. Özellikle ücretler, çalışma saatleri, başvuru tarihleri ve uygulamalar değişebilir. Bir işlem yapmadan veya masrafa girmeden önce ilgili bilgiyi yurt yönetiminden, hizmet sağlayıcısından ya da yetkili kurumdan doğrula.

**Yürürlükteki hukukun izin verdiği ölçüde, proje sahipleri, yöneticileri ve katkıda bulunanlar, rehberdeki hata veya eksikliklerden ya da bilgilere güvenilerek yapılan işlemlerden doğan zararlar için sorumluluk kabul etmez.** Bu açıklama, kanunen kaldırılamayan veya sınırlandırılamayan sorumlulukları ortadan kaldırmaz. Kasıt, ağır ihmal ve yaşam, beden veya sağlık zararları bakımından zorunlu yasal sorumluluklar saklıdır. İlgili yasal sınırlar için [BGB § 276](https://www.gesetze-im-internet.de/bgb/__276.html) ve [BGB § 309 no. 7](https://www.gesetze-im-internet.de/bgb/__309.html) hükümlerine bakılabilir.

Dış bağlantılar bilgiye ulaşmayı kolaylaştırmak için verilir; bağlantı verilmesi, ilgili hizmetin onaylandığı veya içeriğinin doğruluğunun garanti edildiği anlamına gelmez. Üçüncü taraf sitelerin içerikleri ve koşulları değişebilir. Bir hata fark edersen ilgili cevaptaki **Düzeltme öner** bağlantısını veya [GitHub Issues](https://github.com/egemenbaha/apian-guide/issues) bölümünü kullanabilirsin.

## Yayın ve proje yapısı

Ana alan adı `apianwiki.space`, Vercel’deki `ApianS / apian-guide` projesinin Production ortamına bağlıdır. Rehber içi bağlantılar, GitHub bilgi düzeltme taslakları ve sayfanın canonical/Open Graph adresi bu alan adını kullanır. Alan adı ayarları Vercel proje panelinden yönetilir; DNS veya sertifika bilgileri kaynak kodda tutulmaz.

`www.apianwiki.space` ve önceki `apian-guide.vercel.app` adresi, Vercel üzerinden **308 kalıcı yönlendirmeyle** ana domaine gider. Eski soru ve bölüm bağlantıları aynı hash rotalarını kullanmaya devam eder.

Rehberin içerik kaynağı [PROJECT_DESCRIPTION.md](PROJECT_DESCRIPTION.md) dosyasıdır. Konu başlıkları ve soru eşlemeleri `src/topics.js` içinde tutulur. Üretilen FAQ verisi ve yayın çıktısı doğrudan düzenlenmez.

## Ziyaret istatistikleri

Umami Cloud'un ücretsiz Hobby planında ziyaretçi ve görüntüleme sayıları, en çok okunan konular, yönlendiren siteler, ülkeler ve cihazlar izlenebilir. Kurulum için:

1. [Umami Cloud](https://cloud.umami.is/) hesabında Hobby planını seç. **Websites** bölümünde `apianwiki.space` alan adı için **Apian Wiki** sitesini ekle veya mevcut kaydı aç. Sitenin **Website ID** değerini kopyala.
2. Vercel’de **ApianS → apian-guide → Settings → Environment Variables** bölümüne git. **Production** için `UMAMI_WEBSITE_ID` değişkenini bu herkese açık kimliğe ayarla ve güncel `main` sürümünü yeniden dağıt. Kimlik tanımlanana kadar ölçüm kapalıdır.
3. `https://apianwiki.space/` adresini aç, ardından Çamaşırhane konusuna ve konu içindeki bir soruya git. Umami’de **Realtime** bölümünde ana sayfa (`/`) ve konu (`/konu/camasirhane`) için birer görüntüleme beklenir. Aynı konudaki soruya geçmek yeni görüntüleme oluşturmaz.
4. Aramadan bir sonuç aç. **Events** bölümündeki `search-result-opened` sayacı bu seçimi gösterir. Arama metni, soru numarası ve taşınma listesi seçimleri gönderilmez. Ölçüm yalnızca ana alan adında çalışır ve tarayıcının Do Not Track veya Global Privacy Control tercihini dikkate alır.

Günlük veya haftalık değişimi görmek için Umami’de **Apian Wiki** sitesini açıp tarih aralığını seç. **Pages** konu görüntülemelerini, **Referrers** dış trafik kaynaklarını gösterir. Ölçümü kapatmak için Vercel’de değişkeni kaldırıp yeniden dağıt.

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

Yeni soruları numara sırasını koruyarak ekle ve `src/topics.js` içindeki `questionIds` eşlemesine yerleştir. Her sorunun bir ana bölümü vardır. Bir yanıtı başka bir konunun başında da göstermek için numarasını o konunun `introQuestionId` alanına yazabilirsin. Açık başlıklar tamamlandığında Markdown listesindeki kutuyu işaretle; cevapları ve güncelleme tarihini de aynı dosyada düzenle. Site yalnızca işaretlenmemiş açık başlıkları gösterir.

Ölçü tablosu da Markdown kaynağında tutulur; ölçü değişirse ilgili tekil cevabı ve tablo satırını birlikte güncelle. Tabloların her satırı `|` ile başlar ve biter; başlıktan sonraki ayırıcı satırda her sütun için `---` kullanılır. Tabloyu önceki ve sonraki paragraflardan boş satırla ayır. Hücrelerde kalın/italik yazı ve güvenli bağlantılar desteklenir; ham HTML çalıştırılmaz.

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

## İçerik ilkeleri

- Apian 1 ve Apian 2 bilgileri ayrı tutulur.
- Bilgiler doğrudan anlatılır; tarih, bina ve odaya bağlı koşullar açıkça belirtilir. Henüz netleşmeyen noktalar açık bırakılır.
- Kaynak bağlantıları ve anlam taşıyan tarihler (tatil günü veya geçmiş ücret örneği gibi) korunur; eski bilgiler güncel gibi sunulmaz.
- Cevaplara paylaşım/kontrol tarihi ve genel değişkenlik dipnotları eklenmez. Ölçüler ilgili bina adıyla doğrudan verilir; henüz ölçülmeyen bina açıkça belirtilir.
- Çelişen cevaplar, doğrulanmış bir sonuç bulunmadan birleştirilmez.
- Cevaplar samimi ve anlaşılır Türkçeyle yazılır. Eksik noktalar araştırılır veya kullanıcıya sorulur; doğrulanana kadar açık bırakılır.
- Ham WhatsApp dökümleri, kişi–oda eşleştirmeleri, telefon numaraları ve özel grup davet bağlantıları depoya eklenmez.
- Kişisel sağlık ve hukuki olaylar yayımlanacak içeriğe taşınmaz.
- Bu proje yurt yönetiminin resmî yayını değildir.

## Nasıl katkıda bulunabilirsin?

Katkı vermek için kod bilmen gerekmiyor. Yanlış bir bilgiyi düzeltebilir, eksik bir konuyu önerebilir veya sitenin geliştirilmesine yardımcı olabilirsin.

### Bilgi düzeltmek veya konu önermek

1. Rehberde ilgili cevabın altındaki **Düzeltme öner** bağlantısını kullan veya [GitHub bildirimleri](https://github.com/egemenbaha/apian-guide/issues) bölümünde yeni bir bildirim aç. Göndermek için GitHub hesabınla giriş yapman gerekir.
2. Hangi sayfa veya cevabı kastettiğini, neyin yanlış ya da eksik olduğunu ve önerdiğin değişikliği yaz. Yeni bir konu öneriyorsan hangi sorunun yanıtlanmasını istediğini belirt.
3. Varsa resmî kaynak bağlantısını ekle. Kendi deneyimini veya ölçümünü paylaşıyorsan hangi binayla ilgili olduğunu ve bilginin hangi döneme ait olduğunu belirt.

Öneriler proje sorumluları tarafından incelenir; gönderilen bilgiler otomatik olarak rehbere eklenmez. Bildirimler herkese açıktır. Özel yazışma, kişisel iletişim bilgisi, kişi–oda eşleştirmesi, parola veya gizli anahtar paylaşma.

### İçerik veya kod değişikliği göndermek

1. [Depoyu](https://github.com/egemenbaha/apian-guide) kendi GitHub hesabına çatalla (**Fork**), bilgisayarına kopyala ve değişikliğin için ayrı bir dal oluştur.
2. Soru ve cevapları `PROJECT_DESCRIPTION.md` içinde düzenle. Yeni bir soru ekliyorsan `src/topics.js` dosyasındaki konu eşlemesini de güncelle. Otomatik üretilen `src/faq-data.js` ve `dist/` dosyalarını düzenleme veya gönderme.
3. Türkçe anlatımı, mevcut wiki tasarımını ve Apian 1 / Apian 2 ayrımını koru. Yalnızca paylaşma hakkına sahip olduğun içerikleri kullan.
4. `npm test` ve `npm run build` komutlarını çalıştır. Arayüz değişikliği yaptıysan `npm run dev` ile siteyi açıp masaüstü ve mobil görünümü kontrol et.
5. Değişikliklerini kendi dalına kaydedip gönder ve bu deponun `main` dalına bir birleştirme isteği (**Pull request**) aç. Neyi değiştirdiğini ve nasıl kontrol ettiğini kısaca yaz; görsel değişikliklerde ekran görüntüsü ekle.

Depoya yazma yetkisi bulunan `@ardatas` ve `@egemenbaha`, güncel `main` değişikliklerini aldıktan ve kontrolleri tamamladıktan sonra doğrudan ana dala gönderebilir. Ayrıntılar için [katkı rehberine](CONTRIBUTING.md) bak.

## Açık kaynak ve lisans

Kitap ve onay işaretli logo, [AnimateIcons](https://github.com/Avijit07x/animateicons) / Avijit Dey’in Book Open Check animasyonundan ve [Lucide](https://github.com/lucide-icons/lucide) ikonundan uyarlanmıştır. Başlıktaki SVG, CSS ile üzerine gelindiğinde veya klavyeyle odaklandığında bir kez oynar; hareket azaltma ayarında sabit kalır. Ek çalışma zamanı bağımlılığı gerektirmez. Sekme simgesi ve isteğe bağlı forum aynı statik SVG’yi kullanır. MIT/ISC atıfları ve lisans metinleri [src/icon-licenses.txt](src/icon-licenses.txt) içinde, yayın çıktısına da dahil edilir.

Apian Wiki [MIT lisansı](LICENSE) altında açık kaynaktır. `@egemenbaha` ve `@ardatas` değişiklikleri doğrudan `main` dalına gönderir; PR açma ve inceleme onayı zorunluluğu yoktur. Otomatik inceleme talepleri kaldırıldı. `Test and build` her gönderimde çalışır, gönderimi engellemez. Yazma yetkisi olmayan katkıcılar fork ve PR üzerinden değişiklik önerebilir.

Katkı adımları, içerik ilkeleri ve ana dal kuralları için [CONTRIBUTING.md](CONTRIBUTING.md) dosyasına bak. Dış kaynak bağlantıları, kaynakların kendi lisans ve kullanım koşullarını değiştirmez.

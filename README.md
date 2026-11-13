# Apian Wiki

Apian sakinleri ve yeni taşınacak Türk öğrenciler için bilgi rehberi.

**Rehberi aç: [apianwiki.space](https://apianwiki.space/)**

Ana alan adı `apianwiki.space`, Vercel’deki `ApianS / apian-guide` projesinin Production ortamına bağlıdır. Rehber içi bağlantılar, GitHub bilgi düzeltme taslakları ve sayfanın canonical/Open Graph adresi bu alan adını kullanır. Alan adı ayarları Vercel proje panelinden yönetilir; DNS veya sertifika bilgileri kaynak kodda tutulmaz.

`www.apianwiki.space` ve önceki `apian-guide.vercel.app` adresi, Vercel üzerinden **308 kalıcı yönlendirmeyle** ana domaine gider. Eski soru ve bölüm bağlantıları aynı hash rotalarını kullanmaya devam eder.

[Proje açıklaması ve 164 soruluk FAQ](PROJECT_DESCRIPTION.md) · [Tamamlanacak sorular](PROJECT_DESCRIPTION.md#acik-sorular)

Arda’nın Wikipedia tarzı düzeni korunarak 164 soruluk FAQ, kaynak bağlantıları ve açık sorular 29 konu başlığına entegre edildi. İçerik `PROJECT_DESCRIPTION.md` dosyasından üretilir; cevapları güncellemek için bu dosyayı düzenle.

Atatürk anma şeridi, tüm konu sayfalarında site başlığının üstünde tam genişlikte görünür: “Mustafa Kemal Atatürk · 1881–1938 — Cumhuriyetimizin kurucusunu saygı, özlem ve minnetle anıyoruz.” Metin `index.html` içinde, kayan görünüm `src/styles.css` içindedir. `src/app.js` kesintisiz döngü için ekran okuyuculardan gizlenen bir kopya oluşturur ve duraklat/sürdür düğmesini bağlar. Şerit açık/koyu temada okunur; azaltılmış hareket tercihinde veya JavaScript kapalıyken metin sabit ve satırlara bölünmüş gösterilir.

[Atık ve geri dönüşüm](https://apianwiki.space/#geri-donusum), “Günlük yaşam” altında yatak/şilte, elektronik eşya ve pil/batarya teslimini ayrı başlıklarda anlatır. Wertstoffhof Unterföhring ile Feringastraße ve Maria-Nindl-Platz dm şubeleri adres, saat, açılır harita ve yol tarifiyle gösterilir. Bakım ve alışveriş yanıtlarından da erişilir. Harita kartları, koordinat içeren yer bağlantılarının yanında `https://www.google.com/maps/search/?api=1&query=...` biçimindeki tam adres bağlantılarını destekler.

[Böcekler ve korunma](https://apianwiki.space/#bocekler), “Günlük yaşam” altında sonbaharda içeri giren türleri, sinekliği, silverfish/kâğıt böceği ayrımını, ev çıyanını, tuzakları ve Apian’a bildirim adımlarını anlatır. Bakım ve sineklik yanıtlarından da erişilir. Türler fotoğrafsız kesinleştirilmez; genel bölge bilgisi binada doğrulanmış bir istila gibi sunulmaz.

Bu bölümde beş türün büyütülebilir örnek fotoğrafları bulunur; fotoğraflar Apian'da çekilmiş değildir. Gümüş böceği ve kâğıt böceği geniş ekranda yan yana, telefonda alt alta gösterilir. Görseller `src/images/bugs/` içinde saklanır; [fotoğraf kaynakları, ayrı lisansları ve yapılan boyut/biçim değişiklikleri](src/images/bugs/ATTRIBUTION.txt) projenin MIT lisansından ayrıdır. FAQ içinde aynı paragraftaki `![açıklama](src/images/bugs/dosya.webp)` satırları ve altlarındaki kaynaklı açıklamalar fotoğraf galerisi oluşturur. Görsel yolları yalnızca yerel `src/images/` altındaki güvenli dosya adlarını kabul eder.

Arama soru, cevap ve bölüm başlıklarını ilgililiğe göre sıralar; Türkçe karakterleri, bazı Türkçe ekleri, yaygın Türkçe/Almanca/İngilizce karşılıkları ve küçük yazım hatalarını destekler. Örneğin `wifi çalışmıyor`, `pazar günü nereler açık`, `Apian2 sineklik`, `Kaution` veya `sineklki` yazabilirsin. Sonuçlarda bölüm adı, cevaptan kısa alıntı ve eşleşen kelimeler görünür. İlk sekiz sonuçtan sonra tümünü açabilirsin; ↑/↓ ile gezin, Enter ile aç, Escape ile kapat. Aramalar kaydedilmez veya bir servise gönderilmez; yeni cevap üretilmez, rehberdeki metinler aranır.

Arama mantığı ve sözcük karşılıkları `src/search.js`, arayüzü `src/search-ui.js` içindedir. Dizin sayfa yüklenirken bir kez hazırlanır. Kısa banka adları ve sayılar yaklaşık eşleştirilmez; yazım toleransı yalnızca doğrudan eşleşme bulunmayan kelimelerde uygulanır. Davranış ve sıralama örnekleri `tests/search.test.mjs` ile kontrol edilir.

[Orterer içecek marketi](https://apianwiki.space/#alisveris/soru-132) ve [Kistenpfennig fırını](https://apianwiki.space/#alisveris/soru-133), “Eczane, market ve fırın” bölümünde adres, açılış saatleri, telefon ve yürüyüş rotasıyla yer alır. Kistenpfennig’in pazar saatleri, pazar alışverişi yanıtlarında da gösterilir.

[Yakındaki dm şubeleri](https://apianwiki.space/#alisveris/soru-131), alışveriş bölümünde Feringastraße 4 ile Maria-Nindl-Platz 2’yi adres, saat ve yol tarifleriyle karşılaştırır. Maria-Nindl-Platz şubesi, [para çekme yanıtında](https://apianwiki.space/#bankalar/soru-92) da Feringastraße’ye alternatif olarak gösterilir.

[Türk Konsolosluğu, Eğitim Ataşeliği ve askerlik](https://apianwiki.space/#resmi-islemler/bolum-7) bölümünde iletişim/ulaşım, yurt dışı adres beyanı, özel öğrenci dosyası belgeleri ve tecil takibi bulunur. Adres beyanı için 2023 tarihli duyuruya, güncel randevu açıklamasına ve kabul saatini sorabileceğin telefon numarasına ulaşabilirsin. Öğrenci fişi, tamamlanmış askerlik ertelemesi olarak sunulmaz.

[Fotokopi, çıktı ve tarama](https://apianwiki.space/#resmi-islemler/soru-126), Feringastraße 4 ve Maria-Nindl-Platz 2’deki dm şubelerini, dosya hazırlığını, A4 ücretlerini ve Feringastraße şubesinin ciltleme seçeneğini anlatır. [Biyometrik fotoğraf yanıtında](https://apianwiki.space/#resmi-islemler/soru-50) her iki şubenin adresini ve Landkreis München’in oturum kartı için istediği fotoğrafın koşullarını bulabilirsin.

[Üyelikler ve abonelikler](https://apianwiki.space/#abonelikler), Deutschlandticket’in standart/öğrenci tarifelerini ve iptal adımlarını; Clever fit, Cosimawellenbad, ZHS, Scheck Club ve belediyenin spor seçeneklerini içerir. Fiyatlar ve koşullar ilgili yanıtın resmî kaynak bağlantılarıyla birlikte tutulur. ZHS dönemlik katkı payı ile kurs ücreti, havuz girişi ile sauna bileti ayrı anlatılır. Fiyat değişikliklerinin yürürlük tarihleri içerikte korunur.

Apian 2’de ölçülüp paylaşılan sineklik, mutfak, mobilya, banyo, kapı, kalorifer ve perde ölçüleri “Odada neler var?” bölümündedir. [Apian 2 oda ölçüleri](https://apianwiki.space/#apian-2-oda-olculeri) sayfası bunları 8 priz ve buzdolabının arkasındaki 2 ek priz olmak üzere toplam 10 priz bilgisiyle birlikte tek tabloda toplar. Apian 1’de henüz ölçüm yapılmadığı açıkça belirtilir. Perde takılacak alanın eni, tek bir perdenin kumaş eni olarak yorumlanmaz.

Resmî tatiller bölümünde 2026 sonundaki kapanışlar ve 2027 takvimi yer alır. Marketlerin pazar/tatil saatleri ve Unterföhring’in güncel nöbetçi eczane listesine bağlantı ilgili konulardadır; değişen nöbet listeleri siteye sabit olarak kopyalanmaz. [Bakım bölümünde](https://apianwiki.space/#bakim/soru-97) tamir ekibi gelmeden önce ofisle neleri netleştirebileceğini bulabilirsin.

Açık/koyu mod düğmesi üst çubukta masaüstü ve telefonda görünür. Tema tercihi tarayıcıda hatırlanır ve sağdaki görünüm ayarlarıyla eşzamanlı çalışır. Rathaus konum bağlantısı açılır harita ve yol tarifiyle gösterilir; acil yardım numaraları telefonda aranabilir bağlantılardır.

Yenilemede beyaz parlama olmaması için `index.html` içindeki küçük tema başlangıcı, kaydedilmiş tercihi stil dosyası ve uygulama yüklenmeden önce uygular. İlk arka plan ve tarayıcı tema rengi de burada belirlenir; uygulama bu seçimi devralır. Depolama engellendiğinde veya kayıt geçersizse açık tema kullanılır, tema düğmesi çalışmaya devam eder.

[Studierendenwerk devlet yurtları](https://apianwiki.space/#studierendenwerk), başvuru koşullarını, dönemlere göre başlangıç tarihlerini, bekleme süresi ve kira PDF’ini, öğrenci belgesi yükleme tarihlerini ve yer teklifinin takibini özetler.

## Taşınma listesi ve bilgi düzeltmeleri

[Yanımda ne getireyim?](https://apianwiki.space/#tasinma-listesi) sayfasında “Yanında getir”, “Odada bulunanlar” ve “Yerleştikten sonra al” grupları bulunur. Liste maddeleri FAQ 113–115 içindeki Markdown `- [ ]` satırlarından üretilir. İşaretler yalnızca ziyaretçinin tarayıcısında saklanır; depolama engellenirse aynı oturumda çalışır ve durum açıkça belirtilir. Kimlikler soru numarası ve madde metninden oluşur; madde metni değişirse o maddenin işareti sıfırlanır. “İşaretleri temizle” mevcut listeyi sıfırlar.

Her FAQ yanıtındaki **Düzeltme öner** alanı, ilgili sorunun bağlantısını ve başlığını içeren bir GitHub öneri taslağı açar. Ziyaretçi GitHub hesabıyla giriş yapıp açıklamasını kendisi gönderir. Öneriler herkese açıktır ve Egemen veya Arda tarafından incelenip içerik düzenlenerek rehbere alınır; otomatik içerik değişikliği veya otomatik gönderim yapılmaz. Gönderiler [deponun Issues bölümünde](https://github.com/egemenbaha/apian-guide/issues) takip edilir. Bu akış forumu etkinleştirmez ve sunucuda gizli anahtar gerektirmez.

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

## İçerik kapsamı

- Yerleşme ve odadaki eşyalar
- Acil yardım numaraları, yakındaki Pharao eczanesi ve pazar günü açık marketler
- [İlk doktor randevusu](https://apianwiki.space/#doktor-randevusu), Unterföhring’de aile ve diş hekimleri, Türkçe seçenekler ve ilk ziyaret için belgeler
- İnternet ve çamaşırhane
- Anahtar, ortak alanlar ve kargo
- Arızalar ve günlük yaşam
- Çıkış, boya ve depozito
- Ödemeler ve resmî işlemlere yönlendirme
- Feringastraße marketleri, eczaneler ve DHL Packstation
- Yakındaki duraklar; TUM Garching, TUM Stammgelände ve LMU ulaşımı
- Dream-Bowl Palace ve tesisteki eğlence seçenekleri
- 14 banka/yerel banka için ayrı yanıtlar; TEB–Deutsche Bank ATM iş birliği ve Türkiye banka kartları
- dm’de alışveriş sırasında 200 €’ya kadar nakit çekme
- Çamaşırhane için banknotu madeni paraya çevirme

Çevre rehberindeki öneriler Apianstraße başlangıç alınarak kullanım amacına göre seçilir. Adresler kaynaklarla, yollar harita bağlantılarıyla verilir; süreler için canlı yolculuk planlayıcı kullanılır. Bankalarda para çekme, yatırma ve bozuk para edinme ayrı ele alınır; kart türü, kendi banka müşterisi olma koşulu ve uygulamadaki katılımcı mağaza bilgisi korunur. Yeni konum eklerken yalnızca adresi değil, önerilen hizmeti de kaynağından doğrula.

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

## Sonraki adım

[Açık kalan sorular](https://apianwiki.space/#acik-sorular) bölümünde boya kodları ve Apian 1 oda ölçüleri yer alıyor. Bir ölçü paylaşmak için ilgili sorudaki **Düzeltme öner** bağlantısını, rehberde eksik bir konuyu önermek için **Yeni başlık öner** bağlantısını kullanabilirsin.

## Açık kaynak ve katkı

Kitap ve onay işaretli logo, [AnimateIcons](https://github.com/Avijit07x/animateicons) / Avijit Dey’in Book Open Check animasyonundan ve [Lucide](https://github.com/lucide-icons/lucide) ikonundan uyarlanmıştır. Başlıktaki SVG, CSS ile üzerine gelindiğinde veya klavyeyle odaklandığında bir kez oynar; hareket azaltma ayarında sabit kalır. Ek çalışma zamanı bağımlılığı gerektirmez. Sekme simgesi ve isteğe bağlı forum aynı statik SVG’yi kullanır. MIT/ISC atıfları ve lisans metinleri [src/icon-licenses.txt](src/icon-licenses.txt) içinde, yayın çıktısına da dahil edilir.

Apian Wiki [MIT lisansı](LICENSE) altında açık kaynaktır. `@egemenbaha` ve `@ardatas` değişiklikleri doğrudan `main` dalına gönderir; PR açma ve inceleme onayı zorunluluğu yoktur. Otomatik inceleme talepleri kaldırıldı. `Test and build` her gönderimde çalışır, gönderimi engellemez. Yazma yetkisi olmayan katkıcılar fork ve PR üzerinden değişiklik önerebilir.

Katkı adımları, içerik ilkeleri ve ana dal kuralları için [CONTRIBUTING.md](CONTRIBUTING.md) dosyasına bak. Dış kaynak bağlantıları, kaynakların kendi lisans ve kullanım koşullarını değiştirmez.

## Ana sayfa tatil takvimi

Hoş geldiniz bölümünün altındaki aylık takvim Berlin saatine göre bugünü işaretler. Önceki/sonraki ay ve Bugün düğmeleriyle gezinilir. İşaretli günler aynı ayın açıklamasına gider. `src/holidays.js` kaynaklı 2026–2027 Bavyera/Unterföhring resmî tatillerini ve Türkiye’nin millî bayramları ve anma günlerini içerir. Türkiye’nin dinî günleri dahil değildir. Noel ve Cumhuriyet Bayramı tüm günlerinde işaretlenir.

Veri kapsamı dışındaki aylar tatilsizmiş gibi sunulmaz; güncelleme mesajı gösterilir. Yeni yıllar için kaynaklar doğrulanıp veri listeleri ve `calendarEnd` birlikte genişletilmelidir. Açık sayfa gece yarısında ve sekmeye dönüldüğünde bugün işaretini günceller, görüntülenen ayı korur.

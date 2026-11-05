# Apian Guide

Apian sakinleri ve yeni taşınacak öğrenciler için Türkçe bilgi ve sıkça sorulan sorular projesi.

[Proje açıklaması ve 56 soruluk FAQ](PROJECT_DESCRIPTION.md) · [Tamamlanacak sorular](PROJECT_DESCRIPTION.md#acik-sorular)

Arda’nın Wikipedia tarzı düzeni korunarak 56 soruluk FAQ, kaynak bağlantıları ve açık sorular 11 konu başlığına entegre edildi. İçerik `PROJECT_DESCRIPTION.md` dosyasından üretilir; cevapları güncellemek için bu dosyayı düzenle.

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

Çıktı `dist/` klasörüne yazılır; herhangi bir statik sunucuda yayımlanabilir. Başlıklar `src/topics.js`, gezinme ve arama `src/app.js`, tasarım `src/styles.css` içinde tutulur. Konu bağlantıları URL hash kullanır; sunucuda özel yönlendirme gerekmez. Arama konu ve alt bölüm başlıklarının yanında soruları ve cevapları da tarar; Türkçe karakterleri destekler ve sonuçlar ilgili soruya gider. Bu iskelet MediaWiki veya bir içerik yönetim sistemi içermez.

## İçerik güncelleme ve doğrulama

`npm run dev` ve `npm run build`, Markdown kaynağından `src/faq-data.js` dosyasını otomatik üretir. Üretilen dosya Git'e eklenmez. İçerik değişikliğinden sonra çalışan önizlemeyi yeniden başlat veya `node scripts/generate-faq.mjs` çalıştırıp sayfayı yenile.

Yeni soruları numara sırasını koruyarak ekle ve `src/topics.js` içindeki `questionIds` eşlemesine yerleştir. Her soru tam olarak bir bölüme atanmalıdır. Açık başlıklar tamamlandığında Markdown listesindeki kutuyu işaretle; cevapları ve güncelleme tarihini de aynı dosyada düzenle. Site yalnızca işaretlenmemiş açık başlıkları gösterir.

```sh
npm test
npm run build
```

Testler içerik aktarımını, kaynak bağlantılarının korunmasını, konu eşlemelerini, Türkçe aramayı ve güvenli Markdown gösterimini kontrol eder. `vercel.json`, Vercel için `npm run build` komutunu ve `dist/` yayın klasörünü tanımlar. Sunucu, veri tabanı veya ortam değişkeni gerekmez.

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

Apian Guide [MIT lisansı](LICENSE) altında açık kaynaktır. Herkes fork oluşturup değişiklik önerebilir. Katkıcılar `main` için pull request açar; birleştirme `@egemenbaha` onayı ve başarılı `Test and build` kontrolü gerektirir. Repo sahibi gerektiğinde doğrudan gönderebilir.

Katkı adımları, içerik ilkeleri ve ana dal kuralları için [CONTRIBUTING.md](CONTRIBUTING.md) dosyasına bak. Dış kaynak bağlantıları, kaynakların kendi lisans ve kullanım koşullarını değiştirmez.

# Apian Guide

Apian sakinleri ve yeni taşınacak öğrenciler için Türkçe bilgi ve sıkça sorulan sorular projesi.

[Proje açıklaması ve 56 soruluk FAQ](PROJECT_DESCRIPTION.md) · [Tamamlanacak sorular](PROJECT_DESCRIPTION.md#acik-sorular)

İlk iskelet, Türkçe bir ana sayfa ve konu başlıklarına göre gezilebilen boş FAQ bölümleri içerir. Proje açıklamasındaki sorular ve yanıtlar arayüze aktarılmadı. Yayınlama henüz yapılmadı.

## Yerel geliştirme

Node.js 22+ ve Python 3 gerektirir. Haricî paket kurulumu gerekmez.

```sh
npm run dev
```

Tarayıcıda http://127.0.0.1:5173 adresini aç. Statik yayın dosyalarını üretmek için:

```sh
npm run build
```

Çıktı `dist/` klasörüne yazılır; herhangi bir statik sunucuda yayımlanabilir. Başlıklar `src/topics.js`, gezinme ve arama `src/app.js`, tasarım `src/styles.css` içinde tutulur. Konu bağlantıları URL hash kullanır; sunucuda özel yönlendirme gerekmez. Arama yalnızca konu ve alt bölüm başlıklarını tarar. Bu iskelet MediaWiki veya bir içerik yönetim sistemi içermez.

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

Konu bölümlerine gözden geçirilmiş FAQ içerikleri, kaynakları ve doğrulama tarihleri eklenecek. Apian 1 ve Apian 2 bilgileri ayrı tutulacak. Proje açıklamasındaki açık sorular, yanıtları doğrulandığında tamamlanacak.

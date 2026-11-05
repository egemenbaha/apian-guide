# Katkıda bulunma

Apian Guide'a katkıların hoş geldi! Hata bildirmek, bir cevabı güncellemek veya kod önermek için [issue](https://github.com/egemenbaha/apian-guide/issues) ya da pull request açabilirsin.

## Değişiklik gönderme

1. `@ardatas` ve `@egemenbaha` için varsayılan yol doğrudan `main` dalına göndermektir. Başlamadan önce güncel `main` değişikliklerini al.
2. Mevcut Wikipedia tarzı tasarımı, diğer katkıları ve Apian 1/2 ayrımını koruyarak değişikliğini yap.
3. `npm test` ve `npm run build` komutlarını çalıştır.
4. İlgili dosyaları commit edip doğrudan `origin/main` dalına gönder. Uzak dalın gönderdiğin commit ile eşleştiğini kontrol et. PR açman veya inceleme istemen gerekmiyor.
5. Yazma yetkin yoksa fork oluşturup pull request açabilirsin. Değişikliği ve kontrol sonucunu kısaca anlat; görsel değişikliklerde ekran görüntüsü ekle. Proje sorumluları katkını birleştirebilir.

## Ana dala doğrudan gönderim

- Kullanıcının kararıyla ana dalda zorunlu PR, inceleme onayı ve zorunlu kontrol kapısı bulunmuyor. Önceki [ruleset](https://github.com/egemenbaha/apian-guide/rules/26578031) devre dışı.
- Otomatik inceleme isteği oluşturan `CODEOWNERS` tanımı kaldırıldı. Kullanıcı istemedikçe inceleme talebi gönderme.
- `Test and build` her gönderimde çalışmaya devam eder; sonucu kontrol et ve hataları düzelt. Kontrol, gönderimi veya birleştirmeyi bekletmez.
- Başkasının değişikliğini silmemek için güncel ana dalı alıp birleştir; normal iş akışında force push kullanma.

Bu değişiklik kimseye yeni yazma yetkisi vermez. Repo kişisel hesaba aittir; ayarlar ve sahiplik işlemleri `@egemenbaha`da, `@ardatas`ın collaborator yazma/birleştirme erişimi vardır. Yazma yetkisi olmayan dış katkıcılar fork ve PR kullanır.

## FAQ içeriği

Tek içerik kaynağı `PROJECT_DESCRIPTION.md` dosyasıdır. Üretilen `src/faq-data.js` dosyasını düzenleme veya commit etme. Yeni soruları `src/topics.js` içindeki ilgili bölüme de ekle. Ayrıntılar [README](README.md) içinde.

- Yanıtları samimi, anlaşılır ve doğrudan Türkçeyle yaz. "Bunu söyleyen sakinler var" gibi dolaylı anlatımlar yerine mevcut bilgiyi aktar; tarihe, binaya veya odaya bağlı sınırları koru. Cevabı bilinmeyen başlıkları tahminle doldurma.
- Güncel bir cevap önerirken tarihini ve varsa resmî kaynağını ekle.
- Sakin deneyimini kesin yönetim kuralı veya güncel tarife gibi sunma.
- Ham sohbet, kişisel iletişim bilgileri, kişi–oda eşleştirmeleri, özel davet bağlantıları ve gizli anahtarlar paylaşma.
- Açık bırakılmış başlıkları, cevapları doğrulandığında tamamla.

## Lisans

Proje [MIT lisansı](LICENSE) altındadır. Katkı göndererek katkının aynı lisansla yayımlanmasını kabul edersin. Yalnızca paylaşma hakkına sahip olduğun içeriği gönder. Bağlantı verilen dış kaynakların hakları kendi sahiplerinde kalır.

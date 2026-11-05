# Katkıda bulunma

Apian Guide'a katkıların hoş geldi! Hata bildirmek, bir cevabı güncellemek veya kod önermek için [issue](https://github.com/egemenbaha/apian-guide/issues) ya da pull request açabilirsin.

## Değişiklik gönderme

1. Depoda yazma yetkin yoksa fork oluştur; yazma yetkin varsa ayrı bir dal aç.
2. Değişikliğini bu dalda yap. Mevcut Wikipedia tarzı tasarımı ve Apian 1/2 ayrımını koru.
3. `npm test` ve `npm run build` komutlarını çalıştır.
4. Dalını gönderip `main` hedefli bir pull request aç. Sorunu, yaptığın değişikliği ve kontrol sonucunu kısaca anlat. Görsel değişikliklerde ekran görüntüsü ekle.
5. `@egemenbaha` veya `@ardatas` incelemesini bekle. Geri bildirim varsa aynı dala yeni commit gönder.

## Ana dalın korunması

- `@egemenbaha` ve `@ardatas` güvenilen proje sorumlularıdır. Kullanıcıya özel `always` muafiyetiyle doğrudan `main` dalına push yapabilir ve PR'ları onay/test kapısına takılmadan birleştirebilirler.
- Diğer katkıcılar PR üzerinden ilerler. Tüm dosyaların kod sahipleri `@egemenbaha` ve `@ardatas`tır; bu iki kişiden birinin onayı gerekir.
- Yeni değişiklik gönderilirse önceki onay geçersiz olur ve yeniden inceleme gerekir.
- `Test and build` kontrolü başarılı olmalı, dal güncel `main` ile uyumlu olmalı ve inceleme konuşmaları çözülmelidir.
- Force push ve dal silme diğer katkıcılara kapalıdır. İki proje sorumlusunun muafiyeti bu kuralları da kapsar.

Onay, test ve konuşma çözümleme zorunlulukları muafiyet tanınan iki hesap dışındaki katkıcılar için geçerlidir. Testler proje sorumlularının push'larında da çalışır; başarılı olmaları önerilir, gönderimi engellemez.

Bu kurallar [GitHub ruleset](https://github.com/egemenbaha/apian-guide/rules/26578031) üzerinden uygulanır. Muafiyet yalnızca bu iki kullanıcı hesabına tanımlıdır; ileride eklenen katkıcılara otomatik aktarılmaz. `CODEOWNERS` dosyası tek başına birleştirmeyi engellemez.

Repo kişisel hesaba aittir. GitHub bu tür depolarda ayrı bir admin rolünü başka bir kullanıcıya vermediği için repo ayarları ve sahiplik işlemleri `@egemenbaha`da kalır; `@ardatas`ın collaborator yazma/birleştirme erişimi ve yukarıdaki muafiyeti vardır.

## FAQ içeriği

Tek içerik kaynağı `PROJECT_DESCRIPTION.md` dosyasıdır. Üretilen `src/faq-data.js` dosyasını düzenleme veya commit etme. Yeni soruları `src/topics.js` içindeki ilgili bölüme de ekle. Ayrıntılar [README](README.md) içinde.

- Samimi ve anlaşılır Türkçe kullan; eksik bilgiyi tahminle doldurma.
- Güncel bir cevap önerirken tarihini ve varsa resmî kaynağını ekle.
- Sakin deneyimini kesin yönetim kuralı veya güncel tarife gibi sunma.
- Ham sohbet, kişisel iletişim bilgileri, kişi–oda eşleştirmeleri, özel davet bağlantıları ve gizli anahtarlar paylaşma.
- Açık bırakılmış başlıkları, cevapları doğrulandığında tamamla.

## Lisans

Proje [MIT lisansı](LICENSE) altındadır. Katkı göndererek katkının aynı lisansla yayımlanmasını kabul edersin. Yalnızca paylaşma hakkına sahip olduğun içeriği gönder. Bağlantı verilen dış kaynakların hakları kendi sahiplerinde kalır.

// Question numbers refer to PROJECT_DESCRIPTION.md; keep each answer in one section.
export const topics = [
  { id: 'acil-yardim', title: 'Acil yardım numaraları', group: 'Başlangıç', sections: ['Hangi numarayı aramalıyım?'], questionIds: [[104]] },
  { id: 'yerlesme', title: 'Yerleşme ve teslim', group: 'Başlangıç', sections: ['Ofis ve iletişim', 'Anahtar teslimi', 'Sözleşme ve öğrenci belgeleri', 'Oda teslim tutanağı'], questionIds: [[1], [2, 134], [3, 4, 135], [10]] },
  { id: 'tasinma-listesi', title: 'Yanımda ne getireyim?', group: 'Başlangıç', sections: ['Yanında getir', 'Odada bulunanlar', 'Yerleştikten sonra al'], questionIds: [[113], [114], [115]], checklist: true },
  { id: 'oda-donanimi', title: 'Odada neler var?', group: 'Başlangıç', sections: ['Yatak ve tekstil', 'Mutfak ve ocak', 'Pencereler, sineklik ve perde', 'Mobilyalar', 'Banyo', 'Kapılar ve kalorifer', 'Prizler', 'Apian 1 oda ölçüleri'], questionIds: [[5, 6], [7, 105], [8, 110], [9, 106], [107], [108, 109], [112], [141]] },
  { id: 'apian-2-oda-olculeri', title: 'Apian 2 oda ölçüleri', group: 'Başlangıç', sections: ['Ölçü ve eşya tablosu'], questionIds: [[111]] },
  { id: 'alisveris', title: 'Eczane, market ve fırın', group: 'Günlük yaşam', sections: ['En yakın eczane', 'Pazar günü açık yerler', 'Yakındaki marketler', 'Orterer: içecek marketi', 'Kistenpfennig: fırın ve kahvaltılık'], questionIds: [[103], [101], [102, 131], [132], [133]] },
  { id: 'internet', title: 'İnternet ve telefon', group: 'Günlük yaşam', sections: ['Modem ve bağlantı', 'Wi-Fi', 'Bağlantı sorunları', 'Mobil operatörler'], questionIds: [[11], [12], [13], [14]] },
  { id: 'camasirhane', title: 'Çamaşırhane', group: 'Günlük yaşam', sections: ['Konum ve erişim', 'Yıkama ve kurutma', 'Airwallet ve rezervasyon', 'Ödeme ve makine sorunları'], questionIds: [[15, 18], [16], [17], [19]] },
  { id: 'ortak-alanlar', title: 'Anahtar ve ortak alanlar', group: 'Günlük yaşam', sections: ['Anahtar ve kapı erişimi', 'Misafirler', 'Çalışma ve müzik odaları', 'Bisiklet parkı ve kayıt', 'Bina içi kullanım'], questionIds: [[20, 21], [22, 144], [23], [24], [99]] },
  { id: 'kargo', title: 'Posta, kargo ve DHL', group: 'Günlük yaşam', sections: ['Adres ve posta kutusu', 'Teslim bildirimleri', 'Kayıp gönderiler', 'Yakındaki Packstation 166', 'Packstation kullanımı'], questionIds: [[25, 145], [26], [27], [65], [66]] },
  { id: 'bakim', title: 'Arızalar ve günlük bakım', group: 'Günlük yaşam', sections: ['Arıza bildirimi', 'Tamirat ve ücretler', 'Isıtma ve cihazlar', 'Oda bakımı', 'Atık ve büyük eşyalar', 'Tamir için odaya giriş'], questionIds: [[28], [29], [30], [31], [32, 98], [97]] },
  { id: 'geri-donusum', title: 'Atık ve geri dönüşüm', group: 'Günlük yaşam', sections: ['Yatak ve şilte', 'Elektronik eşyalar', 'Pil ve batarya', 'Teslim noktaları ve haritalar'], questionIds: [[152], [153], [154], [155, 156]] },
  { id: 'bocekler', title: 'Böcekler ve korunma', group: 'Günlük yaşam', sections: ['Sonbaharda içeri giren böcekler', 'Sineklik ve havalandırma', 'Silverfish ve kâğıt böceği', 'Ev çıyanı', 'Tuzak, lavanta ve sprey', 'Apian’a bildirim'], questionIds: [[146], [147], [148], [149], [150], [151]] },
  { id: 'cikis', title: 'Çıkış, boya ve depozito', group: 'Taşınma ve işlemler', sections: ['Ön kontrol ve oda teslimi', 'Temizlik', 'Boya ve renk kodları', 'Depozito iadesi', 'Kesintiler ve itirazlar', 'Erken ayrılma'], questionIds: [[33, 34], [35], [36, 37], [38, 136], [39, 41], [42]] },
  { id: 'sigorta', title: 'Sigorta bilgileri', group: 'Taşınma ve işlemler', sections: ['Haftpflicht: özel sorumluluk sigortası', 'Glasversicherung: cam sigortası'], questionIds: [[142], [143]] },
  { id: 'odemeler', title: 'Kira ve ödemeler', group: 'Taşınma ve işlemler', sections: ['Kira ve SEPA tahsilatı', 'Ücretler ve toplam tutarlar', 'Rundfunkbeitrag'], questionIds: [[43], [40], [52]] },
  { id: 'resmi-islemler', title: 'Resmî işlemler', group: 'Taşınma ve işlemler', sections: ['Anmeldung ve Abmeldung', 'Oturum ve randevular', 'Fiktionsbescheinigung', 'Biyometrik fotoğraf', 'Geçim belgeleri ve bloke hesap', 'Sağlık sigortası, AT11 ve M10', 'Türk Konsolosluğu, Eğitim Ataşeliği ve askerlik', 'Vergi ve sosyal güvenlik numaraları', 'Fotokopi, çıktı ve tarama'], questionIds: [[44, 45, 46], [47, 48], [49], [50], [51], [53], [127, 128, 129, 54, 130], [55], [126]] },
  { id: 'abonelikler', title: 'Üyelikler ve abonelikler', group: 'Taşınma ve işlemler', sections: ['Clever fit: spor salonu üyeliği', 'Deutschlandticket', 'Cosimawellenbad: yüzme ve sauna', 'ZHS: üniversite sporları', 'Diğer spor seçenekleri'], sectionNumbers: [1, 3, 4, 5, 6], questionIds: [[100, 118, 56], [116, 117], [119, 120, 121], [122, 123], [124, 125]] },
  { id: 'marketler', title: 'Yakındaki marketler', group: 'Çevre rehberi', sections: ['Hangi marketi seçeyim?', 'ALDI Süd', 'Lidl', 'EDEKA Die Frischnachbarn', 'REWE', 'Pazar ve tatil günlerinde alışveriş'], questionIds: [[57], [58], [59], [60], [61], [94]] },
  { id: 'eczaneler', title: 'Eczaneler ve nöbetçi eczane', group: 'Çevre rehberi', sections: ['Pharao Apotheke ve SaniPlus Föhring', 'Feringa-Apotheke', 'Güncel nöbetçi eczane listesi'], introQuestionId: 103, questionIds: [[62], [63], [64]] },
  { id: 'doktor-randevusu', title: 'İlk doktor randevusu', group: 'Çevre rehberi', sections: ['Randevu alırken', 'Unterföhring’de aile ve diş hekimleri', 'Türkçe muayene ve dil desteği', 'Yanına ne almalısın?'], questionIds: [[137], [138], [139], [140]] },
  { id: 'ulasim', title: 'Duraklar ve toplu taşıma', group: 'Çevre rehberi', sections: ['Apianstraße: 233 ve X205', 'Feringastraße ve Feringastraße Ost', 'Tramvay ve canlı seferler'], questionIds: [[67], [68], [69]] },
  { id: 'universiteler', title: 'TUM ve LMU ulaşımı', group: 'Çevre rehberi', sections: ['TUM Garching', 'TUM Stammgelände', 'LMU Universität'], questionIds: [[70], [71], [72]] },
  { id: 'yemek-mekanlari', title: 'Yemek mekanları', group: 'Çevre rehberi', sections: ['Ev yemekleri', 'Pilav, pide ve çorba', 'Arkadaşlarla kahvaltı', 'Döner'], questionIds: [[157], [158], [159], [160]] },
  { id: 'eglence', title: 'Dream-Bowl ve eğlence', group: 'Çevre rehberi', sections: ['Bowling ve rezervasyon', 'Bilardo, minigolf ve diğer oyunlar'], questionIds: [[73], [74]] },
  { id: 'bankalar', title: 'Bankalar, ATM ve nakit', group: 'Çevre rehberi', sections: ['ATM mi, market mi?', 'Kreissparkasse München Starnberg Ebersberg', 'Stadtsparkasse München', 'VR-Bank ve Volksbank/Raiffeisenbank', 'Münchner Bank', 'Deutsche Bank', 'Commerzbank', 'HypoVereinsbank / UniCredit', 'Postbank', 'comdirect', 'ING', 'DKB', 'N26', 'Revolut', 'Türkiye banka kartları', 'dm’de 200 €’ya kadar nakit çekme', 'TEB / CEPTETEB ve Deutsche Bank'], questionIds: [[75], [76], [77], [78], [79], [80], [81], [82], [83], [84], [85], [86], [87], [88], [89], [92], [93]] },
  { id: 'bozuk-para', title: 'Çamaşırhane için bozuk para', group: 'Çevre rehberi', sections: ['Dream-Bowl Palace’ta bozuk para makinesi', 'Az miktarda bozuk para ve alternatifler'], questionIds: [[90], [91]] },
  { id: 'tatiller', title: 'Resmî tatiller', group: 'Çevre rehberi', sections: ['2026 sonu: Noel ve yılbaşı', '2027 resmî tatil takvimi'], questionIds: [[95], [96]] }
];

// A topic can also open with an existing answer from another topic.
export function sectionQuestionIds(topic, sectionIndex) {
  const ids = topic.questionIds[sectionIndex];
  if (sectionIndex === 0 && topic.introQuestionId != null) return [topic.introQuestionId, ...ids];
  return ids;
}

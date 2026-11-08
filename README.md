# Umt3D Studio — 3D Baskı Fiyat Hesaplayıcı

Tamamen statik (sade HTML/CSS/JS) bir site. Sunucu, veritabanı veya .NET gerektirmez;
bütün hesaplamalar ziyaretçinin tarayıcısında çalışır.

## Dosya yapısı

```
index.html         Ana sayfa
calculator.html     Hesaplayıcı
privacy.html        Gizlilik sayfası
css/site.css        Ortak tasarım (renkler, navbar, footer, ana sayfa bileşenleri)
css/calculator.css  Hesaplayıcıya özel bileşenler
js/site.js          Mobil menü + açık/koyu tema anahtarı
js/calculator.js    Hesaplama mantığı, G-code okuma, teklif oluşturma
favicon.ico
```

## Yerelde önizleme

Çift tıklayıp doğrudan açabilirsin, ama en doğru sonuç için basit bir yerel sunucu
üzerinden açman önerilir (G-code `fetch` kullanmıyor, bu yüzden `file://` üzerinden de
çalışır — yine de alışkanlık olsun):

```bash
cd umt3dstudio-site
python3 -m http.server 8080
# tarayıcıda: http://localhost:8080
```

## Yayına alma — önerilen yol: Cloudflare Pages (ücretsiz)

Statik bir site olduğu için en kolay ve tamamen ücretsiz seçenek **Cloudflare Pages**.
Türkiye'den erişim hızı iyi, otomatik HTTPS veriyor, özel alan adını (umt3dstudio.com)
doğrudan bağlayabiliyorsun.

1. Bu klasörü bir GitHub deposuna yükle (aşağıda komutlar var).
2. [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. GitHub deponu seç. Build ayarlarında:
   - Build command: *boş bırak* (derleme gerekmiyor)
   - Build output directory: `/` (deponun kökü, bu klasörün kendisi)
4. Deploy'a bas — birkaç saniyede `xxxx.pages.dev` adresinde yayında olur.
5. **Custom domains** sekmesinden `umt3dstudio.com` ekle. Cloudflare sana ekleyeceğin
   DNS kayıtlarını (genelde bir CNAME) gösterir; alan adını Cloudflare'de yönetiyorsan
   bu otomatik ayarlanır.

### Alternatifler (aynı derecede kolay)

- **Netlify**: [app.netlify.com](https://app.netlify.com) → "Add new site" → bu klasörü
  sürükle-bırak ya da GitHub'a bağla. Domain ayarları → `umt3dstudio.com` ekle.
- **Vercel**: [vercel.com](https://vercel.com) → "New Project" → GitHub deposunu seç →
  Framework: "Other" → Deploy.
- **Herhangi bir paylaşımlı hosting (cPanel vb.)**: Bu klasörün içeriğini doğrudan
  `public_html` klasörüne FTP ile yükle. Statik dosya olduğu için PHP/.NET desteğine
  gerek yok.

## GitHub'a yükleme

```bash
cd umt3dstudio-site
git init
git add .
git commit -m "Umt3D Studio static site"
git branch -M main
git remote add origin https://github.com/<kullanici-adin>/umt3dstudio.git
git push -u origin main
```

## Alan adı (umt3dstudio.com) DNS ayarı — genel mantık

Hangi hosting'i seçersen seç, mantık aynıdır:

- Alan adını aldığın yerde (GoDaddı, isim tescil, Cloudflare Registrar vb.) **DNS
  yönetimi**ne gir.
- Hosting sağlayıcının verdiği CNAME veya A kaydını ekle (her sağlayıcının kendi sayfasında
  bu kayıt tam olarak yazılı çıkar).
- DNS değişikliklerinin tüm dünyaya yayılması birkaç dakikadan birkaç saate kadar sürebilir.

## İçeriği düzenlemek

- Metinleri değiştirmek için `index.html`, `calculator.html`, `privacy.html` dosyalarını
  doğrudan bir metin editörüyle aç ve düzenle.
- Renk/tasarım değişikliği için `css/site.css` dosyasının en üstündeki `:root { ... }`
  bloğundaki renk değerlerini değiştir — hem açık hem koyu tema otomatik güncellenir.
- Yeni malzeme veya yazıcı eklemek için `js/calculator.js` içindeki `MATERIALS` ve
  `PRINTERS` dizilerine yeni bir satır eklemen yeterli.

## Sonraki adımlar (istersen)

- Üyelik/giriş sistemi (bu turda bilinçli olarak kaldırıldı) — gerçek bir backend ve
  veritabanı gerektirir, ayrı bir iş olarak ele alınmalı.
- Teklif geçmişini bir yerde biriktirmek (şu an sadece panoya kopyalanıyor).
- Google Analytics / basit, çerezsiz bir ziyaretçi sayacı eklemek.

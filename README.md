# Havana Dijital Müşteri Portalı

Bu proje, ajans müşterileri için geliştirilmiş, fütüristik ve modern tasarımlı bir yönetim portalıdır.

## Özellikler

- **Gelişmiş Dashboard:** Satış metriklerinin (Toplam Satış, Sipariş, Kar, Müşteri Değerleri) görselleştirilmesi ve takibi.
- **Admin Paneli:** Müşteri yönetimi (ekleme, düzenleme, aktif/pasif yapma) ve Bilgi Bankası içerik yönetimi.
- **Bilgi Bankası:** Müşterilere özel eğitim videoları, PDF'ler ve harici linkler.
- **Profil Yönetimi:** Şifre ve kişisel bilgi güncelleme.
- **Teknik Altyapı:** Next.js, Prisma, Tailwind CSS, Lucide Icons, Recharts ve NextAuth.js.

## Kurulum

1. Depoyu klonlayın:
   ```bash
   git clone <repo-url>
   cd nextjs_space
   ```

2. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```

3. `.env` dosyasını oluşturun ve gerekli değerleri girin (DATABASE_URL, NEXTAUTH_SECRET vb.).

4. Veritabanını hazırlayın:
   ```bash
   npx prisma db push
   npm run prisma:seed
   ```

5. Uygulamayı çalıştırın:
   ```bash
   npm run dev
   ```

## Giriş Bilgileri (Varsayılan)

- **Kullanıcı:** `havanadigitalofficial`
- **Şifre:** `berkerMETEHAN`

## Tasarım

Uygulama; derin siyah (#000000), beyaz (#FFFFFF) ve vurgu rengi olarak mavi (#3b82f6) kullanılarak tasarlanmıştır. Glassmorphism efektleri ve yuvarlatılmış köşeler ile premium bir his verilmiştir.

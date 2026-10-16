# PRD — app-monorepo-starter, Tahap 3 (Backend)

> **Status:** Roadmap; belum ada persetujuan untuk implementasi.  
> **Prasyarat:** Audit kontrak dan implementasi dalam [PRD Tahap 1](../frontend/prd.md) serta keputusan mobile dalam [PRD Tahap 2](../mobile/prd.md), jika tahap tersebut sudah dimulai.

Dokumen ini memisahkan rencana migrasi backend dari spesifikasi Tahap 1. Kehadiran file ini di `apps/backend` tidak menetapkan struktur aplikasi Go dan tidak mengizinkan implementasi Tahap 3.

## 1. Roadmap Tahap 3 — hanya saat pengguna meminta

**Trigger eksplisit:** pengguna mengatakan variasi seperti **“lanjut tahap 3”, “mulai backend Go”, “migrasi backend dari Next.js ke Go”**.

**Peraturan keras:** selama belum ada permintaan eksplisit, `apps/backend` hanya berisi PRD ini. Jangan memilih Go router/ORM/framework atau menetapkan struktur direktori Go secara permanen.

### 1.1 Tujuan (belum berupa rancangan struktur)

- Membangun backend REST mandiri di **Go** untuk endpoint `/api/v1`.
- Migrasi bertahap endpoint, business logic, persistence ownership, dan autentikasi/otorisasi dari Next.js ke Go.
- Mempertahankan schema PostgreSQL/migrasi data secara aman selama cutover.
- Meminimalkan perubahan di frontend Next.js dan Flutter melalui kontrak OpenAPI yang tetap.
- Deploy backend Go independen dari Vercel frontend.

### 1.2 Risiko khusus yang wajib direncanakan

- **Better Auth adalah integrasi TypeScript:** backend Go tidak dapat langsung menjalankan Better Auth TS. Solusi auth Tahap 3 harus didesain dan diuji secara eksplisit (misalnya auth service terpisah, kompatibilitas token/session, atau migrasi auth) — **jangan mengasumsikan Go dapat memvalidasi session Better Auth tanpa desain**.
- Hindari dua backend menulis resource DB yang sama tanpa aturan ownership/migration.
- Uji backward compatibility atas cookie/session atau strategi penggantinya.
- Transisi base URL/proxy/CORS, authentication propagation, error status, pagination/filter mapping.
- Migrations perlu rencana rollback dan perlindungan data nyata.

### 1.3 Langkah agent ketika diminta memulai Tahap 3

1. Inventarisasi penggunaan REST saat itu, schema PostgreSQL, auth, deployment, dan client web/mobile.
2. Audit repository inspirasi Go sebagai referensi **bukan basis fork**; evaluasi alternatif arsitektur dengan kebutuhan aktual.
3. Usulkan beberapa strategi migrasi (misalnya endpoint-by-endpoint atau strangler pattern), auth compatibility, database ownership, dan rollback.
4. Minta/rekam keputusan struktur Go, framework, deployment, dan strategi auth dari user **pada saat Tahap 3**.
5. Tetapkan contract conformance suite yang dapat dijalankan terhadap implementasi Next.js dan Go.
6. Migrasikan modul secara bertahap, gunakan satu sumber truth per domain dan cutover terkontrol.
7. Ubah target HTTP frontend/mobile atau same-origin proxy tanpa mengubah kontrak resource.
8. Perbarui PRD Tahap 3 dan criteria sebelum implementasi penuh.

**Success criteria tingkat tinggi:** web dan Flutter tetap bekerja dengan kontrak `/api/v1`, backend Go mandiri, auth aman, dan tidak ada kehilangan atau inkonsistensi data.

## 2. Hubungan dengan tahap sebelumnya

```text
Next.js Web UI -----+
                    +--> Go REST /api/v1 --> PostgreSQL
Flutter Mobile -----+
(rencana migrasi auth, kepemilikan data, routing, dan rollback disepakati dahulu)
```

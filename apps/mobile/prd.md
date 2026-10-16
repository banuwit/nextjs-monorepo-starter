# PRD — app-monorepo-starter, Tahap 2 (Mobile)

> **Status:** Roadmap; belum ada persetujuan untuk implementasi.  
> **Prasyarat:** Audit implementasi dan kontrak API dalam [PRD Tahap 1](../frontend/prd.md).  
> **Tahap berikutnya:** [PRD Tahap 3](../backend/prd.md).

Dokumen ini memisahkan rencana mobile dari spesifikasi Tahap 1. Kehadiran file ini di `apps/mobile` tidak menetapkan struktur aplikasi Flutter dan tidak mengizinkan implementasi Tahap 2.

## 1. Roadmap Tahap 2 — hanya saat pengguna meminta

**Trigger eksplisit:** pengguna mengatakan variasi seperti **“lanjut tahap 2”, “mulai Flutter/mobile”, “implementasikan aplikasi mobile”**.

**Peraturan keras:** selama belum ada permintaan eksplisit, `apps/mobile` hanya berisi PRD ini. Jangan menginstal Flutter atau menetapkan struktur dan arsitektur Flutter secara permanen.

### 1.1 Tujuan (belum berupa rancangan struktur)

- Mengembangkan aplikasi **Flutter** yang mengonsumsi kontrak REST `/api/v1` dari Next.js.
- Menghasilkan/menjaga Dart DTO/API client berdasarkan OpenAPI yang dihasilkan Tahap 1.
- Mendesain auth mobile-compatible yang aman tanpa bergantung pada asumsi cookie web secara langsung.
- Memakai PostgreSQL yang sama melalui backend API, **bukan** akses DB langsung dari mobile.
- Mempertahankan API compatibility untuk web.

### 1.2 Langkah agent ketika diminta memulai Tahap 2

1. Audit [PRD Tahap 1](../frontend/prd.md), kode yang benar-benar dibangun, OpenAPI, dan test coverage.
2. Diskusikan kebutuhan user: target Android/iOS, minimum platform, design system, fitur layar, login/session model, offline/cache, environment deployment.
3. Baru setelah itu **usulkan struktur Flutter** beserta trade-offs; jangan anggap struktur sudah ditetapkan sekarang.
4. Rancang auth exchange/storage/revocation dan pengamanan credential sesuai kemampuan backend, tanpa mengekspos cookie/secrets secara tidak aman.
5. Tentukan workflow OpenAPI → Dart generation dan strategi compatibility testing.
6. Implementasikan secara bertahap setelah scope disetujui; pertahankan web berfungsi.
7. Perbarui dokumen ini dengan keputusan **Tahap 2 v1** dan acceptance criteria spesifik sebelum coding substansial.

**Success criteria tingkat tinggi:** Flutter dapat login dengan metode mobile yang telah disepakati, memakai API bisnis yang sama, dan tidak perlu duplikasi business logic atau akses database langsung.

## 2. Hubungan dengan Tahap 1

```text
Next.js Web UI -----+
                    +--> REST /api/v1 (kontrak sama) --> PostgreSQL
Flutter Mobile -----+
(desain auth mobile perlu keputusan khusus)
```

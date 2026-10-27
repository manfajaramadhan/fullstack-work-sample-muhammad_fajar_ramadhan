# Soal #1: Optimasi Performa & State Management React (Live Coding / Implementation)

1. Jelaskan Jelaskan penyebab utama unnecessary re-render pada React saat menangani dataset besar.

Jawaban : Menurut saya, penyebab utama terjadinya lagging pada dashboard e-commerce tersebut adalah banyaknya komponen yang melakukan re-render ketika terjadi perubahan pada data, padahal tidak semua komponen membutuhkan pembaruan tersebut. Misalnya, ketika status stok pada satu produk berubah, komponen utama yang menyimpan seluruh data produk dapat melakukan re-render dan menyebabkan komponen turunannya ikut melakukan proses render kembali. Hal ini akan semakin membebani aplikasi jika tabel memiliki lebih dari 5.000 data produk. Rendering seluruh data produk secara bersamaan juga dapat membebani browser karena banyaknya elemen DOM yang harus diproses. Oleh karena itu, menurut saya, masalah ini perlu ditangani dengan mengoptimalkan proses rendering, membatasi jumlah elemen yang ditampilkan, dan mengatur state agar perubahan pada satu produk tidak memengaruhi komponen lain yang tidak berkaitan.

2. Implementasikan contoh React Component (Gunakan Hook seperti useMemo, useCallback, React.memo, atau Virtualization seperti react-window) di dalam file README / folder /src.

Step / Langkah : Tahapan pertama yaitu membuat array untuk membuat 5.000 produk yang berisi id, nama, sku dan stock, lalu membuat usememo agar menyimpan hasil perhitunganya berdasarkan dependensinya yaitu berupa array kosong [],

Setelah itu dalam file ProductTable.jsx, Saya memisahkan tampilan tabel ke dalam komponen ProductTable dan setiap baris ke dalam komponen ProductRow. Menurut saya, pemisahan ini membuat kode lebih terstruktur dan memudahkan optimasi pada bagian yang mengalami perubahan.

Lalu membungkus ProductRow dengan React.memo agar komponen dapat melewatkan re-render ketika props-nya tidak berubah. Dengan demikian, perubahan pada satu bagian tidak selalu mengharuskan seluruh baris dirender ulang. disini saya Saya menggunakan Zustand untuk menyimpan perubahan status stok berdasarkan ID produk. Setiap ProductRow menggunakan selector untuk mengamati status produknya sendiri.

Saya menggunakan useCallback pada fungsi handleUpdate agar referensi fungsi tetap stabil selama dependensinya tidak berubah. Teknik ini membantu mengurangi perubahan referensi fungsi yang dapat memengaruhi efektivitas memoization.

3. Jelaskan strategi state management yang tepat agar update item individual tidak memicu re-render global

Jawaban : Menurut saya, salah satu hal terpenting dalam menangani masalah ini adalah menentukan penempatan state yang tepat. Saya tidak akan langsung menyimpan seluruh state pada komponen utama dashboard jika state tersebut hanya digunakan oleh komponen tertentu. Untuk state pencarian, saya akan menggunakan useState pada komponen tabel karena data tersebut hanya berkaitan dengan fitur pencarian. Sementara itu, data produk dapat dikelola melalui props atau cache data dari API. Untuk perubahan status stok, saya akan menggunakan state management seperti Zustand dengan selector agar setiap komponen hanya berlangganan pada data yang dibutuhkannya. Sebagai contoh, ketika status stok produk dengan ID tertentu berubah, hanya komponen yang berlangganan pada status produk tersebut yang perlu menerima pembaruan, selama nilai yang diamati oleh komponen lain tidak berubah.Dengan pendekatan ini, saya berharap pembaruan satu produk tidak menyebabkan seluruh dashboard melakukan re-render yang tidak diperlukan.

# Soal #2: Arsitektur Backend, Autentikasi JWT, & High-Concurrency Scaling

1. Sistem Anda memproses ribuan permintaan per detik (traffic spike) saat promo Flash Sale. Backend Anda (bebas menggunakan Node.js/Express, Go, Python, Java, atau PHP) mengelola autentikasi berbasis Stateless JWT dan transaksi database.

Jawaban : Menurut saya, untuk menangani ribuan request per detik saat Flash Sale, backend harus dirancang dengan mempertimbangkan skalabilitas, keamanan autentikasi, dan konsistensi transaksi. Saya memilih Node.js dengan Express sebagai backend, PostgreSQL sebagai database utama, dan Redis untuk mendukung kebutuhan cache serta pengelolaan token.

Sedangkan dari segi menjaga keamanan autentikasi, saya akan menggunakan JWT dengan masa berlaku access token yang singkat. Karena JWT tidak otomatis menjadi tidak valid saat user logout, saya akan menyimpan ID token yang dicabut ke Redis hingga token kedaluwarsa. Backend akan memeriksa status token sebelum memproses request sehingga token yang sudah dicabut tidak dapat digunakan kembali.

Selain autentikasi, konsistensi transaksi juga penting saat Flash Sale. Untuk mencegah overselling ketika banyak user membeli barang yang sama, saya akan menggunakan atomic update pada PostgreSQL, yaitu mengurangi stok hanya jika jumlahnya masih lebih dari nol. Proses pengurangan stok dan pembuatan pesanan dilakukan dalam satu transaksi agar data tetap konsisten. Saya juga akan menerapkan idempotency key untuk mencegah pesanan ganda akibat request yang dikirim ulang.

# Soal #3: Strategi Integrasi API, Webhook Reliability, & Resiliency

1. Aplikasi Anda terintegrasi dengan Payment Gateway pihak ketiga via Webhook. Dalam beberapa kasus, Webhook dari Payment Gateway mengalami failure (timeout atau network glitch), sehingga status pembayaran user tidak ter-update.

Jawaban : Menurut saya, untuk memastikan proses pembayaran berjalan dengan baik, sistem harus dirancang agar tetap dapat menangani gangguan jaringan, notifikasi yang dikirim berulang kali, maupun keterlambatan pembaruan status pembayaran.

Berdasarkan referensi dari https://dev.to/highflyer910 idempotency-keys-what-most-tutorials-dont-tell-you-1ncc. idempotency berarti operasi atau permintaan yang jika dijalankan berulang kali akan menghasilkan kondisi akhir yang sama persis seperti saat dijalankan pertama kali, tanpa menimbulkan efek samping tambahan atau data ganda, yang dimana pada studi kasus tersebut, agar tidak terjadi proses ganda yaitu dengan mencoba membuat endpoint webhook pada backend untuk menerima notifikasi pembayaran dari payment gateway. Setiap notifikasi perlu diverifikasi keasliannya, misalnya melalui kode yang disediakan oleh payment gateway. Selanjutnya, backend akan memeriksa ID transaksi atau ID event untuk memastikan notifikasi yang sama tidak diproses berulang kali.

Untuk menangani webhook yang gagal diterima, saya akan menerapkan mekanisme retry sesuai kebutuhan dan dokumentasi payment gateway. Selain itu, saya akan menggunakan Cron Job untuk memeriksa transaksi yang masih berstatus PENDING dalam jangka waktu tertentu dengan mengambil status terbaru dari API payment gateway. Jika pemeriksaan masih gagal, sistem dapat menjadwalkan percobaan berikutnya dengan jeda bertahap.

Sedangkan untuk mengkomunikasikan status pembayaran secara maksimal dari sisi frontend menggunakan React berdasarkan yang saya pahami dari internet, solusinya yaitu menampilkan status pembayaran seperti PENDING, SUCCESS, atau FAILED agar user mengetahui kondisi transaksinya. Untuk implementasi awal, saya dapat menggunakan polling dengan interval yang wajar dan menghentikannya ketika pembayaran sudah selesai atau user meninggalkan halaman. Agar lebih efisien, interval dapat diperpanjang jika pembayaran belum selesai. Jika sistem membutuhkan pembaruan secara real-time, saya dapat menggunakan Server-Sent Events (SSE) atau WebSocket sesuai kebutuhan arsitektur backend.

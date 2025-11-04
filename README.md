# Kelas VIII 9 - React + Tailwind (Demo)

Cara menjalankan:

1. Pastikan Node.js & npm terinstall.
2. Install dependencies: `npm install`
3. Jalankan development server: `npm run dev`
4. Buka di browser (http://localhost:5173)

Catatan:
- Tailwind sudah dikonfigurasi; jika ingin menyesuaikan lebih lanjut, ubah tailwind.config.cjs dan src/index.css.
- Fitur upload foto di demo ini menerima Data URL (base64) lewat dialog prompt atau import JSON yang berisi field `seats[].photo`.
- Data denah & kursi disimpan di localStorage sehingga akan persist di browser yang sama.

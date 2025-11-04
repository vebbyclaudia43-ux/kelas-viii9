import React, { useEffect, useState } from 'react';

const schoolName = 'SMP NEGERI 1 BATANGTORU';
const className = 'Kelas VIII 9';
const waliKelas = { name: 'Vebby Claudia Rizki Pasaribu', photo: '' };

const initialStudents = [
  'Abdan Syaquro Sihombing',
  'ABDUL AZIZ HASIBUAN',
  'AFFANDI NASUHA TANJUNG',
  'Ahmad Reiza',
  'AHMAD SUHEYBI PASARIBU',
  'ASWAN DALIMUNTHE',
  'AULA SANJAYA SIREGAR',
  'AULIA RAMADHANI',
  'Charina Saffira Kaban',
  'DEWI SARTIKA PASARIBU',
  'Fachri Nul Hakim',
  'FIRMANTUAH LUBIS',
  'GADIS MARWAH',
  'GALANG DERMAWAN',
  'HOTMARTUA MANALU',
  'Mayra Heila Putri',
  'Muhammad Alfaridho Daulay',
  'MUTIA LESTARI HARAHAP',
  'NASARUDDIN SIREGAR',
  'NURHABIBA SIREGAR',
  'NURUL ATIQAH',
  'PUTRI ANDRENI LUBIS',
  'RAHMA DAYANTI',
  'RIKI AZHARI NASUTION',
  'ROBY JULIANSYAH',
  'Syifah Nuraini Siregar',
  'Vasyah Adrian Matondang',
  'Yahya Risky Siregar',
  'Zahira Mughni'
];

const defaultOfficers = {
  ketua: 'Muhammad Alfaridho Daulay',
  wakil: 'Mayra Heila Putri',
  sekretaris: 'Dewi Sartika Pasaribu',
  bendahara: 'Charina Saffira Kaban'
};

function useLocalState(key, initial) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch (e) {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (e) {}
  }, [key, state]);
  return [state, setState];
}

export default function App() {
  const [theme, setTheme] = useLocalState('kelas_theme', { primary: 'teal' });
  const [rows, setRows] = useLocalState('kelas_rows', 8);
  const [cols, setCols] = useLocalState('kelas_cols', 4);
  const [seats, setSeats] = useLocalState('kelas_seats', initSeats(rows, cols));
  const [students, setStudents] = useLocalState('kelas_students', initialStudents);
  const [officers] = useLocalState('kelas_officers', defaultOfficers);

  useEffect(() => {
    // when rows/cols change, ensure seats length matches
    setSeats(prev => {
      const total = rows * cols;
      const next = prev.slice(0, total);
      while (next.length < total) next.push({ name: '', photo: '' });
      return next;
    });
  }, [rows, cols]);

  function initSeats(r, c) {
    const total = r * c;
    const arr = Array.from({ length: total }).map((_, i) => {
      return { name: '', photo: '' };
    });
    return arr;
  }

  function seatIndexToStudentName(i) {
    return students[i] || '';
  }

  function openEdit(i) {
    const value = seats[i] || { name: '', photo: '' };
    const name = value.name || seatIndexToStudentName(i) || '';
    const photo = value.photo || '';
    const newName = prompt('Masukkan nama untuk kursi ' + (i+1), name);
    if (newName === null) return;
    // simple file upload via dialog not possible here; allow paste of dataURL
    let photoData = photo;
    const upload = confirm('Apakah mau mengupload foto untuk kursi ' + (i+1) + '? (OK = iya, Cancel = tidak)');
    if (upload) {
      const dataUrl = prompt('Silakan paste Data URL gambar (misal dari tool upload atau base64). Jika tidak ada, klik Cancel.');
      if (dataUrl) photoData = dataUrl;
    }
    const next = [...seats];
    next[i] = { name: newName, photo: photoData };
    setSeats(next);
  }

  function clearSeat(i) {
    if (!confirm('Hapus nama/foto pada kursi ' + (i+1) + '?')) return;
    const next = [...seats];
    next[i] = { name: '', photo: '' };
    setSeats(next);
  }

  function resetAll() {
    if (!confirm('Reset semua denah dan data kursi?')) return;
    setSeats(initSeats(rows, cols));
  }

  function exportData() {
    const payload = { rows, cols, seats, students, theme, officers };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'kelas-viii9-data.json'; a.click();
    URL.revokeObjectURL(url);
  }

  function importData(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const obj = JSON.parse(reader.result);
        if (obj.rows) setRows(obj.rows);
        if (obj.cols) setCols(obj.cols);
        if (obj.seats) setSeats(obj.seats);
        if (obj.students) setStudents(obj.students);
        if (obj.theme) setTheme(obj.theme);
        alert('Data berhasil diimport (periksa tampilan).');
      } catch (err) {
        alert('Gagal membaca file: ' + err.message);
      }
    };
    reader.readAsText(file);
  }

  const themeClass = {
    teal: 'bg-teal-600 text-white',
    blue: 'bg-blue-600 text-white',
    purple: 'bg-purple-600 text-white',
    amber: 'bg-amber-500 text-black',
    gray: 'bg-gray-800 text-white'
  }[theme.primary] || 'bg-teal-600 text-white';

  return (
    <div className="min-h-screen">
      <header className={`${themeClass} p-6`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{schoolName}</h1>
            <p className="text-sm opacity-90">{className} — Wali Kelas: {waliKelas.name}</p>
          </div>
          <nav className="space-x-4">
            <a href="#home" className="hover:underline">Beranda</a>
            <a href="#profil" className="hover:underline">Profil</a>
            <a href="#siswa" className="hover:underline">Daftar Siswa</a>
            <a href="#denah" className="hover:underline">Denah</a>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-6">
        <section id="home" className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Selamat Datang</h2>
          <p>Website kelas interaktif. Anda dapat mengatur denah, mengisi nama dan menambahkan foto pada kursi. Data akan tersimpan di browser (localStorage).</p>
        </section>

        <section id="profil" className="bg-white rounded-xl shadow p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2">
            <h3 className="text-lg font-semibold">Profil Kelas</h3>
            <p className="mt-2">Wali Kelas: <strong>{waliKelas.name}</strong></p>
            <p className="mt-2">Ketua Kelas: {officers.ketua}</p>
            <p>Wakil Ketua: {officers.wakil}</p>
            <p>Sekretaris: {officers.sekretaris}</p>
            <p>Bendahara: {officers.bendahara}</p>
          </div>
          <div className="flex items-center justify-center">
            <div className="w-36 h-36 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-sm text-gray-500 text-center">Foto Wali Kelas<br/>(Belum diupload)</span>
            </div>
          </div>
        </section>

        <section id="siswa" className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Daftar Siswa ({students.length})</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {students.map((s, idx) => (
              <div key={idx} className="border rounded p-3 bg-gray-50">
                <div className="h-24 bg-white rounded flex items-center justify-center mb-2">
                  <span className="text-xs text-gray-400">Foto (kosong)</span>
                </div>
                <div className="text-sm font-medium">{s}</div>
              </div>
            ))}
          </div>
        </section>

        <section id="denah" className="bg-white rounded-xl shadow p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Denah Kelas (interaktif)</h3>
              <p className="text-sm text-gray-500">Klik kursi untuk mengedit nama & menempel Data URL foto (atau biarkan kosong).</p>
            </div>
            <div className="flex gap-2 items-center">
              <label className="text-sm">Theme:</label>
              <select value={theme.primary} onChange={e => setTheme({ primary: e.target.value })} className="border rounded px-2 py-1">
                <option value="teal">Teal (default)</option>
                <option value="blue">Blue</option>
                <option value="purple">Purple</option>
                <option value="amber">Amber</option>
                <option value="gray">Dark Gray</option>
              </select>

              <label className="text-sm">Rows:</label>
              <input type="number" min="1" max="12" value={rows} onChange={e => setRows(Number(e.target.value))} className="w-16 border rounded px-2 py-1" />

              <label className="text-sm">Cols:</label>
              <input type="number" min="1" max="8" value={cols} onChange={e => setCols(Number(e.target.value))} className="w-16 border rounded px-2 py-1" />

              <button onClick={resetAll} className="px-3 py-1 border rounded">Reset Denah</button>
              <button onClick={exportData} className="px-3 py-1 border rounded">Export Data</button>
              <label className="px-3 py-1 border rounded cursor-pointer">
                Import
                <input type="file" accept="application/json" onChange={importData} className="hidden" />
              </label>
            </div>
          </div>

          <div className="mt-4 grid gap-3" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}>
            {seats.map((seat, i) => (
              <div key={i} className="border rounded p-3 bg-gray-50 h-28 flex flex-col items-center justify-center">
                <div className="w-14 h-14 bg-white rounded-md flex items-center justify-center overflow-hidden">
                  {seat.photo ? <img src={seat.photo} alt="foto" className="w-full h-full object-cover"/> : <span className="text-xs text-gray-400">Foto</span>}
                </div>
                <div className="text-xs mt-2 text-center">{seat.name || `Kursi ${i+1}`}</div>
                <div className="flex gap-1 mt-2">
                  <button onClick={() => openEdit(i)} className="text-xs px-2 py-1 border rounded">Edit</button>
                  <button onClick={() => clearSeat(i)} className="text-xs px-2 py-1 border rounded">Hapus</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <footer className="text-center text-sm text-gray-500 py-6">
          © {new Date().getFullYear()} {schoolName} — {className}
        </footer>
      </main>
    </div>
  );
}

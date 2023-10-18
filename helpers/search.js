module.exports = {
  // Fungsi pencarian
  search: (data, keyword) => {
    const results = data.filter(item => {
      // Gantilah properti berikut sesuai dengan properti yang ingin Anda cari
      return item.nama.toLowerCase().includes(keyword.toLowerCase()) ||
        item.deskripsi.toLowerCase().includes(keyword.toLowerCase());
    });

    return results;
  }
};
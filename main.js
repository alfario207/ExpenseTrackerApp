/**
 * ========================================================
 * Expense Tracker App — main.js
 * ========================================================
 * Tulis seluruh kode JavaScript kamu di sini.
 */

// TODO [Basic] Buat variabel array untuk menyimpan semua data transaksi, contoh: let transactions = []

let transaction = JSON.parse(localStorage.getItem('transaction')) || []

// TODO [Basic] Buat fungsi untuk menghasilkan ID unik secara otomatis, contoh: gunakan +new Date()

function generateId() {
    return + new Date()
}

/**
 * ========================================================
 * Kriteria 1: Memanipulasi DOM untuk Form dan Daftar Transaksi
 * ========================================================
 */
// TODO [Basic] Ambil elemen kontainer incomeList dan expenseList dari DOM

const incomeList = document.getElementById("incomeList")
const expenseList = document.getElementById("expenseList")

/**
 * TODO [Basic]:
 * Buat fungsi untuk menampilkan (render) semua transaksi ke layar:
 *  - Kosongkan kontainer terlebih dahulu sebelum mengisi ulang
 *  - Gunakan perulangan, buat setiap elemen kartu dengan document.createElement()
 *  - Pastikan setiap elemen memiliki atribut data-testid yang sesuai (lihat panduan di rubrik)
 *  - Masukkan kartu ke kontainer yang tepat: income → incomeList, expense → expenseList
 */

function render() {
    incomeList.innerHTML = ""
    expenseList.innerHTML = ""

    let totalIncome = 0
    let totalExpense = 0

    transaction.forEach((item) => {
        let icon = document.createElement('div')
        
        if (item.type === 'income') {
            icon.classList.add('tracker-transaction-item__icon', 'tracker-transaction-item__icon--income')
            icon.innerText = '+'

            totalIncome += item.amount
        } else {
            icon.classList.add('tracker-transaction-item__icon', 'tracker-transaction-item__icon--expense')
            icon.innerText = '-'

            totalExpense += item.amount
        }

        const title = document.createElement('h4')
        title.setAttribute('data-testid', 'transactionItemTitle')
        title.classList.add('tracker-transaction-item__title')
        title.innerText = `${item.title}`
        
        const date = document.createElement('p')
        date.setAttribute('data-testid', 'transactionItemDate')
        date.classList.add('tracker-transaction-item__date')
        date.innerText = `${item.date}`

        const detail = document.createElement('div')
        detail.classList.add('tracker-transaction-item__detail')
        detail.append(title, date)

        let amount = document.createElement('div')
        amount.setAttribute('data-testid', 'transactionItemAmount')
        item.type === 'income' 
        ? amount.classList.add('tracker-transaction-item__amount', 'tracker-transaction-item__amount--income') 
        : amount.classList.add('tracker-transaction-item__amount', 'tracker-transaction-item__amount--expense')
        amount.innerText = `Rp ${item.amount.toLocaleString('id-ID')}`

        const ubah = document.createElement('button')
        ubah.setAttribute('data-testid', 'transactionItemEditTypeButton')
        ubah.classList.add('tracker-transaction-item__btn')
        ubah.innerText = 'Ubah'

        ubah.addEventListener('click', () => {
            changeTransaction(item.id)
        })

        const edit = document.createElement('button')
        edit.setAttribute('data-testid' ,'transactionItemEditButton')
        edit.classList.add('tracker-transaction-item__btn')
        edit.innerText = 'Edit'

        const del = document.createElement('button')
        del.setAttribute('data-testid', 'transactionItemDeleteButton')
        del.classList.add('tracker-transaction-item__btn')
        del.innerText = 'Del'

        del.addEventListener('click', () => {
            deleteTransaction(item.id)
        })

        const btnContainer = document.createElement('div')
        btnContainer.classList.add('tracker-transaction-item__actions')
        btnContainer.append(ubah, edit, del)

        const right = document.createElement('div')
        right.classList.add('tracker-transaction-item__right')
        right.append(amount, btnContainer)

        const card = document.createElement('div')
        card.setAttribute('data-testid', 'transactionItem')
        card.classList.add('tracker-transaction-item')
        card.append(icon, detail, right)

        if (item.type === 'income') {
            incomeList.append(card)
        } else {
            expenseList.append(card)
        }
    })
    
    const totalBalance = totalIncome - totalExpense

    // total.innerText = `Rp ${totalBalance.toLocaleString('id-ID')}`

    totalBalance < 0 
    ? total.innerText = `-Rp ${Math.abs(totalBalance).toLocaleString('id-ID')}`
    : total.innerText = `Rp ${totalBalance.toLocaleString('id-ID')}`

    income.innerText = `Rp ${totalIncome.toLocaleString('id-ID')}`
    expense.innerText = `Rp ${totalExpense.toLocaleString('id-ID')}`
}

// TODO [Basic] Tambahkan event listener 'submit' pada form, panggil e.preventDefault() di dalamnyao
// TODO [Basic] Di dalam handler submit, ambil nilai input lalu tambahkan sebagai objek transaksi baru ke array

document.addEventListener('DOMContentLoaded', () => {
    const transactionForm = document.getElementById('transactionForm')
    transactionForm.addEventListener('submit', (e) => {
        e.preventDefault()

        const title = document.getElementById('transactionFormTitleInput').value
        const amount = Number(document.getElementById('transactionFormAmountInput').value)
        const date = document.getElementById('transactionFormDateInput').value
        const type = document.getElementById('transactionFormTypeSelect').value

        const newTransaction = {
            id: generateId(),
            title: title,
            amount: amount,
            date: date,
            type: type            
        }

        transaction.push(newTransaction)
        saveData()
        console.log("data", transaction)
        render()
    })
    render()
})


/**
 * TODO [Skilled]:
 * Tambahkan validasi input sebelum menyimpan data:
 *  - Tampilkan alert() dan hentikan proses jika judul kosong
 *  - Tampilkan alert() dan hentikan proses jika nominal kurang dari 1
 */

/**
 * TODO [Advanced]:
 * Setiap kali data transaksi berubah, perbarui Panel Dasbor:
 *  - Hitung total pemasukan, total pengeluaran, dan saldo (pemasukan - pengeluaran)
 *  - Tampilkan hasilnya ke elemen yang sesuai di HTML
 */

const total = document.getElementById('totalBalance')
const income = document.getElementById('incomeBalance')
const expense = document.getElementById('expenseBalance')


/**
 * ========================================================
 * Kriteria 2: Mengelola Penyimpanan Data (Web Storage API)
 * ========================================================
 */
/**
 * TODO [Basic]:
 * Data transaksi disimpan ke localStorage menggunakan JSON.stringify(), dan dimuat kembali saat halaman dibuka menggunakan JSON.parse().
 *  - Tombol "Hapus" berfungsi: transaksi yang dihapus langsung hilang dari layar dan dari localStorage.
 */

function saveData() {
    localStorage.setItem('transaction', JSON.stringify(transaction))
}

function deleteTransaction(id) {
    transaction = transaction.filter((item) => item.id !== id)
    saveData()
    render()
}


/**
 * TODO [Skilled]:
 * Tombol "Edit" berfungsi: saat ditekan, formulir (#transactionForm) secara otomatis terisi dengan data transaksi yang dipilih.
 *  - Pengguna dapat mengubah data lalu menyimpan perubahan.
 *  - Formulir kembali ke mode "Tambah" setelah pembaruan selesai.
 */

/**
 * TODO [Advanced]:
 * Gunakan Custom Event sebagai penghubung antara perubahan data dan pembaruan tampilan:
 *  - Kirim sinyal dengan document.dispatchEvent(new Event('transaction:updated')) setiap kali data berubah
 *  - Pasang satu listener untuk event tersebut yang memanggil fungsi render dan update dasbor
 */


/**
 * ========================================================
 * Kriteria 3: Fitur Interaktif (Pindah Kategori dan Pencarian)
 * ========================================================
 */
/**
 * TODO [Basic]:
 * Tambahkan tombol "Ubah Tipe" pada setiap kartu transaksi:
 *  - Saat diklik, ubah tipe transaksi: 'income' → 'expense' atau 'expense' → 'income'
 *  - Simpan perubahan ke localStorage dan perbarui tampilan
 */

function changeTransaction(id) {
    transaction = transaction.map((item) => {
        if (item.id === id) {
            console.log('1', item.type)
            item.type = item.type === 'income' ? 'expense' : 'income'
        }
        console.log('2', item.type)
        return item
    })
    saveData()
    render()
}

/**
 * TODO [Skilled]:
 * Tambahkan event listener 'input' pada kolom pencarian:
 *  - Filter array transaksi berdasarkan kecocokan kata kunci dengan judul transaksi
 *  - Tampilkan hanya transaksi yang judulnya mengandung kata kunci tersebut
 */

/**
 * TODO [Advanced]:
 * Pastikan fitur pencarian berjalan dengan baik di semua kondisi:
 *  - Saat kolom pencarian dikosongkan, tampilkan kembali seluruh daftar transaksi
 */
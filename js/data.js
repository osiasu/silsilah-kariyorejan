// data.js — Salin isi data.csv Anda ke dalam template literal di bawah ini.
// File ini digunakan agar tree.html bisa dibuka langsung via file:// tanpa CORS error.
//
// Cara pakai:
//   1. Buka data.csv dengan teks editor
//   2. Salin seluruh isinya, gantikan teks "(isi data.csv Anda di sini)"
//   3. Simpan file ini
//   4. Pastikan di tree.html ada baris ini SEBELUM tag <script> utama:
//        <script src="data.js"></script>
//
// Contoh isi:
// window.CSV_DATA = `ID,Nama,Gender,Generasi,...
// 1,Rubiyem (Almh),P,1,...`;

window.CSV_DATA = `ID,Nama,Pasangan,Parent ID,Generasi,Gender
1,KYAI KARIYO REJO (Alm),NYAI KARIYO REJO (Almh),,,
2,1. Rubiyem (Almh),Pawiro Sandimin (Alm),1,1,P
3,2. Kasiyem (Almh),Pawirorejo (Alm),1,1,P
4,2.1 Mudjono (Alm),Tumini (Almh),3,2,L
5,2.1.1 Murjianto,Giyatmi,4,3,L
6,2.1.1.1. Tito Herlambang Pratama,-,5,4,L
7,2.1.2 Muryani,Supardiono,4,3,P
8,2.1.2.1 Wahyu Adnan Nursyamsi,-,7,4,L
9,2.1.2.2 Atika Nilam,-,7,4,P
10,2.1.3 Sutriyono,Ika Yeniati,4,3,L
11,2.1.3.1 Naysa Alula Fadilah,-,10,4,P
12,2.1.4 Harumsih,Basir,4,3,P
13,2.2 Mujilah,Muji Raharjo,3,2,P
14,2.2.1 Semi Lestari,Suranto,13,3,P
15,2.2.1.1 Rico Fitrianto,Farikhah,14,4,L
16,2.2.1.1.1 Razeta Ezlin Zelmira,-,15,5,P
17,2.2.1.2 Taufik Ferinanto,-,14,4,L
18,2.2.1.3 Syifa Khoirunisa,-,14,4,P
19,2.2.2 Heri Wahyono,-,13,3,L
20,2.2.3 Sri Wahyuni,Buang Haryanto,13,3,P
21,2.2.3.1 Arifin Setiawan,-,20,4,L
22,2.2.3.2 Lutfiah Setyawati,-,20,4,P
23,2.2.4 Sri Sugiyanti,Wasis Budiantoro,13,3,P
24,2.2.4.1 Anggun Bunga,-,23,4,P
25,2.2.4.2 Nirvan Bintang,-,23,4,L
26,2.2.5 Dwi Wulan Saptari,Adi Riyanto,13,3,P
27,2.2.5.1 Azzahra Nur Salma,-,26,4,P
28,2.2.5.2 Salma Sholikhatunisa,-,26,4,P
29,2.2.6 Heriyanto,Ika,13,3,L
30,2.3 Mujinah,Ponijo (Noto Raharjo),3,2,P
31,2.3.1 Partinah,Walijo Dwi Prasetyo,30,3,P
32,2.3.1.1 Alfi Anandika,-,31,4,L
33,2.3.1.2 Tiara Kurniawati,-,31,4,P
34,2.3.2 Iman Santoso,Wajiyem,30,3,L
35,2.3.2.1 Amelinda Furi Nuraini,-,34,4,P
36,2.3.2.2 Nayla Jenita Azzahra,-,34,4,P
37,2.3.2 Sunarti,Agus Prasetyo,30,3,P
38,2.3.2.1 Serlina Agatha Naysa Prasetya,-,37,4,P
39,2.4 Jumilah,Kuwat Triswanto Sudarmo,3,2,P
40,2.4.1 Martini,Ircham Sudaryanta,39,3,P
41,2.4.1.1 Afifah Najah Mei Maryan,-,40,4,P
42,2.4.2 Marjilan,Sutihat,39,3,L
43,2.4.2.1 Aditya Nugraha,-,42,4,L
44,2.4.2.2 Muhammad Arham,-,42,4,L
45,2.4.2.3 Aris,-,42,4,L
46,2.4.2.4 Alifah Kalindah,-,42,4,P
47,2.5 Juminah,Ngatijan (Purwo Utomo),3,2,P
48,2.5.1 Wijianto,Alif Latifah Hani,47,3,L
49,2.5.1.1 Aditya Latief Wijaya,-,48,4,L
50,2.5.1.2 Alfino Latief Wijaya,-,48,4,L
51,2.5.2 Wijayanti,Adam,47,3,P
52,3. Daliyem (Almh),Suwahyo (Alm),1,1,P
53,4. Mujiono (Alm),-,1,1,L
54,5. Ratiyem,Nyonoharjo (Alm),1,1,P
55,5.1 Murtiyem,Sariyo (Alm),54,2,P
56,5.1.1 Jaka Suryanta,Dina Natasari,55,3,L
57,5.1.1.1 Athallah Radhafi Suryanata,-,56,4,L
58,5.1.1.2 Athallah Arshadaanish Suryanata,-,56,4,L
59,5.1.1.3 Athallah Rasyadizaan Suryanata,-,56,4,L
60,5.1.1.4 Athallah Abdillahdzikri Suryanata,-,56,4,L
61,5.1.2 Dewi Rahmawati Wulandari,Akhmadi Anwar,55,3,P
62,5.1.3 Retno Nugraheni Wulansari,Arman Prajanto,55,3,P
63,5.2 Murjiyem (Almh),-,54,2,P
64,5.3 Suharjo (Alm),Jumini,54,2,L
65,5.3.1 Eko Didik Setyawan,Ester Fitriani Suseno,64,3,L
66,5.3.1.1 Jevan Abizar Maleeqal Mousa,-,65,4,L
67,5.3.2 Ongky Putera Wibawa,Lestiana Aninda Sari,64,3,L
68,5.3.2.1 Saafia Puteri Janeeta,-,67,4,P
69,6. Jangkep/Kisdiwiharjo (Alm),Ny. Jangkep,1,1,L
70,6.1 Sutiyem,Tukiman,69,2,P
71,6.1.1 Sunardi,Ernawati,70,3,L
72,6.1.1.1 Fenisya Arlina Pradani,-,71,4,P
73,6.1.2 Ervana,-,70,3,P
74,6.1.3 Heru Triyanto (Alm),-,70,3,L
75,6.2 Darsilah,Waljiman (Alm),69,2,P
76,6.2.1 Rahmad Widodo,Reysa Dhaniasari,75,3,L
77,6.2.1.1 Zaki Hafiz,-,76,4,L
78,6.2.1.2 Najwa Arsyla,-,76,4,P
79,6.2.2 Isti Dwi Astuti,Arif Ardi Nugroho,75,3,P
80,6.2.2.1 Nurani Merah Merona,-,79,4,P
81,6.3 Supriyanto,Aulia Febriyanti,69,2,L
82,6.3.1 Lucky Eka Candra Supriyanto,-,81,3,L
83,6.3.2 Calpin Dwi Lintang Supriyanto,-,81,3,L
84,6.4 Pargiyati,Subadi,69,2,P
85,6.4.1 Andhika Yusuf Priambada,-,84,3,L
86,6.4.2 Alfian Rosyid Priambada,-,84,3,L
87,6.5 Sudarmanto,Yuni Palupi,69,2,L
88,6.5.1 Dzakia Ayunda Safitri,-,87,3,P
89,7. Walji Hanafi (Alm),Masiroh (Almh)	,1,1,L
90,7. Walji Hanafi (Alm),Sulistriyani (Almh),1,1,L
91,7.1 Rahmat Nugroho,Muthia Ulfah Yarisma,89,2,L
92,7.1.1 Rozin Abdul Fattah,-,91,3,L
93,7.1.2 Rizan Zen Abdul Fattah,-,91,3,L
94,7.1.3 Alifah Hanun Nur Rahmah,-,91,3,L
95,7.2 Dewi Novitasari,Rinanto Suryadhimirtha,90,2,P
96,7.2.1 Aisyah Aulia Larasati,-,95,3,P
97,7.3 Noor Ihsanuddin,Lilia Amarwani,90,2,L
98,7.3.1 Akhtar Farzan Sabily,-,97,3,L
`;

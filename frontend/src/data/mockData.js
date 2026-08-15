import React from 'react';

// --- MOCK DATABASE ---
export const PRODUCTS = [
  {
    id: 'prod-1',
    title: 'Casio FX-991EX ClassWiz Scientific Calculator',
    category: 'electronics',
    categoryLabel: 'Electronics & Accessories',
    price: 1299.00,
    originalPrice: 1599.00,
    rating: 4.9,
    reviews: 340,
    delivery: 'Delivery in 1 hr',
    image: 'https://images.unsplash.com/photo-1574634534894-89d7576c8259?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'prod-2',
    title: 'Classmate Pulse Premium Notebooks (Pack of 6)',
    category: 'study',
    categoryLabel: 'Study Essentials',
    price: 180.00,
    originalPrice: 240.00,
    rating: 4.8,
    reviews: 185,
    delivery: 'Delivery today',
    image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'prod-3',
    title: 'Heavy Duty Metal Mesh Desk Organizer',
    category: 'hostel',
    categoryLabel: 'Hostel Essentials',
    price: 299.00,
    originalPrice: 399.00,
    rating: 4.5,
    reviews: 92,
    delivery: 'Delivery tomorrow',
    image: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'prod-4',
    title: 'Official CampusHub Insulated Smart Water Bottle',
    category: 'merchandise',
    categoryLabel: 'College Merchandise',
    price: 399.00,
    originalPrice: 499.00,
    rating: 4.7,
    reviews: 65,
    delivery: 'Delivery today',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'prod-5',
    title: 'Ergonomic Aluminum Foldable Laptop Stand',
    category: 'electronics',
    categoryLabel: 'Electronics & Accessories',
    price: 799.00,
    originalPrice: 999.00,
    rating: 4.6,
    reviews: 110,
    delivery: 'Delivery in 2 hrs',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'prod-6',
    title: 'Organic Lavender Hostel Aromatherapy Room Diffuser',
    category: 'personal',
    categoryLabel: 'Personal Care',
    price: 499.00,
    originalPrice: 699.00,
    rating: 4.4,
    reviews: 48,
    delivery: 'Delivery tomorrow',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'prod-7',
    title: 'Premium Fleece Varsity Hoodie (Royal Navy Edition)',
    category: 'merchandise',
    categoryLabel: 'College Merchandise',
    price: 1299.00,
    originalPrice: 1799.00,
    rating: 4.8,
    reviews: 215,
    delivery: 'Delivery today',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'prod-8',
    title: 'Hardbound Grid-Line Engineering Project Journal',
    category: 'study',
    categoryLabel: 'Study Essentials',
    price: 120.00,
    originalPrice: 150.00,
    rating: 4.7,
    reviews: 54,
    delivery: 'Delivery in 1 hr',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=400'
  }
];

export const RAW_CATALOG = {
  study: {
    label: '📚 Study Essentials',
    items: [
      { name: 'Notebooks', price: 60, original: 80, img: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?auto=format&fit=crop&q=80&w=400' },
      { name: 'Registers', price: 80, original: 100, img: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&q=80&w=400' },
      { name: 'Pens', price: 10, original: 15, img: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&q=80&w=400' },
      { name: 'Pencils', price: 5, original: 8, img: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=400' },
      { name: 'Highlighters', price: 40, original: 50, img: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=400' },
      { name: 'Markers', price: 25, original: 30, img: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=400' },
      { name: 'Sticky Notes', price: 45, original: 60, img: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&q=80&w=400' },
      { name: 'Index Cards', price: 35, original: 50, img: 'https://images.unsplash.com/photo-1605870445919-838d190e8e1b?auto=format&fit=crop&q=80&w=400' },
      { name: 'Files & Folders', price: 75, original: 100, img: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=400' },
      { name: 'Drawing Sheets', price: 50, original: 70, img: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=400' },
      { name: 'Graph Paper', price: 20, original: 30, img: 'https://images.unsplash.com/photo-1580828343064-fde4fc206bc6?auto=format&fit=crop&q=80&w=400' },
      { name: 'Lab Record Books', price: 120, original: 150, img: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&q=80&w=400' },
      { name: 'Calculators', price: 399, original: 499, img: 'https://images.unsplash.com/photo-1574634534894-89d7576c8259?auto=format&fit=crop&q=80&w=400' },
      { name: 'Geometry Box', price: 150, original: 180, img: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=400' },
      { name: 'Scientific Calculator', price: 1299, original: 1599, img: 'https://images.unsplash.com/photo-1611078489935-0cb964de46d6?auto=format&fit=crop&q=80&w=400' },
      { name: 'Whiteboard', price: 349, original: 499, img: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=400' },
      { name: 'Whiteboard Marker', price: 25, original: 35, img: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&q=80&w=400' },
      { name: 'Eraser', price: 5, original: 10, img: 'https://images.unsplash.com/photo-1602722851756-3c224213d256?auto=format&fit=crop&q=80&w=400' },
      { name: 'Sharpener', price: 5, original: 10, img: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1141?auto=format&fit=crop&q=80&w=400' },
      { name: 'Scale', price: 15, original: 20, img: 'https://images.unsplash.com/photo-1607513746994-51f730a44832?auto=format&fit=crop&q=80&w=400' },
      { name: 'Glue Stick', price: 25, original: 35, img: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&q=80&w=400' },
      { name: 'Tape', price: 15, original: 20, img: 'https://images.unsplash.com/photo-1596701358999-70233076ff7a?auto=format&fit=crop&q=80&w=400' }
    ]
  },
  electronics: {
    label: '💻 Electronics & Accessories',
    items: [
      { name: 'Laptop Charger', price: 1200, original: 1500, img: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=400' },
      { name: 'Mobile Charger', price: 499, original: 699, img: 'https://images.unsplash.com/photo-1619176317589-cf284bfdb582?auto=format&fit=crop&q=80&w=400' },
      { name: 'Charging Cable', price: 199, original: 299, img: 'https://images.unsplash.com/photo-1541667590-f769d6c25c95?auto=format&fit=crop&q=80&w=400' },
      { name: 'USB Hub', price: 599, original: 799, img: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&q=80&w=400' },
      { name: 'Pendrive', price: 399, original: 599, img: 'https://images.unsplash.com/photo-1601524909162-be87252be298?auto=format&fit=crop&q=80&w=400' },
      { name: 'SSD', price: 3499, original: 4999, img: 'https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?auto=format&fit=crop&q=80&w=400' },
      { name: 'Mouse', price: 299, original: 499, img: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&q=80&w=400' },
      { name: 'Keyboard', price: 599, original: 999, img: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&q=80&w=400' },
      { name: 'Mouse Pad', price: 150, original: 250, img: 'https://images.unsplash.com/photo-1603899122634-f086ca5f5ddd?auto=format&fit=crop&q=80&w=400' },
      { name: 'Laptop Stand', price: 799, original: 999, img: 'https://images.unsplash.com/photo-1625766763788-95dcce9bf5ac?auto=format&fit=crop&q=80&w=400' },
      { name: 'Cooling Pad', price: 899, original: 1199, img: 'https://images.unsplash.com/photo-1591871937573-74dbba515c4c?auto=format&fit=crop&q=80&w=400' },
      { name: 'Earphones', price: 399, original: 599, img: 'https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?auto=format&fit=crop&q=80&w=400' },
      { name: 'Headphones', price: 1499, original: 1999, img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400' },
      { name: 'Webcam', price: 1500, original: 2200, img: 'https://images.unsplash.com/photo-1602758153401-44754320f666?auto=format&fit=crop&q=80&w=400' },
      { name: 'Power Bank', price: 1299, original: 1799, img: 'https://images.unsplash.com/photo-1609592806453-69b1896ec37c?auto=format&fit=crop&q=80&w=400' },
      { name: 'HDMI Cable', price: 250, original: 350, img: 'https://images.unsplash.com/photo-1558244661-d248897f7bc4?auto=format&fit=crop&q=80&w=400' },
      { name: 'Extension Board', price: 399, original: 599, img: 'https://images.unsplash.com/photo-1624996379697-f01d168b1a52?auto=format&fit=crop&q=80&w=400' },
      { name: 'Adapter', price: 299, original: 399, img: 'https://images.unsplash.com/photo-1592832122594-c0c6bad74837?auto=format&fit=crop&q=80&w=400' },
      { name: 'Multi Plug', price: 199, original: 299, img: 'https://images.unsplash.com/photo-1585695029497-6a457497d391?auto=format&fit=crop&q=80&w=400' }
    ]
  },
  hostel: {
    label: '🏠 Hostel Room Essentials',
    items: [
      { name: 'Bucket', price: 150, original: 200, img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400' },
      { name: 'Mug', price: 30, original: 50, img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=400' },
      { name: 'Hangers', price: 99, original: 150, img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=400' },
      { name: 'Lock', price: 180, original: 250, img: 'https://images.unsplash.com/photo-1610484826967-09c5720778c7?auto=format&fit=crop&q=80&w=400' },
      { name: 'Laundry Basket', price: 299, original: 399, img: 'https://images.unsplash.com/photo-1595341888016-a392efc50346?auto=format&fit=crop&q=80&w=400' },
      { name: 'Clothes Drying Rope', price: 49, original: 80, img: 'https://images.unsplash.com/photo-1528642474498-1af0c17fd8c3?auto=format&fit=crop&q=80&w=400' },
      { name: 'Bedsheet', price: 399, original: 599, img: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=400' },
      { name: 'Pillow Cover', price: 99, original: 150, img: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&q=80&w=400' },
      { name: 'Blanket', price: 899, original: 1299, img: 'https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?auto=format&fit=crop&q=80&w=400' },
      { name: 'Mattress Protector', price: 499, original: 799, img: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=400' },
      { name: 'Table Lamp', price: 450, original: 600, img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=400' },
      { name: 'Study Lamp', price: 399, original: 550, img: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&q=80&w=400' },
      { name: 'Desk Organizer', price: 249, original: 349, img: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&q=80&w=400' },
      { name: 'Dustbin', price: 80, original: 120, img: 'https://images.unsplash.com/photo-1574966737967-df5072049e6f?auto=format&fit=crop&q=80&w=400' },
      { name: 'Storage Box', price: 199, original: 299, img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=400' },
      { name: 'Shoe Rack', price: 599, original: 799, img: 'https://images.unsplash.com/photo-1596079890744-c1a0462d0975?auto=format&fit=crop&q=80&w=400' },
      { name: 'Mirror', price: 150, original: 250, img: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=400' }
    ]
  },
  personal: {
    label: '🧴 Personal Care',
    items: [
      { name: 'Toothbrush', price: 30, original: 40, img: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&q=80&w=400' },
      { name: 'Toothpaste', price: 90, original: 110, img: 'https://images.unsplash.com/photo-1559599141-3816a0843111?auto=format&fit=crop&q=80&w=400' },
      { name: 'Shampoo', price: 180, original: 220, img: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&q=80&w=400' },
      { name: 'Conditioner', price: 199, original: 250, img: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=400' },
      { name: 'Soap', price: 40, original: 50, img: 'https://images.unsplash.com/photo-1607006342456-ba275cd3a7b6?auto=format&fit=crop&q=80&w=400' },
      { name: 'Face Wash', price: 150, original: 199, img: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=400' },
      { name: 'Moisturizer', price: 199, original: 249, img: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=400' },
      { name: 'Comb', price: 20, original: 30, img: 'https://images.unsplash.com/photo-1590156546946-ce55a12a6a5d?auto=format&fit=crop&q=80&w=400' },
      { name: 'Hair Oil', price: 99, original: 120, img: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=400' },
      { name: 'Razor', price: 80, original: 100, img: 'https://images.unsplash.com/photo-1613679021487-22485458f2f6?auto=format&fit=crop&q=80&w=400' },
      { name: 'Shaving Cream', price: 110, original: 140, img: 'https://images.unsplash.com/photo-1626017122180-2a74c10a46f7?auto=format&fit=crop&q=80&w=400' },
      { name: 'Towel', price: 299, original: 399, img: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&q=80&w=400' },
      { name: 'Nail Cutter', price: 50, original: 75, img: 'https://images.unsplash.com/photo-1628149455678-de663e0dc9c4?auto=format&fit=crop&q=80&w=400' },
      { name: 'Deodorant', price: 199, original: 249, img: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=400' },
      { name: 'Sanitizer', price: 40, original: 50, img: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=400' },
      { name: 'Wet Wipes', price: 60, original: 80, img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400' },
      { name: 'Tissue Paper', price: 50, original: 70, img: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&q=80&w=400' },
      { name: 'Cotton Buds', price: 30, original: 45, img: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=400' }
    ]
  },
  clothing: {
    label: '👕 Clothing Essentials',
    items: [
      { name: 'College Hoodie', price: 1299, original: 1699, img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=400' },
      { name: 'T-Shirts', price: 299, original: 499, img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=400' },
      { name: 'Socks', price: 99, original: 149, img: 'https://images.unsplash.com/photo-1582966772680-860e372bb558?auto=format&fit=crop&q=80&w=400' },
      { name: 'Slippers', price: 199, original: 299, img: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=400' },
      { name: 'Raincoat', price: 499, original: 699, img: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=80&w=400' },
      { name: 'Umbrella', price: 299, original: 399, img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=400' },
      { name: 'Laundry Bag', price: 149, original: 199, img: 'https://images.unsplash.com/photo-1616906757947-fdf20dc55806?auto=format&fit=crop&q=80&w=400' }
    ]
  },
  kitchen: {
    label: '🍽 Kitchen & Utility',
    items: [
      { name: 'Electric Kettle', price: 799, original: 1199, img: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=400' },
      { name: 'Coffee Mug', price: 150, original: 200, img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=400' },
      { name: 'Water Bottle', price: 199, original: 299, img: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=400' },
      { name: 'Lunch Box', price: 249, original: 349, img: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&q=80&w=400' },
      { name: 'Spoon Set', price: 99, original: 149, img: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=400' },
      { name: 'Plate', price: 80, original: 120, img: 'https://images.unsplash.com/photo-1589589982755-d4122dcc9a3d?auto=format&fit=crop&q=80&w=400' },
      { name: 'Bowl', price: 60, original: 90, img: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&q=80&w=400' },
      { name: 'Flask', price: 499, original: 699, img: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=400' },
      { name: 'Storage Containers', price: 199, original: 299, img: 'https://images.unsplash.com/photo-1539683255143-73a6b838b106?auto=format&fit=crop&q=80&w=400' }
    ]
  },
  printing: {
    label: '🖨 Printing & Services',
    items: [
      { name: 'Print Notes', price: 2, original: 4, img: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=400' },
      { name: 'Colour Printing', price: 10, original: 15, img: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=400' },
      { name: 'Black & White Printing', price: 2, original: 3, img: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=400' },
      { name: 'Spiral Binding', price: 49, original: 79, img: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=400' },
      { name: 'Project Binding', price: 199, original: 299, img: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=400' },
      { name: 'Lamination', price: 30, original: 50, img: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=400' },
      { name: 'ID Card Printing', price: 50, original: 80, img: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=400' },
      { name: 'Photo Printing', price: 15, original: 25, img: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=400' }
    ]
  },
  merchandise: {
    label: '🎓 College Merchandise',
    items: [
      { name: 'College Hoodie', price: 1299, original: 1799, img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=400' },
      { name: 'College T-Shirt', price: 499, original: 699, img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=400' },
      { name: 'ID Card Holder', price: 50, original: 75, img: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=400' },
      { name: 'Lanyard', price: 40, original: 60, img: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=400' },
      { name: 'College Diary', price: 199, original: 299, img: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=400' },
      { name: 'College Cap', price: 299, original: 399, img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=400' },
      { name: 'Stickers', price: 29, original: 49, img: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&q=80&w=400' }
    ]
  },
  marketplace: {
    label: '🔄 Second-Hand Market',
    items: [
      { name: 'Engineering Books', price: 350, original: 800, img: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400', seller: 'Sarah M. (Junior, CS)' },
      { name: 'Novels', price: 150, original: 350, img: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400', seller: 'Pooja V. (Senior, Mech)' },
      { name: 'Calculators', price: 500, original: 1200, img: 'https://images.unsplash.com/photo-1611078489935-0cb964de46d6?auto=format&fit=crop&q=80&w=400', seller: 'Rajesh K. (Senior, EE)' },
      { name: 'Lab Coats', price: 150, original: 300, img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=400', seller: 'Daniel T. (Sophomore, Bio)' },
      { name: 'Drawing Boards', price: 200, original: 500, img: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=400', seller: 'Aarav S. (Sophomore, EE)' },
      { name: 'Laptop', price: 18000, original: 45000, img: 'https://images.unsplash.com/photo-1603899122634-f086ca5f5ddd?auto=format&fit=crop&q=80&w=400', seller: 'Priya N. (Senior, Mech)' },
      { name: 'Monitor', price: 4000, original: 9000, img: 'https://images.unsplash.com/photo-1603899122634-f086ca5f5ddd?auto=format&fit=crop&q=80&w=400', seller: 'Sarah M. (Junior, CS)' },
      { name: 'Keyboard', price: 300, original: 800, img: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&q=80&w=400', seller: 'Rajesh K. (Senior, EE)' },
      { name: 'Mouse', price: 150, original: 400, img: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&q=80&w=400', seller: 'Rajesh K. (Senior, EE)' },
      { name: 'Hostel Furniture', price: 800, original: 2000, img: 'https://images.unsplash.com/photo-1564758564527-b97d79cb27c1?auto=format&fit=crop&q=80&w=400', seller: 'Daniel T. (Sophomore, Bio)' },
      { name: 'Cycle', price: 2000, original: 5000, img: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=400', seller: 'Sarah M. (Junior, CS)' }
    ]
  },
  services: {
    label: '🛠 Campus Services',
    items: [
      { name: 'Laptop Cleaning', price: 799, original: 999, img: 'https://images.unsplash.com/photo-1603899122634-f086ca5f5ddd?auto=format&fit=crop&q=80&w=400' },
      { name: 'Keyboard Cleaning', price: 199, original: 299, img: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&q=80&w=400' },
      { name: 'Device Setup', price: 499, original: 699, img: 'https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?auto=format&fit=crop&q=80&w=400' },
      { name: 'Hostel Room Cleaning', price: 299, original: 399, img: 'https://images.unsplash.com/photo-1564758564527-b97d79cb27c1?auto=format&fit=crop&q=80&w=400' },
      { name: 'Water Can Booking', price: 50, original: 60, img: 'https://images.unsplash.com/photo-1564758564527-b97d79cb27c1?auto=format&fit=crop&q=80&w=400' },
      { name: 'Courier Pickup', price: 99, original: 149, img: 'https://images.unsplash.com/photo-1564758564527-b97d79cb27c1?auto=format&fit=crop&q=80&w=400' },
      { name: 'Parcel Collection', price: 49, original: 79, img: 'https://images.unsplash.com/photo-1564758564527-b97d79cb27c1?auto=format&fit=crop&q=80&w=400' },
      { name: 'Document Delivery', price: 39, original: 59, img: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=400' }
    ]
  },
  combos: {
    label: '📦 Student Combo Packs',
    items: [
      { name: 'Freshers Kit', price: 999, original: 1499, img: 'https://images.unsplash.com/photo-1564758564527-b97d79cb27c1?auto=format&fit=crop&q=80&w=400', items: ['Bucket', 'Mug', 'Lock', 'Hangers', 'Bedsheet'] },
      { name: 'Exam Kit', price: 1499, original: 1999, img: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&q=80&w=400', items: ['Notebook', 'Pens', 'Highlighter', 'Sticky Notes', 'Calculator'] },
      { name: 'Placement Kit', price: 1799, original: 2499, img: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&q=80&w=400', items: ['Resume Folder', 'Notebook', 'Pen', 'Laptop Stand', 'Webcam'] },
      { name: 'Lab Kit', price: 599, original: 899, img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=400', items: ['Lab Coat', 'Calculator', 'Record File', 'Stationery'] }
    ]
  }
};

export const CATALOG_PRODUCTS = [];
Object.entries(RAW_CATALOG).forEach(([catKey, catVal]) => {
  catVal.items.forEach((item, idx) => {
    CATALOG_PRODUCTS.push({
      id: `bp-${catKey}-${idx}`,
      title: item.name,
      category: catKey,
      categoryLabel: catVal.label,
      price: item.price,
      originalPrice: item.original,
      image: item.img,
      desc: item.desc || `Premium quality ${item.name} for college students. Sourced and delivered hyperlocal.`,
      items: item.items || null,
      seller: item.seller || null,
      sellerImg: item.seller ? 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100' : null,
      delivery: catKey === 'services' ? 'Scheduled Booking' : 'Delivery in 15 mins'
    });
  });
});

export const SERVICES = [
  {
    id: 'srv-1',
    title: 'Print & Deliver',
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
    ),
    description: 'Upload files (PDFs, PPTs) and get double-sided prints delivered to your hostel door.',
    price: 2.00,
    unit: 'per page',
    status: 'Active',
    image: '/srv_print.jpg'
  },
  {
    id: 'srv-2',
    title: 'Laptop Deep Clean',
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
      </svg>
    ),
    description: 'Internal dust removal, thermal paste application, and external sanitization.',
    price: 799.00,
    unit: 'fixed',
    status: 'Book Slot',
    image: '/srv_laptop.jpg'
  },
  {
    id: 'srv-3',
    title: 'Spiral & Soft Binding',
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-16.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-16.25v16.25" />
      </svg>
    ),
    description: 'Transform loose pages, records, or theses into neat professional soft-bound booklets.',
    price: 49.00,
    unit: 'per book',
    status: 'Active',
    image: '/srv_binding.jpg'
  },
  {
    id: 'srv-4',
    title: 'Room Essentials Kit Setup',
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
      </svg>
    ),
    description: 'Full unboxing and setup service of beds, study table attachments, and organizers.',
    price: 499.00,
    unit: 'service',
    status: 'Book Slot',
    image: '/srv_setup.jpg'
  },
  {
    id: 'srv-5',
    title: 'Water Can Booking',
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.893 13.393c-.097.35-.376.629-.726.726l-3.327.917c-.35.096-.729-.098-.826-.448l-.917-3.327c-.096-.35.098-.729.448-.826l3.327-.917c.35-.096.729.098.826.448l.917 3.327ZM2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Z" />
      </svg>
    ),
    description: '20L purified drinking water bubble top delivered directly inside your hostel room.',
    price: 50.00,
    unit: 'can',
    status: 'Active',
    image: '/srv_water.jpg'
  }
];

export const COMBOS = [
  {
    id: 'combo-1',
    title: 'Semester Exam Prep Kit',
    tag: 'Popular',
    desc: 'Top grade scoring essentials to beat the final exam pressure.',
    items: ['2x Premium Gel Pens', 'Casio FX-991EX Calculator', 'Grid notebook', 'Sticky Notes pack', '1x Energy Drink Can'],
    price: 1499.00,
    originalPrice: 1999.00,
    image: '/combo_exam_kit.png'
  },
  {
    id: 'combo-2',
    title: 'Campus Freshers Kit',
    tag: 'Must Have',
    desc: 'The complete starter pack to gear up with campus style & utility.',
    items: ['Official Varsity Hoodie', 'Insulated Smart Water Bottle', 'Campus Lanyard & Badge Holder', 'Campus Hub Sticker Pack'],
    price: 1799.00,
    originalPrice: 2499.00,
    image: '/combo_freshers_kit.png'
  },
  {
    id: 'combo-3',
    title: 'Hostel Starter Kit',
    tag: 'Hostel Favorite',
    desc: 'No-fuss basic accessories to turn a bare room into your cozy den.',
    items: ['Comfort Cotton Bedsheet', 'Sleek Bedside Clamp Lamp', 'Desk Stationery Cup Holder', '10x Laundry Clothes Hangers'],
    price: 999.00,
    originalPrice: 1499.00,
    image: '/combo_hostel_kit.png'
  },
  {
    id: 'combo-4',
    title: 'Placement Crack Kit',
    tag: 'Trending',
    desc: 'Dress and prepare to impress the hiring recruiters.',
    items: ['Executive PU Leather File Folder', 'Premium Rollerball Pen', '10x Printed Resumes (Premium Paper)', 'Interview prep guide booklet'],
    price: 599.00,
    originalPrice: 899.00,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400'
  }
];

export const MARKETPLACE = [
  {
    id: 'market-1',
    title: 'Thomas Calculus Textbook (14th Edition)',
    condition: 'good',
    conditionLabel: 'Good Condition',
    desc: 'Mild pencil highlights on first 3 chapters. No torn pages. Used for Semester 1.',
    price: 350.00,
    tag: 'Books',
    seller: 'Rajesh K. (Senior, EE)',
    sellerImg: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100',
    image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'market-2',
    title: 'Texas Instruments TI-84 Plus CE',
    condition: 'excellent',
    conditionLabel: 'Like New',
    desc: 'Includes charger and original box cover. Screen has zero scratches. Used only for SAT exams.',
    price: 4500.00,
    tag: 'Electronics',
    seller: 'Sarah M. (Junior, CS)',
    sellerImg: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100',
    image: 'https://images.unsplash.com/photo-1611078489935-0cb964de46d6?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'market-3',
    title: 'Campus Lab Coat (Size L)',
    condition: 'excellent',
    conditionLabel: 'Excellent',
    desc: 'Freshly washed. No chemical stains. Emblazoned with chemistry department logo.',
    price: 250.00,
    tag: 'Apparel',
    seller: 'Daniel T. (Sophomore, Bio)',
    sellerImg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'market-4',
    title: 'USB Clip-on Study Desk Fan',
    condition: 'fair',
    conditionLabel: 'Fairly Used',
    desc: 'Fully functional, rotates at 3 speeds. Plugs into laptop or powerbank. Ideal for summer hostel heat.',
    price: 150.00,
    tag: 'Hostel',
    seller: 'Pooja V. (Senior, Mech)',
    sellerImg: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100',
    image: 'https://images.unsplash.com/photo-1591871937573-74dbba515c4c?auto=format&fit=crop&q=80&w=400'
  }
];

const userRolesData = [
  {
    title: 'Admin',
    icon: 'fas fa-user-circle',
    childrens: [
      { id: 1, name: 'Users', path: '/Users', icon: 'fa-solid fa-user-plus' },
      {
        id: 21,
        name: 'View Query Admin',
        path: '/viewQuery/admin',
        icon: 'fa-solid fa-thumbs-up',
        notification: true,
      },
    ],
  },
  {
    title: 'Products',
    icon: 'fa-brands fa-product-hunt',
    childrens: [
      {
        id: 31,
        name: 'Product List',
        path: '/product-list',
        icon: 'fas fa-list',
      },
      {
        id: 25,
        name: 'Add Product',
        path: '/addRoboProduct',
        icon: 'fas fa-plus',
      },
      {
        id: 32,
        name: 'Add Brand',
        path: '/addBrand',
        icon: 'fas fa-plus',
      },
      {
        id: 2,
        name: 'Update Product',
        path: '/UpdateSellerPrice',
        icon: 'fa-solid fa-pen-to-square',
      },
      {
        id: 3,
        name: 'Product Status',
        path: '/ProductStatus',
        icon: 'fa-solid fa-list',
      },
      {
        id: 4,
        name: 'Price History',
        path: '/PriceHistory',
        icon: 'fa-solid fa-hand-holding-dollar',
      },
    ],
  },
  {
    title: 'Wholesale Buyer',
    icon: 'fas fa-shopping-cart',
    childrens: [
      {
        id: 5,
        name: 'Sellers List',
        path: '/AllSellerList',
        icon: 'fa-solid fa-list',
      },
      {
        id: 6,
        name: 'Seller Orders',
        path: '/orders',
        icon: 'fa-solid fa-list',
      },
      {
        id: 7,
        name: 'Seller Req',
        path: '/sellerVerify',
        icon: 'fa-solid fa-user-plus',
      },
    ],
  },

  {
    title: 'Account',
    icon: 'fas fa-user',
    childrens: [
      {
        id: 30,
        name: 'Calculator',
        path: '/calc',
        icon: 'fa-solid fa-calculator',
      },
      {
        id: 30,
        name: 'Saved Calc',
        path: '/savedCalc',
        icon: 'fa-solid fa-calculator',
      },
    ],
  },

  {
    title: 'Sales',
    icon: 'fas fa-chart-line',
    childrens: [
      {
        id: 11,
        name: 'Upload Image',
        path: '/uploadimage',
        icon: 'fa-solid fa-image',
      },
      {
        id: 22,
        name: 'Create Query',
        path: '/discountquery',
        icon: 'fa-solid fa-tag',
      },
      {
        id: 23,
        name: 'View Query',
        path: '/viewQuery',
        icon: 'fa-solid fa-tag',
      },
      {
        id: 29,
        name: 'Sales Details',
        path: '/salesDetails',
        icon: 'fa-solid fa-tag',
      },
    ],
  },
  {
    title: 'Approval',
    icon: 'fa fa-check-square',
    childrens: [
      {
        id: 16,
        name: 'Stock Approval',
        path: '/Approval/Quantity',
        icon: 'fa-solid fa-thumbs-up',
        notification: true,
      },
      {
        id: 17,
        name: 'MRP Approval',
        path: '/Approval/MRP',
        icon: 'fa-solid fa-thumbs-up',
        notification: true,
      },
      {
        id: 18,
        name: 'SalesPrice Approval',
        path: '/Approval/SalesPrice',
        icon: 'fa-solid fa-thumbs-up',
        notification: true,
      },
      {
        id: 19,
        name: 'SellerPrice Approval',
        path: '/Approval/SellerPrice',
        icon: 'fa-solid fa-thumbs-up',
        notification: true,
      },
      {
        id: 20,
        name: 'Cost Approval',
        path: '/Approval/LandingCost',
        icon: 'fa-solid fa-thumbs-up',
        notification: true,
      },
    ],
  },
];

// totla routes are 33 add routes aftrer 33

export default userRolesData;

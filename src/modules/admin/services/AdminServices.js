import axiosPrivate from "../../../core/api/HttpPrivate";

const loginAdmin = async (email, password) => {
  try {
    const data = {
      username: email,
      password: password,
    };
    const response = await axiosPrivate.post("/auth/login", data);

    return response.data;
  } catch (error) {
    return error;
  }
};

const getReportOrders = async () => {
  try {
    const response = await axiosPrivate.get("/order/getReportOrders");

    return response.data;
  } catch (error) {
    return error;
  }
};

const getCategoriesByStatus = async () => {
  try {
    const response = await axiosPrivate.get("/category/getByStatus/enable");

    return response.data;
  } catch (error) {
    return error;
  }
};

const getProducts = async () => {
  try {
    const response = await axiosPrivate.get("/product/getAll");

    return response.data;
  } catch (error) {
    return error;
  }
};

const getProductDetails = async (numberProduct) => {
  try {
    const response = await axiosPrivate.get(
      `/product/getDetails/${numberProduct}`
    );

    return response.data;
  } catch (error) {
    return error;
  }
};
const getAllCategories = async () => {
  try {
    const response = await axiosPrivate.get("/category/getAll");

    return response.data;
  } catch (error) {
    return error;
  }
};
const deleteCategory = async (name) => {
  try {

    const response = await axiosPrivate.delete(`/category/delete/${name}`)

    return response.data;
  } catch (error) {
    return error;
  }
};
const updateCategory = async (name, description) => {
  try {
    const category = {
      categoryName: name,
      categoryDescription: description,
    };
    const response = await axiosPrivate.put("/category/update", category);
    return response.data;
  } catch (error) {
    return error;
  }
};

const getAllUsers = async () => {
  try {
    const response = await axiosPrivate.get("/user/getAll");

    return response.data;
  } catch (error) {
    return error;
  }
}

const updateStatusUser = async (email, status) => {
  try {
    const user = {
      email: email,
      status: status,
    };
    const response = await axiosPrivate.post("/user/updateStatus", user);
    return response.data;
  } catch (error) {
    return error;
  }
}

const getAttributesByName = async (name) => {
  try {
    const response = await axiosPrivate.get(`/attribute/getByName/${name}`);
    return response.data;
  } catch (error) {
    return error;
  }
};
const getAttributesAvailable = async (numProduct) => {
  try {
    const response = await axiosPrivate.get(
      `/attribute/getAttributesAvailable/${numProduct}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

const getCountProducts = async () => {
  try {
    const response = await axiosPrivate.get("/product/countProducts");

    return response.data;
  } catch (error) {
    return error;
  }
};

const getCountUsers = async () => {
  try {
    const response = await axiosPrivate.get("/user/countUsers/enable");

    return response.data;
  } catch (error) {
    return error;
  }
};

const getCountOrders = async () => {
  try {
    const response = await axiosPrivate.get("/order/countOrders");

    return response.data;
  } catch (error) {
    return error;
  }
};
const getVariants = async (numProduct) => {
  try {
    const response = await axiosPrivate.get(
      `/product/getVariants/${numProduct}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

const getVariantDetails = async (numVariant) => {
  try {
    const response = await axiosPrivate.get(
      `/product/getVariantDetails/${numVariant}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

const addProduct = async (data) => {
  try {
    const response = await axiosPrivate.post("/product/addProduct", data);
    return response.data;
  } catch (error) {
    return error;
  }
};

const updateProduct = async (data) => {
  try {
    const response = await axiosPrivate.post("/product/updateProduct", data);
    return response.data;
  } catch (error) {
    return error;
  }
};

const addVariant = async (price, color, stock, files, numProduct) => {
  try {
    const formData = new FormData();
    formData.append("price", price);
    formData.append("color", color);
    formData.append("stock", stock);
    formData.append("numProduct", numProduct);
    files.forEach(({ file }) => {
      formData.append("imagesDtoList", file);
    });

    const response = await axiosPrivate.post(
      "/product/addProductVariantWithImages",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

const updateVariant = async (data) => {
  try {
    const response = await axiosPrivate.post(
      "/product/updateProductVariantWithImages",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    return error;
  }
};
const addCategory = async (name, description) => {
  try {
    const category = {
      categoryName: name,
      categoryDescription: description,
    };

    const response = await axiosPrivate.post("/category/register", category);

    return response.data;
  } catch (error) {
    return error;
  }
};

const getAllOrders = async () => {
  try {
    const response = await axiosPrivate.get("/order/getAllOrders");
    return response.data;
  } catch (error) {
    return error;
  }
};

const getOrderByNumOrder = async (numOrder) => {
  try {
    const response = await axiosPrivate.get(`/order/getOrderByNumOrder/${numOrder}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

const updateStatusOrder = async (numOrder) => {
  try {
    const response = await axiosPrivate.post(`/order/updateStatusOrder?numOrder=${numOrder}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

const updateStatusProduct = async (numProduct, status) => {
  try {
    const product = {
      numProduct: numProduct,
      status: status,
    };
    const response = await axiosPrivate.post(`/product/updateStatusProduct`, product);
    return response.data;
  } catch (error) {
    return error;
  }
};
const updateAppAndroid = async (url) => {
  try {
    const response = await axiosPrivate.put("/linkapp/updateLinkAppAndroid", url);
    return response.data;
  } catch (error) {
    return error;
  }
};
const updateAppIos = async (url) => {
  try {
    const response = await axiosPrivate.put("/linkapp/updateLinkAppIos", url);
    return response.data;
  } catch (error) {
    return error;
  }
};
const updateKeysStripe = async (keys) => {
  try {
    const response = await axiosPrivate.put("/stripekeys/updateKeysStripe", keys);
    return response.data;
  } catch (error) {
    return error;
  }
};

const getLinkIos = async () => {
  try {
    const response = await axiosPrivate.get("/linkapp/getLinkIos");
    return response.data;
  } catch (error) {
    return error;
  }
};
const getLinkAndroid = async () => {
  try {
    const response = await axiosPrivate.get("/linkapp/getLinkAndroid");
    return response.data;
  } catch (error) {
    return error;
  }
};
const getLinkStripe = async () => {
  try {
    const response = await axiosPrivate.get("/stripekeys/getDevKeys");
    return response.data;
  } catch (error) {
    return error;
  }
};

const sendEmailSent = async (numOrder) => {
  try {
    const response = await axiosPrivate.post(`/mail/statusOrderSent/${numOrder}`);
    return response.data;
  } catch (error) {
    return error;
  }
}

const sendEmailDelivered = async (numOrder) => {
  try {
    const response = await axiosPrivate.post(`/mail/statusOrderDelivery/${numOrder}`);
    return response.data;
  } catch (error) {
    return error;
  }
}

export default {
  loginAdmin,
  getReportOrders,
  getCategoriesByStatus,
  getAllCategories,
  getAllUsers,
  getProducts,
  getProductDetails,
  getAttributesByName,
  getCountProducts,
  getCountUsers,
  getCountOrders,
  getVariants,
  getVariantDetails,
  addProduct,
  updateProduct,
  addVariant,
  updateVariant,
  deleteCategory,
  updateCategory,
  addCategory,
  getAttributesAvailable,
  getAllOrders,
  updateAppAndroid,
  updateAppIos,
  updateKeysStripe,
  updateStatusUser,
  getLinkIos,
  getLinkAndroid,
  getLinkStripe,
  getOrderByNumOrder,
  updateStatusOrder,
  updateStatusProduct,
  sendEmailSent,
  sendEmailDelivered,
};

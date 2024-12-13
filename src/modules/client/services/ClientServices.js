import axiosPublic from "../../../core/api/HttpPublic";

const getProductsHome = async () => {
  try {
    const response = await axiosPublic.get("/product/getProductsHome");
    return response.data;
  } catch (error) {
    return error;
  }
};

const getNewProducts = async () => {
  try {
    const response = await axiosPublic.get("/product/getNewProducts");
    return response.data;
  } catch (error) {
    return error;
  }
};

const getTopRatedProducts = async () => {
  try {
    const response = await axiosPublic.get("/product/getTopRatedProducts");
    return response.data;
  } catch (error) {
    return error;
  }
};

const getCategories = async () => {
  try {
    const status = "enable";
    const response = await axiosPublic.get(`/category/getByStatus/${status}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

const getTopRatedComments = async () => {
  try {
    const response = await axiosPublic.get("/review/getTopRatedComments");
    return response.data;
  } catch (error) {
    return error;
  }
}

const getMinAndMaxPrice = async () => {
  try {
    const response = await axiosPublic.get("/product/getMinAndMaxPrice");
    return response.data;
  } catch (error) {
    return error;
  }
}

const getCategoryByStatus = async (status) => {
  try {
    const response = await axiosPublic.get(`/category/getByStatus/${status}`);
    return response.data;
  } catch (error) {
    return error;
  }
}

const getAttributeByName = async (name) => {
  try {
    const response = await axiosPublic.get(`/attribute/getByName/${name}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    return error;
  }
}

const getProductsByFilters = async (filters) => {
  try {
      // Construimos la query string con los filtros
      const queryParams = new URLSearchParams(filters).toString();
      const response = await axiosPublic.get(`/product/getProductsByFilters?${queryParams}`);
      return response.data;
  } catch (error) {
      console.error("Error obteniendo productos con filtros:", error);
      throw error;
  }
};

const getVariationAttributes = async (productNum) => {
  try {
    const response = await axiosPublic.get(`/product/getVariationAttributes/${productNum}/color`);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo atributos de variación:", error);
    return error;
  }
};

const getProductVariantImages = async (variantId) => {
  try {
    const response = await axiosPublic.get(`/product/getProductVariantImages/${variantId}`);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo imágenes de variantes de productos:", error);
    return error;
  }
};

const getReviewProduct = async (productNum) => {
  try {
    const response = await axiosPublic.get(`/review/product/${productNum}`);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo comentarios de producto:", error);
    return error;
  }
}
  
const  getLinkIos = async () => {
  try {
    const response = await axiosPublic.get("/linkapp/getLinkIos");
    return response.data;
  } catch (error) {
    return error;
  }
};


const getLinkAndroid = async () => {
  try {
    const response = await axiosPublic.get("/linkapp/getLinkAndroid");
    return response.data;
  } catch (error) {
    return error;
  }
};

export default {
  getProductsHome,
  getNewProducts,
  getCategories,
  getTopRatedProducts,
  getTopRatedComments,
  getMinAndMaxPrice,
  getCategoryByStatus,
  getAttributeByName,
  getProductsByFilters,
  getVariationAttributes,
  getProductVariantImages,
  getReviewProduct,
  getLinkIos,
  getLinkAndroid,
};

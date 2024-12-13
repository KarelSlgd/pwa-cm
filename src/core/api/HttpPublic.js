import axios from "axios";
import router from "@/router";
import store from "@/store/store";
const SERVER_URL = "http://localhost:8080/api";
const client = axios.create({
  baseURL: SERVER_URL,
  timeout: 20000,
});

client.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

client.interceptors.response.use(
  (response) => {
    return Promise.resolve(response);
  },
  async (error) => {
    if (!error.response) {
      localStorage.removeItem("token");
      this.$toast.error(
        "No se pudo conectar al servidor. Verifica tu conexión."
      );
      return Promise.reject(error);
    }

    if (error.response.status) {
      switch (error.response.status) {
        case 400:
          break;
        case 401:
          break;
        case 403:
          break;
        case 404:
          break;
        case 500:
          break;
        default:
          break;
      }
      return Promise.reject(error);
    }

    this.$toast.error("Error desconocido al procesar la respuesta.");
    return Promise.reject(error);
  }
);

const cacheRequest = async (method, endPoint, data = null) => {
  const request = {
    _id: new Date().toISOString(),
    method,
    endPoint,
    data,
    sent: false,
  };
  await window.dbPeticiones.put(request);
  if (method === "get") {
    try {
      const response = await client.get(endPoint);
      const fetch = {
        _id: endPoint,
        response: response.data,
      };
      await window.dbFetchesGet.put(fetch);
    } catch (error) {
      console.error("Error al guardar la respuesta en caché:", error);
      this.$toast.error("Error al guardar la respuesta en caché.");
    }
  }
};

export const sendPendingRequests = async () => {
  try {
    const requests = await window.dbPeticiones.allDocs({ include_docs: true });
    const pendingRequests = requests.rows.filter((row) => !row.doc.sent);

    for (const request of pendingRequests) {
      try {
        const { method, endPoint, data } = request.doc;
        await client[method](endPoint, data);
        await window.dbPeticiones.remove(request.doc);
        console.log(
          "Petición pendiente procesada y eliminada:",
          request.doc._id
        );
        this.$toast.success("Petición pendiente procesada con éxito.");
      } catch (error) {
        console.error("Error al enviar la petición pendiente:", error);
        this.$toast.error("Error al enviar una petición pendiente.");
      }
    }
  } catch (error) {
    console.error("Error al procesar peticiones pendientes:", error);
    this.$toast.error("Error al procesar peticiones pendientes.");
  }
};

window.addEventListener("online", sendPendingRequests);

export default {
  get: async function (endPoint, config) {
    try {
      const response = await client.get(endPoint, config);
      const fetch = {
        _id: endPoint,
        response: response.data,
      };
      await window.dbFetchesGet.put(fetch);
      return response;
    } catch (error) {
      if (!navigator.onLine) {
        try {
          const fetch = await window.dbFetchesGet.get(endPoint);
          return { data: fetch.response };
        } catch (fetchError) {
          console.error(
            "Error al obtener el último JSON almacenado:",
            fetchError
          );
          this.$toast.error("Error al obtener datos almacenados en caché.");
        }
      }
      this.$toast.error("Error al realizar la solicitud GET.");
      return Promise.reject(error);
    }
  },
  post: async function (endPoint, object, config) {
    try {
      return await client.post(endPoint, object, config || {});
    } catch (error) {
      if (!navigator.onLine) {
        await cacheRequest("post", endPoint, object);
        this.$toast.warning(
          "No se pudo enviar la solicitud. Se guardó en caché para enviarla más tarde."
        );
      }
      this.$toast.error("Error al realizar la solicitud POST.");
      return Promise.reject(error);
    }
  },
  put: async function (endPoint, object, config) {
    try {
      return await client.put(endPoint, object, config || {});
    } catch (error) {
      if (!navigator.onLine) {
        await cacheRequest("put", endPoint, object);
        this.$toast.warning(
          "No se pudo enviar la solicitud. Se guardó en caché para enviarla más tarde."
        );
      }
      this.$toast.error("Error al realizar la solicitud PUT.");
      return Promise.reject(error);
    }
  },
  delete: async function (endPoint) {
    try {
      return await client.delete(endPoint);
    } catch (error) {
      if (!navigator.onLine) {
        await cacheRequest("delete", endPoint);
        this.$toast.warning(
          "No se pudo enviar la solicitud. Se guardó en caché para enviarla más tarde."
        );
      }
      this.$toast.error("Error al realizar la solicitud DELETE.");
      return Promise.reject(error);
    }
  },
};

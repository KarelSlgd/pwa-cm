import axios from "axios";

// Configuración del cliente Axios
const SERVER_URL = "http://localhost:8080/api";
const client = axios.create({
  baseURL: SERVER_URL,
  timeout: 3000,
});

// Configuración de la base de datos local
const dbPeticiones = window.dbPeticiones;
const dbFetchesGet = window.dbFetchesGet;

// Interceptores de Axios
client.interceptors.request.use(
  (config) => {
    const auth_token = localStorage.getItem("token");
    if (auth_token && !config.url.includes("login")) {
      config.headers.Authorization = `Bearer ${auth_token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

client.interceptors.response.use(
  (response) => Promise.resolve(response),
  (error) => {
    if (!error.response) return Promise.reject(error);

    switch (error.response.status) {
      case 401:
      case 403:
      case 404:
      case 500:
        console.error(`HTTP Error: ${error.response.status}`);
        break;
      default:
        break;
    }
    return Promise.reject(error);
  }
);

// Función para manejar conflictos en PouchDB
const handleConflict = async (docId, newDoc) => {
  try {
    const existingDoc = await dbPeticiones.get(docId);
    const mergedDoc = { ...existingDoc, ...newDoc }; // Fusión de datos
    await dbPeticiones.put(mergedDoc); // Actualiza el documento
    console.log("Conflicto resuelto y documento actualizado:", docId);
  } catch (error) {
    console.error("Error al resolver conflicto:", error);
  }
};

// Función para almacenar peticiones pendientes
const cacheRequest = async (method, endPoint, data = null, config = {}) => {
  const request = {
    _id: `${method}-${endPoint}-${new Date().toISOString()}`, // ID único
    method,
    endPoint,
    data,
    config,
  };
  try {
    await dbPeticiones.put(request);
    console.log(`Petición ${method.toUpperCase()} almacenada en caché.`);
  } catch (error) {
    if (error.status === 409) {
      console.warn("Conflicto detectado al guardar la petición. Resolviendo...");
      await handleConflict(request._id, request);
    } else {
      console.error("Error al guardar la petición en caché:", error);
    }
  }
};

// Función para reenviar peticiones pendientes
export const sendPendingRequests = async () => {
  try {
    const requests = await dbPeticiones.allDocs({ include_docs: true });
    const pendingRequests = requests.rows.map((row) => row.doc);

    console.log(`Reintentando ${pendingRequests.length} peticiones pendientes...`);

    for (const request of pendingRequests) {
      try {
        const { method, endPoint, data, config } = request;

        console.log(`Procesando petición: ${method.toUpperCase()} ${endPoint}`);
        let response;
        if (method === "get" || method === "delete") {
          response = await client[method](endPoint, config);
        } else if (method === "post" || method === "put") {
          response = await client[method](endPoint, data, config);
        } else {
          console.error(`Método HTTP no soportado: ${method}`);
          continue;
        }

        if (response && response.data) {
          console.log("Petición procesada con éxito:", response.data);
        }

        // Si la petición fue exitosa, elimínala de la base de datos
        await dbPeticiones.remove(request._id);
        console.log(`Petición procesada y eliminada: ${request._id}`);
      } catch (error) {
        console.error("Error al reenviar la petición:", error);
      }
    }
  } catch (error) {
    console.error("Error al procesar peticiones pendientes:", error);
  }
};

// Función para manejar GET con caché
const handleGetRequest = async (endPoint, config) => {
  try {
    const response = await client.get(endPoint, config);

    const fetch = {
      _id: endPoint,
      response: response.data,
    };
    await dbFetchesGet.put(fetch);

    return response;
  } catch (error) {
    if (!navigator.onLine) {
      try {
        const fetch = await dbFetchesGet.get(endPoint);
        console.log("Respuesta obtenida de la caché:", fetch.response);
        return { data: fetch.response };
      } catch (fetchError) {
        if (fetchError.status === 404) {
          console.error("No se encontró la respuesta en caché:", fetchError);
        } else {
          console.error(
            "Error al obtener la respuesta de la caché:",
            fetchError
          );
        }
      }
    }
    return Promise.reject(error);
  }
};

// Exportar los métodos HTTP
export default {
  get: async function (endPoint, config) {
    return await handleGetRequest(endPoint, config);
  },
  post: async function (endPoint, object, config) {
    try {
      return await client.post(endPoint, object, config || {});
    } catch (error) {
      if (!navigator.onLine) {
        await cacheRequest("post", endPoint, object, config);
        console.log("Petición POST almacenada para reintentar más tarde.");
        return Promise.resolve({ data: null });
      }
      return Promise.reject(error);
    }
  },
  put: async function (endPoint, object, config) {
    try {
      return await client.put(endPoint, object, config || {});
    } catch (error) {
      if (!navigator.onLine) {
        await cacheRequest("put", endPoint, object, config);
        console.log("Petición PUT almacenada para reintentar más tarde.");
        return Promise.resolve({ data: null });
      }
      return Promise.reject(error);
    }
  },
  delete: async function (endPoint, config) {
    try {
      return await client.delete(endPoint, config);
    } catch (error) {
      if (!navigator.onLine) {
        await cacheRequest("delete", endPoint, null, config);
        console.log("Petición DELETE almacenada para reintentar más tarde.");
        return Promise.resolve({ data: null });
      }
      return Promise.reject(error);
    }
  },
};

// Escuchar el estado de conexión
window.addEventListener("online", sendPendingRequests);
window.addEventListener("offline", () => {
  console.log("Modo offline: las peticiones se almacenarán.");
});

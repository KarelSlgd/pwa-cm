import axios from "axios";

// Configuración del cliente Axios
const SERVER_URL = "https://www.energiasustentable.study:8443/api";
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
    await dbPeticiones.put(mergedDoc);
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
      console.warn(
        "Conflicto detectado al guardar la petición. Resolviendo..."
      );
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

    console.log(
      `Reintentando ${pendingRequests.length} peticiones pendientes...`
    );

    for (const request of pendingRequests) {
      try {
        const { method, endPoint, data, config } = request;
        console.log(method);
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
      timestamp: new Date().toISOString(),
    };

    try {
      // Guarda o actualiza la respuesta en el caché
      await dbFetchesGet.put(fetch);
    } catch (error) {
      if (error.status === 409) {
        // Actualiza el caché si ya existe un documento con el mismo ID
        const existingCache = await dbFetchesGet.get(endPoint);
        await dbFetchesGet.put({
          ...existingCache,
          response: response.data,
          timestamp: new Date().toISOString(),
        });
      } else {
        console.error("Error al guardar la respuesta en caché:", error);
      }
    }
    return response;
  } catch (error) {
    // Manejo de modo offline
    if (!navigator.onLine) {
      try {
        const fetch = await dbFetchesGet.get(endPoint);
        console.log("Respuesta obtenida del caché:", fetch.response);

        return { data: fetch.response }; // Devuelve los datos almacenados
      } catch (fetchError) {
        if (fetchError.status === 404) {
          console.error("No se encontró la respuesta en caché:", fetchError);
        } else {
          console.error("Error al obtener la respuesta del caché:", fetchError);
        }
      }
    }
    return Promise.reject(error);
  }
};

// Función para actualizar el caché después de una operación exitosa
const updateCacheAfterModification = async (endPoint, newData) => {
  try {
    // Intenta obtener el caché existente
    const existingCache = await dbFetchesGet.get(endPoint);

    // Verifica si es un array de datos y actualiza/agrega el elemento
    if (Array.isArray(existingCache.response.data)) {
      const updatedResponse = existingCache.response.data.map((item) =>
        item.id === newData.id ? { ...item, ...newData } : item
      );

      // Si no existe el dato, lo agrega al array
      const exists = existingCache.response.data.some(
        (item) => item.id === newData.id
      );
      if (!exists) {
        updatedResponse.push(newData);
      }

      // Actualiza el documento en la base de datos
      await dbFetchesGet.put({
        ...existingCache,
        response: { ...existingCache.response, data: updatedResponse },
        timestamp: new Date().toISOString(),
      });
      console.log("Caché actualizado correctamente en IndexedDB.");
    } else {
      console.warn("Formato no esperado en el caché, sobrescribiendo...");
      await dbFetchesGet.put({
        ...existingCache,
        response: { data: [newData] },
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    if (error.status === 404) {
      // Si no existe caché previo, crea uno nuevo
      await dbFetchesGet.put({
        _id: endPoint,
        response: { data: [newData] },
        timestamp: new Date().toISOString(),
      });
      console.log("Caché creado con nuevo dato.");
    } else {
      console.error("Error al actualizar o crear caché en IndexedDB:", error);
    }
  }
};

const updateCacheOffline = async (endPoint, newData) => {
  try {
    const existingCache = await dbFetchesGet.get(endPoint);

    if (Array.isArray(existingCache.response.data)) {
      // Actualiza o agrega el nuevo dato al array en caché
      const updatedResponse = existingCache.response.data.map((item) =>
        item.id === newData.id ? { ...item, ...newData } : item
      );

      const exists = existingCache.response.data.some(
        (item) => item.id === newData.id
      );
      if (!exists) {
        updatedResponse.push(newData);
      }

      await dbFetchesGet.put({
        ...existingCache,
        response: { ...existingCache.response, data: updatedResponse },
        timestamp: new Date().toISOString(),
      });
      console.log("Caché actualizado en modo offline.");
    } else {
      console.warn("Formato no esperado en la respuesta, sobrescribiendo...");
      await dbFetchesGet.put({
        ...existingCache,
        response: { data: [newData] },
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    if (error.status === 404) {
      // Si no existe el caché, crea uno nuevo
      await dbFetchesGet.put({
        _id: endPoint,
        response: { data: [newData] },
        timestamp: new Date().toISOString(),
      });
      console.log("Nuevo caché creado en modo offline.");
    } else {
      console.error("Error al actualizar el caché en modo offline:", error);
    }
  }
};

// Exportar los métodos HTTP
export default {
  get: async function (endPoint, config) {
    return await handleGetRequest(endPoint, config);
  },
  post: async function (endPoint, object, config) {
    try {
      const response = await client.post(endPoint, object, config || {});

      if (response && response.data) {
        // Actualiza el caché en modo online
        await updateCacheAfterModification(endPoint, response.data);
      }

      return response;
    } catch (error) {
      if (!navigator.onLine) {
        // Si está offline, actualiza directamente el caché
        await updateCacheOffline(endPoint, object);
        console.log("Caché actualizado en modo offline tras POST.");
        return Promise.resolve({ data: object });
      }
      return Promise.reject(error);
    }
  },
  put: async function (endPoint, object, config) {
    try {
      const response = await client.put(endPoint, object, config || {});

      if (response && response.data) {
        // Actualiza el caché en modo online
        await updateCacheAfterModification(endPoint, response.data);
      }

      return response;
    } catch (error) {
      if (!navigator.onLine) {
        // Si está offline, actualiza directamente el caché
        await updateCacheOffline(endPoint, object);
        console.log("Caché actualizado en modo offline tras PUT.");
        return Promise.resolve({ data: object });
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

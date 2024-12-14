import axios from "axios";

// Configuración del cliente Axios
const SERVER_URL = "https://www.energiasustentable.study:8443/api";
const client = axios.create({
  baseURL: SERVER_URL,
  timeout: 3000,
});

// Configuración de la base de datos local
if (!window.dbPeticiones || !window.dbFetchesGet) {
  console.error("Las bases de datos locales no están configuradas en window.");
}

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
  (response) => response, // Deja pasar las respuestas válidas
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

// Función para manejar conflictos en IndexedDB
const handleConflict = async (db, docId, newDoc) => {
  try {
    const existingDoc = await db.get(docId);
    const mergedDoc = { ...existingDoc, ...newDoc }; // Fusión de datos
    await db.put(mergedDoc);
    console.log("Conflicto resuelto y documento actualizado:", docId);
  } catch (error) {
    console.error("Error al resolver conflicto:", error);
  }
};

// Función para actualizar la base de datos local y reflejar en by-sequence
const updateBySequence = async (db, doc) => {
  try {
    const timestamp = new Date().toISOString();
    const updatedDoc = { ...doc, timestamp };
    await db.put(updatedDoc);
    console.log("Documento actualizado en by-sequence:", updatedDoc);
  } catch (error) {
    if (error.status === 409) {
      console.warn("Conflicto detectado, resolviendo...");
      await handleConflict(db, doc._id, doc);
    } else {
      console.error("Error al actualizar by-sequence:", error);
    }
  }
};

// Función para registrar eventos en modo offline
const registerOfflineEvent = async (method, endPoint, data) => {
  try {
    const offlineEvent = {
      _id: `${method}-${endPoint}-${new Date().toISOString()}`,
      method,
      endPoint,
      response: data,
      timestamp: new Date().toISOString(),
    };
    await dbFetchesGet.put(offlineEvent);
    console.log("Evento registrado localmente en by-sequence:", offlineEvent);
  } catch (error) {
    if (error.status === 409) {
      console.warn("Conflicto detectado en registro offline. Resolviendo...");
      await handleConflict(dbFetchesGet, `${method}-${endPoint}`, { response: data });
    } else {
      console.error("Error al registrar el evento offline:", error);
    }
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
    console.log(`Petición ${method.toUpperCase()} almacenada en caché correctamente.`);
  } catch (error) {
    if (error.status === 409) {
      console.warn("Conflicto detectado al guardar la petición. Resolviendo...");
      await handleConflict(dbPeticiones, request._id, request);
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
    window.location.reload()
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
      await dbFetchesGet.put(fetch);
    } catch (error) {
      if (error.status === 409) {
        await handleConflict(dbFetchesGet, fetch._id, fetch);
      } else {
        console.error("Error al guardar la respuesta en caché:", error);
      }
    }
    return response;
  } catch (error) {
    if (!navigator.onLine) {
      try {
        const fetch = await dbFetchesGet.get(endPoint);
        console.log("Respuesta obtenida de la caché:", fetch.response);
        if (!fetch.response) {
          console.warn("Los datos en caché están vacíos o corruptos.");
          throw new Error("Datos en caché inválidos.");
        }
        return { data: fetch.response };
      } catch (fetchError) {
        if (fetchError.status === 404) {
          console.error("No se encontró la respuesta en caché:", fetchError);
        } else {
          console.error("Error al obtener la respuesta de la caché:", fetchError);
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
      const response = await client.post(endPoint, object, config || {});
      const doc = { _id: endPoint, response: object };
      await updateBySequence(dbFetchesGet, doc);
      return response;
    } catch (error) {
      if (!navigator.onLine) {
        const offlineDoc = { _id: endPoint, response: object, timestamp: new Date().toISOString() };
        await registerOfflineEvent("post", endPoint, object);
        await cacheRequest("post", endPoint, object, config);
        console.log("Petición POST almacenada en modo offline y reflejada en by-sequence.");
        return Promise.resolve({ data: object });
      }
      return Promise.reject(error);
    }
  },

  put: async function (endPoint, object, config) {
    try {
      const response = await client.put(endPoint, object, config || {});
      const doc = { _id: endPoint, response: object };
      await updateBySequence(dbFetchesGet, doc);
      return response;
    } catch (error) {
      if (!navigator.onLine) {
        const offlineDoc = { _id: endPoint, response: object, timestamp: new Date().toISOString() };
        await registerOfflineEvent("put", endPoint, object);
        await cacheRequest("put", endPoint, object, config);
        console.log("Petición PUT almacenada en modo offline y reflejada en by-sequence.");
        return Promise.resolve({ data: object });
      }
      return Promise.reject(error);
    }
  },

  delete: async function (endPoint, config) {
    if (!navigator.onLine) {
      // Modo offline: almacenar petición para reintentar más tarde
      await registerOfflineEvent("delete", endPoint, null);
      await cacheRequest("delete", endPoint, null, config);
      console.log("Petición DELETE almacenada en modo offline.");
      return Promise.resolve({ data: null });
    }

    try {
      // Modo online: ejecutar directamente la petición
      const response = await client.delete(endPoint, config);
      console.log("Petición DELETE ejecutada en el servidor:", endPoint);
      return response;
    } catch (error) {
      console.error("Error en la petición DELETE:", error);
      return Promise.reject(error);
    }
  },


};

// Escuchar el estado de conexión
window.addEventListener("online", () => {
  console.log("Conexión restaurada, enviando peticiones pendientes...");
  sendPendingRequests();
});
window.addEventListener("offline", () => {
  console.log("Modo offline: las peticiones se almacenarán.");
});
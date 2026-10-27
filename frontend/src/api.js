const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  
  if (isLocalhost) {
    return envUrl || `http://localhost:5057/api`;
  }
  
  if (envUrl && !envUrl.includes("localhost") && !envUrl.includes("127.0.0.1")) {
    return envUrl;
  }
  
  return `${window.location.origin}/api`;
};

export const API_URL = getApiUrl();

export const assetUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http") || url.startsWith("data:") || url.startsWith("/logo") || url.startsWith("/favicon")) return url;
  return `${API_URL.replace(/\/api$/, "")}${url}`;
};

export const getToken = () => localStorage.getItem("iskcon_lms_token");

export const apiFetch = async (path, options = {}) => {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    body: options.body && typeof options.body !== "string" ? JSON.stringify(options.body) : options.body
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401) {
      if (
        typeof window !== "undefined" && 
        !window.location.pathname.includes("/login") && 
        !window.location.pathname.includes("/admin") && 
        !window.location.pathname.includes("/teacher")
      ) {
        window.location.href = "/login";
      }
    }
    const err = new Error(data.message || "Request failed");
    err.status = response.status;
    err.notFound = Boolean(data.notFound || response.status === 404);
    err.data = data;
    throw err;
  }
  return data;
};

export const compressImageInBrowser = async (file, maxBytes = 350 * 1024) => {
  if (!file || typeof window === "undefined") return file;
  const isImage = file.type && file.type.startsWith("image/");
  if (!isImage || file.type === "image/svg+xml" || file.type === "image/gif") {
    return file;
  }

  if (file.size <= maxBytes) {
    return file;
  }

  try {
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let { width, height } = img;
          const maxDim = 1600;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          const format = file.type === "image/png" ? "image/webp" : (file.type || "image/jpeg");

          let quality = 0.82;
          const attempt = (q) => {
            canvas.toBlob(
              (blob) => {
                if (!blob) {
                  resolve(file);
                  return;
                }
                if (blob.size > maxBytes && q > 0.45) {
                  attempt(q - 0.12);
                } else {
                  const newName = file.name.replace(/\.[^.]+$/, format === "image/webp" ? ".webp" : ".jpg");
                  const compressed = new File([blob], newName, {
                    type: blob.type || format,
                    lastModified: Date.now()
                  });
                  console.log(`[ClientCompressor] Reduced ${(file.size / 1024).toFixed(1)} KB -> ${(compressed.size / 1024).toFixed(1)} KB`);
                  resolve(compressed);
                }
              },
              format,
              q
            );
          };

          attempt(quality);
        };
        img.onerror = () => resolve(file);
        img.src = e.target.result;
      };
      reader.onerror = () => resolve(file);
      reader.readAsDataURL(file);
    });
  } catch (err) {
    console.warn("Client image compression fallback:", err);
    return file;
  }
};

export const uploadFile = async (rawFile, folder = "general") => {
  const file = await compressImageInBrowser(rawFile, 350 * 1024);
  const token = getToken();
  const form = new FormData();
  form.append("file", file);
  const response = await fetch(`${API_URL}/upload?folder=${folder}`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Upload failed");
  return data.file;
};

export const trackPage = (pageUrl) => {
  apiFetch("/traffic/track", {
    method: "POST",
    body: {
      pageUrl,
      referrer: document.referrer,
      deviceType: window.innerWidth < 640 ? "mobile" : window.innerWidth < 1024 ? "tablet" : "desktop"
    }
  }).catch(() => {});
};

export function setAuth({ accessToken, refreshToken, user }, remember) {
  const keep = remember ? localStorage : sessionStorage;
  const purge = remember ? sessionStorage : localStorage;

  // prevent stale conflicts
  for (const k of ["accessToken", "refreshToken", "user"]) {
    purge.removeItem(k);
  }

  if (accessToken) keep.setItem("accessToken", accessToken);
  if (refreshToken) keep.setItem("refreshToken", refreshToken);
  if (user) keep.setItem("user", JSON.stringify(user));
}

export function getAccessToken() {
  return (
    localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken")
  );
}

export function getRefreshToken() {
  return (
    localStorage.getItem("refreshToken") ||
    sessionStorage.getItem("refreshToken")
  );
}

export function clearAuth() {
  for (const s of [localStorage, sessionStorage]) {
    s.removeItem("accessToken");
    s.removeItem("refreshToken");
    s.removeItem("user");
  }
}

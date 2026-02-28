export function getCookieDomain() {
  if (typeof window === "undefined") return "";

  const host = window.location.hostname;

  // localhost → jangan pakai domain
  if (host === "localhost" || host === "127.0.0.1") {
    return "";
  }

  // semua carramica domain → gunakan root domain
  if (host.endsWith("carramica.org")) {
    return "; domain=.carramica.org";
  }

  return "";
}

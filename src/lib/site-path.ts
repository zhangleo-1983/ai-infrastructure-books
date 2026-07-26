export function sitePath(pathname: string, base = import.meta.env.BASE_URL): string {
  const normalizedBase = base === "/" ? "" : `/${base.replace(/^\/+|\/+$/g, "")}`;
  const cleanPath = pathname.replace(/^\/+|\/+$/g, "");
  const isFilePath = /(?:^|\/)[^/]+\.[^/]+$/.test(cleanPath);
  const normalizedPath =
    pathname === "/" ? "/" : `/${cleanPath}${isFilePath ? "" : "/"}`;

  return `${normalizedBase}${normalizedPath}` || "/";
}

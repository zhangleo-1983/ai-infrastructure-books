export function sitePath(pathname: string, base = import.meta.env.BASE_URL): string {
  const normalizedBase = base === "/" ? "" : `/${base.replace(/^\/+|\/+$/g, "")}`;
  const normalizedPath =
    pathname === "/" ? "/" : `/${pathname.replace(/^\/+|\/+$/g, "")}/`;

  return `${normalizedBase}${normalizedPath}` || "/";
}

import { Atom } from "effect/unstable/reactivity";

export const pageQueryParamAtom = Atom.searchParam(
  "page",
) as unknown as Atom.Writable<string, string>;

export const pageAtom = Atom.writable(
  (get) => {
    const rawPage = get(pageQueryParamAtom);

    if (rawPage === "") {
      return 1;
    }

    const parsedPage = Number(rawPage);

    if (!Number.isInteger(parsedPage) || parsedPage < 1) {
      return 1;
    }

    return parsedPage;
  },
  (ctx, page: number) => {
    const nextPage = Math.max(1, Math.floor(page));

    if (nextPage === 1) {
      ctx.set(pageQueryParamAtom, "");
    } else {
      ctx.set(pageQueryParamAtom, String(nextPage));
    }
  },
);

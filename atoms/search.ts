import { Option, Schema } from "effect";
import { Atom } from "effect/unstable/reactivity";

const searchQueryParamAtom = Atom.searchParam("q", {
  schema: Schema.String,
});

export const searchQueryAtom = Atom.writable(
  (get) => get(searchQueryParamAtom).pipe(Option.getOrElse(() => "")),
  (ctx, query: string) => {
    if (query === "") {
      ctx.set(searchQueryParamAtom, Option.none());
    } else {
      ctx.set(searchQueryParamAtom, Option.some(query));
    }
  },
);

export const debouncedSearchQueryAtom = searchQueryAtom.pipe(
  Atom.debounce("300 millis"),
);

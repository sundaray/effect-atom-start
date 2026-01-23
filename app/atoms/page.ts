import { Atom } from "@effect-atom/atom-react";
import { Option, Schema } from "effect";

export const pageQueryParamAtom = Atom.searchParam("page", {
  schema: Schema.NumberFromString,
});

export const pageAtom = Atom.writable(
  (get) => get(pageQueryParamAtom).pipe(Option.getOrElse(() => 1)),
  (ctx, page: number) => {
    if (page === 1) {
      ctx.set(pageQueryParamAtom, Option.none());
    } else {
      ctx.set(pageQueryParamAtom, Option.some(page));
    }
  },
);

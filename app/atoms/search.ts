import { Atom } from "@effect-atom/atom-react";

export const searchQueryAtom = Atom.searchParam("q");

export const debouncedSearchQueryAtom = searchQueryAtom.pipe(
  Atom.debounce("300 millis"),
);

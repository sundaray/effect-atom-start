/\*\*

- @since 4.0.0
  _/
  import _ as Cause from "../../Cause.ts"
  import _ as Effect from "../../Effect.ts"
  import _ as Equal from "../../Equal.ts"
  import _ as Exit from "../../Exit.ts"
  import type { LazyArg } from "../../Function.ts"
  import { constTrue, dual, identity } from "../../Function.ts"
  import _ as Hash from "../../Hash.ts"
  import _ as Option from "../../Option.ts"
  import { type Pipeable, pipeArguments } from "../../Pipeable.ts"
  import type { Predicate, Refinement } from "../../Predicate.ts"
  import { hasProperty, isIterable } from "../../Predicate.ts"
  import _ as Result from "../../Result.ts"
  import _ as Schema\_ from "../../Schema.ts"
  import _ as SchemaIssue from "../../SchemaIssue.ts"
  import _ as SchemaParser from "../../SchemaParser.ts"
  import _ as SchemaTransformation from "../../SchemaTransformation.ts"
  import type \* as Types from "../../Types.ts"

/\*\*

- @since 4.0.0
- @category type ids
  \*/
  export type TypeId = "~effect/reactivity/AsyncResult"

/\*\*

- @since 4.0.0
- @category type ids
  \*/
  export const TypeId: TypeId = "~effect/reactivity/AsyncResult"

/\*\*

- @since 4.0.0
- @category models
  \*/
  export type AsyncResult<A, E = never> = Initial<A, E> | Success<A, E> | Failure<A, E>

/\*\*

- @since 4.0.0
- @category Guards
  \*/
  export const isAsyncResult = (u: unknown): u is AsyncResult<unknown, unknown> => hasProperty(u, TypeId)

/\*\*

- @since 4.0.0
- @category models
  \*/
  export declare namespace AsyncResult {
  /\*\*
  - @since 4.0.0
  - @category models
    \*/
    export interface Proto<A, E> extends Pipeable {
    readonly [TypeId]: {
    readonly E: (_: never) => E
    readonly A: (_: never) => A
    }
    readonly waiting: boolean
    }

/\*\*

- @since 4.0.0
  \*/
  export type Success<R> = R extends AsyncResult<infer A, infer \_> ? A : never

/\*\*

- @since 4.0.0
  \*/
  export type Failure<R> = R extends AsyncResult<infer \_, infer E> ? E : never
  }

/\*\*

- @since 4.0.0
  \*/
  export type With<R extends AsyncResult<any, any>, A, E> = R extends Initial<infer \_A, infer \_E> ? Initial<A, E>
  : R extends Success<infer \_A, infer \_E> ? Success<A, E>
  : R extends Failure<infer \_A, infer \_E> ? Failure<A, E>
  : never

const ResultProto = {
[TypeId]: {
E: identity,
A: identity
},
pipe() {
return pipeArguments(this, arguments)
},
[Equal.symbol](this: AsyncResult<any, any>, that: AsyncResult<any, any>): boolean {
if (this.\_tag !== that.\_tag || this.waiting !== that.waiting) {
return false
}
switch (this.\_tag) {
case "Initial":
return true
case "Success":
return Equal.equals(this.value, (that as Success<any, any>).value)
case "Failure":
return Equal.equals(this.cause, (that as Failure<any, any>).cause)
}
},
[Hash.symbol](this: AsyncResult<any, any>): number {
const tagHash = Hash.string(`${this._tag}:${this.waiting}`)
if (this.\_tag === "Initial") {
return tagHash
}
return Hash.combine(tagHash)(this.\_tag === "Success" ? Hash.hash(this.value) : Hash.hash(this.cause))
}
}

/\*\*

- @since 4.0.0
- @category refinements
  \*/
  export const isWaiting = <A, E>(result: AsyncResult<A, E>): boolean => result.waiting

/\*\*

- @since 4.0.0
- @category models
  \*/
  export interface Initial<A, E = never> extends AsyncResult.Proto<A, E> {
  readonly \_tag: "Initial"
  }

/\*\*

- @since 4.0.0
- @category constructors
  \*/
  export const fromExit = <A, E>(exit: Exit.Exit<A, E>): Success<A, E> | Failure<A, E> =>
  exit.\_tag === "Success" ? success(exit.value) : failure(exit.cause)

/\*\*

- @since 4.0.0
- @category constructors
  \*/
  export const fromExitWithPrevious = <A, E>(
  exit: Exit.Exit<A, E>,
  previous: Option.Option<AsyncResult<A, E>>
  ): Success<A, E> | Failure<A, E> =>
  exit.\_tag === "Success" ? success(exit.value) : failureWithPrevious(exit.cause, { previous })

/\*\*

- @since 4.0.0
- @category constructors
  \*/
  export const waitingFrom = <A, E>(previous: Option.Option<AsyncResult<A, E>>): AsyncResult<A, E> => {
  if (previous.\_tag === "None") {
  return initial(true)
  }
  return waiting(previous.value)
  }

/\*\*

- @since 4.0.0
- @category refinements
  \*/
  export const isInitial = <A, E>(result: AsyncResult<A, E>): result is Initial<A, E> => result.\_tag === "Initial"

/\*\*

- @since 4.0.0
- @category refinements
  \*/
  export const isNotInitial = <A, E>(result: AsyncResult<A, E>): result is Success<A, E> | Failure<A, E> =>
  result.\_tag !== "Initial"

/\*\*

- @since 4.0.0
- @category constructors
  \*/
  export const initial = <A = never, E = never>(waiting = false): Initial<A, E> => {
  const result = Object.create(ResultProto)
  result.\_tag = "Initial"
  result.waiting = waiting
  return result
  }

/\*\*

- @since 4.0.0
- @category models
  \*/
  export interface Success<A, E = never> extends AsyncResult.Proto<A, E> {
  readonly \_tag: "Success"
  readonly value: A
  readonly timestamp: number
  }

/\*\*

- @since 4.0.0
- @category refinements
  \*/
  export const isSuccess = <A, E>(result: AsyncResult<A, E>): result is Success<A, E> => result.\_tag === "Success"

/\*\*

- @since 4.0.0
- @category constructors
  \*/
  export const success = <A, E = never>(value: A, options?: {
  readonly waiting?: boolean | undefined
  readonly timestamp?: number | undefined
  }): Success<A, E> => {
  const result = Object.create(ResultProto)
  result.\_tag = "Success"
  result.value = value
  result.waiting = options?.waiting ?? false
  result.timestamp = options?.timestamp ?? Date.now()
  return result
  }

/\*\*

- @since 4.0.0
- @category models
  \*/
  export interface Failure<A, E = never> extends AsyncResult.Proto<A, E> {
  readonly \_tag: "Failure"
  readonly cause: Cause.Cause<E>
  readonly previousSuccess: Option.Option<Success<A, E>>
  }

/\*\*

- @since 4.0.0
- @category refinements
  \*/
  export const isFailure = <A, E>(result: AsyncResult<A, E>): result is Failure<A, E> => result.\_tag === "Failure"

/\*\*

- @since 4.0.0
- @category refinements
  \*/
  export const isInterrupted = <A, E>(result: AsyncResult<A, E>): result is Failure<A, E> =>
  result.\_tag === "Failure" && Cause.hasInterruptsOnly(result.cause)

/\*\*

- @since 4.0.0
- @category constructors
  \*/
  export const failure = <A, E = never>(
  cause: Cause.Cause<E>,
  options?: {
  readonly previousSuccess?: Option.Option<Success<A, E>> | undefined
  readonly waiting?: boolean | undefined
  }
  ): Failure<A, E> => {
  const result = Object.create(ResultProto)
  result.\_tag = "Failure"
  result.cause = cause
  result.previousSuccess = options?.previousSuccess ?? Option.none()
  result.waiting = options?.waiting ?? false
  return result
  }

/\*\*

- @since 4.0.0
- @category constructors
  \*/
  export const failureWithPrevious = <A, E>(
  cause: Cause.Cause<E>,
  options: {
  readonly previous: Option.Option<AsyncResult<A, E>>
  readonly waiting?: boolean | undefined
  }
  ): Failure<A, E> =>
  failure(cause, {
  previousSuccess: Option.flatMap(options.previous, (result) =>
  isSuccess(result)
  ? Option.some(result)
  : isFailure(result)
  ? result.previousSuccess
  : Option.none()),
  waiting: options.waiting
  })

/\*\*

- @since 4.0.0
- @category constructors
  \*/
  export const fail = <E, A = never>(error: E, options?: {
  readonly previousSuccess?: Option.Option<Success<A, E>> | undefined
  readonly waiting?: boolean | undefined
  }): Failure<A, E> => failure(Cause.fail(error), options)

/\*\*

- @since 4.0.0
- @category constructors
  \*/
  export const failWithPrevious = <A, E>(
  error: E,
  options: {
  readonly previous: Option.Option<AsyncResult<A, E>>
  readonly waiting?: boolean | undefined
  }
  ): Failure<A, E> => failureWithPrevious(Cause.fail(error), options)

/\*\*

- @since 4.0.0
- @category constructors
  \*/
  export const waiting = <R extends AsyncResult<any, any>>(self: R, options?: {
  readonly touch?: boolean | undefined
  }): R => {
  if (self.waiting) {
  return options?.touch ? touch(self) : self
  }
  const result = Object.assign(Object.create(ResultProto), self)
  result.waiting = true
  if (options?.touch && isSuccess(result)) {
  ;(result as any).timestamp = Date.now()
  }
  return result
  }

/\*\*

- @since 4.0.0
- @category combinators
  \*/
  export const touch = <A extends AsyncResult<any, any>>(result: A): A => {
  if (isSuccess(result)) {
  return success(result.value, { waiting: result.waiting }) as A
  }
  return result
  }

/\*\*

- @since 4.0.0
- @category constructors
  \*/
  export const replacePrevious = <R extends AsyncResult<any, any>, XE, A>(
  self: R,
  previous: Option.Option<AsyncResult<A, XE>>
  ): With<R, A, AsyncResult.Failure<R>> => {
  if (self.\_tag === "Failure") {
  return failureWithPrevious(self.cause, { previous, waiting: self.waiting }) as any
  }
  return self as any
  }

/\*\*

- @since 4.0.0
- @category accessors
  \*/
  export const value = <A, E>(self: AsyncResult<A, E>): Option.Option<A> => {
  if (self.\_tag === "Success") {
  return Option.some(self.value)
  } else if (self.\_tag === "Failure") {
  return Option.map(self.previousSuccess, (s) => s.value)
  }
  return Option.none()
  }

/\*\*

- @since 4.0.0
- @category accessors
  \*/
  export const getOrElse: {
  <B>(orElse: LazyArg<B>): <A, E>(self: AsyncResult<A, E>) => A | B
  <A, E, B>(self: AsyncResult<A, E>, orElse: LazyArg<B>): A | B
  } = dual(2, <A, E, B>(self: AsyncResult<A, E>, orElse: LazyArg<B>): A | B => Option.getOrElse(value(self), orElse))

/\*\*

- @since 4.0.0
- @category accessors
  \*/
  export const getOrThrow = <A, E>(self: AsyncResult<A, E>): A =>
  Option.getOrThrowWith(value(self), () => new Cause.NoSuchElementError("AsyncResult.getOrThrow: no value found"))

/\*\*

- @since 4.0.0
- @category accessors
  \*/
  export const cause = <A, E>(self: AsyncResult<A, E>): Option.Option<Cause.Cause<E>> =>
  self.\_tag === "Failure" ? Option.some(self.cause) : Option.none()

/\*\*

- @since 4.0.0
- @category accessors
  \*/
  export const error = <A, E>(self: AsyncResult<A, E>): Option.Option<E> =>
  self.\_tag === "Failure" ? Cause.findErrorOption(self.cause) : Option.none()

/\*\*

- @since 4.0.0
- @category combinators
  \*/
  export const toExit = <A, E>(
  self: AsyncResult<A, E>
  ): Exit.Exit<A, E | Cause.NoSuchElementError> => {
  switch (self.\_tag) {
  case "Success": {
  return Exit.succeed(self.value)
  }
  case "Failure": {
  return Exit.failCause(self.cause)
  }
  default: {
  return Exit.fail(new Cause.NoSuchElementError())
  }
  }
  }

/\*\*

- @since 4.0.0
- @category combinators
  \*/
  export const map: {
  <A, B>(f: (a: A) => B): <E>(self: AsyncResult<A, E>) => AsyncResult<B, E>
  <E, A, B>(self: AsyncResult<A, E>, f: (a: A) => B): AsyncResult<B, E>
  } = dual(2, <E, A, B>(self: AsyncResult<A, E>, f: (a: A) => B): AsyncResult<B, E> => {
  switch (self.\_tag) {
  case "Initial":
  return self as any as AsyncResult<B, E>
  case "Failure":
  return failure(self.cause, {
  previousSuccess: Option.map(self.previousSuccess, (s) => success(f(s.value), s)),
  waiting: self.waiting
  })
  case "Success":
  return success(f(self.value), self)
  }
  })

/\*\*

- @since 4.0.0
- @category combinators
  \*/
  export const flatMap: {
  <A, E, B, E2>(
  f: (a: A, prev: Success<A, E>) => AsyncResult<A, E2>
  ): (self: AsyncResult<A, E>) => AsyncResult<B, E | E2>
  <E, A, B, E2>(self: AsyncResult<A, E>, f: (a: A, prev: Success<A, E>) => AsyncResult<B, E2>): AsyncResult<B, E | E2>
  } = dual(
  2,
  <E, A, B, E2>(
  self: AsyncResult<A, E>,
  f: (a: A, prev: Success<A, E>) => AsyncResult<B, E2>
  ): AsyncResult<B, E | E2> => {
  switch (self.\_tag) {
  case "Initial":
  return self as any as AsyncResult<B, E>
  case "Failure":
  return failure<B, E | E2>(self.cause, {
  previousSuccess: Option.flatMap(self.previousSuccess, (s) => {
  const next = f(s.value, s)
  return isSuccess(next) ? Option.some(next) : Option.none()
  }),
  waiting: self.waiting
  })
  case "Success":
  return f(self.value, self)
  }
  }
  )

/\*\*

- @since 4.0.0
- @category combinators
  \*/
  export const match: {
  <A, E, X, Y, Z>(options: {
  readonly onInitial: (_: Initial<A, E>) => X
  readonly onFailure: (_: Failure<A, E>) => Y
  readonly onSuccess: (_: Success<A, E>) => Z
  }): (self: AsyncResult<A, E>) => X | Y | Z
  <A, E, X, Y, Z>(self: AsyncResult<A, E>, options: {
  readonly onInitial: (_: Initial<A, E>) => X
  readonly onFailure: (_: Failure<A, E>) => Y
  readonly onSuccess: (_: Success<A, E>) => Z
  }): X | Y | Z
  } = dual(2, <A, E, X, Y, Z>(self: AsyncResult<A, E>, options: {
  readonly onInitial: (_: Initial<A, E>) => X
  readonly onFailure: (_: Failure<A, E>) => Y
  readonly onSuccess: (\_: Success<A, E>) => Z
  }): X | Y | Z => {
  switch (self.\_tag) {
  case "Initial":
  return options.onInitial(self)
  case "Failure":
  return options.onFailure(self)
  case "Success":
  return options.onSuccess(self)
  }
  })

/\*\*

- @since 4.0.0
- @category combinators
  \*/
  export const matchWithError: {
  <A, E, W, X, Y, Z>(options: {
  readonly onInitial: (_: Initial<A, E>) => W
  readonly onError: (error: E, _: Failure<A, E>) => X
  readonly onDefect: (defect: unknown, _: Failure<A, E>) => Y
  readonly onSuccess: (_: Success<A, E>) => Z
  }): (self: AsyncResult<A, E>) => W | X | Y | Z
  <A, E, W, X, Y, Z>(self: AsyncResult<A, E>, options: {
  readonly onInitial: (_: Initial<A, E>) => W
  readonly onError: (error: E, _: Failure<A, E>) => X
  readonly onDefect: (defect: unknown, _: Failure<A, E>) => Y
  readonly onSuccess: (_: Success<A, E>) => Z
  }): W | X | Y | Z
  } = dual(2, <A, E, W, X, Y, Z>(self: AsyncResult<A, E>, options: {
  readonly onInitial: (_: Initial<A, E>) => W
  readonly onError: (error: E, _: Failure<A, E>) => X
  readonly onDefect: (defect: unknown, _: Failure<A, E>) => Y
  readonly onSuccess: (_: Success<A, E>) => Z
  }): W | X | Y | Z => {
  switch (self.\_tag) {
  case "Initial":
  return options.onInitial(self)
  case "Failure": {
  const result = Cause.findError(self.cause)
  if (Result.isFailure(result)) {
  return options.onDefect(Cause.squash(result.failure), self)
  }
  return options.onError(result.success, self)
  }
  case "Success":
  return options.onSuccess(self)
  }
  })

/\*\*

- @since 4.0.0
- @category combinators
  \*/
  export const matchWithWaiting: {
  <A, E, W, X, Y, Z>(options: {
  readonly onWaiting: (_: AsyncResult<A, E>) => W
  readonly onError: (error: E, _: Failure<A, E>) => X
  readonly onDefect: (defect: unknown, _: Failure<A, E>) => Y
  readonly onSuccess: (_: Success<A, E>) => Z
  }): (self: AsyncResult<A, E>) => W | X | Y | Z
  <A, E, W, X, Y, Z>(self: AsyncResult<A, E>, options: {
  readonly onWaiting: (_: AsyncResult<A, E>) => W
  readonly onError: (error: E, _: Failure<A, E>) => X
  readonly onDefect: (defect: unknown, _: Failure<A, E>) => Y
  readonly onSuccess: (_: Success<A, E>) => Z
  }): W | X | Y | Z
  } = dual(2, <A, E, W, X, Y, Z>(self: AsyncResult<A, E>, options: {
  readonly onWaiting: (_: AsyncResult<A, E>) => W
  readonly onError: (error: E, _: Failure<A, E>) => X
  readonly onDefect: (defect: unknown, _: Failure<A, E>) => Y
  readonly onSuccess: (_: Success<A, E>) => Z
  }): W | X | Y | Z => {
  if (self.waiting) {
  return options.onWaiting(self)
  }
  switch (self.\_tag) {
  case "Initial":
  return options.onWaiting(self)
  case "Failure": {
  const e = Cause.findError(self.cause)
  if (Result.isFailure(e)) {
  return options.onDefect(Cause.squash(e.failure), self)
  }
  return options.onError(e.success, self)
  }
  case "Success":
  return options.onSuccess(self)
  }
  })

/\*\*

- Combines multiple results into a single result. Also works with non-result
- values.
-
- @since 4.0.0
- @category combinators
  \*/
  export const all = <const Arg extends Iterable<any> | Record<string, any>>(
  results: Arg
  ): AsyncResult<
  [Arg] extends [ReadonlyArray<any>] ? {
  -readonly [K in keyof Arg]: [Arg[K]] extends [AsyncResult<infer _A, infer _E>] ? \_A : Arg[K]
  }
  : [Arg] extends [Iterable<infer _A>] ? \_A extends AsyncResult<infer \_AA, infer \_E> ? \_AA : \_A
  : [Arg] extends [Record<string, any>] ? {
  -readonly [K in keyof Arg]: [Arg[K]] extends [AsyncResult<infer _A, infer _E>] ? \_A : Arg[K]
  }
  : never,
  [Arg] extends [ReadonlyArray<any>] ? AsyncResult.Failure<Arg[number]>
  : [Arg] extends [Iterable<infer _A>] ? AsyncResult.Failure<\_A>
  : [Arg] extends [Record<string, any>] ? AsyncResult.Failure<Arg[keyof Arg]>
  : never
  > => {
  > const isIter = isIterable(results)
  > const entries = isIter
      ? Array.from(results, (result, i) => [i, result] as const)
      : Object.entries(results)
  const successes: any = isIter ? [] : {}
  let waiting = false
  for (let i = 0; i < entries.length; i++) {
  const [key, result] = entries[i]
  if (!isAsyncResult(result)) {
  successes[key] = result
  continue
  } else if (!isSuccess(result)) {
  return result as any
  }
  successes[key] = result.value
  if (result.waiting) {
  waiting = true
  }
  }
  return success(successes, { waiting }) as any
  }

/\*\*

- @since 4.0.0
- @category Builder
  \*/
  export const builder = <A extends AsyncResult<any, any>>(self: A): Builder<
  never,
  A extends Success<infer \_A, infer \_E> ? \_A : never,
  A extends Failure<infer \_A, infer \_E> ? \_E : never,
  A extends Initial<infer \_A, infer \_E> ? true : never
  > => new BuilderImpl(self) as any

/\*\*

- @since 4.0.0
- @category Builder
  \*/
  export type Builder<Out, A, E, I> =
  & Pipeable
  & {
  onWaiting<B>(f: (result: AsyncResult<A, E>) => B): Builder<Out | B, A, E, I>
  onDefect<B>(f: (defect: unknown, result: Failure<A, E>) => B): Builder<Out | B, A, E, I>
  orElse<B>(orElse: LazyArg<B>): Out | B
  orNull(): Out | null
  render(): [A | I] extends [never] ? Out : Out | null
  }
  & ([I] extends [never] ? {} :
  {
  onInitial<B>(f: (result: Initial<A, E>) => B): Builder<Out | B, A, E, never>
  onInitialOrWaiting<B>(f: (result: AsyncResult<A, E>) => B): Builder<Out | B, A, E, never>
  })
  & ([A] extends [never] ? {} :
  {
  onSuccess<B>(f: (value: A, result: Success<A, E>) => B): Builder<Out | B, never, E, I>
  })
  & ([E] extends [never] ? {} : {
  onFailure<B>(f: (cause: Cause.Cause<E>, result: Failure<A, E>) => B): Builder<Out | B, A, never, I>

      onError<B>(f: (error: E, result: Failure<A, E>) => B): Builder<Out | B, A, never, I>

      onErrorIf<B extends E, C>(
        refinement: Refinement<E, B>,
        f: (error: B, result: Failure<A, E>) => C
      ): Builder<Out | C, A, Types.EqualsWith<E, B, E, Exclude<E, B>>, I>
      onErrorIf<C>(
        predicate: Predicate<E>,
        f: (error: E, result: Failure<A, E>) => C
      ): Builder<Out | C, A, E, I>

      onErrorTag<const Tags extends ReadonlyArray<Types.Tags<E>>, B>(
        tags: Tags,
        f: (error: Types.ExtractTag<E, Tags[number]>, result: Failure<A, E>) => B
      ): Builder<Out | B, A, Types.ExcludeTag<E, Tags[number]>, I>
      onErrorTag<const Tag extends Types.Tags<E>, B>(
        tag: Tag,
        f: (error: Types.ExtractTag<E, Tag>, result: Failure<A, E>) => B
      ): Builder<Out | B, A, Types.ExcludeTag<E, Tag>, I>

  })

class BuilderImpl<Out, A, E> {
constructor(result: AsyncResult<A, E>) {
this.result = result
}
readonly result: AsyncResult<A, E>
public output = Option.none<Out>()

when<B extends AsyncResult<A, E>, C>(
refinement: Refinement<AsyncResult<A, E>, B>,
f: (result: B) => Option.Option<C>
): any
when<C>(
refinement: Predicate<AsyncResult<A, E>>,
f: (result: AsyncResult<A, E>) => Option.Option<C>
): any
when<C>(
refinement: Predicate<AsyncResult<A, E>>,
f: (result: AsyncResult<A, E>) => Option.Option<C>
): any {
if (Option.isNone(this.output) && refinement(this.result)) {
const b = f(this.result)
if (Option.isSome(b)) {
;(this as any).output = b
}
}
return this
}

pipe() {
return pipeArguments(this, arguments)
}

onWaiting<B>(f: (result: AsyncResult<A, E>) => B): BuilderImpl<Out | B, A, E> {
return this.when((r) => r.waiting, (r) => Option.some(f(r)))
}

onInitialOrWaiting<B>(f: (result: AsyncResult<A, E>) => B): BuilderImpl<Out | B, A, E> {
return this.when((r) => isInitial(r) || r.waiting, (r) => Option.some(f(r)))
}

onInitial<B>(f: (result: Initial<A, E>) => B): BuilderImpl<Out | B, A, E> {
return this.when(isInitial, (r) => Option.some(f(r)))
}

onSuccess<B>(f: (value: A, result: Success<A, E>) => B): BuilderImpl<Out | B, never, E> {
return this.when(isSuccess, (r) => Option.some(f(r.value, r)))
}

onFailure<B>(f: (cause: Cause.Cause<E>, result: Failure<A, E>) => B): BuilderImpl<Out | B, A, never> {
return this.when(isFailure, (r) => Option.some(f(r.cause, r)))
}

onError<B>(f: (error: E, result: Failure<A, E>) => B): BuilderImpl<Out | B, A, never> {
return this.onErrorIf(constTrue, f) as any
}

onErrorIf<C, B extends E = E>(
refinement: Refinement<E, B> | Predicate<E>,
f: (error: B, result: Failure<A, E>) => C
): BuilderImpl<Out | C, A, Types.EqualsWith<E, B, E, Exclude<E, B>>> {
return this.when(isFailure, (result) =>
Cause.findErrorOption(result.cause).pipe(
Option.filter(refinement),
Option.map((error) => f(error as B, result))
))
}

onErrorTag<B>(
tag: string | ReadonlyArray<string>,
f: (error: Types.ExtractTag<E, any>, result: Failure<A, E>) => B
): BuilderImpl<Out | B, A, Types.ExcludeTag<E, any>> {
return this.onErrorIf(
(e) => hasProperty(e, "\_tag") && (Array.isArray(tag) ? tag.includes(e.\_tag) : e.\_tag === tag),
f
) as any
}

onDefect<B>(f: (defect: unknown, result: Failure<A, E>) => B): BuilderImpl<Out | B, A, E> {
return this.when(isFailure, (result) => {
const defect = Cause.findDefect(result.cause)
return Result.isFailure(defect) ? Option.none() : Option.some(f(defect.success, result))
})
}

orElse<B>(orElse: LazyArg<B>): Out | B {
return Option.getOrElse(this.output, orElse)
}

orNull(): Out | null {
return Option.getOrNull(this.output)
}

render(): Out | null {
if (Option.isSome(this.output)) {
return this.output.value
} else if (isFailure(this.result)) {
throw Cause.squash(this.result.cause)
}
return null
}
}

/\*\*

- @since 4.0.0
- @category Schemas
  \*/
  export interface Schema<
  Success extends Schema*.Top,
  Error extends Schema*.Top
  > extends
  > Schema\_.declareConstructor<
      AsyncResult<Success["Type"], Error["Type"]>,
      AsyncResult<Success["Encoded"], Error["Encoded"]>,
      readonly [Success, Schema_.Cause<Error, Schema_.Defect>]
  > {
  > readonly success: Success
  > readonly error: Error
  > }

/\*\*

- @since 4.0.0
- @category Schemas
  \*/
  export const Schema = <
  A extends Schema*.Top = Schema*.Never,
  E extends Schema*.Top = Schema*.Never
  > (
  > options: {
      readonly success?: A | undefined
      readonly error?: E | undefined
  }
  ): Schema<A, E> => {
  const success*: A = options.success ?? Schema*.Never as any
  const error: E = options.error ?? Schema*.Never as any
  const schema = Schema*.declareConstructor<
  AsyncResult<A["Type"], E["Type"]>,
  AsyncResult<A["Encoded"], E["Encoded"]>
  > ()(
      [success_, Schema_.Cause(error, Schema_.Defect)],
      ([value, cause]) => (input, ast, options) => {
        if (!isAsyncResult(input)) {
          return Effect.fail(new SchemaIssue.InvalidType(ast, Option.some(input)))
        }
        switch (input._tag) {
          case "Initial":
            return Effect.succeed(input)
          case "Success":
            return Effect.mapBothEager(
              SchemaParser.decodeUnknownEffect(value)(input.value, options),
              {
                onSuccess: (value) => success(value, input),
                onFailure: (issue) =>
                  new SchemaIssue.Composite(ast, Option.some(input), [new SchemaIssue.Pointer(["value"], issue)])
              }
            )
          case "Failure": {
            const prevSuccessEffect = input.previousSuccess.pipe(
              Option.map((ps) =>
                Effect.mapBothEager(
                  SchemaParser.decodeUnknownEffect(value)(ps.value, options),
                  {
                    onSuccess: (value) => Option.some(success<A["Type"], E["Type"]>(value, ps)),
                    onFailure: (issue) =>
                      new SchemaIssue.Composite(ast, Option.some(input), [
                        new SchemaIssue.Pointer(["previousSuccess", "value"], issue)
                      ])
                  }
                )
              ),
              Option.getOrElse(() => Effect.succeedNone)
            )
            const causeEffect = Effect.mapErrorEager(
              SchemaParser.decodeUnknownEffect(cause)(input.cause, options),
              (issue) => new SchemaIssue.Composite(ast, Option.some(input), [new SchemaIssue.Pointer(["cause"], issue)])
            )
            return Effect.flatMapEager(
              prevSuccessEffect,
              (previousSuccess) =>
                Effect.mapEager(causeEffect, (cause) =>
                  failure(cause, {
                    previousSuccess,
                    waiting: input.waiting
                  }))
            )
          }
        }
      },
      {
        expected: "AsyncResult",
        toCodec([value, cause]) {
          const Success = Schema_.TaggedStruct("Success", { value, waiting: Schema_.Boolean, timestamp: Schema_.Number })
          return Schema_.link<AsyncResult<A["Encoded"], E["Encoded"]>>()(
            Schema_.Union([
              Schema_.TaggedStruct("Initial", { waiting: Schema_.Boolean }),
              Success,
              Schema_.TaggedStruct("Failure", {
                cause,
                previousSuccess: Schema_.Option(Success),
                waiting: Schema_.Boolean
              })
            ]),
            SchemaTransformation.transform({
              decode: (encoded): AsyncResult<A["Encoded"], E["Encoded"]> => {
                switch (encoded._tag) {
                  case "Initial":
                    return initial(encoded.waiting)
                  case "Success":
                    return success(encoded.value, {
                      waiting: encoded.waiting,
                      timestamp: encoded.timestamp
                    })
                  case "Failure": {
                    return failure(encoded.cause, {
                      previousSuccess: Option.map(encoded.previousSuccess, (ps) => success(ps.value, ps)),
                      waiting: encoded.waiting
                    })
                  }
                }
              },
              encode(result) {
                switch (result._tag) {
                  case "Initial":
                    return { _tag: "Initial" as const, waiting: result.waiting }
                  case "Success":
                    return {
                      _tag: "Success" as const,
                      value: result.value,
                      waiting: result.waiting,
                      timestamp: result.timestamp
                    }
                  case "Failure":
                    return {
                      _tag: "Failure" as const,
                      cause: result.cause,
                      previousSuccess: result.previousSuccess,
                      waiting: result.waiting
                    }
                }
              }
            })
          )
        },
        toEquivalence: Equal.asEquivalence,
        toFormatter: ([value, cause]) => (t) => {
          switch (t._tag) {
            case "Success":
              return `AsyncResult.Success(${value(t.value)}, ${t.waiting}, ${t.timestamp})`
            case "Failure":
              return `AsyncResult.Failure(${cause(t.cause)}, ${t.waiting})`
            case "Initial":
              return `AsyncResult.Initial(${t.waiting}, ${t.waiting})`
          }
        }
      }
  )
  return Object.assign(schema, {
  success: success\_,
  error
  })
  }

/\*\*

- @since 4.0.0
  _/
  import _ as Arr from "../../Array.ts"
  import _ as Cause from "../../Cause.ts"
  import _ as Channel from "../../Channel.ts"
  import _ as Duration from "../../Duration.ts"
  import _ as Effect from "../../Effect.ts"
  import _ as Exit from "../../Exit.ts"
  import _ as Fiber from "../../Fiber.ts"
  import type { LazyArg } from "../../Function.ts"
  import { constant, constTrue, constVoid, dual, pipe } from "../../Function.ts"
  import type _ as Inspectable from "../../Inspectable.ts"
  import { PipeInspectableProto } from "../../internal/core.ts"
  import _ as Layer from "../../Layer.ts"
  import _ as MutableHashMap from "../../MutableHashMap.ts"
  import _ as Option from "../../Option.ts"
  import type { Pipeable } from "../../Pipeable.ts"
  import { hasProperty } from "../../Predicate.ts"
  import _ as Pull from "../../Pull.ts"
  import type { ReadonlyRecord } from "../../Record.ts"
  import _ as Scheduler from "../../Scheduler.ts"
  import _ as Schema from "../../Schema.ts"
  import _ as Scope from "../../Scope.ts"
  import _ as ServiceMap from "../../ServiceMap.ts"
  import _ as Stream from "../../Stream.ts"
  import _ as SubscriptionRef from "../../SubscriptionRef.ts"
  import type { NoInfer } from "../../Types.ts"
  import _ as KeyValueStore from "../persistence/KeyValueStore.ts"
  import _ as AsyncResult from "./AsyncResult.ts"
  import { AtomRegistry } from "./AtomRegistry.ts"
  import _ as Registry from "./AtomRegistry.ts"
  import \* as Reactivity from "./Reactivity.ts"

/\*\*

- @since 4.0.0
- @category type ids
  \*/
  export type TypeId = "~effect/reactivity/Atom"

/\*\*

- @since 4.0.0
- @category type ids
  \*/
  export const TypeId: TypeId = "~effect/reactivity/Atom"

/\*\*

- @since 4.0.0
- @category models
  \*/
  export interface Atom<A> extends Pipeable, Inspectable.Inspectable {
  readonly [TypeId]: TypeId
  readonly keepAlive: boolean
  readonly lazy: boolean
  readonly read: (get: Context) => A
  readonly refresh?: (f: <A>(atom: Atom<A>) => void) => void
  readonly label?: readonly [name: string, stack: string]
  readonly idleTTL?: number
  }

/\*\*

- @since 4.0.0
- @category Guards
  \*/
  export const isAtom = (u: unknown): u is Atom<any> => hasProperty(u, TypeId)

/\*\*

- @since 4.0.0
  \*/
  export type Type<T extends Atom<any>> = T extends Atom<infer A> ? A : never

/\*\*

- @since 4.0.0
  \*/
  export type Success<T extends Atom<any>> = T extends Atom<AsyncResult.AsyncResult<infer A, infer \_>> ? A : never

/\*\*

- @since 4.0.0
  \*/
  export type PullSuccess<T extends Atom<any>> = T extends Atom<PullResult<infer A, infer \_>> ? A : never

/\*\*

- @since 4.0.0
  \*/
  export type Failure<T extends Atom<any>> = T extends Atom<AsyncResult.AsyncResult<infer \_, infer E>> ? E : never

/\*\*

- @since 4.0.0
  \*/
  export type WithoutSerializable<T extends Atom<any>> = T extends Writable<infer R, infer W> ? Writable<R, W>
  : Atom<Type<T>>

/\*\*

- @since 4.0.0
- @category type ids
  \*/
  export const WritableTypeId: WritableTypeId = "~effect/reactivity/Atom/Writable"

/\*\*

- @since 4.0.0
- @category type ids
  \*/
  export type WritableTypeId = "~effect/reactivity/Atom/Writable"

/\*\*

- @since 4.0.0
- @category models
  \*/
  export interface Writable<R, W = R> extends Atom<R> {
  readonly [WritableTypeId]: WritableTypeId
  readonly write: (ctx: WriteContext<R>, value: W) => void
  }

/\*\*

- @since 4.0.0
- @category context
  \*/
  export interface Context {
  <A>(atom: Atom<A>): A
  get<A>(this: Context, atom: Atom<A>): A
  result<A, E>(this: Context, atom: Atom<AsyncResult.AsyncResult<A, E>>, options?: {
  readonly suspendOnWaiting?: boolean | undefined
  }): Effect.Effect<A, E>
  resultOnce<A, E>(this: Context, atom: Atom<AsyncResult.AsyncResult<A, E>>, options?: {
  readonly suspendOnWaiting?: boolean | undefined
  }): Effect.Effect<A, E>
  once<A>(this: Context, atom: Atom<A>): A
  addFinalizer(this: Context, f: () => void): void
  mount<A>(this: Context, atom: Atom<A>): void
  refresh<A>(this: Context, atom: Atom<A>): void
  refreshSelf(this: Context): void
  self<A>(this: Context): Option.Option<A>
  setSelf<A>(this: Context, a: A): void
  set<R, W>(this: Context, atom: Writable<R, W>, value: W): void
  setResult<A, E, W>(this: Context, atom: Writable<AsyncResult.AsyncResult<A, E>, W>, value: W): Effect.Effect<A, E>
  some<A>(this: Context, atom: Atom<Option.Option<A>>): Effect.Effect<A>
  someOnce<A>(this: Context, atom: Atom<Option.Option<A>>): Effect.Effect<A>
  stream<A>(this: Context, atom: Atom<A>, options?: {
  readonly withoutInitialValue?: boolean
  readonly bufferSize?: number
  }): Stream.Stream<A>
  streamResult<A, E>(this: Context, atom: Atom<AsyncResult.AsyncResult<A, E>>, options?: {
  readonly withoutInitialValue?: boolean
  readonly bufferSize?: number
  }): Stream.Stream<A, E>
  subscribe<A>(this: Context, atom: Atom<A>, f: (\_: A) => void, options?: {
  readonly immediate?: boolean
  }): void
  readonly registry: Registry.AtomRegistry
  }

/\*\*

- @since 4.0.0
- @category context
  \*/
  export interface WriteContext<A> {
  get<T>(this: WriteContext<A>, atom: Atom<T>): T
  refreshSelf(this: WriteContext<A>): void
  setSelf(this: WriteContext<A>, a: A): void
  set<R, W>(this: WriteContext<A>, atom: Writable<R, W>, value: W): void
  }

/\*\*

- @since 4.0.0
- @category combinators
  \*/
  export const setIdleTTL: {
  (duration: Duration.Input): <A extends Atom<any>>(self: A) => A
  <A extends Atom<any>>(self: A, duration: Duration.Input): A
  } = dual<
  (duration: Duration.Input) => <A extends Atom<any>>(self: A) => A,
  <A extends Atom<any>>(self: A, duration: Duration.Input) => A
  > (2, (self, durationInput) => {
  > const duration = Duration.fromInputUnsafe(durationInput)
  > const isFinite = Duration.isFinite(duration)
  > return Object.assign(Object.create(Object.getPrototypeOf(self)), {
      ...self,
      keepAlive: !isFinite,
      idleTTL: isFinite ? Duration.toMillis(duration) : undefined
  })
  })

const removeTtl = setIdleTTL(0)

const AtomProto = {
[TypeId]: TypeId,
...PipeInspectableProto,
toJSON(this: Atom<any>) {
return {
\_id: "Atom",
keepAlive: this.keepAlive,
lazy: this.lazy,
label: this.label
}
}
} as const

const RuntimeProto = {
...AtomProto,
atom(this: AtomRuntime<any, any>, arg: any, options?: {
readonly initialValue?: unknown
readonly uninterruptible?: boolean | undefined
}) {
const read = makeRead(arg, options)
return readable((get) => {
const previous = get.self<AsyncResult.AsyncResult<any, any>>()
const runtimeResult = get(this)
if (runtimeResult.\_tag !== "Success") {
return AsyncResult.replacePrevious(runtimeResult, previous)
}
return read(get, runtimeResult.value)
})
},

fn(this: AtomRuntime<any, any>, arg: any, options?: {
readonly initialValue?: unknown
readonly reactivityKeys?: ReadonlyArray<unknown> | ReadonlyRecord<string, ReadonlyArray<unknown>> | undefined
readonly concurrent?: boolean | undefined
}) {
if (arguments.length === 0) {
return (arg: any, options?: {}) => makeFnRuntime(this, arg, options)
}
return makeFnRuntime(this, arg, options)
},

pull(this: AtomRuntime<any, any>, arg: any, options?: {
readonly disableAccumulation?: boolean
readonly initialValue?: ReadonlyArray<any>
}) {
const pullSignal = removeTtl(state(0))
const pullAtom = readable((get) => {
const previous = get.self<AsyncResult.AsyncResult<any, any>>()
const runtimeResult = get(this)
if (runtimeResult.\_tag !== "Success") {
return AsyncResult.replacePrevious(runtimeResult, previous)
}
return makeEffect(
get,
makeStreamPullEffect(get, pullSignal, arg, options),
AsyncResult.initial(true),
runtimeResult.value
)
})
return makeStreamPull(pullSignal, pullAtom)
},

subscriptionRef(this: AtomRuntime<any, any>, ref: any) {
return makeSubRef(
removeTtl(readable((get) => {
const previous = get.self<AsyncResult.AsyncResult<any, any>>()
const runtimeResult = get(this)
if (runtimeResult.\_tag !== "Success") {
return AsyncResult.replacePrevious(runtimeResult, previous)
}
const value = typeof ref === "function" ? ref(get) : ref
return SubscriptionRef.isSubscriptionRef(value)
? value
: makeEffect(get, value, AsyncResult.initial(true), runtimeResult.value)
})),
(get, ref) => {
const runtime = AsyncResult.getOrThrow(get(this))
return readSubscriptionRef(get, ref, runtime)
}
)
}
}

const makeFnRuntime = (
self: AtomRuntime<any, any>,
arg: (
arg: any,
get: FnContext
) =>
| Effect.Effect<any, any, Scope.Scope | AtomRegistry>
| Stream.Stream<any, any, AtomRegistry>,
options?: {
readonly initialValue?: unknown
readonly reactivityKeys?: ReadonlyArray<unknown> | ReadonlyRecord<string, ReadonlyArray<unknown>> | undefined
}
) => {
const [read, write, argAtom] = makeResultFn(
options?.reactivityKeys ?
((a: any, get: FnContext) => {
const effect = arg(a, get)
return Effect.isEffect(effect)
? Reactivity.mutation(effect, options.reactivityKeys!)
: Stream.ensuring(effect, Reactivity.invalidate(options.reactivityKeys!))
}) as any :
arg,
options
)
return writable((get) => {
get.get(argAtom)
const previous = get.self<AsyncResult.AsyncResult<any, any>>()
const runtimeResult = get.get(self)
if (runtimeResult.\_tag !== "Success") {
return AsyncResult.replacePrevious(runtimeResult, previous)
}
return read(get, runtimeResult.value)
}, write)
}

const WritableProto = {
...AtomProto,
[WritableTypeId]: WritableTypeId
} as const

/\*\*

- @since 4.0.0
- @category refinements
  \*/
  export const isWritable = <R, W>(atom: Atom<R>): atom is Writable<R, W> => WritableTypeId in atom

/\*\*

- @since 4.0.0
- @category constructors
  \*/
  export const readable = <A>(
  read: (get: Context) => A,
  refresh?: (f: <A>(atom: Atom<A>) => void) => void
  ): Atom<A> => {
  const self = Object.create(AtomProto)
  self.keepAlive = false
  self.lazy = true
  self.read = read
  self.refresh = refresh
  return self
  }

/\*\*

- @since 4.0.0
- @category constructors
  \*/
  export const writable = <R, W>(
  read: (get: Context) => R,
  write: (ctx: WriteContext<R>, value: W) => void,
  refresh?: (f: <A>(atom: Atom<A>) => void) => void
  ): Writable<R, W> => {
  const self = Object.create(WritableProto)
  self.keepAlive = false
  self.lazy = true
  self.read = read
  self.write = write
  self.refresh = refresh
  return self
  }

function constSetSelf<A>(ctx: WriteContext<A>, value: A) {
ctx.setSelf(value)
}

// -----------------------------------------------------------------------------
// constructors
// -----------------------------------------------------------------------------

/\*\*

- @since 4.0.0
- @category constructors
  \*/
  export const make: {
  <A, E>(create: (get: Context) => Effect.Effect<A, E, Scope.Scope | AtomRegistry>, options?: {
  readonly initialValue?: A | undefined
  readonly uninterruptible?: boolean | undefined
  }): Atom<AsyncResult.AsyncResult<A, E>>
  <A, E>(effect: Effect.Effect<A, E, Scope.Scope | AtomRegistry>, options?: {
  readonly initialValue?: A
  readonly uninterruptible?: boolean | undefined
  }): Atom<AsyncResult.AsyncResult<A, E>>
  <A, E>(create: (get: Context) => Stream.Stream<A, E, AtomRegistry>, options?: {
  readonly initialValue?: A
  }): Atom<AsyncResult.AsyncResult<A, E | Cause.NoSuchElementError>>
  <A, E>(stream: Stream.Stream<A, E, AtomRegistry>, options?: {
  readonly initialValue?: A
  }): Atom<AsyncResult.AsyncResult<A, E | Cause.NoSuchElementError>>
  <A>(create: (get: Context) => A): Atom<A>
  <A>(initialValue: A): Writable<A>
  } = (arg: any, options?: {
  readonly initialValue?: unknown
  readonly uninterruptible?: boolean | undefined
  }) => {
  const readOrAtom = makeRead(arg, options)
  if (TypeId in readOrAtom) {
  return readOrAtom as any
  }
  return readable(readOrAtom)
  }

// -----------------------------------------------------------------------------
// constructors - effect
// -----------------------------------------------------------------------------

const makeRead: {
<A, E>(effect: Effect.Effect<A, E, Scope.Scope | AtomRegistry>, options?: {
readonly initialValue?: A
readonly uninterruptible?: boolean | undefined
}): (get: Context, services?: ServiceMap.ServiceMap<any>) => AsyncResult.AsyncResult<A, E>
<A, E>(create: (get: Context) => Effect.Effect<A, E, Scope.Scope | AtomRegistry>, options?: {
readonly initialValue?: A
readonly uninterruptible?: boolean | undefined
}): (get: Context, services?: ServiceMap.ServiceMap<any>) => AsyncResult.AsyncResult<A, E>
<A, E>(stream: Stream.Stream<A, E, AtomRegistry>, options?: {
readonly initialValue?: A
readonly uninterruptible?: boolean | undefined
}): (get: Context, services?: ServiceMap.ServiceMap<any>) => AsyncResult.AsyncResult<A, E | Cause.NoSuchElementError>
<A, E>(create: (get: Context) => Stream.Stream<A, E, AtomRegistry>, options?: {
readonly initialValue?: A
readonly uninterruptible?: boolean | undefined
}): (get: Context, services?: ServiceMap.ServiceMap<any>) => AsyncResult.AsyncResult<A, E | Cause.NoSuchElementError>
<A>(create: (get: Context) => A): (get: Context, services?: ServiceMap.ServiceMap<any>) => A
<A>(initialValue: A): Writable<A>
} = <A, E>(
arg:
| Effect.Effect<A, E, Scope.Scope | AtomRegistry>
| ((get: Context) => Effect.Effect<A, E, Scope.Scope | AtomRegistry>)
| Stream.Stream<A, E, AtomRegistry>
| ((get: Context) => Stream.Stream<A, E, AtomRegistry>)
| ((get: Context) => A)
| A,
options?: {
readonly initialValue?: unknown
readonly uninterruptible?: boolean | undefined
}
) => {
if (typeof arg === "function" && !Effect.isEffect(arg) && !Stream.isStream(arg)) {
const create = arg as (get: Context) => any
return function(get: Context, providedServices?: ServiceMap.ServiceMap<any>) {
const value = create(get)
switch (typeof value) {
case "function":
case "object": {
if (value === null) return value
else if (EffectTypeId in value) {
return effect(get, value as any, options, providedServices)
} else if (StreamTypeId in value) {
return stream(get, value as any, options, providedServices)
}
return value
}
default:
return value
}
}
} else if (Effect.isEffect(arg)) {
return function(get: Context, providedServices?: ServiceMap.ServiceMap<any>) {
return effect(get, arg as any, options, providedServices)
}
} else if (Stream.isStream(arg)) {
return function(get: Context, providedServices?: ServiceMap.ServiceMap<any>) {
return stream(get, arg as any, options, providedServices)
}
}

return state(arg) as any
}

const EffectTypeId: keyof Effect.Effect<any> = "~effect/Effect"
const StreamTypeId: keyof Stream.Stream<any> = "~effect/Stream"

const state = <A>(
initialValue: A
): Writable<A> =>
writable(function(\_get) {
return initialValue
}, constSetSelf)

const effect = <A, E>(
get: Context,
effect: Effect.Effect<A, E, Scope.Scope | AtomRegistry>,
options?: {
readonly initialValue?: A
readonly uninterruptible?: boolean | undefined
},
services?: ServiceMap.ServiceMap<any>
): AsyncResult.AsyncResult<A, E> => {
const initialValue = options?.initialValue !== undefined
? AsyncResult.success<A, E>(options.initialValue)
: AsyncResult.initial<A, E>()
return makeEffect(get, effect, initialValue, services, options?.uninterruptible)
}

function makeEffect<A, E>(
ctx: Context,
effect: Effect.Effect<A, E, Scope.Scope | AtomRegistry>,
initialValue: AsyncResult.AsyncResult<A, E>,
services = ServiceMap.empty(),
uninterruptible = false
): AsyncResult.AsyncResult<A, E> {
const previous = ctx.self<AsyncResult.AsyncResult<A, E>>()
const scope = Scope.makeUnsafe()
ctx.addFinalizer(() => {
Effect.runForkWith(services)(Scope.close(scope, Exit.void))
})
const servicesMap = new Map(services.mapUnsafe)
servicesMap.set(Scope.Scope.key, scope)
servicesMap.set(AtomRegistry.key, ctx.registry)
servicesMap.set(Scheduler.Scheduler.key, ctx.registry.scheduler)
let syncResult: AsyncResult.AsyncResult<A, E> | undefined
let isAsync = false
const cancel = runCallbackSync(
ServiceMap.makeUnsafe<Scope.Scope | AtomRegistry>(servicesMap),
effect,
function(exit) {
syncResult = AsyncResult.fromExitWithPrevious(exit, previous)
if (isAsync) {
ctx.setSelf(syncResult)
}
},
uninterruptible
)
isAsync = true
if (cancel !== undefined) {
ctx.addFinalizer(cancel)
}
if (syncResult !== undefined) {
return syncResult
} else if (previous.\_tag === "Some") {
return AsyncResult.waitingFrom(previous)
}
return AsyncResult.waiting(initialValue)
}

function runCallbackSync<R, A, E, ER = never>(
services: ServiceMap.ServiceMap<R>,
effect: Effect.Effect<A, E, R>,
onExit: (exit: Exit.Exit<A, E | ER>) => void,
uninterruptible = false
): (() => void) | undefined {
if (Exit.isExit(effect)) {
onExit(effect as any)
return undefined
}
const runFork = Effect.runForkWith(services)
const scheduler = ServiceMap.get(services, Scheduler.Scheduler)
const fiber = runFork(effect)
if ("flush" in scheduler) {
;(scheduler as Scheduler.MixedScheduler).flush()
}
const result = fiber.pollUnsafe()
if (result) {
onExit(result)
return undefined
}
const remove = fiber.addObserver(onExit)
function cancel() {
remove()
if (!uninterruptible) {
fiber.interruptUnsafe()
}
}
return cancel
}

// -----------------------------------------------------------------------------
// context
// -----------------------------------------------------------------------------

/\*\*

- @since 4.0.0
- @category models
  \*/
  export interface AtomRuntime<R, ER = never> extends Atom<AsyncResult.AsyncResult<ServiceMap.ServiceMap<R>, ER>> {
  readonly factory: RuntimeFactory

readonly layer: Atom<Layer.Layer<R, ER>>

readonly atom: {
<A, E>(
create: (get: Context) => Effect.Effect<A, E, Scope.Scope | R | AtomRegistry | Reactivity.Reactivity>,
options?: {
readonly initialValue?: A
readonly uninterruptible?: boolean | undefined
}
): Atom<AsyncResult.AsyncResult<A, E | ER>>
<A, E>(effect: Effect.Effect<A, E, Scope.Scope | R | AtomRegistry | Reactivity.Reactivity>, options?: {
readonly initialValue?: A
readonly uninterruptible?: boolean | undefined
}): Atom<AsyncResult.AsyncResult<A, E | ER>>
<A, E>(create: (get: Context) => Stream.Stream<A, E, AtomRegistry | Reactivity.Reactivity | R>, options?: {
readonly initialValue?: A
}): Atom<AsyncResult.AsyncResult<A, E | ER | Cause.NoSuchElementError>>
<A, E>(stream: Stream.Stream<A, E, AtomRegistry | Reactivity.Reactivity | R>, options?: {
readonly initialValue?: A
}): Atom<AsyncResult.AsyncResult<A, E | ER | Cause.NoSuchElementError>>
}

readonly fn: {
<Arg>(): {
<E, A>(
fn: (arg: Arg, get: FnContext) => Effect.Effect<A, E, Scope.Scope | AtomRegistry | Reactivity.Reactivity | R>,
options?: {
readonly initialValue?: A | undefined
readonly reactivityKeys?: ReadonlyArray<unknown> | ReadonlyRecord<string, ReadonlyArray<unknown>> | undefined
readonly concurrent?: boolean | undefined
}
): AtomResultFn<Arg, A, E | ER>
<E, A>(
fn: (arg: Arg, get: FnContext) => Stream.Stream<A, E, AtomRegistry | Reactivity.Reactivity | R>,
options?: {
readonly initialValue?: A | undefined
readonly reactivityKeys?: ReadonlyArray<unknown> | ReadonlyRecord<string, ReadonlyArray<unknown>> | undefined
readonly concurrent?: boolean | undefined
}
): AtomResultFn<Arg, A, E | ER | Cause.NoSuchElementError>
}
<E, A, Arg = void>(
fn: (arg: Arg, get: FnContext) => Effect.Effect<A, E, Scope.Scope | AtomRegistry | Reactivity.Reactivity | R>,
options?: {
readonly initialValue?: A | undefined
readonly reactivityKeys?: ReadonlyArray<unknown> | ReadonlyRecord<string, ReadonlyArray<unknown>> | undefined
readonly concurrent?: boolean | undefined
}
): AtomResultFn<Arg, A, E | ER>
<E, A, Arg = void>(
fn: (arg: Arg, get: FnContext) => Stream.Stream<A, E, AtomRegistry | Reactivity.Reactivity | R>,
options?: {
readonly initialValue?: A | undefined
readonly reactivityKeys?: ReadonlyArray<unknown> | ReadonlyRecord<string, ReadonlyArray<unknown>> | undefined
readonly concurrent?: boolean | undefined
}
): AtomResultFn<Arg, A, E | ER | Cause.NoSuchElementError>
}

readonly pull: <A, E>(
create:
| ((get: Context) => Stream.Stream<A, E, R | AtomRegistry | Reactivity.Reactivity>)
| Stream.Stream<A, E, R | AtomRegistry | Reactivity.Reactivity>,
options?: {
readonly disableAccumulation?: boolean
readonly initialValue?: ReadonlyArray<A>
}
) => Writable<PullResult<A, E | ER>, void>

readonly subscriptionRef: <A, E>(
create:
| Effect.Effect<SubscriptionRef.SubscriptionRef<A>, E, Scope.Scope | R | AtomRegistry | Reactivity.Reactivity>
| ((
get: Context
) => Effect.Effect<SubscriptionRef.SubscriptionRef<A>, E, Scope.Scope | R | AtomRegistry | Reactivity.Reactivity>)
) => Writable<AsyncResult.AsyncResult<A, E>, A>
}

/\*\*

- @since 4.0.0
- @category models
  \*/
  export interface RuntimeFactory {
  <R, E>(
  create:
  | Layer.Layer<R, E, AtomRegistry | Reactivity.Reactivity>
  | ((get: Context) => Layer.Layer<R, E, AtomRegistry | Reactivity.Reactivity>)
  ): AtomRuntime<R, E>
  readonly memoMap: Layer.MemoMap
  readonly addGlobalLayer: <A, E>(layer: Layer.Layer<A, E, AtomRegistry | Reactivity.Reactivity>) => void

/\*\*

- Uses the `Reactivity` service from the runtime to refresh the atom whenever
- the keys change.
  \*/
  readonly withReactivity: (
  keys: ReadonlyArray<unknown> | ReadonlyRecord<string, ReadonlyArray<unknown>>
  ) => <A extends Atom<any>>(atom: A) => A
  }

/\*\*

- @since 4.0.0
- @category constructors
  \*/
  export const context: (options: {
  readonly memoMap: Layer.MemoMap
  }) => RuntimeFactory = (options) => {
  let globalLayer: Layer.Layer<any, any, AtomRegistry> = Reactivity.layer
  function factory<E, R>(
  create:
  | Layer.Layer<R, E, AtomRegistry | Reactivity.Reactivity>
  | ((get: Context) => Layer.Layer<R, E, AtomRegistry | Reactivity.Reactivity>)
  ): AtomRuntime<R, E> {
  const self = Object.create(RuntimeProto)
  self.keepAlive = false
  self.lazy = true
  self.refresh = undefined
  self.factory = factory

      const layerAtom = keepAlive(
        typeof create === "function"
          ? readable((get) => Layer.provideMerge(create(get), globalLayer))
          : readable(() => Layer.provideMerge(create, globalLayer))
      )
      self.layer = layerAtom

      self.read = function read(get: Context) {
        const layer = get(layerAtom)
        const build = Effect.flatMap(Effect.scope, (scope) => Layer.buildWithMemoMap(layer, options.memoMap, scope))
        return effect(get, build, { uninterruptible: true })
      }

      return self

  }
  factory.memoMap = options.memoMap
  factory.addGlobalLayer = (layer: Layer.Layer<any, any, AtomRegistry | Reactivity.Reactivity>) => {
  globalLayer = Layer.provideMerge(globalLayer, Layer.provide(layer, Reactivity.layer))
  }
  const reactivityAtom = removeTtl(make(
  Effect.servicesWith((services: ServiceMap.ServiceMap<Scope.Scope>) =>
  Layer.buildWithMemoMap(Reactivity.layer, options.memoMap, ServiceMap.get(services, Scope.Scope))
  ).pipe(
  Effect.map(ServiceMap.get(Reactivity.Reactivity))
  )
  ))
  factory.withReactivity =
  (keys: ReadonlyArray<unknown> | ReadonlyRecord<string, ReadonlyArray<unknown>>) =>
  <A extends Atom<any>>(atom: A): A =>
  transform(atom, (get) => {
  const reactivity = AsyncResult.getOrThrow(get(reactivityAtom))
  get.addFinalizer(reactivity.registerUnsafe(keys, () => {
  get.refresh(atom)
  }))
  get.subscribe(atom, (value) => get.setSelf(value))
  return get.once(atom)
  }) as any as A
  return factory
  }

/\*\*

- @since 4.0.0
- @category context
  \*/
  export const defaultMemoMap: Layer.MemoMap = Layer.makeMemoMapUnsafe()

/\*\*

- @since 4.0.0
- @category context
  \*/
  export const runtime: RuntimeFactory = context({ memoMap: defaultMemoMap })

/\*\*

- An alias to `Rx.runtime.withReactivity`, for refreshing an atom whenever the
- keys change in the `Reactivity` service.
-
- @since 4.0.0
- @category Reactivity
  \*/
  export const withReactivity: (
  keys: ReadonlyArray<unknown> | ReadonlyRecord<string, ReadonlyArray<unknown>>
  ) => <A extends Atom<any>>(atom: A) => A = runtime.withReactivity

// -----------------------------------------------------------------------------
// constructors - stream
// -----------------------------------------------------------------------------

const stream = <A, E>(
get: Context,
stream: Stream.Stream<A, E, AtomRegistry>,
options?: {
readonly initialValue?: A
},
services?: ServiceMap.ServiceMap<any>
): AsyncResult.AsyncResult<A, E | Cause.NoSuchElementError> => {
const initialValue = options?.initialValue !== undefined
? AsyncResult.success<A, E>(options.initialValue)
: AsyncResult.initial<A, E>()
return makeStream(get, stream, initialValue, services)
}

function makeStream<A, E>(
ctx: Context,
stream: Stream.Stream<A, E, AtomRegistry>,
initialValue: AsyncResult.AsyncResult<A, E | Cause.NoSuchElementError>,
services = ServiceMap.empty()
): AsyncResult.AsyncResult<A, E | Cause.NoSuchElementError> {
const previous = ctx.self<AsyncResult.AsyncResult<A, E | Cause.NoSuchElementError>>()
services = ServiceMap.add(services, AtomRegistry, ctx.registry)

const run = Effect.scopedWith((scope) =>
Effect.flatMap(Channel.toPullScoped(stream.channel, scope), (pull) =>
Effect.whileLoop({
while: constTrue,
body: () => pull,
step(arr) {
ctx.setSelf(AsyncResult.success(Arr.lastNonEmpty(arr), {
waiting: true
}))
}
}))
).pipe(
Effect.catchCause((cause) => {
if (Pull.isDoneCause(cause)) {
pipe(
ctx.self<AsyncResult.AsyncResult<A, E | Cause.NoSuchElementError>>(),
Option.flatMap(AsyncResult.value),
Option.match({
onNone: () =>
ctx.setSelf(
AsyncResult.failWithPrevious(new Cause.NoSuchElementError(), {
previous: ctx.self<AsyncResult.AsyncResult<A, E | Cause.NoSuchElementError>>()
})
),
onSome: (a) => ctx.setSelf(AsyncResult.success(a))
})
)
} else {
ctx.setSelf(AsyncResult.failureWithPrevious(cause as Cause.Cause<E>, {
previous: ctx.self<AsyncResult.AsyncResult<A, E | Cause.NoSuchElementError>>()
}))
}
return Effect.void
})
)
const servicesMap = new Map(services.mapUnsafe)
servicesMap.set(AtomRegistry.key, ctx.registry)
servicesMap.set(Scheduler.Scheduler.key, ctx.registry.scheduler)

const cancel = runCallbackSync(
ServiceMap.makeUnsafe<AtomRegistry>(servicesMap),
run,
constVoid,
false
)
if (cancel !== undefined) {
ctx.addFinalizer(cancel)
}

if (previous.\_tag === "Some") {
return AsyncResult.waitingFrom(previous)
}
return AsyncResult.waiting(initialValue)
}

// -----------------------------------------------------------------------------
// constructors - subscription ref
// -----------------------------------------------------------------------------

/\*\*

- @since 4.0.0
- @category constructors
  \*/
  export const subscriptionRef: {
  <A>(ref: SubscriptionRef.SubscriptionRef<A> | ((get: Context) => SubscriptionRef.SubscriptionRef<A>)): Writable<A>
  <A, E>(
  effect:
  | Effect.Effect<SubscriptionRef.SubscriptionRef<A>, E, Scope.Scope | AtomRegistry>
  | ((get: Context) => Effect.Effect<SubscriptionRef.SubscriptionRef<A>, E, Scope.Scope | AtomRegistry>)
  ): Writable<AsyncResult.AsyncResult<A, E>, A>
  } = (
  ref:
  | SubscriptionRef.SubscriptionRef<any>
  | ((get: Context) => SubscriptionRef.SubscriptionRef<any>)
  | Effect.Effect<SubscriptionRef.SubscriptionRef<any>, any, Scope.Scope | AtomRegistry>
  | ((get: Context) => Effect.Effect<SubscriptionRef.SubscriptionRef<any>, any, Scope.Scope | AtomRegistry>)
  ) =>
  makeSubRef(
  readable((get) => {
  const value = typeof ref === "function" ? ref(get) : ref
  return SubscriptionRef.isSubscriptionRef(value)
  ? value
  : makeEffect(get, value, AsyncResult.initial(true))
  }),
  readSubscriptionRef
  ) as any

const readSubscriptionRef = (
get: Context,
sub:
| SubscriptionRef.SubscriptionRef<any>
| AsyncResult.AsyncResult<SubscriptionRef.SubscriptionRef<any>, any>,
services = ServiceMap.empty()
) => {
if (SubscriptionRef.isSubscriptionRef(sub)) {
get.addFinalizer(
SubscriptionRef.changes(sub).pipe(
Stream.runForEachArray((arr) => {
for (let i = 0; i < arr.length; i++) {
get.setSelf(arr[i])
}
return Effect.void
}),
Effect.runCallbackWith(services)
)
)
return Effect.runSyncWith(services)(SubscriptionRef.get(sub))
} else if (sub.\_tag !== "Success") {
return sub
}
return makeStream(get, SubscriptionRef.changes(sub.value), AsyncResult.initial(true), services)
}

const makeSubRef = (
refAtom: Atom<
SubscriptionRef.SubscriptionRef<any> | AsyncResult.AsyncResult<SubscriptionRef.SubscriptionRef<any>, any>

> ,
> read: (

    get: Context,
    ref: SubscriptionRef.SubscriptionRef<any> | AsyncResult.Success<SubscriptionRef.SubscriptionRef<any>, any>

) => any
) => {
function write(ctx: WriteContext<SubscriptionRef.SubscriptionRef<any>>, value: any) {
const ref = ctx.get(refAtom)
if (SubscriptionRef.isSubscriptionRef(ref)) {
Effect.runSync(SubscriptionRef.set(ref, value))
} else if (AsyncResult.isSuccess(ref)) {
Effect.runSync(SubscriptionRef.set(ref.value, value))
}
}
return writable((get) => {
const ref = get(refAtom)
if (SubscriptionRef.isSubscriptionRef(ref)) {
return read(get, ref)
} else if (AsyncResult.isSuccess(ref)) {
return read(get, ref)
}
return ref
}, write)
}

// -----------------------------------------------------------------------------
// constructors - functions
// -----------------------------------------------------------------------------

/\*\*

- @since 4.0.0
- @category models
  \*/
  export interface FnContext {
  <A>(atom: Atom<A>): A
  result<A, E>(this: FnContext, atom: Atom<AsyncResult.AsyncResult<A, E>>, options?: {
  readonly suspendOnWaiting?: boolean | undefined
  }): Effect.Effect<A, E>
  addFinalizer(this: FnContext, f: () => void): void
  mount<A>(this: FnContext, atom: Atom<A>): void
  refresh<A>(this: FnContext, atom: Atom<A>): void
  self<A>(this: FnContext): Option.Option<A>
  setSelf<A>(this: FnContext, a: A): void
  set<R, W>(this: FnContext, atom: Writable<R, W>, value: W): void
  setResult<A, E, W>(this: FnContext, atom: Writable<AsyncResult.AsyncResult<A, E>, W>, value: W): Effect.Effect<A, E>
  some<A>(this: FnContext, atom: Atom<Option.Option<A>>): Effect.Effect<A>
  stream<A>(this: FnContext, atom: Atom<A>, options?: {
  readonly withoutInitialValue?: boolean
  readonly bufferSize?: number
  }): Stream.Stream<A>
  streamResult<A, E>(this: FnContext, atom: Atom<AsyncResult.AsyncResult<A, E>>, options?: {
  readonly withoutInitialValue?: boolean
  readonly bufferSize?: number
  }): Stream.Stream<A, E>
  subscribe<A>(this: FnContext, atom: Atom<A>, f: (\_: A) => void, options?: {
  readonly immediate?: boolean
  }): void
  readonly registry: Registry.AtomRegistry
  }

/\*\*

- @since 4.0.0
- @category constructors
  \*/
  export const fnSync: {
  <Arg>(): {
  <A>(
  f: (arg: Arg, get: FnContext) => A
  ): Writable<Option.Option<A>, Arg>
  <A>(
  f: (arg: Arg, get: FnContext) => A,
  options: { readonly initialValue: A }
  ): Writable<A, Arg>
  }
  <A, Arg = void>(
  f: (arg: Arg, get: FnContext) => A
  ): Writable<Option.Option<A>, Arg>
  <A, Arg = void>(
  f: (arg: Arg, get: FnContext) => A,
  options: { readonly initialValue: A }
  ): Writable<A, Arg>
  } = function(...args: ReadonlyArray<any>) {
  if (args.length === 0) {
  return makeFnSync
  }
  return makeFnSync(...args as [any, any]) as any
  }

const makeFnSync = <Arg, A>(f: (arg: Arg, get: FnContext) => A, options?: {
readonly initialValue?: A
}): Writable<Option.Option<A> | A, Arg> => {
const argAtom = removeTtl(state<[number, Arg]>([0, undefined as any]))
const hasInitialValue = options?.initialValue !== undefined
return writable(function(get) {
;(get as any).isFn = true
const [counter, arg] = get.get(argAtom)
if (counter === 0) {
return hasInitialValue ? options.initialValue : Option.none()
}
return hasInitialValue ? f(arg, get) : Option.some(f(arg, get))
}, function(ctx, arg) {
batch(() => {
ctx.set(argAtom, [ctx.get(argAtom)[0] + 1, arg as Arg])
ctx.refreshSelf()
})
})
}

/\*\*

- @since 4.0.0
- @category models
  \*/
  export interface AtomResultFn<Arg, A, E = never>
  extends Writable<AsyncResult.AsyncResult<A, E>, Arg | Reset | Interrupt>
  {}

/\*\*

- @since 4.0.0
- @category symbols
  \*/
  export const Reset = Symbol.for("effect/reactivity/atom/Atom/Reset")

/\*\*

- @since 4.0.0
- @category symbols
  \*/
  export type Reset = typeof Reset

/\*\*

- @since 4.0.0
- @category symbols
  \*/
  export const Interrupt = Symbol.for("effect/reactivity/atom/Atom/Interrupt")

/\*\*

- @since 4.0.0
- @category symbols
  \*/
  export type Interrupt = typeof Interrupt

/\*\*

- @since 4.0.0
- @category constructors
  \*/
  export const fn: {
  <Arg>(): <E, A>(fn: (arg: Arg, get: FnContext) => Effect.Effect<A, E, Scope.Scope | AtomRegistry>, options?: {
  readonly initialValue?: A | undefined
  readonly concurrent?: boolean | undefined
  }) => AtomResultFn<Arg, A, E>
  <E, A, Arg = void>(fn: (arg: Arg, get: FnContext) => Effect.Effect<A, E, Scope.Scope | AtomRegistry>, options?: {
  readonly initialValue?: A | undefined
  readonly concurrent?: boolean | undefined
  }): AtomResultFn<Arg, A, E>
  <Arg>(): <E, A>(fn: (arg: Arg, get: FnContext) => Stream.Stream<A, E, AtomRegistry>, options?: {
  readonly initialValue?: A | undefined
  readonly concurrent?: boolean | undefined
  }) => AtomResultFn<Arg, A, E | Cause.NoSuchElementError>
  <E, A, Arg = void>(fn: (arg: Arg, get: FnContext) => Stream.Stream<A, E, AtomRegistry>, options?: {
  readonly initialValue?: A | undefined
  readonly concurrent?: boolean | undefined
  }): AtomResultFn<Arg, A, E | Cause.NoSuchElementError>
  } = function(...args: ReadonlyArray<any>) {
  if (args.length === 0) {
  return makeFn
  }
  return makeFn(...args as [any, any]) as any
  }

const makeFn = <Arg, E, A>(
f: (arg: Arg, get: FnContext) => Stream.Stream<A, E, AtomRegistry> | Effect.Effect<A, E, Scope.Scope | AtomRegistry>,
options?: {
readonly initialValue?: A | undefined
readonly concurrent?: boolean | undefined
}
): AtomResultFn<Arg, A, E | Cause.NoSuchElementError> => {
const [read, write] = makeResultFn(f, options)
return writable(read, write) as any
}

function makeResultFn<Arg, E, A>(
f: (arg: Arg, get: FnContext) => Effect.Effect<A, E, Scope.Scope | AtomRegistry> | Stream.Stream<A, E, AtomRegistry>,
options?: {
readonly initialValue?: A
readonly concurrent?: boolean | undefined
}
) {
const argAtom = removeTtl(state<[number, Arg | Interrupt]>([0, undefined as any]))
const initialValue = options?.initialValue !== undefined
? AsyncResult.success<A, E>(options.initialValue)
: AsyncResult.initial<A, E>()
const fibersAtom = options?.concurrent
? removeTtl(readable((get) => {
const fibers = new Set<Fiber.Fiber<any, any>>()
get.addFinalizer(() => fibers.forEach((f) => f.interruptUnsafe()))
return fibers
}))
: undefined

function read(
get: Context,
services?: ServiceMap.ServiceMap<any>
): AsyncResult.AsyncResult<A, E | Cause.NoSuchElementError> {
const fibers = fibersAtom ? get(fibersAtom) : undefined
;(get as any).isFn = true
const [counter, arg] = get.get(argAtom)
if (counter === 0) {
return initialValue
} else if (arg === Interrupt) {
return AsyncResult.failureWithPrevious(Cause.interrupt(), { previous: get.self() })
}
let value = f(arg, get)
if (EffectTypeId in value) {
if (fibers) {
const eff = value as Effect.Effect<A, E, Scope.Scope | AtomRegistry>
value = Effect.flatMap(
Effect.forkDetach(eff, { startImmediately: true }),
(fiber) => {
fibers.add(fiber)
fiber.addObserver(() => fibers.delete(fiber))
return Effect.map(Fiber.joinAll(fibers), (arr) => arr[0])
}
)
}
return makeEffect(get, value as any, initialValue, services, false)
}
return makeStream(get, value as any, initialValue, services)
}
function write(
ctx: WriteContext<AsyncResult.AsyncResult<A, E | Cause.NoSuchElementError>>,
arg: Arg | Reset | Interrupt
) {
batch(() => {
if (arg === Reset) {
ctx.set(argAtom, [0, undefined as any])
} else if (arg === Interrupt) {
ctx.set(argAtom, [ctx.get(argAtom)[0] + 1, Interrupt])
} else {
ctx.set(argAtom, [ctx.get(argAtom)[0] + 1, arg])
}
ctx.refreshSelf()
})
}
return [read, write, argAtom] as const
}

/\*\*

- @since 4.0.0
- @category models
  \*/
  export type PullResult<A, E = never> = AsyncResult.AsyncResult<{
  readonly done: boolean
  readonly items: Arr.NonEmptyArray<A>
  }, E | Cause.NoSuchElementError>

/\*\*

- @since 4.0.0
- @category constructors
  \*/
  export const pull = <A, E>(
  create: ((get: Context) => Stream.Stream<A, E, AtomRegistry>) | Stream.Stream<A, E, AtomRegistry>,
  options?: {
  readonly disableAccumulation?: boolean | undefined
  }
  ): Writable<PullResult<A, E>, void> => {
  const pullSignal = removeTtl(state(0))
  const pullAtom = readable(makeRead(function(get) {
  return makeStreamPullEffect(get, pullSignal, create, options)
  }))
  return makeStreamPull(pullSignal, pullAtom)
  }

const makeStreamPullEffect = <A, E>(
get: Context,
pullSignal: Atom<number>,
create: Stream.Stream<A, E, AtomRegistry> | ((get: Context) => Stream.Stream<A, E, AtomRegistry>),
options?: {
readonly disableAccumulation?: boolean | undefined
}
): Effect.Effect<
{ readonly done: boolean; readonly items: Arr.NonEmptyArray<A> },
E | Cause.NoSuchElementError,
Scope.Scope | AtomRegistry

> =>
> Effect.flatMap(

    Stream.toPull(typeof create === "function" ? create(get) : create),
    (pullChunk) => {
      const fiber = Fiber.getCurrent()!
      const services = fiber.services as ServiceMap.ServiceMap<AtomRegistry | Scope.Scope>
      let acc: ReadonlyArray<A> = Arr.empty<A>()
      const pull: Effect.Effect<
        {
          done: boolean
          items: Arr.NonEmptyArray<A>
        },
        Cause.NoSuchElementError | E,
        Registry.AtomRegistry
      > = Effect.matchCauseEffect(pullChunk, {
        onFailure(cause): Effect.Effect<
          { done: boolean; items: Arr.NonEmptyArray<A> },
          Cause.NoSuchElementError | E
        > {
          if (Pull.isDoneCause(cause)) {
            if (!Arr.isReadonlyArrayNonEmpty(acc)) {
              return Effect.fail(new Cause.NoSuchElementError(`Atom.pull: no items`))
            }
            return Effect.succeed({ done: true, items: acc as Arr.NonEmptyArray<A> })
          }
          return Effect.failCause(cause as Cause.Cause<E>)
        },
        onSuccess(chunk) {
          let items: Arr.NonEmptyArray<A>
          if (options?.disableAccumulation) {
            items = chunk as any
          } else {
            items = Arr.appendAll(acc, chunk)
            acc = items
          }
          return Effect.succeed({ done: false, items })
        }
      })

      const cancels = new Set<() => void>()
      get.addFinalizer(() => {
        for (const cancel of cancels) cancel()
      })
      get.once(pullSignal)
      get.subscribe(pullSignal, () => {
        get.setSelf(AsyncResult.waitingFrom(get.self<PullResult<A, E>>()))
        let cancel: (() => void) | undefined
        // eslint-disable-next-line prefer-const
        cancel = runCallbackSync(services, pull, (exit) => {
          if (cancel) cancels.delete(cancel)
          const result = AsyncResult.fromExitWithPrevious(exit, get.self())
          const pending = cancels.size > 0
          get.setSelf(pending ? AsyncResult.waiting(result) : result)
        })
        if (cancel) cancels.add(cancel)
      })

      return pull
    }

)

const makeStreamPull = <A, E>(
pullSignal: Writable<number>,
pullAtom: Atom<PullResult<A, E>>
) =>
writable(pullAtom.read, function(ctx, \_) {
ctx.set(pullSignal, ctx.get(pullSignal) + 1)
})

/\*\*

- @since 4.0.0
- @category constructors
  \*/
  export const family = typeof WeakRef === "undefined" || typeof FinalizationRegistry === "undefined" ?
  <Arg, T extends object>(
  f: (arg: Arg) => T
  ): (arg: Arg) => T => {
  const atoms = MutableHashMap.empty<Arg, T>()
  return function(arg) {
  const atomEntry = MutableHashMap.get(atoms, arg)
  if (atomEntry.\_tag === "Some") {
  return atomEntry.value
  }
  const newAtom = f(arg)
  MutableHashMap.set(atoms, arg, newAtom)
  return newAtom
  }
  } :
  <Arg, T extends object>(
  f: (arg: Arg) => T
  ): (arg: Arg) => T => {
  const atoms = MutableHashMap.empty<Arg, WeakRef<T>>()
  const registry = new FinalizationRegistry<Arg>((arg) => {
  MutableHashMap.remove(atoms, arg)
  })
  return function(arg) {
  const atomEntry = MutableHashMap.get(atoms, arg).pipe(
  Option.flatMapNullishOr((ref) => ref.deref())
  )

        if (atomEntry._tag === "Some") {
          return atomEntry.value
        }
        const newAtom = f(arg)
        MutableHashMap.set(atoms, arg, new WeakRef(newAtom))
        registry.register(newAtom, arg)
        return newAtom
      }

  }

/\*\*

- @since 4.0.0
- @category combinators
  \*/
  export const withFallback: {
  <E2, A2>(
  fallback: Atom<AsyncResult.AsyncResult<A2, E2>>
  ): <R extends Atom<AsyncResult.AsyncResult<any, any>>>(
  self: R
  ) => [R] extends [Writable<infer _, infer RW>] ? Writable<
  AsyncResult.AsyncResult<
  AsyncResult.AsyncResult.Success<Type<R>> | A2,
  AsyncResult.AsyncResult.Failure<Type<R>> | E2 >,
  RW >
  : Atom<
  AsyncResult.AsyncResult<
  AsyncResult.AsyncResult.Success<Type<R>> | A2,
  AsyncResult.AsyncResult.Failure<Type<R>> | E2 > >
  <R extends Atom<AsyncResult.AsyncResult<any, any>>, A2, E2>(
  self: R,
  fallback: Atom<AsyncResult.AsyncResult<A2, E2>>
  ): [R] extends [Writable<infer _, infer RW>] ? Writable<
  AsyncResult.AsyncResult<
  AsyncResult.AsyncResult.Success<Type<R>> | A2,
  AsyncResult.AsyncResult.Failure<Type<R>> | E2 >,
  RW >
  : Atom<
  AsyncResult.AsyncResult<
  AsyncResult.AsyncResult.Success<Type<R>> | A2,
  AsyncResult.AsyncResult.Failure<Type<R>> | E2 > >
  } = dual(2, <R extends Atom<AsyncResult.AsyncResult<any, any>>, A2, E2>(
  self: R,
  fallback: Atom<AsyncResult.AsyncResult<A2, E2>>
  ): [R] extends [Writable<infer _, infer RW>] ? Writable<
  AsyncResult.AsyncResult<
  AsyncResult.AsyncResult.Success<Type<R>> | A2,
  AsyncResult.AsyncResult.Failure<Type<R>> | E2 >,
  RW
  > : Atom<
      AsyncResult.AsyncResult<
        AsyncResult.AsyncResult.Success<Type<R>> | A2,
        AsyncResult.AsyncResult.Failure<Type<R>> | E2
      >
  > =>
  > {
  > function withFallback(get: Context) {
      const result = get(self)
      if (result._tag === "Initial") {
        return AsyncResult.waiting(get(fallback))
      }
      return result
  }
  return isWritable(self)
  ? writable(
  withFallback,
  self.write,
  self.refresh ?? function(refresh) {
  refresh(self)
  }
  ) as any
  : readable(
  withFallback,
  self.refresh ?? function(refresh) {
  refresh(self)
  }
  ) as any
  })

/\*\*

- @since 4.0.0
- @category combinators
  \*/
  export const keepAlive = <A extends Atom<any>>(self: A): A =>
  Object.assign(Object.create(Object.getPrototypeOf(self)), {
  ...self,
  keepAlive: true
  })

/\*\*

- Reverts the `keepAlive` behavior of a reactive value, allowing it to be
- disposed of when not in use.
-
- Note that Atom's have this behavior by default.
-
- @since 4.0.0
- @category combinators
  \*/
  export const autoDispose = <A extends Atom<any>>(self: A): A =>
  Object.assign(Object.create(Object.getPrototypeOf(self)), {
  ...self,
  keepAlive: false
  })

/\*\*

- @since 4.0.0
- @category combinators
  \*/
  export const setLazy: {
  (lazy: boolean): <A extends Atom<any>>(self: A) => A
  <A extends Atom<any>>(self: A, lazy: boolean): A
  } = dual(2, <A extends Atom<any>>(self: A, lazy: boolean) =>
  Object.assign(Object.create(Object.getPrototypeOf(self)), {
  ...self,
  lazy
  }))

/\*\*

- @since 4.0.0
- @category combinators
  \*/
  export const withLabel: {
  (name: string): <A extends Atom<any>>(self: A) => A
  <A extends Atom<any>>(self: A, name: string): A
  } = dual<
  (name: string) => <A extends Atom<any>>(self: A) => A,
  <A extends Atom<any>>(self: A, name: string) => A
  > (2, (self, name) =>
  > Object.assign(Object.create(Object.getPrototypeOf(self)), {
      ...self,
      label: [name, new Error().stack?.split("\n")[5] ?? ""]
  }))

/\*\*

- @since 4.0.0
- @category combinators
  \*/
  export const initialValue: {
  <A>(initialValue: A): (self: Atom<A>) => readonly [Atom<A>, A]
  <A>(self: Atom<A>, initialValue: A): readonly [Atom<A>, A]
  } = dual<
  <A>(initialValue: A) => (self: Atom<A>) => readonly [Atom<A>, A],
  <A>(self: Atom<A>, initialValue: A) => readonly [Atom<A>, A]
  > (2, (self, initialValue) => [self, initialValue])

/\*\*

- @since 4.0.0
- @category combinators
  \*/
  export const transform: {
  <R extends Atom<any>, B>(
  f: (get: Context, atom: R) => B
  ): (self: R) => [R] extends [Writable<infer _, infer RW>] ? Writable<B, RW> : Atom<B>
  <R extends Atom<any>, B>(
  self: R,
  f: (get: Context, atom: R) => B
  ): [R] extends [Writable<infer _, infer RW>] ? Writable<B, RW> : Atom<B>
  } = dual(
  2,
  (<A, B>(self: Atom<A>, f: (get: Context, atom: Atom<A>) => B): Atom<B> =>
  isWritable(self)
  ? writable(
  (get) => f(get, self),
  function(ctx, value) {
  ctx.set(self, value)
  },
  self.refresh ?? function(refresh) {
  refresh(self)
  }
  )
  : readable(
  (get) => f(get, self),
  self.refresh ?? function(refresh) {
  refresh(self)
  }
  )) as any
  )

/\*\*

- @since 4.0.0
- @category combinators
  \*/
  export const map: {
  <R extends Atom<any>, B>(
  f: (_: Type<R>) => B
  ): (self: R) => [R] extends [Writable<infer _, infer RW>] ? Writable<B, RW> : Atom<B>
  <R extends Atom<any>, B>(
  self: R,
  f: (_: Type<R>) => B
  ): [R] extends [Writable<infer _, infer RW>] ? Writable<B, RW> : Atom<B>
  } = dual(
  2,
  <A, B>(self: Atom<A>, f: (\_: A) => B): Atom<B> => transform(self, (get) => f(get(self)))
  )

/\*\*

- @since 4.0.0
- @category combinators
  \*/
  export const mapResult: {
  <R extends Atom<AsyncResult.AsyncResult<any, any>>, B>(
  f: (_: AsyncResult.AsyncResult.Success<Type<R>>) => B
  ): (
  self: R
  ) => [R] extends [Writable<infer _, infer RW>] ?
  Writable<AsyncResult.AsyncResult<B, AsyncResult.AsyncResult.Failure<Type<R>>>, RW>
  : Atom<AsyncResult.AsyncResult<B, AsyncResult.AsyncResult.Failure<Type<R>>>>
  <R extends Atom<AsyncResult.AsyncResult<any, any>>, B>(
  self: R,
  f: (_: AsyncResult.AsyncResult.Success<Type<R>>) => B
  ): [R] extends [Writable<infer _, infer RW>] ?
  Writable<AsyncResult.AsyncResult<B, AsyncResult.AsyncResult.Failure<Type<R>>>, RW>
  : Atom<AsyncResult.AsyncResult<B, AsyncResult.AsyncResult.Failure<Type<R>>>>
  } = dual(2, <R extends Atom<AsyncResult.AsyncResult<any, any>>, B>(
  self: R,
  f: (_: AsyncResult.AsyncResult.Success<Type<R>>) => B
  ): [R] extends [Writable<infer _, infer RW>] ?
  Writable<AsyncResult.AsyncResult<B, AsyncResult.AsyncResult.Failure<Type<R>>>, RW>
  : Atom<AsyncResult.AsyncResult<B, AsyncResult.AsyncResult.Failure<Type<R>>>> => map(self, AsyncResult.map(f)))

/\*\*

- @since 4.0.0
- @category combinators
  \*/
  export const debounce: {
  (duration: Duration.Input): <A extends Atom<any>>(self: A) => WithoutSerializable<A>
  <A extends Atom<any>>(self: A, duration: Duration.Input): WithoutSerializable<A>
  } = dual(
  2,
  <A>(self: Atom<A>, duration: Duration.Input): Atom<A> => {
  const millis = Duration.toMillis(Duration.fromInputUnsafe(duration))
  return transform(self, function(get) {
  let timeout: number | undefined
  let value = get.once(self)
  function update() {
  timeout = undefined
  get.setSelf(value)
  }
  get.addFinalizer(function() {
  if (timeout) clearTimeout(timeout)
  })
  get.subscribe(self, function(val) {
  value = val
  if (timeout) clearTimeout(timeout)
  timeout = setTimeout(update, millis) as any
  })
  return value
  })
  }
  )

/\*\*

- Ensures that the value of the atom is refreshed at most once per specified
- duration.
-
- @since 4.0.0
- @category combinators
  \*/
  export const withRefresh: {
  (duration: Duration.Input): <A extends Atom<any>>(self: A) => WithoutSerializable<A>
  <A extends Atom<any>>(self: A, duration: Duration.Input): WithoutSerializable<A>
  } = dual(
  2,
  <A>(self: Atom<A>, duration: Duration.Input): Atom<A> => {
  const millis = Duration.toMillis(Duration.fromInputUnsafe(duration))
  return transform(self, function(get) {
  const handle = setTimeout(() => get.refresh(self), millis) as any
  get.addFinalizer(() => clearTimeout(handle))
  return get(self)
  })
  }
  )

/\*\*

- @since 4.0.0
- @category Optimistic
  \*/
  export const optimistic = <A>(self: Atom<A>): Writable<A, Atom<AsyncResult.AsyncResult<A, unknown>>> => {
  let counter = 0
  const writeAtom = removeTtl(state(
  [
  counter,
  undefined as any as Atom<AsyncResult.AsyncResult<A, unknown>>
  ] as const
  ))
  return writable(
  (get) => {
  let lastValue = get.once(self)
  let needsRefresh = false
  get.subscribe(self, (value) => {
  lastValue = value
  if (transitions.size > 0) {
  return
  }
  needsRefresh = false
  if (!AsyncResult.isAsyncResult(value)) {
  return get.setSelf(value)
  }
  const current = Option.getOrUndefined(get.self<AsyncResult.AsyncResult<any, any>>())!
  switch (value.\_tag) {
  case "Initial": {
  if (AsyncResult.isInitial(current)) {
  get.setSelf(value)
  }
  return
  }
  case "Success": {
  if (AsyncResult.isSuccess(current)) {
  if (!value.waiting && value.timestamp >= current.timestamp) {
  get.setSelf(value)
  }
  } else {
  get.setSelf(value)
  }
  return
  }
  case "Failure": {
  return get.setSelf(value)
  }
  }
  })
  const transitions = new Set<Atom<AsyncResult.AsyncResult<A, unknown>>>()
  const cancels = new Set<() => void>()
  get.subscribe(writeAtom, ([, atom]) => {
  if (transitions.has(atom)) return
  transitions.add(atom)
  let cancel: (() => void) | undefined
  // eslint-disable-next-line prefer-const
  cancel = get.registry.subscribe(atom, (result) => {
  if (AsyncResult.isSuccess(result) && result.waiting) {
  return get.setSelf(result.value)
  }
  transitions.delete(atom)
  if (cancel) {
  cancels.delete(cancel)
  cancel()
  }
  if (!needsRefresh && !AsyncResult.isFailure(result)) {
  needsRefresh = true
  }
  if (transitions.size === 0) {
  if (needsRefresh) {
  needsRefresh = false
  get.refresh(self)
  } else {
  get.setSelf(lastValue)
  }
  }
  }, { immediate: true })
  if (transitions.has(atom)) {
  cancels.add(cancel)
  } else {
  cancel()
  }
  })
  get.addFinalizer(() => {
  for (const cancel of cancels) cancel()
  transitions.clear()
  cancels.clear()
  })
  return lastValue
  },
  (ctx, atom) => ctx.set(writeAtom, [++counter, atom]),
  (refresh) => refresh(self)
  )
  }

/\*\*

- @since 4.0.0
- @category Optimistic
  \*/
  export const optimisticFn: {
  <A, W, XA, XE, OW = void>(
  options: {
  readonly reducer: (current: NoInfer<A>, update: OW) => NoInfer<W>
  readonly fn:
  | AtomResultFn<OW, XA, XE>
  | ((set: (result: NoInfer<W>) => void) => AtomResultFn<OW, XA, XE>)
  }
  ): (
  self: Writable<A, Atom<AsyncResult.AsyncResult<W, unknown>>>
  ) => AtomResultFn<OW, XA, XE>
  <A, W, XA, XE, OW = void>(
  self: Writable<A, Atom<AsyncResult.AsyncResult<W, unknown>>>,
  options: {
  readonly reducer: (current: NoInfer<A>, update: OW) => NoInfer<W>
  readonly fn:
  | AtomResultFn<OW, XA, XE>
  | ((set: (result: NoInfer<W>) => void) => AtomResultFn<OW, XA, XE>)
  }
  ): AtomResultFn<OW, XA, XE>
  } = dual(2, <A, W, XA, XE, OW = void>(
  self: Writable<A, Atom<AsyncResult.AsyncResult<W, unknown>>>,
  options: {
  readonly reducer: (current: NoInfer<A>, update: OW) => NoInfer<W>
  readonly fn:
  | AtomResultFn<OW, XA, XE>
  | ((set: (result: NoInfer<W>) => void) => AtomResultFn<OW, XA, XE>)
  }
  ): AtomResultFn<OW, XA, XE> => {
  const transition = removeTtl(state<AsyncResult.AsyncResult<W, unknown>>(AsyncResult.initial()))
  return fn((arg: OW, get) => {
  let value = options.reducer(get(self), arg)
  if (AsyncResult.isAsyncResult(value)) {
  value = AsyncResult.waiting(value, { touch: true })
  }
  get.set(transition, AsyncResult.success(value, { waiting: true }))
  get.set(self, transition)
  const fn = typeof options.fn === "function"
  ? autoDispose(options.fn((value) =>
  get.set(
  transition,
  AsyncResult.success(AsyncResult.isAsyncResult(value) ? AsyncResult.waiting(value) : value, { waiting: true })
  )
  ))
  : options.fn
  get.set(fn, arg)
  return Effect.callback<XA, XE>((resume) => {
  get.subscribe(fn, (result) => {
  if (result.\_tag === "Initial" || result.waiting) return
  get.set(transition, AsyncResult.map(result, () => value))
  resume(AsyncResult.toExit(result) as any)
  }, { immediate: true })
  })
  })
  })

/\*\*

- @since 4.0.0
- @category batching
  \*/
  export const batch: (f: () => void) => void = Registry.batch

// -----------------------------------------------------------------------------
// Focus
// -----------------------------------------------------------------------------

/\*\*

- @since 4.0.0
- @category Focus
  \*/
  export const windowFocusSignal: Atom<number> = readable((get) => {
  let count = 0
  function update() {
  if (document.visibilityState === "visible") {
  get.setSelf(++count)
  }
  }
  window.addEventListener("visibilitychange", update)
  get.addFinalizer(() => {
  window.removeEventListener("visibilitychange", update)
  })
  return count
  })

/\*\*

- @since 4.0.0
- @category Focus
  \*/
  export const makeRefreshOnSignal = <_>(signal: Atom<_>) => <A extends Atom<any>>(self: A): WithoutSerializable<A> =>
  transform(self, (get) => {
  get.once(signal)
  get.subscribe(signal, (\_) => get.refresh(self))
  get.subscribe(self, (value) => get.setSelf(value))
  return get.once(self)
  }) as any

/\*\*

- @since 4.0.0
- @category Focus
  \*/
  export const refreshOnWindowFocus: <A extends Atom<any>>(self: A) => WithoutSerializable<A> = makeRefreshOnSignal(
  windowFocusSignal
  )

// -----------------------------------------------------------------------------
// KeyValueStore
// -----------------------------------------------------------------------------

/\*\*

- @since 4.0.0
- @category KeyValueStore
  \*/
  export const kvs = <S extends Schema.Codec<any, any>, const Mode extends "sync" | "async" = never>(options: {
  readonly runtime: AtomRuntime<KeyValueStore.KeyValueStore, any>
  readonly key: string
  readonly schema: S
  readonly defaultValue: LazyArg<S["Type"]>
  readonly mode?: Mode | undefined
  }): Writable<"async" extends Mode ? AsyncResult.AsyncResult<S["Type"]> : S["Type"], S["Type"]> => {
  const setAtom = options.runtime.fn(
  (value: S["Type"]) =>
  KeyValueStore.KeyValueStore.use((store) =>
  KeyValueStore.toSchemaStore(store, options.schema).set(options.key, value)
  )
  )
  const resultAtom = options.runtime.atom(
  KeyValueStore.KeyValueStore.use((store) => KeyValueStore.toSchemaStore(store, options.schema).get(options.key))
  )
  return writable(
  options.mode === "async" ?
  (get) => {
  get.mount(setAtom)
  const mapper = AsyncResult.map<Option.Option<S["Type"]>, S["Type"]>(
  Option.getOrElse(() => {
  const value = options.defaultValue()
  get.set(setAtom, value)
  return value
  })
  )
  get.subscribe(resultAtom, (result) => get.setSelf(mapper(result)))
  return mapper(get.once(resultAtom))
  } :
  (get) => {
  get.mount(setAtom)
  get.subscribe(resultAtom, (result) => {
  if (!AsyncResult.isSuccess(result)) return
  if (Option.isSome(result.value)) {
  get.setSelf(result.value.value)
  } else {
  const value = Option.getOrElse(get.self<S["Type"]>(), options.defaultValue)
  get.setSelf(value)
  get.set(setAtom, value)
  }
  }, { immediate: true })
  return Option.getOrElse(get.self<S["Type"]>(), options.defaultValue)
  },
  (ctx, value: S["Type"]) => {
  ctx.set(setAtom, value as any)
  ctx.setSelf(value)
  }
  ) as any
  }

// -----------------------------------------------------------------------------
// URL search params
// -----------------------------------------------------------------------------

/\*\*

- Create an Atom that reads and writes a URL search parameter.
-
- Note: If you pass a schema, it has to be synchronous and have no context.
-
- @since 4.0.0
- @category URL search params
  \*/
  export const searchParam = <S extends Schema.Codec<any, string> = never>(name: string, options?: {
  readonly schema?: S | undefined
  }): Writable<S extends never ? string : Option.Option<S["Type"]>> => {
  const decode = options?.schema && Schema.decodeExit(options.schema)
  const encode = options?.schema && Schema.encodeExit(options.schema)
  return writable(
  (get) => {
  if (typeof window === "undefined") {
  return decode ? Option.none() : ""
  }
  const handleUpdate = () => {
  if (searchParamState.updating) return
  const searchParams = new URLSearchParams(window.location.search)
  const newValue = searchParams.get(name) || ""
  if (decode) {
  get.setSelf(Exit.getSuccess(decode(newValue)))
  } else if (newValue !== Option.getOrUndefined(get.self())) {
  get.setSelf(newValue)
  }
  }
  window.addEventListener("popstate", handleUpdate)
  window.addEventListener("pushstate", handleUpdate)
  get.addFinalizer(() => {
  window.removeEventListener("popstate", handleUpdate)
  window.removeEventListener("pushstate", handleUpdate)
  })
  const value = new URLSearchParams(window.location.search).get(name) || ""
  return decode ? Exit.getSuccess(decode(value)) : value as any
  },
  (ctx, value: any) => {
  if (typeof window === "undefined") {
  ctx.setSelf(value)
  return
  }

        if (encode) {
          const encoded = Option.flatMap(value, (v) => Exit.getSuccess(encode(v as S["Type"])))
          searchParamState.updates.set(name, Option.getOrElse(encoded, () => ""))
          value = Option.zipRight(encoded, value)
        } else {
          searchParamState.updates.set(name, value)
        }
        ctx.setSelf(value)
        if (searchParamState.timeout) {
          clearTimeout(searchParamState.timeout)
        }
        searchParamState.timeout = setTimeout(updateSearchParams, 500) as any
      }

  )
  }

const searchParamState = {
timeout: undefined as number | undefined,
updates: new Map<string, string>(),
updating: false
}

function updateSearchParams() {
searchParamState.timeout = undefined
searchParamState.updating = true
const searchParams = new URLSearchParams(window.location.search)
for (const [key, value] of searchParamState.updates.entries()) {
if (value.length > 0) {
searchParams.set(key, value)
} else {
searchParams.delete(key)
}
}
searchParamState.updates.clear()
const newUrl = `${window.location.pathname}?${searchParams.toString()}`
window.history.pushState({}, "", newUrl)
searchParamState.updating = false
}

// -----------------------------------------------------------------------------
// conversions
// -----------------------------------------------------------------------------

/\*\*

- @since 4.0.0
- @category Conversions
  \*/
  export const toStream = <A>(self: Atom<A>): Stream.Stream<A, never, AtomRegistry> =>
  Stream.unwrap(AtomRegistry.use((r) => Effect.succeed(Registry.toStream(r, self))))

/\*\*

- @since 4.0.0
- @category Conversions
  \*/
  export const toStreamResult = <A, E>(self: Atom<AsyncResult.AsyncResult<A, E>>): Stream.Stream<A, E, AtomRegistry> =>
  Stream.unwrap(AtomRegistry.use((r) => Effect.succeed(Registry.toStreamResult(r, self))))

/\*\*

- @since 4.0.0
- @category Conversions
  \*/
  export const get = <A>(self: Atom<A>): Effect.Effect<A, never, AtomRegistry> =>
  AtomRegistry.use((r) => Effect.succeed(r.get(self)))

/\*\*

- @since 4.0.0
- @category Conversions
  \*/
  export const modify: {
  <R, W, A>(
  f: (_: R) => [returnValue: A, nextValue: W]
  ): (self: Writable<R, W>) => Effect.Effect<A, never, AtomRegistry>
  <R, W, A>(self: Writable<R, W>, f: (_: R) => [returnValue: A, nextValue: W]): Effect.Effect<A, never, AtomRegistry>
  } = dual(
  2,
  <R, W, A>(self: Writable<R, W>, f: (_: R) => [returnValue: A, nextValue: W]): Effect.Effect<A, never, AtomRegistry> =>
  Effect.map(AtomRegistry.asEffect(), (_) => \_.modify(self, f))
  )

/\*\*

- @since 4.0.0
- @category Conversions
  \*/
  export const set: {
  <W>(value: W): <R>(self: Writable<R, W>) => Effect.Effect<void, never, AtomRegistry>
  <R, W>(self: Writable<R, W>, value: W): Effect.Effect<void, never, AtomRegistry>
  } = dual(
  2,
  <R, W>(self: Writable<R, W>, value: W): Effect.Effect<void, never, AtomRegistry> =>
  Effect.map(AtomRegistry.asEffect(), (_) => _.set(self, value))
  )

/\*\*

- @since 4.0.0
- @category Conversions
  \*/
  export const update: {
  <R, W>(f: (_: R) => W): (self: Writable<R, W>) => Effect.Effect<void, never, AtomRegistry>
  <R, W>(self: Writable<R, W>, f: (_: R) => W): Effect.Effect<void, never, AtomRegistry>
  } = dual(
  2,
  <R, W>(self: Writable<R, W>, f: (_: R) => W): Effect.Effect<void, never, AtomRegistry> =>
  Effect.map(AtomRegistry.asEffect(), (_) => \_.update(self, f))
  )

/\*\*

- @since 4.0.0
- @category Conversions
  \*/
  export const getResult = <A, E>(
  self: Atom<AsyncResult.AsyncResult<A, E>>,
  options?: { readonly suspendOnWaiting?: boolean | undefined }
  ): Effect.Effect<A, E, AtomRegistry> => AtomRegistry.use(Registry.getResult(self, options))

/\*\*

- @since 4.0.0
- @category Conversions
  \*/
  export const refresh = <A>(self: Atom<A>): Effect.Effect<void, never, AtomRegistry> =>
  Effect.map(AtomRegistry.asEffect(), (_) => _.refresh(self))

/\*\*

- @since 4.0.0
- @category Conversions
  \*/
  export const mount = <A>(self: Atom<A>): Effect.Effect<void, never, AtomRegistry | Scope.Scope> =>
  AtomRegistry.use((r) => Registry.mount(r, self))

// -----------------------------------------------------------------------------
// Serializable
// -----------------------------------------------------------------------------

/\*\*

- @since 4.0.0
- @category Serializable
  \*/
  export const SerializableTypeId: SerializableTypeId = "~effect-atom/atom/Atom/Serializable"

/\*\*

- @since 4.0.0
- @category Serializable
  \*/
  export type SerializableTypeId = "~effect-atom/atom/Atom/Serializable"

/\*\*

- @since 4.0.0
- @category Serializable
  \*/
  export interface Serializable<S extends Schema.Top> {
  readonly [SerializableTypeId]: {
  readonly key: string
  readonly encode: (value: S["Type"]) => S["Encoded"]
  readonly decode: (value: S["Encoded"]) => S["Type"]
  }
  }

/\*\*

- @since 4.0.0
- @category Serializable
  \*/
  export const isSerializable = (self: Atom<any>): self is Atom<any> & Serializable<any> => SerializableTypeId in self

/\*\*

- @since 4.0.0
- @category combinators
  \*/
  export const serializable: {
  <R extends Atom<any>, S extends Schema.Codec<Type<R>, any>>(options: {
  readonly key: string
  readonly schema: S
  }): (self: R) => R & Serializable<S>
  <R extends Atom<any>, S extends Schema.Codec<Type<R>, any>>(self: R, options: {
  readonly key: string
  readonly schema: S
  }): R & Serializable<S>
  } = dual(2, <R extends Atom<any>, A, I>(self: R, options: {
  readonly key: string
  readonly schema: Schema.Codec<A, I>
  }): R & Serializable<any> => {
  const codecJson = Schema.toCodecJson(options.schema)
  return Object.assign(Object.create(Object.getPrototypeOf(self)), {
  ...self,
  label: self.label ?? [options.key, new Error().stack?.split("\n")[5] ?? ""],
  [SerializableTypeId]: {
  key: options.key,
  encode: Schema.encodeSync(codecJson),
  decode: Schema.decodeSync(codecJson)
  }
  })
  })

/\*\*

- @since 4.0.0
- @category ServerValue
  \*/
  export const ServerValueTypeId = "~effect-atom/atom/Atom/ServerValue" as const

/\*\*

- Overrides the value of an Atom when read on the server.
-
- @since 4.0.0
- @category ServerValue
  \*/
  export const withServerValue: {
  <A extends Atom<any>>(read: (get: <A>(atom: Atom<A>) => A) => Type<A>): (self: A) => A
  <A extends Atom<any>>(self: A, read: (get: <A>(atom: Atom<A>) => A) => Type<A>): A
  } = dual(
  2,
  <A extends Atom<any>>(self: A, read: (get: <A>(atom: Atom<A>) => A) => Type<A>): A =>
  Object.assign(Object.create(Object.getPrototypeOf(self)), {
  ...self,
  [ServerValueTypeId]: read
  })
  )

/\*\*

- Sets the Atom's server value to `Result.initial(true)`.
-
- @since 4.0.0
- @category ServerValue
  \*/
  export const withServerValueInitial = <A extends Atom<AsyncResult.AsyncResult<any, any>>>(self: A): A =>
  withServerValue(self, constant(AsyncResult.initial(true)) as any)

/\*\*

- @since 4.0.0
- @category ServerValue
  \*/
  export const getServerValue: {
  (registry: Registry.AtomRegistry): <A>(self: Atom<A>) => A
  <A>(self: Atom<A>, registry: Registry.AtomRegistry): A
  } = dual(
  2,
  <A>(self: Atom<A>, registry: Registry.AtomRegistry): A =>
  ServerValueTypeId in self
  ? (self as any)[ServerValueTypeId]((atom: Atom<any>) => registry.get(atom))
  : registry.get(self)
  )

/\*\*

- @since 4.0.0
  _/
  import _ as Duration from "../../Duration.ts"
  import _ as Effect from "../../Effect.ts"
  import _ as Layer from "../../Layer.ts"
  import type { ReadonlyRecord } from "../../Record.ts"
  import type { SchemaError } from "../../Schema.ts"
  import _ as ServiceMap from "../../ServiceMap.ts"
  import type { Mutable, Simplify } from "../../Types.ts"
  import type _ as HttpClient from "../http/HttpClient.ts"
  import type _ as HttpClientError from "../http/HttpClientError.ts"
  import type { HttpClientResponse } from "../http/HttpClientResponse.ts"
  import type _ as HttpApi from "../httpapi/HttpApi.ts"
  import _ as HttpApiClient from "../httpapi/HttpApiClient.ts"
  import type _ as HttpApiEndpoint from "../httpapi/HttpApiEndpoint.ts"
  import type _ as HttpApiGroup from "../httpapi/HttpApiGroup.ts"
  import type _ as AsyncResult from "./AsyncResult.ts"
  import _ as Atom from "./Atom.ts"
  import _ as Reactivity from "./Reactivity.ts"

/\*\*

- @since 4.0.0
- @category Models
  \*/
  export interface AtomHttpApiClient<Self, Id extends string, Groups extends HttpApiGroup.Any>
  extends ServiceMap.Service<Self, HttpApiClient.Client<Groups, never, never>>
  {
  new(\_: never): ServiceMap.ServiceClass.Shape<Id, HttpApiClient.Client<Groups, never, never>>

readonly layer: Layer.Layer<Self>
readonly runtime: Atom.AtomRuntime<Self>

readonly mutation: <
GroupName extends HttpApiGroup.Name<Groups>,
Name extends HttpApiEndpoint.Name<HttpApiGroup.Endpoints<Group>>,
Group extends HttpApiGroup.Any = HttpApiGroup.WithName<Groups, GroupName>,
Endpoint extends HttpApiEndpoint.Any = HttpApiEndpoint.WithName<
HttpApiGroup.Endpoints<Group>,
Name >,
const WithResponse extends boolean = false

> (

    group: GroupName,
    endpoint: Name,
    options?: {
      readonly withResponse?: WithResponse | undefined
    }

) => [Endpoint] extends [
HttpApiEndpoint.HttpApiEndpoint<
infer \_Name,
infer \_Method,
infer \_Path,
infer \_Params,
infer \_Query,
infer \_Payload,
infer \_Headers,
infer \_Success,
infer \_Error,
infer \_R,
infer \_RE

> ] ? Atom.AtomResultFn<
> Simplify<
> HttpApiEndpoint.ClientRequest<\_Params, \_Query, \_Payload, \_Headers, false> & {
> readonly reactivityKeys?: ReadonlyArray<unknown> | ReadonlyRecord<string, ReadonlyArray<unknown>> | undefined
> } >,
> WithResponse extends true ? [\_Success["Type"], HttpClientResponse] : \_Success["Type"],
> \_Error | HttpClientError.HttpClientError | SchemaError >
> : never

readonly query: <
GroupName extends HttpApiGroup.Name<Groups>,
Name extends HttpApiEndpoint.Name<HttpApiGroup.Endpoints<Group>>,
Group extends HttpApiGroup.Any = HttpApiGroup.WithName<Groups, GroupName>,
Endpoint extends HttpApiEndpoint.Any = HttpApiEndpoint.WithName<
HttpApiGroup.Endpoints<Group>,
Name >,
const WithResponse extends boolean = false

> (

    group: GroupName,
    endpoint: Name,
    request: [Endpoint] extends [
      HttpApiEndpoint.HttpApiEndpoint<
        infer _Name,
        infer _Method,
        infer _Path,
        infer _Params,
        infer _Query,
        infer _Payload,
        infer _Headers,
        infer _Success,
        infer _Error,
        infer _R,
        infer _RE
      >
    ] ? Simplify<
        HttpApiEndpoint.ClientRequest<_Params, _Query, _Payload, _Headers, WithResponse> & {
          readonly reactivityKeys?:
            | ReadonlyArray<unknown>
            | ReadonlyRecord<string, ReadonlyArray<unknown>>
            | undefined
          readonly timeToLive?: Duration.Input | undefined
        }
      >
      : never

) => [Endpoint] extends [
HttpApiEndpoint.HttpApiEndpoint<
infer \_Name,
infer \_Method,
infer \_Path,
infer \_Params,
infer \_Query,
infer \_Payload,
infer \_Headers,
infer \_Success,
infer \_Error,
infer \_R,
infer \_RE

> ] ? Atom.Atom<
> AsyncResult.AsyncResult<
> WithResponse extends true ? [\_Success["Type"], HttpClientResponse] : \_Success["Type"],
> \_Error | HttpClientError.HttpClientError | SchemaError > >
> : never
> }

declare global {
interface ErrorConstructor {
stackTraceLimit: number
}
}

/\*\*

- @since 4.0.0
- @category Constructors
  \*/
  export const Service = <Self>() =>
  <const Id extends string, ApiId extends string, Groups extends HttpApiGroup.Any>(
  id: Id,
  options: {
  readonly api: HttpApi.HttpApi<ApiId, Groups>
  readonly httpClient: Layer.Layer<
  | HttpApiGroup.ClientServices<Groups>
  | HttpClient.HttpClient >
  readonly transformClient?: ((client: HttpClient.HttpClient) => HttpClient.HttpClient) | undefined
  readonly transformResponse?:
  | ((effect: Effect.Effect<unknown, unknown, unknown>) => Effect.Effect<unknown, unknown, unknown>)
  | undefined
  readonly baseUrl?: URL | string | undefined
  readonly runtime?: Atom.RuntimeFactory | undefined
  }
  ): AtomHttpApiClient<Self, Id, Groups> => {
  const self: Mutable<AtomHttpApiClient<Self, Id, Groups>> = ServiceMap.Service<
  Self,
  HttpApiClient.Client<Groups, never, never>
  > ()(id) as any

self.layer = Layer.effect(
self,
HttpApiClient.make(options.api, options)
).pipe(Layer.provide(options.httpClient)) as Layer.Layer<Self>
const runtimeFactory = options.runtime ?? Atom.runtime
self.runtime = runtimeFactory(self.layer)

const mutationFamily = Atom.family(({ endpoint, group, withResponse }: MutationKey) =>
self.runtime.fn<{
params: any
query: any
headers: any
payload: any
reactivityKeys?: ReadonlyArray<unknown> | ReadonlyRecord<string, ReadonlyArray<unknown>> | undefined
}>()(
Effect.fnUntraced(function*(opts) {
const client = (yield* self) as any
const effect = client[group][endpoint]({
...opts,
withResponse
}) as Effect.Effect<any>
return yield\* opts.reactivityKeys
? Reactivity.mutation(effect, opts.reactivityKeys)
: effect
})
)
) as any

self.mutation = ((group: string, endpoint: string, options?: {
readonly withResponse?: boolean | undefined
}) =>
mutationFamily({
group,
endpoint,
withResponse: options?.withResponse ?? false
})) as any

const queryFamily = Atom.family((opts: QueryKey) => {
let atom = self.runtime.atom(self.use((client*) => {
const client = client* as any
return client[opts.group][opts.endpoint](opts) as Effect.Effect<any>
}))
if (opts.timeToLive) {
atom = Duration.isFinite(opts.timeToLive)
? Atom.setIdleTTL(atom, opts.timeToLive)
: Atom.keepAlive(atom)
}
return opts.reactivityKeys
? self.runtime.factory.withReactivity(opts.reactivityKeys)(atom)
: atom
})

self.query = ((
group: string,
endpoint: string,
request: {
readonly params?: any
readonly query?: any
readonly payload?: any
readonly headers?: any
readonly withResponse?: boolean
readonly reactivityKeys?: ReadonlyArray<unknown> | ReadonlyRecord<string, ReadonlyArray<unknown>> | undefined
readonly timeToLive?: Duration.Input | undefined
}
) =>
queryFamily({
group,
endpoint,
params: request.params,
query: request.query,
payload: request.payload,
headers: request.headers,
withResponse: request.withResponse ?? false,
reactivityKeys: request.reactivityKeys,
timeToLive: request.timeToLive
? Duration.fromInputUnsafe(request.timeToLive)
: undefined
})) as any

return self as AtomHttpApiClient<Self, Id, Groups>
}

interface MutationKey {
group: string
endpoint: string
withResponse: boolean
}

interface QueryKey {
group: string
endpoint: string
params: any
query: any
headers: any
payload: any
withResponse: boolean
reactivityKeys?: ReadonlyArray<unknown> | ReadonlyRecord<string, ReadonlyArray<unknown>> | undefined
timeToLive?: Duration.Duration | undefined
}

/\*\*

- @since 4.0.0
  _/
  import _ as Equal from "../../Equal.ts"
  import \* as Hash from "../../Hash.ts"

/\*\*

- @since 4.0.0
- @category type ids
  \*/
  export type TypeId = "~effect/reactivity/AtomRef"

/\*\*

- @since 4.0.0
- @category type ids
  \*/
  export const TypeId: TypeId = "~effect/reactivity/AtomRef"

/\*\*

- @since 4.0.0
- @category models
  \*/
  export interface ReadonlyRef<A> extends Equal.Equal {
  readonly [TypeId]: TypeId
  readonly key: string
  readonly value: A
  readonly subscribe: (f: (a: A) => void) => () => void
  readonly map: <B>(f: (a: A) => B) => ReadonlyRef<B>
  }

/\*\*

- @since 4.0.0
- @category models
  \*/
  export interface AtomRef<A> extends ReadonlyRef<A> {
  readonly prop: <K extends keyof A>(prop: K) => AtomRef<A[K]>
  readonly set: (value: A) => AtomRef<A>
  readonly update: (f: (value: A) => A) => AtomRef<A>
  }

/\*\*

- @since 4.0.0
- @category models
  \*/
  export interface Collection<A> extends ReadonlyRef<ReadonlyArray<AtomRef<A>>> {
  readonly push: (item: A) => Collection<A>
  readonly insertAt: (index: number, item: A) => Collection<A>
  readonly remove: (ref: AtomRef<A>) => Collection<A>
  readonly toArray: () => Array<A>
  }

/\*\*

- @since 4.0.0
- @category constructors
  \*/
  export const make = <A>(value: A): AtomRef<A> => new AtomRefImpl(value)

/\*\*

- @since 4.0.0
- @category constructors
  \*/
  export const collection = <A>(items: Iterable<A>): Collection<A> => new CollectionImpl(items)

const keyState = {
count: 0,
generate() {
return `AtomRef-${this.count++}`
}
}

class ReadonlyRefImpl<A> implements ReadonlyRef<A> {
readonly [TypeId]: TypeId
readonly key = keyState.generate()
public value: A
constructor(value: A) {
this[TypeId] = TypeId
this.value = value
}

[Equal.symbol](that: Equal.Equal) {
return Equal.equals(this.value, (that as ReadonlyRef<A>).value)
}

[Hash.symbol]() {
return Hash.hash(this.value)
}

listeners: Array<(a: A) => void> = []
listenerCount = 0

notify(a: A) {
for (let i = 0; i < this.listenerCount; i++) {
this.listeners[i](a)
}
}

subscribe(f: (a: A) => void): () => void {
this.listeners.push(f)
this.listenerCount++

    return () => {
      const index = this.listeners.indexOf(f)
      if (index !== -1) {
        this.listeners[index] = this.listeners[this.listenerCount - 1]
        this.listeners.pop()
        this.listenerCount--
      }
    }

}

map<B>(f: (a: A) => B): ReadonlyRef<B> {
return new MapRefImpl(this, f)
}
}

class AtomRefImpl<A> extends ReadonlyRefImpl<A> implements AtomRef<A> {
prop<K extends keyof A>(prop: K): AtomRef<A[K]> {
return new PropRefImpl(this, prop)
}
set(value: A) {
if (Equal.equals(value, this.value)) {
return this
}
this.value = value
this.notify(value)
return this
}

update(f: (value: A) => A) {
return this.set(f(this.value))
}
}

class MapRefImpl<A, B> implements ReadonlyRef<B> {
readonly [TypeId]: TypeId
readonly key = keyState.generate()
readonly parent: ReadonlyRef<A>
readonly transform: (a: A) => B
constructor(parent: ReadonlyRef<A>, transform: (a: A) => B) {
this[TypeId] = TypeId
this.parent = parent
this.transform = transform
}
[Equal.symbol](that: Equal.Equal) {
return Equal.equals(this.value, (that as ReadonlyRef<B>).value)
}
[Hash.symbol]() {
return Hash.hash(this.value)
}
get value() {
return this.transform(this.parent.value)
}
subscribe(f: (a: B) => void): () => void {
let previous = this.transform(this.parent.value)
return this.parent.subscribe((a) => {
const next = this.transform(a)
if (Equal.equals(next, previous)) {
return
}
previous = next
f(next)
})
}
map<C>(f: (a: B) => C): ReadonlyRef<C> {
return new MapRefImpl(this, f)
}
}

class PropRefImpl<A, K extends keyof A> implements AtomRef<A[K]> {
readonly [TypeId]: TypeId
readonly key = keyState.generate()
private previous: A[K]
readonly parent: AtomRef<A>
readonly \_prop: K

constructor(parent: AtomRef<A>, \_prop: K) {
this[TypeId] = TypeId
this.parent = parent
this.\_prop = \_prop
this.previous = parent.value[_prop]
}
[Equal.symbol](that: Equal.Equal) {
return Equal.equals(this.value, (that as ReadonlyRef<A>).value)
}
[Hash.symbol]() {
return Hash.hash(this.value)
}
get value() {
if (this.parent.value && this.\_prop in (this.parent.value as any)) {
this.previous = this.parent.value[this._prop]
}
return this.previous
}
subscribe(f: (a: A[K]) => void): () => void {
let previous = this.value
return this.parent.subscribe((a) => {
if (!a || !(this.\_prop in (a as any))) {
return
}
const next = a[this._prop]
if (Equal.equals(next, previous)) {
return
}
previous = next
f(next)
})
}
map<C>(f: (a: A[K]) => C): ReadonlyRef<C> {
return new MapRefImpl(this, f)
}
prop<CK extends keyof A[K]>(prop: CK): AtomRef<A[K][CK]> {
return new PropRefImpl(this, prop)
}
set(value: A[K]): AtomRef<A[K]> {
if (Array.isArray(this.parent.value)) {
const newArray = this.parent.value.slice()
newArray[this._prop as number] = value
this.parent.set(newArray as A)
} else {
this.parent.set({
...this.parent.value,
[this._prop]: value
})
}
return this
}
update(f: (value: A[K]) => A[K]): AtomRef<A[K]> {
if (Array.isArray(this.parent.value)) {
const newArray = this.parent.value.slice()
newArray[this._prop as number] = f(this.parent.value[this._prop])
this.parent.set(newArray as A)
} else {
this.parent.set({
...this.parent.value,
[this._prop]: f(this.parent.value[this._prop])
})
}
return this
}
}

class CollectionImpl<A> extends ReadonlyRefImpl<Array<AtomRef<A>>> implements Collection<A> {
constructor(items: Iterable<A>) {
super([])
for (const item of items) {
this.value.push(this.makeRef(item))
}
}

makeRef(value: A) {
const ref = new AtomRefImpl(value)
const notify = (value: A) => {
ref.notify(value)
this.notify(this.value)
}
return new Proxy(ref, {
get(target, p, \_receiver) {
if (p === "notify") {
return notify
}
return target[p as keyof AtomRef<A>]
}
})
}

push(item: A) {
const ref = this.makeRef(item)
this.value.push(ref)
this.notify(this.value)
return this
}

insertAt(index: number, item: A) {
const ref = this.makeRef(item)
this.value.splice(index, 0, ref)
this.notify(this.value)
return this
}

remove(ref: AtomRef<A>) {
const index = this.value.indexOf(ref)
if (index !== -1) {
this.value.splice(index, 1)
this.notify(this.value)
}
return this
}

toArray() {
return this.value.map((ref) => ref.value)
}
}

/\*\*

- @since 4.0.0
  _/
  import _ as Effect from "../../Effect.ts"
  import _ as Exit from "../../Exit.ts"
  import _ as Fiber from "../../Fiber.ts"
  import { constVoid, dual } from "../../Function.ts"
  import _ as Layer from "../../Layer.ts"
  import _ as Option from "../../Option.ts"
  import { hasProperty } from "../../Predicate.ts"
  import _ as Queue from "../../Queue.ts"
  import type { Scheduler } from "../../Scheduler.ts"
  import { MixedScheduler } from "../../Scheduler.ts"
  import _ as Scope from "../../Scope.ts"
  import _ as ServiceMap from "../../ServiceMap.ts"
  import _ as Stream from "../../Stream.ts"
  import _ as Result from "./AsyncResult.ts"
  import type _ as Atom from "./Atom.ts"

/\*\*

- @since 4.0.0
- @category type ids
  \*/
  export type TypeId = "~effect/reactivity/AtomRegistry"

/\*\*

- @since 4.0.0
- @category type ids
  \*/
  export const TypeId: TypeId = "~effect/reactivity/AtomRegistry"

/\*\*

- @since 4.0.0
- @category guards
  \*/
  export const isAtomRegistry = (u: unknown): u is AtomRegistry => hasProperty(u, TypeId)

/\*\*

- @since 4.0.0
- @category models
  \*/
  export interface AtomRegistry {
  readonly [TypeId]: TypeId
  readonly scheduler: Scheduler
  readonly schedulerAsync: Scheduler
  readonly getNodes: () => ReadonlyMap<Atom.Atom<any> | string, Node<any>>
  readonly get: <A>(atom: Atom.Atom<A>) => A
  readonly mount: <A>(atom: Atom.Atom<A>) => () => void
  readonly refresh: <A>(atom: Atom.Atom<A>) => void
  readonly set: <R, W>(atom: Atom.Writable<R, W>, value: W) => void
  readonly setSerializable: (key: string, encoded: unknown) => void
  readonly modify: <R, W, A>(atom: Atom.Writable<R, W>, f: (_: R) => [returnValue: A, nextValue: W]) => A
  readonly update: <R, W>(atom: Atom.Writable<R, W>, f: (_: R) => W) => void
  readonly subscribe: <A>(atom: Atom.Atom<A>, f: (\_: A) => void, options?: {
  readonly immediate?: boolean
  }) => () => void
  readonly reset: () => void
  readonly dispose: () => void
  onNodeAdded?: ((node: Node<any>) => void) | undefined
  onNodeRemoved?: ((node: Node<any>) => void) | undefined
  }

/\*\*

- @since 4.0.0
- @category models
  \*/
  export interface Node<A> {
  readonly atom: Atom.Atom<A>
  readonly value: () => A
  parents: Array<Node<any>>
  children: Array<Node<any>>
  listeners: Set<() => void>
  currentState(): "uninitialized" | "stale" | "valid" | "removed"
  }

/\*\*

- @since 4.0.0
- @category constructors
  \*/
  export const make = (
  options?: {
  readonly initialValues?: Iterable<readonly [Atom.Atom<any>, any]> | undefined
  readonly scheduleTask?: ((f: () => void) => () => void) | undefined
  readonly timeoutResolution?: number | undefined
  readonly defaultIdleTTL?: number | undefined
  } | undefined
  ): AtomRegistry =>
  new RegistryImpl(
  options?.initialValues,
  options?.scheduleTask,
  options?.timeoutResolution,
  options?.defaultIdleTTL
  )

/\*\*

- @since 4.0.0
- @category Tags
  \*/
  export const AtomRegistry = ServiceMap.Service<AtomRegistry>(TypeId)

/\*\*

- @since 4.0.0
- @category Layers
  _/
  export const layerOptions = (options?: {
  readonly initialValues?: Iterable<readonly [Atom.Atom<any>, any]> | undefined
  readonly scheduleTask?: ((f: () => void) => () => void) | undefined
  readonly timeoutResolution?: number | undefined
  readonly defaultIdleTTL?: number | undefined
  }): Layer.Layer<AtomRegistry> =>
  Layer.effect(
  AtomRegistry,
  Effect.gen(function_() {
  const scope = yield* Effect.scope
  const registry = make({
  ...options,
  scheduleTask: options?.scheduleTask
  })
  yield* Scope.addFinalizer(scope, Effect.sync(() => registry.dispose()))
  return registry
  })
  )

/\*\*

- @since 4.0.0
- @category Layers
  \*/
  export const layer: Layer.Layer<AtomRegistry> = layerOptions()

// -----------------------------------------------------------------------------
// conversions
// -----------------------------------------------------------------------------

/\*\*

- @since 4.0.0
- @category Conversions
  \*/
  export const toStream: {
  <A>(atom: Atom.Atom<A>): (self: AtomRegistry) => Stream.Stream<A>
  <A>(self: AtomRegistry, atom: Atom.Atom<A>): Stream.Stream<A>
  } = dual(
  2,
  <A>(self: AtomRegistry, atom: Atom.Atom<A>) =>
  Stream.callback<A>((queue) =>
  Effect.suspend(() => {
  const fiber = Fiber.getCurrent()!
  const scope = ServiceMap.getUnsafe(fiber.services, Scope.Scope)
  const cancel = self.subscribe(atom, (value) => Queue.offerUnsafe(queue, value), {
  immediate: true
  })
  return Scope.addFinalizer(scope, Effect.sync(cancel))
  })
  )
  )

/\*\*

- @since 4.0.0
- @category Conversions
  \*/
  export const toStreamResult: {
  <A, E>(atom: Atom.Atom<Result.AsyncResult<A, E>>): (self: AtomRegistry) => Stream.Stream<A, E>
  <A, E>(self: AtomRegistry, atom: Atom.Atom<Result.AsyncResult<A, E>>): Stream.Stream<A, E>
  } = dual(
  2,
  <A, E>(self: AtomRegistry, atom: Atom.Atom<Result.AsyncResult<A, E>>): Stream.Stream<A, E> =>
  toStream(self, atom).pipe(
  Stream.filter(Result.isNotInitial),
  Stream.mapEffect((result) =>
  result.\_tag === "Success" ? Effect.succeed(result.value) : Effect.failCause(result.cause)
  ),
  Stream.changes
  )
  )

/\*\*

- @since 4.0.0
- @category Conversions
  \*/
  export const getResult: {
  <A, E>(atom: Atom.Atom<Result.AsyncResult<A, E>>, options?: {
  readonly suspendOnWaiting?: boolean | undefined
  }): (self: AtomRegistry) => Effect.Effect<A, E>
  <A, E>(self: AtomRegistry, atom: Atom.Atom<Result.AsyncResult<A, E>>, options?: {
  readonly suspendOnWaiting?: boolean | undefined
  }): Effect.Effect<A, E>
  } = dual(
  (args) => isAtomRegistry(args[0]),
  <A, E>(self: AtomRegistry, atom: Atom.Atom<Result.AsyncResult<A, E>>, options?: {
  readonly suspendOnWaiting?: boolean | undefined
  }): Effect.Effect<A, E> => {
  const suspendOnWaiting = options?.suspendOnWaiting ?? false
  return Effect.callback((resume) => {
  const result = self.get(atom)
  if (result.\_tag !== "Initial" && !(suspendOnWaiting && result.waiting)) {
  return resume(Result.toExit(result) as any)
  }
  const cancel = self.subscribe(atom, (value) => {
  if (value.\_tag !== "Initial" && !(suspendOnWaiting && value.waiting)) {
  resume(Result.toExit(value) as any)
  cancel()
  }
  })
  return Effect.sync(cancel)
  })
  }
  )

/\*\*

- @since 4.0.0
- @category Conversions
  \*/
  export const mount: {
  <A>(atom: Atom.Atom<A>): (self: AtomRegistry) => Effect.Effect<void, never, Scope.Scope>
  <A>(self: AtomRegistry, atom: Atom.Atom<A>): Effect.Effect<void, never, Scope.Scope>
  } = dual(
  2,
  <A>(self: AtomRegistry, atom: Atom.Atom<A>) =>
  Effect.acquireRelease(
  Effect.sync(() => self.mount(atom)),
  (release) => Effect.sync(release)
  )
  )

// -----------------------------------------------------------------------------
// internal
// -----------------------------------------------------------------------------

const constImmediate = { immediate: true }

const notifyListener = (listener: () => void): void => {
listener()
}

const SerializableTypeId: Atom.SerializableTypeId = "~effect-atom/atom/Atom/Serializable"
const atomKey = <A>(atom: Atom.Atom<A>): Atom.Atom<A> | string =>
SerializableTypeId in atom ? (atom as Atom.Serializable<any>)[SerializableTypeId].key : atom

class RegistryImpl implements AtomRegistry {
readonly [TypeId]: TypeId
readonly timeoutResolution: number
readonly defaultIdleTTL: number | undefined
readonly scheduler: Scheduler
readonly schedulerAsync: Scheduler
onNodeAdded?: ((node: Node<any>) => void) | undefined
onNodeRemoved?: ((node: Node<any>) => void) | undefined

constructor(
initialValues?: Iterable<readonly [Atom.Atom<any>, any]>,
scheduleTask?: (cb: () => void) => () => void,
timeoutResolution?: number,
defaultIdleTTL?: number
) {
this[TypeId] = TypeId
this.scheduler = new MixedScheduler("sync", scheduleTask)
this.schedulerAsync = new MixedScheduler("async", scheduleTask)
this.defaultIdleTTL = defaultIdleTTL

    if (timeoutResolution === undefined && defaultIdleTTL !== undefined) {
      this.timeoutResolution = Math.round(defaultIdleTTL / 2)
    } else {
      this.timeoutResolution = timeoutResolution ?? 1000
    }
    if (initialValues !== undefined) {
      for (const [atom, value] of initialValues) {
        this.ensureNode(atom).setValue(value)
      }
    }

}

readonly nodes = new Map<Atom.Atom<any> | string, NodeImpl<any>>()
readonly preloadedSerializable = new Map<string, unknown>()
readonly timeoutBuckets = new Map<number, readonly [nodes: Set<NodeImpl<any>>, handle: number]>()
readonly nodeTimeoutBucket = new Map<NodeImpl<any>, number>()
disposed = false

getNodes() {
return this.nodes
}

get<A>(atom: Atom.Atom<A>): A {
return this.ensureNode(atom).value()
}

set<R, W>(atom: Atom.Writable<R, W>, value: W): void {
atom.write(this.ensureNode(atom).writeContext, value)
}

setSerializable(key: string, encoded: unknown): void {
this.preloadedSerializable.set(key, encoded)
}

modify<R, W, A>(atom: Atom.Writable<R, W>, f: (\_: R) => [returnValue: A, nextValue: W]): A {
const node = this.ensureNode(atom)
const result = f(node.value())
atom.write(node.writeContext, result[1])
return result[0]
}

update<R, W>(atom: Atom.Writable<R, W>, f: (\_: R) => W): void {
const node = this.ensureNode(atom)
atom.write(node.writeContext, f(node.value()))
}

refresh = <A>(atom: Atom.Atom<A>): void => {
if (atom.refresh !== undefined) {
atom.refresh(this.refresh)
} else {
this.invalidateAtom(atom)
}
}

subscribe<A>(atom: Atom.Atom<A>, f: (\_: A) => void, options?: { readonly immediate?: boolean }): () => void {
const node = this.ensureNode(atom)
if (options?.immediate) {
f(node.value())
}
const remove = node.subscribe(function() {
f(node.\_value)
})
return () => {
remove()
if (node.canBeRemoved) {
this.scheduleNodeRemoval(node)
}
}
}

mount<A>(atom: Atom.Atom<A>) {
return this.subscribe(atom, constVoid, constImmediate)
}

atomHasTtl(atom: Atom.Atom<any>): boolean {
return !atom.keepAlive && atom.idleTTL !== 0 && (atom.idleTTL !== undefined || this.defaultIdleTTL !== undefined)
}

ensureNode<A>(atom: Atom.Atom<A>): NodeImpl<A> {
const key = atomKey(atom)
let node = this.nodes.get(key)
if (node === undefined) {
node = this.createNode(atom)
this.nodes.set(key, node)
this.onNodeAdded?.(node)
} else if (this.atomHasTtl(atom)) {
this.removeNodeTimeout(node)
}
if (typeof key === "string" && this.preloadedSerializable.has(key)) {
const encoded = this.preloadedSerializable.get(key)
this.preloadedSerializable.delete(key)
const decoded = (atom as any as Atom.Serializable<any>)[SerializableTypeId].decode(encoded)
node.setValue(decoded)
}
return node
}

createNode<A>(atom: Atom.Atom<A>): NodeImpl<A> {
if (this.disposed) {
throw new Error(`Cannot access Atom ${atom}: registry is disposed`)
}

    if (!atom.keepAlive) {
      this.scheduleAtomRemoval(atom)
    }
    return new NodeImpl(this, atom)

}

invalidateAtom = <A>(atom: Atom.Atom<A>): void => {
this.ensureNode(atom).invalidate()
}

scheduleAtomRemoval(atom: Atom.Atom<any>): void {
this.schedulerAsync.scheduleTask(() => {
const node = this.nodes.get(atomKey(atom))
if (node !== undefined && node.canBeRemoved) {
this.removeNode(node)
}
}, 0)
}

scheduleNodeRemoval(node: NodeImpl<any>): void {
this.schedulerAsync.scheduleTask(() => {
if (node.canBeRemoved) {
this.removeNode(node)
}
}, 0)
}

removeNode(node: NodeImpl<any>): void {
if (this.atomHasTtl(node.atom)) {
this.setNodeTimeout(node)
} else {
this.nodes.delete(atomKey(node.atom))
node.remove()
this.onNodeRemoved?.(node)
}
}

setNodeTimeout(node: NodeImpl<any>): void {
if (this.nodeTimeoutBucket.has(node)) {
return
}

    let idleTTL = node.atom.idleTTL ?? this.defaultIdleTTL!
    if (this.#currentSweepTTL !== null) {
      idleTTL -= this.#currentSweepTTL
      if (idleTTL <= 0) {
        this.nodes.delete(atomKey(node.atom))
        node.remove()
        this.onNodeRemoved?.(node)
        return
      }
    }
    const ttl = Math.ceil(idleTTL! / this.timeoutResolution) * this.timeoutResolution
    const timestamp = Date.now() + ttl
    const bucket = timestamp - (timestamp % this.timeoutResolution) + this.timeoutResolution

    let entry = this.timeoutBuckets.get(bucket)
    if (entry === undefined) {
      entry = [
        new Set<NodeImpl<any>>(),
        setTimeout(() => this.sweepBucket(bucket), bucket - Date.now()) as any
      ]
      this.timeoutBuckets.set(bucket, entry)
    }
    entry[0].add(node)
    this.nodeTimeoutBucket.set(node, bucket)

}

removeNodeTimeout(node: NodeImpl<any>): void {
const bucket = this.nodeTimeoutBucket.get(node)
if (bucket === undefined) return
this.nodeTimeoutBucket.delete(node)
this.scheduleNodeRemoval(node)

    const [nodes, handle] = this.timeoutBuckets.get(bucket)!
    nodes.delete(node)
    if (nodes.size === 0) {
      clearTimeout(handle)
      this.timeoutBuckets.delete(bucket)
    }

}

#currentSweepTTL: number | null = null
sweepBucket(bucket: number): void {
const nodes = this.timeoutBuckets.get(bucket)![0]
this.timeoutBuckets.delete(bucket)

    nodes.forEach((node) => {
      this.nodeTimeoutBucket.delete(node)
      if (!node.canBeRemoved) return
      this.nodes.delete(atomKey(node.atom))
      this.onNodeRemoved?.(node)
      this.#currentSweepTTL = node.atom.idleTTL ?? this.defaultIdleTTL!
      node.remove()
      this.#currentSweepTTL = null
    })

}

reset(): void {
this.timeoutBuckets.forEach(([, handle]) => clearTimeout(handle))
this.timeoutBuckets.clear()
this.nodeTimeoutBucket.clear()

    this.nodes.forEach((node) => {
      node.remove()
      this.onNodeRemoved?.(node)
    })
    this.nodes.clear()

}

dispose(): void {
this.disposed = true
this.reset()
}
}

const NodeFlags = {
alive: 1, // 1 << 0
initialized: 2, // 1 << 1,
waitingForValue: 4 // 1 << 2
} as const
type NodeFlags = typeof NodeFlags[keyof typeof NodeFlags]

const NodeState = {
uninitialized: NodeFlags.alive | NodeFlags.waitingForValue,
stale: NodeFlags.alive | NodeFlags.initialized | NodeFlags.waitingForValue,
valid: NodeFlags.alive | NodeFlags.initialized,
removed: 0
} as const
type NodeState = number

class NodeImpl<A> {
constructor(
registry: RegistryImpl,
atom: Atom.Atom<A>
) {
this.registry = registry
this.atom = atom
this.writeContext = new WriteContextImpl(registry, this)
}

readonly registry: RegistryImpl
readonly atom: Atom.Atom<A>
state: NodeState = NodeState.uninitialized
lifetime: Lifetime<A> | undefined
writeContext: WriteContextImpl<A>

parents: Array<NodeImpl<any>> = []
previousParents: Array<NodeImpl<any>> | undefined
children: Array<NodeImpl<any>> = []
listeners: Set<() => void> = new Set()
skipInvalidation = false

currentState() {
switch (this.state) {
case NodeState.uninitialized:
return "uninitialized"
case NodeState.stale:
return "stale"
case NodeState.valid:
return "valid"
default:
return "removed"
}
}

get canBeRemoved(): boolean {
return !this.atom.keepAlive && this.listeners.size === 0 && this.children.length === 0 && this.state !== 0
}

\_value: A = undefined as any
value(): A {
if ((this.state & NodeFlags.waitingForValue) !== 0) {
this.lifetime = makeLifetime(this)
const value = this.atom.read(this.lifetime)
if ((this.state & NodeFlags.waitingForValue) !== 0) {
this.setValue(value)
}

      if (this.previousParents) {
        const parents = this.previousParents
        this.previousParents = undefined
        for (let i = 0; i < parents.length; i++) {
          parents[i].removeChild(this)
          if (parents[i].canBeRemoved) {
            this.registry.scheduleNodeRemoval(parents[i])
          }
        }
      }
    }

    return this._value

}

valueOption(): Option.Option<A> {
if ((this.state & NodeFlags.initialized) === 0) {
return Option.none()
}
return Option.some(this.\_value)
}

setValue(value: A): void {
if ((this.state & NodeFlags.initialized) === 0) {
this.state = NodeState.valid
this.\_value = value

      if (batchState.phase === BatchPhase.collect) {
        batchState.notify.add(this)
      } else {
        this.notify()
      }

      return
    }

    this.state = NodeState.valid
    if (Object.is(this._value, value)) {
      return
    }

    this._value = value
    if (this.skipInvalidation) {
      this.skipInvalidation = false
    } else {
      this.invalidateChildren()
    }

    if (this.listeners.size > 0) {
      if (batchState.phase === BatchPhase.collect) {
        batchState.notify.add(this)
      } else {
        this.notify()
      }
    }

}

addParent(parent: NodeImpl<any>): void {
this.parents.push(parent)
if (this.previousParents !== undefined) {
const index = this.previousParents.indexOf(parent)
if (index !== -1) {
this.previousParents[index] = this.previousParents[this.previousParents.length - 1]
if (this.previousParents.pop() === undefined) {
this.previousParents = undefined
}
}
}

    if (parent.children.indexOf(this) === -1) {
      parent.children.push(this)
      if (parent.skipInvalidation) {
        parent.skipInvalidation = false
      }
    }

}

removeChild(child: NodeImpl<any>): void {
const index = this.children.indexOf(child)
if (index !== -1) {
this.children[index] = this.children[this.children.length - 1]
this.children.pop()
}
}

invalidate(): void {
if (this.state === NodeState.valid) {
this.state = NodeState.stale
this.disposeLifetime()
}

    if (batchState.phase === BatchPhase.collect) {
      batchState.stale.push(this)
    } else if (this.atom.lazy && this.listeners.size === 0 && !childrenAreActive(this.children)) {
      this.invalidateChildren()
      this.skipInvalidation = true
    } else {
      this.value()
    }

}

invalidateChildren(): void {
if (this.children.length === 0) {
return
}

    const children = this.children
    this.children = []
    for (let i = 0; i < children.length; i++) {
      children[i].invalidate()
    }

}

notify(): void {
this.listeners.forEach(notifyListener)

    if (batchState.phase === BatchPhase.commit) {
      batchState.notify.delete(this)
    }

}

disposeLifetime(): void {
if (this.lifetime !== undefined) {
this.lifetime.dispose()
this.lifetime = undefined
}

    if (this.parents.length !== 0) {
      this.previousParents = this.parents
      this.parents = []
    }

}

remove() {
this.state = NodeState.removed
this.listeners.clear()

    if (this.lifetime === undefined) {
      return
    }

    this.disposeLifetime()

    if (this.previousParents === undefined) {
      return
    }

    const parents = this.previousParents
    this.previousParents = undefined
    for (let i = 0; i < parents.length; i++) {
      parents[i].removeChild(this)
      if (parents[i].canBeRemoved) {
        this.registry.removeNode(parents[i])
      }
    }

}

subscribe(listener: () => void): () => void {
this.listeners.add(listener)
return () => this.listeners.delete(listener)
}
}

function childrenAreActive(children: Array<NodeImpl<any>>): boolean {
if (children.length === 0) {
return false
}
let current: Array<NodeImpl<any>> | undefined = children
let stack: Array<Array<NodeImpl<any>>> | undefined
let stackIndex = 0
while (current !== undefined) {
for (let i = 0, len = current.length; i < len; i++) {
const child = current[i]
if (!child.atom.lazy || child.listeners.size > 0) {
return true
} else if (child.children.length > 0) {
if (stack === undefined) {
stack = [child.children]
} else {
stack.push(child.children)
}
}
}
current = stack?.[stackIndex++]
}
return false
}

interface Lifetime<A> extends Atom.Context {
isFn: boolean
readonly node: NodeImpl<A>
finalizers: Array<() => void> | undefined
disposed: boolean
readonly dispose: () => void
}

const LifetimeProto: Omit<Lifetime<any>, "node" | "finalizers" | "disposed" | "isFn"> = {
get registry(): RegistryImpl {
return (this as Lifetime<any>).node.registry
},

addFinalizer(this: Lifetime<any>, f: () => void): void {
if (this.disposed) return f()
this.finalizers ??= []
this.finalizers.push(f)
},

get<A>(this: Lifetime<any>, atom: Atom.Atom<A>): A {
if (this.disposed) {
return this.node.registry.get(atom)
}
const parent = this.node.registry.ensureNode(atom)
this.node.addParent(parent)
return parent.value()
},

result<A, E>(this: Lifetime<any>, atom: Atom.Atom<Result.AsyncResult<A, E>>, options?: {
readonly suspendOnWaiting?: boolean | undefined
}): Effect.Effect<A, E> {
if (this.disposed || this.isFn) {
return this.resultOnce(atom, options)
}
const result = this.get(atom)
if (options?.suspendOnWaiting && result.waiting) {
return Effect.never
}
switch (result.\_tag) {
case "Initial": {
return Effect.never
}
case "Failure": {
return Exit.failCause(result.cause)
}
case "Success": {
return Effect.succeed(result.value)
}
}
},

resultOnce<A, E>(this: Lifetime<any>, atom: Atom.Atom<Result.AsyncResult<A, E>>, options?: {
readonly suspendOnWaiting?: boolean | undefined
}): Effect.Effect<A, E> {
return Effect.callback<A, E>((resume) => {
const result = this.once(atom)
if (result.\_tag !== "Initial" && !(options?.suspendOnWaiting && result.waiting)) {
return resume(Result.toExit(result) as any)
}
const cancel = this.node.registry.subscribe(atom, (result) => {
if (result.\_tag === "Initial" || (options?.suspendOnWaiting && result.waiting)) return
cancel()
resume(Result.toExit(result) as any)
}, { immediate: false })
return Effect.sync(cancel)
})
},

setResult<A, E, W>(
this: Lifetime<any>,
atom: Atom.Writable<Result.AsyncResult<A, E>, W>,
value: W
): Effect.Effect<A, E> {
if (this.disposed) return Effect.never
this.node.registry.set(atom, value)
return this.resultOnce(atom, { suspendOnWaiting: true })
},

some<A>(this: Lifetime<any>, atom: Atom.Atom<Option.Option<A>>): Effect.Effect<A> {
if (this.disposed || this.isFn) {
return this.someOnce(atom)
}
const result = this.get(atom)
return result.\_tag === "None" ? Effect.never : Effect.succeed(result.value)
},

someOnce<A>(this: Lifetime<any>, atom: Atom.Atom<Option.Option<A>>): Effect.Effect<A> {
return Effect.callback<A>((resume) => {
const result = this.once(atom)
if (Option.isSome(result)) {
return resume(Effect.succeed(result.value))
}
const cancel = this.node.registry.subscribe(atom, (result) => {
if (Option.isNone(result)) return
cancel()
resume(Effect.succeed(result.value))
}, { immediate: false })
return Effect.sync(cancel)
})
},

once<A>(this: Lifetime<any>, atom: Atom.Atom<A>): A {
return this.node.registry.get(atom)
},

self<A>(this: Lifetime<any>): Option.Option<A> {
if (this.disposed) return Option.none()
return this.node.valueOption() as any
},

refresh<A>(this: Lifetime<any>, atom: Atom.Atom<A>): void {
if (this.disposed) return
this.node.registry.refresh(atom)
},

refreshSelf(this: Lifetime<any>): void {
if (this.disposed) return
this.node.invalidate()
},

mount<A>(this: Lifetime<any>, atom: Atom.Atom<A>): void {
if (this.disposed) return
this.addFinalizer(this.node.registry.mount(atom))
},

subscribe<A>(this: Lifetime<any>, atom: Atom.Atom<A>, f: (\_: A) => void, options?: {
readonly immediate?: boolean
}): void {
if (this.disposed) return
this.addFinalizer(this.node.registry.subscribe(atom, f, options))
},

setSelf<A>(this: Lifetime<any>, a: A): void {
if (this.disposed) return
this.node.setValue(a as any)
},

set<R, W>(this: Lifetime<any>, atom: Atom.Writable<R, W>, value: W): void {
if (this.disposed) return
this.node.registry.set(atom, value)
},

stream<A>(this: Lifetime<any>, atom: Atom.Atom<A>, options?: {
readonly withoutInitialValue?: boolean
}) {
if (this.disposed) return Stream.empty
return Stream.callback<A>((queue) =>
Effect.sync(() => {
this.subscribe(atom, (value) => Queue.offerUnsafe(queue, value), {
immediate: !options?.withoutInitialValue
})
})
)
},

streamResult<A, E>(this: Lifetime<any>, atom: Atom.Atom<Result.AsyncResult<A, E>>, options?: {
readonly withoutInitialValue?: boolean
readonly bufferSize?: number
}): Stream.Stream<A, E> {
return this.stream(atom, options).pipe(
Stream.filter(Result.isNotInitial),
Stream.mapEffect((result) =>
result.\_tag === "Success" ? Effect.succeed(result.value) : Effect.failCause(result.cause)
)
)
},

dispose(this: Lifetime<any>): void {
this.disposed = true
if (this.finalizers === undefined) {
return
}

    const finalizers = this.finalizers
    this.finalizers = undefined
    for (let i = finalizers.length - 1; i >= 0; i--) {
      finalizers[i]()
    }

}
}

const makeLifetime = <A>(node: NodeImpl<A>): Lifetime<A> => {
function get<A>(atom: Atom.Atom<A>): A {
if (get.disposed) {
return node.registry.get(atom)
} else if (get.isFn) {
return node.registry.get(atom)
}
const parent = node.registry.ensureNode(atom)
const value = parent.value()
node.addParent(parent)
return value
}
Object.setPrototypeOf(get, LifetimeProto)
get.isFn = false
get.disposed = false
get.finalizers = undefined
get.node = node
return get as any
}

class WriteContextImpl<A> implements Atom.WriteContext<A> {
constructor(
registry: RegistryImpl,
node: NodeImpl<A>
) {
this.registry = registry
this.node = node
}
readonly registry: RegistryImpl
readonly node: NodeImpl<A>
get<A>(atom: Atom.Atom<A>): A {
return this.registry.get(atom)
}
set<R, W>(atom: Atom.Writable<R, W>, value: W) {
return this.registry.set(atom, value)
}
setSelf(value: any) {
return this.node.setValue(value)
}
refreshSelf() {
return this.node.invalidate()
}
}

// -----------------------------------------------------------------------------
// batching
// -----------------------------------------------------------------------------

/\*_ @internal _/
export const BatchPhase = {
disabled: 0,
collect: 1,
commit: 2
} as const

/\*_ @internal _/
export type BatchPhase = typeof BatchPhase[keyof typeof BatchPhase]

/\*_ @internal _/
export const batchState = {
phase: BatchPhase.disabled as BatchPhase,
depth: 0,
stale: [] as Array<NodeImpl<any>>,
notify: new Set<NodeImpl<any>>()
}

/\*_ @internal _/
export function batch(f: () => void): void {
batchState.phase = BatchPhase.collect
batchState.depth++
try {
f()
if (batchState.depth === 1) {
for (let i = 0; i < batchState.stale.length; i++) {
batchRebuildNode(batchState.stale[i])
}
batchState.phase = BatchPhase.commit
for (const node of batchState.notify) {
node.notify()
}
batchState.notify.clear()
}
} finally {
batchState.depth--
if (batchState.depth === 0) {
batchState.phase = BatchPhase.disabled
batchState.stale = []
}
}
}

function batchRebuildNode(node: NodeImpl<any>) {
if (node.state === NodeState.valid) {
return
}

for (let i = 0; i < node.parents.length; i++) {
const parent = node.parents[i]
if (parent.state !== NodeState.valid) {
batchRebuildNode(parent)
}
}

// @ts-ignore
if (node.state !== NodeState.valid) {
node.value()
}
}

/\*\*

- @since 4.0.0
  _/
  import _ as Duration from "../../Duration.ts"
  import _ as Effect from "../../Effect.ts"
  import _ as Layer from "../../Layer.ts"
  import type { ReadonlyRecord } from "../../Record.ts"
  import type { Scope } from "../../Scope.ts"
  import _ as ServiceMap from "../../ServiceMap.ts"
  import _ as Stream from "../../Stream.ts"
  import type { Mutable, NoInfer } from "../../Types.ts"
  import _ as Headers from "../http/Headers.ts"
  import type _ as Rpc from "../rpc/Rpc.ts"
  import _ as RpcClient from "../rpc/RpcClient.ts"
  import type { RpcClientError } from "../rpc/RpcClientError.ts"
  import type _ as RpcGroup from "../rpc/RpcGroup.ts"
  import type { RequestId } from "../rpc/RpcMessage.ts"
  import _ as RpcSchema from "../rpc/RpcSchema.ts"
  import type _ as AsyncResult from "./AsyncResult.ts"
  import _ as Atom from "./Atom.ts"
  import _ as Reactivity from "./Reactivity.ts"

/\*\*

- @since 4.0.0
- @category Models
  \*/
  export interface AtomRpcClient<Self, Id extends string, Rpcs extends Rpc.Any, E> extends
  ServiceMap.Service<
  Self,
  RpcClient.RpcClient.Flat<Rpcs, RpcClientError>
  > {
  > new(\_: never): ServiceMap.ServiceClass.Shape<
      Id,
      RpcClient.RpcClient.Flat<Rpcs, RpcClientError>
  >

readonly layer: Layer.Layer<Self, E>
readonly runtime: Atom.AtomRuntime<Self, E>

readonly mutation: <Tag extends Rpc.Tag<Rpcs>>(
arg: Tag
) => Rpc.ExtractTag<Rpcs, Tag> extends Rpc.Rpc<
infer \_Tag,
infer \_Payload,
infer \_Success,
infer \_Error,
infer \_Middleware,
infer \_Requires

> ? [_Success] extends [RpcSchema.Stream<infer _A, infer _E>] ? never

    : Atom.AtomResultFn<
      {
        readonly payload: Rpc.PayloadConstructor<Rpc.ExtractTag<Rpcs, Tag>>
        readonly reactivityKeys?:
          | ReadonlyArray<unknown>
          | ReadonlyRecord<string, ReadonlyArray<unknown>>
          | undefined
        readonly headers?: Headers.Input | undefined
      },
      _Success["Type"],
      _Error["Type"] | E | _Middleware["error"]["Type"]
    >
    : never

readonly query: <Tag extends Rpc.Tag<Rpcs>>(
tag: Tag,
payload: Rpc.PayloadConstructor<Rpc.ExtractTag<Rpcs, Tag>>,
options?: {
readonly headers?: Headers.Input | undefined
readonly reactivityKeys?:
| ReadonlyArray<unknown>
| ReadonlyRecord<string, ReadonlyArray<unknown>>
| undefined
readonly timeToLive?: Duration.Input | undefined
}
) => Rpc.ExtractTag<Rpcs, Tag> extends Rpc.Rpc<
infer \_Tag,
infer \_Payload,
infer \_Success,
infer \_Error,
infer \_Middleware

> ? [_Success] extends [RpcSchema.Stream<infer _A, infer _E>] ? Atom.Writable<

        Atom.PullResult<
          _A["Type"],
          _E["Type"] | _Error["Type"] | E | _Middleware["error"]["Type"]
        >,
        void
      >
    : Atom.Atom<
      AsyncResult.AsyncResult<
        _Success["Type"],
        _Error["Type"] | E | _Middleware["error"]["Type"]
      >
    >
    : never

}

declare global {
interface ErrorConstructor {
stackTraceLimit: number
}
}

/\*\*

- @since 4.0.0
- @category Constructors
  \*/
  export const Service = <Self>() =>
  <
  const Id extends string,
  Rpcs extends Rpc.Any,
  ER,
  RM =
  | RpcClient.Protocol
  | Rpc.MiddlewareClient<NoInfer<Rpcs>>
  | Rpc.ServicesClient<NoInfer<Rpcs>>
  > (
  > id: Id,
  > options: {
      readonly group: RpcGroup.RpcGroup<Rpcs>
      readonly protocol: Layer.Layer<Exclude<NoInfer<RM>, Scope>, ER>
      readonly spanPrefix?: string | undefined
      readonly spanAttributes?: Record<string, unknown> | undefined
      readonly generateRequestId?: (() => RequestId) | undefined
      readonly disableTracing?: boolean | undefined
      readonly makeEffect?:
        | Effect.Effect<
          RpcClient.RpcClient.Flat<Rpcs, RpcClientError>,
          never,
          RM
        >
        | undefined
      readonly runtime?: Atom.RuntimeFactory | undefined
  }
  ): AtomRpcClient<Self, Id, Rpcs, ER> => {
  const self: Mutable<AtomRpcClient<Self, Id, Rpcs, ER>> = ServiceMap.Service<
  Self,
  RpcClient.RpcClient.Flat<Rpcs, RpcClientError>
  > ()(id) as any

self.layer = Layer.effect(
self,
options.makeEffect ??
(RpcClient.make(options.group, {
...options,
flatten: true
}) as Effect.Effect<
RpcClient.RpcClient.Flat<Rpcs, RpcClientError>,
never,
RM >)
).pipe(Layer.provide(options.protocol))
const runtimeFactory = options.runtime ?? Atom.runtime
self.runtime = runtimeFactory(self.layer)

self.mutation = Atom.family(<Tag extends Rpc.Tag<Rpcs>>(tag: Tag) =>
self.runtime.fn<{
readonly payload: Rpc.PayloadConstructor<Rpc.ExtractTag<Rpcs, Tag>>
readonly reactivityKeys?:
| ReadonlyArray<unknown>
| ReadonlyRecord<string, ReadonlyArray<unknown>>
| undefined
readonly headers?: Headers.Input | undefined
}>()(
Effect.fnUntraced(function*({ headers, payload, reactivityKeys }) {
const client = yield* self
const effect = client(tag, payload, { headers } as any)
return yield\* reactivityKeys
? Reactivity.mutation(effect, reactivityKeys)
: effect
}) as any
)
) as any

const queryFamily = Atom.family(
({ headers, payload, reactivityKeys, tag, timeToLive }: QueryKey) => {
const rpc = options.group.requests.get(tag)! as any as Rpc.AnyWithProps
let atom = RpcSchema.isStreamSchema(rpc.successSchema)
? self.runtime.pull(
Stream.unwrap(
self.use((client) =>
Effect.succeed(
client(tag, payload, { headers } as any) as any
)
)
)
)
: self.runtime.atom(
self.use((client) => client(tag, payload, { headers } as any)) as any
)
if (timeToLive) {
atom = Duration.isFinite(timeToLive)
? Atom.setIdleTTL(atom, timeToLive)
: Atom.keepAlive(atom)
}
return reactivityKeys
? self.runtime.factory.withReactivity(reactivityKeys)(atom)
: atom
}
)

self.query = <Tag extends Rpc.Tag<Rpcs>>(
tag: Tag,
payload: Rpc.PayloadConstructor<Rpc.ExtractTag<Rpcs, Tag>>,
options?: {
readonly headers?: Headers.Input | undefined
readonly reactivityKeys?:
| ReadonlyArray<unknown>
| ReadonlyRecord<string, ReadonlyArray<unknown>>
| undefined
readonly timeToLive?: Duration.Input | undefined
}
) =>
queryFamily({
tag,
payload,
headers: options?.headers
? Headers.fromInput(options.headers)
: undefined,
reactivityKeys: options?.reactivityKeys,
timeToLive: options?.timeToLive
? Duration.fromInputUnsafe(options.timeToLive)
: undefined
}) as any

return self as AtomRpcClient<Self, Id, Rpcs, ER>
}

interface QueryKey {
tag: string
payload: any
headers?: Headers.Headers | undefined
reactivityKeys?:
| ReadonlyArray<unknown>
| ReadonlyRecord<string, ReadonlyArray<unknown>>
| undefined
timeToLive?: Duration.Duration | undefined
}

/\*\*

- @since 4.0.0
  _/
  import _ as AsyncResult from "./AsyncResult.ts"
  import _ as Atom from "./Atom.ts"
  import type _ as AtomRegistry from "./AtomRegistry.ts"

/\*\*

- @since 4.0.0
- @category models
  \*/
  export interface DehydratedAtom {
  readonly "~effect/reactivity/DehydratedAtom": true
  }

/\*\*

- @since 4.0.0
- @category models
  \*/
  export interface DehydratedAtomValue extends DehydratedAtom {
  readonly key: string
  readonly value: unknown
  readonly dehydratedAt: number
  readonly resultPromise?: Promise<unknown> | undefined
  }

/\*\*

- @since 4.0.0
- @category dehydration
  _/
  export const dehydrate = (
  registry: AtomRegistry.AtomRegistry,
  options?: {
  /\*\*
  _ How to encode `AsyncResult.Initial` values. Default is "ignore".
  \*/
  readonly encodeInitialAs?: "ignore" | "promise" | "value-only" | undefined
  }
  ): Array<DehydratedAtom> => {
  const encodeInitialResultMode = options?.encodeInitialAs ?? "ignore"
  const arr: Array<DehydratedAtomValue> = []
  const now = Date.now()
  registry.getNodes().forEach((node, key) => {
  if (!Atom.isSerializable(node.atom)) return
  const atom = node.atom
  const value = node.value()
  const isInitial = AsyncResult.isAsyncResult(value) && AsyncResult.isInitial(value)
  if (encodeInitialResultMode === "ignore" && isInitial) return
  const encodedValue = atom[Atom.SerializableTypeId].encode(value)

      // Create a promise that resolves when the atom moves out of Initial state
      let resultPromise: Promise<unknown> | undefined
      if (encodeInitialResultMode === "promise" && isInitial) {
        resultPromise = new Promise((resolve) => {
          const unsubscribe = registry.subscribe(atom, (newValue) => {
            if (AsyncResult.isAsyncResult(newValue) && !AsyncResult.isInitial(newValue)) {
              resolve(atom[Atom.SerializableTypeId].encode(newValue))
              unsubscribe()
            }
          })
        })
      }

      arr.push({
        "~effect/reactivity/DehydratedAtom": true,
        key: key as string,
        value: encodedValue,
        dehydratedAt: now,
        resultPromise
      })

  })
  return arr as any
  }

/\*\*

- @since 4.0.0
- @category dehydration
  \*/
  export const toValues = (state: ReadonlyArray<DehydratedAtom>): Array<DehydratedAtomValue> => state as any

/\*\*

- @since 4.0.0
- @category hydration
  \*/
  export const hydrate = (
  registry: AtomRegistry.AtomRegistry,
  dehydratedState: Iterable<DehydratedAtom>
  ): void => {
  for (const datom of (dehydratedState as Iterable<DehydratedAtomValue>)) {
  registry.setSerializable(datom.key, datom.value)

      // If there's a resultPromise, it means this was in Initial state when dehydrated
      // and we should wait for it to resolve to a non-Initial state, then update the registry
      if (!datom.resultPromise) continue
      datom.resultPromise.then((resolvedValue) => {
        // Try to update the existing node directly instead of using setSerializable
        const nodes = registry.getNodes()
        const node = nodes.get(datom.key)
        if (node) {
          // Decode the resolved value using the node's atom serializable decoder
          const atom = node.atom as any
          if (atom[Atom.SerializableTypeId]) {
            const decoded = atom[Atom.SerializableTypeId].decode(resolvedValue)
            ;(node as any).setValue(decoded)
          }
        } else {
          // Fallback to setSerializable if node doesn't exist yet
          registry.setSerializable(datom.key, resolvedValue)
        }
      })

  }
  }

/\*\*

- @since 4.0.0
  _/
  import _ as AsyncResult from "./AsyncResult.ts"
  import _ as Atom from "./Atom.ts"
  import type _ as AtomRegistry from "./AtomRegistry.ts"

/\*\*

- @since 4.0.0
- @category models
  \*/
  export interface DehydratedAtom {
  readonly "~effect/reactivity/DehydratedAtom": true
  }

/\*\*

- @since 4.0.0
- @category models
  \*/
  export interface DehydratedAtomValue extends DehydratedAtom {
  readonly key: string
  readonly value: unknown
  readonly dehydratedAt: number
  readonly resultPromise?: Promise<unknown> | undefined
  }

/\*\*

- @since 4.0.0
- @category dehydration
  _/
  export const dehydrate = (
  registry: AtomRegistry.AtomRegistry,
  options?: {
  /\*\*
  _ How to encode `AsyncResult.Initial` values. Default is "ignore".
  \*/
  readonly encodeInitialAs?: "ignore" | "promise" | "value-only" | undefined
  }
  ): Array<DehydratedAtom> => {
  const encodeInitialResultMode = options?.encodeInitialAs ?? "ignore"
  const arr: Array<DehydratedAtomValue> = []
  const now = Date.now()
  registry.getNodes().forEach((node, key) => {
  if (!Atom.isSerializable(node.atom)) return
  const atom = node.atom
  const value = node.value()
  const isInitial = AsyncResult.isAsyncResult(value) && AsyncResult.isInitial(value)
  if (encodeInitialResultMode === "ignore" && isInitial) return
  const encodedValue = atom[Atom.SerializableTypeId].encode(value)

      // Create a promise that resolves when the atom moves out of Initial state
      let resultPromise: Promise<unknown> | undefined
      if (encodeInitialResultMode === "promise" && isInitial) {
        resultPromise = new Promise((resolve) => {
          const unsubscribe = registry.subscribe(atom, (newValue) => {
            if (AsyncResult.isAsyncResult(newValue) && !AsyncResult.isInitial(newValue)) {
              resolve(atom[Atom.SerializableTypeId].encode(newValue))
              unsubscribe()
            }
          })
        })
      }

      arr.push({
        "~effect/reactivity/DehydratedAtom": true,
        key: key as string,
        value: encodedValue,
        dehydratedAt: now,
        resultPromise
      })

  })
  return arr as any
  }

/\*\*

- @since 4.0.0
- @category dehydration
  \*/
  export const toValues = (state: ReadonlyArray<DehydratedAtom>): Array<DehydratedAtomValue> => state as any

/\*\*

- @since 4.0.0
- @category hydration
  \*/
  export const hydrate = (
  registry: AtomRegistry.AtomRegistry,
  dehydratedState: Iterable<DehydratedAtom>
  ): void => {
  for (const datom of (dehydratedState as Iterable<DehydratedAtomValue>)) {
  registry.setSerializable(datom.key, datom.value)

      // If there's a resultPromise, it means this was in Initial state when dehydrated
      // and we should wait for it to resolve to a non-Initial state, then update the registry
      if (!datom.resultPromise) continue
      datom.resultPromise.then((resolvedValue) => {
        // Try to update the existing node directly instead of using setSerializable
        const nodes = registry.getNodes()
        const node = nodes.get(datom.key)
        if (node) {
          // Decode the resolved value using the node's atom serializable decoder
          const atom = node.atom as any
          if (atom[Atom.SerializableTypeId]) {
            const decoded = atom[Atom.SerializableTypeId].decode(resolvedValue)
            ;(node as any).setValue(decoded)
          }
        } else {
          // Fallback to setSerializable if node doesn't exist yet
          registry.setSerializable(datom.key, resolvedValue)
        }
      })

  }
  }

/\*\*

- @since 4.0.0
  _/
  import _ as Effect from "../../Effect.ts"
  import type _ as Exit from "../../Exit.ts"
  import _ as Fiber from "../../Fiber.ts"
  import { dual, flow } from "../../Function.ts"
  import _ as Hash from "../../Hash.ts"
  import _ as Layer from "../../Layer.ts"
  import _ as Queue from "../../Queue.ts"
  import type { ReadonlyRecord } from "../../Record.ts"
  import _ as Scope from "../../Scope.ts"
  import _ as ServiceMap from "../../ServiceMap.ts"
  import _ as Stream from "../../Stream.ts"

/\*\*

- @since 4.0.0
- @category tags
  \*/
  export class Reactivity extends ServiceMap.Service<
  Reactivity,
  {
  readonly invalidateUnsafe: (keys: ReadonlyArray<unknown> | ReadonlyRecord<string, ReadonlyArray<unknown>>) => void
  readonly registerUnsafe: (
  keys: ReadonlyArray<unknown> | ReadonlyRecord<string, ReadonlyArray<unknown>>,
  handler: () => void
  ) => () => void
  readonly invalidate: (
  keys: ReadonlyArray<unknown> | ReadonlyRecord<string, ReadonlyArray<unknown>>
  ) => Effect.Effect<void>
  readonly mutation: <A, E, R>(
  keys: ReadonlyArray<unknown> | ReadonlyRecord<string, ReadonlyArray<unknown>>,
  effect: Effect.Effect<A, E, R>
  ) => Effect.Effect<A, E, R>
  readonly query: <A, E, R>(
  keys: ReadonlyArray<unknown> | ReadonlyRecord<string, ReadonlyArray<unknown>>,
  effect: Effect.Effect<A, E, R>
  ) => Effect.Effect<Queue.Dequeue<A, E>, never, R | Scope.Scope>
  readonly stream: <A, E, R>(
  keys: ReadonlyArray<unknown> | ReadonlyRecord<string, ReadonlyArray<unknown>>,
  effect: Effect.Effect<A, E, R>
  ) => Stream.Stream<A, E, Exclude<R, Scope.Scope>>
  readonly withBatch: <A, E, R>(effect: Effect.Effect<A, E, R>) => Effect.Effect<A, E, R>
  }
  > ()("effect/reactivity/Reactivity") {}

/\*\*

- @since 4.0.0
- @category constructors
  \*/
  export const make = Effect.sync(() => {
  const handlers = new Map<number | string, Set<() => void>>()

const invalidateUnsafe = (keys: ReadonlyArray<unknown> | ReadonlyRecord<string, ReadonlyArray<unknown>>): void => {
keysToHashes(keys, (hash) => {
const set = handlers.get(hash)
if (set === undefined) return
set.forEach((run) => run())
})
}

const invalidate = (
keys: ReadonlyArray<unknown> | ReadonlyRecord<string, ReadonlyArray<unknown>>
): Effect.Effect<void> =>
Effect.servicesWith((services) => {
const pending = services.mapUnsafe.get(PendingInvalidation.key) as Set<string | number> | undefined
if (pending) {
keysToHashes(keys, (hash) => {
pending.add(hash)
})
} else {
invalidateUnsafe(keys)
}
return Effect.void
})

const mutation = <A, E, R>(
keys: ReadonlyArray<unknown> | ReadonlyRecord<string, ReadonlyArray<unknown>>,
effect: Effect.Effect<A, E, R>
): Effect.Effect<A, E, R> => Effect.tap(effect, invalidate(keys))

const registerUnsafe = (
keys: ReadonlyArray<unknown> | ReadonlyRecord<string, ReadonlyArray<unknown>>,
handler: () => void
): () => void => {
const resolvedKeys: Array<string | number> = []
keysToHashes(keys, (hash) => {
resolvedKeys.push(hash)
let set = handlers.get(hash)
if (set === undefined) {
set = new Set()
handlers.set(hash, set)
}
set.add(handler)
})
return () => {
for (let i = 0; i < resolvedKeys.length; i++) {
const set = handlers.get(resolvedKeys[i])!
set.delete(handler)
if (set.size === 0) {
handlers.delete(resolvedKeys[i])
}
}
}
}

const query = <A, E, R>(
keys: ReadonlyArray<unknown> | ReadonlyRecord<string, ReadonlyArray<unknown>>,
effect: Effect.Effect<A, E, R>
): Effect.Effect<Queue.Dequeue<A, E>, never, R | Scope.Scope> =>
Effect.gen(function*() {
const services = yield* Effect.services<Scope.Scope | R>()
const scope = ServiceMap.get(services, Scope.Scope)
const results = yield\* Queue.make<A, E>()
const runFork = flow(Effect.runForkWith(services), Fiber.runIn(scope))

      let running = false
      let pending = false
      const handleExit = (exit: Exit.Exit<A, E>) => {
        if (exit._tag === "Failure") {
          Queue.failCauseUnsafe(results, exit.cause)
        } else {
          Queue.offerUnsafe(results, exit.value)
        }
        if (pending) {
          pending = false
          runFork(effect).addObserver(handleExit)
        } else {
          running = false
        }
      }

      function run() {
        if (running) {
          pending = true
          return
        }
        running = true
        runFork(effect).addObserver(handleExit)
      }

      const cancel = registerUnsafe(keys, run)
      yield* Scope.addFinalizer(scope, Effect.sync(cancel))
      run()

      return results as Queue.Dequeue<A, E>
    })

const stream = <A, E, R>(
tables: ReadonlyArray<unknown> | ReadonlyRecord<string, ReadonlyArray<unknown>>,
effect: Effect.Effect<A, E, R>
): Stream.Stream<A, E, Exclude<R, Scope.Scope>> =>
query(tables, effect).pipe(
Effect.map(Stream.fromQueue),
Stream.unwrap
)

const withBatch = <A, E, R>(effect: Effect.Effect<A, E, R>): Effect.Effect<A, E, R> =>
Effect.suspend(() => {
const pending = new Set<string | number>()
return effect.pipe(
Effect.provideService(PendingInvalidation, pending),
Effect.onExit((\_) =>
Effect.sync(() => {
pending.forEach((hash) => {
const set = handlers.get(hash)
if (set === undefined) return
set.forEach((run) => run())
})
})
)
)
})

return Reactivity.of({
mutation,
query,
stream,
invalidateUnsafe,
invalidate,
registerUnsafe,
withBatch
})
})

class PendingInvalidation extends ServiceMap.Service<PendingInvalidation, Set<string | number>>()(
"effect/reactivity/Reactivity/PendingInvalidation"
) {}

/\*\*

- @since 4.0.0
- @category accessors
  \*/
  export const mutation: {
  (
  keys: ReadonlyArray<unknown> | ReadonlyRecord<string, ReadonlyArray<unknown>>
  ): <A, E, R>(effect: Effect.Effect<A, E, R>) => Effect.Effect<A, E, R | Reactivity>
  <A, E, R>(
  effect: Effect.Effect<A, E, R>,
  keys: ReadonlyArray<unknown> | ReadonlyRecord<string, ReadonlyArray<unknown>>
  ): Effect.Effect<A, E, R | Reactivity>
  } = dual(2, <A, E, R>(
  effect: Effect.Effect<A, E, R>,
  keys: ReadonlyArray<unknown> | ReadonlyRecord<string, ReadonlyArray<unknown>>
  ): Effect.Effect<A, E, R | Reactivity> => Reactivity.use((_) => _.mutation(keys, effect)))

/\*\*

- @since 4.0.0
- @category accessors
  \*/
  export const query: {
  (
  keys: ReadonlyArray<unknown> | ReadonlyRecord<string, ReadonlyArray<unknown>>
  ): <A, E, R>(
  effect: Effect.Effect<A, E, R>
  ) => Effect.Effect<Queue.Dequeue<A, E>, never, R | Scope.Scope | Reactivity>
  <A, E, R>(
  effect: Effect.Effect<A, E, R>,
  keys: ReadonlyArray<unknown> | ReadonlyRecord<string, ReadonlyArray<unknown>>
  ): Effect.Effect<Queue.Dequeue<A, E>, never, R | Scope.Scope | Reactivity>
  } = dual(2, <A, E, R>(
  effect: Effect.Effect<A, E, R>,
  keys: ReadonlyArray<unknown> | ReadonlyRecord<string, ReadonlyArray<unknown>>
  ): Effect.Effect<Queue.Dequeue<A, E>, never, R | Scope.Scope | Reactivity> =>
  Reactivity.use((r) => r.query(keys, effect)))

/\*\*

- @since 4.0.0
- @category accessors
  \*/
  export const stream: {
  (
  keys: ReadonlyArray<unknown> | ReadonlyRecord<string, ReadonlyArray<unknown>>
  ): <A, E, R>(effect: Effect.Effect<A, E, R>) => Stream.Stream<A, E, Exclude<R, Scope.Scope> | Reactivity>
  <A, E, R>(
  effect: Effect.Effect<A, E, R>,
  keys: ReadonlyArray<unknown> | ReadonlyRecord<string, ReadonlyArray<unknown>>
  ): Stream.Stream<A, E, Exclude<R, Scope.Scope> | Reactivity>
  } = dual(2, <A, E, R>(
  effect: Effect.Effect<A, E, R>,
  keys: ReadonlyArray<unknown> | ReadonlyRecord<string, ReadonlyArray<unknown>>
  ): Stream.Stream<A, E, Exclude<R, Scope.Scope> | Reactivity> =>
  Reactivity.use((r) => r.query(keys, effect)).pipe(
  Effect.map(Stream.fromQueue),
  Stream.unwrap
  ))

/\*\*

- @since 4.0.0
- @category accessors
  \*/
  export const invalidate = (
  keys: ReadonlyArray<unknown> | ReadonlyRecord<string, ReadonlyArray<unknown>>
  ): Effect.Effect<void, never, Reactivity> => Reactivity.use((r) => r.invalidate(keys))

/\*\*

- @since 4.0.0
- @category layers
  \*/
  export const layer: Layer.Layer<Reactivity> = Layer.effect(Reactivity)(make)

function stringOrHash(u: unknown): string | number {
switch (typeof u) {
case "string":
case "number":
case "bigint":
case "boolean":
return String(u)
default:
return Hash.hash(u)
}
}

const keysToHashes = (
keys: ReadonlyArray<unknown> | ReadonlyRecord<string, ReadonlyArray<unknown>>,
f: (hash: string | number) => void
): void => {
if (Array.isArray(keys)) {
for (let i = 0; i < keys.length; i++) {
f(stringOrHash(keys[i]))
}
return
}
for (const key in keys) {
f(key)
const ids = (keys as ReadonlyRecord<string, ReadonlyArray<unknown>>)[key]
for (let i = 0; i < ids.length; i++) {
f(`${key}:${stringOrHash(ids[i])}`)
}
}
}

/\*\*

- @since 1.0.0
  \*/
  "use client"

import _ as Cause from "effect/Cause"
import _ as Effect from "effect/Effect"
import _ as Exit from "effect/Exit"
import type _ as AsyncResult from "effect/unstable/reactivity/AsyncResult"
import _ as Atom from "effect/unstable/reactivity/Atom"
import type _ as AtomRef from "effect/unstable/reactivity/AtomRef"
import _ as AtomRegistry from "effect/unstable/reactivity/AtomRegistry"
import _ as React from "react"
import { RegistryContext } from "./RegistryContext.ts"

interface AtomStore<A> {
readonly subscribe: (f: () => void) => () => void
readonly snapshot: () => A
readonly getServerSnapshot: () => A
}

const storeRegistry = new WeakMap<AtomRegistry.AtomRegistry, WeakMap<Atom.Atom<any>, AtomStore<any>>>()

function makeStore<A>(registry: AtomRegistry.AtomRegistry, atom: Atom.Atom<A>): AtomStore<A> {
let stores = storeRegistry.get(registry)
if (stores === undefined) {
stores = new WeakMap()
storeRegistry.set(registry, stores)
}
const store = stores.get(atom)
if (store !== undefined) {
return store
}
const newStore: AtomStore<A> = {
subscribe(f) {
return registry.subscribe(atom, f)
},
snapshot() {
return registry.get(atom)
},
getServerSnapshot() {
return Atom.getServerValue(atom, registry)
}
}
stores.set(atom, newStore)
return newStore
}

function useStore<A>(registry: AtomRegistry.AtomRegistry, atom: Atom.Atom<A>): A {
const store = makeStore(registry, atom)

return React.useSyncExternalStore(store.subscribe, store.snapshot, store.getServerSnapshot)
}

const initialValuesSet = new WeakMap<AtomRegistry.AtomRegistry, WeakSet<Atom.Atom<any>>>()

/\*\*

- @since 1.0.0
- @category hooks
  \*/
  export const useAtomInitialValues = (initialValues: Iterable<readonly [Atom.Atom<any>, any]>): void => {
  const registry = React.useContext(RegistryContext)
  let set = initialValuesSet.get(registry)
  if (set === undefined) {
  set = new WeakSet()
  initialValuesSet.set(registry, set)
  }
  for (const [atom, value] of initialValues) {
  if (!set.has(atom)) {
  set.add(atom)
  ;(registry as any).ensureNode(atom).setValue(value)
  }
  }
  }

/\*\*

- @since 1.0.0
- @category hooks
  \*/
  export const useAtomValue: {
  <A>(atom: Atom.Atom<A>): A
  <A, B>(atom: Atom.Atom<A>, f: (_: A) => B): B
  } = <A>(atom: Atom.Atom<A>, f?: (_: A) => A): A => {
  const registry = React.useContext(RegistryContext)
  if (f) {
  const atomB = React.useMemo(() => Atom.map(atom, f), [atom, f])
  return useStore(registry, atomB)
  }
  return useStore(registry, atom)
  }

function mountAtom<A>(registry: AtomRegistry.AtomRegistry, atom: Atom.Atom<A>): void {
React.useEffect(() => registry.mount(atom), [atom, registry])
}

function setAtom<R, W, Mode extends "value" | "promise" | "promiseExit" = never>(
registry: AtomRegistry.AtomRegistry,
atom: Atom.Writable<R, W>,
options?: {
readonly mode?: ([R] extends [AsyncResult.AsyncResult<any, any>] ? Mode : "value") | undefined
}
): "promise" extends Mode ? (
(value: W) => Promise<AsyncResult.AsyncResult.Success<R>>
) :
"promiseExit" extends Mode ? (
(value: W) => Promise<Exit.Exit<AsyncResult.AsyncResult.Success<R>, AsyncResult.AsyncResult.Failure<R>>>
) :
((value: W | ((value: R) => W)) => void)
{
if (options?.mode === "promise" || options?.mode === "promiseExit") {
return React.useCallback((value: W) => {
registry.set(atom, value)
const promise = Effect.runPromiseExit(
AtomRegistry.getResult(registry, atom as Atom.Atom<AsyncResult.AsyncResult<any, any>>, {
suspendOnWaiting: true
})
)
return options!.mode === "promise" ? promise.then(flattenExit) : promise
}, [registry, atom, options.mode]) as any
}
return React.useCallback((value: W | ((value: R) => W)) => {
registry.set(atom, typeof value === "function" ? (value as any)(registry.get(atom)) : value)
}, [registry, atom]) as any
}

const flattenExit = <A, E>(exit: Exit.Exit<A, E>): A => {
if (Exit.isSuccess(exit)) return exit.value
throw Cause.squash(exit.cause)
}

/\*\*

- @since 1.0.0
- @category hooks
  \*/
  export const useAtomMount = <A>(atom: Atom.Atom<A>): void => {
  const registry = React.useContext(RegistryContext)
  mountAtom(registry, atom)
  }

/\*\*

- @since 1.0.0
- @category hooks
  \*/
  export const useAtomSet = <
  R,
  W,
  Mode extends "value" | "promise" | "promiseExit" = never
  > (
  > atom: Atom.Writable<R, W>,
  > options?: {
      readonly mode?: ([R] extends [AsyncResult.AsyncResult<any, any>] ? Mode : "value") | undefined
  }
  ): "promise" extends Mode ? (
  (value: W) => Promise<AsyncResult.AsyncResult.Success<R>>
  ) :
  "promiseExit" extends Mode ? (
  (value: W) => Promise<Exit.Exit<AsyncResult.AsyncResult.Success<R>, AsyncResult.AsyncResult.Failure<R>>>
  ) :
  ((value: W | ((value: R) => W)) => void) =>
  {
  const registry = React.useContext(RegistryContext)
  mountAtom(registry, atom)
  return setAtom(registry, atom, options)
  }

/\*\*

- @since 1.0.0
- @category hooks
  \*/
  export const useAtomRefresh = <A>(atom: Atom.Atom<A>): () => void => {
  const registry = React.useContext(RegistryContext)
  mountAtom(registry, atom)
  return React.useCallback(() => {
  registry.refresh(atom)
  }, [registry, atom])
  }

/\*\*

- @since 1.0.0
- @category hooks
  \*/
  export const useAtom = <R, W, const Mode extends "value" | "promise" | "promiseExit" = never>(
  atom: Atom.Writable<R, W>,
  options?: {
  readonly mode?: ([R] extends [AsyncResult.AsyncResult<any, any>] ? Mode : "value") | undefined
  }
  ): readonly [
  value: R,
  write: "promise" extends Mode ? (
  (value: W) => Promise<AsyncResult.AsyncResult.Success<R>>
  ) :
  "promiseExit" extends Mode ? (
  (value: W) => Promise<Exit.Exit<AsyncResult.AsyncResult.Success<R>, AsyncResult.AsyncResult.Failure<R>>>
  ) :
  ((value: W | ((value: R) => W)) => void)
  ] => {
  const registry = React.useContext(RegistryContext)
  return [
  useStore(registry, atom),
  setAtom(registry, atom, options)
  ] as const
  }

const atomPromiseMap = {
suspendOnWaiting: new Map<Atom.Atom<any>, Promise<void>>(),
default: new Map<Atom.Atom<any>, Promise<void>>()
}

function atomToPromise<A, E>(
registry: AtomRegistry.AtomRegistry,
atom: Atom.Atom<AsyncResult.AsyncResult<A, E>>,
suspendOnWaiting: boolean
) {
const map = suspendOnWaiting ? atomPromiseMap.suspendOnWaiting : atomPromiseMap.default
let promise = map.get(atom)
if (promise !== undefined) {
return promise
}
promise = new Promise<void>((resolve) => {
const dispose = registry.subscribe(atom, (result) => {
if (result.\_tag === "Initial" || (suspendOnWaiting && result.waiting)) {
return
}
setTimeout(dispose, 1000)
resolve()
map.delete(atom)
})
})
map.set(atom, promise)
return promise
}

function atomResultOrSuspend<A, E>(
registry: AtomRegistry.AtomRegistry,
atom: Atom.Atom<AsyncResult.AsyncResult<A, E>>,
suspendOnWaiting: boolean
) {
const value = useStore(registry, atom)
if (value.\_tag === "Initial" || (suspendOnWaiting && value.waiting)) {
throw atomToPromise(registry, atom, suspendOnWaiting)
}
return value
}

/\*\*

- @since 1.0.0
- @category hooks
  \*/
  export const useAtomSuspense = <A, E, const IncludeFailure extends boolean = false>(
  atom: Atom.Atom<AsyncResult.AsyncResult<A, E>>,
  options?: {
  readonly suspendOnWaiting?: boolean | undefined
  readonly includeFailure?: IncludeFailure | undefined
  }
  ): AsyncResult.Success<A, E> | (IncludeFailure extends true ? AsyncResult.Failure<A, E> : never) => {
  const registry = React.useContext(RegistryContext)
  const result = atomResultOrSuspend(registry, atom, options?.suspendOnWaiting ?? false)
  if (result.\_tag === "Failure" && !options?.includeFailure) {
  throw Cause.squash(result.cause)
  }
  return result as any
  }

/\*\*

- @since 1.0.0
- @category hooks
  \*/
  export const useAtomSubscribe = <A>(
  atom: Atom.Atom<A>,
  f: (\_: A) => void,
  options?: { readonly immediate?: boolean }
  ): void => {
  const registry = React.useContext(RegistryContext)
  React.useEffect(
  () => registry.subscribe(atom, f, options),
  [registry, atom, f, options?.immediate]
  )
  }

/\*\*

- @since 1.0.0
- @category hooks
  \*/
  export const useAtomRef = <A>(ref: AtomRef.ReadonlyRef<A>): A => {
  const [, setValue] = React.useState(ref.value)
  React.useEffect(() => ref.subscribe(setValue), [ref])
  return ref.value
  }

/\*\*

- @since 1.0.0
- @category hooks
  \*/
  export const useAtomRefProp = <A, K extends keyof A>(ref: AtomRef.AtomRef<A>, prop: K): AtomRef.AtomRef<A[K]> =>
  React.useMemo(() => ref.prop(prop), [ref, prop])

/\*\*

- @since 1.0.0
- @category hooks
  \*/
  export const useAtomRefPropValue = <A, K extends keyof A>(ref: AtomRef.AtomRef<A>, prop: K): A[K] =>
  useAtomRef(useAtomRefProp(ref, prop))

/\*\*

- @since 1.0.0
  _/
  "use client"
  import _ as Hydration from "effect/unstable/reactivity/Hydration"
  import \* as React from "react"
  import { RegistryContext } from "./RegistryContext.ts"

/\*\*

- @since 1.0.0
- @category components
  \*/
  export interface HydrationBoundaryProps {
  state?: Iterable<Hydration.DehydratedAtom>
  children?: React.ReactNode
  }

/\*\*

- @since 1.0.0
- @category components
  \*/
  export const HydrationBoundary: React.FC<HydrationBoundaryProps> = ({
  children,
  state
  }) => {
  const registry = React.useContext(RegistryContext)

// This useMemo is for performance reasons only, everything inside it must
// be safe to run in every render and code here should be read as "in render".
//
// This code needs to happen during the render phase, because after initial
// SSR, hydration needs to happen _before_ children render. Also, if hydrating
// during a transition, we want to hydrate as much as is safe in render so
// we can prerender as much as possible.
//
// For any Atom values that already exist in the registry, we want to hold back on
// hydrating until _after_ the render phase. The reason for this is that during
// transitions, we don't want the existing Atom values and subscribers to update to
// the new data on the current page, only _after_ the transition is committed.
// If the transition is aborted, we will have hydrated any _new_ Atom values, but
// we throw away the fresh data for any existing ones to avoid unexpectedly
// updating the UI.
const hydrationQueue: Array<Hydration.DehydratedAtomValue> | undefined = React.useMemo(() => {
if (state) {
const dehydratedAtoms = Array.from(state) as Array<Hydration.DehydratedAtomValue>
const nodes = registry.getNodes()

      const newDehydratedAtoms: Array<Hydration.DehydratedAtomValue> = []
      const existingDehydratedAtoms: Array<Hydration.DehydratedAtomValue> = []

      for (const dehydratedAtom of dehydratedAtoms) {
        const existingNode = nodes.get(dehydratedAtom.key)

        if (!existingNode) {
          // This is a new Atom value, safe to hydrate immediately
          newDehydratedAtoms.push(dehydratedAtom)
        } else {
          // This Atom value already exists, queue it for later hydration
          existingDehydratedAtoms.push(dehydratedAtom)
        }
      }

      if (newDehydratedAtoms.length > 0) {
        // It's actually fine to call this with state that already exists
        // in the registry, or is older. hydrate() is idempotent.
        Hydration.hydrate(registry, newDehydratedAtoms)
      }

      if (existingDehydratedAtoms.length > 0) {
        return existingDehydratedAtoms
      }
    }
    return undefined

}, [registry, state])

React.useEffect(() => {
if (hydrationQueue) {
Hydration.hydrate(registry, hydrationQueue)
}
}, [registry, hydrationQueue])

return React.createElement(React.Fragment, {}, children)
}

/\*\*

- @since 1.0.0
  \*/
  "use client"

import type _ as Atom from "effect/unstable/reactivity/Atom"
import _ as AtomRegistry from "effect/unstable/reactivity/AtomRegistry"
import _ as React from "react"
import _ as Scheduler from "scheduler"

/\*\*

- @since 1.0.0
- @category context
  \*/
  export function scheduleTask(f: () => void): () => void {
  const node = Scheduler.unstable_scheduleCallback(Scheduler.unstable_LowPriority, f)
  return () => Scheduler.unstable_cancelCallback(node)
  }

/\*\*

- @since 1.0.0
- @category context
  \*/
  export const RegistryContext = React.createContext<AtomRegistry.AtomRegistry>(AtomRegistry.make({
  scheduleTask,
  defaultIdleTTL: 400
  }))

/\*\*

- @since 1.0.0
- @category context
  \*/
  export const RegistryProvider = (options: {
  readonly children?: React.ReactNode | undefined
  readonly initialValues?: Iterable<readonly [Atom.Atom<any>, any]> | undefined
  readonly scheduleTask?: ((f: () => void) => () => void) | undefined
  readonly timeoutResolution?: number | undefined
  readonly defaultIdleTTL?: number | undefined
  }) => {
  const ref = React.useRef<{
  readonly registry: AtomRegistry.AtomRegistry
  timeout?: number | undefined
  }>(null)
  if (ref.current === null) {
  ref.current = {
  registry: AtomRegistry.make({
  scheduleTask: options.scheduleTask ?? scheduleTask,
  initialValues: options.initialValues,
  timeoutResolution: options.timeoutResolution,
  defaultIdleTTL: options.defaultIdleTTL
  })
  }
  }
  React.useEffect(() => {
  if (ref.current?.timeout !== undefined) {
  clearTimeout(ref.current.timeout)
  }
  return () => {
  ref.current!.timeout = setTimeout(() => {
  ref.current?.registry.dispose()
  ref.current = null
  }, 500) as any
  }
  }, [ref])
  return React.createElement(RegistryContext.Provider, { value: ref.current.registry }, options?.children)
  }

/\*\*

- @since 1.0.0
  \*/
  "use client"

import type _ as Atom from "effect/unstable/reactivity/Atom"
import _ as React from "react"

/\*\*

- @since 1.0.0
- @category Type IDs
-
- Type identifier for ScopedAtom.
  \*/
  export type TypeId = "~@effect/atom-react/ScopedAtom"

/\*\*

- @since 1.0.0
- @category Type IDs
-
- Type identifier for ScopedAtom.
  \*/
  export const TypeId: TypeId = "~@effect/atom-react/ScopedAtom"

/\*\*

- @since 1.0.0
- @category models
-
- Scoped Atom interface with a provider-backed instance.
-
- @example
- ```ts

  ```

- import \* as Atom from "effect/unstable/reactivity/Atom"
- import \* as React from "react"
- import \* as ScopedAtom from "@effect/atom-react/ScopedAtom"
- import { useAtomValue } from "@effect/atom-react"
-
- const Counter = ScopedAtom.make(() => Atom.make(0))
-
- function View() {
- const atom = Counter.use()
- const value = useAtomValue(atom)
- return React.createElement("div", null, value)
- }
-
- export function App() {
- return React.createElement(Counter.Provider, null, React.createElement(View))
- }
- ```
   */
  export interface ScopedAtom<A extends Atom.Atom<any>, Input = never> {
    readonly [TypeId]: TypeId
    use(): A
    Provider: Input extends never ? React.FC<{ readonly children?: React.ReactNode | undefined }>
      : React.FC<{ readonly children?: React.ReactNode | undefined; readonly value: Input }>
    Context: React.Context<A>
  }
  ```

/\*\*

- @since 1.0.0
- @category constructors
-
- Creates a ScopedAtom from a factory function.
-
- @example
- ```ts

  ```

- import \* as Atom from "effect/unstable/reactivity/Atom"
- import \* as React from "react"
- import \* as ScopedAtom from "@effect/atom-react/ScopedAtom"
- import { useAtomValue } from "@effect/atom-react"
-
- const User = ScopedAtom.make((name: string) => Atom.make(name))
-
- function UserName() {
- const atom = User.use()
- const value = useAtomValue(atom)
- return React.createElement("span", null, value)
- }
-
- export function App() {
- return React.createElement(
-     User.Provider,
-     { value: "Ada" },
-     React.createElement(UserName)
- )
- }
- ```
   */
  export const make = <A extends Atom.Atom<any>, Input = never>(
    f: (() => A) | ((input: Input) => A)
  ): ScopedAtom<A, Input> => {
    const Context = React.createContext<A>(undefined as unknown as A)
  ```

const use = (): A => {
const atom = React.useContext(Context)
if (atom === undefined) {
throw new Error("ScopedAtom used outside of its Provider")
}
return atom
}

const Provider: React.FC<{ readonly children?: React.ReactNode | undefined; readonly value?: Input }> = (props) => {
const atom = React.useRef<A | null>(null)
if (atom.current === null) {
if ("value" in props) {
atom.current = (f as (input: Input) => A)(props.value as Input)
} else {
atom.current = (f as () => A)()
}
}
return React.createElement(Context.Provider, { value: atom.current }, props.children)
}

return {
[TypeId]: TypeId,
use,
Provider: Provider as any,
Context
}
}

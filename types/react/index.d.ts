// Type definitions for React 18.0
// Project: http://facebook.github.io/react/
// Definitions by: Asana <https://asana.com>
//                 AssureSign <http://www.assuresign.com>
//                 Microsoft <https://microsoft.com>
//                 John Reilly <https://github.com/johnnyreilly>
//                 Benoit Benezech <https://github.com/bbenezech>
//                 Patricio Zavolinsky <https://github.com/pzavolinsky>
//                 Eric Anderson <https://github.com/ericanderson>
//                 Dovydas Navickas <https://github.com/DovydasNavickas>
//                 Josh Rutherford <https://github.com/theruther4d>
//                 Guilherme Hübner <https://github.com/guilhermehubner>
//                 Ferdy Budhidharma <https://github.com/ferdaber>
//                 Johann Rakotoharisoa <https://github.com/jrakotoharisoa>
//                 Olivier Pascal <https://github.com/pascaloliv>
//                 Martin Hochel <https://github.com/hotell>
//                 Frank Li <https://github.com/franklixuefei>
//                 Jessica Franco <https://github.com/Jessidhia>
//                 Saransh Kataria <https://github.com/saranshkataria>
//                 Kanitkorn Sujautra <https://github.com/lukyth>
//                 Sebastian Silbermann <https://github.com/eps1lon>
//                 Kyle Scully <https://github.com/zieka>
//                 Cong Zhang <https://github.com/dancerphil>
//                 Dimitri Mitropoulos <https://github.com/dimitropoulos>
//                 JongChan Choi <https://github.com/disjukr>
//                 Victor Magalhães <https://github.com/vhfmag>
//                 Dale Tan <https://github.com/hellatan>
//                 Priyanshu Rav <https://github.com/priyanshurav>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.8

// NOTE: Users of the `experimental` builds of React should add a reference
// to 'react/experimental' in their project. See experimental.d.ts's top comment
// for reference and documentation on how exactly to do it.

/// <reference path="global.d.ts" />

import * as CSS from 'csstype';
import * as PropTypes from 'prop-types';
import { Interaction as SchedulerInteraction } from 'scheduler/tracing';

type NativeAnimationEvent = AnimationEvent;
type NativeClipboardEvent = ClipboardEvent;
type NativeCompositionEvent = CompositionEvent;
type NativeDragEvent = DragEvent;
type NativeFocusEvent = FocusEvent;
type NativeKeyboardEvent = KeyboardEvent;
type NativeMouseEvent = MouseEvent;
type NativeTouchEvent = TouchEvent;
type NativePointerEvent = PointerEvent;
type NativeTransitionEvent = TransitionEvent;
type NativeUIEvent = UIEvent;
type NativeWheelEvent = WheelEvent;
type Booleanish = boolean | 'true' | 'false';

declare const UNDEFINED_VOID_ONLY: unique symbol;
// Destructors are only allowed to return void.
type Destructor = () => void | { [UNDEFINED_VOID_ONLY]: never };
type VoidOrUndefinedOnly = void | { [UNDEFINED_VOID_ONLY]: never };

// eslint-disable-next-line export-just-namespace
export = React;
export as namespace React;

declare namespace React {
    //
    // React Elements
    // ----------------------------------------------------------------------

    type ElementType<P = any> =
        {
            [K in keyof JSX.IntrinsicElements]: P extends JSX.IntrinsicElements[K] ? K : never
        }[keyof JSX.IntrinsicElements] |
        ComponentType<P>;
    type ComponentType<P = {}> = ComponentClass<P> | FunctionComponent<P>;

    type JSXElementConstructor<P> =
        | ((props: P) => ReactElement<any, any> | null)
        | (new (props: P) => Component<any, any>);

    interface RefObject<T> {
        readonly current: T | null;
    }
    // Bivariance hack for consistent unsoundness with RefObject
    type RefCallback<T> = { bivarianceHack(instance: T | null): void }["bivarianceHack"];
    type Ref<T> = RefCallback<T> | RefObject<T> | null;
    type LegacyRef<T> = string | Ref<T>;
    /**
     * Gets the instance type for a React element. The instance will be different for various component types:
     *
     * - React class components will be the class instance. So if you had `class Foo extends React.Component<{}> {}`
     *   and used `React.ElementRef<typeof Foo>` then the type would be the instance of `Foo`.
     * - React stateless functional components do not have a backing instance and so `React.ElementRef<typeof Bar>`
     *   (when `Bar` is `function Bar() {}`) will give you the `undefined` type.
     * - JSX intrinsics like `div` will give you their DOM instance. For `React.ElementRef<'div'>` that would be
     *   `HTMLDivElement`. For `React.ElementRef<'input'>` that would be `HTMLInputElement`.
     * - React stateless functional components that forward a `ref` will give you the `ElementRef` of the forwarded
     *   to component.
     *
     * `C` must be the type _of_ a React component so you need to use typeof as in `React.ElementRef<typeof MyComponent>`.
     *
     * @todo In Flow, this works a little different with forwarded refs and the `AbstractComponent` that
     *       `React.forwardRef()` returns.
     */
    type ElementRef<
        C extends
            | ForwardRefExoticComponent<any>
            | { new (props: any): Component<any> }
            | ((props: any, context?: any) => ReactElement | null)
            | keyof JSX.IntrinsicElements
    > =
        // need to check first if `ref` is a valid prop for ts@3.0
        // otherwise it will infer `{}` instead of `never`
        "ref" extends keyof ComponentPropsWithRef<C>
            ? NonNullable<ComponentPropsWithRef<C>["ref"]> extends Ref<
                infer Instance
            >
                ? Instance
                : never
            : never;

    type ComponentState = any;

    type Key = string | number;

    /**
     * @internal You shouldn't need to use this type since you never see these attributes
     * inside your component or have to validate them.
     */
    interface Attributes {
        key?: Key | null | undefined;
    }
    interface RefAttributes<T> extends Attributes {
        ref?: Ref<T> | null | undefined;
    }
    interface ClassAttributes<T> extends Attributes {
        ref?: LegacyRef<T> | null | undefined;
    }

    interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
        type: T;
        props: P;
        key: Key | null;
    }

    interface ReactComponentElement<
        T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>,
        P = Pick<ComponentProps<T>, Exclude<keyof ComponentProps<T>, 'key' | 'ref'>>
    > extends ReactElement<P, Exclude<T, number>> { }

    interface FunctionComponentElement<P> extends ReactElement<P, FunctionComponent<P>> {
        ref?: ('ref' extends keyof P ? P extends { ref?: infer R | null | undefined } ? R : never : never) | null | undefined;
    }

    type CElement<P, T extends Component<P, ComponentState>> = ComponentElement<P, T>;
    interface ComponentElement<P, T extends Component<P, ComponentState>> extends ReactElement<P, ComponentClass<P>> {
        ref?: LegacyRef<T> | null | undefined;
    }

    type ClassicElement<P> = CElement<P, ClassicComponent<P, ComponentState>>;

    // string fallback for custom web-components
    interface DOMElement<P extends HTMLAttributes<T> | SVGAttributes<T>, T extends Element> extends ReactElement<P, string> {
        ref: LegacyRef<T>;
    }

    // ReactHTML for ReactHTMLElement
    interface ReactHTMLElement<T extends HTMLElement> extends DetailedReactHTMLElement<AllHTMLAttributes<T>, T> { }

    interface DetailedReactHTMLElement<P extends HTMLAttributes<T>, T extends HTMLElement> extends DOMElement<P, T> {
        type: keyof ReactHTML;
    }

    // ReactSVG for ReactSVGElement
    interface ReactSVGElement extends DOMElement<SVGAttributes<SVGElement>, SVGElement> {
        type: keyof ReactSVG;
    }

    interface ReactPortal extends ReactElement {
        key: Key | null;
        children: ReactNode;
    }

    //
    // Factories
    // ----------------------------------------------------------------------

    type Factory<P> = (props?: Attributes & P, ...children: ReactNode[]) => ReactElement<P>;

    /**
     * @deprecated Please use `FunctionComponentFactory`
     */
    type SFCFactory<P> = FunctionComponentFactory<P>;

    type FunctionComponentFactory<P> = (props?: Attributes & P, ...children: ReactNode[]) => FunctionComponentElement<P>;

    type ComponentFactory<P, T extends Component<P, ComponentState>> =
        (props?: ClassAttributes<T> & P, ...children: ReactNode[]) => CElement<P, T>;

    type CFactory<P, T extends Component<P, ComponentState>> = ComponentFactory<P, T>;
    type ClassicFactory<P> = CFactory<P, ClassicComponent<P, ComponentState>>;

    type DOMFactory<P extends DOMAttributes<T>, T extends Element> =
        (props?: ClassAttributes<T> & P | null, ...children: ReactNode[]) => DOMElement<P, T>;

    interface HTMLFactory<T extends HTMLElement> extends DetailedHTMLFactory<AllHTMLAttributes<T>, T> {}

    interface DetailedHTMLFactory<P extends HTMLAttributes<T>, T extends HTMLElement> extends DOMFactory<P, T> {
        (props?: ClassAttributes<T> & P | null, ...children: ReactNode[]): DetailedReactHTMLElement<P, T>;
    }

    interface SVGFactory extends DOMFactory<SVGAttributes<SVGElement>, SVGElement> {
        (props?: ClassAttributes<SVGElement> & SVGAttributes<SVGElement> | null, ...children: ReactNode[]): ReactSVGElement;
    }

    /**
     * @deprecated - This type is not relevant when using React. Inline the type instead to make the intent clear.
     */
    type ReactText = string | number;
    /**
     * @deprecated - This type is not relevant when using React. Inline the type instead to make the intent clear.
     */
    type ReactChild = ReactElement | string | number;

    /**
     * @deprecated Use either `ReactNode[]` if you need an array or `Iterable<ReactNode>` if its passed to a host component.
     */
    interface ReactNodeArray extends ReadonlyArray<ReactNode> {}
    type ReactFragment = Iterable<ReactNode>;
    type ReactNode = ReactElement | string | number | ReactFragment | ReactPortal | boolean | null | undefined;

    //
    // Top Level API
    // ----------------------------------------------------------------------

    // DOM Elements
    function createFactory<T extends HTMLElement>(
        type: keyof ReactHTML): HTMLFactory<T>;
    function createFactory(
        type: keyof ReactSVG): SVGFactory;
    function createFactory<P extends DOMAttributes<T>, T extends Element>(
        type: string): DOMFactory<P, T>;

    // Custom components
    function createFactory<P>(type: FunctionComponent<P>): FunctionComponentFactory<P>;
    function createFactory<P>(
        type: ClassType<P, ClassicComponent<P, ComponentState>, ClassicComponentClass<P>>): CFactory<P, ClassicComponent<P, ComponentState>>;
    function createFactory<P, T extends Component<P, ComponentState>, C extends ComponentClass<P>>(
        type: ClassType<P, T, C>): CFactory<P, T>;
    function createFactory<P>(type: ComponentClass<P>): Factory<P>;

    // DOM Elements
    // TODO: generalize this to everything in `keyof ReactHTML`, not just "input"
    function createElement(
        type: "input",
        props?: InputHTMLAttributes<HTMLInputElement> & ClassAttributes<HTMLInputElement> | null,
        ...children: ReactNode[]): DetailedReactHTMLElement<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
    function createElement<P extends HTMLAttributes<T>, T extends HTMLElement>(
        type: keyof ReactHTML,
        props?: ClassAttributes<T> & P | null,
        ...children: ReactNode[]): DetailedReactHTMLElement<P, T>;
    function createElement<P extends SVGAttributes<T>, T extends SVGElement>(
        type: keyof ReactSVG,
        props?: ClassAttributes<T> & P | null,
        ...children: ReactNode[]): ReactSVGElement;
    function createElement<P extends DOMAttributes<T>, T extends Element>(
        type: string,
        props?: ClassAttributes<T> & P | null,
        ...children: ReactNode[]): DOMElement<P, T>;

    // Custom components

    function createElement<P extends {}>(
        type: FunctionComponent<P>,
        props?: Attributes & P | null,
        ...children: ReactNode[]): FunctionComponentElement<P>;
    function createElement<P extends {}>(
        type: ClassType<P, ClassicComponent<P, ComponentState>, ClassicComponentClass<P>>,
        props?: ClassAttributes<ClassicComponent<P, ComponentState>> & P | null,
        ...children: ReactNode[]): CElement<P, ClassicComponent<P, ComponentState>>;
    function createElement<P extends {}, T extends Component<P, ComponentState>, C extends ComponentClass<P>>(
        type: ClassType<P, T, C>,
        props?: ClassAttributes<T> & P | null,
        ...children: ReactNode[]): CElement<P, T>;
    function createElement<P extends {}>(
        type: FunctionComponent<P> | ComponentClass<P> | string,
        props?: Attributes & P | null,
        ...children: ReactNode[]): ReactElement<P>;

    // DOM Elements
    // ReactHTMLElement
    function cloneElement<P extends HTMLAttributes<T>, T extends HTMLElement>(
        element: DetailedReactHTMLElement<P, T>,
        props?: P,
        ...children: ReactNode[]): DetailedReactHTMLElement<P, T>;
    // ReactHTMLElement, less specific
    function cloneElement<P extends HTMLAttributes<T>, T extends HTMLElement>(
        element: ReactHTMLElement<T>,
        props?: P,
        ...children: ReactNode[]): ReactHTMLElement<T>;
    // SVGElement
    function cloneElement<P extends SVGAttributes<T>, T extends SVGElement>(
        element: ReactSVGElement,
        props?: P,
        ...children: ReactNode[]): ReactSVGElement;
    // DOM Element (has to be the last, because type checking stops at first overload that fits)
    function cloneElement<P extends DOMAttributes<T>, T extends Element>(
        element: DOMElement<P, T>,
        props?: DOMAttributes<T> & P,
        ...children: ReactNode[]): DOMElement<P, T>;

    // Custom components
    function cloneElement<P>(
        element: FunctionComponentElement<P>,
        props?: Partial<P> & Attributes,
        ...children: ReactNode[]): FunctionComponentElement<P>;
    function cloneElement<P, T extends Component<P, ComponentState>>(
        element: CElement<P, T>,
        props?: Partial<P> & ClassAttributes<T>,
        ...children: ReactNode[]): CElement<P, T>;
    function cloneElement<P>(
        element: ReactElement<P>,
        props?: Partial<P> & Attributes,
        ...children: ReactNode[]): ReactElement<P>;

    // Context via RenderProps
    interface ProviderProps<T> {
        value: T;
        children?: ReactNode | null | undefined;
    }

    interface ConsumerProps<T> {
        children: (value: T) => ReactNode;
    }

    // TODO: similar to how Fragment is actually a symbol, the values returned from createContext,
    // forwardRef and memo are actually objects that are treated specially by the renderer; see:
    // https://github.com/facebook/react/blob/v16.6.0/packages/react/src/ReactContext.js#L35-L48
    // https://github.com/facebook/react/blob/v16.6.0/packages/react/src/forwardRef.js#L42-L45
    // https://github.com/facebook/react/blob/v16.6.0/packages/react/src/memo.js#L27-L31
    // However, we have no way of telling the JSX parser that it's a JSX element type or its props other than
    // by pretending to be a normal component.
    //
    // We don't just use ComponentType or FunctionComponent types because you are not supposed to attach statics to this
    // object, but rather to the original function.
    interface ExoticComponent<P = {}> {
        /**
         * **NOTE**: Exotic components are not callable.
         */
        (props: P): (ReactElement|null);
        readonly $$typeof: symbol;
    }

    interface NamedExoticComponent<P = {}> extends ExoticComponent<P> {
        displayName?: string | null | undefined;
    }

    interface ProviderExoticComponent<P> extends ExoticComponent<P> {
        propTypes?: WeakValidationMap<P> | null | undefined;
    }

    type ContextType<C extends Context<any>> = C extends Context<infer T> ? T : never;

    // NOTE: only the Context object itself can get a displayName
    // https://github.com/facebook/react-devtools/blob/e0b854e4c/backend/attachRendererFiber.js#L310-L325
    type Provider<T> = ProviderExoticComponent<ProviderProps<T>>;
    type Consumer<T> = ExoticComponent<ConsumerProps<T>>;
    interface Context<T> {
        Provider: Provider<T>;
        Consumer: Consumer<T>;
        displayName?: string | null | undefined;
    }
    function createContext<T>(
        // If you thought this should be optional, see
        // https://github.com/DefinitelyTyped/DefinitelyTyped/pull/24509#issuecomment-382213106
        defaultValue: T,
    ): Context<T>;

    function isValidElement<P>(object: {} | null | undefined): object is ReactElement<P>;

    // Sync with `ReactChildren` until `ReactChildren` is removed.
    const Children: {
        map<T, C>(children: C | ReadonlyArray<C>, fn: (child: C, index: number) => T):
            C extends null | undefined ? C : Array<Exclude<T, boolean | null | undefined>>;
        forEach<C>(children: C | ReadonlyArray<C>, fn: (child: C, index: number) => void): void;
        count(children: any): number;
        only<C>(children: C): C extends any[] ? never : C;
        toArray(children: ReactNode | ReactNode[]): Array<Exclude<ReactNode, boolean | null | undefined>>;
    };
    const Fragment: ExoticComponent<{ children?: ReactNode | null | undefined }>;
    const StrictMode: ExoticComponent<{ children?: ReactNode | null | undefined }>;

    interface SuspenseProps {
        children?: ReactNode | null | undefined;

        /** A fallback react tree to show when a Suspense child (like React.lazy) suspends */
        fallback?: ReactNode;
    }

    const Suspense: ExoticComponent<SuspenseProps>;
    const version: string;

    /**
     * {@link https://reactjs.org/docs/profiler.html#onrender-callback Profiler API}
     */
    type ProfilerOnRenderCallback = (
        id: string,
        phase: "mount" | "update",
        actualDuration: number,
        baseDuration: number,
        startTime: number,
        commitTime: number,
        interactions: Set<SchedulerInteraction>,
    ) => void;
    interface ProfilerProps {
        children?: ReactNode | null | undefined;
        id: string;
        onRender: ProfilerOnRenderCallback;
    }

    const Profiler: ExoticComponent<ProfilerProps>;

    //
    // Component API
    // ----------------------------------------------------------------------

    type ReactInstance = Component<any> | Element;

    // Base component for plain JS classes
    interface Component<P = {}, S = {}, SS = any> extends ComponentLifecycle<P, S, SS> { }
    class Component<P, S> {
        // tslint won't let me format the sample code in a way that vscode likes it :(
        /**
         * If set, `this.context` will be set at runtime to the current value of the given Context.
         *
         * Usage:
         *
         * ```ts
         * type MyContext = number
         * const Ctx = React.createContext<MyContext>(0)
         *
         * class Foo extends React.Component {
         *   static contextType = Ctx
         *   context!: React.ContextType<typeof Ctx>
         *   render () {
         *     return <>My context's value: {this.context}</>;
         *   }
         * }
         * ```
         *
         * @see https://reactjs.org/docs/context.html#classcontexttype
         */
        static contextType?: Context<any> | null | undefined;

        /**
         * If using the new style context, re-declare this in your class to be the
         * `React.ContextType` of your `static contextType`.
         * Should be used with type annotation or static contextType.
         *
         * ```ts
         * static contextType = MyContext
         * // For TS pre-3.7:
         * context!: React.ContextType<typeof MyContext>
         * // For TS 3.7 and above:
         * declare context: React.ContextType<typeof MyContext>
         * ```
         *
         * @see https://reactjs.org/docs/context.html
         */
        context: unknown;

        constructor(props: Readonly<P> | P);
        /**
         * @deprecated
         * @see https://reactjs.org/docs/legacy-context.html
         */
        constructor(props: P, context: any);

        // We MUST keep setState() as a unified signature because it allows proper checking of the method return type.
        // See: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/18365#issuecomment-351013257
        // Also, the ` | S` allows intellisense to not be dumbisense
        setState<K extends keyof S>(
            state: ((prevState: Readonly<S>, props: Readonly<P>) => (Pick<S, K> | S | null)) | (Pick<S, K> | S | null),
            callback?: () => void
        ): void;

        forceUpdate(callback?: () => void): void;
        render(): ReactNode;

        readonly props: Readonly<P>;
        state: Readonly<S>;
        /**
         * @deprecated
         * https://reactjs.org/docs/refs-and-the-dom.html#legacy-api-string-refs
         */
        refs: {
            [key: string]: ReactInstance
        };
    }

    class PureComponent<P = {}, S = {}, SS = any> extends Component<P, S, SS> { }

    interface ClassicComponent<P = {}, S = {}> extends Component<P, S> {
        replaceState(nextState: S, callback?: () => void): void;
        isMounted(): boolean;
        getInitialState?(): S;
    }

    interface ChildContextProvider<CC> {
        getChildContext(): CC;
    }

    //
    // Class Interfaces
    // ----------------------------------------------------------------------

    type FC<P = {}> = FunctionComponent<P>;

    interface FunctionComponent<P = {}> {
        (props: P, context?: any): ReactElement<any, any> | null;
        propTypes?: WeakValidationMap<P> | null | undefined;
        contextTypes?: ValidationMap<any> | null | undefined;
        defaultProps?: Partial<P> | null | undefined;
        displayName?: string | null | undefined;
    }

    /**
     * @deprecated - Equivalent with `React.FC`.
     */
    type VFC<P = {}> = VoidFunctionComponent<P>;

    /**
     * @deprecated - Equivalent with `React.FunctionComponent`.
     */
    interface VoidFunctionComponent<P = {}> {
        (props: P, context?: any): ReactElement<any, any> | null;
        propTypes?: WeakValidationMap<P> | null | undefined;
        contextTypes?: ValidationMap<any> | null | undefined;
        defaultProps?: Partial<P> | null | undefined;
        displayName?: string | null | undefined;
    }

    type ForwardedRef<T> = ((instance: T | null) => void) | MutableRefObject<T | null> | null;

    interface ForwardRefRenderFunction<T, P = {}> {
        (props: P, ref: ForwardedRef<T>): ReactElement | null;
        displayName?: string | null | undefined;
        // explicit rejected with `never` required due to
        // https://github.com/microsoft/TypeScript/issues/36826
        /**
         * defaultProps are not supported on render functions
         */
        defaultProps?: never | null | undefined;
        /**
         * propTypes are not supported on render functions
         */
        propTypes?: never | null | undefined;
    }

    interface ComponentClass<P = {}, S = ComponentState> extends StaticLifecycle<P, S> {
        new (props: P, context?: any): Component<P, S>;
        propTypes?: WeakValidationMap<P> | null | undefined;
        contextType?: Context<any> | null | undefined;
        contextTypes?: ValidationMap<any> | null | undefined;
        childContextTypes?: ValidationMap<any> | null | undefined;
        defaultProps?: Partial<P> | null | undefined;
        displayName?: string | null | undefined;
    }

    interface ClassicComponentClass<P = {}> extends ComponentClass<P> {
        new (props: P, context?: any): ClassicComponent<P, ComponentState>;
        getDefaultProps?(): P;
    }

    /**
     * We use an intersection type to infer multiple type parameters from
     * a single argument, which is useful for many top-level API defs.
     * See https://github.com/Microsoft/TypeScript/issues/7234 for more info.
     */
    type ClassType<P, T extends Component<P, ComponentState>, C extends ComponentClass<P>> =
        C &
        (new (props: P, context?: any) => T);

    //
    // Component Specs and Lifecycle
    // ----------------------------------------------------------------------

    // This should actually be something like `Lifecycle<P, S> | DeprecatedLifecycle<P, S>`,
    // as React will _not_ call the deprecated lifecycle methods if any of the new lifecycle
    // methods are present.
    interface ComponentLifecycle<P, S, SS = any> extends NewLifecycle<P, S, SS>, DeprecatedLifecycle<P, S> {
        /**
         * Called immediately after a component is mounted. Setting state here will trigger re-rendering.
         */
        componentDidMount?(): void;
        /**
         * Called to determine whether the change in props and state should trigger a re-render.
         *
         * `Component` always returns true.
         * `PureComponent` implements a shallow comparison on props and state and returns true if any
         * props or states have changed.
         *
         * If false is returned, `Component#render`, `componentWillUpdate`
         * and `componentDidUpdate` will not be called.
         */
        shouldComponentUpdate?(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean;
        /**
         * Called immediately before a component is destroyed. Perform any necessary cleanup in this method, such as
         * cancelled network requests, or cleaning up any DOM elements created in `componentDidMount`.
         */
        componentWillUnmount?(): void;
        /**
         * Catches exceptions generated in descendant components. Unhandled exceptions will cause
         * the entire component tree to unmount.
         */
        componentDidCatch?(error: Error, errorInfo: ErrorInfo): void;
    }

    // Unfortunately, we have no way of declaring that the component constructor must implement this
    interface StaticLifecycle<P, S> {
        getDerivedStateFromProps?: GetDerivedStateFromProps<P, S> | null | undefined;
        getDerivedStateFromError?: GetDerivedStateFromError<P, S> | null | undefined;
    }

    type GetDerivedStateFromProps<P, S> =
        /**
         * Returns an update to a component's state based on its new props and old state.
         *
         * Note: its presence prevents any of the deprecated lifecycle methods from being invoked
         */
        (nextProps: Readonly<P>, prevState: S) => Partial<S> | null;

    type GetDerivedStateFromError<P, S> =
        /**
         * This lifecycle is invoked after an error has been thrown by a descendant component.
         * It receives the error that was thrown as a parameter and should return a value to update state.
         *
         * Note: its presence prevents any of the deprecated lifecycle methods from being invoked
         */
        (error: any) => Partial<S> | null;

    // This should be "infer SS" but can't use it yet
    interface NewLifecycle<P, S, SS> {
        /**
         * Runs before React applies the result of `render` to the document, and
         * returns an object to be given to componentDidUpdate. Useful for saving
         * things such as scroll position before `render` causes changes to it.
         *
         * Note: the presence of getSnapshotBeforeUpdate prevents any of the deprecated
         * lifecycle events from running.
         */
        getSnapshotBeforeUpdate?(prevProps: Readonly<P>, prevState: Readonly<S>): SS | null;
        /**
         * Called immediately after updating occurs. Not called for the initial render.
         *
         * The snapshot is only present if getSnapshotBeforeUpdate is present and returns non-null.
         */
        componentDidUpdate?(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot?: SS): void;
    }

    interface DeprecatedLifecycle<P, S> {
        /**
         * Called immediately before mounting occurs, and before `Component#render`.
         * Avoid introducing any side-effects or subscriptions in this method.
         *
         * Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps
         * prevents this from being invoked.
         *
         * @deprecated 16.3, use componentDidMount or the constructor instead; will stop working in React 17
         * @see https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#initializing-state
         * @see https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path
         */
        componentWillMount?(): void;
        /**
         * Called immediately before mounting occurs, and before `Component#render`.
         * Avoid introducing any side-effects or subscriptions in this method.
         *
         * This method will not stop working in React 17.
         *
         * Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps
         * prevents this from being invoked.
         *
         * @deprecated 16.3, use componentDidMount or the constructor instead
         * @see https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#initializing-state
         * @see https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path
         */
        UNSAFE_componentWillMount?(): void;
        /**
         * Called when the component may be receiving new props.
         * React may call this even if props have not changed, so be sure to compare new and existing
         * props if you only want to handle changes.
         *
         * Calling `Component#setState` generally does not trigger this method.
         *
         * Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps
         * prevents this from being invoked.
         *
         * @deprecated 16.3, use static getDerivedStateFromProps instead; will stop working in React 17
         * @see https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props
         * @see https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path
         */
        componentWillReceiveProps?(nextProps: Readonly<P>, nextContext: any): void;
        /**
         * Called when the component may be receiving new props.
         * React may call this even if props have not changed, so be sure to compare new and existing
         * props if you only want to handle changes.
         *
         * Calling `Component#setState` generally does not trigger this method.
         *
         * This method will not stop working in React 17.
         *
         * Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps
         * prevents this from being invoked.
         *
         * @deprecated 16.3, use static getDerivedStateFromProps instead
         * @see https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props
         * @see https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path
         */
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<P>, nextContext: any): void;
        /**
         * Called immediately before rendering when new props or state is received. Not called for the initial render.
         *
         * Note: You cannot call `Component#setState` here.
         *
         * Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps
         * prevents this from being invoked.
         *
         * @deprecated 16.3, use getSnapshotBeforeUpdate instead; will stop working in React 17
         * @see https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#reading-dom-properties-before-an-update
         * @see https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path
         */
        componentWillUpdate?(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): void;
        /**
         * Called immediately before rendering when new props or state is received. Not called for the initial render.
         *
         * Note: You cannot call `Component#setState` here.
         *
         * This method will not stop working in React 17.
         *
         * Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps
         * prevents this from being invoked.
         *
         * @deprecated 16.3, use getSnapshotBeforeUpdate instead
         * @see https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#reading-dom-properties-before-an-update
         * @see https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path
         */
        UNSAFE_componentWillUpdate?(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): void;
    }

    interface Mixin<P, S> extends ComponentLifecycle<P, S> {
        mixins?: Array<Mixin<P, S>> | null | undefined;
        statics?: {
            [key: string]: any;
        } | null | undefined;

        displayName?: string | null | undefined;
        propTypes?: ValidationMap<any> | null | undefined;
        contextTypes?: ValidationMap<any> | null | undefined;
        childContextTypes?: ValidationMap<any> | null | undefined;

        getDefaultProps?(): P;
        getInitialState?(): S;
    }

    interface ComponentSpec<P, S> extends Mixin<P, S> {
        render(): ReactNode;

        [propertyName: string]: any;
    }

    function createRef<T>(): RefObject<T>;

    // will show `ForwardRef(${Component.displayName || Component.name})` in devtools by default,
    // but can be given its own specific name
    interface ForwardRefExoticComponent<P> extends NamedExoticComponent<P> {
        defaultProps?: Partial<P> | null | undefined;
        propTypes?: WeakValidationMap<P> | null | undefined;
    }

    function forwardRef<T, P = {}>(render: ForwardRefRenderFunction<T, P>): ForwardRefExoticComponent<PropsWithoutRef<P> & RefAttributes<T>>;

    /** Ensures that the props do not include ref at all */
    type PropsWithoutRef<P> =
        // Pick would not be sufficient for this. We'd like to avoid unnecessary mapping and need a distributive conditional to support unions.
        // see: https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types
        // https://github.com/Microsoft/TypeScript/issues/28339
        P extends any ? ('ref' extends keyof P ? Pick<P, Exclude<keyof P, 'ref'>> : P) : P;
    /** Ensures that the props do not include string ref, which cannot be forwarded */
    type PropsWithRef<P> =
        // Just "P extends { ref?: infer R }" looks sufficient, but R will infer as {} if P is {}.
        'ref' extends keyof P
            ? P extends { ref?: infer R | null | undefined }
                ? string extends R
                    ? PropsWithoutRef<P> & { ref?: Exclude<R, string> | null | undefined }
                    : P
                : P
            : P;

    type PropsWithChildren<P = unknown> = P & { children?: ReactNode | null | undefined };

    /**
     * NOTE: prefer ComponentPropsWithRef, if the ref is forwarded,
     * or ComponentPropsWithoutRef when refs are not supported.
     */
    type ComponentProps<T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>> =
        T extends JSXElementConstructor<infer P>
            ? P
            : T extends keyof JSX.IntrinsicElements
                ? JSX.IntrinsicElements[T]
                : {};
    type ComponentPropsWithRef<T extends ElementType> =
        T extends (new (props: infer P) => Component<any, any>)
            ? PropsWithoutRef<P> & RefAttributes<InstanceType<T>>
            : PropsWithRef<ComponentProps<T>>;
    type ComponentPropsWithoutRef<T extends ElementType> =
        PropsWithoutRef<ComponentProps<T>>;

    type ComponentRef<T extends ElementType> = T extends NamedExoticComponent<
        ComponentPropsWithoutRef<T> & RefAttributes<infer Method>
    >
        ? Method
        : ComponentPropsWithRef<T> extends RefAttributes<infer Method>
            ? Method
            : never;

    // will show `Memo(${Component.displayName || Component.name})` in devtools by default,
    // but can be given its own specific name
    type MemoExoticComponent<T extends ComponentType<any>> = NamedExoticComponent<ComponentPropsWithRef<T>> & {
        readonly type: T;
    };

    function memo<P extends object>(
        Component: FunctionComponent<P>,
        propsAreEqual?: (prevProps: Readonly<P>, nextProps: Readonly<P>) => boolean
    ): NamedExoticComponent<P>;
    function memo<T extends ComponentType<any>>(
        Component: T,
        propsAreEqual?: (prevProps: Readonly<ComponentProps<T>>, nextProps: Readonly<ComponentProps<T>>) => boolean
    ): MemoExoticComponent<T>;

    type LazyExoticComponent<T extends ComponentType<any>> = ExoticComponent<ComponentPropsWithRef<T>> & {
        readonly _result: T;
    };

    function lazy<T extends ComponentType<any>>(
        factory: () => Promise<{ default: T }>
    ): LazyExoticComponent<T>;

    //
    // React Hooks
    // ----------------------------------------------------------------------

    // based on the code in https://github.com/facebook/react/pull/13968

    // Unlike the class component setState, the updates are not allowed to be partial
    type SetStateAction<S> = S | ((prevState: S) => S);
    // this technically does accept a second argument, but it's already under a deprecation warning
    // and it's not even released so probably better to not define it.
    type Dispatch<A> = (value: A) => void;
    // Since action _can_ be undefined, dispatch may be called without any parameters.
    type DispatchWithoutAction = () => void;
    // Unlike redux, the actions _can_ be anything
    type Reducer<S, A> = (prevState: S, action: A) => S;
    // If useReducer accepts a reducer without action, dispatch may be called without any parameters.
    type ReducerWithoutAction<S> = (prevState: S) => S;
    // types used to try and prevent the compiler from reducing S
    // to a supertype common with the second argument to useReducer()
    type ReducerState<R extends Reducer<any, any>> = R extends Reducer<infer S, any> ? S : never;
    type ReducerAction<R extends Reducer<any, any>> = R extends Reducer<any, infer A> ? A : never;
    // The identity check is done with the SameValue algorithm (Object.is), which is stricter than ===
    type ReducerStateWithoutAction<R extends ReducerWithoutAction<any>> =
        R extends ReducerWithoutAction<infer S> ? S : never;
    type DependencyList = ReadonlyArray<unknown>;

    // NOTE: callbacks are _only_ allowed to return either void, or a destructor.
    type EffectCallback = () => (void | Destructor);

    interface MutableRefObject<T> {
        current: T;
    }

    // This will technically work if you give a Consumer<T> or Provider<T> but it's deprecated and warns
    /**
     * Accepts a context object (the value returned from `React.createContext`) and returns the current
     * context value, as given by the nearest context provider for the given context.
     *
     * @version 16.8.0
     * @see https://reactjs.org/docs/hooks-reference.html#usecontext
     */
    function useContext<T>(context: Context<T>/*, (not public API) observedBits?: number|boolean */): T;
    /**
     * Returns a stateful value, and a function to update it.
     *
     * @version 16.8.0
     * @see https://reactjs.org/docs/hooks-reference.html#usestate
     */
    function useState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>];
    // convenience overload when first argument is omitted
    /**
     * Returns a stateful value, and a function to update it.
     *
     * @version 16.8.0
     * @see https://reactjs.org/docs/hooks-reference.html#usestate
     */
    function useState<S = undefined>(): [S | null | undefined, Dispatch<SetStateAction<S | null | undefined>>];
    /**
     * An alternative to `useState`.
     *
     * `useReducer` is usually preferable to `useState` when you have complex state logic that involves
     * multiple sub-values. It also lets you optimize performance for components that trigger deep
     * updates because you can pass `dispatch` down instead of callbacks.
     *
     * @version 16.8.0
     * @see https://reactjs.org/docs/hooks-reference.html#usereducer
     */
    // overload where dispatch could accept 0 arguments.
    function useReducer<R extends ReducerWithoutAction<any>, I>(
        reducer: R,
        initializerArg: I,
        initializer: (arg: I) => ReducerStateWithoutAction<R>
    ): [ReducerStateWithoutAction<R>, DispatchWithoutAction];
    /**
     * An alternative to `useState`.
     *
     * `useReducer` is usually preferable to `useState` when you have complex state logic that involves
     * multiple sub-values. It also lets you optimize performance for components that trigger deep
     * updates because you can pass `dispatch` down instead of callbacks.
     *
     * @version 16.8.0
     * @see https://reactjs.org/docs/hooks-reference.html#usereducer
     */
    // overload where dispatch could accept 0 arguments.
    function useReducer<R extends ReducerWithoutAction<any>>(
        reducer: R,
        initializerArg: ReducerStateWithoutAction<R>,
        initializer?: undefined
    ): [ReducerStateWithoutAction<R>, DispatchWithoutAction];
    /**
     * An alternative to `useState`.
     *
     * `useReducer` is usually preferable to `useState` when you have complex state logic that involves
     * multiple sub-values. It also lets you optimize performance for components that trigger deep
     * updates because you can pass `dispatch` down instead of callbacks.
     *
     * @version 16.8.0
     * @see https://reactjs.org/docs/hooks-reference.html#usereducer
     */
    // overload where "I" may be a subset of ReducerState<R>; used to provide autocompletion.
    // If "I" matches ReducerState<R> exactly then the last overload will allow initializer to be omitted.
    // the last overload effectively behaves as if the identity function (x => x) is the initializer.
    function useReducer<R extends Reducer<any, any>, I>(
        reducer: R,
        initializerArg: I & ReducerState<R>,
        initializer: (arg: I & ReducerState<R>) => ReducerState<R>
    ): [ReducerState<R>, Dispatch<ReducerAction<R>>];
    /**
     * An alternative to `useState`.
     *
     * `useReducer` is usually preferable to `useState` when you have complex state logic that involves
     * multiple sub-values. It also lets you optimize performance for components that trigger deep
     * updates because you can pass `dispatch` down instead of callbacks.
     *
     * @version 16.8.0
     * @see https://reactjs.org/docs/hooks-reference.html#usereducer
     */
    // overload for free "I"; all goes as long as initializer converts it into "ReducerState<R>".
    function useReducer<R extends Reducer<any, any>, I>(
        reducer: R,
        initializerArg: I,
        initializer: (arg: I) => ReducerState<R>
    ): [ReducerState<R>, Dispatch<ReducerAction<R>>];
    /**
     * An alternative to `useState`.
     *
     * `useReducer` is usually preferable to `useState` when you have complex state logic that involves
     * multiple sub-values. It also lets you optimize performance for components that trigger deep
     * updates because you can pass `dispatch` down instead of callbacks.
     *
     * @version 16.8.0
     * @see https://reactjs.org/docs/hooks-reference.html#usereducer
     */

    // I'm not sure if I keep this 2-ary or if I make it (2,3)-ary; it's currently (2,3)-ary.
    // The Flow types do have an overload for 3-ary invocation with undefined initializer.

    // NOTE: without the ReducerState indirection, TypeScript would reduce S to be the most common
    // supertype between the reducer's return type and the initialState (or the initializer's return type),
    // which would prevent autocompletion from ever working.

    // TODO: double-check if this weird overload logic is necessary. It is possible it's either a bug
    // in older versions, or a regression in newer versions of the typescript completion service.
    function useReducer<R extends Reducer<any, any>>(
        reducer: R,
        initialState: ReducerState<R>,
        initializer?: undefined
    ): [ReducerState<R>, Dispatch<ReducerAction<R>>];
    /**
     * `useRef` returns a mutable ref object whose `.current` property is initialized to the passed argument
     * (`initialValue`). The returned object will persist for the full lifetime of the component.
     *
     * Note that `useRef()` is useful for more than the `ref` attribute. It’s handy for keeping any mutable
     * value around similar to how you’d use instance fields in classes.
     *
     * @version 16.8.0
     * @see https://reactjs.org/docs/hooks-reference.html#useref
     */
    function useRef<T>(initialValue: T): MutableRefObject<T>;
    // convenience overload for refs given as a ref prop as they typically start with a null value
    /**
     * `useRef` returns a mutable ref object whose `.current` property is initialized to the passed argument
     * (`initialValue`). The returned object will persist for the full lifetime of the component.
     *
     * Note that `useRef()` is useful for more than the `ref` attribute. It’s handy for keeping any mutable
     * value around similar to how you’d use instance fields in classes.
     *
     * Usage note: if you need the result of useRef to be directly mutable, include `| null` in the type
     * of the generic argument.
     *
     * @version 16.8.0
     * @see https://reactjs.org/docs/hooks-reference.html#useref
     */
    function useRef<T>(initialValue: T|null): RefObject<T>;
    // convenience overload for potentially undefined initialValue / call with 0 arguments
    // has a default to stop it from defaulting to {} instead
    /**
     * `useRef` returns a mutable ref object whose `.current` property is initialized to the passed argument
     * (`initialValue`). The returned object will persist for the full lifetime of the component.
     *
     * Note that `useRef()` is useful for more than the `ref` attribute. It’s handy for keeping any mutable
     * value around similar to how you’d use instance fields in classes.
     *
     * @version 16.8.0
     * @see https://reactjs.org/docs/hooks-reference.html#useref
     */
    function useRef<T = undefined>(): MutableRefObject<T | null | undefined>;
    /**
     * The signature is identical to `useEffect`, but it fires synchronously after all DOM mutations.
     * Use this to read layout from the DOM and synchronously re-render. Updates scheduled inside
     * `useLayoutEffect` will be flushed synchronously, before the browser has a chance to paint.
     *
     * Prefer the standard `useEffect` when possible to avoid blocking visual updates.
     *
     * If you’re migrating code from a class component, `useLayoutEffect` fires in the same phase as
     * `componentDidMount` and `componentDidUpdate`.
     *
     * @version 16.8.0
     * @see https://reactjs.org/docs/hooks-reference.html#uselayouteffect
     */
    function useLayoutEffect(effect: EffectCallback, deps?: DependencyList): void;
    /**
     * Accepts a function that contains imperative, possibly effectful code.
     *
     * @param effect Imperative function that can return a cleanup function
     * @param deps If present, effect will only activate if the values in the list change.
     *
     * @version 16.8.0
     * @see https://reactjs.org/docs/hooks-reference.html#useeffect
     */
    function useEffect(effect: EffectCallback, deps?: DependencyList): void;
    // NOTE: this does not accept strings, but this will have to be fixed by removing strings from type Ref<T>
    /**
     * `useImperativeHandle` customizes the instance value that is exposed to parent components when using
     * `ref`. As always, imperative code using refs should be avoided in most cases.
     *
     * `useImperativeHandle` should be used with `React.forwardRef`.
     *
     * @version 16.8.0
     * @see https://reactjs.org/docs/hooks-reference.html#useimperativehandle
     */
    function useImperativeHandle<T, R extends T>(ref: Ref<T>|undefined, init: () => R, deps?: DependencyList): void;
    // I made 'inputs' required here and in useMemo as there's no point to memoizing without the memoization key
    // useCallback(X) is identical to just using X, useMemo(() => Y) is identical to just using Y.
    /**
     * `useCallback` will return a memoized version of the callback that only changes if one of the `inputs`
     * has changed.
     *
     * @version 16.8.0
     * @see https://reactjs.org/docs/hooks-reference.html#usecallback
     */
    // A specific function type would not trigger implicit any.
    // See https://github.com/DefinitelyTyped/DefinitelyTyped/issues/52873#issuecomment-845806435 for a comparison between `Function` and more specific types.
    // tslint:disable-next-line ban-types
    function useCallback<T extends Function>(callback: T, deps: DependencyList): T;
    /**
     * `useMemo` will only recompute the memoized value when one of the `deps` has changed.
     *
     * @version 16.8.0
     * @see https://reactjs.org/docs/hooks-reference.html#usememo
     */
    // allow undefined, but don't make it optional as that is very likely a mistake
    function useMemo<T>(factory: () => T, deps: DependencyList | null | undefined): T;
    /**
     * `useDebugValue` can be used to display a label for custom hooks in React DevTools.
     *
     * NOTE: We don’t recommend adding debug values to every custom hook.
     * It’s most valuable for custom hooks that are part of shared libraries.
     *
     * @version 16.8.0
     * @see https://reactjs.org/docs/hooks-reference.html#usedebugvalue
     */
    // the name of the custom hook is itself derived from the function name at runtime:
    // it's just the function name without the "use" prefix.
    function useDebugValue<T>(value: T, format?: (value: T) => any): void;

    // must be synchronous
    export type TransitionFunction = () => VoidOrUndefinedOnly;
    // strange definition to allow vscode to show documentation on the invocation
    export interface TransitionStartFunction {
        /**
         * State updates caused inside the callback are allowed to be deferred.
         *
         * **If some state update causes a component to suspend, that state update should be wrapped in a transition.**
         *
         * @param callback A _synchronous_ function which causes state updates that can be deferred.
         */
        (callback: TransitionFunction): void;
    }

    /**
     * Returns a deferred version of the value that may “lag behind” it.
     *
     * This is commonly used to keep the interface responsive when you have something that renders immediately
     * based on user input and something that needs to wait for a data fetch.
     *
     * A good example of this is a text input.
     *
     * @param value The value that is going to be deferred
     *
     * @see https://reactjs.org/docs/concurrent-mode-reference.html#usedeferredvalue
     */
    export function useDeferredValue<T>(value: T): T;

    /**
     * Allows components to avoid undesirable loading states by waiting for content to load
     * before transitioning to the next screen. It also allows components to defer slower,
     * data fetching updates until subsequent renders so that more crucial updates can be
     * rendered immediately.
     *
     * The `useTransition` hook returns two values in an array.
     *
     * The first is a boolean, React’s way of informing us whether we’re waiting for the transition to finish.
     * The second is a function that takes a callback. We can use it to tell React which state we want to defer.
     *
     * **If some state update causes a component to suspend, that state update should be wrapped in a transition.**`
     *
     * @see https://reactjs.org/docs/concurrent-mode-reference.html#usetransition
     */
    export function useTransition(): [boolean, TransitionStartFunction];

    /**
     * Similar to `useTransition` but allows uses where hooks are not available.
     *
     * @param callback A _synchronous_ function which causes state updates that can be deferred.
     */
    export function startTransition(scope: TransitionFunction): void;

    export function useId(): string;

    /**
     * @param effect Imperative function that can return a cleanup function
     * @param deps If present, effect will only activate if the values in the list change.
     *
     * @see https://github.com/facebook/react/pull/21913
     */
     export function useInsertionEffect(effect: EffectCallback, deps?: DependencyList): void;

    /**
     * @param subscribe
     * @param getSnapshot
     *
     * @see https://github.com/reactwg/react-18/discussions/86
     */
    // keep in sync with `useSyncExternalStore` from `use-sync-external-store`
    export function useSyncExternalStore<Snapshot>(
        subscribe: (onStoreChange: () => void) => () => void,
        getSnapshot: () => Snapshot,
        getServerSnapshot?: () => Snapshot,
    ): Snapshot;

    //
    // Event System
    // ----------------------------------------------------------------------
    // TODO: change any to unknown when moving to TS v3
    interface BaseSyntheticEvent<E = object, C = any, T = any> {
        nativeEvent: E;
        currentTarget: C;
        target: T;
        bubbles: boolean;
        cancelable: boolean;
        defaultPrevented: boolean;
        eventPhase: number;
        isTrusted: boolean;
        preventDefault(): void;
        isDefaultPrevented(): boolean;
        stopPropagation(): void;
        isPropagationStopped(): boolean;
        persist(): void;
        timeStamp: number;
        type: string;
    }

    /**
     * currentTarget - a reference to the element on which the event listener is registered.
     *
     * target - a reference to the element from which the event was originally dispatched.
     * This might be a child element to the element on which the event listener is registered.
     * If you thought this should be `EventTarget & T`, see https://github.com/DefinitelyTyped/DefinitelyTyped/issues/11508#issuecomment-256045682
     */
    interface SyntheticEvent<T = Element, E = Event> extends BaseSyntheticEvent<E, EventTarget & T, EventTarget> {}

    interface ClipboardEvent<T = Element> extends SyntheticEvent<T, NativeClipboardEvent> {
        clipboardData: DataTransfer;
    }

    interface CompositionEvent<T = Element> extends SyntheticEvent<T, NativeCompositionEvent> {
        data: string;
    }

    interface DragEvent<T = Element> extends MouseEvent<T, NativeDragEvent> {
        dataTransfer: DataTransfer;
    }

    interface PointerEvent<T = Element> extends MouseEvent<T, NativePointerEvent> {
        pointerId: number;
        pressure: number;
        tangentialPressure: number;
        tiltX: number;
        tiltY: number;
        twist: number;
        width: number;
        height: number;
        pointerType: 'mouse' | 'pen' | 'touch';
        isPrimary: boolean;
    }

    interface FocusEvent<Target = Element, RelatedTarget = Element> extends SyntheticEvent<Target, NativeFocusEvent> {
        relatedTarget: (EventTarget & RelatedTarget) | null;
        target: EventTarget & Target;
    }

    interface FormEvent<T = Element> extends SyntheticEvent<T> {
    }

    interface InvalidEvent<T = Element> extends SyntheticEvent<T> {
        target: EventTarget & T;
    }

    interface ChangeEvent<T = Element> extends SyntheticEvent<T> {
        target: EventTarget & T;
    }

    interface KeyboardEvent<T = Element> extends UIEvent<T, NativeKeyboardEvent> {
        altKey: boolean;
        /** @deprecated */
        charCode: number;
        ctrlKey: boolean;
        code: string;
        /**
         * See [DOM Level 3 Events spec](https://www.w3.org/TR/uievents-key/#keys-modifier). for a list of valid (case-sensitive) arguments to this method.
         */
        getModifierState(key: string): boolean;
        /**
         * See the [DOM Level 3 Events spec](https://www.w3.org/TR/uievents-key/#named-key-attribute-values). for possible values
         */
        key: string;
        /** @deprecated */
        keyCode: number;
        locale: string;
        location: number;
        metaKey: boolean;
        repeat: boolean;
        shiftKey: boolean;
        /** @deprecated */
        which: number;
    }

    interface MouseEvent<T = Element, E = NativeMouseEvent> extends UIEvent<T, E> {
        altKey: boolean;
        button: number;
        buttons: number;
        clientX: number;
        clientY: number;
        ctrlKey: boolean;
        /**
         * See [DOM Level 3 Events spec](https://www.w3.org/TR/uievents-key/#keys-modifier). for a list of valid (case-sensitive) arguments to this method.
         */
        getModifierState(key: string): boolean;
        metaKey: boolean;
        movementX: number;
        movementY: number;
        pageX: number;
        pageY: number;
        relatedTarget: EventTarget | null;
        screenX: number;
        screenY: number;
        shiftKey: boolean;
    }

    interface TouchEvent<T = Element> extends UIEvent<T, NativeTouchEvent> {
        altKey: boolean;
        changedTouches: TouchList;
        ctrlKey: boolean;
        /**
         * See [DOM Level 3 Events spec](https://www.w3.org/TR/uievents-key/#keys-modifier). for a list of valid (case-sensitive) arguments to this method.
         */
        getModifierState(key: string): boolean;
        metaKey: boolean;
        shiftKey: boolean;
        targetTouches: TouchList;
        touches: TouchList;
    }

    interface UIEvent<T = Element, E = NativeUIEvent> extends SyntheticEvent<T, E> {
        detail: number;
        view: AbstractView;
    }

    interface WheelEvent<T = Element> extends MouseEvent<T, NativeWheelEvent> {
        deltaMode: number;
        deltaX: number;
        deltaY: number;
        deltaZ: number;
    }

    interface AnimationEvent<T = Element> extends SyntheticEvent<T, NativeAnimationEvent> {
        animationName: string;
        elapsedTime: number;
        pseudoElement: string;
    }

    interface TransitionEvent<T = Element> extends SyntheticEvent<T, NativeTransitionEvent> {
        elapsedTime: number;
        propertyName: string;
        pseudoElement: string;
    }

    //
    // Event Handler Types
    // ----------------------------------------------------------------------

    type EventHandler<E extends SyntheticEvent<any>> = { bivarianceHack(event: E): void }["bivarianceHack"];

    type ReactEventHandler<T = Element> = EventHandler<SyntheticEvent<T>>;

    type ClipboardEventHandler<T = Element> = EventHandler<ClipboardEvent<T>>;
    type CompositionEventHandler<T = Element> = EventHandler<CompositionEvent<T>>;
    type DragEventHandler<T = Element> = EventHandler<DragEvent<T>>;
    type FocusEventHandler<T = Element> = EventHandler<FocusEvent<T>>;
    type FormEventHandler<T = Element> = EventHandler<FormEvent<T>>;
    type ChangeEventHandler<T = Element> = EventHandler<ChangeEvent<T>>;
    type KeyboardEventHandler<T = Element> = EventHandler<KeyboardEvent<T>>;
    type MouseEventHandler<T = Element> = EventHandler<MouseEvent<T>>;
    type TouchEventHandler<T = Element> = EventHandler<TouchEvent<T>>;
    type PointerEventHandler<T = Element> = EventHandler<PointerEvent<T>>;
    type UIEventHandler<T = Element> = EventHandler<UIEvent<T>>;
    type WheelEventHandler<T = Element> = EventHandler<WheelEvent<T>>;
    type AnimationEventHandler<T = Element> = EventHandler<AnimationEvent<T>>;
    type TransitionEventHandler<T = Element> = EventHandler<TransitionEvent<T>>;

    //
    // Props / DOM Attributes
    // ----------------------------------------------------------------------

    interface HTMLProps<T> extends AllHTMLAttributes<T>, ClassAttributes<T> {
    }

    type DetailedHTMLProps<E extends HTMLAttributes<T>, T> = ClassAttributes<T> & E;

    interface SVGProps<T> extends SVGAttributes<T>, ClassAttributes<T> {
    }

    interface DOMAttributes<T> {
        children?: ReactNode | null | undefined;
        dangerouslySetInnerHTML?: {
            __html: string;
        } | null | undefined;

        // Clipboard Events
        onCopy?: ClipboardEventHandler<T> | null | undefined;
        onCopyCapture?: ClipboardEventHandler<T> | null | undefined;
        onCut?: ClipboardEventHandler<T> | null | undefined;
        onCutCapture?: ClipboardEventHandler<T> | null | undefined;
        onPaste?: ClipboardEventHandler<T> | null | undefined;
        onPasteCapture?: ClipboardEventHandler<T> | null | undefined;

        // Composition Events
        onCompositionEnd?: CompositionEventHandler<T> | null | undefined;
        onCompositionEndCapture?: CompositionEventHandler<T> | null | undefined;
        onCompositionStart?: CompositionEventHandler<T> | null | undefined;
        onCompositionStartCapture?: CompositionEventHandler<T> | null | undefined;
        onCompositionUpdate?: CompositionEventHandler<T> | null | undefined;
        onCompositionUpdateCapture?: CompositionEventHandler<T> | null | undefined;

        // Focus Events
        onFocus?: FocusEventHandler<T> | null | undefined;
        onFocusCapture?: FocusEventHandler<T> | null | undefined;
        onBlur?: FocusEventHandler<T> | null | undefined;
        onBlurCapture?: FocusEventHandler<T> | null | undefined;

        // Form Events
        onChange?: FormEventHandler<T> | null | undefined;
        onChangeCapture?: FormEventHandler<T> | null | undefined;
        onBeforeInput?: FormEventHandler<T> | null | undefined;
        onBeforeInputCapture?: FormEventHandler<T> | null | undefined;
        onInput?: FormEventHandler<T> | null | undefined;
        onInputCapture?: FormEventHandler<T> | null | undefined;
        onReset?: FormEventHandler<T> | null | undefined;
        onResetCapture?: FormEventHandler<T> | null | undefined;
        onSubmit?: FormEventHandler<T> | null | undefined;
        onSubmitCapture?: FormEventHandler<T> | null | undefined;
        onInvalid?: FormEventHandler<T> | null | undefined;
        onInvalidCapture?: FormEventHandler<T> | null | undefined;

        // Image Events
        onLoad?: ReactEventHandler<T> | null | undefined;
        onLoadCapture?: ReactEventHandler<T> | null | undefined;
        onError?: ReactEventHandler<T> | null | undefined; // also a Media Event
        onErrorCapture?: ReactEventHandler<T> | null | undefined; // also a Media Event

        // Keyboard Events
        onKeyDown?: KeyboardEventHandler<T> | null | undefined;
        onKeyDownCapture?: KeyboardEventHandler<T> | null | undefined;
        /** @deprecated */
        onKeyPress?: KeyboardEventHandler<T> | null | undefined;
        /** @deprecated */
        onKeyPressCapture?: KeyboardEventHandler<T> | null | undefined;
        onKeyUp?: KeyboardEventHandler<T> | null | undefined;
        onKeyUpCapture?: KeyboardEventHandler<T> | null | undefined;

        // Media Events
        onAbort?: ReactEventHandler<T> | null | undefined;
        onAbortCapture?: ReactEventHandler<T> | null | undefined;
        onCanPlay?: ReactEventHandler<T> | null | undefined;
        onCanPlayCapture?: ReactEventHandler<T> | null | undefined;
        onCanPlayThrough?: ReactEventHandler<T> | null | undefined;
        onCanPlayThroughCapture?: ReactEventHandler<T> | null | undefined;
        onDurationChange?: ReactEventHandler<T> | null | undefined;
        onDurationChangeCapture?: ReactEventHandler<T> | null | undefined;
        onEmptied?: ReactEventHandler<T> | null | undefined;
        onEmptiedCapture?: ReactEventHandler<T> | null | undefined;
        onEncrypted?: ReactEventHandler<T> | null | undefined;
        onEncryptedCapture?: ReactEventHandler<T> | null | undefined;
        onEnded?: ReactEventHandler<T> | null | undefined;
        onEndedCapture?: ReactEventHandler<T> | null | undefined;
        onLoadedData?: ReactEventHandler<T> | null | undefined;
        onLoadedDataCapture?: ReactEventHandler<T> | null | undefined;
        onLoadedMetadata?: ReactEventHandler<T> | null | undefined;
        onLoadedMetadataCapture?: ReactEventHandler<T> | null | undefined;
        onLoadStart?: ReactEventHandler<T> | null | undefined;
        onLoadStartCapture?: ReactEventHandler<T> | null | undefined;
        onPause?: ReactEventHandler<T> | null | undefined;
        onPauseCapture?: ReactEventHandler<T> | null | undefined;
        onPlay?: ReactEventHandler<T> | null | undefined;
        onPlayCapture?: ReactEventHandler<T> | null | undefined;
        onPlaying?: ReactEventHandler<T> | null | undefined;
        onPlayingCapture?: ReactEventHandler<T> | null | undefined;
        onProgress?: ReactEventHandler<T> | null | undefined;
        onProgressCapture?: ReactEventHandler<T> | null | undefined;
        onRateChange?: ReactEventHandler<T> | null | undefined;
        onRateChangeCapture?: ReactEventHandler<T> | null | undefined;
        onSeeked?: ReactEventHandler<T> | null | undefined;
        onSeekedCapture?: ReactEventHandler<T> | null | undefined;
        onSeeking?: ReactEventHandler<T> | null | undefined;
        onSeekingCapture?: ReactEventHandler<T> | null | undefined;
        onStalled?: ReactEventHandler<T> | null | undefined;
        onStalledCapture?: ReactEventHandler<T> | null | undefined;
        onSuspend?: ReactEventHandler<T> | null | undefined;
        onSuspendCapture?: ReactEventHandler<T> | null | undefined;
        onTimeUpdate?: ReactEventHandler<T> | null | undefined;
        onTimeUpdateCapture?: ReactEventHandler<T> | null | undefined;
        onVolumeChange?: ReactEventHandler<T> | null | undefined;
        onVolumeChangeCapture?: ReactEventHandler<T> | null | undefined;
        onWaiting?: ReactEventHandler<T> | null | undefined;
        onWaitingCapture?: ReactEventHandler<T> | null | undefined;

        // MouseEvents
        onAuxClick?: MouseEventHandler<T> | null | undefined;
        onAuxClickCapture?: MouseEventHandler<T> | null | undefined;
        onClick?: MouseEventHandler<T> | null | undefined;
        onClickCapture?: MouseEventHandler<T> | null | undefined;
        onContextMenu?: MouseEventHandler<T> | null | undefined;
        onContextMenuCapture?: MouseEventHandler<T> | null | undefined;
        onDoubleClick?: MouseEventHandler<T> | null | undefined;
        onDoubleClickCapture?: MouseEventHandler<T> | null | undefined;
        onDrag?: DragEventHandler<T> | null | undefined;
        onDragCapture?: DragEventHandler<T> | null | undefined;
        onDragEnd?: DragEventHandler<T> | null | undefined;
        onDragEndCapture?: DragEventHandler<T> | null | undefined;
        onDragEnter?: DragEventHandler<T> | null | undefined;
        onDragEnterCapture?: DragEventHandler<T> | null | undefined;
        onDragExit?: DragEventHandler<T> | null | undefined;
        onDragExitCapture?: DragEventHandler<T> | null | undefined;
        onDragLeave?: DragEventHandler<T> | null | undefined;
        onDragLeaveCapture?: DragEventHandler<T> | null | undefined;
        onDragOver?: DragEventHandler<T> | null | undefined;
        onDragOverCapture?: DragEventHandler<T> | null | undefined;
        onDragStart?: DragEventHandler<T> | null | undefined;
        onDragStartCapture?: DragEventHandler<T> | null | undefined;
        onDrop?: DragEventHandler<T> | null | undefined;
        onDropCapture?: DragEventHandler<T> | null | undefined;
        onMouseDown?: MouseEventHandler<T> | null | undefined;
        onMouseDownCapture?: MouseEventHandler<T> | null | undefined;
        onMouseEnter?: MouseEventHandler<T> | null | undefined;
        onMouseLeave?: MouseEventHandler<T> | null | undefined;
        onMouseMove?: MouseEventHandler<T> | null | undefined;
        onMouseMoveCapture?: MouseEventHandler<T> | null | undefined;
        onMouseOut?: MouseEventHandler<T> | null | undefined;
        onMouseOutCapture?: MouseEventHandler<T> | null | undefined;
        onMouseOver?: MouseEventHandler<T> | null | undefined;
        onMouseOverCapture?: MouseEventHandler<T> | null | undefined;
        onMouseUp?: MouseEventHandler<T> | null | undefined;
        onMouseUpCapture?: MouseEventHandler<T> | null | undefined;

        // Selection Events
        onSelect?: ReactEventHandler<T> | null | undefined;
        onSelectCapture?: ReactEventHandler<T> | null | undefined;

        // Touch Events
        onTouchCancel?: TouchEventHandler<T> | null | undefined;
        onTouchCancelCapture?: TouchEventHandler<T> | null | undefined;
        onTouchEnd?: TouchEventHandler<T> | null | undefined;
        onTouchEndCapture?: TouchEventHandler<T> | null | undefined;
        onTouchMove?: TouchEventHandler<T> | null | undefined;
        onTouchMoveCapture?: TouchEventHandler<T> | null | undefined;
        onTouchStart?: TouchEventHandler<T> | null | undefined;
        onTouchStartCapture?: TouchEventHandler<T> | null | undefined;

        // Pointer Events
        onPointerDown?: PointerEventHandler<T> | null | undefined;
        onPointerDownCapture?: PointerEventHandler<T> | null | undefined;
        onPointerMove?: PointerEventHandler<T> | null | undefined;
        onPointerMoveCapture?: PointerEventHandler<T> | null | undefined;
        onPointerUp?: PointerEventHandler<T> | null | undefined;
        onPointerUpCapture?: PointerEventHandler<T> | null | undefined;
        onPointerCancel?: PointerEventHandler<T> | null | undefined;
        onPointerCancelCapture?: PointerEventHandler<T> | null | undefined;
        onPointerEnter?: PointerEventHandler<T> | null | undefined;
        onPointerEnterCapture?: PointerEventHandler<T> | null | undefined;
        onPointerLeave?: PointerEventHandler<T> | null | undefined;
        onPointerLeaveCapture?: PointerEventHandler<T> | null | undefined;
        onPointerOver?: PointerEventHandler<T> | null | undefined;
        onPointerOverCapture?: PointerEventHandler<T> | null | undefined;
        onPointerOut?: PointerEventHandler<T> | null | undefined;
        onPointerOutCapture?: PointerEventHandler<T> | null | undefined;
        onGotPointerCapture?: PointerEventHandler<T> | null | undefined;
        onGotPointerCaptureCapture?: PointerEventHandler<T> | null | undefined;
        onLostPointerCapture?: PointerEventHandler<T> | null | undefined;
        onLostPointerCaptureCapture?: PointerEventHandler<T> | null | undefined;

        // UI Events
        onScroll?: UIEventHandler<T> | null | undefined;
        onScrollCapture?: UIEventHandler<T> | null | undefined;

        // Wheel Events
        onWheel?: WheelEventHandler<T> | null | undefined;
        onWheelCapture?: WheelEventHandler<T> | null | undefined;

        // Animation Events
        onAnimationStart?: AnimationEventHandler<T> | null | undefined;
        onAnimationStartCapture?: AnimationEventHandler<T> | null | undefined;
        onAnimationEnd?: AnimationEventHandler<T> | null | undefined;
        onAnimationEndCapture?: AnimationEventHandler<T> | null | undefined;
        onAnimationIteration?: AnimationEventHandler<T> | null | undefined;
        onAnimationIterationCapture?: AnimationEventHandler<T> | null | undefined;

        // Transition Events
        onTransitionEnd?: TransitionEventHandler<T> | null | undefined;
        onTransitionEndCapture?: TransitionEventHandler<T> | null | undefined;
    }

    export interface CSSProperties extends CSS.Properties<string | number> {
        /**
         * The index signature was removed to enable closed typing for style
         * using CSSType. You're able to use type assertion or module augmentation
         * to add properties or an index signature of your own.
         *
         * For examples and more information, visit:
         * https://github.com/frenic/csstype#what-should-i-do-when-i-get-type-errors
         */
    }

    // All the WAI-ARIA 1.1 attributes from https://www.w3.org/TR/wai-aria-1.1/
    interface AriaAttributes {
        /** Identifies the currently active element when DOM focus is on a composite widget, textbox, group, or application. */
        'aria-activedescendant'?: string | null | undefined;
        /** Indicates whether assistive technologies will present all, or only parts of, the changed region based on the change notifications defined by the aria-relevant attribute. */
        'aria-atomic'?: Booleanish | null | undefined;
        /**
         * Indicates whether inputting text could trigger display of one or more predictions of the user's intended value for an input and specifies how predictions would be
         * presented if they are made.
         */
        'aria-autocomplete'?: 'none' | 'inline' | 'list' | 'both' | null | undefined;
        /** Indicates an element is being modified and that assistive technologies MAY want to wait until the modifications are complete before exposing them to the user. */
        'aria-busy'?: Booleanish | null | undefined;
        /**
         * Indicates the current "checked" state of checkboxes, radio buttons, and other widgets.
         * @see aria-pressed @see aria-selected.
         */
        'aria-checked'?: boolean | 'false' | 'mixed' | 'true' | null | undefined;
        /**
         * Defines the total number of columns in a table, grid, or treegrid.
         * @see aria-colindex.
         */
        'aria-colcount'?: number | null | undefined;
        /**
         * Defines an element's column index or position with respect to the total number of columns within a table, grid, or treegrid.
         * @see aria-colcount @see aria-colspan.
         */
        'aria-colindex'?: number | null | undefined;
        /**
         * Defines the number of columns spanned by a cell or gridcell within a table, grid, or treegrid.
         * @see aria-colindex @see aria-rowspan.
         */
        'aria-colspan'?: number | null | undefined;
        /**
         * Identifies the element (or elements) whose contents or presence are controlled by the current element.
         * @see aria-owns.
         */
        'aria-controls'?: string | null | undefined;
        /** Indicates the element that represents the current item within a container or set of related elements. */
        'aria-current'?: boolean | 'false' | 'true' | 'page' | 'step' | 'location' | 'date' | 'time' | null | undefined;
        /**
         * Identifies the element (or elements) that describes the object.
         * @see aria-labelledby
         */
        'aria-describedby'?: string | null | undefined;
        /**
         * Identifies the element that provides a detailed, extended description for the object.
         * @see aria-describedby.
         */
        'aria-details'?: string | null | undefined;
        /**
         * Indicates that the element is perceivable but disabled, so it is not editable or otherwise operable.
         * @see aria-hidden @see aria-readonly.
         */
        'aria-disabled'?: Booleanish | null | undefined;
        /**
         * Indicates what functions can be performed when a dragged object is released on the drop target.
         * @deprecated in ARIA 1.1
         */
        'aria-dropeffect'?: 'none' | 'copy' | 'execute' | 'link' | 'move' | 'popup' | null | undefined;
        /**
         * Identifies the element that provides an error message for the object.
         * @see aria-invalid @see aria-describedby.
         */
        'aria-errormessage'?: string | null | undefined;
        /** Indicates whether the element, or another grouping element it controls, is currently expanded or collapsed. */
        'aria-expanded'?: Booleanish | null | undefined;
        /**
         * Identifies the next element (or elements) in an alternate reading order of content which, at the user's discretion,
         * allows assistive technology to override the general default of reading in document source order.
         */
        'aria-flowto'?: string | null | undefined;
        /**
         * Indicates an element's "grabbed" state in a drag-and-drop operation.
         * @deprecated in ARIA 1.1
         */
        'aria-grabbed'?: Booleanish | null | undefined;
        /** Indicates the availability and type of interactive popup element, such as menu or dialog, that can be triggered by an element. */
        'aria-haspopup'?: boolean | 'false' | 'true' | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog' | null | undefined;
        /**
         * Indicates whether the element is exposed to an accessibility API.
         * @see aria-disabled.
         */
        'aria-hidden'?: Booleanish | null | undefined;
        /**
         * Indicates the entered value does not conform to the format expected by the application.
         * @see aria-errormessage.
         */
        'aria-invalid'?: boolean | 'false' | 'true' | 'grammar' | 'spelling' | null | undefined;
        /** Indicates keyboard shortcuts that an author has implemented to activate or give focus to an element. */
        'aria-keyshortcuts'?: string | null | undefined;
        /**
         * Defines a string value that labels the current element.
         * @see aria-labelledby.
         */
        'aria-label'?: string | null | undefined;
        /**
         * Identifies the element (or elements) that labels the current element.
         * @see aria-describedby.
         */
        'aria-labelledby'?: string | null | undefined;
        /** Defines the hierarchical level of an element within a structure. */
        'aria-level'?: number | null | undefined;
        /** Indicates that an element will be updated, and describes the types of updates the user agents, assistive technologies, and user can expect from the live region. */
        'aria-live'?: 'off' | 'assertive' | 'polite' | null | undefined;
        /** Indicates whether an element is modal when displayed. */
        'aria-modal'?: Booleanish | null | undefined;
        /** Indicates whether a text box accepts multiple lines of input or only a single line. */
        'aria-multiline'?: Booleanish | null | undefined;
        /** Indicates that the user may select more than one item from the current selectable descendants. */
        'aria-multiselectable'?: Booleanish | null | undefined;
        /** Indicates whether the element's orientation is horizontal, vertical, or unknown/ambiguous. */
        'aria-orientation'?: 'horizontal' | 'vertical' | null | undefined;
        /**
         * Identifies an element (or elements) in order to define a visual, functional, or contextual parent/child relationship
         * between DOM elements where the DOM hierarchy cannot be used to represent the relationship.
         * @see aria-controls.
         */
        'aria-owns'?: string | null | undefined;
        /**
         * Defines a short hint (a word or short phrase) intended to aid the user with data entry when the control has no value.
         * A hint could be a sample value or a brief description of the expected format.
         */
        'aria-placeholder'?: string | null | undefined;
        /**
         * Defines an element's number or position in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM.
         * @see aria-setsize.
         */
        'aria-posinset'?: number | null | undefined;
        /**
         * Indicates the current "pressed" state of toggle buttons.
         * @see aria-checked @see aria-selected.
         */
        'aria-pressed'?: boolean | 'false' | 'mixed' | 'true' | null | undefined;
        /**
         * Indicates that the element is not editable, but is otherwise operable.
         * @see aria-disabled.
         */
        'aria-readonly'?: Booleanish | null | undefined;
        /**
         * Indicates what notifications the user agent will trigger when the accessibility tree within a live region is modified.
         * @see aria-atomic.
         */
        'aria-relevant'?: 'additions' | 'additions removals' | 'additions text' | 'all' | 'removals' | 'removals additions' | 'removals text' | 'text' | 'text additions' | 'text removals' | null | undefined;
        /** Indicates that user input is required on the element before a form may be submitted. */
        'aria-required'?: Booleanish | null | undefined;
        /** Defines a human-readable, author-localized description for the role of an element. */
        'aria-roledescription'?: string | null | undefined;
        /**
         * Defines the total number of rows in a table, grid, or treegrid.
         * @see aria-rowindex.
         */
        'aria-rowcount'?: number | null | undefined;
        /**
         * Defines an element's row index or position with respect to the total number of rows within a table, grid, or treegrid.
         * @see aria-rowcount @see aria-rowspan.
         */
        'aria-rowindex'?: number | null | undefined;
        /**
         * Defines the number of rows spanned by a cell or gridcell within a table, grid, or treegrid.
         * @see aria-rowindex @see aria-colspan.
         */
        'aria-rowspan'?: number | null | undefined;
        /**
         * Indicates the current "selected" state of various widgets.
         * @see aria-checked @see aria-pressed.
         */
        'aria-selected'?: Booleanish | null | undefined;
        /**
         * Defines the number of items in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM.
         * @see aria-posinset.
         */
        'aria-setsize'?: number | null | undefined;
        /** Indicates if items in a table or grid are sorted in ascending or descending order. */
        'aria-sort'?: 'none' | 'ascending' | 'descending' | 'other' | null | undefined;
        /** Defines the maximum allowed value for a range widget. */
        'aria-valuemax'?: number | null | undefined;
        /** Defines the minimum allowed value for a range widget. */
        'aria-valuemin'?: number | null | undefined;
        /**
         * Defines the current value for a range widget.
         * @see aria-valuetext.
         */
        'aria-valuenow'?: number | null | undefined;
        /** Defines the human readable text alternative of aria-valuenow for a range widget. */
        'aria-valuetext'?: string | null | undefined;
    }

    // All the WAI-ARIA 1.1 role attribute values from https://www.w3.org/TR/wai-aria-1.1/#role_definitions
    type AriaRole =
        | 'alert'
        | 'alertdialog'
        | 'application'
        | 'article'
        | 'banner'
        | 'button'
        | 'cell'
        | 'checkbox'
        | 'columnheader'
        | 'combobox'
        | 'complementary'
        | 'contentinfo'
        | 'definition'
        | 'dialog'
        | 'directory'
        | 'document'
        | 'feed'
        | 'figure'
        | 'form'
        | 'grid'
        | 'gridcell'
        | 'group'
        | 'heading'
        | 'img'
        | 'link'
        | 'list'
        | 'listbox'
        | 'listitem'
        | 'log'
        | 'main'
        | 'marquee'
        | 'math'
        | 'menu'
        | 'menubar'
        | 'menuitem'
        | 'menuitemcheckbox'
        | 'menuitemradio'
        | 'navigation'
        | 'none'
        | 'note'
        | 'option'
        | 'presentation'
        | 'progressbar'
        | 'radio'
        | 'radiogroup'
        | 'region'
        | 'row'
        | 'rowgroup'
        | 'rowheader'
        | 'scrollbar'
        | 'search'
        | 'searchbox'
        | 'separator'
        | 'slider'
        | 'spinbutton'
        | 'status'
        | 'switch'
        | 'tab'
        | 'table'
        | 'tablist'
        | 'tabpanel'
        | 'term'
        | 'textbox'
        | 'timer'
        | 'toolbar'
        | 'tooltip'
        | 'tree'
        | 'treegrid'
        | 'treeitem'
        | (string & {});

    interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
        // React-specific Attributes
        defaultChecked?: boolean | null | undefined;
        defaultValue?: string | number | ReadonlyArray<string> | null | undefined;
        suppressContentEditableWarning?: boolean | null | undefined;
        suppressHydrationWarning?: boolean | null | undefined;

        // Standard HTML Attributes
        accessKey?: string | null | undefined;
        className?: string | null | undefined;
        contentEditable?: Booleanish | "inherit" | null | undefined;
        contextMenu?: string | null | undefined;
        dir?: string | null | undefined;
        draggable?: Booleanish | null | undefined;
        hidden?: boolean | null | undefined;
        id?: string | null | undefined;
        lang?: string | null | undefined;
        nonce?: string | null | undefined;
        placeholder?: string | null | undefined;
        slot?: string | null | undefined;
        spellCheck?: Booleanish | null | undefined;
        style?: CSSProperties | null | undefined;
        tabIndex?: number | null | undefined;
        title?: string | null | undefined;
        translate?: 'yes' | 'no' | null | undefined;

        // Unknown
        radioGroup?: string | null | undefined; // <command>, <menuitem>

        // WAI-ARIA
        role?: AriaRole | null | undefined;

        // RDFa Attributes
        about?: string | null | undefined;
        datatype?: string | null | undefined;
        inlist?: any;
        prefix?: string | null | undefined;
        property?: string | null | undefined;
        resource?: string | null | undefined;
        typeof?: string | null | undefined;
        vocab?: string | null | undefined;

        // Non-standard Attributes
        autoCapitalize?: string | null | undefined;
        autoCorrect?: string | null | undefined;
        autoSave?: string | null | undefined;
        color?: string | null | undefined;
        itemProp?: string | null | undefined;
        itemScope?: boolean | null | undefined;
        itemType?: string | null | undefined;
        itemID?: string | null | undefined;
        itemRef?: string | null | undefined;
        results?: number | null | undefined;
        security?: string | null | undefined;
        unselectable?: 'on' | 'off' | null | undefined;

        // Living Standard
        /**
         * Hints at the type of data that might be entered by the user while editing the element or its contents
         * @see https://html.spec.whatwg.org/multipage/interaction.html#input-modalities:-the-inputmode-attribute
         */
        inputMode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search' | null | undefined;
        /**
         * Specify that a standard HTML element should behave like a defined custom built-in element
         * @see https://html.spec.whatwg.org/multipage/custom-elements.html#attr-is
         */
        is?: string | null | undefined;
    }

    interface AllHTMLAttributes<T> extends HTMLAttributes<T> {
        // Standard HTML Attributes
        accept?: string | null | undefined;
        acceptCharset?: string | null | undefined;
        action?: string | null | undefined;
        allowFullScreen?: boolean | null | undefined;
        allowTransparency?: boolean | null | undefined;
        alt?: string | null | undefined;
        as?: string | null | undefined;
        async?: boolean | null | undefined;
        autoComplete?: string | null | undefined;
        autoFocus?: boolean | null | undefined;
        autoPlay?: boolean | null | undefined;
        capture?: boolean | 'user' | 'environment' | null | undefined;
        cellPadding?: number | string | null | undefined;
        cellSpacing?: number | string | null | undefined;
        charSet?: string | null | undefined;
        challenge?: string | null | undefined;
        checked?: boolean | null | undefined;
        cite?: string | null | undefined;
        classID?: string | null | undefined;
        cols?: number | null | undefined;
        colSpan?: number | null | undefined;
        content?: string | null | undefined;
        controls?: boolean | null | undefined;
        coords?: string | null | undefined;
        crossOrigin?: string | null | undefined;
        data?: string | null | undefined;
        dateTime?: string | null | undefined;
        default?: boolean | null | undefined;
        defer?: boolean | null | undefined;
        disabled?: boolean | null | undefined;
        download?: any;
        encType?: string | null | undefined;
        form?: string | null | undefined;
        formAction?: string | null | undefined;
        formEncType?: string | null | undefined;
        formMethod?: string | null | undefined;
        formNoValidate?: boolean | null | undefined;
        formTarget?: string | null | undefined;
        frameBorder?: number | string | null | undefined;
        headers?: string | null | undefined;
        height?: number | string | null | undefined;
        high?: number | null | undefined;
        href?: string | null | undefined;
        hrefLang?: string | null | undefined;
        htmlFor?: string | null | undefined;
        httpEquiv?: string | null | undefined;
        integrity?: string | null | undefined;
        keyParams?: string | null | undefined;
        keyType?: string | null | undefined;
        kind?: string | null | undefined;
        label?: string | null | undefined;
        list?: string | null | undefined;
        loop?: boolean | null | undefined;
        low?: number | null | undefined;
        manifest?: string | null | undefined;
        marginHeight?: number | null | undefined;
        marginWidth?: number | null | undefined;
        max?: number | string | null | undefined;
        maxLength?: number | null | undefined;
        media?: string | null | undefined;
        mediaGroup?: string | null | undefined;
        method?: string | null | undefined;
        min?: number | string | null | undefined;
        minLength?: number | null | undefined;
        multiple?: boolean | null | undefined;
        muted?: boolean | null | undefined;
        name?: string | null | undefined;
        noValidate?: boolean | null | undefined;
        open?: boolean | null | undefined;
        optimum?: number | null | undefined;
        pattern?: string | null | undefined;
        placeholder?: string | null | undefined;
        playsInline?: boolean | null | undefined;
        poster?: string | null | undefined;
        preload?: string | null | undefined;
        readOnly?: boolean | null | undefined;
        rel?: string | null | undefined;
        required?: boolean | null | undefined;
        reversed?: boolean | null | undefined;
        rows?: number | null | undefined;
        rowSpan?: number | null | undefined;
        sandbox?: string | null | undefined;
        scope?: string | null | undefined;
        scoped?: boolean | null | undefined;
        scrolling?: string | null | undefined;
        seamless?: boolean | null | undefined;
        selected?: boolean | null | undefined;
        shape?: string | null | undefined;
        size?: number | null | undefined;
        sizes?: string | null | undefined;
        span?: number | null | undefined;
        src?: string | null | undefined;
        srcDoc?: string | null | undefined;
        srcLang?: string | null | undefined;
        srcSet?: string | null | undefined;
        start?: number | null | undefined;
        step?: number | string | null | undefined;
        summary?: string | null | undefined;
        target?: string | null | undefined;
        type?: string | null | undefined;
        useMap?: string | null | undefined;
        value?: string | ReadonlyArray<string> | number | null | undefined;
        width?: number | string | null | undefined;
        wmode?: string | null | undefined;
        wrap?: string | null | undefined;
    }

    type HTMLAttributeReferrerPolicy =
        | ''
        | 'no-referrer'
        | 'no-referrer-when-downgrade'
        | 'origin'
        | 'origin-when-cross-origin'
        | 'same-origin'
        | 'strict-origin'
        | 'strict-origin-when-cross-origin'
        | 'unsafe-url';

    type HTMLAttributeAnchorTarget =
        | '_self'
        | '_blank'
        | '_parent'
        | '_top'
        | (string & {});

    interface AnchorHTMLAttributes<T> extends HTMLAttributes<T> {
        download?: any;
        href?: string | null | undefined;
        hrefLang?: string | null | undefined;
        media?: string | null | undefined;
        ping?: string | null | undefined;
        rel?: string | null | undefined;
        target?: HTMLAttributeAnchorTarget | null | undefined;
        type?: string | null | undefined;
        referrerPolicy?: HTMLAttributeReferrerPolicy | null | undefined;
    }

    interface AudioHTMLAttributes<T> extends MediaHTMLAttributes<T> {}

    interface AreaHTMLAttributes<T> extends HTMLAttributes<T> {
        alt?: string | null | undefined;
        coords?: string | null | undefined;
        download?: any;
        href?: string | null | undefined;
        hrefLang?: string | null | undefined;
        media?: string | null | undefined;
        referrerPolicy?: HTMLAttributeReferrerPolicy | null | undefined;
        rel?: string | null | undefined;
        shape?: string | null | undefined;
        target?: string | null | undefined;
    }

    interface BaseHTMLAttributes<T> extends HTMLAttributes<T> {
        href?: string | null | undefined;
        target?: string | null | undefined;
    }

    interface BlockquoteHTMLAttributes<T> extends HTMLAttributes<T> {
        cite?: string | null | undefined;
    }

    interface ButtonHTMLAttributes<T> extends HTMLAttributes<T> {
        autoFocus?: boolean | null | undefined;
        disabled?: boolean | null | undefined;
        form?: string | null | undefined;
        formAction?: string | null | undefined;
        formEncType?: string | null | undefined;
        formMethod?: string | null | undefined;
        formNoValidate?: boolean | null | undefined;
        formTarget?: string | null | undefined;
        name?: string | null | undefined;
        type?: 'submit' | 'reset' | 'button' | null | undefined;
        value?: string | ReadonlyArray<string> | number | null | undefined;
    }

    interface CanvasHTMLAttributes<T> extends HTMLAttributes<T> {
        height?: number | string | null | undefined;
        width?: number | string | null | undefined;
    }

    interface ColHTMLAttributes<T> extends HTMLAttributes<T> {
        span?: number | null | undefined;
        width?: number | string | null | undefined;
    }

    interface ColgroupHTMLAttributes<T> extends HTMLAttributes<T> {
        span?: number | null | undefined;
    }

    interface DataHTMLAttributes<T> extends HTMLAttributes<T> {
        value?: string | ReadonlyArray<string> | number | null | undefined;
    }

    interface DetailsHTMLAttributes<T> extends HTMLAttributes<T> {
        open?: boolean | null | undefined;
        onToggle?: ReactEventHandler<T> | null | undefined;
    }

    interface DelHTMLAttributes<T> extends HTMLAttributes<T> {
        cite?: string | null | undefined;
        dateTime?: string | null | undefined;
    }

    interface DialogHTMLAttributes<T> extends HTMLAttributes<T> {
        onCancel?: ReactEventHandler<T> |  undefined;
        onClose?: ReactEventHandler<T> |  undefined;
        open?: boolean | null | undefined;
    }

    interface EmbedHTMLAttributes<T> extends HTMLAttributes<T> {
        height?: number | string | null | undefined;
        src?: string | null | undefined;
        type?: string | null | undefined;
        width?: number | string | null | undefined;
    }

    interface FieldsetHTMLAttributes<T> extends HTMLAttributes<T> {
        disabled?: boolean | null | undefined;
        form?: string | null | undefined;
        name?: string | null | undefined;
    }

    interface FormHTMLAttributes<T> extends HTMLAttributes<T> {
        acceptCharset?: string | null | undefined;
        action?: string | null | undefined;
        autoComplete?: string | null | undefined;
        encType?: string | null | undefined;
        method?: string | null | undefined;
        name?: string | null | undefined;
        noValidate?: boolean | null | undefined;
        target?: string | null | undefined;
        rel?: string | null | undefined;
    }

    interface HtmlHTMLAttributes<T> extends HTMLAttributes<T> {
        manifest?: string | null | undefined;
    }

    interface IframeHTMLAttributes<T> extends HTMLAttributes<T> {
        allow?: string | null | undefined;
        allowFullScreen?: boolean | null | undefined;
        allowTransparency?: boolean | null | undefined;
        /** @deprecated */
        frameBorder?: number | string | null | undefined;
        height?: number | string | null | undefined;
        loading?: "eager" | "lazy" | null | undefined;
        /** @deprecated */
        marginHeight?: number | null | undefined;
        /** @deprecated */
        marginWidth?: number | null | undefined;
        name?: string | null | undefined;
        referrerPolicy?: HTMLAttributeReferrerPolicy | null | undefined;
        sandbox?: string | null | undefined;
        /** @deprecated */
        scrolling?: string | null | undefined;
        seamless?: boolean | null | undefined;
        src?: string | null | undefined;
        srcDoc?: string | null | undefined;
        width?: number | string | null | undefined;
    }

    interface ImgHTMLAttributes<T> extends HTMLAttributes<T> {
        alt?: string | null | undefined;
        crossOrigin?: "anonymous" | "use-credentials" | "" | null | undefined;
        decoding?: "async" | "auto" | "sync" | null | undefined;
        height?: number | string | null | undefined;
        loading?: "eager" | "lazy" | null | undefined;
        referrerPolicy?: HTMLAttributeReferrerPolicy | null | undefined;
        sizes?: string | null | undefined;
        src?: string | null | undefined;
        srcSet?: string | null | undefined;
        useMap?: string | null | undefined;
        width?: number | string | null | undefined;
    }

    interface InsHTMLAttributes<T> extends HTMLAttributes<T> {
        cite?: string | null | undefined;
        dateTime?: string | null | undefined;
    }

    type HTMLInputTypeAttribute =
        | 'button'
        | 'checkbox'
        | 'color'
        | 'date'
        | 'datetime-local'
        | 'email'
        | 'file'
        | 'hidden'
        | 'image'
        | 'month'
        | 'number'
        | 'password'
        | 'radio'
        | 'range'
        | 'reset'
        | 'search'
        | 'submit'
        | 'tel'
        | 'text'
        | 'time'
        | 'url'
        | 'week'
        | (string & {});

    interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
        accept?: string | null | undefined;
        alt?: string | null | undefined;
        autoComplete?: string | null | undefined;
        autoFocus?: boolean | null | undefined;
        capture?: boolean | 'user' | 'environment' | null | undefined; // https://www.w3.org/TR/html-media-capture/#the-capture-attribute
        checked?: boolean | null | undefined;
        crossOrigin?: string | null | undefined;
        disabled?: boolean | null | undefined;
        enterKeyHint?: 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send' | null | undefined;
        form?: string | null | undefined;
        formAction?: string | null | undefined;
        formEncType?: string | null | undefined;
        formMethod?: string | null | undefined;
        formNoValidate?: boolean | null | undefined;
        formTarget?: string | null | undefined;
        height?: number | string | null | undefined;
        list?: string | null | undefined;
        max?: number | string | null | undefined;
        maxLength?: number | null | undefined;
        min?: number | string | null | undefined;
        minLength?: number | null | undefined;
        multiple?: boolean | null | undefined;
        name?: string | null | undefined;
        pattern?: string | null | undefined;
        placeholder?: string | null | undefined;
        readOnly?: boolean | null | undefined;
        required?: boolean | null | undefined;
        size?: number | null | undefined;
        src?: string | null | undefined;
        step?: number | string | null | undefined;
        type?: HTMLInputTypeAttribute | null | undefined;
        value?: string | ReadonlyArray<string> | number | null | undefined;
        width?: number | string | null | undefined;

        onChange?: ChangeEventHandler<T> | null | undefined;
    }

    interface KeygenHTMLAttributes<T> extends HTMLAttributes<T> {
        autoFocus?: boolean | null | undefined;
        challenge?: string | null | undefined;
        disabled?: boolean | null | undefined;
        form?: string | null | undefined;
        keyType?: string | null | undefined;
        keyParams?: string | null | undefined;
        name?: string | null | undefined;
    }

    interface LabelHTMLAttributes<T> extends HTMLAttributes<T> {
        form?: string | null | undefined;
        htmlFor?: string | null | undefined;
    }

    interface LiHTMLAttributes<T> extends HTMLAttributes<T> {
        value?: string | ReadonlyArray<string> | number | null | undefined;
    }

    interface LinkHTMLAttributes<T> extends HTMLAttributes<T> {
        as?: string | null | undefined;
        crossOrigin?: string | null | undefined;
        href?: string | null | undefined;
        hrefLang?: string | null | undefined;
        integrity?: string | null | undefined;
        media?: string | null | undefined;
        imageSrcSet?: string | null | undefined;
        imageSizes?: string | null | undefined;
        referrerPolicy?: HTMLAttributeReferrerPolicy | null | undefined;
        rel?: string | null | undefined;
        sizes?: string | null | undefined;
        type?: string | null | undefined;
        charSet?: string | null | undefined;
    }

    interface MapHTMLAttributes<T> extends HTMLAttributes<T> {
        name?: string | null | undefined;
    }

    interface MenuHTMLAttributes<T> extends HTMLAttributes<T> {
        type?: string | null | undefined;
    }

    interface MediaHTMLAttributes<T> extends HTMLAttributes<T> {
        autoPlay?: boolean | null | undefined;
        controls?: boolean | null | undefined;
        controlsList?: string | null | undefined;
        crossOrigin?: string | null | undefined;
        loop?: boolean | null | undefined;
        mediaGroup?: string | null | undefined;
        muted?: boolean | null | undefined;
        playsInline?: boolean | null | undefined;
        preload?: string | null | undefined;
        src?: string | null | undefined;
    }

    interface MetaHTMLAttributes<T> extends HTMLAttributes<T> {
        charSet?: string | null | undefined;
        content?: string | null | undefined;
        httpEquiv?: string | null | undefined;
        name?: string | null | undefined;
        media?: string | null | undefined;
    }

    interface MeterHTMLAttributes<T> extends HTMLAttributes<T> {
        form?: string | null | undefined;
        high?: number | null | undefined;
        low?: number | null | undefined;
        max?: number | string | null | undefined;
        min?: number | string | null | undefined;
        optimum?: number | null | undefined;
        value?: string | ReadonlyArray<string> | number | null | undefined;
    }

    interface QuoteHTMLAttributes<T> extends HTMLAttributes<T> {
        cite?: string | null | undefined;
    }

    interface ObjectHTMLAttributes<T> extends HTMLAttributes<T> {
        classID?: string | null | undefined;
        data?: string | null | undefined;
        form?: string | null | undefined;
        height?: number | string | null | undefined;
        name?: string | null | undefined;
        type?: string | null | undefined;
        useMap?: string | null | undefined;
        width?: number | string | null | undefined;
        wmode?: string | null | undefined;
    }

    interface OlHTMLAttributes<T> extends HTMLAttributes<T> {
        reversed?: boolean | null | undefined;
        start?: number | null | undefined;
        type?: '1' | 'a' | 'A' | 'i' | 'I' | null | undefined;
    }

    interface OptgroupHTMLAttributes<T> extends HTMLAttributes<T> {
        disabled?: boolean | null | undefined;
        label?: string | null | undefined;
    }

    interface OptionHTMLAttributes<T> extends HTMLAttributes<T> {
        disabled?: boolean | null | undefined;
        label?: string | null | undefined;
        selected?: boolean | null | undefined;
        value?: string | ReadonlyArray<string> | number | null | undefined;
    }

    interface OutputHTMLAttributes<T> extends HTMLAttributes<T> {
        form?: string | null | undefined;
        htmlFor?: string | null | undefined;
        name?: string | null | undefined;
    }

    interface ParamHTMLAttributes<T> extends HTMLAttributes<T> {
        name?: string | null | undefined;
        value?: string | ReadonlyArray<string> | number | null | undefined;
    }

    interface ProgressHTMLAttributes<T> extends HTMLAttributes<T> {
        max?: number | string | null | undefined;
        value?: string | ReadonlyArray<string> | number | null | undefined;
    }

    interface SlotHTMLAttributes<T> extends HTMLAttributes<T> {
        name?: string | null | undefined;
    }

    interface ScriptHTMLAttributes<T> extends HTMLAttributes<T> {
        async?: boolean | null | undefined;
        /** @deprecated */
        charSet?: string | null | undefined;
        crossOrigin?: string | null | undefined;
        defer?: boolean | null | undefined;
        integrity?: string | null | undefined;
        noModule?: boolean | null | undefined;
        referrerPolicy?: HTMLAttributeReferrerPolicy | null | undefined;
        src?: string | null | undefined;
        type?: string | null | undefined;
    }

    interface SelectHTMLAttributes<T> extends HTMLAttributes<T> {
        autoComplete?: string | null | undefined;
        autoFocus?: boolean | null | undefined;
        disabled?: boolean | null | undefined;
        form?: string | null | undefined;
        multiple?: boolean | null | undefined;
        name?: string | null | undefined;
        required?: boolean | null | undefined;
        size?: number | null | undefined;
        value?: string | ReadonlyArray<string> | number | null | undefined;
        onChange?: ChangeEventHandler<T> | null | undefined;
    }

    interface SourceHTMLAttributes<T> extends HTMLAttributes<T> {
        height?: number | string | null | undefined;
        media?: string | null | undefined;
        sizes?: string | null | undefined;
        src?: string | null | undefined;
        srcSet?: string | null | undefined;
        type?: string | null | undefined;
        width?: number | string | null | undefined;
    }

    interface StyleHTMLAttributes<T> extends HTMLAttributes<T> {
        media?: string | null | undefined;
        scoped?: boolean | null | undefined;
        type?: string | null | undefined;
    }

    interface TableHTMLAttributes<T> extends HTMLAttributes<T> {
        align?: "left" | "center" | "right" | null | undefined;
        bgcolor?: string | null | undefined;
        border?: number | null | undefined;
        cellPadding?: number | string | null | undefined;
        cellSpacing?: number | string | null | undefined;
        frame?: boolean | null | undefined;
        rules?: "none" | "groups" | "rows" | "columns" | "all" | null | undefined;
        summary?: string | null | undefined;
        width?: number | string | null | undefined;
    }

    interface TextareaHTMLAttributes<T> extends HTMLAttributes<T> {
        autoComplete?: string | null | undefined;
        autoFocus?: boolean | null | undefined;
        cols?: number | null | undefined;
        dirName?: string | null | undefined;
        disabled?: boolean | null | undefined;
        form?: string | null | undefined;
        maxLength?: number | null | undefined;
        minLength?: number | null | undefined;
        name?: string | null | undefined;
        placeholder?: string | null | undefined;
        readOnly?: boolean | null | undefined;
        required?: boolean | null | undefined;
        rows?: number | null | undefined;
        value?: string | ReadonlyArray<string> | number | null | undefined;
        wrap?: string | null | undefined;

        onChange?: ChangeEventHandler<T> | null | undefined;
    }

    interface TdHTMLAttributes<T> extends HTMLAttributes<T> {
        align?: "left" | "center" | "right" | "justify" | "char" | null | undefined;
        colSpan?: number | null | undefined;
        headers?: string | null | undefined;
        rowSpan?: number | null | undefined;
        scope?: string | null | undefined;
        abbr?: string | null | undefined;
        height?: number | string | null | undefined;
        width?: number | string | null | undefined;
        valign?: "top" | "middle" | "bottom" | "baseline" | null | undefined;
    }

    interface ThHTMLAttributes<T> extends HTMLAttributes<T> {
        align?: "left" | "center" | "right" | "justify" | "char" | null | undefined;
        colSpan?: number | null | undefined;
        headers?: string | null | undefined;
        rowSpan?: number | null | undefined;
        scope?: string | null | undefined;
        abbr?: string | null | undefined;
    }

    interface TimeHTMLAttributes<T> extends HTMLAttributes<T> {
        dateTime?: string | null | undefined;
    }

    interface TrackHTMLAttributes<T> extends HTMLAttributes<T> {
        default?: boolean | null | undefined;
        kind?: string | null | undefined;
        label?: string | null | undefined;
        src?: string | null | undefined;
        srcLang?: string | null | undefined;
    }

    interface VideoHTMLAttributes<T> extends MediaHTMLAttributes<T> {
        height?: number | string | null | undefined;
        playsInline?: boolean | null | undefined;
        poster?: string | null | undefined;
        width?: number | string | null | undefined;
        disablePictureInPicture?: boolean | null | undefined;
        disableRemotePlayback?: boolean | null | undefined;
    }

    // this list is "complete" in that it contains every SVG attribute
    // that React supports, but the types can be improved.
    // Full list here: https://facebook.github.io/react/docs/dom-elements.html
    //
    // The three broad type categories are (in order of restrictiveness):
    //   - "number | string"
    //   - "string"
    //   - union of string literals
    interface SVGAttributes<T> extends AriaAttributes, DOMAttributes<T> {
        // Attributes which also defined in HTMLAttributes
        // See comment in SVGDOMPropertyConfig.js
        className?: string | null | undefined;
        color?: string | null | undefined;
        height?: number | string | null | undefined;
        id?: string | null | undefined;
        lang?: string | null | undefined;
        max?: number | string | null | undefined;
        media?: string | null | undefined;
        method?: string | null | undefined;
        min?: number | string | null | undefined;
        name?: string | null | undefined;
        style?: CSSProperties | null | undefined;
        target?: string | null | undefined;
        type?: string | null | undefined;
        width?: number | string | null | undefined;

        // Other HTML properties supported by SVG elements in browsers
        role?: AriaRole | null | undefined;
        tabIndex?: number | null | undefined;
        crossOrigin?: "anonymous" | "use-credentials" | "" | null | undefined;

        // SVG Specific attributes
        accentHeight?: number | string | null | undefined;
        accumulate?: "none" | "sum" | null | undefined;
        additive?: "replace" | "sum" | null | undefined;
        alignmentBaseline?: "auto" | "baseline" | "before-edge" | "text-before-edge" | "middle" | "central" | "after-edge" |
        "text-after-edge" | "ideographic" | "alphabetic" | "hanging" | "mathematical" | "inherit" | null | undefined;
        allowReorder?: "no" | "yes" | null | undefined;
        alphabetic?: number | string | null | undefined;
        amplitude?: number | string | null | undefined;
        arabicForm?: "initial" | "medial" | "terminal" | "isolated" | null | undefined;
        ascent?: number | string | null | undefined;
        attributeName?: string | null | undefined;
        attributeType?: string | null | undefined;
        autoReverse?: Booleanish | null | undefined;
        azimuth?: number | string | null | undefined;
        baseFrequency?: number | string | null | undefined;
        baselineShift?: number | string | null | undefined;
        baseProfile?: number | string | null | undefined;
        bbox?: number | string | null | undefined;
        begin?: number | string | null | undefined;
        bias?: number | string | null | undefined;
        by?: number | string | null | undefined;
        calcMode?: number | string | null | undefined;
        capHeight?: number | string | null | undefined;
        clip?: number | string | null | undefined;
        clipPath?: string | null | undefined;
        clipPathUnits?: number | string | null | undefined;
        clipRule?: number | string | null | undefined;
        colorInterpolation?: number | string | null | undefined;
        colorInterpolationFilters?: "auto" | "sRGB" | "linearRGB" | "inherit" | null | undefined;
        colorProfile?: number | string | null | undefined;
        colorRendering?: number | string | null | undefined;
        contentScriptType?: number | string | null | undefined;
        contentStyleType?: number | string | null | undefined;
        cursor?: number | string | null | undefined;
        cx?: number | string | null | undefined;
        cy?: number | string | null | undefined;
        d?: string | null | undefined;
        decelerate?: number | string | null | undefined;
        descent?: number | string | null | undefined;
        diffuseConstant?: number | string | null | undefined;
        direction?: number | string | null | undefined;
        display?: number | string | null | undefined;
        divisor?: number | string | null | undefined;
        dominantBaseline?: number | string | null | undefined;
        dur?: number | string | null | undefined;
        dx?: number | string | null | undefined;
        dy?: number | string | null | undefined;
        edgeMode?: number | string | null | undefined;
        elevation?: number | string | null | undefined;
        enableBackground?: number | string | null | undefined;
        end?: number | string | null | undefined;
        exponent?: number | string | null | undefined;
        externalResourcesRequired?: Booleanish | null | undefined;
        fill?: string | null | undefined;
        fillOpacity?: number | string | null | undefined;
        fillRule?: "nonzero" | "evenodd" | "inherit" | null | undefined;
        filter?: string | null | undefined;
        filterRes?: number | string | null | undefined;
        filterUnits?: number | string | null | undefined;
        floodColor?: number | string | null | undefined;
        floodOpacity?: number | string | null | undefined;
        focusable?: Booleanish | "auto" | null | undefined;
        fontFamily?: string | null | undefined;
        fontSize?: number | string | null | undefined;
        fontSizeAdjust?: number | string | null | undefined;
        fontStretch?: number | string | null | undefined;
        fontStyle?: number | string | null | undefined;
        fontVariant?: number | string | null | undefined;
        fontWeight?: number | string | null | undefined;
        format?: number | string | null | undefined;
        fr?: number | string | null | undefined;
        from?: number | string | null | undefined;
        fx?: number | string | null | undefined;
        fy?: number | string | null | undefined;
        g1?: number | string | null | undefined;
        g2?: number | string | null | undefined;
        glyphName?: number | string | null | undefined;
        glyphOrientationHorizontal?: number | string | null | undefined;
        glyphOrientationVertical?: number | string | null | undefined;
        glyphRef?: number | string | null | undefined;
        gradientTransform?: string | null | undefined;
        gradientUnits?: string | null | undefined;
        hanging?: number | string | null | undefined;
        horizAdvX?: number | string | null | undefined;
        horizOriginX?: number | string | null | undefined;
        href?: string | null | undefined;
        ideographic?: number | string | null | undefined;
        imageRendering?: number | string | null | undefined;
        in2?: number | string | null | undefined;
        in?: string | null | undefined;
        intercept?: number | string | null | undefined;
        k1?: number | string | null | undefined;
        k2?: number | string | null | undefined;
        k3?: number | string | null | undefined;
        k4?: number | string | null | undefined;
        k?: number | string | null | undefined;
        kernelMatrix?: number | string | null | undefined;
        kernelUnitLength?: number | string | null | undefined;
        kerning?: number | string | null | undefined;
        keyPoints?: number | string | null | undefined;
        keySplines?: number | string | null | undefined;
        keyTimes?: number | string | null | undefined;
        lengthAdjust?: number | string | null | undefined;
        letterSpacing?: number | string | null | undefined;
        lightingColor?: number | string | null | undefined;
        limitingConeAngle?: number | string | null | undefined;
        local?: number | string | null | undefined;
        markerEnd?: string | null | undefined;
        markerHeight?: number | string | null | undefined;
        markerMid?: string | null | undefined;
        markerStart?: string | null | undefined;
        markerUnits?: number | string | null | undefined;
        markerWidth?: number | string | null | undefined;
        mask?: string | null | undefined;
        maskContentUnits?: number | string | null | undefined;
        maskUnits?: number | string | null | undefined;
        mathematical?: number | string | null | undefined;
        mode?: number | string | null | undefined;
        numOctaves?: number | string | null | undefined;
        offset?: number | string | null | undefined;
        opacity?: number | string | null | undefined;
        operator?: number | string | null | undefined;
        order?: number | string | null | undefined;
        orient?: number | string | null | undefined;
        orientation?: number | string | null | undefined;
        origin?: number | string | null | undefined;
        overflow?: number | string | null | undefined;
        overlinePosition?: number | string | null | undefined;
        overlineThickness?: number | string | null | undefined;
        paintOrder?: number | string | null | undefined;
        panose1?: number | string | null | undefined;
        path?: string | null | undefined;
        pathLength?: number | string | null | undefined;
        patternContentUnits?: string | null | undefined;
        patternTransform?: number | string | null | undefined;
        patternUnits?: string | null | undefined;
        pointerEvents?: number | string | null | undefined;
        points?: string | null | undefined;
        pointsAtX?: number | string | null | undefined;
        pointsAtY?: number | string | null | undefined;
        pointsAtZ?: number | string | null | undefined;
        preserveAlpha?: Booleanish | null | undefined;
        preserveAspectRatio?: string | null | undefined;
        primitiveUnits?: number | string | null | undefined;
        r?: number | string | null | undefined;
        radius?: number | string | null | undefined;
        refX?: number | string | null | undefined;
        refY?: number | string | null | undefined;
        renderingIntent?: number | string | null | undefined;
        repeatCount?: number | string | null | undefined;
        repeatDur?: number | string | null | undefined;
        requiredExtensions?: number | string | null | undefined;
        requiredFeatures?: number | string | null | undefined;
        restart?: number | string | null | undefined;
        result?: string | null | undefined;
        rotate?: number | string | null | undefined;
        rx?: number | string | null | undefined;
        ry?: number | string | null | undefined;
        scale?: number | string | null | undefined;
        seed?: number | string | null | undefined;
        shapeRendering?: number | string | null | undefined;
        slope?: number | string | null | undefined;
        spacing?: number | string | null | undefined;
        specularConstant?: number | string | null | undefined;
        specularExponent?: number | string | null | undefined;
        speed?: number | string | null | undefined;
        spreadMethod?: string | null | undefined;
        startOffset?: number | string | null | undefined;
        stdDeviation?: number | string | null | undefined;
        stemh?: number | string | null | undefined;
        stemv?: number | string | null | undefined;
        stitchTiles?: number | string | null | undefined;
        stopColor?: string | null | undefined;
        stopOpacity?: number | string | null | undefined;
        strikethroughPosition?: number | string | null | undefined;
        strikethroughThickness?: number | string | null | undefined;
        string?: number | string | null | undefined;
        stroke?: string | null | undefined;
        strokeDasharray?: string | number | null | undefined;
        strokeDashoffset?: string | number | null | undefined;
        strokeLinecap?: "butt" | "round" | "square" | "inherit" | null | undefined;
        strokeLinejoin?: "miter" | "round" | "bevel" | "inherit" | null | undefined;
        strokeMiterlimit?: number | string | null | undefined;
        strokeOpacity?: number | string | null | undefined;
        strokeWidth?: number | string | null | undefined;
        surfaceScale?: number | string | null | undefined;
        systemLanguage?: number | string | null | undefined;
        tableValues?: number | string | null | undefined;
        targetX?: number | string | null | undefined;
        targetY?: number | string | null | undefined;
        textAnchor?: string | null | undefined;
        textDecoration?: number | string | null | undefined;
        textLength?: number | string | null | undefined;
        textRendering?: number | string | null | undefined;
        to?: number | string | null | undefined;
        transform?: string | null | undefined;
        u1?: number | string | null | undefined;
        u2?: number | string | null | undefined;
        underlinePosition?: number | string | null | undefined;
        underlineThickness?: number | string | null | undefined;
        unicode?: number | string | null | undefined;
        unicodeBidi?: number | string | null | undefined;
        unicodeRange?: number | string | null | undefined;
        unitsPerEm?: number | string | null | undefined;
        vAlphabetic?: number | string | null | undefined;
        values?: string | null | undefined;
        vectorEffect?: number | string | null | undefined;
        version?: string | null | undefined;
        vertAdvY?: number | string | null | undefined;
        vertOriginX?: number | string | null | undefined;
        vertOriginY?: number | string | null | undefined;
        vHanging?: number | string | null | undefined;
        vIdeographic?: number | string | null | undefined;
        viewBox?: string | null | undefined;
        viewTarget?: number | string | null | undefined;
        visibility?: number | string | null | undefined;
        vMathematical?: number | string | null | undefined;
        widths?: number | string | null | undefined;
        wordSpacing?: number | string | null | undefined;
        writingMode?: number | string | null | undefined;
        x1?: number | string | null | undefined;
        x2?: number | string | null | undefined;
        x?: number | string | null | undefined;
        xChannelSelector?: string | null | undefined;
        xHeight?: number | string | null | undefined;
        xlinkActuate?: string | null | undefined;
        xlinkArcrole?: string | null | undefined;
        xlinkHref?: string | null | undefined;
        xlinkRole?: string | null | undefined;
        xlinkShow?: string | null | undefined;
        xlinkTitle?: string | null | undefined;
        xlinkType?: string | null | undefined;
        xmlBase?: string | null | undefined;
        xmlLang?: string | null | undefined;
        xmlns?: string | null | undefined;
        xmlnsXlink?: string | null | undefined;
        xmlSpace?: string | null | undefined;
        y1?: number | string | null | undefined;
        y2?: number | string | null | undefined;
        y?: number | string | null | undefined;
        yChannelSelector?: string | null | undefined;
        z?: number | string | null | undefined;
        zoomAndPan?: string | null | undefined;
    }

    interface WebViewHTMLAttributes<T> extends HTMLAttributes<T> {
        allowFullScreen?: boolean | null | undefined;
        allowpopups?: boolean | null | undefined;
        autoFocus?: boolean | null | undefined;
        autosize?: boolean | null | undefined;
        blinkfeatures?: string | null | undefined;
        disableblinkfeatures?: string | null | undefined;
        disableguestresize?: boolean | null | undefined;
        disablewebsecurity?: boolean | null | undefined;
        guestinstance?: string | null | undefined;
        httpreferrer?: string | null | undefined;
        nodeintegration?: boolean | null | undefined;
        partition?: string | null | undefined;
        plugins?: boolean | null | undefined;
        preload?: string | null | undefined;
        src?: string | null | undefined;
        useragent?: string | null | undefined;
        webpreferences?: string | null | undefined;
    }

    //
    // React.DOM
    // ----------------------------------------------------------------------

    interface ReactHTML {
        a: DetailedHTMLFactory<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;
        abbr: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        address: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        area: DetailedHTMLFactory<AreaHTMLAttributes<HTMLAreaElement>, HTMLAreaElement>;
        article: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        aside: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        audio: DetailedHTMLFactory<AudioHTMLAttributes<HTMLAudioElement>, HTMLAudioElement>;
        b: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        base: DetailedHTMLFactory<BaseHTMLAttributes<HTMLBaseElement>, HTMLBaseElement>;
        bdi: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        bdo: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        big: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        blockquote: DetailedHTMLFactory<BlockquoteHTMLAttributes<HTMLQuoteElement>, HTMLQuoteElement>;
        body: DetailedHTMLFactory<HTMLAttributes<HTMLBodyElement>, HTMLBodyElement>;
        br: DetailedHTMLFactory<HTMLAttributes<HTMLBRElement>, HTMLBRElement>;
        button: DetailedHTMLFactory<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
        canvas: DetailedHTMLFactory<CanvasHTMLAttributes<HTMLCanvasElement>, HTMLCanvasElement>;
        caption: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        cite: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        code: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        col: DetailedHTMLFactory<ColHTMLAttributes<HTMLTableColElement>, HTMLTableColElement>;
        colgroup: DetailedHTMLFactory<ColgroupHTMLAttributes<HTMLTableColElement>, HTMLTableColElement>;
        data: DetailedHTMLFactory<DataHTMLAttributes<HTMLDataElement>, HTMLDataElement>;
        datalist: DetailedHTMLFactory<HTMLAttributes<HTMLDataListElement>, HTMLDataListElement>;
        dd: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        del: DetailedHTMLFactory<DelHTMLAttributes<HTMLModElement>, HTMLModElement>;
        details: DetailedHTMLFactory<DetailsHTMLAttributes<HTMLDetailsElement>, HTMLDetailsElement>;
        dfn: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        dialog: DetailedHTMLFactory<DialogHTMLAttributes<HTMLDialogElement>, HTMLDialogElement>;
        div: DetailedHTMLFactory<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
        dl: DetailedHTMLFactory<HTMLAttributes<HTMLDListElement>, HTMLDListElement>;
        dt: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        em: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        embed: DetailedHTMLFactory<EmbedHTMLAttributes<HTMLEmbedElement>, HTMLEmbedElement>;
        fieldset: DetailedHTMLFactory<FieldsetHTMLAttributes<HTMLFieldSetElement>, HTMLFieldSetElement>;
        figcaption: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        figure: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        footer: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        form: DetailedHTMLFactory<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;
        h1: DetailedHTMLFactory<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
        h2: DetailedHTMLFactory<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
        h3: DetailedHTMLFactory<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
        h4: DetailedHTMLFactory<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
        h5: DetailedHTMLFactory<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
        h6: DetailedHTMLFactory<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
        head: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLHeadElement>;
        header: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        hgroup: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        hr: DetailedHTMLFactory<HTMLAttributes<HTMLHRElement>, HTMLHRElement>;
        html: DetailedHTMLFactory<HtmlHTMLAttributes<HTMLHtmlElement>, HTMLHtmlElement>;
        i: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        iframe: DetailedHTMLFactory<IframeHTMLAttributes<HTMLIFrameElement>, HTMLIFrameElement>;
        img: DetailedHTMLFactory<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>;
        input: DetailedHTMLFactory<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
        ins: DetailedHTMLFactory<InsHTMLAttributes<HTMLModElement>, HTMLModElement>;
        kbd: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        keygen: DetailedHTMLFactory<KeygenHTMLAttributes<HTMLElement>, HTMLElement>;
        label: DetailedHTMLFactory<LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>;
        legend: DetailedHTMLFactory<HTMLAttributes<HTMLLegendElement>, HTMLLegendElement>;
        li: DetailedHTMLFactory<LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>;
        link: DetailedHTMLFactory<LinkHTMLAttributes<HTMLLinkElement>, HTMLLinkElement>;
        main: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        map: DetailedHTMLFactory<MapHTMLAttributes<HTMLMapElement>, HTMLMapElement>;
        mark: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        menu: DetailedHTMLFactory<MenuHTMLAttributes<HTMLElement>, HTMLElement>;
        menuitem: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        meta: DetailedHTMLFactory<MetaHTMLAttributes<HTMLMetaElement>, HTMLMetaElement>;
        meter: DetailedHTMLFactory<MeterHTMLAttributes<HTMLMeterElement>, HTMLMeterElement>;
        nav: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        noscript: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        object: DetailedHTMLFactory<ObjectHTMLAttributes<HTMLObjectElement>, HTMLObjectElement>;
        ol: DetailedHTMLFactory<OlHTMLAttributes<HTMLOListElement>, HTMLOListElement>;
        optgroup: DetailedHTMLFactory<OptgroupHTMLAttributes<HTMLOptGroupElement>, HTMLOptGroupElement>;
        option: DetailedHTMLFactory<OptionHTMLAttributes<HTMLOptionElement>, HTMLOptionElement>;
        output: DetailedHTMLFactory<OutputHTMLAttributes<HTMLOutputElement>, HTMLOutputElement>;
        p: DetailedHTMLFactory<HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>;
        param: DetailedHTMLFactory<ParamHTMLAttributes<HTMLParamElement>, HTMLParamElement>;
        picture: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        pre: DetailedHTMLFactory<HTMLAttributes<HTMLPreElement>, HTMLPreElement>;
        progress: DetailedHTMLFactory<ProgressHTMLAttributes<HTMLProgressElement>, HTMLProgressElement>;
        q: DetailedHTMLFactory<QuoteHTMLAttributes<HTMLQuoteElement>, HTMLQuoteElement>;
        rp: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        rt: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        ruby: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        s: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        samp: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        slot: DetailedHTMLFactory<SlotHTMLAttributes<HTMLSlotElement>, HTMLSlotElement>;
        script: DetailedHTMLFactory<ScriptHTMLAttributes<HTMLScriptElement>, HTMLScriptElement>;
        section: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        select: DetailedHTMLFactory<SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>;
        small: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        source: DetailedHTMLFactory<SourceHTMLAttributes<HTMLSourceElement>, HTMLSourceElement>;
        span: DetailedHTMLFactory<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;
        strong: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        style: DetailedHTMLFactory<StyleHTMLAttributes<HTMLStyleElement>, HTMLStyleElement>;
        sub: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        summary: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        sup: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        table: DetailedHTMLFactory<TableHTMLAttributes<HTMLTableElement>, HTMLTableElement>;
        template: DetailedHTMLFactory<HTMLAttributes<HTMLTemplateElement>, HTMLTemplateElement>;
        tbody: DetailedHTMLFactory<HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>;
        td: DetailedHTMLFactory<TdHTMLAttributes<HTMLTableDataCellElement>, HTMLTableDataCellElement>;
        textarea: DetailedHTMLFactory<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>;
        tfoot: DetailedHTMLFactory<HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>;
        th: DetailedHTMLFactory<ThHTMLAttributes<HTMLTableHeaderCellElement>, HTMLTableHeaderCellElement>;
        thead: DetailedHTMLFactory<HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>;
        time: DetailedHTMLFactory<TimeHTMLAttributes<HTMLTimeElement>, HTMLTimeElement>;
        title: DetailedHTMLFactory<HTMLAttributes<HTMLTitleElement>, HTMLTitleElement>;
        tr: DetailedHTMLFactory<HTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement>;
        track: DetailedHTMLFactory<TrackHTMLAttributes<HTMLTrackElement>, HTMLTrackElement>;
        u: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        ul: DetailedHTMLFactory<HTMLAttributes<HTMLUListElement>, HTMLUListElement>;
        "var": DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        video: DetailedHTMLFactory<VideoHTMLAttributes<HTMLVideoElement>, HTMLVideoElement>;
        wbr: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        webview: DetailedHTMLFactory<WebViewHTMLAttributes<HTMLWebViewElement>, HTMLWebViewElement>;
    }

    interface ReactSVG {
        animate: SVGFactory;
        circle: SVGFactory;
        clipPath: SVGFactory;
        defs: SVGFactory;
        desc: SVGFactory;
        ellipse: SVGFactory;
        feBlend: SVGFactory;
        feColorMatrix: SVGFactory;
        feComponentTransfer: SVGFactory;
        feComposite: SVGFactory;
        feConvolveMatrix: SVGFactory;
        feDiffuseLighting: SVGFactory;
        feDisplacementMap: SVGFactory;
        feDistantLight: SVGFactory;
        feDropShadow: SVGFactory;
        feFlood: SVGFactory;
        feFuncA: SVGFactory;
        feFuncB: SVGFactory;
        feFuncG: SVGFactory;
        feFuncR: SVGFactory;
        feGaussianBlur: SVGFactory;
        feImage: SVGFactory;
        feMerge: SVGFactory;
        feMergeNode: SVGFactory;
        feMorphology: SVGFactory;
        feOffset: SVGFactory;
        fePointLight: SVGFactory;
        feSpecularLighting: SVGFactory;
        feSpotLight: SVGFactory;
        feTile: SVGFactory;
        feTurbulence: SVGFactory;
        filter: SVGFactory;
        foreignObject: SVGFactory;
        g: SVGFactory;
        image: SVGFactory;
        line: SVGFactory;
        linearGradient: SVGFactory;
        marker: SVGFactory;
        mask: SVGFactory;
        metadata: SVGFactory;
        path: SVGFactory;
        pattern: SVGFactory;
        polygon: SVGFactory;
        polyline: SVGFactory;
        radialGradient: SVGFactory;
        rect: SVGFactory;
        stop: SVGFactory;
        svg: SVGFactory;
        switch: SVGFactory;
        symbol: SVGFactory;
        text: SVGFactory;
        textPath: SVGFactory;
        tspan: SVGFactory;
        use: SVGFactory;
        view: SVGFactory;
    }

    interface ReactDOM extends ReactHTML, ReactSVG { }

    //
    // React.PropTypes
    // ----------------------------------------------------------------------

    type Validator<T> = PropTypes.Validator<T>;

    type Requireable<T> = PropTypes.Requireable<T>;

    type ValidationMap<T> = PropTypes.ValidationMap<T>;

    type WeakValidationMap<T> = {
        [K in keyof T]?: null extends T[K]
            ? Validator<T[K] | null | undefined>
            : undefined extends T[K]
            ? Validator<T[K] | null | undefined>
            : Validator<T[K]>
    };

    interface ReactPropTypes {
        any: typeof PropTypes.any;
        array: typeof PropTypes.array;
        bool: typeof PropTypes.bool;
        func: typeof PropTypes.func;
        number: typeof PropTypes.number;
        object: typeof PropTypes.object;
        string: typeof PropTypes.string;
        node: typeof PropTypes.node;
        element: typeof PropTypes.element;
        instanceOf: typeof PropTypes.instanceOf;
        oneOf: typeof PropTypes.oneOf;
        oneOfType: typeof PropTypes.oneOfType;
        arrayOf: typeof PropTypes.arrayOf;
        objectOf: typeof PropTypes.objectOf;
        shape: typeof PropTypes.shape;
        exact: typeof PropTypes.exact;
    }

    //
    // React.Children
    // ----------------------------------------------------------------------

    /**
     * @deprecated - Use `typeof React.Children` instead.
     */
    // Sync with type of `const Children`.
    interface ReactChildren {
        map<T, C>(children: C | ReadonlyArray<C>, fn: (child: C, index: number) => T):
            C extends null | undefined ? C : Array<Exclude<T, boolean | null | undefined>>;
        forEach<C>(children: C | ReadonlyArray<C>, fn: (child: C, index: number) => void): void;
        count(children: any): number;
        only<C>(children: C): C extends any[] ? never : C;
        toArray(children: ReactNode | ReactNode[]): Array<Exclude<ReactNode, boolean | null | undefined>>;
    }

    //
    // Browser Interfaces
    // https://github.com/nikeee/2048-typescript/blob/master/2048/js/touch.d.ts
    // ----------------------------------------------------------------------

    interface AbstractView {
        styleMedia: StyleMedia;
        document: Document;
    }

    interface Touch {
        identifier: number;
        target: EventTarget;
        screenX: number;
        screenY: number;
        clientX: number;
        clientY: number;
        pageX: number;
        pageY: number;
    }

    interface TouchList {
        [index: number]: Touch;
        length: number;
        item(index: number): Touch;
        identifiedTouch(identifier: number): Touch;
    }

    //
    // Error Interfaces
    // ----------------------------------------------------------------------
    interface ErrorInfo {
        /**
         * Captures which component contained the exception, and its ancestors.
         */
        componentStack: string;
    }
}

// naked 'any' type in a conditional type will short circuit and union both the then/else branches
// so boolean is only resolved for T = any
type IsExactlyAny<T> = boolean extends (T extends never ? true : false) ? true : false;

type ExactlyAnyPropertyKeys<T> = { [K in keyof T]: IsExactlyAny<T[K]> extends true ? K : never }[keyof T];
type NotExactlyAnyPropertyKeys<T> = Exclude<keyof T, ExactlyAnyPropertyKeys<T>>;

// Try to resolve ill-defined props like for JS users: props can be any, or sometimes objects with properties of type any
type MergePropTypes<P, T> =
    // Distribute over P in case it is a union type
    P extends any
        // If props is type any, use propTypes definitions
        ? IsExactlyAny<P> extends true ? T :
            // If declared props have indexed properties, ignore inferred props entirely as keyof gets widened
            string extends keyof P ? P :
                // Prefer declared types which are not exactly any
                & Pick<P, NotExactlyAnyPropertyKeys<P>>
                // For props which are exactly any, use the type inferred from propTypes if present
                & Pick<T, Exclude<keyof T, NotExactlyAnyPropertyKeys<P>>>
                // Keep leftover props not specified in propTypes
                & Pick<P, Exclude<keyof P, keyof T>>
        : never;

type InexactPartial<T> = { [K in keyof T]?: T[K] | null | undefined };

// Any prop that has a default prop becomes optional, but its type is unchanged
// Undeclared default props are augmented into the resulting allowable attributes
// If declared props have indexed properties, ignore default props entirely as keyof gets widened
// Wrap in an outer-level conditional type to allow distribution over props that are unions
type Defaultize<P, D> = P extends any
    ? string extends keyof P ? P :
        & Pick<P, Exclude<keyof P, keyof D>>
        & InexactPartial<Pick<P, Extract<keyof P, keyof D>>>
        & InexactPartial<Pick<D, Exclude<keyof D, keyof P>>>
    : never;

type ReactManagedAttributes<C, P> = C extends { propTypes: infer T; defaultProps: infer D; }
    ? Defaultize<MergePropTypes<P, PropTypes.InferProps<T>>, D>
    : C extends { propTypes: infer T; }
        ? MergePropTypes<P, PropTypes.InferProps<T>>
        : C extends { defaultProps: infer D; }
            ? Defaultize<P, D>
            : P;

declare global {
    namespace JSX {
        interface Element extends React.ReactElement<any, any> { }
        interface ElementClass extends React.Component<any> {
            render(): React.ReactNode;
        }
        interface ElementAttributesProperty { props: {}; }
        interface ElementChildrenAttribute { children: {}; }

        // We can't recurse forever because `type` can't be self-referential;
        // let's assume it's reasonable to do a single React.lazy() around a single React.memo() / vice-versa
        type LibraryManagedAttributes<C, P> = C extends React.MemoExoticComponent<infer T> | React.LazyExoticComponent<infer T>
            ? T extends React.MemoExoticComponent<infer U> | React.LazyExoticComponent<infer U>
                ? ReactManagedAttributes<U, P>
                : ReactManagedAttributes<T, P>
            : ReactManagedAttributes<C, P>;

        interface IntrinsicAttributes extends React.Attributes { }
        interface IntrinsicClassAttributes<T> extends React.ClassAttributes<T> { }

        interface IntrinsicElements {
            // HTML
            a: React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;
            abbr: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            address: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            area: React.DetailedHTMLProps<React.AreaHTMLAttributes<HTMLAreaElement>, HTMLAreaElement>;
            article: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            aside: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            audio: React.DetailedHTMLProps<React.AudioHTMLAttributes<HTMLAudioElement>, HTMLAudioElement>;
            b: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            base: React.DetailedHTMLProps<React.BaseHTMLAttributes<HTMLBaseElement>, HTMLBaseElement>;
            bdi: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            bdo: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            big: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            blockquote: React.DetailedHTMLProps<React.BlockquoteHTMLAttributes<HTMLQuoteElement>, HTMLQuoteElement>;
            body: React.DetailedHTMLProps<React.HTMLAttributes<HTMLBodyElement>, HTMLBodyElement>;
            br: React.DetailedHTMLProps<React.HTMLAttributes<HTMLBRElement>, HTMLBRElement>;
            button: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
            canvas: React.DetailedHTMLProps<React.CanvasHTMLAttributes<HTMLCanvasElement>, HTMLCanvasElement>;
            caption: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            cite: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            code: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            col: React.DetailedHTMLProps<React.ColHTMLAttributes<HTMLTableColElement>, HTMLTableColElement>;
            colgroup: React.DetailedHTMLProps<React.ColgroupHTMLAttributes<HTMLTableColElement>, HTMLTableColElement>;
            data: React.DetailedHTMLProps<React.DataHTMLAttributes<HTMLDataElement>, HTMLDataElement>;
            datalist: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDataListElement>, HTMLDataListElement>;
            dd: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            del: React.DetailedHTMLProps<React.DelHTMLAttributes<HTMLModElement>, HTMLModElement>;
            details: React.DetailedHTMLProps<React.DetailsHTMLAttributes<HTMLDetailsElement>, HTMLDetailsElement>;
            dfn: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            dialog: React.DetailedHTMLProps<React.DialogHTMLAttributes<HTMLDialogElement>, HTMLDialogElement>;
            div: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
            dl: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDListElement>, HTMLDListElement>;
            dt: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            em: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            embed: React.DetailedHTMLProps<React.EmbedHTMLAttributes<HTMLEmbedElement>, HTMLEmbedElement>;
            fieldset: React.DetailedHTMLProps<React.FieldsetHTMLAttributes<HTMLFieldSetElement>, HTMLFieldSetElement>;
            figcaption: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            figure: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            footer: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            form: React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;
            h1: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
            h2: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
            h3: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
            h4: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
            h5: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
            h6: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
            head: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadElement>, HTMLHeadElement>;
            header: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            hgroup: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            hr: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHRElement>, HTMLHRElement>;
            html: React.DetailedHTMLProps<React.HtmlHTMLAttributes<HTMLHtmlElement>, HTMLHtmlElement>;
            i: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            iframe: React.DetailedHTMLProps<React.IframeHTMLAttributes<HTMLIFrameElement>, HTMLIFrameElement>;
            img: React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>;
            input: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
            ins: React.DetailedHTMLProps<React.InsHTMLAttributes<HTMLModElement>, HTMLModElement>;
            kbd: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            keygen: React.DetailedHTMLProps<React.KeygenHTMLAttributes<HTMLElement>, HTMLElement>;
            label: React.DetailedHTMLProps<React.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>;
            legend: React.DetailedHTMLProps<React.HTMLAttributes<HTMLLegendElement>, HTMLLegendElement>;
            li: React.DetailedHTMLProps<React.LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>;
            link: React.DetailedHTMLProps<React.LinkHTMLAttributes<HTMLLinkElement>, HTMLLinkElement>;
            main: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            map: React.DetailedHTMLProps<React.MapHTMLAttributes<HTMLMapElement>, HTMLMapElement>;
            mark: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            menu: React.DetailedHTMLProps<React.MenuHTMLAttributes<HTMLElement>, HTMLElement>;
            menuitem: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            meta: React.DetailedHTMLProps<React.MetaHTMLAttributes<HTMLMetaElement>, HTMLMetaElement>;
            meter: React.DetailedHTMLProps<React.MeterHTMLAttributes<HTMLMeterElement>, HTMLMeterElement>;
            nav: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            noindex: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            noscript: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            object: React.DetailedHTMLProps<React.ObjectHTMLAttributes<HTMLObjectElement>, HTMLObjectElement>;
            ol: React.DetailedHTMLProps<React.OlHTMLAttributes<HTMLOListElement>, HTMLOListElement>;
            optgroup: React.DetailedHTMLProps<React.OptgroupHTMLAttributes<HTMLOptGroupElement>, HTMLOptGroupElement>;
            option: React.DetailedHTMLProps<React.OptionHTMLAttributes<HTMLOptionElement>, HTMLOptionElement>;
            output: React.DetailedHTMLProps<React.OutputHTMLAttributes<HTMLOutputElement>, HTMLOutputElement>;
            p: React.DetailedHTMLProps<React.HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>;
            param: React.DetailedHTMLProps<React.ParamHTMLAttributes<HTMLParamElement>, HTMLParamElement>;
            picture: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            pre: React.DetailedHTMLProps<React.HTMLAttributes<HTMLPreElement>, HTMLPreElement>;
            progress: React.DetailedHTMLProps<React.ProgressHTMLAttributes<HTMLProgressElement>, HTMLProgressElement>;
            q: React.DetailedHTMLProps<React.QuoteHTMLAttributes<HTMLQuoteElement>, HTMLQuoteElement>;
            rp: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            rt: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            ruby: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            s: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            samp: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            slot: React.DetailedHTMLProps<React.SlotHTMLAttributes<HTMLSlotElement>, HTMLSlotElement>;
            script: React.DetailedHTMLProps<React.ScriptHTMLAttributes<HTMLScriptElement>, HTMLScriptElement>;
            section: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            select: React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>;
            small: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            source: React.DetailedHTMLProps<React.SourceHTMLAttributes<HTMLSourceElement>, HTMLSourceElement>;
            span: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;
            strong: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            style: React.DetailedHTMLProps<React.StyleHTMLAttributes<HTMLStyleElement>, HTMLStyleElement>;
            sub: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            summary: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            sup: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            table: React.DetailedHTMLProps<React.TableHTMLAttributes<HTMLTableElement>, HTMLTableElement>;
            template: React.DetailedHTMLProps<React.HTMLAttributes<HTMLTemplateElement>, HTMLTemplateElement>;
            tbody: React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>;
            td: React.DetailedHTMLProps<React.TdHTMLAttributes<HTMLTableDataCellElement>, HTMLTableDataCellElement>;
            textarea: React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>;
            tfoot: React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>;
            th: React.DetailedHTMLProps<React.ThHTMLAttributes<HTMLTableHeaderCellElement>, HTMLTableHeaderCellElement>;
            thead: React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>;
            time: React.DetailedHTMLProps<React.TimeHTMLAttributes<HTMLTimeElement>, HTMLTimeElement>;
            title: React.DetailedHTMLProps<React.HTMLAttributes<HTMLTitleElement>, HTMLTitleElement>;
            tr: React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement>;
            track: React.DetailedHTMLProps<React.TrackHTMLAttributes<HTMLTrackElement>, HTMLTrackElement>;
            u: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            ul: React.DetailedHTMLProps<React.HTMLAttributes<HTMLUListElement>, HTMLUListElement>;
            "var": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            video: React.DetailedHTMLProps<React.VideoHTMLAttributes<HTMLVideoElement>, HTMLVideoElement>;
            wbr: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            webview: React.DetailedHTMLProps<React.WebViewHTMLAttributes<HTMLWebViewElement>, HTMLWebViewElement>;

            // SVG
            svg: React.SVGProps<SVGSVGElement>;

            animate: React.SVGProps<SVGElement>; // TODO: It is SVGAnimateElement but is not in TypeScript's lib.dom.d.ts for now.
            animateMotion: React.SVGProps<SVGElement>;
            animateTransform: React.SVGProps<SVGElement>; // TODO: It is SVGAnimateTransformElement but is not in TypeScript's lib.dom.d.ts for now.
            circle: React.SVGProps<SVGCircleElement>;
            clipPath: React.SVGProps<SVGClipPathElement>;
            defs: React.SVGProps<SVGDefsElement>;
            desc: React.SVGProps<SVGDescElement>;
            ellipse: React.SVGProps<SVGEllipseElement>;
            feBlend: React.SVGProps<SVGFEBlendElement>;
            feColorMatrix: React.SVGProps<SVGFEColorMatrixElement>;
            feComponentTransfer: React.SVGProps<SVGFEComponentTransferElement>;
            feComposite: React.SVGProps<SVGFECompositeElement>;
            feConvolveMatrix: React.SVGProps<SVGFEConvolveMatrixElement>;
            feDiffuseLighting: React.SVGProps<SVGFEDiffuseLightingElement>;
            feDisplacementMap: React.SVGProps<SVGFEDisplacementMapElement>;
            feDistantLight: React.SVGProps<SVGFEDistantLightElement>;
            feDropShadow: React.SVGProps<SVGFEDropShadowElement>;
            feFlood: React.SVGProps<SVGFEFloodElement>;
            feFuncA: React.SVGProps<SVGFEFuncAElement>;
            feFuncB: React.SVGProps<SVGFEFuncBElement>;
            feFuncG: React.SVGProps<SVGFEFuncGElement>;
            feFuncR: React.SVGProps<SVGFEFuncRElement>;
            feGaussianBlur: React.SVGProps<SVGFEGaussianBlurElement>;
            feImage: React.SVGProps<SVGFEImageElement>;
            feMerge: React.SVGProps<SVGFEMergeElement>;
            feMergeNode: React.SVGProps<SVGFEMergeNodeElement>;
            feMorphology: React.SVGProps<SVGFEMorphologyElement>;
            feOffset: React.SVGProps<SVGFEOffsetElement>;
            fePointLight: React.SVGProps<SVGFEPointLightElement>;
            feSpecularLighting: React.SVGProps<SVGFESpecularLightingElement>;
            feSpotLight: React.SVGProps<SVGFESpotLightElement>;
            feTile: React.SVGProps<SVGFETileElement>;
            feTurbulence: React.SVGProps<SVGFETurbulenceElement>;
            filter: React.SVGProps<SVGFilterElement>;
            foreignObject: React.SVGProps<SVGForeignObjectElement>;
            g: React.SVGProps<SVGGElement>;
            image: React.SVGProps<SVGImageElement>;
            line: React.SVGProps<SVGLineElement>;
            linearGradient: React.SVGProps<SVGLinearGradientElement>;
            marker: React.SVGProps<SVGMarkerElement>;
            mask: React.SVGProps<SVGMaskElement>;
            metadata: React.SVGProps<SVGMetadataElement>;
            mpath: React.SVGProps<SVGElement>;
            path: React.SVGProps<SVGPathElement>;
            pattern: React.SVGProps<SVGPatternElement>;
            polygon: React.SVGProps<SVGPolygonElement>;
            polyline: React.SVGProps<SVGPolylineElement>;
            radialGradient: React.SVGProps<SVGRadialGradientElement>;
            rect: React.SVGProps<SVGRectElement>;
            stop: React.SVGProps<SVGStopElement>;
            switch: React.SVGProps<SVGSwitchElement>;
            symbol: React.SVGProps<SVGSymbolElement>;
            text: React.SVGProps<SVGTextElement>;
            textPath: React.SVGProps<SVGTextPathElement>;
            tspan: React.SVGProps<SVGTSpanElement>;
            use: React.SVGProps<SVGUseElement>;
            view: React.SVGProps<SVGViewElement>;
        }
    }
}


(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root.host) {
            return root;
        }
        return document;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }
    class HtmlTag {
        constructor() {
            this.e = this.n = null;
        }
        c(html) {
            this.h(html);
        }
        m(html, target, anchor = null) {
            if (!this.e) {
                this.e = element(target.nodeName);
                this.t = target;
                this.c(html);
            }
            this.i(anchor);
        }
        h(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        i(anchor) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(this.t, this.n[i], anchor);
            }
        }
        p(html) {
            this.d();
            this.h(html);
            this.i(this.a);
        }
        d() {
            this.n.forEach(detach);
        }
    }

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = append_empty_stylesheet(node).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = (program.b - t);
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : options.context || []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.42.1' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    const LOCATION = {};
    const ROUTER = {};

    /**
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/history.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     * */

    function getLocation(source) {
      return {
        ...source.location,
        state: source.history.state,
        key: (source.history.state && source.history.state.key) || "initial"
      };
    }

    function createHistory(source, options) {
      const listeners = [];
      let location = getLocation(source);

      return {
        get location() {
          return location;
        },

        listen(listener) {
          listeners.push(listener);

          const popstateListener = () => {
            location = getLocation(source);
            listener({ location, action: "POP" });
          };

          source.addEventListener("popstate", popstateListener);

          return () => {
            source.removeEventListener("popstate", popstateListener);

            const index = listeners.indexOf(listener);
            listeners.splice(index, 1);
          };
        },

        navigate(to, { state, replace = false } = {}) {
          state = { ...state, key: Date.now() + "" };
          // try...catch iOS Safari limits to 100 pushState calls
          try {
            if (replace) {
              source.history.replaceState(state, null, to);
            } else {
              source.history.pushState(state, null, to);
            }
          } catch (e) {
            source.location[replace ? "replace" : "assign"](to);
          }

          location = getLocation(source);
          listeners.forEach(listener => listener({ location, action: "PUSH" }));
        }
      };
    }

    // Stores history entries in memory for testing or other platforms like Native
    function createMemorySource(initialPathname = "/") {
      let index = 0;
      const stack = [{ pathname: initialPathname, search: "" }];
      const states = [];

      return {
        get location() {
          return stack[index];
        },
        addEventListener(name, fn) {},
        removeEventListener(name, fn) {},
        history: {
          get entries() {
            return stack;
          },
          get index() {
            return index;
          },
          get state() {
            return states[index];
          },
          pushState(state, _, uri) {
            const [pathname, search = ""] = uri.split("?");
            index++;
            stack.push({ pathname, search });
            states.push(state);
          },
          replaceState(state, _, uri) {
            const [pathname, search = ""] = uri.split("?");
            stack[index] = { pathname, search };
            states[index] = state;
          }
        }
      };
    }

    // Global history uses window.history as the source if available,
    // otherwise a memory history
    const canUseDOM = Boolean(
      typeof window !== "undefined" &&
        window.document &&
        window.document.createElement
    );
    const globalHistory = createHistory(canUseDOM ? window : createMemorySource());
    const { navigate } = globalHistory;

    /**
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/utils.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     * */

    const paramRe = /^:(.+)/;

    const SEGMENT_POINTS = 4;
    const STATIC_POINTS = 3;
    const DYNAMIC_POINTS = 2;
    const SPLAT_PENALTY = 1;
    const ROOT_POINTS = 1;

    /**
     * Check if `string` starts with `search`
     * @param {string} string
     * @param {string} search
     * @return {boolean}
     */
    function startsWith(string, search) {
      return string.substr(0, search.length) === search;
    }

    /**
     * Check if `segment` is a root segment
     * @param {string} segment
     * @return {boolean}
     */
    function isRootSegment(segment) {
      return segment === "";
    }

    /**
     * Check if `segment` is a dynamic segment
     * @param {string} segment
     * @return {boolean}
     */
    function isDynamic(segment) {
      return paramRe.test(segment);
    }

    /**
     * Check if `segment` is a splat
     * @param {string} segment
     * @return {boolean}
     */
    function isSplat(segment) {
      return segment[0] === "*";
    }

    /**
     * Split up the URI into segments delimited by `/`
     * @param {string} uri
     * @return {string[]}
     */
    function segmentize(uri) {
      return (
        uri
          // Strip starting/ending `/`
          .replace(/(^\/+|\/+$)/g, "")
          .split("/")
      );
    }

    /**
     * Strip `str` of potential start and end `/`
     * @param {string} str
     * @return {string}
     */
    function stripSlashes(str) {
      return str.replace(/(^\/+|\/+$)/g, "");
    }

    /**
     * Score a route depending on how its individual segments look
     * @param {object} route
     * @param {number} index
     * @return {object}
     */
    function rankRoute(route, index) {
      const score = route.default
        ? 0
        : segmentize(route.path).reduce((score, segment) => {
            score += SEGMENT_POINTS;

            if (isRootSegment(segment)) {
              score += ROOT_POINTS;
            } else if (isDynamic(segment)) {
              score += DYNAMIC_POINTS;
            } else if (isSplat(segment)) {
              score -= SEGMENT_POINTS + SPLAT_PENALTY;
            } else {
              score += STATIC_POINTS;
            }

            return score;
          }, 0);

      return { route, score, index };
    }

    /**
     * Give a score to all routes and sort them on that
     * @param {object[]} routes
     * @return {object[]}
     */
    function rankRoutes(routes) {
      return (
        routes
          .map(rankRoute)
          // If two routes have the exact same score, we go by index instead
          .sort((a, b) =>
            a.score < b.score ? 1 : a.score > b.score ? -1 : a.index - b.index
          )
      );
    }

    /**
     * Ranks and picks the best route to match. Each segment gets the highest
     * amount of points, then the type of segment gets an additional amount of
     * points where
     *
     *  static > dynamic > splat > root
     *
     * This way we don't have to worry about the order of our routes, let the
     * computers do it.
     *
     * A route looks like this
     *
     *  { path, default, value }
     *
     * And a returned match looks like:
     *
     *  { route, params, uri }
     *
     * @param {object[]} routes
     * @param {string} uri
     * @return {?object}
     */
    function pick(routes, uri) {
      let match;
      let default_;

      const [uriPathname] = uri.split("?");
      const uriSegments = segmentize(uriPathname);
      const isRootUri = uriSegments[0] === "";
      const ranked = rankRoutes(routes);

      for (let i = 0, l = ranked.length; i < l; i++) {
        const route = ranked[i].route;
        let missed = false;

        if (route.default) {
          default_ = {
            route,
            params: {},
            uri
          };
          continue;
        }

        const routeSegments = segmentize(route.path);
        const params = {};
        const max = Math.max(uriSegments.length, routeSegments.length);
        let index = 0;

        for (; index < max; index++) {
          const routeSegment = routeSegments[index];
          const uriSegment = uriSegments[index];

          if (routeSegment !== undefined && isSplat(routeSegment)) {
            // Hit a splat, just grab the rest, and return a match
            // uri:   /files/documents/work
            // route: /files/* or /files/*splatname
            const splatName = routeSegment === "*" ? "*" : routeSegment.slice(1);

            params[splatName] = uriSegments
              .slice(index)
              .map(decodeURIComponent)
              .join("/");
            break;
          }

          if (uriSegment === undefined) {
            // URI is shorter than the route, no match
            // uri:   /users
            // route: /users/:userId
            missed = true;
            break;
          }

          let dynamicMatch = paramRe.exec(routeSegment);

          if (dynamicMatch && !isRootUri) {
            const value = decodeURIComponent(uriSegment);
            params[dynamicMatch[1]] = value;
          } else if (routeSegment !== uriSegment) {
            // Current segments don't match, not dynamic, not splat, so no match
            // uri:   /users/123/settings
            // route: /users/:id/profile
            missed = true;
            break;
          }
        }

        if (!missed) {
          match = {
            route,
            params,
            uri: "/" + uriSegments.slice(0, index).join("/")
          };
          break;
        }
      }

      return match || default_ || null;
    }

    /**
     * Check if the `path` matches the `uri`.
     * @param {string} path
     * @param {string} uri
     * @return {?object}
     */
    function match(route, uri) {
      return pick([route], uri);
    }

    /**
     * Add the query to the pathname if a query is given
     * @param {string} pathname
     * @param {string} [query]
     * @return {string}
     */
    function addQuery(pathname, query) {
      return pathname + (query ? `?${query}` : "");
    }

    /**
     * Resolve URIs as though every path is a directory, no files. Relative URIs
     * in the browser can feel awkward because not only can you be "in a directory",
     * you can be "at a file", too. For example:
     *
     *  browserSpecResolve('foo', '/bar/') => /bar/foo
     *  browserSpecResolve('foo', '/bar') => /foo
     *
     * But on the command line of a file system, it's not as complicated. You can't
     * `cd` from a file, only directories. This way, links have to know less about
     * their current path. To go deeper you can do this:
     *
     *  <Link to="deeper"/>
     *  // instead of
     *  <Link to=`{${props.uri}/deeper}`/>
     *
     * Just like `cd`, if you want to go deeper from the command line, you do this:
     *
     *  cd deeper
     *  # not
     *  cd $(pwd)/deeper
     *
     * By treating every path as a directory, linking to relative paths should
     * require less contextual information and (fingers crossed) be more intuitive.
     * @param {string} to
     * @param {string} base
     * @return {string}
     */
    function resolve(to, base) {
      // /foo/bar, /baz/qux => /foo/bar
      if (startsWith(to, "/")) {
        return to;
      }

      const [toPathname, toQuery] = to.split("?");
      const [basePathname] = base.split("?");
      const toSegments = segmentize(toPathname);
      const baseSegments = segmentize(basePathname);

      // ?a=b, /users?b=c => /users?a=b
      if (toSegments[0] === "") {
        return addQuery(basePathname, toQuery);
      }

      // profile, /users/789 => /users/789/profile
      if (!startsWith(toSegments[0], ".")) {
        const pathname = baseSegments.concat(toSegments).join("/");

        return addQuery((basePathname === "/" ? "" : "/") + pathname, toQuery);
      }

      // ./       , /users/123 => /users/123
      // ../      , /users/123 => /users
      // ../..    , /users/123 => /
      // ../../one, /a/b/c/d   => /a/b/one
      // .././one , /a/b/c/d   => /a/b/c/one
      const allSegments = baseSegments.concat(toSegments);
      const segments = [];

      allSegments.forEach(segment => {
        if (segment === "..") {
          segments.pop();
        } else if (segment !== ".") {
          segments.push(segment);
        }
      });

      return addQuery("/" + segments.join("/"), toQuery);
    }

    /**
     * Combines the `basepath` and the `path` into one path.
     * @param {string} basepath
     * @param {string} path
     */
    function combinePaths(basepath, path) {
      return `${stripSlashes(
    path === "/" ? basepath : `${stripSlashes(basepath)}/${stripSlashes(path)}`
  )}/`;
    }

    /**
     * Decides whether a given `event` should result in a navigation or not.
     * @param {object} event
     */
    function shouldNavigate(event) {
      return (
        !event.defaultPrevented &&
        event.button === 0 &&
        !(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
      );
    }

    function hostMatches(anchor) {
      const host = location.host;
      return (
        anchor.host == host ||
        // svelte seems to kill anchor.host value in ie11, so fall back to checking href
        anchor.href.indexOf(`https://${host}`) === 0 ||
        anchor.href.indexOf(`http://${host}`) === 0
      )
    }

    /* node_modules/svelte-routing/src/Router.svelte generated by Svelte v3.42.1 */

    function create_fragment(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let $location;
    	let $routes;
    	let $base;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Router', slots, ['default']);
    	let { basepath = "/" } = $$props;
    	let { url = null } = $$props;
    	const locationContext = getContext(LOCATION);
    	const routerContext = getContext(ROUTER);
    	const routes = writable([]);
    	validate_store(routes, 'routes');
    	component_subscribe($$self, routes, value => $$invalidate(6, $routes = value));
    	const activeRoute = writable(null);
    	let hasActiveRoute = false; // Used in SSR to synchronously set that a Route is active.

    	// If locationContext is not set, this is the topmost Router in the tree.
    	// If the `url` prop is given we force the location to it.
    	const location = locationContext || writable(url ? { pathname: url } : globalHistory.location);

    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(5, $location = value));

    	// If routerContext is set, the routerBase of the parent Router
    	// will be the base for this Router's descendants.
    	// If routerContext is not set, the path and resolved uri will both
    	// have the value of the basepath prop.
    	const base = routerContext
    	? routerContext.routerBase
    	: writable({ path: basepath, uri: basepath });

    	validate_store(base, 'base');
    	component_subscribe($$self, base, value => $$invalidate(7, $base = value));

    	const routerBase = derived([base, activeRoute], ([base, activeRoute]) => {
    		// If there is no activeRoute, the routerBase will be identical to the base.
    		if (activeRoute === null) {
    			return base;
    		}

    		const { path: basepath } = base;
    		const { route, uri } = activeRoute;

    		// Remove the potential /* or /*splatname from
    		// the end of the child Routes relative paths.
    		const path = route.default
    		? basepath
    		: route.path.replace(/\*.*$/, "");

    		return { path, uri };
    	});

    	function registerRoute(route) {
    		const { path: basepath } = $base;
    		let { path } = route;

    		// We store the original path in the _path property so we can reuse
    		// it when the basepath changes. The only thing that matters is that
    		// the route reference is intact, so mutation is fine.
    		route._path = path;

    		route.path = combinePaths(basepath, path);

    		if (typeof window === "undefined") {
    			// In SSR we should set the activeRoute immediately if it is a match.
    			// If there are more Routes being registered after a match is found,
    			// we just skip them.
    			if (hasActiveRoute) {
    				return;
    			}

    			const matchingRoute = match(route, $location.pathname);

    			if (matchingRoute) {
    				activeRoute.set(matchingRoute);
    				hasActiveRoute = true;
    			}
    		} else {
    			routes.update(rs => {
    				rs.push(route);
    				return rs;
    			});
    		}
    	}

    	function unregisterRoute(route) {
    		routes.update(rs => {
    			const index = rs.indexOf(route);
    			rs.splice(index, 1);
    			return rs;
    		});
    	}

    	if (!locationContext) {
    		// The topmost Router in the tree is responsible for updating
    		// the location store and supplying it through context.
    		onMount(() => {
    			const unlisten = globalHistory.listen(history => {
    				location.set(history.location);
    			});

    			return unlisten;
    		});

    		setContext(LOCATION, location);
    	}

    	setContext(ROUTER, {
    		activeRoute,
    		base,
    		routerBase,
    		registerRoute,
    		unregisterRoute
    	});

    	const writable_props = ['basepath', 'url'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('basepath' in $$props) $$invalidate(3, basepath = $$props.basepath);
    		if ('url' in $$props) $$invalidate(4, url = $$props.url);
    		if ('$$scope' in $$props) $$invalidate(8, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		setContext,
    		onMount,
    		writable,
    		derived,
    		LOCATION,
    		ROUTER,
    		globalHistory,
    		pick,
    		match,
    		stripSlashes,
    		combinePaths,
    		basepath,
    		url,
    		locationContext,
    		routerContext,
    		routes,
    		activeRoute,
    		hasActiveRoute,
    		location,
    		base,
    		routerBase,
    		registerRoute,
    		unregisterRoute,
    		$location,
    		$routes,
    		$base
    	});

    	$$self.$inject_state = $$props => {
    		if ('basepath' in $$props) $$invalidate(3, basepath = $$props.basepath);
    		if ('url' in $$props) $$invalidate(4, url = $$props.url);
    		if ('hasActiveRoute' in $$props) hasActiveRoute = $$props.hasActiveRoute;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$base*/ 128) {
    			// This reactive statement will update all the Routes' path when
    			// the basepath changes.
    			 {
    				const { path: basepath } = $base;

    				routes.update(rs => {
    					rs.forEach(r => r.path = combinePaths(basepath, r._path));
    					return rs;
    				});
    			}
    		}

    		if ($$self.$$.dirty & /*$routes, $location*/ 96) {
    			// This reactive statement will be run when the Router is created
    			// when there are no Routes and then again the following tick, so it
    			// will not find an active Route in SSR and in the browser it will only
    			// pick an active Route after all Routes have been registered.
    			 {
    				const bestMatch = pick($routes, $location.pathname);
    				activeRoute.set(bestMatch);
    			}
    		}
    	};

    	return [
    		routes,
    		location,
    		base,
    		basepath,
    		url,
    		$location,
    		$routes,
    		$base,
    		$$scope,
    		slots
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { basepath: 3, url: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get basepath() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set basepath(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get url() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-routing/src/Route.svelte generated by Svelte v3.42.1 */

    const get_default_slot_changes = dirty => ({
    	params: dirty & /*routeParams*/ 4,
    	location: dirty & /*$location*/ 16
    });

    const get_default_slot_context = ctx => ({
    	params: /*routeParams*/ ctx[2],
    	location: /*$location*/ ctx[4]
    });

    // (40:0) {#if $activeRoute !== null && $activeRoute.route === route}
    function create_if_block(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*component*/ ctx[0] !== null) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(40:0) {#if $activeRoute !== null && $activeRoute.route === route}",
    		ctx
    	});

    	return block;
    }

    // (43:2) {:else}
    function create_else_block(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], get_default_slot_context);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, routeParams, $location*/ 532)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[9],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[9])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[9], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(43:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (41:2) {#if component !== null}
    function create_if_block_1(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{ location: /*$location*/ ctx[4] },
    		/*routeParams*/ ctx[2],
    		/*routeProps*/ ctx[3]
    	];

    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*$location, routeParams, routeProps*/ 28)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*$location*/ 16 && { location: /*$location*/ ctx[4] },
    					dirty & /*routeParams*/ 4 && get_spread_object(/*routeParams*/ ctx[2]),
    					dirty & /*routeProps*/ 8 && get_spread_object(/*routeProps*/ ctx[3])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(41:2) {#if component !== null}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*$activeRoute*/ ctx[1] !== null && /*$activeRoute*/ ctx[1].route === /*route*/ ctx[7] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$activeRoute*/ ctx[1] !== null && /*$activeRoute*/ ctx[1].route === /*route*/ ctx[7]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$activeRoute*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $activeRoute;
    	let $location;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Route', slots, ['default']);
    	let { path = "" } = $$props;
    	let { component = null } = $$props;
    	const { registerRoute, unregisterRoute, activeRoute } = getContext(ROUTER);
    	validate_store(activeRoute, 'activeRoute');
    	component_subscribe($$self, activeRoute, value => $$invalidate(1, $activeRoute = value));
    	const location = getContext(LOCATION);
    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(4, $location = value));

    	const route = {
    		path,
    		// If no path prop is given, this Route will act as the default Route
    		// that is rendered if no other Route in the Router is a match.
    		default: path === ""
    	};

    	let routeParams = {};
    	let routeProps = {};
    	registerRoute(route);

    	// There is no need to unregister Routes in SSR since it will all be
    	// thrown away anyway.
    	if (typeof window !== "undefined") {
    		onDestroy(() => {
    			unregisterRoute(route);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(13, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ('path' in $$new_props) $$invalidate(8, path = $$new_props.path);
    		if ('component' in $$new_props) $$invalidate(0, component = $$new_props.component);
    		if ('$$scope' in $$new_props) $$invalidate(9, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		onDestroy,
    		ROUTER,
    		LOCATION,
    		path,
    		component,
    		registerRoute,
    		unregisterRoute,
    		activeRoute,
    		location,
    		route,
    		routeParams,
    		routeProps,
    		$activeRoute,
    		$location
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(13, $$props = assign(assign({}, $$props), $$new_props));
    		if ('path' in $$props) $$invalidate(8, path = $$new_props.path);
    		if ('component' in $$props) $$invalidate(0, component = $$new_props.component);
    		if ('routeParams' in $$props) $$invalidate(2, routeParams = $$new_props.routeParams);
    		if ('routeProps' in $$props) $$invalidate(3, routeProps = $$new_props.routeProps);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$activeRoute*/ 2) {
    			 if ($activeRoute && $activeRoute.route === route) {
    				$$invalidate(2, routeParams = $activeRoute.params);
    			}
    		}

    		 {
    			const { path, component, ...rest } = $$props;
    			$$invalidate(3, routeProps = rest);
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		component,
    		$activeRoute,
    		routeParams,
    		routeProps,
    		$location,
    		activeRoute,
    		location,
    		route,
    		path,
    		$$scope,
    		slots
    	];
    }

    class Route extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { path: 8, component: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Route",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get path() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set path(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get component() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set component(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-routing/src/Link.svelte generated by Svelte v3.42.1 */
    const file = "node_modules/svelte-routing/src/Link.svelte";

    function create_fragment$2(ctx) {
    	let a;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[15].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[14], null);

    	let a_levels = [
    		{ href: /*href*/ ctx[0] },
    		{ "aria-current": /*ariaCurrent*/ ctx[2] },
    		/*props*/ ctx[1]
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			set_attributes(a, a_data);
    			add_location(a, file, 40, 0, 1249);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*onClick*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16384)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[14],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[14])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[14], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				(!current || dirty & /*href*/ 1) && { href: /*href*/ ctx[0] },
    				(!current || dirty & /*ariaCurrent*/ 4) && { "aria-current": /*ariaCurrent*/ ctx[2] },
    				dirty & /*props*/ 2 && /*props*/ ctx[1]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let ariaCurrent;
    	let $location;
    	let $base;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Link', slots, ['default']);
    	let { to = "#" } = $$props;
    	let { replace = false } = $$props;
    	let { state = {} } = $$props;
    	let { getProps = () => ({}) } = $$props;
    	const { base } = getContext(ROUTER);
    	validate_store(base, 'base');
    	component_subscribe($$self, base, value => $$invalidate(13, $base = value));
    	const location = getContext(LOCATION);
    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(12, $location = value));
    	const dispatch = createEventDispatcher();
    	let href, isPartiallyCurrent, isCurrent, props;

    	function onClick(event) {
    		dispatch("click", event);

    		if (shouldNavigate(event)) {
    			event.preventDefault();

    			// Don't push another entry to the history stack when the user
    			// clicks on a Link to the page they are currently on.
    			const shouldReplace = $location.pathname === href || replace;

    			navigate(href, { state, replace: shouldReplace });
    		}
    	}

    	const writable_props = ['to', 'replace', 'state', 'getProps'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Link> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('to' in $$props) $$invalidate(6, to = $$props.to);
    		if ('replace' in $$props) $$invalidate(7, replace = $$props.replace);
    		if ('state' in $$props) $$invalidate(8, state = $$props.state);
    		if ('getProps' in $$props) $$invalidate(9, getProps = $$props.getProps);
    		if ('$$scope' in $$props) $$invalidate(14, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		createEventDispatcher,
    		ROUTER,
    		LOCATION,
    		navigate,
    		startsWith,
    		resolve,
    		shouldNavigate,
    		to,
    		replace,
    		state,
    		getProps,
    		base,
    		location,
    		dispatch,
    		href,
    		isPartiallyCurrent,
    		isCurrent,
    		props,
    		onClick,
    		ariaCurrent,
    		$location,
    		$base
    	});

    	$$self.$inject_state = $$props => {
    		if ('to' in $$props) $$invalidate(6, to = $$props.to);
    		if ('replace' in $$props) $$invalidate(7, replace = $$props.replace);
    		if ('state' in $$props) $$invalidate(8, state = $$props.state);
    		if ('getProps' in $$props) $$invalidate(9, getProps = $$props.getProps);
    		if ('href' in $$props) $$invalidate(0, href = $$props.href);
    		if ('isPartiallyCurrent' in $$props) $$invalidate(10, isPartiallyCurrent = $$props.isPartiallyCurrent);
    		if ('isCurrent' in $$props) $$invalidate(11, isCurrent = $$props.isCurrent);
    		if ('props' in $$props) $$invalidate(1, props = $$props.props);
    		if ('ariaCurrent' in $$props) $$invalidate(2, ariaCurrent = $$props.ariaCurrent);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*to, $base*/ 8256) {
    			 $$invalidate(0, href = to === "/" ? $base.uri : resolve(to, $base.uri));
    		}

    		if ($$self.$$.dirty & /*$location, href*/ 4097) {
    			 $$invalidate(10, isPartiallyCurrent = startsWith($location.pathname, href));
    		}

    		if ($$self.$$.dirty & /*href, $location*/ 4097) {
    			 $$invalidate(11, isCurrent = href === $location.pathname);
    		}

    		if ($$self.$$.dirty & /*isCurrent*/ 2048) {
    			 $$invalidate(2, ariaCurrent = isCurrent ? "page" : undefined);
    		}

    		if ($$self.$$.dirty & /*getProps, $location, href, isPartiallyCurrent, isCurrent*/ 7681) {
    			 $$invalidate(1, props = getProps({
    				location: $location,
    				href,
    				isPartiallyCurrent,
    				isCurrent
    			}));
    		}
    	};

    	return [
    		href,
    		props,
    		ariaCurrent,
    		base,
    		location,
    		onClick,
    		to,
    		replace,
    		state,
    		getProps,
    		isPartiallyCurrent,
    		isCurrent,
    		$location,
    		$base,
    		$$scope,
    		slots
    	];
    }

    class Link extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { to: 6, replace: 7, state: 8, getProps: 9 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Link",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get to() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set to(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get replace() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set replace(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get state() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getProps() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getProps(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /**
     * An action to be added at a root element of your application to
     * capture all relative links and push them onto the history stack.
     *
     * Example:
     * ```html
     * <div use:links>
     *   <Router>
     *     <Route path="/" component={Home} />
     *     <Route path="/p/:projectId/:docId?" component={ProjectScreen} />
     *     {#each projects as project}
     *       <a href="/p/{project.id}">{project.title}</a>
     *     {/each}
     *   </Router>
     * </div>
     * ```
     */
    function links(node) {
      function findClosest(tagName, el) {
        while (el && el.tagName !== tagName) {
          el = el.parentNode;
        }
        return el;
      }

      function onClick(event) {
        const anchor = findClosest("A", event.target);

        if (
          anchor &&
          anchor.target === "" &&
          hostMatches(anchor) &&
          shouldNavigate(event) &&
          !anchor.hasAttribute("noroute")
        ) {
          event.preventDefault();
          navigate(anchor.pathname + anchor.search, { replace: anchor.hasAttribute("replace") });
        }
      }

      node.addEventListener("click", onClick);

      return {
        destroy() {
          node.removeEventListener("click", onClick);
        }
      };
    }

    /* src/components/nav/NavLink.svelte generated by Svelte v3.42.1 */

    // (7:0) <Link {to} {getProps}>
    function create_default_slot(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[3],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(7:0) <Link {to} {getProps}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let link;
    	let current;

    	link = new Link({
    			props: {
    				to: /*to*/ ctx[0],
    				getProps: /*getProps*/ ctx[1],
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(link.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(link, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const link_changes = {};
    			if (dirty & /*to*/ 1) link_changes.to = /*to*/ ctx[0];

    			if (dirty & /*$$scope*/ 8) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(link, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('NavLink', slots, ['default']);
    	let { to = "" } = $$props;
    	const getProps = ({ isCurrent }) => ({ class: isCurrent ? "active" : "" });
    	const writable_props = ['to'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<NavLink> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('to' in $$props) $$invalidate(0, to = $$props.to);
    		if ('$$scope' in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ Link, to, getProps });

    	$$self.$inject_state = $$props => {
    		if ('to' in $$props) $$invalidate(0, to = $$props.to);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [to, getProps, slots, $$scope];
    }

    class NavLink extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { to: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NavLink",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get to() {
    		throw new Error("<NavLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set to(value) {
    		throw new Error("<NavLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/nav/MenuIcon.svelte generated by Svelte v3.42.1 */

    const file$1 = "src/components/nav/MenuIcon.svelte";

    function create_fragment$4(ctx) {
    	let div3;
    	let div0;
    	let t0;
    	let div1;
    	let t1;
    	let div2;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			t1 = space();
    			div2 = element("div");
    			attr_dev(div0, "class", "stripe-top svelte-w1b8w0");
    			add_location(div0, file$1, 39, 2, 745);
    			attr_dev(div1, "class", "stripe-middle svelte-w1b8w0");
    			add_location(div1, file$1, 40, 2, 774);
    			attr_dev(div2, "class", "stripe-bottom svelte-w1b8w0");
    			add_location(div2, file$1, 41, 2, 806);
    			attr_dev(div3, "class", "container svelte-w1b8w0");
    			toggle_class(div3, "menuToggled", /*menuToggled*/ ctx[0]);
    			add_location(div3, file$1, 38, 0, 701);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			append_dev(div3, t0);
    			append_dev(div3, div1);
    			append_dev(div3, t1);
    			append_dev(div3, div2);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*menuToggled*/ 1) {
    				toggle_class(div3, "menuToggled", /*menuToggled*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MenuIcon', slots, []);
    	let { menuToggled = false } = $$props;
    	const writable_props = ['menuToggled'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MenuIcon> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('menuToggled' in $$props) $$invalidate(0, menuToggled = $$props.menuToggled);
    	};

    	$$self.$capture_state = () => ({ menuToggled });

    	$$self.$inject_state = $$props => {
    		if ('menuToggled' in $$props) $$invalidate(0, menuToggled = $$props.menuToggled);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [menuToggled];
    }

    class MenuIcon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { menuToggled: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MenuIcon",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get menuToggled() {
    		throw new Error("<MenuIcon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set menuToggled(value) {
    		throw new Error("<MenuIcon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Bullet.svelte generated by Svelte v3.42.1 */

    const file$2 = "src/components/Bullet.svelte";

    function create_fragment$5(ctx) {
    	let li;
    	let span;
    	let i;
    	let t;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			li = element("li");
    			span = element("span");
    			i = element("i");
    			t = space();
    			if (default_slot) default_slot.c();
    			attr_dev(i, "class", "fas fa-arrow-right green");
    			add_location(i, file$2, 2, 4, 32);
    			attr_dev(span, "class", "fa-li");
    			add_location(span, file$2, 1, 2, 7);
    			attr_dev(li, "class", "svelte-1yuddas");
    			add_location(li, file$2, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, span);
    			append_dev(span, i);
    			append_dev(li, t);

    			if (default_slot) {
    				default_slot.m(li, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Bullet', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Bullet> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class Bullet extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Bullet",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/components/About.svelte generated by Svelte v3.42.1 */
    const file$3 = "src/components/About.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	return child_ctx;
    }

    // (7:2) {#each about.social as social}
    function create_each_block_3(ctx) {
    	let a;
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let t;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			a = element("a");
    			img = element("img");
    			t = space();
    			if (!src_url_equal(img.src, img_src_value = /*social*/ ctx[10].src)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*social*/ ctx[10].alt);
    			add_location(img, file$3, 8, 6, 230);
    			attr_dev(a, "href", a_href_value = /*social*/ ctx[10].link);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "class", "scale svelte-11dhnu5");
    			add_location(a, file$3, 7, 4, 171);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, img);
    			append_dev(a, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*about*/ 1 && !src_url_equal(img.src, img_src_value = /*social*/ ctx[10].src)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*about*/ 1 && img_alt_value !== (img_alt_value = /*social*/ ctx[10].alt)) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (dirty & /*about*/ 1 && a_href_value !== (a_href_value = /*social*/ ctx[10].link)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3.name,
    		type: "each",
    		source: "(7:2) {#each about.social as social}",
    		ctx
    	});

    	return block;
    }

    // (22:8) <Bullet>
    function create_default_slot_2(ctx) {
    	let html_tag;
    	let raw_value = /*grow*/ ctx[7] + "";
    	let t;

    	const block = {
    		c: function create() {
    			html_tag = new HtmlTag();
    			t = space();
    			html_tag.a = t;
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(raw_value, target, anchor);
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*about*/ 1 && raw_value !== (raw_value = /*grow*/ ctx[7] + "")) html_tag.p(raw_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) html_tag.d();
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(22:8) <Bullet>",
    		ctx
    	});

    	return block;
    }

    // (21:6) {#each about.grow as grow}
    function create_each_block_2(ctx) {
    	let bullet;
    	let current;

    	bullet = new Bullet({
    			props: {
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(bullet.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(bullet, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const bullet_changes = {};

    			if (dirty & /*$$scope, about*/ 8193) {
    				bullet_changes.$$scope = { dirty, ctx };
    			}

    			bullet.$set(bullet_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(bullet.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(bullet.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(bullet, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(21:6) {#each about.grow as grow}",
    		ctx
    	});

    	return block;
    }

    // (32:8) <Bullet>
    function create_default_slot_1(ctx) {
    	let html_tag;
    	let raw_value = /*funFacts*/ ctx[4] + "";
    	let t;

    	const block = {
    		c: function create() {
    			html_tag = new HtmlTag();
    			t = space();
    			html_tag.a = t;
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(raw_value, target, anchor);
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*about*/ 1 && raw_value !== (raw_value = /*funFacts*/ ctx[4] + "")) html_tag.p(raw_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) html_tag.d();
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(32:8) <Bullet>",
    		ctx
    	});

    	return block;
    }

    // (31:6) {#each about.funFacts as funFacts}
    function create_each_block_1(ctx) {
    	let bullet;
    	let current;

    	bullet = new Bullet({
    			props: {
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(bullet.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(bullet, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const bullet_changes = {};

    			if (dirty & /*$$scope, about*/ 8193) {
    				bullet_changes.$$scope = { dirty, ctx };
    			}

    			bullet.$set(bullet_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(bullet.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(bullet.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(bullet, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(31:6) {#each about.funFacts as funFacts}",
    		ctx
    	});

    	return block;
    }

    // (42:8) <Bullet>
    function create_default_slot$1(ctx) {
    	let html_tag;
    	let raw_value = /*use*/ ctx[1] + "";
    	let t;

    	const block = {
    		c: function create() {
    			html_tag = new HtmlTag();
    			t = space();
    			html_tag.a = t;
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(raw_value, target, anchor);
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*about*/ 1 && raw_value !== (raw_value = /*use*/ ctx[1] + "")) html_tag.p(raw_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) html_tag.d();
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(42:8) <Bullet>",
    		ctx
    	});

    	return block;
    }

    // (41:6) {#each about.using as use}
    function create_each_block(ctx) {
    	let bullet;
    	let current;

    	bullet = new Bullet({
    			props: {
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(bullet.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(bullet, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const bullet_changes = {};

    			if (dirty & /*$$scope, about*/ 8193) {
    				bullet_changes.$$scope = { dirty, ctx };
    			}

    			bullet.$set(bullet_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(bullet.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(bullet.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(bullet, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(41:6) {#each about.using as use}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div0;
    	let t0;
    	let div5;
    	let div1;
    	let h20;
    	let t2;
    	let p;
    	let t3_value = /*about*/ ctx[0].who + "";
    	let t3;
    	let t4;
    	let div2;
    	let h21;
    	let t6;
    	let ul0;
    	let t7;
    	let div3;
    	let h22;
    	let t9;
    	let ul1;
    	let t10;
    	let div4;
    	let h23;
    	let t12;
    	let ul2;
    	let current;
    	let each_value_3 = /*about*/ ctx[0].social;
    	validate_each_argument(each_value_3);
    	let each_blocks_3 = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks_3[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
    	}

    	let each_value_2 = /*about*/ ctx[0].grow;
    	validate_each_argument(each_value_2);
    	let each_blocks_2 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_2[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	const out = i => transition_out(each_blocks_2[i], 1, 1, () => {
    		each_blocks_2[i] = null;
    	});

    	let each_value_1 = /*about*/ ctx[0].funFacts;
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out_1 = i => transition_out(each_blocks_1[i], 1, 1, () => {
    		each_blocks_1[i] = null;
    	});

    	let each_value = /*about*/ ctx[0].using;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out_2 = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div0 = element("div");

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				each_blocks_3[i].c();
    			}

    			t0 = space();
    			div5 = element("div");
    			div1 = element("div");
    			h20 = element("h2");
    			h20.textContent = "who am i 🙆‍♂️";
    			t2 = space();
    			p = element("p");
    			t3 = text(t3_value);
    			t4 = space();
    			div2 = element("div");
    			h21 = element("h2");
    			h21.textContent = "how i grow 💪";
    			t6 = space();
    			ul0 = element("ul");

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			t7 = space();
    			div3 = element("div");
    			h22 = element("h2");
    			h22.textContent = "fun facts 🏂";
    			t9 = space();
    			ul1 = element("ul");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t10 = space();
    			div4 = element("div");
    			h23 = element("h2");
    			h23.textContent = "What I use 💻";
    			t12 = space();
    			ul2 = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "social-media-container svelte-11dhnu5");
    			add_location(div0, file$3, 5, 0, 97);
    			add_location(h20, file$3, 14, 4, 340);
    			attr_dev(p, "class", "svelte-11dhnu5");
    			add_location(p, file$3, 15, 4, 368);
    			add_location(div1, file$3, 13, 2, 330);
    			add_location(h21, file$3, 18, 4, 408);
    			attr_dev(ul0, "class", "fa-ul svelte-11dhnu5");
    			add_location(ul0, file$3, 19, 4, 435);
    			add_location(div2, file$3, 17, 2, 398);
    			add_location(h22, file$3, 28, 4, 590);
    			attr_dev(ul1, "class", "fa-ul svelte-11dhnu5");
    			add_location(ul1, file$3, 29, 4, 616);
    			add_location(div3, file$3, 27, 2, 580);
    			add_location(h23, file$3, 38, 4, 783);
    			attr_dev(ul2, "class", "fa-ul svelte-11dhnu5");
    			add_location(ul2, file$3, 39, 4, 810);
    			add_location(div4, file$3, 37, 2, 773);
    			attr_dev(div5, "class", "about-container svelte-11dhnu5");
    			add_location(div5, file$3, 12, 0, 298);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				each_blocks_3[i].m(div0, null);
    			}

    			insert_dev(target, t0, anchor);
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div1);
    			append_dev(div1, h20);
    			append_dev(div1, t2);
    			append_dev(div1, p);
    			append_dev(p, t3);
    			append_dev(div5, t4);
    			append_dev(div5, div2);
    			append_dev(div2, h21);
    			append_dev(div2, t6);
    			append_dev(div2, ul0);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].m(ul0, null);
    			}

    			append_dev(div5, t7);
    			append_dev(div5, div3);
    			append_dev(div3, h22);
    			append_dev(div3, t9);
    			append_dev(div3, ul1);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(ul1, null);
    			}

    			append_dev(div5, t10);
    			append_dev(div5, div4);
    			append_dev(div4, h23);
    			append_dev(div4, t12);
    			append_dev(div4, ul2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul2, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*about*/ 1) {
    				each_value_3 = /*about*/ ctx[0].social;
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3(ctx, each_value_3, i);

    					if (each_blocks_3[i]) {
    						each_blocks_3[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_3[i] = create_each_block_3(child_ctx);
    						each_blocks_3[i].c();
    						each_blocks_3[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks_3.length; i += 1) {
    					each_blocks_3[i].d(1);
    				}

    				each_blocks_3.length = each_value_3.length;
    			}

    			if ((!current || dirty & /*about*/ 1) && t3_value !== (t3_value = /*about*/ ctx[0].who + "")) set_data_dev(t3, t3_value);

    			if (dirty & /*about*/ 1) {
    				each_value_2 = /*about*/ ctx[0].grow;
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks_2[i]) {
    						each_blocks_2[i].p(child_ctx, dirty);
    						transition_in(each_blocks_2[i], 1);
    					} else {
    						each_blocks_2[i] = create_each_block_2(child_ctx);
    						each_blocks_2[i].c();
    						transition_in(each_blocks_2[i], 1);
    						each_blocks_2[i].m(ul0, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_2.length; i < each_blocks_2.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (dirty & /*about*/ 1) {
    				each_value_1 = /*about*/ ctx[0].funFacts;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    						transition_in(each_blocks_1[i], 1);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						transition_in(each_blocks_1[i], 1);
    						each_blocks_1[i].m(ul1, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks_1.length; i += 1) {
    					out_1(i);
    				}

    				check_outros();
    			}

    			if (dirty & /*about*/ 1) {
    				each_value = /*about*/ ctx[0].using;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(ul2, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out_2(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_2.length; i += 1) {
    				transition_in(each_blocks_2[i]);
    			}

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks_1[i]);
    			}

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks_2 = each_blocks_2.filter(Boolean);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				transition_out(each_blocks_2[i]);
    			}

    			each_blocks_1 = each_blocks_1.filter(Boolean);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				transition_out(each_blocks_1[i]);
    			}

    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			destroy_each(each_blocks_3, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div5);
    			destroy_each(each_blocks_2, detaching);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('About', slots, []);
    	let { about = {} } = $$props;
    	const writable_props = ['about'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<About> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('about' in $$props) $$invalidate(0, about = $$props.about);
    	};

    	$$self.$capture_state = () => ({ Bullet, about });

    	$$self.$inject_state = $$props => {
    		if ('about' in $$props) $$invalidate(0, about = $$props.about);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [about];
    }

    class About extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { about: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "About",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get about() {
    		throw new Error("<About>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set about(value) {
    		throw new Error("<About>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/routes/Landing.svelte generated by Svelte v3.42.1 */
    const file$4 = "src/routes/Landing.svelte";

    function create_fragment$7(ctx) {
    	let section;
    	let div2;
    	let div0;
    	let h1;
    	let t0;
    	let span0;
    	let t2;
    	let div1;
    	let p;
    	let t3;
    	let span1;
    	let t5;
    	let t6;
    	let about_1;
    	let current;

    	about_1 = new About({
    			props: { about: /*about*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			section = element("section");
    			div2 = element("div");
    			div0 = element("div");
    			h1 = element("h1");
    			t0 = text("👋 Hi! I'm\n        ");
    			span0 = element("span");
    			span0.textContent = `${/*name*/ ctx[1]}`;
    			t2 = space();
    			div1 = element("div");
    			p = element("p");
    			t3 = text("I work with people, organizations, and technology to make doing\n        ");
    			span1 = element("span");
    			span1.textContent = "good";
    			t5 = text("\n        easier for everyone");
    			t6 = space();
    			create_component(about_1.$$.fragment);
    			attr_dev(span0, "class", "highlight svelte-xbov6t");
    			add_location(span0, file$4, 12, 8, 261);
    			attr_dev(h1, "class", "svelte-xbov6t");
    			add_location(h1, file$4, 10, 6, 229);
    			add_location(div0, file$4, 9, 4, 217);
    			attr_dev(span1, "class", "highlight-good underline svelte-xbov6t");
    			add_location(span1, file$4, 18, 8, 447);
    			attr_dev(p, "class", "svelte-xbov6t");
    			add_location(p, file$4, 16, 6, 363);
    			attr_dev(div1, "class", "saying-container svelte-xbov6t");
    			add_location(div1, file$4, 15, 4, 326);
    			attr_dev(div2, "class", "landing-container svelte-xbov6t");
    			add_location(div2, file$4, 8, 2, 181);
    			add_location(section, file$4, 7, 0, 169);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div2);
    			append_dev(div2, div0);
    			append_dev(div0, h1);
    			append_dev(h1, t0);
    			append_dev(h1, span0);
    			append_dev(div2, t2);
    			append_dev(div2, div1);
    			append_dev(div1, p);
    			append_dev(p, t3);
    			append_dev(p, span1);
    			append_dev(p, t5);
    			append_dev(section, t6);
    			mount_component(about_1, section, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const about_1_changes = {};
    			if (dirty & /*about*/ 1) about_1_changes.about = /*about*/ ctx[0];
    			about_1.$set(about_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(about_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(about_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_component(about_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Landing', slots, []);
    	let name = "James";
    	let { about = {} } = $$props;
    	const writable_props = ['about'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Landing> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('about' in $$props) $$invalidate(0, about = $$props.about);
    	};

    	$$self.$capture_state = () => ({ Bullet, About, name, about });

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(1, name = $$props.name);
    		if ('about' in $$props) $$invalidate(0, about = $$props.about);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [about, name];
    }

    class Landing extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { about: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Landing",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get about() {
    		throw new Error("<Landing>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set about(value) {
    		throw new Error("<Landing>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/work/Project.svelte generated by Svelte v3.42.1 */

    const file$5 = "src/components/work/Project.svelte";

    function create_fragment$8(ctx) {
    	let a;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let div1;
    	let h3;
    	let t1;
    	let t2;
    	let h40;
    	let t3;
    	let t4;
    	let h41;
    	let t5;

    	const block = {
    		c: function create() {
    			a = element("a");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			div1 = element("div");
    			h3 = element("h3");
    			t1 = text(/*name*/ ctx[0]);
    			t2 = space();
    			h40 = element("h4");
    			t3 = text(/*positionName*/ ctx[4]);
    			t4 = space();
    			h41 = element("h4");
    			t5 = text(/*year*/ ctx[5]);
    			if (!src_url_equal(img.src, img_src_value = /*src*/ ctx[1])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", /*alt*/ ctx[2]);
    			attr_dev(img, "class", "svelte-1fubprw");
    			add_location(img, file$5, 12, 4, 293);
    			attr_dev(div0, "class", "img-container svelte-1fubprw");
    			add_location(div0, file$5, 11, 2, 261);
    			attr_dev(h3, "class", "svelte-1fubprw");
    			add_location(h3, file$5, 15, 4, 357);
    			attr_dev(h40, "class", "svelte-1fubprw");
    			add_location(h40, file$5, 16, 4, 377);
    			attr_dev(h41, "class", "svelte-1fubprw");
    			add_location(h41, file$5, 17, 4, 405);
    			attr_dev(div1, "class", "desc-container svelte-1fubprw");
    			add_location(div1, file$5, 14, 2, 324);
    			attr_dev(a, "href", /*link*/ ctx[3]);
    			attr_dev(a, "class", "container svelte-1fubprw");
    			attr_dev(a, "target", "_blank");
    			add_location(a, file$5, 10, 0, 209);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, div0);
    			append_dev(div0, img);
    			append_dev(a, t0);
    			append_dev(a, div1);
    			append_dev(div1, h3);
    			append_dev(h3, t1);
    			append_dev(div1, t2);
    			append_dev(div1, h40);
    			append_dev(h40, t3);
    			append_dev(div1, t4);
    			append_dev(div1, h41);
    			append_dev(h41, t5);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*src*/ 2 && !src_url_equal(img.src, img_src_value = /*src*/ ctx[1])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*alt*/ 4) {
    				attr_dev(img, "alt", /*alt*/ ctx[2]);
    			}

    			if (dirty & /*name*/ 1) set_data_dev(t1, /*name*/ ctx[0]);
    			if (dirty & /*positionName*/ 16) set_data_dev(t3, /*positionName*/ ctx[4]);
    			if (dirty & /*year*/ 32) set_data_dev(t5, /*year*/ ctx[5]);

    			if (dirty & /*link*/ 8) {
    				attr_dev(a, "href", /*link*/ ctx[3]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Project', slots, []);
    	let { name = "" } = $$props;
    	let { src = "" } = $$props;
    	let { alt = "" } = $$props;
    	let { link = "" } = $$props;
    	let { positionName = "" } = $$props;
    	let { year = "" } = $$props;
    	const writable_props = ['name', 'src', 'alt', 'link', 'positionName', 'year'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Project> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('src' in $$props) $$invalidate(1, src = $$props.src);
    		if ('alt' in $$props) $$invalidate(2, alt = $$props.alt);
    		if ('link' in $$props) $$invalidate(3, link = $$props.link);
    		if ('positionName' in $$props) $$invalidate(4, positionName = $$props.positionName);
    		if ('year' in $$props) $$invalidate(5, year = $$props.year);
    	};

    	$$self.$capture_state = () => ({ name, src, alt, link, positionName, year });

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('src' in $$props) $$invalidate(1, src = $$props.src);
    		if ('alt' in $$props) $$invalidate(2, alt = $$props.alt);
    		if ('link' in $$props) $$invalidate(3, link = $$props.link);
    		if ('positionName' in $$props) $$invalidate(4, positionName = $$props.positionName);
    		if ('year' in $$props) $$invalidate(5, year = $$props.year);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [name, src, alt, link, positionName, year];
    }

    class Project extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {
    			name: 0,
    			src: 1,
    			alt: 2,
    			link: 3,
    			positionName: 4,
    			year: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Project",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get name() {
    		throw new Error("<Project>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Project>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get src() {
    		throw new Error("<Project>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set src(value) {
    		throw new Error("<Project>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get alt() {
    		throw new Error("<Project>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set alt(value) {
    		throw new Error("<Project>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get link() {
    		throw new Error("<Project>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set link(value) {
    		throw new Error("<Project>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get positionName() {
    		throw new Error("<Project>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set positionName(value) {
    		throw new Error("<Project>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get year() {
    		throw new Error("<Project>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set year(value) {
    		throw new Error("<Project>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/routes/Work.svelte generated by Svelte v3.42.1 */
    const file$6 = "src/routes/Work.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (16:4) {#each work.current as project}
    function create_each_block_1$1(ctx) {
    	let project;
    	let current;
    	const project_spread_levels = [/*project*/ ctx[1]];
    	let project_props = {};

    	for (let i = 0; i < project_spread_levels.length; i += 1) {
    		project_props = assign(project_props, project_spread_levels[i]);
    	}

    	project = new Project({ props: project_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(project.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(project, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const project_changes = (dirty & /*work*/ 1)
    			? get_spread_update(project_spread_levels, [get_spread_object(/*project*/ ctx[1])])
    			: {};

    			project.$set(project_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(project.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(project.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(project, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(16:4) {#each work.current as project}",
    		ctx
    	});

    	return block;
    }

    // (22:4) {#each work.old as project}
    function create_each_block$1(ctx) {
    	let project;
    	let current;
    	const project_spread_levels = [/*project*/ ctx[1]];
    	let project_props = {};

    	for (let i = 0; i < project_spread_levels.length; i += 1) {
    		project_props = assign(project_props, project_spread_levels[i]);
    	}

    	project = new Project({ props: project_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(project.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(project, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const project_changes = (dirty & /*work*/ 1)
    			? get_spread_update(project_spread_levels, [get_spread_object(/*project*/ ctx[1])])
    			: {};

    			project.$set(project_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(project.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(project.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(project, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(22:4) {#each work.old as project}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let section;
    	let h1;
    	let t1;
    	let p;
    	let t3;
    	let h20;
    	let t5;
    	let div0;
    	let t6;
    	let h21;
    	let t8;
    	let div1;
    	let current;
    	let each_value_1 = /*work*/ ctx[0].current;
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks_1[i], 1, 1, () => {
    		each_blocks_1[i] = null;
    	});

    	let each_value = /*work*/ ctx[0].old;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out_1 = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			section = element("section");
    			h1 = element("h1");
    			h1.textContent = "Work 📍";
    			t1 = space();
    			p = element("p");
    			p.textContent = "Work is probably the wrong word. This is a congolmeration of projects,\n    internships, research, and leadership roles. We could call it PIRL, but I\n    don't think anyone would understand. I could make it a new trend, but I\n    think it would be a losing battle.";
    			t3 = space();
    			h20 = element("h2");
    			h20.textContent = "current works";
    			t5 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t6 = space();
    			h21 = element("h2");
    			h21.textContent = "previous works";
    			t8 = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h1, "class", "svelte-z37doy");
    			add_location(h1, file$6, 6, 2, 138);
    			attr_dev(p, "class", "first-container svelte-z37doy");
    			add_location(p, file$6, 7, 2, 157);
    			attr_dev(h20, "class", "svelte-z37doy");
    			add_location(h20, file$6, 13, 2, 462);
    			attr_dev(div0, "class", "projects-container svelte-z37doy");
    			add_location(div0, file$6, 14, 2, 487);
    			attr_dev(h21, "class", "svelte-z37doy");
    			add_location(h21, file$6, 19, 2, 610);
    			attr_dev(div1, "class", "projects-container svelte-z37doy");
    			add_location(div1, file$6, 20, 2, 636);
    			attr_dev(section, "class", "work-container svelte-z37doy");
    			add_location(section, file$6, 5, 0, 103);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, h1);
    			append_dev(section, t1);
    			append_dev(section, p);
    			append_dev(section, t3);
    			append_dev(section, h20);
    			append_dev(section, t5);
    			append_dev(section, div0);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div0, null);
    			}

    			append_dev(section, t6);
    			append_dev(section, h21);
    			append_dev(section, t8);
    			append_dev(section, div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*work*/ 1) {
    				each_value_1 = /*work*/ ctx[0].current;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    						transition_in(each_blocks_1[i], 1);
    					} else {
    						each_blocks_1[i] = create_each_block_1$1(child_ctx);
    						each_blocks_1[i].c();
    						transition_in(each_blocks_1[i], 1);
    						each_blocks_1[i].m(div0, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks_1.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (dirty & /*work*/ 1) {
    				each_value = /*work*/ ctx[0].old;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div1, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out_1(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks_1[i]);
    			}

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks_1 = each_blocks_1.filter(Boolean);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				transition_out(each_blocks_1[i]);
    			}

    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Work', slots, []);
    	let { work = {} } = $$props;
    	const writable_props = ['work'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Work> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('work' in $$props) $$invalidate(0, work = $$props.work);
    	};

    	$$self.$capture_state = () => ({ Project, work });

    	$$self.$inject_state = $$props => {
    		if ('work' in $$props) $$invalidate(0, work = $$props.work);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [work];
    }

    class Work extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { work: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Work",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get work() {
    		throw new Error("<Work>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set work(value) {
    		throw new Error("<Work>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/routes/Resume.svelte generated by Svelte v3.42.1 */
    const file$7 = "src/routes/Resume.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    // (31:12) <Bullet>
    function create_default_slot$2(ctx) {
    	let html_tag;
    	let raw_value = /*failure*/ ctx[5] + "";
    	let t;

    	const block = {
    		c: function create() {
    			html_tag = new HtmlTag();
    			t = space();
    			html_tag.a = t;
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(raw_value, target, anchor);
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*Resume*/ 1 && raw_value !== (raw_value = /*failure*/ ctx[5] + "")) html_tag.p(raw_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) html_tag.d();
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(31:12) <Bullet>",
    		ctx
    	});

    	return block;
    }

    // (30:10) {#each year[1].failures as failure}
    function create_each_block_1$2(ctx) {
    	let bullet;
    	let current;

    	bullet = new Bullet({
    			props: {
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(bullet.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(bullet, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const bullet_changes = {};

    			if (dirty & /*$$scope, Resume*/ 257) {
    				bullet_changes.$$scope = { dirty, ctx };
    			}

    			bullet.$set(bullet_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(bullet.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(bullet.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(bullet, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$2.name,
    		type: "each",
    		source: "(30:10) {#each year[1].failures as failure}",
    		ctx
    	});

    	return block;
    }

    // (25:2) {#each Resume as year}
    function create_each_block$2(ctx) {
    	let h2;
    	let t0_value = /*year*/ ctx[2][0] + "";
    	let t0;
    	let t1;
    	let div1;
    	let div0;
    	let ul;
    	let t2;
    	let current;
    	let each_value_1 = /*year*/ ctx[2][1].failures;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$2(get_each_context_1$2(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			t0 = text(t0_value);
    			t1 = space();
    			div1 = element("div");
    			div0 = element("div");
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			attr_dev(h2, "class", "svelte-zq6h7r");
    			add_location(h2, file$7, 25, 4, 827);
    			attr_dev(ul, "class", "fa-ul svelte-zq6h7r");
    			add_location(ul, file$7, 28, 8, 916);
    			attr_dev(div0, "class", "year-container svelte-zq6h7r");
    			add_location(div0, file$7, 27, 6, 879);
    			attr_dev(div1, "class", "suc-fail svelte-zq6h7r");
    			add_location(div1, file$7, 26, 4, 850);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			append_dev(h2, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			append_dev(div1, t2);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*Resume*/ 1) && t0_value !== (t0_value = /*year*/ ctx[2][0] + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*Resume*/ 1) {
    				each_value_1 = /*year*/ ctx[2][1].failures;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$2(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(ul, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(25:2) {#each Resume as year}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let section;
    	let h1;
    	let t1;
    	let p0;
    	let t3;
    	let p1;
    	let t4;
    	let a;
    	let t6;
    	let current;
    	let each_value = /*Resume*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			section = element("section");
    			h1 = element("h1");
    			h1.textContent = "Failure Resume 📰";
    			t1 = space();
    			p0 = element("p");
    			p0.textContent = "They say you learn more from your failures than your successes. I see my\n    failure résumé as a list of times where I didn't reach where I thought I\n    could have or made choices I shouldn't have made. Rather than being\n    disappointed (though maybe a little at the time), I'm proud to be a failure!";
    			t3 = space();
    			p1 = element("p");
    			t4 = text("If you're actually looking for my Resume,\n    ");
    			a = element("a");
    			a.textContent = "click here";
    			t6 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h1, "class", "svelte-zq6h7r");
    			add_location(h1, file$7, 8, 2, 199);
    			attr_dev(p0, "class", "first-container svelte-zq6h7r");
    			add_location(p0, file$7, 9, 2, 228);
    			attr_dev(a, "href", "https://drive.google.com/file/d/1CdWiiL3dTYvhftb4kA_G_jg2-_blM96b/view");
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "class", "svelte-zq6h7r");
    			add_location(a, file$7, 17, 4, 650);
    			attr_dev(p1, "class", "first-container svelte-zq6h7r");
    			add_location(p1, file$7, 15, 2, 572);
    			attr_dev(section, "class", "resume-container svelte-zq6h7r");
    			add_location(section, file$7, 7, 0, 162);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, h1);
    			append_dev(section, t1);
    			append_dev(section, p0);
    			append_dev(section, t3);
    			append_dev(section, p1);
    			append_dev(p1, t4);
    			append_dev(p1, a);
    			append_dev(section, t6);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(section, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*Resume*/ 1) {
    				each_value = /*Resume*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(section, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Resume', slots, []);
    	let { Resume = [] } = $$props;
    	let scrollClipHeight = 0;
    	const writable_props = ['Resume'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Resume> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('Resume' in $$props) $$invalidate(0, Resume = $$props.Resume);
    	};

    	$$self.$capture_state = () => ({
    		Bullet,
    		onMount,
    		Resume,
    		scrollClipHeight
    	});

    	$$self.$inject_state = $$props => {
    		if ('Resume' in $$props) $$invalidate(0, Resume = $$props.Resume);
    		if ('scrollClipHeight' in $$props) scrollClipHeight = $$props.scrollClipHeight;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [Resume];
    }

    class Resume_1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { Resume: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Resume_1",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get Resume() {
    		throw new Error("<Resume>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set Resume(value) {
    		throw new Error("<Resume>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var content = {
      about: {
        who: "I am an aspiring product manager who wants to make doing good easier. I resigned from my job for the summer, so I'm in ~recovery~ mode this summer before I start my 5th (hopefully last) year of university. Reach out if you want to chat!",
        grow: [
          "Improve writing ability and write more",
          "Be a better <a href='https://medium.com/pminsider/storytelling-for-product-managers-fc1a758eb303' target='blank_'>storyteller</a>",
          "Become a better ambassador of the <a href='https://ssir.org/articles/entry/how_tech_can_maximize_social_impact' target='blank_'>social impact space</a>",
          "Code more often and learn more tools",
          "<a href='https://medium.com/the-year-of-the-looking-glass/always-be-learning-a4ed3fe09f26' target='blank_'>Read</a> with a purpose",
        ],
        social: [
          {
            name: "Email",
            src: "https://res.cloudinary.com/thejameswang/image/upload/v1588182214/thejameswang/Email_ucg7dj.png",
            alt: "Email Logo",
            link: "j.wang5441@gmail.com",
          },
          {
            name: "Github",
            src: "https://res.cloudinary.com/thejameswang/image/upload/v1588182214/thejameswang/Github_uqhbox.png",
            alt: "Github Logo",
            link: "https://github.com/thejameswang",
          },
          {
            name: "Linkedin",
            src: "https://res.cloudinary.com/thejameswang/image/upload/v1588182214/thejameswang/LinkedIN_waoczb.png",
            alt: "Linkedin Logo",
            link: "https://www.linkedin.com/in/thejameswang/",
          },
          {
            name: "Instagram",
            src: "https://res.cloudinary.com/thejameswang/image/upload/v1588182214/thejameswang/Instagram_xgpog2.png",
            alt: "Instagram Logo",
            link: "https://instagram.com/thejameswang",
          },
        ],
        funFacts: [
          '📸 I love portrait <a href="https://flickr.com/people/145227047@N06/" target="blank_">photography</a>',
          "📑 I love <a href='https://www.notion.so/thejameswang/James-s-Lab-ab240025ea9243f2beef15807b3df6d9' target='blank_'>Notion</a>",
          "🏓 I play a mean game of ping pong",
          "🎾 I'm pretty good at tennis too",
          "🏛 I love the <a href='https://en.wikipedia.org/wiki/The_West_Wing' target='blank_'>West Wing</a>",
        ],
        using: [
          "<b>Computer:</b> 15-inch Macbook Pro (2017)",
          '<b>Computer:</b> I also built a computer <a href="https://docs.google.com/spreadsheets/d/1oUdx8GToxawU4YMqVFBjJHbVrYJoC47ZPjFubdAJkHg/edit?usp=sharing" target="_blank">with friends</a>',
          "<b>Notetaking:</b> Notability, but I'm starting to make a <a href='https://www.notion.so/thejameswang/Reading-2dcfc0d3c69245f7953646ea886507e4' target='_blank'>new way for myself</a>",
          "<b>Text Editor:</b> VSCode",
          "<b>Emailing:</b> Spark and Outlook",
          "<b>Calendar:</b> Google Calendar",
          "<b>Todo List:</b> Todoist and Journaling",
          "<b>Life Documenting:</b> Notion",
        ],
      },
      work: {
        current: [
          {
            src: "https://res.cloudinary.com/thejameswang/image/upload/v1588205861/thejameswang/Hack4Impact_wt6dt6.jpg",
            alt: "Hack4Impact Logo",
            positionName: "Director",
            briefDescription:
              "With 8 chapters nationwide, Hack4Impact is a 501c(3) nonprofit that helps students support their local community nonprofits through technology. I will be working to establish a stronger infrastructure for chapter collaboration and extend the reach of our nonprofit.",
            name: "Hack4Impact",
            link: "https://hack4impact.org/",
            year: "May 2020 — Present",
          },
          {
            src: "https://res.cloudinary.com/thejameswang/image/upload/v1587847532/thejameswang/Impact_mluxuw.jpg",
            alt: "Impact Labs Logo",
            positionName: "Organizer and Fellow",
            briefDescription:
              "Inspiring and empowering ambitious computer scientists to build a better world. I help with organizing, writing, and photography. I was chosen as a Fellow in 2019.",
            name: "Impact Labs",
            link: "https://www.impactlabs.io/",
            year: "DEC 2018 — Present",
          },
          {
            src: "https://res.cloudinary.com/thejameswang/image/upload/v1588433059/thejameswang/Human_Capital_d5objd.jpg",
            alt: "Human Capital Logo",
            positionName: "Student Ambassador",
            briefDescription:
              "Human Capital invests in engineers, believing we will be the ones shaping the future. As an ambassador, I help discover those engineers as well as personify the mission of Human Capital.",
            name: "Human Capital",
            link: "https://human.capital",
            year: "Nov 2019 — Present",
          },

          {
            src: "https://res.cloudinary.com/thejameswang/image/upload/v1587847532/thejameswang/HackGT_jr0awt.jpg",
            alt: "HackGT Logo",
            positionName: "Organizer",
            briefDescription:
              "HackGT is the largest hackathon in the southeast based at Georgia Tech. Working on the marketing and media team, I help procure the over 5000 applications to the largest hackathon in the southeast. I'm the primary photo editor for all HackGT photos. Formerly, I was a part of the operations team.",
            name: "HackGT",
            link: "https://hack.gt/",
            year: "DEC 2018 — Present",
          },
        ],
        old: [
          {
            src: "https://res.cloudinary.com/thejameswang/image/upload/v1624643886/thejameswang/Tesla_rcfnks.png",
            alt: "Tesla Energy Logo",
            positionName: "Technical Program Management Intern",
            briefDescription:
              "With 8 chapters nationwide, Hack4Impact is a 501c(3) nonprofit that helps students support their local community nonprofits through technology. I will be working to establish a stronger infrastructure for chapter collaboration and extend the reach of our nonprofit.",
            name: "Tesla Energy",
            link: "https://www.tesla.com/energy",
            year: "Jan 2021 — May 2021",
          },
          {
            src: "https://res.cloudinary.com/thejameswang/image/upload/v1587847531/thejameswang/Microsoft_soc4an.jpg",
            alt: "Microsoft Logo",
            positionName: "Incoming Software Developer Intern",
            briefDescription:
              "I was a part of the One Drive + Sharepoint Storage Platform Team. I ",
            name: "Microsoft",
            link: "https://www.microsoft.com/en-us/",
            year: "May 2020 — August 2020",
          },
          {
            src: "https://res.cloudinary.com/thejameswang/image/upload/v1587847532/thejameswang/BoG_uifsvt.jpg",
            alt: "Bits of Good Logo",
            positionName:
              "Executive Director, Director of Product, and Director of Engineering",
            briefDescription:
              "We connect students with nonprofits and build them custom software. I helped found the first product management and product design team. Recruited over 10 nonprofits, and tripled student membership to 150 students with over 200 applications every semester.",
            name: "Bits of Good",
            link: "https://bitsofgood.org",
            year: "Aug 2017 — May 2020",
          },
          {
            src: "https://res.cloudinary.com/thejameswang/image/upload/v1587847532/thejameswang/TID_Lab_obf4fd.jpg",
            alt: "Technology and International Development Lab Logo",
            positionName: "Undergraduate Researcher",
            briefDescription:
              "The Technologies and International Development Lab at Georgia Tech researches the practice and the promise of information and communication technologies (ICTs) in social, economic, and political development. Working on the Aggie platform, I work to develop and product manage the web application.",
            name: "Technology & International Development Lab",
            link: "http://tid.gatech.edu/",
            year: "Aug 2019 — Mar 2020",
          },
          {
            src: "https://res.cloudinary.com/thejameswang/image/upload/v1587847532/thejameswang/Enfin_ai8ho9.jpg",
            alt: "Enfin Logo",
            positionName: "Co-Founder",
            briefDescription:
              "We believe every dollar you spend has an associated carbon cost. Enfin is the beginning of a fintech application that allows users to take their bank statement data and learn their carbon footprint, allowing for offsetting and alternative carbon methods.",
            name: "Enfin",
            link: "http://envfin.herokuapp.com/",
            year: "Jan 2019 — Jan 2020",
          },
          {
            src: "https://res.cloudinary.com/thejameswang/image/upload/v1587847531/thejameswang/Microsoft_soc4an.jpg",
            alt: "Microsoft Logo",
            positionName: "Explore Intern",
            briefDescription:
              "I was a part of the One Drive Sharepoint Service Fabric team . . . where I don't even know what that means. I created a disaster recovery readiness dashboard, displaying datacenters, clusters, and databases along with metrics to establish current readiness level.",
            name: "Microsoft",
            link: "https://www.microsoft.com/en-us/",
            year: "May 2019 — Aug 2019",
          },
          {
            src: "https://res.cloudinary.com/thejameswang/image/upload/v1587847531/thejameswang/Anora_uo5wt4.jpg",
            alt: "Anora AI Logo",
            positionName: "Software Developer",
            briefDescription:
              "We are a startup that aims to serve as a guide through the entire FDA submission process for devices, using artificial intelligence to convert decades of FDA submission history into a guide for your company's success. I helped Redeveloped their web application to reflect a search engine similar to Google. A Full-stack developer who wrote and reviewed code forJS using React, Node, Redux, and AWS.",
            name: "Anora AI",
            link: "https://anora.ai/",
            year: "Jan 2019 — May 2019",
          },
          {
            src: "https://res.cloudinary.com/thejameswang/image/upload/v1587847532/thejameswang/GE_dh2kwe.jpg",
            alt: "General Electric Logo",
            positionName: "Software Development Intern",
            briefDescription:
              "As apart of the Monitoring Team for Coretech Digital, I created a management system to assist BI analysis of monitor metadata and control usage. I established a framework for future improvements such as Internal Self self-service portal, monitoring, and reporting.",
            name: "General Electric Digital",
            link: "https://www.ge.com/digital/",
            year: "May 2018 — Dec 2018",
          },
          {
            src: "https://res.cloudinary.com/thejameswang/image/upload/v1587847531/thejameswang/Horizons_gxfmos.jpg",
            alt: "Horizons School of Technology Logo",
            positionName: "Software Bootcamper",
            briefDescription:
              "Selected to take part in an immersive 1000-hour full stack software engineering course focused on project-based front-end and back-end web and mobile development in JavaScript, HTML, and CSS. Experience using React, React-Native, Redux, Express, MongoDB, SQL, Postgres, among other technologies.",
            name: "Horizons School of Technology",
            link: "https://www.linkedin.com/school/horizons-/",
            year: "Jan 2018 — May 2018",
          },
          {
            src: "https://res.cloudinary.com/thejameswang/image/upload/v1587847531/thejameswang/GT_q6szwt.jpg",
            alt: "GT Logo",
            positionName: "CoC Student Assistant",
            briefDescription:
              "Working under Paul Shultz, assistant director of development, I help with research and identify prospective companies for the College of Computing Corporate Affiliates Program (CAP), connecting our talented computer science students with companies around the world. Our goal is to alleviate the dire shortage of computing talent in the labor force.",
            name: "The Georgia Institute of Technology",
            link: "https://www.gatech.edu/",
            year: "Aug 2018 — May 2019",
          },
        ],
      },
      Resume: [
        [
          2021,
          {
            failures: [
              "Never applied to Interact Fellowship this year",
              "No return offer to Tesla Energy",
              "Hack4Impact not where it should be when I envisioned the start of my tenure to now",
              "Socially inactive while in California",
              "Haven't established anything close to a brand",
              "Establishing that I'll take a full 5th year in university",
              "Quit start-up job when it became too hard to handle",
              "Quit summer internship job",
            ],
          },
        ],
        [
          2020,
          {
            failures: [
              "Rejected: Interact Fellowship Application",
              "Rejected: Summer 2020 President's Undergraduate Research Award (PURA)",
              "Rejected: 10 PM Internship Applications",
              "Only receieved 3 total full time PM interviews",
              "Failed full time recruitment for product management positions, forced to do another internship and year of school",
              "Dropped multi-variable calculus (3rd time) and Physics II",
              "Became largely inactive with HackGT/Hexlabs",
              "Didn't send out year in review for Hack4Impact",
            ],
          },
        ],
        [
          2019,
          {
            failures: [
              "GT College of Computing Executive Director Termination/Club Suspension Letter (Thx Georgia Tech)",
              "Founded a company, but let it stay around too long only to find another company built it. They built it so well too. Thanks @ Joro.tech",
              "Rejected: KPCB Fellow Final Round: (Nuna plz accept me)",
              "Rejected: Dorm Room Fund Engineering Position",
              "Rejected: Contrary Capital Venture Partner",
              "Rejected: Microsoft AI for Good, AI for Earth, and Farm Beats Team",
              "Rejected: Energy Sage and Humu Startup Internship",
              "Rejected: Microsoft PM Interview",
              "Rejected: CS1331 TA Position (Missed Interview)",
              "Thought about consulting",
              "I got a B in Korean 1. Literally everyone in the class got an A but me. It hurts",
              "Dropped multi-variable calculus (2nd time)",
            ],
          },
        ],
        [
          2018,
          {
            failures: [
              "Terrible Director of Engineering at Bits of Good",
              "Rejected: from Stanford and Duke University",
              "Rejected: 2nd time from Google",
              "Left Neuroscience Major",
              "Rejected: CS1301 and CS1331 TA Positions",
              "Dropped multi-variable calculus (1st time)",
            ],
          },
        ],
        [
          2017,
          {
            failures: [
              "Rejected: 9/12 Universities",
              "Rejected or Never Responded Back: 133 Emory or GT researcher labs to do research with",
              "Rejected: Winship Summer Scholars Research Program",
              "Waitlist: ION Summer Research Program",
              "Failed Relationships",
              "2nd time loss at Georgia Brain Bee",
            ],
          },
        ],
      ],
    };

    /* src/routes/Mlip.svelte generated by Svelte v3.42.1 */

    const file$8 = "src/routes/Mlip.svelte";

    function create_fragment$b(ctx) {
    	let section;
    	let div0;
    	let h1;
    	let t0;
    	let span;
    	let t2;
    	let t3;
    	let div3;
    	let div1;
    	let p0;
    	let t5;
    	let p1;
    	let t6;
    	let a0;
    	let t8;
    	let a1;
    	let t10;
    	let a2;
    	let t12;
    	let a3;
    	let t14;
    	let a4;
    	let t16;
    	let t17;
    	let a5;
    	let svg0;
    	let path0;
    	let t18;
    	let div2;
    	let p2;
    	let t20;
    	let svg1;
    	let path1;

    	const block = {
    		c: function create() {
    			section = element("section");
    			div0 = element("div");
    			h1 = element("h1");
    			t0 = text("My life,\n      ");
    			span = element("span");
    			span.textContent = "in public";
    			t2 = text("\n      📗");
    			t3 = space();
    			div3 = element("div");
    			div1 = element("div");
    			p0 = element("p");
    			p0.textContent = "A while ago I decided that I was going to start reading and writing a\n        lot more. To help motivate myself, I wanted to make my process public,\n        but after getting through the couple activities, I realized I could do a\n        lot more . . . 😅. I ended up going overboard and started to document\n        all my endeavors + extras.";
    			t5 = space();
    			p1 = element("p");
    			t6 = text("After I started this monstrosity, I realized other people were doing it\n        as well!\n        ");
    			a0 = element("a");
    			a0.textContent = "Tania";
    			t8 = text("\n        has a very interesting page for learning in public. For me, she became a\n        ");
    			a1 = element("a");
    			a1.textContent = "domino";
    			t10 = text("\n        to finding\n        ");
    			a2 = element("a");
    			a2.textContent = "tons";
    			t12 = text("\n        of\n        ");
    			a3 = element("a");
    			a3.textContent = "different";
    			t14 = space();
    			a4 = element("a");
    			a4.textContent = "resources.";
    			t16 = text("\n        Eventually, I hope to be one of those big writers and bloggers that are\n        able to help others like they've helped me!");
    			t17 = space();
    			a5 = element("a");
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			t18 = space();
    			div2 = element("div");
    			p2 = element("p");
    			p2.textContent = "Explore My life";
    			t20 = space();
    			svg1 = svg_element("svg");
    			path1 = svg_element("path");
    			add_location(span, file$8, 91, 6, 1553);
    			add_location(h1, file$8, 89, 4, 1527);
    			add_location(div0, file$8, 88, 2, 1517);
    			attr_dev(p0, "class", "svelte-1hj3mp1");
    			add_location(p0, file$8, 97, 6, 1684);
    			attr_dev(a0, "href", "https://www.taniarascia.com/learn/");
    			attr_dev(a0, "target", "_blank");
    			attr_dev(a0, "class", "svelte-1hj3mp1");
    			add_location(a0, file$8, 107, 8, 2165);
    			attr_dev(a1, "href", "https://www.swyx.io/writing/learn-in-public/");
    			attr_dev(a1, "target", "_blank");
    			attr_dev(a1, "class", "svelte-1hj3mp1");
    			add_location(a1, file$8, 109, 8, 2325);
    			attr_dev(a2, "href", "https://learninpublic.com/workbook/");
    			attr_dev(a2, "target", "_blank");
    			attr_dev(a2, "class", "svelte-1hj3mp1");
    			add_location(a2, file$8, 113, 8, 2454);
    			attr_dev(a3, "href", "https://medium.com/@elbaumpj/learn-in-public-7384bcec0cfb");
    			attr_dev(a3, "target", "_blank");
    			attr_dev(a3, "class", "svelte-1hj3mp1");
    			add_location(a3, file$8, 115, 8, 2544);
    			attr_dev(a4, "href", "http://www.bethkanter.org/bloom-public-learnin/");
    			attr_dev(a4, "target", "_blank");
    			attr_dev(a4, "class", "svelte-1hj3mp1");
    			add_location(a4, file$8, 120, 8, 2690);
    			attr_dev(p1, "class", "svelte-1hj3mp1");
    			add_location(p1, file$8, 104, 6, 2056);
    			attr_dev(div1, "class", "description-container svelte-1hj3mp1");
    			add_location(div1, file$8, 96, 4, 1642);
    			attr_dev(path0, "d", "M36.3659 38.1131C41.2295 42.0929 43.054 41.7892 52.1865\n          41.1756L138.285 35.9682C140.111 35.9682 138.592 34.1332 137.984\n          33.8283L123.685 23.4162C120.945 21.2738 117.294 18.8201 110.298\n          19.4338L26.9291 25.5587C23.8887 25.8623 23.2814 27.3935 24.4924\n          28.6209L36.3659 38.1131ZM41.5351 58.3236V149.571C41.5351 154.475\n          43.9681 156.31 49.4441 156.006L144.066 150.491C149.545 150.188 150.155\n          146.815 150.155 142.831V52.1963C150.155 48.219 148.636 46.0741 145.282\n          46.3803L46.4013 52.1963C42.7523 52.5051 41.5351 54.3437 41.5351\n          58.3236ZM134.946 63.2184C135.553 65.9771 134.946 68.7332 132.202\n          69.0432L127.643 69.9581V137.323C123.685 139.466 120.034 140.691\n          116.993 140.691C112.123 140.691 110.903 139.159 107.256\n          134.568L77.4339 87.4124V133.037L86.8705 135.182C86.8705 135.182\n          86.8705 140.691 79.2571 140.691L58.2685 141.917C57.6588 140.691\n          58.2685 137.631 60.3974 137.018L65.8745 135.489V75.1655L58.2698\n          74.5517C57.66 71.7931 59.1789 67.8157 63.4415 67.507L85.9576\n          65.9782L116.993 113.748V71.4893L109.08 70.5744C108.473 67.202 110.903\n          64.7533 113.946 64.4496L134.946 63.2184ZM19.9292 17.2914L106.647\n          10.8592C117.296 9.93921 120.036 10.5555 126.729 15.4528L154.41\n          35.0495C158.977 38.4194 160.5 39.3368 160.5 43.0104V150.491C160.5\n          157.227 158.064 161.211 149.546 161.821L48.8418 167.946C42.448 168.253\n          39.405 167.335 36.0566 163.046L15.6717 136.406C12.019 131.502 10.5\n          127.833 10.5 123.541V28.0048C10.5 22.4962 12.9368 17.9014 19.9292\n          17.2914Z");
    			attr_dev(path0, "fill", "#9EDDC0");
    			add_location(path0, file$8, 139, 8, 3281);
    			attr_dev(svg0, "width", "171");
    			attr_dev(svg0, "height", "180");
    			attr_dev(svg0, "viewBox", "0 0 171 180");
    			attr_dev(svg0, "fill", "none");
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "class", "svelte-1hj3mp1");
    			add_location(svg0, file$8, 133, 6, 3133);
    			add_location(p2, file$8, 166, 8, 5039);
    			attr_dev(path1, "d", "M17.3203 9.5918C17.0215 9.88477 17.0215 10.3711 17.3145\n            10.6699L20.877 14.2383H7.31836C6.90234 14.2383 6.5625 14.5781 6.5625\n            15C6.5625 15.4219 6.90234 15.7617 7.31836 15.7617H20.8711L17.3086\n            19.3301C17.0156 19.6289 17.0215 20.1094 17.3145 20.4082C17.6133\n            20.7012 18.0879 20.7012 18.3867 20.4023L23.2148 15.5391C23.2793\n            15.4688 23.332 15.3926 23.373 15.2988C23.4141 15.2051 23.4316\n            15.1055 23.4316 15.0059C23.4316 14.8066 23.3555 14.6191 23.2148\n            14.4727L18.3867 9.60938C18.0996 9.30469 17.6191 9.29883 17.3203\n            9.5918V9.5918Z");
    			attr_dev(path1, "fill", "white");
    			add_location(path1, file$8, 173, 10, 5226);
    			attr_dev(svg1, "width", "30");
    			attr_dev(svg1, "height", "30");
    			attr_dev(svg1, "viewBox", "0 0 30 30");
    			attr_dev(svg1, "fill", "none");
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg1, file$8, 167, 8, 5070);
    			attr_dev(div2, "class", "life-container svelte-1hj3mp1");
    			add_location(div2, file$8, 165, 6, 5002);
    			attr_dev(a5, "class", "notion-container svelte-1hj3mp1");
    			attr_dev(a5, "href", "https://www.notion.so/thejameswang/James-s-Lab-ab240025ea9243f2beef15807b3df6d9");
    			attr_dev(a5, "target", "_blank");
    			add_location(a5, file$8, 129, 4, 2977);
    			attr_dev(div3, "class", "content-container svelte-1hj3mp1");
    			add_location(div3, file$8, 95, 2, 1606);
    			attr_dev(section, "class", "mlip-container svelte-1hj3mp1");
    			add_location(section, file$8, 87, 0, 1482);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div0);
    			append_dev(div0, h1);
    			append_dev(h1, t0);
    			append_dev(h1, span);
    			append_dev(h1, t2);
    			append_dev(section, t3);
    			append_dev(section, div3);
    			append_dev(div3, div1);
    			append_dev(div1, p0);
    			append_dev(div1, t5);
    			append_dev(div1, p1);
    			append_dev(p1, t6);
    			append_dev(p1, a0);
    			append_dev(p1, t8);
    			append_dev(p1, a1);
    			append_dev(p1, t10);
    			append_dev(p1, a2);
    			append_dev(p1, t12);
    			append_dev(p1, a3);
    			append_dev(p1, t14);
    			append_dev(p1, a4);
    			append_dev(p1, t16);
    			append_dev(div3, t17);
    			append_dev(div3, a5);
    			append_dev(a5, svg0);
    			append_dev(svg0, path0);
    			append_dev(a5, t18);
    			append_dev(a5, div2);
    			append_dev(div2, p2);
    			append_dev(div2, t20);
    			append_dev(div2, svg1);
    			append_dev(svg1, path1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Mlip', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Mlip> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Mlip extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Mlip",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* node_modules/svelte-images/src/Images/Image.svelte generated by Svelte v3.42.1 */

    const file$9 = "node_modules/svelte-images/src/Images/Image.svelte";

    function create_fragment$c(ctx) {
    	let img;
    	let img_alt_value;
    	let load_action;
    	let mounted;
    	let dispose;

    	let img_levels = [
    		/*imageProps*/ ctx[0],
    		{
    			alt: img_alt_value = /*imageProps*/ ctx[0].alt || ''
    		}
    	];

    	let img_data = {};

    	for (let i = 0; i < img_levels.length; i += 1) {
    		img_data = assign(img_data, img_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			img = element("img");
    			set_attributes(img, img_data);
    			toggle_class(img, "blur", !/*loaded*/ ctx[2]);
    			toggle_class(img, "after-load", /*afterLoad*/ ctx[3]);
    			toggle_class(img, "loaded", /*loaded*/ ctx[2]);
    			toggle_class(img, "svelte-1ayq9qu", true);
    			add_location(img, file$9, 29, 0, 458);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						img,
    						"click",
    						function () {
    							if (is_function(/*onClick*/ ctx[1])) /*onClick*/ ctx[1].apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					action_destroyer(load_action = /*load*/ ctx[4].call(null, img))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			set_attributes(img, img_data = get_spread_update(img_levels, [
    				dirty & /*imageProps*/ 1 && /*imageProps*/ ctx[0],
    				dirty & /*imageProps*/ 1 && img_alt_value !== (img_alt_value = /*imageProps*/ ctx[0].alt || '') && { alt: img_alt_value }
    			]));

    			toggle_class(img, "blur", !/*loaded*/ ctx[2]);
    			toggle_class(img, "after-load", /*afterLoad*/ ctx[3]);
    			toggle_class(img, "loaded", /*loaded*/ ctx[2]);
    			toggle_class(img, "svelte-1ayq9qu", true);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Image', slots, []);
    	let { lazy = true } = $$props;
    	let { imageProps = {} } = $$props;

    	let { onClick = () => {
    		
    	} } = $$props;

    	let className = "";
    	let loaded = !lazy;
    	let afterLoad = false;

    	function load(img) {
    		img.onload = () => {
    			$$invalidate(2, loaded = true);
    			setTimeout(() => $$invalidate(3, afterLoad = true), 1500);
    		};
    	}

    	const writable_props = ['lazy', 'imageProps', 'onClick'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Image> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('lazy' in $$props) $$invalidate(5, lazy = $$props.lazy);
    		if ('imageProps' in $$props) $$invalidate(0, imageProps = $$props.imageProps);
    		if ('onClick' in $$props) $$invalidate(1, onClick = $$props.onClick);
    	};

    	$$self.$capture_state = () => ({
    		lazy,
    		imageProps,
    		onClick,
    		className,
    		loaded,
    		afterLoad,
    		load
    	});

    	$$self.$inject_state = $$props => {
    		if ('lazy' in $$props) $$invalidate(5, lazy = $$props.lazy);
    		if ('imageProps' in $$props) $$invalidate(0, imageProps = $$props.imageProps);
    		if ('onClick' in $$props) $$invalidate(1, onClick = $$props.onClick);
    		if ('className' in $$props) className = $$props.className;
    		if ('loaded' in $$props) $$invalidate(2, loaded = $$props.loaded);
    		if ('afterLoad' in $$props) $$invalidate(3, afterLoad = $$props.afterLoad);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [imageProps, onClick, loaded, afterLoad, load, lazy];
    }

    class Image extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { lazy: 5, imageProps: 0, onClick: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Image",
    			options,
    			id: create_fragment$c.name
    		});
    	}

    	get lazy() {
    		throw new Error("<Image>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set lazy(value) {
    		throw new Error("<Image>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get imageProps() {
    		throw new Error("<Image>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set imageProps(value) {
    		throw new Error("<Image>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onClick() {
    		throw new Error("<Image>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onClick(value) {
    		throw new Error("<Image>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }

    let modalStore = writable({});
    const open = (Component, props) => {
      modalStore.set({ isOpen: true, Component, props });
    };
    const close = () => {
      modalStore.set({ isOpen: false, Component: null, props: {} });
    };

    /* node_modules/svelte-images/src/Images/Modal.svelte generated by Svelte v3.42.1 */
    const file$a = "node_modules/svelte-images/src/Images/Modal.svelte";

    // (63:2) {#if isOpen}
    function create_if_block$1(ctx) {
    	let div2;
    	let div1;
    	let div0;
    	let switch_instance;
    	let div1_transition;
    	let div2_transition;
    	let current;
    	let mounted;
    	let dispose;
    	const switch_instance_spread_levels = [/*props*/ ctx[1]];
    	var switch_value = /*Component*/ ctx[2];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			attr_dev(div0, "class", "content svelte-rppnts");
    			add_location(div0, file$a, 72, 8, 1464);
    			attr_dev(div1, "class", "window-wrap svelte-rppnts");
    			add_location(div1, file$a, 68, 6, 1353);
    			attr_dev(div2, "class", "bg svelte-rppnts");
    			add_location(div2, file$a, 63, 4, 1219);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, div0);

    			if (switch_instance) {
    				mount_component(switch_instance, div0, null);
    			}

    			/*div1_binding*/ ctx[9](div1);
    			/*div2_binding*/ ctx[10](div2);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div2, "click", /*handleOuterClick*/ ctx[6], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*props*/ 2)
    			? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*props*/ ctx[1])])
    			: {};

    			if (switch_value !== (switch_value = /*Component*/ ctx[2])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, div0, null);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);

    			add_render_callback(() => {
    				if (!div1_transition) div1_transition = create_bidirectional_transition(div1, fade, { duration: 300 }, true);
    				div1_transition.run(1);
    			});

    			add_render_callback(() => {
    				if (!div2_transition) div2_transition = create_bidirectional_transition(div2, fade, { duration: 300 }, true);
    				div2_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			if (!div1_transition) div1_transition = create_bidirectional_transition(div1, fade, { duration: 300 }, false);
    			div1_transition.run(0);
    			if (!div2_transition) div2_transition = create_bidirectional_transition(div2, fade, { duration: 300 }, false);
    			div2_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (switch_instance) destroy_component(switch_instance);
    			/*div1_binding*/ ctx[9](null);
    			if (detaching && div1_transition) div1_transition.end();
    			/*div2_binding*/ ctx[10](null);
    			if (detaching && div2_transition) div2_transition.end();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(63:2) {#if isOpen}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let div;
    	let t;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*isOpen*/ ctx[0] && create_if_block$1(ctx);
    	const default_slot_template = /*#slots*/ ctx[8].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			t = space();
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "svelte-rppnts");
    			add_location(div, file$a, 61, 0, 1194);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			append_dev(div, t);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(window, "keyup", /*handleKeyup*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*isOpen*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*isOpen*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, t);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 128)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[7],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[7])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[7], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Modal', slots, ['default']);
    	let state = {};
    	let isOpen = false;
    	let props = null;
    	let Component = null;
    	let background;
    	let wrap;

    	const handleKeyup = ({ key }) => {
    		if (Component && key === "Escape") {
    			event.preventDefault();
    			close();
    		}
    	};

    	const handleOuterClick = event => {
    		if (event.target === background || event.target === wrap) {
    			event.preventDefault();
    			close();
    		}
    	};

    	const unsubscribe = modalStore.subscribe(value => {
    		$$invalidate(2, Component = value.Component);
    		$$invalidate(1, props = value.props);
    		$$invalidate(0, isOpen = value.isOpen);
    	});

    	onDestroy(unsubscribe);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Modal> was created with unknown prop '${key}'`);
    	});

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			wrap = $$value;
    			$$invalidate(4, wrap);
    		});
    	}

    	function div2_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			background = $$value;
    			$$invalidate(3, background);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(7, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		onDestroy,
    		fade,
    		modalStore,
    		open,
    		close,
    		state,
    		isOpen,
    		props,
    		Component,
    		background,
    		wrap,
    		handleKeyup,
    		handleOuterClick,
    		unsubscribe
    	});

    	$$self.$inject_state = $$props => {
    		if ('state' in $$props) state = $$props.state;
    		if ('isOpen' in $$props) $$invalidate(0, isOpen = $$props.isOpen);
    		if ('props' in $$props) $$invalidate(1, props = $$props.props);
    		if ('Component' in $$props) $$invalidate(2, Component = $$props.Component);
    		if ('background' in $$props) $$invalidate(3, background = $$props.background);
    		if ('wrap' in $$props) $$invalidate(4, wrap = $$props.wrap);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		isOpen,
    		props,
    		Component,
    		background,
    		wrap,
    		handleKeyup,
    		handleOuterClick,
    		$$scope,
    		slots,
    		div1_binding,
    		div2_binding
    	];
    }

    class Modal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Modal",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    function debounce(func, wait, immediate) {
      var timeout;
      return function () {
        var context = this, args = arguments;
        var later = function () {
          timeout = null;
          if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
      };
    }

    /* node_modules/svelte-images/src/Images/ClickOutside.svelte generated by Svelte v3.42.1 */
    const file$b = "node_modules/svelte-images/src/Images/ClickOutside.svelte";

    function create_fragment$e(ctx) {
    	let t;
    	let div;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	const block = {
    		c: function create() {
    			t = space();
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", /*className*/ ctx[0]);
    			add_location(div, file$b, 26, 0, 656);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			/*div_binding*/ ctx[6](div);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(document.body, "click", /*onClickOutside*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[4],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*className*/ 1) {
    				attr_dev(div, "class", /*className*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			/*div_binding*/ ctx[6](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ClickOutside', slots, ['default']);
    	let { exclude = [] } = $$props;
    	let { className } = $$props;
    	let child;
    	const dispatch = createEventDispatcher();

    	function isExcluded(target) {
    		var parent = target;

    		while (parent) {
    			if (exclude.indexOf(parent) >= 0 || parent === child) {
    				return true;
    			}

    			parent = parent.parentNode;
    		}

    		return false;
    	}

    	function onClickOutside(event) {
    		if (!isExcluded(event.target)) {
    			event.preventDefault();
    			dispatch("clickoutside");
    		}
    	}

    	const writable_props = ['exclude', 'className'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ClickOutside> was created with unknown prop '${key}'`);
    	});

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			child = $$value;
    			$$invalidate(1, child);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('exclude' in $$props) $$invalidate(3, exclude = $$props.exclude);
    		if ('className' in $$props) $$invalidate(0, className = $$props.className);
    		if ('$$scope' in $$props) $$invalidate(4, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		exclude,
    		className,
    		child,
    		dispatch,
    		isExcluded,
    		onClickOutside
    	});

    	$$self.$inject_state = $$props => {
    		if ('exclude' in $$props) $$invalidate(3, exclude = $$props.exclude);
    		if ('className' in $$props) $$invalidate(0, className = $$props.className);
    		if ('child' in $$props) $$invalidate(1, child = $$props.child);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [className, child, onClickOutside, exclude, $$scope, slots, div_binding];
    }

    class ClickOutside extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, { exclude: 3, className: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ClickOutside",
    			options,
    			id: create_fragment$e.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*className*/ ctx[0] === undefined && !('className' in props)) {
    			console.warn("<ClickOutside> was created without expected prop 'className'");
    		}
    	}

    	get exclude() {
    		throw new Error("<ClickOutside>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set exclude(value) {
    		throw new Error("<ClickOutside>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get className() {
    		throw new Error("<ClickOutside>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set className(value) {
    		throw new Error("<ClickOutside>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-images/src/Images/Carousel.svelte generated by Svelte v3.42.1 */

    const { window: window_1 } = globals;
    const file$c = "node_modules/svelte-images/src/Images/Carousel.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[16] = list[i];
    	child_ctx[17] = list;
    	child_ctx[18] = i;
    	return child_ctx;
    }

    // (161:6) {#each images as image, i}
    function create_each_block$3(ctx) {
    	let div;
    	let image;
    	let i = /*i*/ ctx[18];
    	let t;
    	let current;
    	const assign_image = () => /*image_binding*/ ctx[12](image, i);
    	const unassign_image = () => /*image_binding*/ ctx[12](null, i);
    	let image_props = { imageProps: /*image*/ ctx[16] };
    	image = new Image({ props: image_props, $$inline: true });
    	assign_image();

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(image.$$.fragment);
    			t = space();
    			attr_dev(div, "class", "img-container svelte-m9pjbw");
    			add_location(div, file$c, 161, 8, 3610);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(image, div, null);
    			append_dev(div, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (i !== /*i*/ ctx[18]) {
    				unassign_image();
    				i = /*i*/ ctx[18];
    				assign_image();
    			}

    			const image_changes = {};
    			if (dirty & /*images*/ 1) image_changes.imageProps = /*image*/ ctx[16];
    			image.$set(image_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(image.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(image.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			unassign_image();
    			destroy_component(image);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(161:6) {#each images as image, i}",
    		ctx
    	});

    	return block;
    }

    // (157:4) <ClickOutside       className="click-outside-wrapper"       on:clickoutside={handleClose}       exclude={[left_nav_button, right_nav_button, ...image_elements]}>
    function create_default_slot$3(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*images*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*images, image_elements*/ 9) {
    				each_value = /*images*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(157:4) <ClickOutside       className=\\\"click-outside-wrapper\\\"       on:clickoutside={handleClose}       exclude={[left_nav_button, right_nav_button, ...image_elements]}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let div2;
    	let div0;
    	let button0;
    	let svg0;
    	let path0;
    	let t0;
    	let button1;
    	let svg1;
    	let path1;
    	let t1;
    	let div1;
    	let clickoutside;
    	let div1_style_value;
    	let current;
    	let mounted;
    	let dispose;

    	clickoutside = new ClickOutside({
    			props: {
    				className: "click-outside-wrapper",
    				exclude: [
    					/*left_nav_button*/ ctx[1],
    					/*right_nav_button*/ ctx[2],
    					.../*image_elements*/ ctx[3]
    				],
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	clickoutside.$on("clickoutside", /*handleClose*/ ctx[8]);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			button0 = element("button");
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			t0 = space();
    			button1 = element("button");
    			svg1 = svg_element("svg");
    			path1 = svg_element("path");
    			t1 = space();
    			div1 = element("div");
    			create_component(clickoutside.$$.fragment);
    			attr_dev(path0, "d", "M15.422 16.078l-1.406 1.406-6-6 6-6 1.406 1.406-4.594 4.594z");
    			add_location(path0, file$c, 143, 8, 2980);
    			attr_dev(svg0, "role", "presentation");
    			attr_dev(svg0, "viewBox", "0 0 24 24");
    			attr_dev(svg0, "class", "svelte-m9pjbw");
    			add_location(svg0, file$c, 142, 6, 2926);
    			attr_dev(button0, "class", "svelte-m9pjbw");
    			add_location(button0, file$c, 141, 4, 2867);
    			attr_dev(path1, "d", "M9.984 6l6 6-6 6-1.406-1.406 4.594-4.594-4.594-4.594z");
    			add_location(path1, file$c, 149, 8, 3210);
    			attr_dev(svg1, "role", "presentation");
    			attr_dev(svg1, "viewBox", "0 0 24 24");
    			attr_dev(svg1, "class", "svelte-m9pjbw");
    			add_location(svg1, file$c, 148, 6, 3156);
    			attr_dev(button1, "class", "svelte-m9pjbw");
    			add_location(button1, file$c, 147, 4, 3095);
    			attr_dev(div0, "class", "nav svelte-m9pjbw");
    			add_location(div0, file$c, 140, 2, 2845);
    			attr_dev(div1, "class", "carousel svelte-m9pjbw");
    			attr_dev(div1, "style", div1_style_value = `transform: translate3d(${/*translateX*/ ctx[4]}px, 0, 0);`);
    			add_location(div1, file$c, 153, 2, 3315);
    			attr_dev(div2, "class", "container svelte-m9pjbw");
    			add_location(div2, file$c, 139, 0, 2819);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, button0);
    			append_dev(button0, svg0);
    			append_dev(svg0, path0);
    			/*button0_binding*/ ctx[10](button0);
    			append_dev(div0, t0);
    			append_dev(div0, button1);
    			append_dev(button1, svg1);
    			append_dev(svg1, path1);
    			/*button1_binding*/ ctx[11](button1);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			mount_component(clickoutside, div1, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window_1, "resize", /*updatePosition*/ ctx[7], false, false, false),
    					listen_dev(button0, "click", /*left*/ ctx[6], false, false, false),
    					listen_dev(button1, "click", /*right*/ ctx[5], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const clickoutside_changes = {};

    			if (dirty & /*left_nav_button, right_nav_button, image_elements*/ 14) clickoutside_changes.exclude = [
    				/*left_nav_button*/ ctx[1],
    				/*right_nav_button*/ ctx[2],
    				.../*image_elements*/ ctx[3]
    			];

    			if (dirty & /*$$scope, images, image_elements*/ 524297) {
    				clickoutside_changes.$$scope = { dirty, ctx };
    			}

    			clickoutside.$set(clickoutside_changes);

    			if (!current || dirty & /*translateX*/ 16 && div1_style_value !== (div1_style_value = `transform: translate3d(${/*translateX*/ ctx[4]}px, 0, 0);`)) {
    				attr_dev(div1, "style", div1_style_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(clickoutside.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(clickoutside.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			/*button0_binding*/ ctx[10](null);
    			/*button1_binding*/ ctx[11](null);
    			destroy_component(clickoutside);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Carousel', slots, []);
    	let { images } = $$props;
    	let { curr_idx = 0 } = $$props;
    	let left_nav_button;
    	let right_nav_button;
    	const image_elements = new Array(images.length);
    	let translateX = -curr_idx * window.innerWidth;

    	function increment(num) {
    		return num >= images.length - 1 ? 0 : num + 1;
    	}

    	function decrement(num) {
    		return num == 0 ? images.length - 1 : num - 1;
    	}

    	function right() {
    		$$invalidate(9, curr_idx = increment(curr_idx));
    		updatePosition();
    	}

    	function left() {
    		$$invalidate(9, curr_idx = decrement(curr_idx));
    		updatePosition();
    	}

    	function updatePosition() {
    		$$invalidate(4, translateX = -curr_idx * window.innerWidth);
    	}

    	const debouncedClose = debounce(close, 100, true);

    	function handleClose() {
    		debouncedClose();
    	}

    	const writable_props = ['images', 'curr_idx'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Carousel> was created with unknown prop '${key}'`);
    	});

    	function button0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			left_nav_button = $$value;
    			$$invalidate(1, left_nav_button);
    		});
    	}

    	function button1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			right_nav_button = $$value;
    			$$invalidate(2, right_nav_button);
    		});
    	}

    	function image_binding($$value, i) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			image_elements[i] = $$value;
    			$$invalidate(3, image_elements);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('images' in $$props) $$invalidate(0, images = $$props.images);
    		if ('curr_idx' in $$props) $$invalidate(9, curr_idx = $$props.curr_idx);
    	};

    	$$self.$capture_state = () => ({
    		Image,
    		fade,
    		close,
    		debounce,
    		ClickOutside,
    		images,
    		curr_idx,
    		left_nav_button,
    		right_nav_button,
    		image_elements,
    		translateX,
    		increment,
    		decrement,
    		right,
    		left,
    		updatePosition,
    		debouncedClose,
    		handleClose
    	});

    	$$self.$inject_state = $$props => {
    		if ('images' in $$props) $$invalidate(0, images = $$props.images);
    		if ('curr_idx' in $$props) $$invalidate(9, curr_idx = $$props.curr_idx);
    		if ('left_nav_button' in $$props) $$invalidate(1, left_nav_button = $$props.left_nav_button);
    		if ('right_nav_button' in $$props) $$invalidate(2, right_nav_button = $$props.right_nav_button);
    		if ('translateX' in $$props) $$invalidate(4, translateX = $$props.translateX);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		images,
    		left_nav_button,
    		right_nav_button,
    		image_elements,
    		translateX,
    		right,
    		left,
    		updatePosition,
    		handleClose,
    		curr_idx,
    		button0_binding,
    		button1_binding,
    		image_binding
    	];
    }

    class Carousel extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, { images: 0, curr_idx: 9 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Carousel",
    			options,
    			id: create_fragment$f.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*images*/ ctx[0] === undefined && !('images' in props)) {
    			console.warn("<Carousel> was created without expected prop 'images'");
    		}
    	}

    	get images() {
    		throw new Error("<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set images(value) {
    		throw new Error("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get curr_idx() {
    		throw new Error("<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set curr_idx(value) {
    		throw new Error("<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const open$1 = (images, curr_idx) => {
      open(Carousel, { images, curr_idx });
    };
    const close$1 = close;

    /* node_modules/svelte-images/src/Images/Images.svelte generated by Svelte v3.42.1 */
    const file$d = "node_modules/svelte-images/src/Images/Images.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	child_ctx[11] = i;
    	return child_ctx;
    }

    // (53:2) {#each images as image, i}
    function create_each_block$4(ctx) {
    	let image;
    	let current;

    	function func() {
    		return /*func*/ ctx[6](/*i*/ ctx[11]);
    	}

    	image = new Image({
    			props: {
    				imageProps: {
    					.../*image*/ ctx[9],
    					src: /*image*/ ctx[9].thumbnail || /*image*/ ctx[9].src,
    					alt: /*image*/ ctx[9].alt || '',
    					style: /*numCols*/ ctx[2] != undefined
    					? `width: ${100 / /*numCols*/ ctx[2] - 6}%;`
    					: 'max-width: 200px;'
    				},
    				onClick: func
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(image.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(image, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const image_changes = {};

    			if (dirty & /*images, numCols*/ 5) image_changes.imageProps = {
    				.../*image*/ ctx[9],
    				src: /*image*/ ctx[9].thumbnail || /*image*/ ctx[9].src,
    				alt: /*image*/ ctx[9].alt || '',
    				style: /*numCols*/ ctx[2] != undefined
    				? `width: ${100 / /*numCols*/ ctx[2] - 6}%;`
    				: 'max-width: 200px;'
    			};

    			image.$set(image_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(image.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(image.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(image, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(53:2) {#each images as image, i}",
    		ctx
    	});

    	return block;
    }

    // (60:0) {#if showModal}
    function create_if_block$2(ctx) {
    	let modal;
    	let current;
    	modal = new Modal({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(modal.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(modal, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(modal, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(60:0) {#if showModal}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let div;
    	let t;
    	let if_block_anchor;
    	let current;
    	let each_value = /*images*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	let if_block = /*showModal*/ ctx[4] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(div, "class", "svelte-images-gallery svelte-13fsqet");
    			set_style(div, "--gutter", /*gutter*/ ctx[1]);
    			add_location(div, file$d, 48, 0, 1053);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			/*div_binding*/ ctx[7](div);
    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*images, numCols, undefined, popModal*/ 37) {
    				each_value = /*images*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (!current || dirty & /*gutter*/ 2) {
    				set_style(div, "--gutter", /*gutter*/ ctx[1]);
    			}

    			if (/*showModal*/ ctx[4]) {
    				if (if_block) {
    					if (dirty & /*showModal*/ 16) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			/*div_binding*/ ctx[7](null);
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Images', slots, []);
    	let { images = [] } = $$props;
    	let { gutter = 2 } = $$props;
    	let { numCols } = $$props;

    	const popModal = idx => setTimeout(
    		() => {
    			open$1(images, idx);
    		},
    		0
    	);

    	let galleryElems;
    	let galleryElem;
    	let showModal;

    	onMount(() => {
    		galleryElems = document.getElementsByClassName("svelte-images-gallery");
    		const index = Array.prototype.findIndex.call(galleryElems, elem => elem === galleryElem);
    		$$invalidate(4, showModal = index === 0);
    	});

    	const writable_props = ['images', 'gutter', 'numCols'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Images> was created with unknown prop '${key}'`);
    	});

    	const func = i => popModal(i);

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			galleryElem = $$value;
    			$$invalidate(3, galleryElem);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('images' in $$props) $$invalidate(0, images = $$props.images);
    		if ('gutter' in $$props) $$invalidate(1, gutter = $$props.gutter);
    		if ('numCols' in $$props) $$invalidate(2, numCols = $$props.numCols);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		Image,
    		Modal,
    		open: open$1,
    		close: close$1,
    		images,
    		gutter,
    		numCols,
    		popModal,
    		galleryElems,
    		galleryElem,
    		showModal
    	});

    	$$self.$inject_state = $$props => {
    		if ('images' in $$props) $$invalidate(0, images = $$props.images);
    		if ('gutter' in $$props) $$invalidate(1, gutter = $$props.gutter);
    		if ('numCols' in $$props) $$invalidate(2, numCols = $$props.numCols);
    		if ('galleryElems' in $$props) galleryElems = $$props.galleryElems;
    		if ('galleryElem' in $$props) $$invalidate(3, galleryElem = $$props.galleryElem);
    		if ('showModal' in $$props) $$invalidate(4, showModal = $$props.showModal);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [images, gutter, numCols, galleryElem, showModal, popModal, func, div_binding];
    }

    class Images extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, { images: 0, gutter: 1, numCols: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Images",
    			options,
    			id: create_fragment$g.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*numCols*/ ctx[2] === undefined && !('numCols' in props)) {
    			console.warn("<Images> was created without expected prop 'numCols'");
    		}
    	}

    	get images() {
    		throw new Error("<Images>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set images(value) {
    		throw new Error("<Images>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get gutter() {
    		throw new Error("<Images>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set gutter(value) {
    		throw new Error("<Images>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get numCols() {
    		throw new Error("<Images>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set numCols(value) {
    		throw new Error("<Images>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/routes/Photography.svelte generated by Svelte v3.42.1 */
    const file$e = "src/routes/Photography.svelte";

    function create_fragment$h(ctx) {
    	let section;
    	let h1;
    	let t1;
    	let p0;
    	let t3;
    	let p1;

    	const block = {
    		c: function create() {
    			section = element("section");
    			h1 = element("h1");
    			h1.textContent = "Photography 📸";
    			t1 = space();
    			p0 = element("p");
    			p0.textContent = "I do portrait photography for fun! Photography is something I love to do\n    when I visit a new area or one of my friends/new friends wants a photoshoot!";
    			t3 = space();
    			p1 = element("p");
    			p1.textContent = "You can find my photography on and Flickr!";
    			add_location(h1, file$e, 86, 2, 2059);
    			attr_dev(p0, "class", "first-container svelte-1j7wvz0");
    			add_location(p0, file$e, 87, 2, 2085);
    			attr_dev(p1, "class", "first-container svelte-1j7wvz0");
    			add_location(p1, file$e, 92, 2, 2281);
    			add_location(section, file$e, 85, 0, 2047);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, h1);
    			append_dev(section, t1);
    			append_dev(section, p0);
    			append_dev(section, t3);
    			append_dev(section, p1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Photography', slots, []);

    	const images = [
    		{
    			src: "https://live.staticflickr.com/65535/49872110977_bfa5070ea1_b.jpg"
    		},
    		{
    			src: "https://live.staticflickr.com/65535/49871263308_1d3e2955df_b.jpg"
    		},
    		{
    			src: "https://live.staticflickr.com/65535/51376104576_6f5d417d62_b.jpg"
    		},
    		{
    			src: "https://live.staticflickr.com/65535/51376334643_08fe02d60d_b.jpg"
    		},
    		{
    			src: "https://live.staticflickr.com/65535/51375306602_5d6384a98d_b.jpg"
    		},
    		{
    			src: "https://live.staticflickr.com/65535/51375337352_20f7c1f3dc_b.jpg"
    		},
    		{
    			src: "https://live.staticflickr.com/65535/51376808584_097a2c2c22_b.jpg"
    		},
    		{
    			src: "https://live.staticflickr.com/65535/51376303458_811bc9656c_b.jpg"
    		},
    		{
    			src: "https://live.staticflickr.com/65535/51376808884_abf261dcaa_b.jpg"
    		},
    		{
    			src: "https://live.staticflickr.com/65535/51375307282_f78fa093d3_b.jpg"
    		},
    		{
    			src: "https://via.placeholder.com/250x200/1"
    		},
    		{
    			src: "https://via.placeholder.com/250x200/1"
    		},
    		{
    			src: "https://via.placeholder.com/250x200/1"
    		},
    		{
    			src: "https://via.placeholder.com/250x200/1"
    		},
    		{
    			src: "https://via.placeholder.com/250x200/1"
    		},
    		{
    			src: "https://via.placeholder.com/250x200/1"
    		},
    		{
    			src: "https://via.placeholder.com/250x200/1"
    		},
    		{
    			src: "https://via.placeholder.com/250x200/1"
    		},
    		{
    			src: "https://via.placeholder.com/250x200/1"
    		},
    		{
    			src: "https://via.placeholder.com/250x200/1"
    		},
    		{
    			src: "https://via.placeholder.com/250x200/1"
    		},
    		{
    			src: "https://via.placeholder.com/250x200/1"
    		},
    		{
    			src: "https://via.placeholder.com/250x200/1"
    		},
    		{
    			src: "https://via.placeholder.com/250x200/1"
    		},
    		{
    			src: "https://via.placeholder.com/250x200/1"
    		},
    		{
    			src: "https://via.placeholder.com/250x200/1"
    		}
    	];

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Photography> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Images, images });
    	return [];
    }

    class Photography extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Photography",
    			options,
    			id: create_fragment$h.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.42.1 */
    const file$f = "src/App.svelte";

    // (28:8) <NavLink to="/work" class="inner-nav">
    function create_default_slot_5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Work 📍");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(28:8) <NavLink to=\\\"/work\\\" class=\\\"inner-nav\\\">",
    		ctx
    	});

    	return block;
    }

    // (29:8) <NavLink to="/resume">
    function create_default_slot_4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Failure Resume 📰");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(29:8) <NavLink to=\\\"/resume\\\">",
    		ctx
    	});

    	return block;
    }

    // (30:8) <NavLink to="/Photography">
    function create_default_slot_3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Photos 📸");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(30:8) <NavLink to=\\\"/Photography\\\">",
    		ctx
    	});

    	return block;
    }

    // (31:8) <NavLink to="/MLIP">
    function create_default_slot_2$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("MLIP 📗");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(31:8) <NavLink to=\\\"/MLIP\\\">",
    		ctx
    	});

    	return block;
    }

    // (48:4) <Route path="/">
    function create_default_slot_1$1(ctx) {
    	let landing;
    	let current;
    	const landing_spread_levels = [content];
    	let landing_props = {};

    	for (let i = 0; i < landing_spread_levels.length; i += 1) {
    		landing_props = assign(landing_props, landing_spread_levels[i]);
    	}

    	landing = new Landing({ props: landing_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(landing.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(landing, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const landing_changes = (dirty & /*content*/ 0)
    			? get_spread_update(landing_spread_levels, [get_spread_object(content)])
    			: {};

    			landing.$set(landing_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(landing.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(landing.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(landing, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(48:4) <Route path=\\\"/\\\">",
    		ctx
    	});

    	return block;
    }

    // (15:0) <Router {url}>
    function create_default_slot$4(ctx) {
    	let nav;
    	let div2;
    	let div0;
    	let a;
    	let t1;
    	let div1;
    	let navlink0;
    	let t2;
    	let navlink1;
    	let t3;
    	let navlink2;
    	let t4;
    	let navlink3;
    	let t5;
    	let div3;
    	let button;
    	let menuicon;
    	let links_action;
    	let t6;
    	let div4;
    	let route0;
    	let t7;
    	let route1;
    	let t8;
    	let route2;
    	let t9;
    	let route3;
    	let t10;
    	let route4;
    	let current;
    	let mounted;
    	let dispose;

    	navlink0 = new NavLink({
    			props: {
    				to: "/work",
    				class: "inner-nav",
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	navlink1 = new NavLink({
    			props: {
    				to: "/resume",
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	navlink2 = new NavLink({
    			props: {
    				to: "/Photography",
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	navlink3 = new NavLink({
    			props: {
    				to: "/MLIP",
    				$$slots: { default: [create_default_slot_2$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	menuicon = new MenuIcon({
    			props: { menuToggled: /*mobileNavToggled*/ ctx[1] },
    			$$inline: true
    		});

    	const route0_spread_levels = [{ path: "work" }, { component: Work }, content];
    	let route0_props = {};

    	for (let i = 0; i < route0_spread_levels.length; i += 1) {
    		route0_props = assign(route0_props, route0_spread_levels[i]);
    	}

    	route0 = new Route({ props: route0_props, $$inline: true });
    	const route1_spread_levels = [{ path: "resume" }, { component: Resume_1 }, content];
    	let route1_props = {};

    	for (let i = 0; i < route1_spread_levels.length; i += 1) {
    		route1_props = assign(route1_props, route1_spread_levels[i]);
    	}

    	route1 = new Route({ props: route1_props, $$inline: true });

    	route2 = new Route({
    			props: { path: "MLIP", component: Mlip },
    			$$inline: true
    		});

    	route3 = new Route({
    			props: {
    				path: "Photography",
    				component: Photography
    			},
    			$$inline: true
    		});

    	route4 = new Route({
    			props: {
    				path: "/",
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			div2 = element("div");
    			div0 = element("div");
    			a = element("a");
    			a.textContent = "James Wang";
    			t1 = space();
    			div1 = element("div");
    			create_component(navlink0.$$.fragment);
    			t2 = space();
    			create_component(navlink1.$$.fragment);
    			t3 = space();
    			create_component(navlink2.$$.fragment);
    			t4 = space();
    			create_component(navlink3.$$.fragment);
    			t5 = space();
    			div3 = element("div");
    			button = element("button");
    			create_component(menuicon.$$.fragment);
    			t6 = space();
    			div4 = element("div");
    			create_component(route0.$$.fragment);
    			t7 = space();
    			create_component(route1.$$.fragment);
    			t8 = space();
    			create_component(route2.$$.fragment);
    			t9 = space();
    			create_component(route3.$$.fragment);
    			t10 = space();
    			create_component(route4.$$.fragment);
    			attr_dev(a, "href", "/");
    			add_location(a, file$f, 24, 8, 761);
    			attr_dev(div0, "class", "mobile-inner-nav svelte-1gzzt2s");
    			add_location(div0, file$f, 23, 6, 722);
    			attr_dev(div1, "class", "mobile-inner-nav svelte-1gzzt2s");
    			add_location(div1, file$f, 26, 6, 807);
    			attr_dev(div2, "class", "nav-container svelte-1gzzt2s");
    			toggle_class(div2, "mobileNavToggled", /*mobileNavToggled*/ ctx[1]);
    			add_location(div2, file$f, 16, 4, 559);
    			attr_dev(button, "class", "mobile-dropdown-toggle svelte-1gzzt2s");
    			add_location(button, file$f, 34, 6, 1124);
    			attr_dev(div3, "class", "mobile-content svelte-1gzzt2s");
    			add_location(div3, file$f, 33, 4, 1089);
    			add_location(nav, file$f, 15, 2, 539);
    			add_location(div4, file$f, 42, 2, 1333);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, div2);
    			append_dev(div2, div0);
    			append_dev(div0, a);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			mount_component(navlink0, div1, null);
    			append_dev(div1, t2);
    			mount_component(navlink1, div1, null);
    			append_dev(div1, t3);
    			mount_component(navlink2, div1, null);
    			append_dev(div1, t4);
    			mount_component(navlink3, div1, null);
    			append_dev(nav, t5);
    			append_dev(nav, div3);
    			append_dev(div3, button);
    			mount_component(menuicon, button, null);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, div4, anchor);
    			mount_component(route0, div4, null);
    			append_dev(div4, t7);
    			mount_component(route1, div4, null);
    			append_dev(div4, t8);
    			mount_component(route2, div4, null);
    			append_dev(div4, t9);
    			mount_component(route3, div4, null);
    			append_dev(div4, t10);
    			mount_component(route4, div4, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div2, "click", /*click_handler*/ ctx[2], false, false, false),
    					listen_dev(button, "click", /*click_handler_1*/ ctx[3], false, false, false),
    					action_destroyer(links_action = links.call(null, nav))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const navlink0_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				navlink0_changes.$$scope = { dirty, ctx };
    			}

    			navlink0.$set(navlink0_changes);
    			const navlink1_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				navlink1_changes.$$scope = { dirty, ctx };
    			}

    			navlink1.$set(navlink1_changes);
    			const navlink2_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				navlink2_changes.$$scope = { dirty, ctx };
    			}

    			navlink2.$set(navlink2_changes);
    			const navlink3_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				navlink3_changes.$$scope = { dirty, ctx };
    			}

    			navlink3.$set(navlink3_changes);

    			if (dirty & /*mobileNavToggled*/ 2) {
    				toggle_class(div2, "mobileNavToggled", /*mobileNavToggled*/ ctx[1]);
    			}

    			const menuicon_changes = {};
    			if (dirty & /*mobileNavToggled*/ 2) menuicon_changes.menuToggled = /*mobileNavToggled*/ ctx[1];
    			menuicon.$set(menuicon_changes);

    			const route0_changes = (dirty & /*Work, content*/ 0)
    			? get_spread_update(route0_spread_levels, [
    					route0_spread_levels[0],
    					dirty & /*Work*/ 0 && { component: Work },
    					dirty & /*content*/ 0 && get_spread_object(content)
    				])
    			: {};

    			route0.$set(route0_changes);

    			const route1_changes = (dirty & /*Resume, content*/ 0)
    			? get_spread_update(route1_spread_levels, [
    					route1_spread_levels[0],
    					dirty & /*Resume*/ 0 && { component: Resume_1 },
    					dirty & /*content*/ 0 && get_spread_object(content)
    				])
    			: {};

    			route1.$set(route1_changes);
    			const route4_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				route4_changes.$$scope = { dirty, ctx };
    			}

    			route4.$set(route4_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navlink0.$$.fragment, local);
    			transition_in(navlink1.$$.fragment, local);
    			transition_in(navlink2.$$.fragment, local);
    			transition_in(navlink3.$$.fragment, local);
    			transition_in(menuicon.$$.fragment, local);
    			transition_in(route0.$$.fragment, local);
    			transition_in(route1.$$.fragment, local);
    			transition_in(route2.$$.fragment, local);
    			transition_in(route3.$$.fragment, local);
    			transition_in(route4.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navlink0.$$.fragment, local);
    			transition_out(navlink1.$$.fragment, local);
    			transition_out(navlink2.$$.fragment, local);
    			transition_out(navlink3.$$.fragment, local);
    			transition_out(menuicon.$$.fragment, local);
    			transition_out(route0.$$.fragment, local);
    			transition_out(route1.$$.fragment, local);
    			transition_out(route2.$$.fragment, local);
    			transition_out(route3.$$.fragment, local);
    			transition_out(route4.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			destroy_component(navlink0);
    			destroy_component(navlink1);
    			destroy_component(navlink2);
    			destroy_component(navlink3);
    			destroy_component(menuicon);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(div4);
    			destroy_component(route0);
    			destroy_component(route1);
    			destroy_component(route2);
    			destroy_component(route3);
    			destroy_component(route4);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(15:0) <Router {url}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$i(ctx) {
    	let router;
    	let current;

    	router = new Router({
    			props: {
    				url: /*url*/ ctx[0],
    				$$slots: { default: [create_default_slot$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const router_changes = {};
    			if (dirty & /*url*/ 1) router_changes.url = /*url*/ ctx[0];

    			if (dirty & /*$$scope, mobileNavToggled*/ 18) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let { url = "" } = $$props;
    	let mobileNavToggled = false;
    	const writable_props = ['url'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		if (mobileNavToggled) $$invalidate(1, mobileNavToggled = false);
    	};

    	const click_handler_1 = () => $$invalidate(1, mobileNavToggled = !mobileNavToggled);

    	$$self.$$set = $$props => {
    		if ('url' in $$props) $$invalidate(0, url = $$props.url);
    	};

    	$$self.$capture_state = () => ({
    		Router,
    		Route,
    		links,
    		NavLink,
    		MenuIcon,
    		Landing,
    		Work,
    		Resume: Resume_1,
    		content,
    		MLIP: Mlip,
    		Photography,
    		url,
    		mobileNavToggled
    	});

    	$$self.$inject_state = $$props => {
    		if ('url' in $$props) $$invalidate(0, url = $$props.url);
    		if ('mobileNavToggled' in $$props) $$invalidate(1, mobileNavToggled = $$props.mobileNavToggled);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [url, mobileNavToggled, click_handler, click_handler_1];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, { url: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$i.name
    		});
    	}

    	get url() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var app = new App({
      target: document.body,
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map

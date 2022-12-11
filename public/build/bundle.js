(() => {
  // node_modules/svelte/internal/index.mjs
  function noop() {
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
    return typeof thing === "function";
  }
  function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
  }
  function is_empty(obj) {
    return Object.keys(obj).length === 0;
  }
  var tasks = new Set();
  var is_hydrating = false;
  function start_hydrating() {
    is_hydrating = true;
  }
  function end_hydrating() {
    is_hydrating = false;
  }
  function append(target, node) {
    target.appendChild(node);
  }
  function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
  }
  function detach(node) {
    if (node.parentNode) {
      node.parentNode.removeChild(node);
    }
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
  function text(data) {
    return document.createTextNode(data);
  }
  function space() {
    return text(" ");
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
  function children(element2) {
    return Array.from(element2.childNodes);
  }
  function set_data(text2, data) {
    data = "" + data;
    if (text2.wholeText !== data)
      text2.data = data;
  }
  function set_style(node, key, value, important) {
    if (value === null) {
      node.style.removeProperty(key);
    } else {
      node.style.setProperty(key, value, important ? "important" : "");
    }
  }
  function toggle_class(element2, name, toggle) {
    element2.classList[toggle ? "add" : "remove"](name);
  }
  var managed_styles = new Map();
  var current_component;
  function set_current_component(component) {
    current_component = component;
  }
  function get_current_component() {
    if (!current_component)
      throw new Error("Function called outside component initialization");
    return current_component;
  }
  function onMount(fn) {
    get_current_component().$$.on_mount.push(fn);
  }
  var dirty_components = [];
  var binding_callbacks = [];
  var render_callbacks = [];
  var flush_callbacks = [];
  var resolved_promise = Promise.resolve();
  var update_scheduled = false;
  function schedule_update() {
    if (!update_scheduled) {
      update_scheduled = true;
      resolved_promise.then(flush);
    }
  }
  function add_render_callback(fn) {
    render_callbacks.push(fn);
  }
  var seen_callbacks = new Set();
  var flushidx = 0;
  function flush() {
    const saved_component = current_component;
    do {
      while (flushidx < dirty_components.length) {
        const component = dirty_components[flushidx];
        flushidx++;
        set_current_component(component);
        update(component.$$);
      }
      set_current_component(null);
      dirty_components.length = 0;
      flushidx = 0;
      while (binding_callbacks.length)
        binding_callbacks.pop()();
      for (let i = 0; i < render_callbacks.length; i += 1) {
        const callback = render_callbacks[i];
        if (!seen_callbacks.has(callback)) {
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
    seen_callbacks.clear();
    set_current_component(saved_component);
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
  var outroing = new Set();
  var outros;
  function group_outros() {
    outros = {
      r: 0,
      c: [],
      p: outros
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
  function transition_out(block, local, detach2, callback) {
    if (block && block.o) {
      if (outroing.has(block))
        return;
      outroing.add(block);
      outros.c.push(() => {
        outroing.delete(block);
        if (callback) {
          if (detach2)
            block.d(1);
          callback();
        }
      });
      block.o(local);
    } else if (callback) {
      callback();
    }
  }
  var globals = typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : global;
  var boolean_attributes = new Set([
    "allowfullscreen",
    "allowpaymentrequest",
    "async",
    "autofocus",
    "autoplay",
    "checked",
    "controls",
    "default",
    "defer",
    "disabled",
    "formnovalidate",
    "hidden",
    "inert",
    "ismap",
    "itemscope",
    "loop",
    "multiple",
    "muted",
    "nomodule",
    "novalidate",
    "open",
    "playsinline",
    "readonly",
    "required",
    "reversed",
    "selected"
  ]);
  function create_component(block) {
    block && block.c();
  }
  function mount_component(component, target, anchor, customElement) {
    const { fragment, after_update } = component.$$;
    fragment && fragment.m(target, anchor);
    if (!customElement) {
      add_render_callback(() => {
        const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
        if (component.$$.on_destroy) {
          component.$$.on_destroy.push(...new_on_destroy);
        } else {
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
    component.$$.dirty[i / 31 | 0] |= 1 << i % 31;
  }
  function init(component, options, instance7, create_fragment7, not_equal, props, append_styles, dirty = [-1]) {
    const parent_component = current_component;
    set_current_component(component);
    const $$ = component.$$ = {
      fragment: null,
      ctx: [],
      props,
      update: noop,
      not_equal,
      bound: blank_object(),
      on_mount: [],
      on_destroy: [],
      on_disconnect: [],
      before_update: [],
      after_update: [],
      context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
      callbacks: blank_object(),
      dirty,
      skip_bound: false,
      root: options.target || parent_component.$$.root
    };
    append_styles && append_styles($$.root);
    let ready = false;
    $$.ctx = instance7 ? instance7(component, options.props || {}, (i, ret, ...rest) => {
      const value = rest.length ? rest[0] : ret;
      if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
        if (!$$.skip_bound && $$.bound[i])
          $$.bound[i](value);
        if (ready)
          make_dirty(component, i);
      }
      return ret;
    }) : [];
    $$.update();
    ready = true;
    run_all($$.before_update);
    $$.fragment = create_fragment7 ? create_fragment7($$.ctx) : false;
    if (options.target) {
      if (options.hydrate) {
        start_hydrating();
        const nodes = children(options.target);
        $$.fragment && $$.fragment.l(nodes);
        nodes.forEach(detach);
      } else {
        $$.fragment && $$.fragment.c();
      }
      if (options.intro)
        transition_in(component.$$.fragment);
      mount_component(component, options.target, options.anchor, options.customElement);
      end_hydrating();
      flush();
    }
    set_current_component(parent_component);
  }
  var SvelteElement;
  if (typeof HTMLElement === "function") {
    SvelteElement = class extends HTMLElement {
      constructor() {
        super();
        this.attachShadow({ mode: "open" });
      }
      connectedCallback() {
        const { on_mount } = this.$$;
        this.$$.on_disconnect = on_mount.map(run).filter(is_function);
        for (const key in this.$$.slotted) {
          this.appendChild(this.$$.slotted[key]);
        }
      }
      attributeChangedCallback(attr2, _oldValue, newValue) {
        this[attr2] = newValue;
      }
      disconnectedCallback() {
        run_all(this.$$.on_disconnect);
      }
      $destroy() {
        destroy_component(this, 1);
        this.$destroy = noop;
      }
      $on(type, callback) {
        if (!is_function(callback)) {
          return noop;
        }
        const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
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
    };
  }
  var SvelteComponent = class {
    $destroy() {
      destroy_component(this, 1);
      this.$destroy = noop;
    }
    $on(type, callback) {
      if (!is_function(callback)) {
        return noop;
      }
      const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
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
  };

  // src/utils/random.js
  function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  // src/components/AmPm.svelte
  function create_fragment(ctx) {
    let div;
    let span0;
    let style___rotate = `${randomIntFromInterval(-0.53, 0.53)}deg`;
    let t1;
    let span1;
    let t2;
    let span2;
    let style___rotate_1 = `${randomIntFromInterval(-0.53, 0.53)}deg`;
    let t4;
    let span3;
    let style___translateX = `${ctx[1]}px`;
    let style___translateY = `${ctx[2]}px`;
    return {
      c() {
        div = element("div");
        span0 = element("span");
        span0.textContent = "AM";
        t1 = space();
        span1 = element("span");
        t2 = space();
        span2 = element("span");
        span2.textContent = "PM";
        t4 = space();
        span3 = element("span");
        attr(span0, "class", "label svelte-1cfg60j");
        set_style(span0, "--rotate", style___rotate);
        attr(span1, "class", "dot svelte-1cfg60j");
        toggle_class(span1, "dot--on", ctx[0]);
        attr(span2, "class", "label svelte-1cfg60j");
        set_style(span2, "--rotate", style___rotate_1);
        attr(span3, "class", "dot svelte-1cfg60j");
        toggle_class(span3, "dot--on", !ctx[0]);
        attr(div, "class", "meridian svelte-1cfg60j");
        toggle_class(div, "am", ctx[0]);
        set_style(div, "--translateX", style___translateX);
        set_style(div, "--translateY", style___translateY);
      },
      m(target, anchor) {
        insert(target, div, anchor);
        append(div, span0);
        append(div, t1);
        append(div, span1);
        append(div, t2);
        append(div, span2);
        append(div, t4);
        append(div, span3);
      },
      p(ctx2, [dirty]) {
        if (dirty & 1) {
          toggle_class(span1, "dot--on", ctx2[0]);
        }
        if (dirty & 1) {
          toggle_class(span3, "dot--on", !ctx2[0]);
        }
        if (dirty & 1) {
          toggle_class(div, "am", ctx2[0]);
        }
      },
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching)
          detach(div);
      }
    };
  }
  function instance($$self, $$props, $$invalidate) {
    let { am = true } = $$props;
    const translateX = randomIntFromInterval(-2, -2);
    const translateY = randomIntFromInterval(-1, 1);
    $$self.$$set = ($$props2) => {
      if ("am" in $$props2)
        $$invalidate(0, am = $$props2.am);
    };
    return [am, translateX, translateY];
  }
  var AmPm = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance, create_fragment, safe_not_equal, { am: 0 });
    }
  };
  var AmPm_default = AmPm;

  // src/components/Date.svelte
  function create_fragment2(ctx) {
    let div6;
    let div0;
    let span0;
    let t1;
    let span1;
    let t2;
    let style___rotate = `${randomIntFromInterval(-0.6, 0.6)}deg`;
    let t3;
    let div1;
    let span2;
    let t5;
    let span3;
    let t6;
    let style___rotate_1 = `${randomIntFromInterval(-0.6, 0.6)}deg`;
    let t7;
    let div2;
    let span4;
    let t9;
    let span5;
    let t10;
    let style___rotate_2 = `${randomIntFromInterval(-0.6, 0.6)}deg`;
    let t11;
    let ampm;
    let t12;
    let div3;
    let span6;
    let t14;
    let span7;
    let t15;
    let style___rotate_3 = `${randomIntFromInterval(-0.6, 0.6)}deg`;
    let t16;
    let div4;
    let span8;
    let t18;
    let span9;
    let t19;
    let style___rotate_4 = `${randomIntFromInterval(-0.6, 0.6)}deg`;
    let t20;
    let div5;
    let span10;
    let t21;
    let style___rotate_5 = `${randomIntFromInterval(-0.6, 0.6)}deg`;
    let style___translateX = `${ctx[7]}px`;
    let style___translateY = `${ctx[8]}px`;
    let style_border_radius = `${randomIntFromInterval(2, 5)}px`;
    let current;
    ampm = new AmPm_default({ props: { am: ctx[3] < 12 } });
    return {
      c() {
        div6 = element("div");
        div0 = element("div");
        span0 = element("span");
        span0.textContent = "Month";
        t1 = space();
        span1 = element("span");
        t2 = text(ctx[6]);
        t3 = space();
        div1 = element("div");
        span2 = element("span");
        span2.textContent = "Day";
        t5 = space();
        span3 = element("span");
        t6 = text(ctx[5]);
        t7 = space();
        div2 = element("div");
        span4 = element("span");
        span4.textContent = "Year";
        t9 = space();
        span5 = element("span");
        t10 = text(ctx[4]);
        t11 = space();
        create_component(ampm.$$.fragment);
        t12 = space();
        div3 = element("div");
        span6 = element("span");
        span6.textContent = "Hour";
        t14 = space();
        span7 = element("span");
        t15 = text(ctx[3]);
        t16 = space();
        div4 = element("div");
        span8 = element("span");
        span8.textContent = "Min";
        t18 = space();
        span9 = element("span");
        t19 = text(ctx[2]);
        t20 = space();
        div5 = element("div");
        span10 = element("span");
        t21 = text(ctx[0]);
        attr(span0, "class", "date__text svelte-gnvuwu");
        attr(span1, "class", "date__display svelte-gnvuwu");
        attr(div0, "class", "date__part date__part--month svelte-gnvuwu");
        set_style(div0, "--rotate", style___rotate);
        attr(span2, "class", "date__text svelte-gnvuwu");
        attr(span3, "class", "date__display svelte-gnvuwu");
        attr(div1, "class", "date__part date__part--day svelte-gnvuwu");
        set_style(div1, "--rotate", style___rotate_1);
        attr(span4, "class", "date__text svelte-gnvuwu");
        attr(span5, "class", "date__display svelte-gnvuwu");
        attr(div2, "class", "date__part date__part--year svelte-gnvuwu");
        set_style(div2, "--rotate", style___rotate_2);
        attr(span6, "class", "date__text svelte-gnvuwu");
        attr(span7, "class", "date__display svelte-gnvuwu");
        attr(div3, "class", "date__part date__part--hours svelte-gnvuwu");
        set_style(div3, "--rotate", style___rotate_3);
        attr(span8, "class", "date__text svelte-gnvuwu");
        attr(span9, "class", "date__display svelte-gnvuwu");
        attr(div4, "class", "date__part date__part--minutes svelte-gnvuwu");
        set_style(div4, "--rotate", style___rotate_4);
        attr(span10, "id", ctx[9]);
        attr(span10, "class", "date__text svelte-gnvuwu");
        attr(div5, "class", "date__label svelte-gnvuwu");
        set_style(div5, "--rotate", style___rotate_5);
        attr(div6, "aria-labelledby", ctx[9]);
        attr(div6, "class", "date svelte-gnvuwu");
        set_style(div6, "--color-accent", ctx[1]);
        set_style(div6, "--translateX", style___translateX);
        set_style(div6, "--translateY", style___translateY);
        set_style(div6, "border-radius", style_border_radius);
      },
      m(target, anchor) {
        insert(target, div6, anchor);
        append(div6, div0);
        append(div0, span0);
        append(div0, t1);
        append(div0, span1);
        append(span1, t2);
        append(div6, t3);
        append(div6, div1);
        append(div1, span2);
        append(div1, t5);
        append(div1, span3);
        append(span3, t6);
        append(div6, t7);
        append(div6, div2);
        append(div2, span4);
        append(div2, t9);
        append(div2, span5);
        append(span5, t10);
        append(div6, t11);
        mount_component(ampm, div6, null);
        append(div6, t12);
        append(div6, div3);
        append(div3, span6);
        append(div3, t14);
        append(div3, span7);
        append(span7, t15);
        append(div6, t16);
        append(div6, div4);
        append(div4, span8);
        append(div4, t18);
        append(div4, span9);
        append(span9, t19);
        append(div6, t20);
        append(div6, div5);
        append(div5, span10);
        append(span10, t21);
        current = true;
      },
      p(ctx2, [dirty]) {
        if (!current || dirty & 64)
          set_data(t2, ctx2[6]);
        if (!current || dirty & 32)
          set_data(t6, ctx2[5]);
        if (!current || dirty & 16)
          set_data(t10, ctx2[4]);
        const ampm_changes = {};
        if (dirty & 8)
          ampm_changes.am = ctx2[3] < 12;
        ampm.$set(ampm_changes);
        if (!current || dirty & 8)
          set_data(t15, ctx2[3]);
        if (!current || dirty & 4)
          set_data(t19, ctx2[2]);
        if (!current || dirty & 1)
          set_data(t21, ctx2[0]);
        if (dirty & 2) {
          set_style(div6, "--color-accent", ctx2[1]);
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(ampm.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(ampm.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching)
          detach(div6);
        destroy_component(ampm);
      }
    };
  }
  function instance2($$self, $$props, $$invalidate) {
    let month;
    let day;
    let year;
    let hours;
    let minutes;
    let { label = "" } = $$props;
    let { dateTarget } = $$props;
    let { accentColor } = $$props;
    const translateX = randomIntFromInterval(-5, 5);
    const translateY = randomIntFromInterval(-2, 5);
    const id = `${Math.random()}-label`;
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];
    onMount(() => {
      console.log({ dateTarget });
    });
    $$self.$$set = ($$props2) => {
      if ("label" in $$props2)
        $$invalidate(0, label = $$props2.label);
      if ("dateTarget" in $$props2)
        $$invalidate(10, dateTarget = $$props2.dateTarget);
      if ("accentColor" in $$props2)
        $$invalidate(1, accentColor = $$props2.accentColor);
    };
    $$self.$$.update = () => {
      if ($$self.$$.dirty & 1024) {
        $:
          $$invalidate(6, month = months[dateTarget.getMonth()]);
      }
      if ($$self.$$.dirty & 1024) {
        $:
          $$invalidate(5, day = String(dateTarget.getDate()).padStart(2, 0));
      }
      if ($$self.$$.dirty & 1024) {
        $:
          $$invalidate(4, year = dateTarget.getFullYear());
      }
      if ($$self.$$.dirty & 1024) {
        $:
          $$invalidate(3, hours = dateTarget.getHours() < 12 ? String(dateTarget.getHours()).padStart(2, 0) : String(dateTarget.getHours() - 12).padStart(2, 0));
      }
      if ($$self.$$.dirty & 1024) {
        $:
          $$invalidate(2, minutes = String(dateTarget.getMinutes()).padStart(2, 0));
      }
    };
    return [
      label,
      accentColor,
      minutes,
      hours,
      year,
      day,
      month,
      translateX,
      translateY,
      id,
      dateTarget
    ];
  }
  var Date2 = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance2, create_fragment2, safe_not_equal, { label: 0, dateTarget: 10, accentColor: 1 });
    }
  };
  var Date_default = Date2;

  // src/components/Keypad.svelte
  function get_each_context(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[6] = list[i];
    return child_ctx;
  }
  function create_each_block(ctx) {
    let li;
    let button;
    let li_class_value;
    let mounted;
    let dispose;
    return {
      c() {
        li = element("li");
        button = element("button");
        attr(button, "class", "svelte-1w3ke9j");
        attr(li, "class", li_class_value = "key key--" + ctx[6] + " svelte-1w3ke9j");
      },
      m(target, anchor) {
        insert(target, li, anchor);
        append(li, button);
        button.innerHTML = ctx[6];
        if (!mounted) {
          dispose = listen(button, "click", ctx[2]);
          mounted = true;
        }
      },
      p: noop,
      d(detaching) {
        if (detaching)
          detach(li);
        mounted = false;
        dispose();
      }
    };
  }
  function create_fragment3(ctx) {
    let div6;
    let div3;
    let div0;
    let t0;
    let div1;
    let t1;
    let button0;
    let t2;
    let div2;
    let t3;
    let div4;
    let t4;
    let t5;
    let div5;
    let ul;
    let t6;
    let li;
    let button1;
    let mounted;
    let dispose;
    let each_value = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
    let each_blocks = [];
    for (let i = 0; i < 10; i += 1) {
      each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    }
    return {
      c() {
        div6 = element("div");
        div3 = element("div");
        div0 = element("div");
        t0 = space();
        div1 = element("div");
        t1 = space();
        button0 = element("button");
        t2 = space();
        div2 = element("div");
        t3 = space();
        div4 = element("div");
        t4 = text(ctx[0]);
        t5 = space();
        div5 = element("div");
        ul = element("ul");
        for (let i = 0; i < 10; i += 1) {
          each_blocks[i].c();
        }
        t6 = space();
        li = element("li");
        button1 = element("button");
        button1.textContent = "\xD7";
        attr(div0, "class", "light svelte-1w3ke9j");
        toggle_class(div0, "mute", ctx[0].length >= minimum);
        set_style(div0, "--color-accent", `red`);
        attr(div1, "class", "light svelte-1w3ke9j");
        toggle_class(div1, "mute", ctx[0].length >= minimum);
        set_style(div1, "--color-accent", `yellow`);
        attr(button0, "class", "light svelte-1w3ke9j");
        toggle_class(button0, "blink", ctx[0].length >= minimum);
        set_style(button0, "--color-accent", `lightgreen`);
        attr(div2, "class", "light svelte-1w3ke9j");
        toggle_class(div2, "mute", ctx[0].length >= minimum);
        set_style(div2, "--color-accent", `yellow`);
        attr(div3, "class", "controls__lights svelte-1w3ke9j");
        attr(div4, "class", "controls__readout svelte-1w3ke9j");
        attr(button1, "class", "svelte-1w3ke9j");
        attr(li, "class", "key key--reset svelte-1w3ke9j");
        attr(ul, "class", "keypad svelte-1w3ke9j");
        attr(div5, "class", "controls__keypad svelte-1w3ke9j");
        attr(div6, "class", "controls svelte-1w3ke9j");
      },
      m(target, anchor) {
        insert(target, div6, anchor);
        append(div6, div3);
        append(div3, div0);
        append(div3, t0);
        append(div3, div1);
        append(div3, t1);
        append(div3, button0);
        append(div3, t2);
        append(div3, div2);
        append(div6, t3);
        append(div6, div4);
        append(div4, t4);
        append(div6, t5);
        append(div6, div5);
        append(div5, ul);
        for (let i = 0; i < 10; i += 1) {
          each_blocks[i].m(ul, null);
        }
        append(ul, t6);
        append(ul, li);
        append(li, button1);
        if (!mounted) {
          dispose = [
            listen(button0, "click", ctx[1]),
            listen(button1, "click", ctx[3])
          ];
          mounted = true;
        }
      },
      p(ctx2, [dirty]) {
        if (dirty & 1) {
          toggle_class(div0, "mute", ctx2[0].length >= minimum);
        }
        if (dirty & 1) {
          toggle_class(div1, "mute", ctx2[0].length >= minimum);
        }
        if (dirty & 1) {
          toggle_class(button0, "blink", ctx2[0].length >= minimum);
        }
        if (dirty & 1) {
          toggle_class(div2, "mute", ctx2[0].length >= minimum);
        }
        if (dirty & 1)
          set_data(t4, ctx2[0]);
        if (dirty & 4) {
          each_value = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
          let i;
          for (i = 0; i < 10; i += 1) {
            const child_ctx = get_each_context(ctx2, each_value, i);
            if (each_blocks[i]) {
              each_blocks[i].p(child_ctx, dirty);
            } else {
              each_blocks[i] = create_each_block(child_ctx);
              each_blocks[i].c();
              each_blocks[i].m(ul, t6);
            }
          }
          for (; i < 10; i += 1) {
            each_blocks[i].d(1);
          }
        }
      },
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching)
          detach(div6);
        destroy_each(each_blocks, detaching);
        mounted = false;
        run_all(dispose);
      }
    };
  }
  var minimum = 8;
  function instance3($$self, $$props, $$invalidate) {
    let { value } = $$props;
    const lights = ["red", "yellow", "lightgreen", "yellow"];
    let input = "";
    function updateDate(e) {
      if (input.length < minimum)
        return;
      console.log("updating");
      const month = +input.slice(0, 2);
      const day = +input.slice(2, 4);
      const year = +input.slice(4, 8);
      const hours = +input.slice(8, 10) || 0;
      const minutes = +input.slice(10) || 0;
      console.log({ month, day, year, hours, minutes });
      window.dispatchEvent(new Event("go"));
    }
    function handleNumber(e) {
      const number = e.target.textContent;
      $$invalidate(0, input += number);
    }
    function onReset() {
      $$invalidate(0, input = "");
    }
    $$self.$$set = ($$props2) => {
      if ("value" in $$props2)
        $$invalidate(4, value = $$props2.value);
    };
    return [input, updateDate, handleNumber, onReset, value];
  }
  var Keypad = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance3, create_fragment3, safe_not_equal, { value: 4 });
    }
  };
  var Keypad_default = Keypad;

  // node_modules/d3-format/src/formatDecimal.js
  function formatDecimal_default(x) {
    return Math.abs(x = Math.round(x)) >= 1e21 ? x.toLocaleString("en").replace(/,/g, "") : x.toString(10);
  }
  function formatDecimalParts(x, p) {
    if ((i = (x = p ? x.toExponential(p - 1) : x.toExponential()).indexOf("e")) < 0)
      return null;
    var i, coefficient = x.slice(0, i);
    return [
      coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient,
      +x.slice(i + 1)
    ];
  }

  // node_modules/d3-format/src/exponent.js
  function exponent_default(x) {
    return x = formatDecimalParts(Math.abs(x)), x ? x[1] : NaN;
  }

  // node_modules/d3-format/src/formatGroup.js
  function formatGroup_default(grouping, thousands) {
    return function(value, width) {
      var i = value.length, t = [], j = 0, g = grouping[0], length = 0;
      while (i > 0 && g > 0) {
        if (length + g + 1 > width)
          g = Math.max(1, width - length);
        t.push(value.substring(i -= g, i + g));
        if ((length += g + 1) > width)
          break;
        g = grouping[j = (j + 1) % grouping.length];
      }
      return t.reverse().join(thousands);
    };
  }

  // node_modules/d3-format/src/formatNumerals.js
  function formatNumerals_default(numerals) {
    return function(value) {
      return value.replace(/[0-9]/g, function(i) {
        return numerals[+i];
      });
    };
  }

  // node_modules/d3-format/src/formatSpecifier.js
  var re = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;
  function formatSpecifier(specifier) {
    if (!(match = re.exec(specifier)))
      throw new Error("invalid format: " + specifier);
    var match;
    return new FormatSpecifier({
      fill: match[1],
      align: match[2],
      sign: match[3],
      symbol: match[4],
      zero: match[5],
      width: match[6],
      comma: match[7],
      precision: match[8] && match[8].slice(1),
      trim: match[9],
      type: match[10]
    });
  }
  formatSpecifier.prototype = FormatSpecifier.prototype;
  function FormatSpecifier(specifier) {
    this.fill = specifier.fill === void 0 ? " " : specifier.fill + "";
    this.align = specifier.align === void 0 ? ">" : specifier.align + "";
    this.sign = specifier.sign === void 0 ? "-" : specifier.sign + "";
    this.symbol = specifier.symbol === void 0 ? "" : specifier.symbol + "";
    this.zero = !!specifier.zero;
    this.width = specifier.width === void 0 ? void 0 : +specifier.width;
    this.comma = !!specifier.comma;
    this.precision = specifier.precision === void 0 ? void 0 : +specifier.precision;
    this.trim = !!specifier.trim;
    this.type = specifier.type === void 0 ? "" : specifier.type + "";
  }
  FormatSpecifier.prototype.toString = function() {
    return this.fill + this.align + this.sign + this.symbol + (this.zero ? "0" : "") + (this.width === void 0 ? "" : Math.max(1, this.width | 0)) + (this.comma ? "," : "") + (this.precision === void 0 ? "" : "." + Math.max(0, this.precision | 0)) + (this.trim ? "~" : "") + this.type;
  };

  // node_modules/d3-format/src/formatTrim.js
  function formatTrim_default(s) {
    out:
      for (var n = s.length, i = 1, i0 = -1, i1; i < n; ++i) {
        switch (s[i]) {
          case ".":
            i0 = i1 = i;
            break;
          case "0":
            if (i0 === 0)
              i0 = i;
            i1 = i;
            break;
          default:
            if (!+s[i])
              break out;
            if (i0 > 0)
              i0 = 0;
            break;
        }
      }
    return i0 > 0 ? s.slice(0, i0) + s.slice(i1 + 1) : s;
  }

  // node_modules/d3-format/src/formatPrefixAuto.js
  var prefixExponent;
  function formatPrefixAuto_default(x, p) {
    var d = formatDecimalParts(x, p);
    if (!d)
      return x + "";
    var coefficient = d[0], exponent = d[1], i = exponent - (prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3) + 1, n = coefficient.length;
    return i === n ? coefficient : i > n ? coefficient + new Array(i - n + 1).join("0") : i > 0 ? coefficient.slice(0, i) + "." + coefficient.slice(i) : "0." + new Array(1 - i).join("0") + formatDecimalParts(x, Math.max(0, p + i - 1))[0];
  }

  // node_modules/d3-format/src/formatRounded.js
  function formatRounded_default(x, p) {
    var d = formatDecimalParts(x, p);
    if (!d)
      return x + "";
    var coefficient = d[0], exponent = d[1];
    return exponent < 0 ? "0." + new Array(-exponent).join("0") + coefficient : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1) : coefficient + new Array(exponent - coefficient.length + 2).join("0");
  }

  // node_modules/d3-format/src/formatTypes.js
  var formatTypes_default = {
    "%": (x, p) => (x * 100).toFixed(p),
    "b": (x) => Math.round(x).toString(2),
    "c": (x) => x + "",
    "d": formatDecimal_default,
    "e": (x, p) => x.toExponential(p),
    "f": (x, p) => x.toFixed(p),
    "g": (x, p) => x.toPrecision(p),
    "o": (x) => Math.round(x).toString(8),
    "p": (x, p) => formatRounded_default(x * 100, p),
    "r": formatRounded_default,
    "s": formatPrefixAuto_default,
    "X": (x) => Math.round(x).toString(16).toUpperCase(),
    "x": (x) => Math.round(x).toString(16)
  };

  // node_modules/d3-format/src/identity.js
  function identity_default(x) {
    return x;
  }

  // node_modules/d3-format/src/locale.js
  var map = Array.prototype.map;
  var prefixes = ["y", "z", "a", "f", "p", "n", "\xB5", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y"];
  function locale_default(locale2) {
    var group = locale2.grouping === void 0 || locale2.thousands === void 0 ? identity_default : formatGroup_default(map.call(locale2.grouping, Number), locale2.thousands + ""), currencyPrefix = locale2.currency === void 0 ? "" : locale2.currency[0] + "", currencySuffix = locale2.currency === void 0 ? "" : locale2.currency[1] + "", decimal = locale2.decimal === void 0 ? "." : locale2.decimal + "", numerals = locale2.numerals === void 0 ? identity_default : formatNumerals_default(map.call(locale2.numerals, String)), percent = locale2.percent === void 0 ? "%" : locale2.percent + "", minus = locale2.minus === void 0 ? "\u2212" : locale2.minus + "", nan = locale2.nan === void 0 ? "NaN" : locale2.nan + "";
    function newFormat(specifier) {
      specifier = formatSpecifier(specifier);
      var fill = specifier.fill, align = specifier.align, sign = specifier.sign, symbol = specifier.symbol, zero = specifier.zero, width = specifier.width, comma = specifier.comma, precision = specifier.precision, trim = specifier.trim, type = specifier.type;
      if (type === "n")
        comma = true, type = "g";
      else if (!formatTypes_default[type])
        precision === void 0 && (precision = 12), trim = true, type = "g";
      if (zero || fill === "0" && align === "=")
        zero = true, fill = "0", align = "=";
      var prefix = symbol === "$" ? currencyPrefix : symbol === "#" && /[boxX]/.test(type) ? "0" + type.toLowerCase() : "", suffix = symbol === "$" ? currencySuffix : /[%p]/.test(type) ? percent : "";
      var formatType = formatTypes_default[type], maybeSuffix = /[defgprs%]/.test(type);
      precision = precision === void 0 ? 6 : /[gprs]/.test(type) ? Math.max(1, Math.min(21, precision)) : Math.max(0, Math.min(20, precision));
      function format2(value) {
        var valuePrefix = prefix, valueSuffix = suffix, i, n, c;
        if (type === "c") {
          valueSuffix = formatType(value) + valueSuffix;
          value = "";
        } else {
          value = +value;
          var valueNegative = value < 0 || 1 / value < 0;
          value = isNaN(value) ? nan : formatType(Math.abs(value), precision);
          if (trim)
            value = formatTrim_default(value);
          if (valueNegative && +value === 0 && sign !== "+")
            valueNegative = false;
          valuePrefix = (valueNegative ? sign === "(" ? sign : minus : sign === "-" || sign === "(" ? "" : sign) + valuePrefix;
          valueSuffix = (type === "s" ? prefixes[8 + prefixExponent / 3] : "") + valueSuffix + (valueNegative && sign === "(" ? ")" : "");
          if (maybeSuffix) {
            i = -1, n = value.length;
            while (++i < n) {
              if (c = value.charCodeAt(i), 48 > c || c > 57) {
                valueSuffix = (c === 46 ? decimal + value.slice(i + 1) : value.slice(i)) + valueSuffix;
                value = value.slice(0, i);
                break;
              }
            }
          }
        }
        if (comma && !zero)
          value = group(value, Infinity);
        var length = valuePrefix.length + value.length + valueSuffix.length, padding = length < width ? new Array(width - length + 1).join(fill) : "";
        if (comma && zero)
          value = group(padding + value, padding.length ? width - valueSuffix.length : Infinity), padding = "";
        switch (align) {
          case "<":
            value = valuePrefix + value + valueSuffix + padding;
            break;
          case "=":
            value = valuePrefix + padding + value + valueSuffix;
            break;
          case "^":
            value = padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length);
            break;
          default:
            value = padding + valuePrefix + value + valueSuffix;
            break;
        }
        return numerals(value);
      }
      format2.toString = function() {
        return specifier + "";
      };
      return format2;
    }
    function formatPrefix2(specifier, value) {
      var f = newFormat((specifier = formatSpecifier(specifier), specifier.type = "f", specifier)), e = Math.max(-8, Math.min(8, Math.floor(exponent_default(value) / 3))) * 3, k = Math.pow(10, -e), prefix = prefixes[8 + e / 3];
      return function(value2) {
        return f(k * value2) + prefix;
      };
    }
    return {
      format: newFormat,
      formatPrefix: formatPrefix2
    };
  }

  // node_modules/d3-format/src/defaultLocale.js
  var locale;
  var format;
  var formatPrefix;
  defaultLocale({
    thousands: ",",
    grouping: [3],
    currency: ["$", ""]
  });
  function defaultLocale(definition) {
    locale = locale_default(definition);
    format = locale.format;
    formatPrefix = locale.formatPrefix;
    return locale;
  }

  // src/components/LED.svelte
  function create_fragment4(ctx) {
    let div;
    let span0;
    let t0;
    let t1;
    let span1;
    let t2;
    return {
      c() {
        div = element("div");
        span0 = element("span");
        t0 = text(ctx[1]);
        t1 = space();
        span1 = element("span");
        t2 = text(ctx[0]);
        attr(span0, "class", "led__fill svelte-qrdzrt");
        attr(span1, "class", "led__number svelte-qrdzrt");
        attr(div, "class", "led svelte-qrdzrt");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        append(div, span0);
        append(span0, t0);
        append(div, t1);
        append(div, span1);
        append(span1, t2);
      },
      p(ctx2, [dirty]) {
        if (dirty & 2)
          set_data(t0, ctx2[1]);
        if (dirty & 1)
          set_data(t2, ctx2[0]);
      },
      i: noop,
      o: noop,
      d(detaching) {
        if (detaching)
          detach(div);
      }
    };
  }
  function instance4($$self, $$props, $$invalidate) {
    let { number = "" } = $$props;
    let { fillText = ["8888", "1111", "7777"] } = $$props;
    $$self.$$set = ($$props2) => {
      if ("number" in $$props2)
        $$invalidate(0, number = $$props2.number);
      if ("fillText" in $$props2)
        $$invalidate(1, fillText = $$props2.fillText);
    };
    return [number, fillText];
  }
  var LED = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance4, create_fragment4, safe_not_equal, { number: 0, fillText: 1 });
    }
  };
  var LED_default = LED;

  // src/components/Speedometer.svelte
  function create_fragment5(ctx) {
    let div;
    let led;
    let current;
    let mounted;
    let dispose;
    led = new LED_default({
      props: {
        fillText: [88.8, 11.1, 77.7],
        number: ctx[1](ctx[0])
      }
    });
    return {
      c() {
        div = element("div");
        create_component(led.$$.fragment);
        attr(div, "class", "speedometer svelte-50ele3");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        mount_component(led, div, null);
        current = true;
        if (!mounted) {
          dispose = listen(window, "go", ctx[2]);
          mounted = true;
        }
      },
      p(ctx2, [dirty]) {
        const led_changes = {};
        if (dirty & 1)
          led_changes.number = ctx2[1](ctx2[0]);
        led.$set(led_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(led.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(led.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching)
          detach(div);
        destroy_component(led);
        mounted = false;
        dispose();
      }
    };
  }
  function instance5($$self, $$props, $$invalidate) {
    let speed = "";
    const formatNumber = format(".1f");
    function handleGo(e) {
      console.log("going");
      if (!speed)
        $$invalidate(0, speed = 0);
      console.log(speed);
      const speeder = setInterval(() => {
        $$invalidate(0, speed += 0.1);
        if (speed >= 88)
          clearInterval(speeder);
      }, 10);
    }
    return [speed, formatNumber, handleGo];
  }
  var Speedometer = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance5, create_fragment5, safe_not_equal, {});
    }
  };
  var Speedometer_default = Speedometer;

  // src/App.svelte
  function get_each_context2(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[4] = list[i].dateTarget;
    child_ctx[5] = list[i].accentColor;
    child_ctx[6] = list[i].label;
    return child_ctx;
  }
  function create_each_block2(ctx) {
    let datemodule;
    let current;
    datemodule = new Date_default({
      props: {
        dateTarget: ctx[4],
        accentColor: ctx[5],
        label: ctx[6]
      }
    });
    return {
      c() {
        create_component(datemodule.$$.fragment);
      },
      m(target, anchor) {
        mount_component(datemodule, target, anchor);
        current = true;
      },
      p: noop,
      i(local) {
        if (current)
          return;
        transition_in(datemodule.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(datemodule.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        destroy_component(datemodule, detaching);
      }
    };
  }
  function create_fragment6(ctx) {
    let main;
    let div;
    let t0;
    let keypad_1;
    let t1;
    let speedometer;
    let current;
    let each_value = ctx[1];
    let each_blocks = [];
    for (let i = 0; i < each_value.length; i += 1) {
      each_blocks[i] = create_each_block2(get_each_context2(ctx, each_value, i));
    }
    const out = (i) => transition_out(each_blocks[i], 1, 1, () => {
      each_blocks[i] = null;
    });
    let keypad_1_props = {};
    keypad_1 = new Keypad_default({ props: keypad_1_props });
    ctx[2](keypad_1);
    speedometer = new Speedometer_default({});
    return {
      c() {
        main = element("main");
        div = element("div");
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }
        t0 = space();
        create_component(keypad_1.$$.fragment);
        t1 = space();
        create_component(speedometer.$$.fragment);
        attr(div, "class", "dash svelte-lnm0k");
        attr(main, "class", "svelte-lnm0k");
      },
      m(target, anchor) {
        insert(target, main, anchor);
        append(main, div);
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].m(div, null);
        }
        append(main, t0);
        mount_component(keypad_1, main, null);
        append(main, t1);
        mount_component(speedometer, main, null);
        current = true;
      },
      p(ctx2, [dirty]) {
        if (dirty & 2) {
          each_value = ctx2[1];
          let i;
          for (i = 0; i < each_value.length; i += 1) {
            const child_ctx = get_each_context2(ctx2, each_value, i);
            if (each_blocks[i]) {
              each_blocks[i].p(child_ctx, dirty);
              transition_in(each_blocks[i], 1);
            } else {
              each_blocks[i] = create_each_block2(child_ctx);
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
        const keypad_1_changes = {};
        keypad_1.$set(keypad_1_changes);
      },
      i(local) {
        if (current)
          return;
        for (let i = 0; i < each_value.length; i += 1) {
          transition_in(each_blocks[i]);
        }
        transition_in(keypad_1.$$.fragment, local);
        transition_in(speedometer.$$.fragment, local);
        current = true;
      },
      o(local) {
        each_blocks = each_blocks.filter(Boolean);
        for (let i = 0; i < each_blocks.length; i += 1) {
          transition_out(each_blocks[i]);
        }
        transition_out(keypad_1.$$.fragment, local);
        transition_out(speedometer.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching)
          detach(main);
        destroy_each(each_blocks, detaching);
        ctx[2](null);
        destroy_component(keypad_1);
        destroy_component(speedometer);
      }
    };
  }
  function instance6($$self, $$props, $$invalidate) {
    let keypad;
    let datesVisited = [new Date(1985, 9, 26, 1, 21, 0)];
    const dates = [
      {
        dateTarget: new Date(1985, 9, 26, 1, 20, 0),
        accentColor: "#F6581B",
        label: "Destination time"
      },
      {
        dateTarget: new Date(),
        accentColor: "#4FC93F",
        label: "Present time"
      },
      {
        dateTarget: datesVisited.at(-1),
        accentColor: "#E6CA36",
        label: "Last time departed"
      }
    ];
    function keypad_1_binding($$value) {
      binding_callbacks[$$value ? "unshift" : "push"](() => {
        keypad = $$value;
        $$invalidate(0, keypad);
      });
    }
    return [keypad, dates, keypad_1_binding];
  }
  var App = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance6, create_fragment6, safe_not_equal, {});
    }
  };
  var App_default = App;

  // src/main.js
  var app = new App_default({
    target: document.body,
    props: {
      name: "world"
    }
  });
  var main_default = app;
})();
//# sourceMappingURL=bundle.js.map

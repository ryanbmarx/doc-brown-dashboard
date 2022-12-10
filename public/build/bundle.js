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
  function element(name) {
    return document.createElement(name);
  }
  function text(data) {
    return document.createTextNode(data);
  }
  function space() {
    return text(" ");
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
  function init(component, options, instance4, create_fragment4, not_equal, props, append_styles, dirty = [-1]) {
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
    $$.ctx = instance4 ? instance4(component, options.props || {}, (i, ret, ...rest) => {
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
    $$.fragment = create_fragment4 ? create_fragment4($$.ctx) : false;
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
    let t3;
    let div1;
    let span2;
    let t5;
    let span3;
    let t6;
    let t7;
    let div2;
    let span4;
    let t9;
    let span5;
    let t10;
    let t11;
    let ampm;
    let t12;
    let div3;
    let span6;
    let t14;
    let span7;
    let t15;
    let t16;
    let div4;
    let span8;
    let t18;
    let span9;
    let t19;
    let t20;
    let div5;
    let span10;
    let t21;
    let style___rotate = `${ctx[9]}deg`;
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
        attr(span0, "class", "date__text svelte-t9v58o");
        attr(span1, "class", "date__display svelte-t9v58o");
        attr(div0, "class", "date__part date__part--month svelte-t9v58o");
        attr(span2, "class", "date__text svelte-t9v58o");
        attr(span3, "class", "date__display svelte-t9v58o");
        attr(div1, "class", "date__part date__part--day svelte-t9v58o");
        attr(span4, "class", "date__text svelte-t9v58o");
        attr(span5, "class", "date__display svelte-t9v58o");
        attr(div2, "class", "date__part date__part--year svelte-t9v58o");
        attr(span6, "class", "date__text svelte-t9v58o");
        attr(span7, "class", "date__display svelte-t9v58o");
        attr(div3, "class", "date__part date__part--hours svelte-t9v58o");
        attr(span8, "class", "date__text svelte-t9v58o");
        attr(span9, "class", "date__display svelte-t9v58o");
        attr(div4, "class", "date__part date__part--minutes svelte-t9v58o");
        attr(span10, "id", ctx[10]);
        attr(span10, "class", "date__text svelte-t9v58o");
        attr(div5, "class", "date__label svelte-t9v58o");
        attr(div6, "aria-labelledby", ctx[10]);
        attr(div6, "class", "date svelte-t9v58o");
        set_style(div6, "--color-accent", ctx[1]);
        set_style(div6, "--rotate", style___rotate);
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
    let { dateTarget = new Date() } = $$props;
    let { accentColor } = $$props;
    const translateX = randomIntFromInterval(-5, 5);
    const translateY = randomIntFromInterval(-2, 5);
    const rotate = randomIntFromInterval(-0.6, 0.6);
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
        $$invalidate(11, dateTarget = $$props2.dateTarget);
      if ("accentColor" in $$props2)
        $$invalidate(1, accentColor = $$props2.accentColor);
    };
    $$self.$$.update = () => {
      if ($$self.$$.dirty & 2048) {
        $:
          $$invalidate(6, month = months[dateTarget.getMonth()]);
      }
      if ($$self.$$.dirty & 2048) {
        $:
          $$invalidate(5, day = String(dateTarget.getDate()).padStart(2, 0));
      }
      if ($$self.$$.dirty & 2048) {
        $:
          $$invalidate(4, year = dateTarget.getFullYear());
      }
      if ($$self.$$.dirty & 2048) {
        $:
          $$invalidate(3, hours = String(dateTarget.getHours()).padStart(2, 0));
      }
      if ($$self.$$.dirty & 2048) {
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
      rotate,
      id,
      dateTarget
    ];
  }
  var Date_1 = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance2, create_fragment2, safe_not_equal, { label: 0, dateTarget: 11, accentColor: 1 });
    }
  };
  var Date_default = Date_1;

  // src/App.svelte
  function create_fragment3(ctx) {
    let div;
    let datemodule0;
    let t0;
    let datemodule1;
    let t1;
    let datemodule2;
    let current;
    datemodule0 = new Date_default({
      props: {
        dateTarget: new Date(1985, 9, 26, 1, 21, 0),
        accentColor: "#F6581B",
        label: "Destination time"
      }
    });
    datemodule1 = new Date_default({
      props: {
        dateTarget: new Date(1985, 9, 26, 13, 22, 0),
        accentColor: "#4FC93F",
        label: "Present time"
      }
    });
    datemodule2 = new Date_default({
      props: {
        dateTarget: new Date(1985, 9, 26, 1, 20, 0),
        accentColor: "#E6CA36",
        label: "Last time departed"
      }
    });
    return {
      c() {
        div = element("div");
        create_component(datemodule0.$$.fragment);
        t0 = space();
        create_component(datemodule1.$$.fragment);
        t1 = space();
        create_component(datemodule2.$$.fragment);
        attr(div, "class", "dash svelte-1umw2o5");
      },
      m(target, anchor) {
        insert(target, div, anchor);
        mount_component(datemodule0, div, null);
        append(div, t0);
        mount_component(datemodule1, div, null);
        append(div, t1);
        mount_component(datemodule2, div, null);
        current = true;
      },
      p: noop,
      i(local) {
        if (current)
          return;
        transition_in(datemodule0.$$.fragment, local);
        transition_in(datemodule1.$$.fragment, local);
        transition_in(datemodule2.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(datemodule0.$$.fragment, local);
        transition_out(datemodule1.$$.fragment, local);
        transition_out(datemodule2.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        if (detaching)
          detach(div);
        destroy_component(datemodule0);
        destroy_component(datemodule1);
        destroy_component(datemodule2);
      }
    };
  }
  function instance3($$self, $$props, $$invalidate) {
    let { name } = $$props;
    $$self.$$set = ($$props2) => {
      if ("name" in $$props2)
        $$invalidate(0, name = $$props2.name);
    };
    return [name];
  }
  var App = class extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance3, create_fragment3, safe_not_equal, { name: 0 });
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

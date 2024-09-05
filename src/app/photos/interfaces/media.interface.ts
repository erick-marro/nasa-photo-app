// To parse this data:
//
//   import { Convert, Media } from "./file";
//
//   const media = Convert.toMedia(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface Media {
    collection: Collection;
}

export interface Collection {
    version:  string;
    href:     string;
    items:    Item[];
    metadata: Metadata;
    links:    CollectionLink[];
}

export interface Item {
    href:   string;
    data:   Datum[];
    links?: ItemLink[];
}

export interface Datum {
    center:             string;
    date_created:       Date;
    description?:       string;
    keywords?:          string[];
    media_type:         MediaType;
    nasa_id:            string;
    photographer?:      string;
    title:              string;
    album?:             string[];
    location?:          string;
    description_508?:   string;
    secondary_creator?: string;
}

export enum MediaType {
    Audio = "audio",
    Image = "image",
    Video = "video",
}

export interface ItemLink {
    href:    string;
    rel:     Rel;
    render?: MediaType;
}

export enum Rel {
    Captions = "captions",
    Preview = "preview",
}

export interface CollectionLink {
    rel:    string;
    prompt: string;
    href:   string;
}

export interface Metadata {
    total_hits: number;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toMedia(json: string): Media {
        return cast(JSON.parse(json), r("Media"));
    }

    public static mediaToJson(value: Media): string {
        return JSON.stringify(uncast(value, r("Media")), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ''): never {
    const prettyTyp = prettyTypeName(typ);
    const parentText = parent ? ` on ${parent}` : '';
    const keyText = key ? ` for key "${key}"` : '';
    throw Error(`Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`);
}

function prettyTypeName(typ: any): string {
    if (Array.isArray(typ)) {
        if (typ.length === 2 && typ[0] === undefined) {
            return `an optional ${prettyTypeName(typ[1])}`;
        } else {
            return `one of [${typ.map(a => { return prettyTypeName(a); }).join(", ")}]`;
        }
    } else if (typeof typ === "object" && typ.literal !== undefined) {
        return typ.literal;
    } else {
        return typeof typ;
    }
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = '', parent: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key, parent);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val, key, parent);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases.map(a => { return l(a); }), val, key, parent);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue(l("Date"), val, key, parent);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue(l(ref || "object"), val, key, parent);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, key, ref);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key, ref);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val, key, parent);
    }
    if (typ === false) return invalidValue(typ, val, key, parent);
    let ref: any = undefined;
    while (typeof typ === "object" && typ.ref !== undefined) {
        ref = typ.ref;
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val, key, parent);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
    return { literal: typ };
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "Media": o([
        { json: "collection", js: "collection", typ: r("Collection") },
    ], false),
    "Collection": o([
        { json: "version", js: "version", typ: "" },
        { json: "href", js: "href", typ: "" },
        { json: "items", js: "items", typ: a(r("Item")) },
        { json: "metadata", js: "metadata", typ: r("Metadata") },
        { json: "links", js: "links", typ: a(r("CollectionLink")) },
    ], false),
    "Item": o([
        { json: "href", js: "href", typ: "" },
        { json: "data", js: "data", typ: a(r("Datum")) },
        { json: "links", js: "links", typ: u(undefined, a(r("ItemLink"))) },
    ], false),
    "Datum": o([
        { json: "center", js: "center", typ: "" },
        { json: "date_created", js: "date_created", typ: Date },
        { json: "description", js: "description", typ: u(undefined, "") },
        { json: "keywords", js: "keywords", typ: u(undefined, a("")) },
        { json: "media_type", js: "media_type", typ: r("MediaType") },
        { json: "nasa_id", js: "nasa_id", typ: "" },
        { json: "photographer", js: "photographer", typ: u(undefined, "") },
        { json: "title", js: "title", typ: "" },
        { json: "album", js: "album", typ: u(undefined, a("")) },
        { json: "location", js: "location", typ: u(undefined, "") },
        { json: "description_508", js: "description_508", typ: u(undefined, "") },
        { json: "secondary_creator", js: "secondary_creator", typ: u(undefined, "") },
    ], false),
    "ItemLink": o([
        { json: "href", js: "href", typ: "" },
        { json: "rel", js: "rel", typ: r("Rel") },
        { json: "render", js: "render", typ: u(undefined, r("MediaType")) },
    ], false),
    "CollectionLink": o([
        { json: "rel", js: "rel", typ: "" },
        { json: "prompt", js: "prompt", typ: "" },
        { json: "href", js: "href", typ: "" },
    ], false),
    "Metadata": o([
        { json: "total_hits", js: "total_hits", typ: 0 },
    ], false),
    "MediaType": [
        "audio",
        "image",
        "video",
    ],
    "Rel": [
        "captions",
        "preview",
    ],
};

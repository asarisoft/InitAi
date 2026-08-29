# System Design — A Pacdora-style Packaging Design Platform

> **Reference:** [www.pacdora.com](https://www.pacdora.com) — an online platform for packaging **mockups**, **dieline templates**, **3D packaging modeling**, and AI-generated product backgrounds. Often described as *"Canva + Figma for the packaging industry"*.

---

## 1. Overview

Pacdora is a browser-based SaaS that lets designers and brands go from a flat **2D artwork** to a **print-ready dieline** and a **photorealistic 3D mockup** without leaving the browser, backed by GPU ray-tracing rendering, real-time collaboration, and an AI background generator.

The three hero products we must support:

| Product | What it does |
|---|---|
| **Mockup Generator** | Upload a flat 2D artwork → auto-applied to a 3D model (box, bottle, pouch, can, t-shirt, book…) → real-time 3D preview → export 8K PNG / MP4. |
| **Dieline Template Maker** | Parametric 2D CAD for packaging: pick a structure (FEFCO 0201, tuck-end box, rigid box, tray, envelope…), set dimensions/material/paper thickness, get a print-ready dieline (cut, crease, fold, glue tabs, bleed) as PDF/AI/DXF. |
| **3D Modeling Software** | A 3D scene editor (scene templates, materials, lights, angles) to composite the packaging into studio-like product shots. |
| **AI Background Generator** | Upload a product render/photo → background removed → AI generates personalized, realistic backgrounds. |

Plus horizontal capabilities: **real-time collaboration** (Figma-style comments), an **Adobe Illustrator plugin**, an **embed/editor SDK**, and a **flexible pricing engine** for enterprise packaging vendors.

```
                    ┌─────────────────────────────┐
                    │       Browser Web Studio     │
                    │  React / Three.js / WebGPU   │
                    └─────────────┬───────────────┘
```

---

## 2. Requirements

### 2.1 Functional Requirements

1. **Template library & search** — browse/filter ≥5,000 mockups, ≥3,000 dielines, and design templates by category (box, bottle, pouch, can…), material, and structure family.
2. **Dieline editing (2D CAD)** — parametrically edit dimensions, paper thickness, material, bleed; place artwork/vector panels.
3. **2D → 3D folding** — fold a flat dieline into a 3D model with correct panels, creases, and glue tabs; open/close/rotate.
4. **Real-time 3D preview** — PBR materials (paper, plastic, metal, foil, glass), lighting, environment, and physical-correct surface finishes (e.g., foil stamping, embossing, UV varnish).
5. **GPU rendering & export** — high-resolution renders (up to 8K PNG/JPG) and animations (MP4), plus vector exports (PDF, AI, DXF, SVG, CDR).
6. **AI background generation** — upload product photo, remove background, generate plausible studio backgrounds.
7. **Real-time collaboration** — shareable link, presence, comments/pins on the design, live multi-cursor editing.
8. **Asset management** — user galleries, projects, versioning, cloud upload via presigned URLs.
9. **Pricing engine (enterprise)** — instant quote based on dimensions, material, quantity, finishing.
10. **Tenant/enterprise integration** — embeddable editor SDK + Illustrator plugin.

### 2.2 Non-Functional Requirements

| NFR | Target |
|---|---|
| **Latency** | Template page < 800 ms P95; 3D preview first frame < 1 s; controls respond < 100 ms (client-side); export ticketed (async). |
| **Scale** | 4 M+ registered users; ~500 K MAU; ~200 K DAU; ~20 K concurrent editor sessions; ~100–200 K render jobs/day. |
| **Availability** | 99.9% for web/SaaS; async paths (rendering, AI) tolerate minutes of queue delay. |
| **Durability** | User projects and renders never lost (11 nines object storage, cross-region replication). |
| **Correctness** | Dielines must be production/print-accurate (mm precision, bleed, tolerance) — geometry library must be deterministic. |
| **Multi-tenancy & security** | Per-user/per-org isolation; SSR + granular auth; secure asset delivery; AI output moderation. |
| **Scalability** | Stateless horizontally-scaled API tier; GPU pool elastically autoscales with render queue depth. |

---

## 3. Back-of-the-envelope Estimation

Assume ~200 K DAU and heavy design work:

```
Renders/day          ~ 150,000
Avg GPU render time    ~ 20 s (8K path-traced still)
GPU-seconds/day        = 150,000 × 20 = 3,000,000
GPU-hours/day          = ~833 h
GPUs @ 80% util        = 833 / (24 × 0.8) ≈ 44 GPUs   → pool of ~60 (headroom/spikes)
```

```
Renders/day                              150,000
Avg output size                            30 MB (8K PNG + raw)
Daily render storage                       4.5 TB  → object store (S3-class, infrequent-access)
Video minutes/day                          ~3,000  (60 s avg × 50k animation jobs)
User upload throughput                     ~20 TB/mo
CDN egress                                 2–4 TB/day peak
```

```
Storage (long-term)
  Templates (~10k assets × 50 MB incl. sources)    ~0.5 TB
  User projects/designs (~20 M)                     a few TB (JSON docs + thumbs)
  Renders (30-day retention cycle)                  ~135 TB → archive to cold tier
```

```
Sessions
  Concurrent editor WS connections: 20,000
  Collab ops/sec (peak):              ~100 K/s → streamed via Redis pub/sub, batched to DB
  Catalog filters/search QPS:         ~3 k/s read-mostly (CDN + ES cache)
```

> Conclusion: this is **CPU/GPU-heavy, read-heavy on templates, write-light on design docs, and storage-heavy on media**. Autoscaling GPU workers and a fast asset delivery path dominate the design.

---

## 4. High-Level Architecture

```
                    ┌────────────────────────────────────────────────────┐
                    │                  CLIENTS                           │
                    │  • Web Studio (React + Three.js)                  │
                    │  • Illustrator Plugin (CEF/UXP)                   │
                    │  • Embed SDK (enterprise iframe/JS)               │
                    └───────────┬──────────────────────────┬────────────┘
                                │ HTTPS/REST + WSS         │ presigned upload
                                ▼                          ▼
                    ┌──────────────────────┐     ┌────────────────────────┐
                    │      Edge / CDN      │     │        ObjectStore      │
                    │  CloudFront/Akamai   │     │  S3 (assets, renders,  │
                    │  + WAF + TLS         │     │  uploads)               │
                    └───────────┬──────────┘     └────────────────────────┘
                                ▼
                    ┌────────────────────────────────────────────────┐
                    │            API GATEWAY (Kong/NGINX)            │
                    │  auth(JWT) · rate-limit · routing · request id │
                    └───┬───────┬───────┬────────┬────────┬───────────┘
                        │       │       │        │        │
            ┌───────────┼───────┼───────┼────────┼────────┼───────────┐
            ▼           ▼       ▼       ▼        ▼        ▼           ▼
     ┌──────────┐ ┌─────────┐ ┌──────┐ ┌───────┐ ┌────────┐ ┌──────────┐
     │ Identity │ │ Project │ │ Temp │ │ Search│ │ Collab │ │  Quote / │
     │ /Auth    │ │ Service │ │ late │ │/Catalog│ │  WS    │ │ Pricing  │
     │ Service  │ │         │ │ Svc  │ │ (ES)  │ │ Broker │ │ Service  │
     └──────────┘ └────┬────┘ └──────┘ └───────┘ └────────┘ └────┬─────┘
                       │                                        │
                       ▼                                        ▼
            ┌────────────────────┐                 ┌──────────────────────┐
            │   Dieline Engine    │                 │   Design Doc Store   │
            │  (2D parametric CAD)│                 │  PostgreSQL/TiDB +    │
            │  + Fold (2D→3D)     │                 │  op-log (collab)      │
            └─────────┬──────────┘                 └───────────┬───────────┘
                      │                                        │
                      ▼                                        ▼
            ┌──────────────────────────────────────────────────────────┐
            │                STREAMING / QUEUE LAYER (Kafka)           │
            │   render.jobs · ai.background · export.jobs · events     │
            └──────┬───────────────┬────────────────┬────────────────────┘
                   ▼               ▼                ▼
            ┌──────────────┐ ┌────────────┐ ┌───────────────────┐
            │ Rendering    │ │ Dieline    │ │  AI Background    │
            │ Service      │ │ Worker     │ │  Service          │
            │ (GPU workers,│ │ (CPU/CAD)  │ │  (GPU inference   │
            │  path tracer)│ │            │ │   + moderation)   │
            └──────┬───────┘ └─────┬──────┘ └────────┬──────────┘
                   ▼               ▼                 ▼
            ┌────────────────────────────────────────────────┐
            │               CACHE & STORES                     │
            │  Redis (session/cache/rate) · Postgres/TiDB     │
            │  Elasticsearch · Milvus(vect) · S3 · xCache     │
            └─────────────────────────────────────────────────┘
```

**Request flow (example: render a mockup)**
1. Studio renders client-side preview in real time (Three.js + WebGPU); the user hits **Export 8K**.
2. Client POSTs `/designs/{id}/render` → Project Service snapshots the design doc version → enqueues `render.jobs` on Kafka.
3. Rendering orchestrator claims the job, assigns an idle GPU worker (reporting GPU state via heartbeat), streams progress back over the WS broker.
4. The GPU worker path-traces the scene → writes raw EXR → post-process (tone-map, denoise, resize to 8K) → uploads to object store → emits `job.completed`.
5. Client sidebar polls `/jobs/{id}` (or gets WS event) → shows thumb + "Download" button (presigned URL).

---

## 5. Detailed Design

### 5.1 Client — Web Studio

- **Rendering stack:** Three.js/Babylon.js; WebGL2 today, WebGPU where available; instancing + texture caching.
- **Architecture state:** a client-side **scene graph** mirrors the server design-document JSON (panels, materials, cameras, lights). Every mutation runs through a `CommandBus` → produces an **operation** `op` (see 5.6) → applied locally for instant feedback → sent to collab broker.
- **Precision issue:** folding math on the client and server must be **bit-identical** (same geometry kernel, compiled to WASM for the browser) so preview == final render.
- **Workers:** a shared Web Worker keeps the folding/interaction math off the main thread; large renders use `OffscreenCanvas`.

### 5.2 Dieline Engine (2D Parametric CAD)

The foundation. A dieline is a **2D sheet representation of a foldable 3D structure**:

- **Geometric primitives:** paths, panels (closed polygons), edges, points.
- **Edge roles:** `cut`, `crease` (fold), `score`, `glue-tab`, `perforation`.
- **Sheet properties:** paper type (kraft, coated, corrugated flute types, plastic), **thickness** (drives inside-dimension compensation), grain direction.
- **Standards:** FEFCO/ESBO codes (e.g., 0201 slotted, 0427 mailer); built-in structure families.

```
Dieline model (JSON)
{
  "id": "dieline-100010",
  "family": "tuck-end-box",
  "unit": "mm",
  "sheet": { "material": "kraft", "thickness": 0.8, "grain": "x" },
  "panels": [ {"id":"p1","path":[[0,0],[200,0],...],"role":"face"}, ... ],
  "edges":  [ {"id":"e1","from":"p1","to":"p2","role":"crease","foldAngle":90}, ...],
  "bleed":  3.0,
  "tolerances": { "cut": 0.2, "fold": 0.4 }
}
```

- The **dieline server** computes panel geometry from parametric inputs (outer dims, thickness → **inside/outside conversion**), re-establishes connected geometry, and produces the print layout with bleed, registration/color marks.
- Exports are generated in a dedicated worker pool: PDF (via a canonical layout engine), AI/DXF/SVG (vector serializers), EPS.
- Deterministic & versioned — dielines generated by the *same* version of the kernel always match, which is required for print reliability.

### 5.3 Folding Engine (2D → 3D)

This is the proprietary core (Pacdora's team reports ~6 months on this alone). Approach:

1. **Panel-adjacency graph** — build the dual graph of the dieline where nodes = panels, edges = fold lines (crease edges).
2. **Fold-tree selection** — pick a **root panel** (large face, e.g., bottom panel) and orient the 3D assembly. Panels only reachable through folding edges are child nodes (a tree = a valid "paper unfolding").
3. **Affine fold transform** — relative to panel `P`:
   ```
   T_fold = Translate(-origin_of_edge) ∘ Rotate(axis=edge_vector, θ=±foldAngle)
   ```
   Applied recursively along the tree so each panel's fold is expressed in the *already-assembled parent frame* (avoids floating-point drift from global products — accumulate via 4×4 matrix per node, not per-vertex).
4. **Glue tab resolution** — glue tabs map from one panel to an adjacent mating panel; after folding, their positions must coincide — this is a hard validation (distance < tolerance).
5. **Collision & validity check** — self-intersection test on folded solids (GJK/SAT per convex panel; BVH broad-phase), plus user toggles (open/closed lid states → different fold-angle presets).
6. **Reverse direction (3D → 2D, auto-unfold):** used by *design templates* — take a prism/polyhedron (e.g., generated bottle cross-section swept into 3D), compute its **net** by finding a spanning tree of the polyhedron's face graph, then pack the resulting 2D polygons into a minimal sheet (guillotine/bin packing).

The folded mesh is emitted once per document revision and cached (mesh key = hash of dieline params + fold states).

### 5.4 Rendering Service (GPU)

Two rendering tiers, sharing one material/geometry language:

| Tier | Where | Purpose | Tech |
|---|---|---|---|
| **Real-time preview** | Browser | Interaction (rotate/zoom/light drag) | Rasterization + approximate irradiance, PBR |
| **Final render** | GPU farm | Photoreal 8K stills + MP4 | **Path tracing** (CUDA), GGX microfacet BRDF, two-level BVH |

GPU worker design (Path tracer):

- **Two-level acceleration structure** (top-level BVH over objects / bottom-level BVH per mesh) rebuilt incrementally only for edited sub-graphs → fast updates on *complex scenes*.
- **BRDFs:** GGX microfacet sampling for dielectric/conductive surfaces; measured material presets: paper, E-flute cardboard, PET, glass, brushed metal, foil, varnish.
- **Packaging-specific effects:** foil stamping (masked glossy metal layer), emboss/deboss (normal/height displacement), spot UV (coating layer with distinct BRDF + clearcoat IOR).
- **Memory:** hash-based dedup of identical images/geometries to cut VRAM (many instances of the same box/can) → lowers required GPU memory and hardware cost.
- **Denoiser:** OIDN-based post-pass so 8K can converge at ~20 s instead of minutes.
- **Animations (MP4):** camera-orbit / box-open renders at 1080p24, streamed frame chunks into ffmpeg on the worker.
- **Job orchestration:** Kubernetes DaemonSet of GPU nodes; each node heartbeats its *free slots* to the orchestrator (Redis/ZK); scheduler prefers same-region placement to minimize object-store copy cost.

### 5.5 AI Background Generator

Pipeline (asynchronous, GPU inference):

```
User upload → presigned S3 upload → enqueue ai.background
 → worker:  (1) foreground segmentation (instance matting model)
            (2) product priors: classify product type → suggested scene concepts
            (3) diffusion inpainting conditioned on concept + product alpha
            (4) safety filter + NSFW check
            (5) upload 4 candidates → notify client
```

- **Guarantees:** idempotent job (`job_id` in request), retriable with exponential backoff, TTL ~2 min; user can regenerate (new job, same input asset).
- **Cost & QoS:** diffusion inference is expensive (~5–10 s A100) → capped concurrency per tenant tier; free tier queues lower priority.

### 5.6 Real-time Collaboration (Figma-style)

- **Document model:** the design doc is a schema-versioned JSON (scene graph). Collaborative edits are first-class **operations** (`op`):
  ```
  { "docId", "actor", "seq", "client", "rewriteVersion",
    "op":"applyPaint"|"moveCam"|"comment"|"resizePanel"|"addAsset",
    "path":["panels",0,"fill"], "val":{...}, "ts" }
  ```
- **Consistency:** document content uses **CRDT (Automerge/Yjs)** for the scene graph — panels/paint/layout are concurrent-safe without a central transformer. Cursor/presence is ephemeral (no persistence). Comments are CRDT-free (server-ordered).
- **Transport:** WSS (Socket.IO-style, horizontal fan-out) — editor connects via the **Collab WS Broker**, which subscribes to Redis pub/sub channels per doc; operations are appended to an **op-log** in TiDB and GC-completed snapshots materialized every N ops or T seconds (background snapshot service).
- **Presence:** WS broker keeps a Redis hash `presence:{docId} → {userId → cursor, viewport}`.
- **Permissions:** doc ACL — owner / editor / commenter / viewer; share links via signed tokens (`share:{id}` expiring or permanent).

### 5.7 Pricing Engine (Enterprise)

A **rule-based instant cost calculator**, purely online (no ML):

```
quote = Σ per-part cost(part, material, dims, qty)  + finishing (foil/UV/emboss) + setup/plate
       materials = price(density/area × dims × thickness margin)
       quantity   = tiered breaks (MOQ, incremental discount)
```

- Dieline/panel area is computed by the dieline engine (cannot be user-supplied) → tamper-proof.
- Rules versioned via config service; result cached in Redis keyed by hash of (dieline params, material, qty, finishing) — identical quotes hit cache, so repeated slider dragging is instant.

### 5.8 Export & Download Service

| Format | Path | Worker |
|---|---|---|
| PNG/JPG up to 8K | GPU render tier | Rendering worker |
| MP4 animation | GPU render + ffmpeg | Rendering worker |
| PDF / AI / DXF / SVG / EPS dieline | Dieline worker (vector serializers) | CPU worker |
| Design share link (view-only 3D) | Embed SDK render | — |

Exports produce a zip with bleed/crop marks option and are stored under `exports/{user}/{jobId}/...`.

### 5.9 Search & Discovery

- **Elasticsearch** catalog index: `type ∈ {mockup, dieline, design}`, category tree, tags (FEFCO codes, material, finish), popularity/relevance/trending signals (boost from events stream fed back via Kafka consumer).
- Read-path: CDN-cached static category landing JSON (rebuilt on publish), ES only for deep/faceted filters.
- **Tag generation:** content pipeline analyzes new templates (auto-tag via vision model + manual curation queue).

---

## 6. Data Model (core tables)

```
users(id, email, name, plan, country, created_at, tier)
projects(id, owner_id, org_id?, type: mockup|dieline|scene,
         title, template_id, doc_id, thumb_asset_id, version, deleted_at)
design_docs(id, project_id, schema_version, snapshot JSON, snapshot_version, updated_at)
ops_log(doc_id, seq, actor_id, rewrite_version, op JSON, ts)         -- collab replay
templates(id, type, category, subcategory, family, format, meta JSON,
          preview_asset_id, render_spec JSON, rating, popularity)
dielines(id, family, spec JSON, default_params JSON, thumb, 3d_mesh_hash)
assets(id, owner_id, kind: upload|render|thumbnail|dieline|video,
       storage_key, mime, w,h,size, checksum, created_at)
jobs(id, kind: render|ai_bg|export, status: queued|running|done|failed,
     spec JSON, project_id, result_asset_ids[], attempts, heartbeat_at, ts)
share_links(id, doc_id, token, permission, expires_at)
comments(doc_id, anchor_path JSON, actor_id, body, reply_to, ts)
quotes(id, vendor_id, hash_key, rules_version, result JSON, ts)
```

**Storage choices**
- **PostgreSQL/TiDB** — relational things: users, projects, jobs, comments, quotes. TiDB where cross-DC horizontal write-scaling is needed.
- **Design docs & op-log** — TiDB/Postgres (JSONB). Snapshot + replay is the source of truth; collab CRDT state is *rebuildable* from this log, so the CRDT backend store is best-effort.
- **Assets/media** — object storage (S3/R2), CDN-fronted, lifecycle rules: `render: 30d → Glacier`, `upload/original: retained`, `thumbnail: permanent`.
- **Redis** — session, rate limit, presence, quotes cache, job broker state.
- **Elasticsearch** — catalog; **Milvus** (optional) — vector index for AI background concept search and visual-similarity template search.

---

## 7. API Design (sample)

```
POST   /v1/auth/login                       → {token}
GET    /v1/templates?type=mockup&cat=box   → paged list (CDN-cached)
GET    /v1/templates/{id}                  → template + render spec
POST   /v1/uploads/presign?kind=artwork    → {url, key}          // client uploads directly to S3

POST   /v1/projects                        → create from template
GET    /v1/projects/{id}                   → design doc snapshot
PUT    /v1/projects/{id}/doc               → commit op (or via WS)

POST   /v1/designs/{id}/render             → {jobId}             // enqueue 8K/video
GET    /v1/jobs/{id}                       → {status, progress, resultURLs}
POST   /v1/designs/{id}/export             → {jobId, format}
GET    /v1/designs/{id}/share              → {url, token}

POST   /v1/ai/background                   → {jobId}
GET    /v1/ai/background/jobs/{id}         → {status, candidates[]}

POST   /v1/quotes                          → {dieline_id, params, material, qty}
WS     /v1/ws/designs/{id}                 → ops, presence, comments
```

**Error/status convention:** job-based endpoints return `202 + {jobId}`; polls use `309?`—no—standard `200 {status:"queued|running|done|failed", progress}`.

---

## 8. Key Sequence — "Upload artwork → render 8K"

```
 Client                 API GW          Project Svc     Kafka         Render Svc       S3
    │ presigned URL        │                │              │               │           │
    ├─ POST upload ──────────── upload via presigned ───────────────────────────────────►│
    ├─ POST /designs/1/render ─► ─ snapshot doc ─▶ enqueue ─► claim job ─► path-trace ─►│
    │◄─ {jobId}                        │                │              ─── write EXR ─►│
    ├─ WS op updates / progress ◄────────── progress stream ◄─────────── heartbeat  ───┤
    │◄─ WS job.completed                    |                          (tonemap/denoise)
    ├─ GET /jobs/{id} ─▶ ────────────────{status:done, urls}───►                        │
    ├─ GET presigned render URL ─────────────────────────────────────────────────────►│
    └── download 8K PNG ◄──────────────────────────────────────────────────────────────┘
```

**Real-time preview path (client-side):** every scene mutation generates a geometry/material delta → applied to Three.js scene (no round-trip); the same mutation is enqueued as an op for collab + persistence. Preview fidelity is guaranteed because the client runs the **same WASM geometry kernel** as the dieline/folding service.

---

## 9. Scaling, Caching & Performance

1. **Stateless API tier** — auto-scale by CPU, WS connections, and Kafka consumer lag.
2. **CDN-first read path** — template listings, previews, and popular renders are static objects refreshed on publish → absorbs the bulk of catalog traffic.
3. **Redis caching layers**
   - `templates:{slug}` GeoJSON-ish template cards (long TTL, invalidate on publish).
   - `quote:{paramHash}` — pricing engine.
   - Presence/session key TTL sliding.
4. **GPU auto-scaling** — worker pool scales on render-queue depth + job latency SLO; spot/on-demand mix at off-peak; render prioritization by plan tier.
5. **Database** — read replicas for catalog/reporting; TiDB for op-log write scale; partition `ops_log` by doc or by month.
6. **Geometry/paint delta pipeline** — only changed sub-graphs re-uploaded to GPU via texture atlasing; unchanged 8K frames reuse cached EXR layers (background vs product rendered separately → composited) to cut render time ~60%.

---

## 10. Reliability & Fault Tolerance

- **Rendering & AI & export are async + idempotent.** Each job has `attempts`, a lease (heartbeat), and a dead-letter topic after retries; client reconciles via `GET /jobs/{id}`.
- **Mesh/dieline determinism** — geometry kernel is versioned; jobs pin `kernel_version` so a mid-pipeline engine upgrade can't corrupt output.
- **Object store durability** — cross-region/backup replication of user-authored content; renders are reproducible (document is the source of truth → re-render on demand), so render files are *rebuildable data*.
- **KB sizing** — non-critical fan-out (render progress, presence) drops silently under pressure; critical ops (persistence, jobs) are persistent-queue backed.
- **Disaster recovery** — RPO ≤ 5 min via DB point-in-time + object replication; RTO ≤ 1 h.

---

## 11. Security & Compliance

- **AuthN/AuthZ** — OAuth2/JWT with short-lived access + rotating refresh tokens; org-level RBAC + asset-level ACL; share links carry capability tokens (read-only by default, no brute-force-able IDs).
- **Upload sanitization** — validate MIME + magic bytes, client-side limits, AV scan, size caps per plan; serve rendered files from a separate domain (cookie isolation).
- **SSRF** — server-side fetches restricted via allowlist proxy; AI worker has no internet egress except object store.
- **Rendering/resource abuse** — per-user quota on queue depth + GPU minutes; free tier throttled.
- **AI guardrails** — prompt is template-constrained (no free-form user prompt injection surface); NSFW/watermark filter on generated backgrounds; DMCA/abuse takedown pipeline on public templates.
- **Data residency** — multi-region deployment option for enterprise (EU/US) with regional object stores.
- **PCI** — payments via PSP tokens (Stripe/Adyen), never touch card data.

---

## 12. Observability

| Signal | Tooling |
|---|---|
| Metrics | Prometheus + Grafana; custom: render queue depth, GPU utilization, job latency P50/P95/P99, WS fan-out rate, quote cache hit-rate |
| Traces | OpenTelemetry across API → Kafka → worker → S3 (job id as trace root) |
| Logs | Structured JSON → Loki/ELK; per-job correlation |
| Dashboards | Autoscale signals: render_jobs_queued, worker_heartbeat_age, es_query_latency |
| Alerts | SLO burn-rate alerts on p95 render time, 99.9% API availability, queue backlog > X min |
| Business | GA event pipeline feeding popularity/trending signals back into ES |

---

## 13. Trade-offs & Alternatives

| Decision | Alternative | Why this choice |
|---|---|---|
| Path-tracing GPU farm for finals | Photogrammetry/2.5D layered mockup renderer | True 3D (open/close, arbitrary cameras) + PBR realism; cheaper than hiring render farms per job |
| WASM geometry kernel shared client+server | Server-only fold, client sends params | Bit-identical preview ↔ render; fast UX; single source of truth |
| CRDT (Yjs/Automerge) for scene graph | OT server (ShareDB) | Concurrency + offline-safe for tree-ish structured docs; JSON ops map cleanly to scene patches |
| TiDB/Postgres + snapshot/op-log | Event-sourced event store (e.g., Kafka-only DB) | Balance of SQL ergonomics, replay capability, and ops maturity |
| Async job model for render/export/AI | Synchronous render-on-request | 8K/AI jobs are seconds-to-minutes; sync would melt the API tier |
| Diffuse gen on dedicated GPU pool | Third-party API (Stable Diffusion SaaS) | Control over privacy + cost at scale > convenience |

---

## 14. Roadmap (extensions)

- **Collaborative comments on 3D anchors** — pins bound to geometry (survive folding state changes).
- **Versioned template marketplace** — contributors upload dielines; revenue split; moderation pipeline.
- **Print-order integration** — quote → order → connect converters (already deployed in Pacdora CN) with order status webhooks.
- **Realtime co-editing on mobile/tablet** — progressive WebGL tiering, lower-poly preview.
- **Prompt-driven design** — text-to-dieline / text-to-3D prototypes behind the AI service (extend 5.5 architecture unchanged).
- **Personalization** — visual-similarity "find my box" via Milvus vectors.

---

## Appendix A — Folder/file layout suggestion (reference)

```
clients/
  web-studio/           React + Three.js + WASM kernel
  illustrator-plugin/   UXP/CEF extension
  sdk/                  embeddable editor SDK
services/
  gateway/  identity/  project/  template-catalog/  search/
  dieline-engine/       2D CAD kernel (shared WASM source)
  folding-engine/       fold tree + mesh + validation
  rendering/            CUDA path-tracer workers
  ai-background/        segmentation + diffusion workers
  collab-ws/            WebSocket broker + CRDT backend
  pricing/  export/  quotas/
infra/
  terraform/ k8s/ monitoring/ ci/
```

---

## Appendix B — Glossary

- **Dieline** — flat blueprint of cut/crease/fold lines a printer uses to build packaging.
- **FEFCO/ESBO** — European coding standard for corrugated box styles (e.g., 0201, 0427).
- **CRDT** — conflict-free replicated data type (collaborative editing).
- **PBR / GGX** — physically based rendering / a microfacet BRDF model.
- **BVH** — bounding volume hierarchy (ray-tracing acceleration).
- **Bleed** — print margin beyond the trim line to avoid white edges at cutting.
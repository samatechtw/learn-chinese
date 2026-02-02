# Adding Environment Variables (Dev + Prod)

This covers where to add a new environment variable and how to override it in dev, for Skaffold, Docker images, frontend (Vite), and API/backend.

## Where env values live

- Local Rust dev (`cargo run`): `backend/learn-api/.env` (and other backend services’ `.env` files).
- Docker image build-time args: `backend/*/Dockerfile.dev` (dev) and `backend/*/Dockerfile` (prod).
- Skaffold dev build args: `tools/skaffold.api.yaml`.
- K8s dev runtime: `tools/k8s/dev/**/**.k8s-config.yaml`
- K8s prod/CI runtime env: `tools/k8s/ci/**/**.k8s-config.yaml`
- Frontend (Vite): `web/frontend` uses `VITE_*` via `import.meta.env`; env files live in
  `web/frontend/.env.development` and `web/frontend/.env.production`.

## 1) Backend/API

1) **Local dev `.env`**
   - Add the key to `backend/learn-api/.env` (and to `backend/api-test-helper/.env` or
     `backend/db-app/.env` if those apps also need it).

2) **Dockerfiles (dev + prod)**
   - Add to:
     - `backend/learn-api/Dockerfile.dev`
     - `backend/learn-api/Dockerfile`
   - Example (place near related vars):
     ```dockerfile
     ARG MY_NEW_VAR
     ENV MY_NEW_VAR=$MY_NEW_VAR
     ```

3) **Skaffold build args (dev)**
   - Add the build arg under `learn-api.dev` in `tools/skaffold.api.yaml`.
   - Use the existing pattern if you need to override from the shell:
     ```yaml
     buildArgs:
       MY_NEW_VAR: '{{or .MY_NEW_VAR "dev"}}'
     ```

4) **K8s ConfigMaps (runtime)**
   - Dev: add the key to `tools/k8s/dev/api/api.k8s-config.yaml` or `tools/k8s/dev/shared/*.yaml`
   - Prod/CI: add to `tools/k8s/ci/api/api.k8s-config.yaml` (or shared file).
   - No change is needed in `tools/k8s/dev/api/api.k8s-deployment.yaml` unless you add a new ConfigMap.

5) **Prod/CI image build args (if needed)**
   - If the variable is required at build-time (not just runtime), add it to
     `tools/k8s/ci/build-all.sh` so the prod images receive it.

## 2) Frontend env var (Vite)

Frontend values are `VITE_*` prefixed. For a new frontend variable:

1) **Add the env value**
   - Development: `web/frontend/.env.development`
   - Production: `web/frontend/.env.production`

2) **Type definition (optional, but recommended)**
   - Add the key to `web/frontend/src/vite-env.d.ts`.

3) **Read it in code**
   - Use `import.meta.env.VITE_MY_NEW_VAR` from `web/frontend/src/...`.

Note: `web/frontend` is the Vite root for both Chinese and Vietnamese apps, so frontend
env values belong there unless a future package becomes its own Vite app.

## 3) Overriding the variable in dev

### Build-time override (Skaffold)

If the value is passed as a build arg in `tools/skaffold.api.yaml`, override it by
setting an environment variable before starting skaffold:

```bash
MY_NEW_VAR=local-override tools/scripts/skaffold-dev.sh
```

Skaffold will rebuild the image with the provided value.

### Runtime override (K8s ConfigMap)

If the value is set via ConfigMap, update the dev config and re-apply:

```bash
# edit the file first:
# tools/k8s/dev/api/api.k8s-config.yaml

kubectl apply -f tools/k8s/dev/api/api.k8s-config.yaml
kubectl rollout restart deployment/learn-api
```

Skaffold will re-apply manifests on change, but the deployment still needs a restart to get ConfigMap updates.

## 4) Verify the value is set in the dev API pod

```bash
# find the API pod
kubectl get pods -l component=learn-api

# verify env var is present
kubectl exec -it <pod-name> -- printenv MY_NEW_VAR
```

Alternative (ConfigMap view):

```bash
kubectl get configmap learn-api-config -o yaml | rg MY_NEW_VAR
```

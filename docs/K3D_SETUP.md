# k3d Local Development Setup

This project uses k3d for local Kubernetes development. k3d is a lightweight wrapper that runs k3s (Rancher Lab's minimal Kubernetes distribution) in Docker containers.

## Prerequisites

- Docker installed and running
- k3d installed (https://k3d.io)
- kubectl installed

## Quick Start

### 1. Create the development cluster

```bash
k3d cluster create learn-dev --api-port 6550 --servers 1 --agents 0
```

This creates a single-node cluster named `learn-dev`.

### 2. Verify the cluster is running

```bash
kubectl cluster-info
kubectl get nodes
```

You should see the cluster running at `https://0.0.0.0:6550` and one node in Ready state.

### 3. Run the application with Skaffold

```bash
npm run skaffold:basic
```

Skaffold will:
- Build your Docker images
- Deploy them to the k3d cluster
- Set up port forwarding for services:
  - API: http://localhost:4010
  - Test Helper: http://localhost:3001
  - PostgreSQL: localhost:5432
- Watch for file changes and automatically rebuild/redeploy

## Common k3d Commands

### Cluster Management

```bash
# List all clusters
k3d cluster list

# Stop the cluster (preserves state)
k3d cluster stop learn-dev

# Start the cluster
k3d cluster start learn-dev

# Recreate from scratch
k3d cluster delete learn-dev
k3d cluster create learn-dev --api-port 6550 --servers 1 --agents 0
```

### Viewing Cluster Resources

```bash
# Get all pods
kubectl get pods --all-namespaces

# Get services
kubectl get services

# Get deployments
kubectl get deployments

# View logs for a pod
kubectl logs <pod-name>

# Describe a pod (useful for debugging)
kubectl describe pod <pod-name>
```

## Troubleshooting

### Cluster won't start

```bash
# Check Docker is running
docker ps

# View k3d logs
k3d cluster list
docker logs k3d-learn-dev-server-0
```

### Context issues

If Skaffold can't connect to the cluster:

```bash
# Check current context
kubectl config current-context

# It should show: k3d-learn-dev

# If not, switch to it
kubectl config use-context k3d-learn-dev
```

## Production Deployment

This k3d setup is for local development only. For production, you'll deploy to a full k3s cluster. The containerized applications will work the same way - only the cluster infrastructure differs.

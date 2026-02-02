#!/bin/bash
# Wrapper script for skaffold dev that adds manual port-forward for learn-api
# This is needed because nginx uses port 4051 on the network interface,
# and skaffold incorrectly detects it as "in use" even when binding to 127.0.0.1

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TOOLS_DIR="$(dirname "$SCRIPT_DIR")"

# PIDs to track for cleanup
SKAFFOLD_PID=""
PORT_FORWARD_PID=""

cleanup() {
    echo ""
    echo "Shutting down..."

    # Kill port-forward first
    if [ -n "$PORT_FORWARD_PID" ] && kill -0 "$PORT_FORWARD_PID" 2>/dev/null; then
        kill "$PORT_FORWARD_PID" 2>/dev/null || true
    fi

    # Kill skaffold
    if [ -n "$SKAFFOLD_PID" ] && kill -0 "$SKAFFOLD_PID" 2>/dev/null; then
        kill "$SKAFFOLD_PID" 2>/dev/null || true
        wait "$SKAFFOLD_PID" 2>/dev/null || true
    fi

    exit 0
}

trap cleanup SIGINT SIGTERM

# Start skaffold in background
echo "Starting skaffold..."
echo "Applying dev secrets from env..."
kubectl create secret generic learn-api-secrets \
    --from-literal=AZURE_TTS_SUBSCRIPTION_KEY="${AZURE_TTS_SUBSCRIPTION_KEY:-dev}" \
    --from-literal=AZURE_TTS_REGION="${AZURE_TTS_REGION:-dev}" \
    --from-literal=S3_URL="${S3_URL:-dev}" \
    --from-literal=S3_ACCESS_KEY_ID="${S3_ACCESS_KEY_ID:-dev}" \
    --from-literal=S3_SECRET_ACCESS_KEY="${S3_SECRET_ACCESS_KEY:-dev}" \
    --dry-run=client -o yaml | kubectl apply -f - >/dev/null

skaffold dev -f "$TOOLS_DIR/skaffold.basic.yaml" --cache-artifacts=true &
SKAFFOLD_PID=$!

# Wait for learn-api service to be ready
echo "Waiting for learn-api service..."
for i in {1..60}; do
    if kubectl get service learn-api &>/dev/null; then
        # Check if endpoints are ready
        ENDPOINTS=$(kubectl get endpoints learn-api -o jsonpath='{.subsets[*].addresses[*].ip}' 2>/dev/null)
        if [ -n "$ENDPOINTS" ]; then
            echo "learn-api service is ready"
            break
        fi
    fi

    # Check if skaffold died
    if ! kill -0 "$SKAFFOLD_PID" 2>/dev/null; then
        echo "Skaffold exited unexpectedly"
        exit 1
    fi

    sleep 2
done

# Small delay to let skaffold's port-forwards initialize
sleep 2

# Start manual port-forward for learn-api on 127.0.0.1:4051
echo "Starting port-forward for learn-api on 127.0.0.1:4051..."
kubectl port-forward --address 127.0.0.1 service/learn-api 4051:4051 &
PORT_FORWARD_PID=$!

echo ""
echo "=== Services available ==="
echo "learn-api:       http://127.0.0.1:4051"
echo "api-test-helper: http://127.0.0.1:4052"
echo "=========================="
echo ""

# Wait for skaffold (this keeps the script running and responsive to ctrl-c)
wait "$SKAFFOLD_PID"
